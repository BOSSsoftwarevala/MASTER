import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Types
export interface Wallet {
  id: string;
  wallet_type: 'company' | 'franchise' | 'reseller' | 'user';
  owner_id: string;
  owner_name: string;
  balance: number;
  hold_amount: number;
  currency: string;
  is_locked: boolean;
  lock_reason?: string;
  locked_at?: string;
  locked_by?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface WalletLedger {
  id: string;
  wallet_id: string;
  transaction_type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description?: string;
  reference_type?: string;
  reference_id?: string;
  performed_by?: string;
  performed_by_name?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  customer_email?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  status: 'draft' | 'pending' | 'paid' | 'cancelled' | 'overdue';
  due_date?: string;
  paid_at?: string;
  notes?: string;
  is_deleted: boolean;
  created_by?: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface FinancePlan {
  id: string;
  name: string;
  plan_type: 'prime_user' | 'franchise' | 'reseller' | 'api';
  description?: string;
  price: number;
  billing_cycle: string;
  features: any[];
  limits: Record<string, any>;
  is_active: boolean;
  is_deleted: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FinanceSubscription {
  id: string;
  user_id: string;
  user_name: string;
  plan_id: string;
  status: string;
  starts_at: string;
  expires_at?: string;
  auto_renew: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  finance_plans?: FinancePlan;
}

export interface FinancePayout {
  id: string;
  beneficiary_id: string;
  beneficiary_name: string;
  beneficiary_type: string;
  amount: number;
  currency: string;
  payout_method?: string;
  bank_details?: Record<string, any>;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'failed' | 'held';
  notes?: string;
  approved_by?: string;
  approved_by_name?: string;
  approved_at?: string;
  processed_at?: string;
  held_reason?: string;
  is_deleted: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CostLog {
  id: string;
  category: 'ai' | 'api' | 'server' | 'storage' | 'bandwidth' | 'other';
  description?: string;
  amount: number;
  currency: string;
  usage_date: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface CostLimit {
  id: string;
  category: 'ai' | 'api' | 'server' | 'storage' | 'bandwidth' | 'other';
  daily_limit?: number;
  monthly_limit?: number;
  alert_threshold_percent: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Wallets Hooks
export const useWallets = (walletType?: 'company' | 'franchise' | 'reseller' | 'user') => {
  return useQuery({
    queryKey: ['wallets', walletType],
    queryFn: async () => {
      let query = supabase
        .from('wallets')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (walletType) {
        query = query.eq('wallet_type', walletType);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Wallet[];
    },
  });
};

export const useCreateWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (wallet: Omit<Wallet, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>) => {
      const { data, error } = await supabase
        .from('wallets')
        .insert(wallet)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      toast.success('Wallet created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create wallet: ' + error.message);
    },
  });
};

export const useUpdateWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Wallet> & { id: string }) => {
      const { data, error } = await supabase
        .from('wallets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      toast.success('Wallet updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update wallet: ' + error.message);
    },
  });
};

export const useWalletTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      walletId, 
      type, 
      amount, 
      description 
    }: { 
      walletId: string; 
      type: 'credit' | 'debit' | 'hold' | 'release'; 
      amount: number; 
      description?: string;
    }) => {
      // Get current wallet
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('id', walletId)
        .single();
      
      if (walletError) throw walletError;
      
      // Prevent transactions on locked wallets
      if (wallet.is_locked) {
        throw new Error('Wallet is locked. Cannot process transaction.');
      }
      
      const balanceBefore = wallet.balance;
      let newBalance = balanceBefore;
      let newHoldAmount = wallet.hold_amount || 0;
      
      if (type === 'credit') {
        newBalance += amount;
      } else if (type === 'debit') {
        if (balanceBefore < amount) throw new Error('Insufficient balance. No negative balance allowed.');
        newBalance -= amount;
      } else if (type === 'hold') {
        if (balanceBefore < amount) throw new Error('Insufficient balance for hold.');
        newBalance -= amount;
        newHoldAmount += amount;
      } else if (type === 'release') {
        if (newHoldAmount < amount) throw new Error('Insufficient hold amount to release.');
        newHoldAmount -= amount;
        newBalance += amount;
      }
      
      // Update wallet atomically
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ balance: newBalance, hold_amount: newHoldAmount })
        .eq('id', walletId)
        .eq('balance', balanceBefore); // Optimistic locking to prevent race conditions
      
      if (updateError) throw updateError;
      
      // Insert ledger entry (reseller_id required by schema, use wallet owner_id as fallback)
      // Map transaction type to valid enum: credit, debit, adjustment, settlement
      const ledgerType = (type === 'hold' || type === 'release') ? 'adjustment' : type;
      
      await supabase
        .from('wallet_ledger')
        .insert({
          wallet_id: walletId,
          reseller_id: wallet.owner_id, // Required field - using wallet owner
          transaction_type: ledgerType as 'credit' | 'debit' | 'adjustment' | 'settlement',
          amount,
          balance_before: balanceBefore,
          balance_after: newBalance,
          description: description || `${type} transaction`,
        })
        .then(({ error: ledgerError }) => {
          if (ledgerError) {
            console.error('Ledger insert error:', ledgerError);
          }
        });
      
      return { success: true, newBalance, balanceBefore };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['wallet_ledger'] });
      toast.success('Transaction completed successfully');
    },
    onError: (error) => {
      toast.error('Transaction failed: ' + error.message);
    },
  });
};

