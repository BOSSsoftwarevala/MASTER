import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60000;

// Security: Block dangerous characters
const DANGEROUS_CHARS = /[<>{};"']/;

function trimInput(value: string): string {
  return value.trim();
}

function hasDangerousChars(value: string): boolean {
  return DANGEROUS_CHARS.test(value);
}

function validateServerName(name: string): { valid: boolean; error?: string } {
  const trimmed = trimInput(name);
  if (trimmed.length < 3) return { valid: false, error: 'Server name required (min 3 chars)' };
  if (trimmed.length > 100) return { valid: false, error: 'Server name too long' };
  if (hasDangerousChars(trimmed)) return { valid: false, error: 'Invalid characters in server name' };
  if (!/^[a-zA-Z0-9\-]+$/.test(trimmed)) return { valid: false, error: 'Only letters, numbers, and hyphens allowed' };
  return { valid: true };
}

function validateUsername(username: string): { valid: boolean; error?: string } {
  const trimmed = trimInput(username);
  if (!trimmed) return { valid: false, error: 'User ID required' };
  if (trimmed.length > 50) return { valid: false, error: 'User ID too long' };
  if (hasDangerousChars(trimmed)) return { valid: false, error: 'Invalid characters in User ID' };
  return { valid: true };
}

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length === 0) return { valid: false, error: 'Password required' };
  if (password.length > 200) return { valid: false, error: 'Password too long' };
  return { valid: true };
}

// Secure password hashing
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.slice(0, 16) || 'default-salt';
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function checkRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return { allowed: true };
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((userLimit.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  userLimit.count++;
  return { allowed: true };
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (payload: unknown, status = 200) =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  // Only POST allowed
  if (req.method !== "POST") {
    return json({ status: "error", message: "Method not allowed" });
  }

  try {
    // CSRF validation
    const csrf = req.headers.get('x-csrf-token') || '';
    if (csrf.length < 16) {
      return json({ status: "error", message: "Security check failed" });
    }

    // Auth required
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ status: "error", message: "Authentication required" });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return json({ status: "error", message: "Session expired" });
    }

    // Role check (admin/super_admin only)
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'super_admin']);

    if (!roles || roles.length === 0) {
      return json({ status: "error", message: "Access denied" });
    }

    // Rate limiting
    const rateCheck = checkRateLimit(user.id);
    if (!rateCheck.allowed) {
      return json({ status: "error", message: `Too many requests. Wait ${rateCheck.retryAfter}s` });
    }

    // Parse body - API CONTRACT: server_name, username, password ONLY
    const body = await req.json();
    const server_name = body?.server_name;
    const username = body?.username;
    const password = body?.password;

    // Validate all fields
    const nameCheck = validateServerName(server_name || '');
    if (!nameCheck.valid) return json({ status: "error", message: nameCheck.error });

    const userCheck = validateUsername(username || '');
    if (!userCheck.valid) return json({ status: "error", message: userCheck.error });

    const passCheck = validatePassword(password || '');
    if (!passCheck.valid) return json({ status: "error", message: passCheck.error });

    const serverNameTrimmed = trimInput(String(server_name));
    const usernameTrimmed = trimInput(String(username));

    // Check duplicates
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: existing } = await adminClient
      .from('servers')
      .select('id')
      .eq('name', serverNameTrimmed)
      .eq('is_deleted', false)
      .maybeSingle();

    if (existing) {
      return json({ status: "error", message: "Server name already exists" });
    }

    // Hash password (NEVER store plain text)
    const hashedPassword = await hashPassword(password);

    // Get client IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || '0.0.0.0';

    // Insert server with status 'maintenance' (Pending)
    const { data: newServer, error: insertError } = await adminClient
      .from('servers')
      .insert({
        name: serverNameTrimmed,
        provider: 'own',
        owner_type: 'own',
        server_type: 'vps',
        status: 'maintenance', // Pending status
        login_user_id: usernameTrimmed,
        login_password_hash: hashedPassword,
        added_by_user_id: user.id,
        added_by_email: user.email,
        added_from_ip: clientIp,
        is_deleted: false,
      })
      .select('id')
      .single();

    if (insertError || !newServer) {
      console.error('Insert error:', insertError?.message);
      return json({ status: "error", message: "Failed to add server" });
    }

    // Audit log (NO credentials logged)
    await adminClient
      .from('server_audit_logs')
      .insert({
        server_id: newServer.id,
        action: 'server_added',
        performed_by: user.id,
        performed_by_email: user.email,
        ip_address: clientIp,
        metadata: { server_name: serverNameTrimmed, username: usernameTrimmed },
      });

    // SUCCESS RESPONSE per API contract
    return json({ status: "ok", server_id: newServer.id });

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown');
    return json({ status: "error", message: "Failed to add server" });
  }
});
