import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface Approval {
  id: string;
  type: 'system' | 'payment' | 'risk' | 'ai' | 'access' | 'deployment' | 'rollback';
  title: string;
  description: string | null;
  requester: string;
  requester_id: string | null;
  priority: string;
  amount: number | null;
  reference_id: string | null;
  reference_table: string | null;
  status: 'pending' | 'approved' | 'rejected';
  approved_by: string | null;
  approved_at: string | null;
  rejected_by: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean | null;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  module: string;
  user_email: string;
  user_id: string | null;
  user_role: string;
  details: string | null;
  ip_address: string | null;
  user_agent: string | null;
  severity: string;
  metadata: unknown | null;
}

export interface AuditLogInsert {
  action: string;
  module: string;
  user_email: string;
  user_id?: string | null;
  user_role: string;
  details?: string | null;
  severity?: string;
}

export interface SystemFreeze {
  id: string;
  freeze_type: string;
  module_id: string | null;
  reason: string;
  is_active: boolean;
  frozen_by: string;
  frozen_at: string;
  resumed_by: string | null;
  resumed_at: string | null;
  duration_minutes: number | null;
  created_at: string;
  updated_at: string;
}

// Approvals Hooks
export const useApprovals = () => {
  return useQuery({
    queryKey: ['approvals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('approvals')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Approval[];
    },
  });
};

export const usePendingApprovals = () => {
  return useQuery({
    queryKey: ['approvals', 'pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('approvals')
        .select('*')
        .eq('status', 'pending')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Approval[];
    },
  });
};

export const useUpdateApproval = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, rejection_reason }: { id: string; status: 'approved' | 'rejected'; rejection_reason?: string }) => {
      const updateData: Record<string, unknown> = {
        status,
        ...(status === 'approved' ? { approved_at: new Date().toISOString() } : {}),
        ...(status === 'rejected' ? { rejected_at: new Date().toISOString(), rejection_reason } : {}),
      };
      
      const { error } = await supabase
        .from('approvals')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      toast.success(`Request ${variables.status} successfully`);
    },
    onError: (error) => {
      toast.error('Failed to update approval: ' + error.message);
    },
  });
};

// Audit Logs Hooks
export const useAuditLogs = (limit = 100) => {
  return useQuery({
    queryKey: ['audit_logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as AuditLog[];
    },
  });
};

export const useCreateAuditLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (log: AuditLogInsert) => {
      const { error } = await supabase
        .from('audit_logs')
        .insert([log]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit_logs'] });
    },
  });
};

// System Freeze Hooks
export const useSystemFreezeStatus = () => {
  return useQuery({
    queryKey: ['system_freeze', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_freeze')
        .select('*')
        .eq('is_active', true)
        .order('frozen_at', { ascending: false });
      
      if (error) throw error;
      return data as SystemFreeze[];
    },
  });
};

export const useFreezeHistory = () => {
  return useQuery({
    queryKey: ['system_freeze', 'history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_freeze')
        .select('*')
        .order('frozen_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as SystemFreeze[];
    },
  });
};

export const useCreateSystemFreeze = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (freeze: { freeze_type: string; module_id?: string; reason: string; frozen_by: string }) => {
      const { error } = await supabase
        .from('system_freeze')
        .insert([freeze]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_freeze'] });
      toast.success('System freeze activated');
    },
    onError: (error) => {
      toast.error('Failed to activate freeze: ' + error.message);
    },
  });
};

export const useResumeSystemFreeze = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, resumed_by }: { id: string; resumed_by: string }) => {
      const { error } = await supabase
        .from('system_freeze')
        .update({
          is_active: false,
          resumed_by,
          resumed_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system_freeze'] });
      toast.success('System resumed successfully');
    },
    onError: (error) => {
      toast.error('Failed to resume system: ' + error.message);
    },
  });
};

// Financial snapshot hooks (using existing sales data)
export const useFinancialSnapshot = () => {
  return useQuery({
    queryKey: ['financial_snapshot'],
    queryFn: async () => {
      const { data: sales, error } = await supabase
        .from('sales')
        .select('total_amount, created_at, payment_status')
        .eq('is_deleted', false);
      
      if (error) throw error;
      
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      const totalRevenue = sales?.reduce((sum, s) => sum + (s.total_amount || 0), 0) || 0;
      const thisMonthSales = sales?.filter(s => new Date(s.created_at) >= thisMonth) || [];
      const lastMonthSales = sales?.filter(s => {
        const date = new Date(s.created_at);
        return date >= lastMonth && date < thisMonth;
      }) || [];
      
      const thisMonthRevenue = thisMonthSales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
      const lastMonthRevenue = lastMonthSales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
      
      const trendPercentage = lastMonthRevenue > 0 
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;
      
      return {
        totalRevenue,
        thisMonthRevenue,
        trend: trendPercentage >= 0 ? 'up' : 'down',
        trendPercentage: Math.abs(trendPercentage),
      };
    },
  });
};

// Pending payouts
export const usePendingPayouts = () => {
  return useQuery({
    queryKey: ['pending_payouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commission_payouts')
        .select('*')
        .eq('status', 'pending');
      
      if (error) throw error;
      
      const totalAmount = data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      return {
        count: data?.length || 0,
        totalAmount,
        payouts: data || [],
      };
    },
  });
};
