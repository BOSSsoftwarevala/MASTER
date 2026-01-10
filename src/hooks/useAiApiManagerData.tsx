import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types
export interface AiService {
  id: string;
  service_key: string;
  name: string;
  description: string | null;
  category: 'development' | 'seo' | 'lead' | 'chatbot' | 'supervisor';
  status: 'off' | 'on' | 'limited' | 'scheduled';
  model_provider: string | null;
  model_name: string | null;
  monthly_limit: number;
  current_usage: number;
  cost_per_request: number;
  is_enabled: boolean;
  requires_approval: boolean;
  config: unknown;
  created_at: string;
  updated_at: string;
}

export interface ApiProvider {
  id: string;
  provider_key: string;
  name: string;
  description: string | null;
  category: 'ai' | 'seo' | 'lead' | 'payment' | 'notification' | 'storage' | 'other';
  status: 'not_connected' | 'connected' | 'error' | 'paused';
  base_url: string | null;
  is_enabled: boolean;
  monthly_limit: number;
  current_usage: number;
  error_count: number;
  last_error: string | null;
  last_error_at: string | null;
  config: unknown;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  provider_id: string;
  key_name: string;
  key_hint: string | null;
  is_active: boolean;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiUsageLog {
  id: string;
  provider_id: string | null;
  service_id: string | null;
  endpoint: string | null;
  method: string | null;
  status_code: number | null;
  response_time_ms: number | null;
  tokens_used: number | null;
  cost: number;
  error_message: string | null;
  metadata: unknown;
  created_at: string;
}

export interface AiExecutionLog {
  id: string;
  service_id: string | null;
  execution_type: string;
  input_summary: string | null;
  output_summary: string | null;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  tokens_input: number | null;
  tokens_output: number | null;
  cost: number;
  duration_ms: number | null;
  error_message: string | null;
  approval_required: boolean;
  approved_by: string | null;
  approved_at: string | null;
  metadata: unknown;
  created_at: string;
}

export interface ApiAlert {
  id: string;
  provider_id: string | null;
  service_id: string | null;
  alert_type: 'limit_warning' | 'limit_reached' | 'error' | 'expiry' | 'connection_lost';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string | null;
  is_read: boolean;
  is_resolved: boolean;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

// AI Services
export function useAiServices() {
  return useQuery({
    queryKey: ['ai-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_services')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data as AiService[];
    },
  });
}

export function useUpdateAiService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => {
      const { data, error } = await supabase
        .from('ai_services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-services'] });
      toast({ title: 'AI Service updated' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update AI Service', description: error.message, variant: 'destructive' });
    },
  });
}

// API Providers
export function useApiProviders() {
  return useQuery({
    queryKey: ['api-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_providers')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data as ApiProvider[];
    },
  });
}

export function useUpdateApiProvider() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => {
      const { data, error } = await supabase
        .from('api_providers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-providers'] });
      toast({ title: 'API Provider updated' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update API Provider', description: error.message, variant: 'destructive' });
    },
  });
}

// API Keys
export function useApiKeys() {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ApiKey[];
    },
  });
}

// API Usage Logs
export function useApiUsageLogs(limit = 100) {
  return useQuery({
    queryKey: ['api-usage-logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_usage_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as ApiUsageLog[];
    },
  });
}

// AI Execution Logs
export function useAiExecutionLogs(limit = 100) {
  return useQuery({
    queryKey: ['ai-execution-logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_execution_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as AiExecutionLog[];
    },
  });
}

// API Alerts
export function useApiAlerts() {
  return useQuery({
    queryKey: ['api-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_alerts')
        .select('*')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ApiAlert[];
    },
  });
}

export function useResolveApiAlert() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('api_alerts')
        .update({ is_resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-alerts'] });
      toast({ title: 'Alert resolved' });
    },
    onError: (error) => {
      toast({ title: 'Failed to resolve alert', description: error.message, variant: 'destructive' });
    },
  });
}

// Stats
export function useAiApiStats() {
  return useQuery({
    queryKey: ['ai-api-stats'],
    queryFn: async () => {
      const [services, providers, alerts, usageLogs] = await Promise.all([
        supabase.from('ai_services').select('*'),
        supabase.from('api_providers').select('*'),
        supabase.from('api_alerts').select('*', { count: 'exact' }).eq('is_resolved', false),
        supabase.from('api_usage_logs').select('cost').gte('created_at', new Date(new Date().setDate(1)).toISOString()),
      ]);

      const aiServicesData = services.data as AiService[] || [];
      const apiProvidersData = providers.data as ApiProvider[] || [];
      
      const activeAiServices = aiServicesData.filter(s => s.is_enabled).length;
      const connectedApis = apiProvidersData.filter(p => p.status === 'connected').length;
      const monthlyAiCost = usageLogs.data?.reduce((sum, log) => sum + (Number(log.cost) || 0), 0) || 0;
      const unresolvedAlerts = alerts.count || 0;

      return {
        totalAiServices: aiServicesData.length,
        activeAiServices,
        totalApiProviders: apiProvidersData.length,
        connectedApis,
        monthlyAiCost,
        unresolvedAlerts,
        aiServices: aiServicesData,
        apiProviders: apiProvidersData,
      };
    },
  });
}

// Cost Limits
export function useAiCostLimits() {
  return useQuery({
    queryKey: ['ai-cost-limits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_cost_limits')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
  });
}

// Auto Recovery Logs
export function useAutoRecoveryLogs(limit = 50) {
  return useQuery({
    queryKey: ['auto-recovery-logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auto_recovery_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
  });
}

// Cost Optimizer Suggestions
export function useCostOptimizerSuggestions() {
  return useQuery({
    queryKey: ['cost-optimizer-suggestions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cost_optimizer_suggestions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

// Incident Predictions
export function useIncidentPredictions() {
  return useQuery({
    queryKey: ['incident-predictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incident_predictions')
        .select('*')
        .order('risk_score', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}
