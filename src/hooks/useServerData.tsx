import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Real-time subscription hook for server data
export const useServerRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('server-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'servers' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['servers'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'server_incidents' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['server_incidents'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'scaling_events' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['scaling_events'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'server_activity_logs' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['server_activity_logs'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'server_alerts' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['server_alerts'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'server_access_controls' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['server_access_controls'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};

// Server Alerts Types & Hooks
export interface ServerAlert {
  id: string;
  server_id: string | null;
  alert_type: string;
  severity: string;
  title: string;
  description: string | null;
  status: string;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  acknowledged_by_name: string | null;
  snoozed_until: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  resolved_by_name: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean | null;
  servers?: Server;
}

export const useServerAlerts = () => {
  return useQuery({
    queryKey: ['server_alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('server_alerts')
        .select('*, servers(*)')
        .eq('is_deleted', false)
        .neq('status', 'resolved')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ServerAlert[];
    },
  });
};

export const useUpdateServerAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ServerAlert> & { id: string }) => {
      const { error } = await supabase
        .from('server_alerts')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server_alerts'] });
      toast.success('Alert updated');
    },
    onError: (error) => {
      toast.error('Failed to update alert: ' + error.message);
    },
  });
};

// Server Access Controls Types & Hooks
export interface ServerAccessControl {
  id: string;
  server_id: string | null;
  name: string;
  allowed_ip: string | null;
  ip_range: string | null;
  access_type: string;
  port: number | null;
  is_enabled: boolean | null;
  expires_at: string | null;
  created_by: string | null;
  created_by_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean | null;
  servers?: Server;
}

export const useServerAccessControls = () => {
  return useQuery({
    queryKey: ['server_access_controls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('server_access_controls')
        .select('*, servers(*)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ServerAccessControl[];
    },
  });
};

export const useCreateServerAccessControl = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (control: { name: string; server_id: string } & Partial<Omit<ServerAccessControl, 'name' | 'server_id'>>) => {
      const { error } = await supabase
        .from('server_access_controls')
        .insert([control]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server_access_controls'] });
      toast.success('Access control created');
    },
    onError: (error) => {
      toast.error('Failed to create access control: ' + error.message);
    },
  });
};

export const useUpdateServerAccessControl = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ServerAccessControl> & { id: string }) => {
      const { error } = await supabase
        .from('server_access_controls')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server_access_controls'] });
      toast.success('Access control updated');
    },
    onError: (error) => {
      toast.error('Failed to update access control: ' + error.message);
    },
  });
};

export const useDeleteServerAccessControl = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('server_access_controls')
        .update({ is_deleted: true })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server_access_controls'] });
      toast.success('Access control deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete access control: ' + error.message);
    },
  });
};

// Types
export interface Server {
  id: string;
  name: string;
  owner_type: 'own' | 'client';
  server_type: 'cloud' | 'dedicated' | 'vps';
  provider: string;
  cpu_spec: string | null;
  ram_spec: string | null;
  disk_spec: string | null;
  current_cpu_load: number | null;
  current_ram_load: number | null;
  current_disk_usage: number | null;
  status: 'running' | 'warning' | 'down' | 'maintenance';
  auto_scale_enabled: boolean | null;
  monthly_cost: number | null;
  ip_address: string | null;
  region: string | null;
  client_name: string | null;
  client_sla: string | null;
  is_management_active: boolean | null;
  expires_at: string | null;
  last_health_check: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean | null;
}

export interface AutoScalingPolicy {
  id: string;
  server_id: string | null;
  metric: 'cpu' | 'memory' | 'requests' | 'connections';
  scale_up_threshold: number;
  scale_down_threshold: number;
  cooldown_seconds: number;
  min_instances: number;
  max_instances: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean | null;
  servers?: Server;
}

export interface ScalingEvent {
  id: string;
  server_id: string | null;
  policy_id: string | null;
  action: string;
  from_instances: number | null;
  to_instances: number | null;
  trigger_value: number | null;
  trigger_metric: 'cpu' | 'memory' | 'requests' | 'connections' | null;
  created_at: string;
  servers?: Server;
}

export interface ServerIncident {
  id: string;
  server_id: string | null;
  title: string;
  description: string | null;
  incident_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'monitoring' | 'resolved' | 'escalated';
  root_cause: string | null;
  affected_services: string[] | null;
  started_at: string;
  resolved_at: string | null;
  recovery_time_minutes: number | null;
  reported_by: string | null;
  assigned_to: string | null;
  escalated_to: string | null;
  resolution: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean | null;
  servers?: Server;
}

