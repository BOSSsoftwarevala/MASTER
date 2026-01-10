import { supabase } from '@/integrations/supabase/client';

// AI Response Standard
export interface AIResponse {
  status: 'success' | 'warning' | 'blocked';
  message: string;
  ai_action_taken: boolean;
  next_suggestion: string | null;
  data?: any;
}

// AI Gate Result
export interface AIGateResult {
  risk_level: 'low' | 'medium' | 'high';
  decision: 'allow' | 'block';
  reason: string;
}

// API Base URL
const API_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-server-api`;

// Helper to make API calls
async function callAI(endpoint: string, body: Record<string, any> = {}): Promise<AIResponse> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      return {
        status: 'blocked',
        message: error.message || `HTTP ${response.status}`,
        ai_action_taken: false,
        next_suggestion: 'Try again or contact support',
      };
    }

    return await response.json();
  } catch (error) {
    console.error('AI API Error:', error);
    return {
      status: 'blocked',
      message: error instanceof Error ? error.message : 'Network error',
      ai_action_taken: false,
      next_suggestion: 'Check your connection and try again',
    };
  }
}

// ============ AI GATE ============
export const aiGate = {
  check: (actionType: string, serverId?: string, userRole = 'user', context = {}) =>
    callAI('/ai/gate/check', { action_type: actionType, server_id: serverId, user_role: userRole, context }),
};

// ============ MONITORING ============
export const aiMonitor = {
  health: (serverId: string, userRole = 'user') =>
    callAI('/ai/monitor/health', { server_id: serverId, user_role: userRole }),
  
  anomaly: (serverId: string, userRole = 'user') =>
    callAI('/ai/monitor/anomaly', { server_id: serverId, user_role: userRole }),
};

// ============ SECURITY ============
export const aiSecurity = {
  scan: (serverId: string, userRole = 'user') =>
    callAI('/ai/security/scan', { server_id: serverId, user_role: userRole }),
  
  loginAnalysis: (serverId: string, userRole = 'user') =>
    callAI('/ai/security/login-analysis', { server_id: serverId, user_role: userRole }),
  
  block: (options: { serverId?: string; ip?: string; country?: string; userRole?: string }) =>
    callAI('/ai/security/block', { 
      server_id: options.serverId, 
      ip: options.ip, 
      country: options.country, 
      user_role: options.userRole || 'user' 
    }),
};

// ============ DEBUG & AUTO-FIX ============
export const aiDebug = {
  analyze: (serverId: string, userRole = 'user') =>
    callAI('/ai/debug/analyze', { server_id: serverId, user_role: userRole }),
  
  fix: (serverId: string, fixType = 'auto', userRole = 'user') =>
    callAI('/ai/debug/fix', { server_id: serverId, fix_type: fixType, user_role: userRole }),
};

// ============ SERVER ACTIONS ============
export const aiAction = {
  restart: (serverId: string, userRole = 'user') =>
    callAI('/ai/action/restart', { server_id: serverId, user_role: userRole }),
  
  kill: (serverId: string, userRole = 'admin') =>
    callAI('/ai/action/kill', { server_id: serverId, user_role: userRole }),
  
  recheck: (serverId: string, userRole = 'user') =>
    callAI('/ai/action/recheck', { server_id: serverId, user_role: userRole }),
};

// ============ SSL & COMPLIANCE ============
export const aiCompliance = {
  sslCheck: (serverId: string, userRole = 'user') =>
    callAI('/ai/compliance/ssl-check', { server_id: serverId, user_role: userRole }),
  
  audit: (serverId: string, userRole = 'user') =>
    callAI('/ai/compliance/audit', { server_id: serverId, user_role: userRole }),
};

// ============ COST OPTIMIZATION ============
export const aiCost = {
  analyze: (serverId?: string, userRole = 'user') =>
    callAI('/ai/cost/analyze', { server_id: serverId, user_role: userRole }),
  
  recommend: (serverId?: string, userRole = 'user') =>
    callAI('/ai/cost/recommend', { server_id: serverId, user_role: userRole }),
};

// ============ INCIDENT & PREDICTION ============
export const aiPredict = {
  failure: (serverId: string, userRole = 'user') =>
    callAI('/ai/predict/failure', { server_id: serverId, user_role: userRole }),
};

export const aiIncident = {
  recover: (serverId: string, userRole = 'user') =>
    callAI('/ai/incident/recover', { server_id: serverId, user_role: userRole }),
};

// ============ COMBINED API EXPORT ============
export const aiServerApi = {
  gate: aiGate,
  monitor: aiMonitor,
  security: aiSecurity,
  debug: aiDebug,
  action: aiAction,
  compliance: aiCompliance,
  cost: aiCost,
  predict: aiPredict,
  incident: aiIncident,
};

export default aiServerApi;
