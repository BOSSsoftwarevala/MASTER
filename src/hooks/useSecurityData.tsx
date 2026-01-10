import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSystemFreezeStatus as useBossSystemFreezeStatus } from './useBossData';

// Types for security data
export interface SecuritySession {
  id: string;
  user_id: string | null;
  session_token: string;
  device_fingerprint: string | null;
  ip_address: string | null;
  user_agent: string | null;
  geo_location: Record<string, unknown> | null;
  is_active: boolean;
  is_trusted: boolean;
  created_at: string;
  last_activity_at: string;
  expires_at: string | null;
  terminated_at: string | null;
  terminated_by: string | null;
  termination_reason: string | null;
}

export interface DeviceTrust {
  id: string;
  user_id: string;
  device_fingerprint: string;
  device_name: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  is_trusted: boolean;
  trust_level: string;
  first_seen_at: string;
  last_seen_at: string;
  approved_at: string | null;
  approved_by: string | null;
  blocked_at: string | null;
  blocked_by: string | null;
  block_reason: string | null;
  is_deleted: boolean;
}

export interface ThreatEvent {
  id: string;
  event_type: string;
  severity: string;
  source_ip: string | null;
  target_user_id: string | null;
  target_resource: string | null;
  description: string | null;
  metadata: Record<string, unknown> | null;
  is_resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  resolution_notes: string | null;
  auto_action_taken: string | null;
  created_at: string;
}

export interface AISecurityLog {
  id: string;
  ai_service_id: string | null;
  event_type: string;
  action_attempted: string | null;
  action_allowed: boolean;
  scope_requested: string | null;
  scope_granted: string | null;
  risk_level: string;
  blocked_reason: string | null;
  user_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface APISecurityLog {
  id: string;
  provider_id: string | null;
  event_type: string;
  endpoint: string | null;
  method: string | null;
  status_code: number | null;
  is_blocked: boolean;
  block_reason: string | null;
  rate_limit_exceeded: boolean;
  source_ip: string | null;
  user_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface SystemFreeze {
  id: string;
  freeze_type: string;
  module_id: string | null;
  reason: string;
  frozen_by: string;
  frozen_at: string;
  is_active: boolean;
  resumed_at: string | null;
  resumed_by: string | null;
  duration_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface IPBlocklist {
  id: string;
  ip_address: string;
  ip_range: string | null;
  reason: string;
  severity: string;
  is_permanent: boolean;
  expires_at: string | null;
  blocked_by: string;
  blocked_at: string;
  unblocked_at: string | null;
  unblocked_by: string | null;
  is_active: boolean;
}

// Security Sessions
export function useSecuritySessions() {
  return useQuery({
    queryKey: ['security_sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_sessions')
        .select('*')
        .eq('is_active', true)
        .order('last_activity_at', { ascending: false });

      if (error) throw error;
      return data as SecuritySession[];
    },
  });
}

export function useTerminateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, reason }: { sessionId: string; reason: string }) => {
      const { error } = await supabase
        .from('security_sessions')
        .update({
          is_active: false,
          terminated_at: new Date().toISOString(),
          termination_reason: reason,
        })
        .eq('id', sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security_sessions'] });
      toast.success('Session terminated successfully');
    },
    onError: () => {
      toast.error('Failed to terminate session');
    },
  });
}

// Device Trust
export function useDeviceTrust() {
  return useQuery({
    queryKey: ['device_trust'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('device_trust')
        .select('*')
        .eq('is_deleted', false)
        .order('last_seen_at', { ascending: false });

      if (error) throw error;
      return data as DeviceTrust[];
    },
  });
}

export function useBlockDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deviceId, reason }: { deviceId: string; reason: string }) => {
      const { error } = await supabase
        .from('device_trust')
        .update({
          is_trusted: false,
          blocked_at: new Date().toISOString(),
          block_reason: reason,
        })
        .eq('id', deviceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device_trust'] });
      toast.success('Device blocked successfully');
    },
    onError: () => {
      toast.error('Failed to block device');
    },
  });
}

// Threat Events
export function useThreatEvents() {
  return useQuery({
    queryKey: ['threat_events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('threat_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as ThreatEvent[];
    },
  });
}

export function useResolveThreat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ threatId, notes }: { threatId: string; notes: string }) => {
      const { error } = await supabase
        .from('threat_events')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolution_notes: notes,
        })
        .eq('id', threatId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threat_events'] });
      toast.success('Threat resolved successfully');
    },
    onError: () => {
      toast.error('Failed to resolve threat');
    },
  });
}

// AI Security Logs
export function useAISecurityLogs() {
  return useQuery({
    queryKey: ['ai_security_logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as AISecurityLog[];
    },
  });
}

// API Security Logs
export function useAPISecurityLogs() {
  return useQuery({
    queryKey: ['api_security_logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as APISecurityLog[];
    },
  });
}

// System Freeze - Using existing hooks from useBossData instead of duplicating
// The system_freeze table already exists with a different schema
// Export re-exports from useBossData for consistency
export { useSystemFreezeStatus, useFreezeHistory, useCreateSystemFreeze, useResumeSystemFreeze } from './useBossData';

// IP Blocklist
export function useIPBlocklist() {
  return useQuery({
    queryKey: ['ip_blocklist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ip_blocklist')
        .select('*')
        .eq('is_active', true)
        .order('blocked_at', { ascending: false });

      if (error) throw error;
      return data as IPBlocklist[];
    },
  });
}

export function useBlockIP() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (block: {
      ip_address: string;
      reason: string;
      severity: string;
      blocked_by: string;
      is_permanent?: boolean;
      expires_at?: string;
    }) => {
      const { error } = await supabase
        .from('ip_blocklist')
        .insert([{ ...block, is_active: true }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ip_blocklist'] });
      toast.success('IP blocked successfully');
    },
    onError: () => {
      toast.error('Failed to block IP');
    },
  });
}

export function useUnblockIP() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blockId, unblocked_by }: { blockId: string; unblocked_by: string }) => {
      const { error } = await supabase
        .from('ip_blocklist')
        .update({
          is_active: false,
          unblocked_at: new Date().toISOString(),
          unblocked_by,
        })
        .eq('id', blockId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ip_blocklist'] });
      toast.success('IP unblocked successfully');
    },
    onError: () => {
      toast.error('Failed to unblock IP');
    },
  });
}

// Security Stats (combined for dashboard)
export function useSecurityStats() {
  const { data: threats } = useThreatEvents();
  const { data: sessions } = useSecuritySessions();
  const { data: blockedIPs } = useIPBlocklist();
  const { data: freezes } = useBossSystemFreezeStatus();

  const unresolvedThreats = threats?.filter(t => !t.is_resolved).length ?? 0;
  const highSeverityThreats = threats?.filter(t => t.severity === 'high' && !t.is_resolved).length ?? 0;
  const activeSessions = sessions?.length ?? 0;
  const blockedIPCount = blockedIPs?.length ?? 0;
  const isSystemFrozen = (freezes?.length ?? 0) > 0;

  return {
    unresolvedThreats,
    highSeverityThreats,
    activeSessions,
    blockedIPCount,
    isSystemFrozen,
    activeFreeze: freezes?.[0] ?? null,
  };
}