export interface ServerActivityLog {
  id: string;
  server_id: string | null;
  action: string;
  requested_by: string | null;
  requested_by_name: string | null;
  approval_status: string | null;
  approved_by: string | null;
  approved_by_name: string | null;
  details: string | null;
  created_at: string;
  servers?: Server;
}

// Servers Hooks
export const useServers = () => {
  return useQuery({
    queryKey: ['servers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .eq('is_deleted', false)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Server[];
    },
  });
};

export const useOwnServers = () => {
  return useQuery({
    queryKey: ['servers', 'own'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .eq('owner_type', 'own')
        .eq('is_deleted', false)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Server[];
    },
  });
};

export const useClientServers = () => {
  return useQuery({
    queryKey: ['servers', 'client'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .eq('owner_type', 'client')
        .eq('is_deleted', false)
        .order('client_name', { ascending: true });
      
      if (error) throw error;
      return data as Server[];
    },
  });
};

export const useServerSummary = () => {
  return useQuery({
    queryKey: ['servers', 'summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .eq('is_deleted', false);
      
      if (error) throw error;
      
      const servers = data as Server[];
      const total = servers.length;
      const own = servers.filter(s => s.owner_type === 'own').length;
      const client = servers.filter(s => s.owner_type === 'client').length;
      const running = servers.filter(s => s.status === 'running').length;
      const warning = servers.filter(s => s.status === 'warning').length;
      const down = servers.filter(s => s.status === 'down').length;
      const totalLoad = servers.length > 0 
        ? Math.round(servers.reduce((sum, s) => sum + (s.current_cpu_load || 0), 0) / servers.length)
        : 0;
      const monthlyCost = servers.reduce((sum, s) => sum + (s.monthly_cost || 0), 0);
      
      return { total, own, client, running, warning, down, totalLoad, monthlyCost };
    },
  });
};

export const useCreateServer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (server: { name: string; provider: string } & Partial<Omit<Server, 'name' | 'provider'>>) => {
      const { error } = await supabase
        .from('servers')
        .insert([server]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      toast.success('Server created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create server: ' + error.message);
    },
  });
};

export const useUpdateServer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Server> & { id: string }) => {
      const { error } = await supabase
        .from('servers')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      toast.success('Server updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update server: ' + error.message);
    },
  });
};

// Auto-Scaling Policies Hooks
export const useAutoScalingPolicies = () => {
  return useQuery({
    queryKey: ['auto_scaling_policies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auto_scaling_policies')
        .select('*, servers(*)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AutoScalingPolicy[];
    },
  });
};

export const useCreateScalingPolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (policy: Partial<AutoScalingPolicy>) => {
      const { error } = await supabase
        .from('auto_scaling_policies')
        .insert([policy]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto_scaling_policies'] });
      toast.success('Scaling policy created');
    },
    onError: (error) => {
      toast.error('Failed to create policy: ' + error.message);
    },
  });
};

export const useUpdateScalingPolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AutoScalingPolicy> & { id: string }) => {
      const { error } = await supabase
        .from('auto_scaling_policies')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto_scaling_policies'] });
      toast.success('Scaling policy update submitted for approval');
    },
    onError: (error) => {
      toast.error('Failed to update policy: ' + error.message);
    },
  });
};

// Scaling Events Hooks
export const useScalingEvents = (limit = 50) => {
  return useQuery({
    queryKey: ['scaling_events', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scaling_events')
        .select('*, servers(*)')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as ScalingEvent[];
    },
  });
};

export const useCreateScalingEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (event: { action: string } & Partial<Omit<ScalingEvent, 'action'>>) => {
      const { error } = await supabase
        .from('scaling_events')
        .insert([event]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scaling_events'] });
    },
  });
};

