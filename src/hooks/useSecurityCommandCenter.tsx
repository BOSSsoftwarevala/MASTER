import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface LoginAnalytics {
  id: string;
  user_id: string | null;
  user_email: string | null;
  ip_address: string;
  country_code: string | null;
  country_name: string | null;
  city: string | null;
  isp: string | null;
  device_fingerprint: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  login_status: string;
  failure_reason: string | null;
  session_id: string | null;
  is_suspicious: boolean;
  suspicion_reason: string | null;
  auto_blocked: boolean;
  created_at: string;
}

export interface CountryBlock {
  id: string;
  country_code: string;
  country_name: string;
  block_type: string;
  expires_at: string | null;
  reason: string;
  blocked_by: string;
  blocked_at: string;
  unblocked_at: string | null;
  unblocked_by: string | null;
  is_active: boolean;
}

export interface DownloadTracking {
  id: string;
  user_id: string | null;
  user_email: string | null;
  file_name: string;
  file_path: string | null;
  file_size_bytes: number | null;
  file_type: string | null;
  download_source: string | null;
  ip_address: string | null;
  is_bulk_download: boolean;
  is_blocked: boolean;
  block_reason: string | null;
  risk_level: string;
  created_at: string;
}

export interface PortMonitoring {
  id: string;
  server_id: string | null;
  port_number: number;
  protocol: string;
  service_name: string | null;
  is_open: boolean;
  is_allowed: boolean;
  traffic_bytes_in: number;
  traffic_bytes_out: number;
  last_activity_at: string;
  blocked_at: string | null;
  blocked_by: string | null;
  block_reason: string | null;
  is_anomalous: boolean;
  anomaly_reason: string | null;
  created_at: string;
}

export interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  description: string | null;
  source: string | null;
  source_ip: string | null;
  target_user_id: string | null;
  target_resource: string | null;
  ai_suggestion: string | null;
  ai_confidence: number | null;
  status: string;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  resolution_notes: string | null;
  auto_action_taken: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// Login Analytics Hooks
export function useLoginAnalytics(period: '24h' | '7d' | '30d' = '24h') {
  const hours = period === '24h' ? 24 : period === '7d' ? 168 : 720;
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  return useQuery({
    queryKey: ['login_analytics', period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('login_analytics')
        .select('*')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;
      return data as LoginAnalytics[];
    },
  });
}

export function useLoginStats(period: '24h' | '7d' | '30d' = '24h') {
  const { data: logins = [] } = useLoginAnalytics(period);

  const totalLogins = logins.length;
  const successfulLogins = logins.filter(l => l.login_status === 'success').length;
  const failedLogins = logins.filter(l => l.login_status === 'failed').length;
  const suspiciousLogins = logins.filter(l => l.is_suspicious).length;
  const blockedLogins = logins.filter(l => l.auto_blocked).length;

  // Country breakdown
  const byCountry = logins.reduce((acc, login) => {
    const country = login.country_name || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // City breakdown
  const byCity = logins.reduce((acc, login) => {
    const city = login.city || 'Unknown';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalLogins,
    successfulLogins,
    failedLogins,
    suspiciousLogins,
    blockedLogins,
    byCountry,
    byCity,
    raw: logins,
  };
}

// Country Blocklist Hooks
export function useCountryBlocklist() {
  return useQuery({
    queryKey: ['country_blocklist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('country_blocklist')
        .select('*')
        .eq('is_active', true)
        .order('blocked_at', { ascending: false });

      if (error) throw error;
      return data as CountryBlock[];
    },
  });
}

export function useBlockCountry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (block: {
      country_code: string;
      country_name: string;
      reason: string;
      blocked_by: string;
      block_type?: string;
      expires_at?: string;
    }) => {
      const { error } = await supabase
        .from('country_blocklist')
        .insert([{ ...block, is_active: true }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['country_blocklist'] });
      toast.success('Country blocked successfully');
    },
    onError: () => {
      toast.error('Failed to block country');
    },
  });
}

export function useUnblockCountry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blockId, unblocked_by }: { blockId: string; unblocked_by: string }) => {
      const { error } = await supabase
        .from('country_blocklist')
        .update({
          is_active: false,
          unblocked_at: new Date().toISOString(),
          unblocked_by,
        })
        .eq('id', blockId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['country_blocklist'] });
      toast.success('Country unblocked successfully');
    },
    onError: () => {
      toast.error('Failed to unblock country');
    },
  });
}

// Download Tracking Hooks
export function useDownloadTracking() {
  return useQuery({
    queryKey: ['download_tracking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('download_tracking')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      return data as DownloadTracking[];
    },
  });
}