export const useWalletLedger = (walletId?: string) => {
  return useQuery({
    queryKey: ['wallet_ledger', walletId],
    queryFn: async () => {
      let query = supabase
        .from('wallet_ledger')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (walletId) {
        query = query.eq('wallet_id', walletId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as WalletLedger[];
    },
    enabled: !!walletId || walletId === undefined,
  });
};

// Invoices Hooks
export const useInvoices = (status?: 'draft' | 'pending' | 'paid' | 'cancelled' | 'overdue') => {
  return useQuery({
    queryKey: ['invoices', status],
    queryFn: async () => {
      let query = supabase
        .from('invoices')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Invoice[];
    },
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>) => {
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoice)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create invoice: ' + error.message);
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Invoice> & { id: string }) => {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update invoice: ' + error.message);
    },
  });
};

// Finance Plans Hooks
export const useFinancePlans = (planType?: 'prime_user' | 'franchise' | 'reseller' | 'api') => {
  return useQuery({
    queryKey: ['finance_plans', planType],
    queryFn: async () => {
      let query = supabase
        .from('finance_plans')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (planType) {
        query = query.eq('plan_type', planType);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as FinancePlan[];
    },
  });
};

export const useCreateFinancePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (plan: Omit<FinancePlan, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>) => {
      const { data, error } = await supabase
        .from('finance_plans')
        .insert(plan)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_plans'] });
      toast.success('Plan created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create plan: ' + error.message);
    },
  });
};

export const useUpdateFinancePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FinancePlan> & { id: string }) => {
      const { data, error } = await supabase
        .from('finance_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_plans'] });
      toast.success('Plan updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update plan: ' + error.message);
    },
  });
};

// Finance Subscriptions Hooks
export const useFinanceSubscriptions = (status?: string) => {
  return useQuery({
    queryKey: ['finance_subscriptions', status],
    queryFn: async () => {
      let query = supabase
        .from('finance_subscriptions')
        .select('*, finance_plans(name, price, plan_type)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as FinanceSubscription[];
    },
  });
};

export const useCreateFinanceSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subscription: Omit<FinanceSubscription, 'id' | 'created_at' | 'updated_at' | 'is_deleted' | 'finance_plans'>) => {
      const { data, error } = await supabase
        .from('finance_subscriptions')
        .insert(subscription)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_subscriptions'] });
      toast.success('Subscription created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create subscription: ' + error.message);
    },
  });
};

export const useUpdateFinanceSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FinanceSubscription> & { id: string }) => {
      const { data, error } = await supabase
        .from('finance_subscriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_subscriptions'] });
      toast.success('Subscription updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update subscription: ' + error.message);
    },
  });
};

// Finance Payouts Hooks
export const useFinancePayouts = (status?: 'pending' | 'approved' | 'processing' | 'completed' | 'failed' | 'held') => {
  return useQuery({
    queryKey: ['finance_payouts', status],
    queryFn: async () => {
      let query = supabase
        .from('finance_payouts')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as FinancePayout[];
    },
  });
};