// Server Incidents Hooks
export const useServerIncidents = () => {
  return useQuery({
    queryKey: ['server_incidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('server_incidents')
        .select('*, servers(*)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ServerIncident[];
    },
  });
};

export const useActiveIncidents = () => {
  return useQuery({
    queryKey: ['server_incidents', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('server_incidents')
        .select('*, servers(*)')
        .in('status', ['active', 'monitoring', 'escalated'])
        .eq('is_deleted', false)
        .order('severity', { ascending: false });
      
      if (error) throw error;
      return data as ServerIncident[];
    },
  });
};

export const useIncidentSummary = () => {
  return useQuery({
    queryKey: ['server_incidents', 'summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('server_incidents')
        .select('*')
        .eq('is_deleted', false);
      
      if (error) throw error;
      
      const incidents = data as ServerIncident[];
      const activeCritical = incidents.filter(i => i.severity === 'critical' && i.status === 'active').length;
      const monitoring = incidents.filter(i => i.status === 'monitoring').length;
      const resolvedToday = incidents.filter(i => {
        if (!i.resolved_at) return false;
        const resolved = new Date(i.resolved_at);
        const today = new Date();
        return resolved.toDateString() === today.toDateString();
      }).length;
      
      const resolvedIncidents = incidents.filter(i => i.recovery_time_minutes);
      const avgRecovery = resolvedIncidents.length > 0
        ? Math.round(resolvedIncidents.reduce((sum, i) => sum + (i.recovery_time_minutes || 0), 0) / resolvedIncidents.length)
        : 0;
      
      return { activeCritical, monitoring, resolvedToday, avgRecovery };
    },
  });
};

export const useCreateServerIncident = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (incident: { title: string; incident_type: string } & Partial<Omit<ServerIncident, 'title' | 'incident_type'>>) => {
      const { error } = await supabase
        .from('server_incidents')
        .insert([incident]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server_incidents'] });
      toast.success('Incident reported');
    },
    onError: (error) => {
      toast.error('Failed to report incident: ' + error.message);
    },
  });
};

export const useUpdateServerIncident = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ServerIncident> & { id: string }) => {
      const { error } = await supabase
        .from('server_incidents')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server_incidents'] });
      toast.success('Incident updated');
    },
    onError: (error) => {
      toast.error('Failed to update incident: ' + error.message);
    },
  });
};

// Server Activity Logs Hooks
export const useServerActivityLogs = (limit = 100) => {
  return useQuery({
    queryKey: ['server_activity_logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('server_activity_logs')
        .select('*, servers(*)')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as ServerActivityLog[];
    },
  });
};

export const useCreateServerActivityLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (log: { action: string } & Partial<Omit<ServerActivityLog, 'action'>>) => {
      const { error } = await supabase
        .from('server_activity_logs')
        .insert([log]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server_activity_logs'] });
    },
  });
};

// Security Rules Hooks
export interface SecurityRule {
  id: string;
  server_id: string | null;
  rule_name: string;
  rule_type: string;
  source_ip: string | null;
  destination_port: number | null;
  protocol: string | null;
  action: string;
  priority: number | null;
  is_enabled: boolean | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean | null;
  servers?: Server;
}

export const useSecurityRules = () => {
  return useQuery({
    queryKey: ['server_security_rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('server_security_rules')
        .select('*, servers(*)')
        .eq('is_deleted', false)
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data as SecurityRule[];
    },
  });
};

export const useCreateSecurityRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (rule: { rule_name: string; action: string } & Partial<Omit<SecurityRule, 'rule_name' | 'action'>>) => {
      const { error } = await supabase
        .from('server_security_rules')
        .insert([rule]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server_security_rules'] });
      toast.success('Security rule created');
    },
    onError: (error) => {
      toast.error('Failed to create rule: ' + error.message);
    },
  });
};

export const useUpdateSecurityRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SecurityRule> & { id: string }) => {
      const { error } = await supabase
        .from('server_security_rules')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server_security_rules'] });
      toast.success('Security rule updated');
    },
    onError: (error) => {
      toast.error('Failed to update rule: ' + error.message);
    },
  });
};

export const useDeleteSecurityRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('server_security_rules')
        .update({ is_deleted: true })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server_security_rules'] });
      toast.success('Security rule deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete rule: ' + error.message);
    },
  });
};

// IP Blocklist Hooks
export interface IPBlock {
  id: string;
  ip_address: string;
  ip_range: string | null;
  reason: string;
  severity: string | null;
  blocked_at: string;
  expires_at: string | null;
  is_permanent: boolean | null;
  blocked_by: string | null;
  blocked_by_name: string | null;
  is_active: boolean | null;
  created_at: string;
}

