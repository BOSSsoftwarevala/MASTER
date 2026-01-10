-- Security Sessions table for tracking user sessions
CREATE TABLE IF NOT EXISTS public.security_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  device_fingerprint TEXT,
  ip_address INET,
  user_agent TEXT,
  geo_location JSONB,
  is_active BOOLEAN DEFAULT true,
  is_trusted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  terminated_at TIMESTAMPTZ,
  terminated_by UUID,
  termination_reason TEXT
);

-- Device Trust table for tracking trusted devices
CREATE TABLE IF NOT EXISTS public.device_trust (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  is_trusted BOOLEAN DEFAULT false,
  trust_level TEXT DEFAULT 'low',
  first_seen_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  blocked_at TIMESTAMPTZ,
  blocked_by UUID,
  block_reason TEXT,
  is_deleted BOOLEAN DEFAULT false,
  UNIQUE(user_id, device_fingerprint)
);

-- Threat Events table for tracking security threats
CREATE TABLE IF NOT EXISTS public.threat_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  source_ip INET,
  target_user_id UUID,
  target_resource TEXT,
  description TEXT,
  metadata JSONB,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  resolution_notes TEXT,
  auto_action_taken TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Security Logs for tracking AI behavior
CREATE TABLE IF NOT EXISTS public.ai_security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_service_id UUID REFERENCES public.ai_services(id),
  event_type TEXT NOT NULL,
  action_attempted TEXT,
  action_allowed BOOLEAN DEFAULT false,
  scope_requested TEXT,
  scope_granted TEXT,
  risk_level TEXT DEFAULT 'low',
  blocked_reason TEXT,
  user_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- API Security Logs for tracking API security events
CREATE TABLE IF NOT EXISTS public.api_security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.api_providers(id),
  event_type TEXT NOT NULL,
  endpoint TEXT,
  method TEXT,
  status_code INTEGER,
  is_blocked BOOLEAN DEFAULT false,
  block_reason TEXT,
  rate_limit_exceeded BOOLEAN DEFAULT false,
  source_ip INET,
  user_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- System Freeze table for emergency controls
CREATE TABLE IF NOT EXISTS public.system_freeze (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freeze_type TEXT NOT NULL,
  scope TEXT DEFAULT 'full',
  modules_affected TEXT[],
  reason TEXT NOT NULL,
  initiated_by UUID NOT NULL,
  initiated_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  resumed_at TIMESTAMPTZ,
  resumed_by UUID,
  resume_reason TEXT
);

-- IP Blocklist table
CREATE TABLE IF NOT EXISTS public.ip_blocklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL,
  ip_range CIDR,
  reason TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  is_permanent BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  blocked_by UUID NOT NULL,
  blocked_at TIMESTAMPTZ DEFAULT now(),
  unblocked_at TIMESTAMPTZ,
  unblocked_by UUID,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on all tables
ALTER TABLE public.security_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_trust ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_freeze ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_blocklist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Super Admin access only
CREATE POLICY "Super admins can manage security_sessions" ON public.security_sessions
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage device_trust" ON public.device_trust
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage threat_events" ON public.threat_events
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage ai_security_logs" ON public.ai_security_logs
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage api_security_logs" ON public.api_security_logs
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage system_freeze" ON public.system_freeze
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage ip_blocklist" ON public.ip_blocklist
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));

-- Insert sample threat events for testing
INSERT INTO public.threat_events (event_type, severity, source_ip, description, metadata) VALUES
  ('brute_force_attempt', 'high', '192.168.1.100', 'Multiple failed login attempts detected', '{"attempts": 15, "timeframe": "5 minutes"}'),
  ('suspicious_api_usage', 'medium', '10.0.0.50', 'Unusual API request pattern detected', '{"endpoint": "/api/users", "requests": 500}'),
  ('geo_anomaly', 'low', '45.33.32.156', 'Login from unexpected location', '{"country": "Unknown", "previous": "India"}');

-- Insert sample IP blocklist entries
INSERT INTO public.ip_blocklist (ip_address, reason, severity, blocked_by, is_permanent) VALUES
  ('192.168.1.100', 'Brute force attack', 'high', '00000000-0000-0000-0000-000000000000', false),
  ('10.0.0.50', 'API abuse', 'medium', '00000000-0000-0000-0000-000000000000', false);