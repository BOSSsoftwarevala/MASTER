import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AiSuggestion {
  id: string;
  suggestion_type: string;
  title: string;
  description: string;
  impact_level: string;
  confidence_score: number;
  status: 'pending' | 'approved' | 'rejected' | 'on_hold';
  created_at: string;
  approved_at?: string;
  approved_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
  metadata?: Record<string, unknown>;
}

export interface SystemHealthMetrics {
  healthScore: number;
  serverUptime: number;
  deploymentStability: number;
  apiSuccessRate: number;
  securityScore: number;
}

export interface BusinessMetrics {
  totalRevenue: number;
  monthlyBurn: number;
  revenueGrowth: number;
  leadConversionRate: number;
  franchisePerformance: number;
  resellerPerformance: number;
}

export interface RiskIndicator {
  id: string;
  type: 'security' | 'financial' | 'operational' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  detected_at: string;
  resolved: boolean;
}

export interface AiDecision {
  id: string;
  decision_type: string;
  action_taken: string;
  ai_engine: string;
  user_message: string;
  internal_details: string;
  was_approved: boolean;
  approved_by?: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface Forecast {
  id: string;
  forecast_type: 'revenue' | 'load' | 'leads' | 'risk';
  period: string;
  predicted_value: number;
  confidence: number;
  created_at: string;
}

// Mock data generators for demonstration
const generateMockHealthMetrics = (): SystemHealthMetrics => ({
  healthScore: Math.floor(Math.random() * 20) + 80,
  serverUptime: 99.5 + Math.random() * 0.5,
  deploymentStability: Math.floor(Math.random() * 15) + 85,
  apiSuccessRate: 98 + Math.random() * 2,
  securityScore: Math.floor(Math.random() * 10) + 90,
});

const generateMockBusinessMetrics = (): BusinessMetrics => ({
  totalRevenue: 1250000 + Math.floor(Math.random() * 500000),
  monthlyBurn: 85000 + Math.floor(Math.random() * 15000),
  revenueGrowth: 12 + Math.floor(Math.random() * 8),
  leadConversionRate: 18 + Math.floor(Math.random() * 12),
  franchisePerformance: 75 + Math.floor(Math.random() * 20),
  resellerPerformance: 68 + Math.floor(Math.random() * 25),
});

const generateMockSuggestions = (): AiSuggestion[] => [
  {
    id: '1',
    suggestion_type: 'scaling',
    title: 'Scale up API servers',
    description: 'Traffic patterns indicate 40% increase in next 2 hours. Recommend scaling from 4 to 6 instances.',
    impact_level: 'high',
    confidence_score: 0.87,
    status: 'pending',
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: '2',
    suggestion_type: 'budget',
    title: 'Optimize AI API costs',
    description: 'Switch SEO content generation to GPT-4.1-mini to save $2,400/month without quality loss.',
    impact_level: 'medium',
    confidence_score: 0.92,
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '3',
    suggestion_type: 'security',
    title: 'Revoke inactive admin access',
    description: '3 admin accounts inactive for 30+ days. Recommend temporary suspension.',
    impact_level: 'high',
    confidence_score: 0.95,
    status: 'pending',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: '4',
    suggestion_type: 'optimization',
    title: 'Database query optimization',
    description: 'Detected slow queries on leads table. Adding index could improve performance by 60%.',
    impact_level: 'medium',
    confidence_score: 0.78,
    status: 'approved',
    approved_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    approved_by: 'Boss',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

const generateMockRisks = (): RiskIndicator[] => [
  {
    id: '1',
    type: 'security',
    severity: 'high',
    title: 'Unusual login pattern detected',
    description: 'Multiple failed login attempts from IP range 192.168.x.x',
    detected_at: new Date(Date.now() - 15 * 60000).toISOString(),
    resolved: false,
  },
  {
    id: '2',
    type: 'financial',
    severity: 'medium',
    title: 'AI API cost spike',
    description: 'Daily AI usage 35% above average. Investigating cause.',
    detected_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    resolved: false,
  },
  {
    id: '3',
    type: 'operational',
    severity: 'low',
    title: 'Server response time degradation',
    description: 'Mumbai region showing 15% slower response times.',
    detected_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    resolved: true,
  },
];

const generateMockDecisions = (): AiDecision[] => [
  {
    id: '1',
    decision_type: 'auto_scaling',
    action_taken: 'Scaled API servers from 3 to 5 instances',
    ai_engine: 'Incident Prediction AI',
    user_message: 'Server capacity adjusted based on traffic forecast.',
    internal_details: 'Traffic spike detected: +45% in last hour. Auto-scaling triggered.',
    was_approved: true,
    approved_by: 'Boss',
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: '2',
    decision_type: 'cost_optimization',
    action_taken: 'Switched to lower-cost AI model for bulk operations',
    ai_engine: 'Cost Optimizer AI',
    user_message: 'Monthly costs reduced by estimated $1,800.',
    internal_details: 'Migrated SEO content generation from GPT-4.1 to GPT-4.1-mini.',
    was_approved: true,
    approved_by: 'Boss',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: '3',
    decision_type: 'security_action',
    action_taken: 'Blocked suspicious IP range',
    ai_engine: 'Security AI',
    user_message: 'Potential threat mitigated automatically.',
    internal_details: 'Detected 150+ failed login attempts from IP 45.33.x.x. Auto-blocked for 24h.',
    was_approved: false,
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

const generateMockForecasts = (): Forecast[] => [
  {
    id: '1',
    forecast_type: 'revenue',
    period: 'Next 30 days',
    predicted_value: 145000,
    confidence: 0.82,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    forecast_type: 'load',
    period: 'Next 24 hours',
    predicted_value: 85,
    confidence: 0.91,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    forecast_type: 'leads',
    period: 'Next 7 days',
    predicted_value: 340,
    confidence: 0.76,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    forecast_type: 'risk',
    period: 'Next 48 hours',
    predicted_value: 15,
    confidence: 0.68,
    created_at: new Date().toISOString(),
  },
];

export function useSystemHealth() {
  return useQuery({
    queryKey: ['ai-ceo', 'system-health'],
    queryFn: async () => {
      // Try to get real data from servers table
      const { data: servers } = await supabase
        .from('servers')
        .select('status')
        .eq('is_deleted', false);

      if (servers && servers.length > 0) {
        const onlineServers = servers.filter(s => s.status === 'running').length;
        const uptime = (onlineServers / servers.length) * 100;

        return {
          healthScore: Math.round(uptime),
          serverUptime: uptime,
          deploymentStability: 92,
          apiSuccessRate: 98.5,
          securityScore: 88,
        };
      }

      return generateMockHealthMetrics();
    },
    refetchInterval: 30000,
  });
}

export function useBusinessMetrics() {
  return useQuery({
    queryKey: ['ai-ceo', 'business-metrics'],
    queryFn: async () => {
      // Try to get real data from sales
      const { data: sales } = await supabase
        .from('sales')
        .select('total_amount, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 3600000).toISOString());

      if (sales && sales.length > 0) {
        const totalRevenue = sales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
        return {
          ...generateMockBusinessMetrics(),
          totalRevenue,
        };
      }

      return generateMockBusinessMetrics();
    },
    refetchInterval: 60000,
  });
}

export function useAiSuggestions(status?: string) {
  return useQuery({
    queryKey: ['ai-ceo', 'suggestions', status],
    queryFn: async () => {
      // Try real data from ai_marketing_suggestions
      let query = supabase
        .from('ai_marketing_suggestions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (status && (status === 'pending' || status === 'accepted' || status === 'rejected' || status === 'expired')) {
        query = query.eq('status', status);
      }

      const { data } = await query;

      if (data && data.length > 0) {
        return data.map(s => ({
          id: s.id,
          suggestion_type: s.suggestion_type,
          title: s.title,
          description: s.description || '',
          impact_level: s.impact_level || 'medium',
          confidence_score: s.confidence_score || 0.8,
          status: s.status as AiSuggestion['status'],
          created_at: s.created_at,
          approved_at: s.accepted_at,
          approved_by: s.accepted_by,
          rejected_at: s.rejected_at,
          rejection_reason: s.rejection_reason,
          metadata: s.metadata as Record<string, unknown>,
        }));
      }

      return generateMockSuggestions().filter(s => !status || s.status === status);
    },
  });
}

export function useRiskIndicators() {
  return useQuery({
    queryKey: ['ai-ceo', 'risks'],
    queryFn: async () => {
      // Try to get real threat data
      const { data: threats } = await supabase
        .from('threat_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (threats && threats.length > 0) {
        return threats.map(t => ({
          id: t.id,
          type: 'security' as const,
          severity: t.severity as RiskIndicator['severity'],
          title: t.event_type,
          description: t.description || '',
          detected_at: t.created_at,
          resolved: t.is_resolved || false,
        }));
      }

      return generateMockRisks();
    },
  });
}

export function useAiDecisions(limit: number = 20) {
  return useQuery({
    queryKey: ['ai-ceo', 'decisions', limit],
    queryFn: async () => {
      const { data } = await supabase
        .from('ai_decisions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (data && data.length > 0) {
        return data.map(d => ({
          id: d.id,
          decision_type: d.decision_type,
          action_taken: d.action_taken,
          ai_engine: d.ai_engine,
          user_message: d.user_message || '',
          internal_details: d.internal_details || '',
          was_approved: d.was_approved || false,
          approved_by: d.approved_by,
          created_at: d.created_at || new Date().toISOString(),
          metadata: d.metadata as Record<string, unknown>,
        }));
      }

      return generateMockDecisions();
    },
  });
}

export function useForecasts() {
  return useQuery({
    queryKey: ['ai-ceo', 'forecasts'],
    queryFn: async () => {
      // Forecasts are always mock for now
      return generateMockForecasts();
    },
  });
}

export function useUpdateSuggestionStatus() {
  const updateStatus = async (id: string, status: 'approved' | 'rejected' | 'on_hold', reason?: string) => {
    // Map UI status to database enum values
    const dbStatus = status === 'approved' ? 'accepted' : status === 'on_hold' ? 'pending' : status;
    
    const updates: Record<string, unknown> = {
      status: dbStatus,
      updated_at: new Date().toISOString(),
    };

    if (status === 'approved') {
      updates.accepted_at = new Date().toISOString();
      updates.accepted_by = 'Boss';
    } else if (status === 'rejected') {
      updates.rejected_at = new Date().toISOString();
      updates.rejected_by = 'Boss';
      updates.rejection_reason = reason;
    }

    const { error } = await supabase
      .from('ai_marketing_suggestions')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  };

  return { updateStatus };
}