export const useIPBlocklist = () => {
  return useQuery({
    queryKey: ['server_ip_blocklist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('server_ip_blocklist')
        .select('*')
        .eq('is_active', true)
        .order('blocked_at', { ascending: false });
      
      if (error) throw error;
      return data as IPBlock[];
    },
  });
};

export const useCreateIPBlock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (block: { ip_address: string; reason: string } & Partial<Omit<IPBlock, 'ip_address' | 'reason'>>) => {
      const { error } = await supabase
        .from('server_ip_blocklist')
        .insert([block]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server_ip_blocklist'] });
      toast.success('IP blocked successfully');
    },
    onError: (error) => {
      toast.error('Failed to block IP: ' + error.message);
    },
  });
};

export const useRemoveIPBlock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('server_ip_blocklist')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server_ip_blocklist'] });
      toast.success('IP unblocked');
    },
    onError: (error) => {
      toast.error('Failed to unblock IP: ' + error.message);
    },
  });
};

// Server Backups Hooks
export interface ServerBackup {
  id: string;
  server_id: string | null;
  backup_type: string;
  status: string;
  size_mb: number | null;
  storage_location: string | null;
  started_at: string | null;
  completed_at: string | null;
  scheduled_at: string | null;
  retention_days: number | null;
  is_automated: boolean | null;
  error_message: string | null;
  created_at: string;
  is_deleted: boolean | null;
  servers?: Server;
}

export const useServerBackups = () => {
  return useQuery({
    queryKey: ['server_backups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('server_backups')
        .select('*, servers(*)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ServerBackup[];
    },
  });
};

export const useCreateBackup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (backup: { server_id: string; backup_type: string } & Partial<Omit<ServerBackup, 'server_id' | 'backup_type'>>) => {
      const { error } = await supabase
        .from('server_backups')
        .insert([backup]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server_backups'] });
      toast.success('Backup initiated');
    },
    onError: (error) => {
      toast.error('Failed to create backup: ' + error.message);
    },
  });
};

// Server Maintenance Hooks
export interface ServerMaintenance {
  id: string;
  server_id: string | null;
  title: string;
  description: string | null;
  maintenance_type: string;
  status: string;
  scheduled_start: string;
  scheduled_end: string | null;
  actual_start: string | null;
  actual_end: string | null;
  affected_services: string[] | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean | null;
  servers?: Server;
}

export const useServerMaintenance = () => {
  return useQuery({
    queryKey: ['server_maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('server_maintenance')
        .select('*, servers(*)')
        .eq('is_deleted', false)
        .order('scheduled_start', { ascending: false });
      
      if (error) throw error;
      return data as ServerMaintenance[];
    },
  });
};

export const useCreateMaintenance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (maintenance: { title: string; scheduled_start: string } & Partial<Omit<ServerMaintenance, 'title' | 'scheduled_start'>>) => {
      const { error } = await supabase
        .from('server_maintenance')
        .insert([maintenance]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server_maintenance'] });
      toast.success('Maintenance scheduled');
    },
    onError: (error) => {
      toast.error('Failed to schedule maintenance: ' + error.message);
    },
  });
};

export const useUpdateMaintenance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ServerMaintenance> & { id: string }) => {
      const { error } = await supabase
        .from('server_maintenance')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['server_maintenance'] });
      toast.success('Maintenance updated');
    },
    onError: (error) => {
      toast.error('Failed to update maintenance: ' + error.message);
    },
  });
};

// Access Attempts Hooks
export interface AccessAttempt {
  id: string;
  server_id: string | null;
  source_ip: string;
  attempt_type: string;
  target_port: number | null;
  blocked: boolean | null;
  block_reason: string | null;
  geo_location: string | null;
  user_agent: string | null;
  created_at: string;
  servers?: Server;
}

export const useAccessAttempts = (limit = 100) => {
  return useQuery({
    queryKey: ['server_access_attempts', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('server_access_attempts')
        .select('*, servers(*)')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as AccessAttempt[];
    },
  });
};

// Delete server (soft delete)
export const useDeleteServer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      // First log the deletion
      await supabase.from('server_activity_logs').insert([{
        server_id: id,
        action: 'Server Deleted',
        details: reason,
        approval_status: 'approved',
      }]);
      
      // Then soft delete
      const { error } = await supabase
        .from('servers')
        .update({ is_deleted: true })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      toast.success('Server deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete server: ' + error.message);
    },
  });
};