export function useDownloadStats() {
  const { data: downloads = [] } = useDownloadTracking();

  const totalDownloads = downloads.length;
  const bulkDownloads = downloads.filter(d => d.is_bulk_download).length;
  const blockedDownloads = downloads.filter(d => d.is_blocked).length;
  const highRiskDownloads = downloads.filter(d => d.risk_level === 'high').length;
  const totalBytes = downloads.reduce((sum, d) => sum + (d.file_size_bytes || 0), 0);

  return {
    totalDownloads,
    bulkDownloads,
    blockedDownloads,
    highRiskDownloads,
    totalBytes,
    raw: downloads,
  };
}

// Port Monitoring Hooks
export function usePortMonitoring(serverId?: string) {
  return useQuery({
    queryKey: ['port_monitoring', serverId],
    queryFn: async () => {
      let query = supabase
        .from('port_monitoring')
        .select('*')
        .order('port_number', { ascending: true });

      if (serverId) {
        query = query.eq('server_id', serverId);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      return data as PortMonitoring[];
    },
  });
}

export function useBlockPort() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ portId, blocked_by, reason }: { portId: string; blocked_by: string; reason: string }) => {
      const { error } = await supabase
        .from('port_monitoring')
        .update({
          is_allowed: false,
          blocked_at: new Date().toISOString(),
          blocked_by,
          block_reason: reason,
        })
        .eq('id', portId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['port_monitoring'] });
      toast.success('Port blocked successfully');
    },
    onError: () => {
      toast.error('Failed to block port');
    },
  });
}

// Security Alerts Hooks
export function useSecurityAlerts(status?: string) {
  return useQuery({
    queryKey: ['security_alerts', status],
    queryFn: async () => {
      let query = supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      return data as SecurityAlert[];
    },
  });
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ alertId, acknowledged_by }: { alertId: string; acknowledged_by: string }) => {
      const { error } = await supabase
        .from('security_alerts')
        .update({
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString(),
          acknowledged_by,
        })
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security_alerts'] });
      toast.success('Alert acknowledged');
    },
    onError: () => {
      toast.error('Failed to acknowledge alert');
    },
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ alertId, resolved_by, notes }: { alertId: string; resolved_by: string; notes?: string }) => {
      const { error } = await supabase
        .from('security_alerts')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by,
          resolution_notes: notes,
        })
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security_alerts'] });
      toast.success('Alert resolved');
    },
    onError: () => {
      toast.error('Failed to resolve alert');
    },
  });
}

// Combined Security Dashboard Stats
export function useSecurityDashboardStats() {
  const { data: alerts = [] } = useSecurityAlerts();
  const loginStats = useLoginStats('24h');
  const downloadStats = useDownloadStats();
  const { data: blockedCountries = [] } = useCountryBlocklist();
  const { data: ports = [] } = usePortMonitoring();

  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const highAlerts = alerts.filter(a => a.severity === 'high' && a.status === 'active').length;
  const anomalousPorts = ports.filter(p => p.is_anomalous).length;
  const blockedPorts = ports.filter(p => !p.is_allowed).length;

  return {
    activeAlerts,
    criticalAlerts,
    highAlerts,
    loginStats,
    downloadStats,
    blockedCountries: blockedCountries.length,
    anomalousPorts,
    blockedPorts,
    alerts,
    ports,
  };
}

// Combined hook for convenience
export function useSecurityCommandCenter() {
  const loginStats = useLoginStats('24h');
  const downloadStats = useDownloadStats();
  const { data: alerts = [], isLoading: alertsLoading } = useSecurityAlerts();
  const { data: blockedCountries = [], isLoading: countriesLoading } = useCountryBlocklist();
  const { data: ports = [], isLoading: portsLoading } = usePortMonitoring();
  const { data: logins = [], isLoading: loginsLoading } = useLoginAnalytics('24h');
  
  const blockCountry = useBlockCountry();
  const unblockCountry = useUnblockCountry();
  const blockPort = useBlockPort();
  const acknowledgeAlert = useAcknowledgeAlert();
  const resolveAlert = useResolveAlert();

  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const highAlerts = alerts.filter(a => a.severity === 'high' && a.status === 'active').length;
  const anomalousPorts = ports.filter(p => p.is_anomalous).length;
  const blockedPorts = ports.filter(p => !p.is_allowed).length;

  return {
    // Stats
    activeAlerts,
    criticalAlerts,
    highAlerts,
    anomalousPorts,
    blockedPorts,
    blockedCountriesCount: blockedCountries.length,
    
    // Data
    alerts,
    ports,
    blockedCountries,
    logins,
    loginStats,
    downloadStats,
    
    // Loading states
    isLoading: alertsLoading || countriesLoading || portsLoading || loginsLoading,
    
    // Actions
    blockCountry,
    unblockCountry,
    blockPort,
    acknowledgeAlert,
    resolveAlert,
  };
}