export const useCreateFinancePayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payout: Omit<FinancePayout, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>) => {
      const { data, error } = await supabase
        .from('finance_payouts')
        .insert(payout)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_payouts'] });
      toast.success('Payout created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create payout: ' + error.message);
    },
  });
};

export const useUpdateFinancePayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FinancePayout> & { id: string }) => {
      const { data, error } = await supabase
        .from('finance_payouts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_payouts'] });
      toast.success('Payout updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update payout: ' + error.message);
    },
  });
};

// Cost Logs & Limits Hooks
export const useCostLogs = (category?: 'ai' | 'api' | 'server' | 'storage' | 'bandwidth' | 'other', startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['cost_logs', category, startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('cost_logs')
        .select('*')
        .order('usage_date', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      if (startDate) {
        query = query.gte('usage_date', startDate);
      }
      if (endDate) {
        query = query.lte('usage_date', endDate);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as CostLog[];
    },
  });
};

export const useCreateCostLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (log: Omit<CostLog, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('cost_logs')
        .insert(log)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost_logs'] });
      toast.success('Cost log added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add cost log: ' + error.message);
    },
  });
};

export const useCostLimits = () => {
  return useQuery({
    queryKey: ['cost_limits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cost_limits')
        .select('*')
        .eq('is_active', true)
        .order('category');
      
      if (error) throw error;
      return data as CostLimit[];
    },
  });
};

export const useUpdateCostLimit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CostLimit> & { id: string }) => {
      const { data, error } = await supabase
        .from('cost_limits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost_limits'] });
      toast.success('Cost limit updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update cost limit: ' + error.message);
    },
  });
};

export const useCreateCostLimit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (limit: Omit<CostLimit, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('cost_limits')
        .insert(limit)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost_limits'] });
      toast.success('Cost limit created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create cost limit: ' + error.message);
    },
  });
};

// Finance Dashboard Stats
export const useFinanceDashboardStats = () => {
  return useQuery({
    queryKey: ['finance_dashboard_stats'],
    queryFn: async () => {
      const [walletsRes, invoicesRes, payoutsRes, salesRes] = await Promise.all([
        supabase.from('wallets').select('balance, hold_amount, wallet_type').eq('is_deleted', false),
        supabase.from('invoices').select('total_amount, status').eq('is_deleted', false),
        supabase.from('finance_payouts').select('amount, status').eq('is_deleted', false),
        supabase.from('sales').select('total_amount, created_at').eq('is_deleted', false),
      ]);

      const wallets = walletsRes.data || [];
      const invoices = invoicesRes.data || [];
      const payouts = payoutsRes.data || [];
      const sales = salesRes.data || [];

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const totalWalletBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
      const totalHoldAmount = wallets.reduce((sum, w) => sum + (w.hold_amount || 0), 0);
      const pendingPayouts = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);
      const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;
      const thisMonthRevenue = sales
        .filter(s => new Date(s.created_at || '') >= thisMonth)
        .reduce((sum, s) => sum + (s.total_amount || 0), 0);
      const totalRevenue = sales.reduce((sum, s) => sum + (s.total_amount || 0), 0);

      return {
        totalWalletBalance,
        totalHoldAmount,
        pendingPayouts,
        pendingPayoutsCount: payouts.filter(p => p.status === 'pending').length,
        overdueInvoices,
        thisMonthRevenue,
        totalRevenue,
        totalInvoices: invoices.length,
      };
    },
  });
};

// Realtime hook
export const useFinanceRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('finance-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets' }, () => {
        queryClient.invalidateQueries({ queryKey: ['wallets'] });
        queryClient.invalidateQueries({ queryKey: ['finance_dashboard_stats'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => {
        queryClient.invalidateQueries({ queryKey: ['invoices'] });
        queryClient.invalidateQueries({ queryKey: ['finance_dashboard_stats'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'finance_payouts' }, () => {
        queryClient.invalidateQueries({ queryKey: ['finance_payouts'] });
        queryClient.invalidateQueries({ queryKey: ['finance_dashboard_stats'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
