import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

// Types
type Reseller = Database['public']['Tables']['resellers']['Row'];
type ResellerInsert = Database['public']['Tables']['resellers']['Insert'];
type ResellerUpdate = Database['public']['Tables']['resellers']['Update'];

type ResellerPlan = Database['public']['Tables']['reseller_plans']['Row'];
type ResellerScope = Database['public']['Tables']['reseller_scopes']['Row'];
type ResellerScopeInsert = Database['public']['Tables']['reseller_scopes']['Insert'];

type ResellerWallet = Database['public']['Tables']['reseller_wallets']['Row'];
type WalletLedger = Database['public']['Tables']['wallet_ledger']['Row'];
type WalletLedgerInsert = Database['public']['Tables']['wallet_ledger']['Insert'];

type LeadDistributionRule = Database['public']['Tables']['lead_distribution_rules']['Row'];
type LeadDistributionRuleInsert = Database['public']['Tables']['lead_distribution_rules']['Insert'];

type ResellerPerformance = Database['public']['Tables']['reseller_performance']['Row'];
type ResellerViolation = Database['public']['Tables']['reseller_violations']['Row'];
type ResellerViolationInsert = Database['public']['Tables']['reseller_violations']['Insert'];
type ResellerViolationUpdate = Database['public']['Tables']['reseller_violations']['Update'];

// Dashboard Stats
export interface ResellerDashboardStats {
  totalResellers: number;
  activeResellers: number;
  pausedResellers: number;
  pendingResellers: number;
  leadsToday: number;
  avgConversionRate: number;
  totalWalletBalance: number;
  openViolations: number;
}

// Hook for Resellers
export function useResellers() {
  const { user } = useAuth();
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResellers = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('resellers')
      .select('*, reseller_plans(*)')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resellers:', error);
      toast.error('Failed to load resellers');
    } else {
      setResellers(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchResellers();
  }, [fetchResellers]);

  const createReseller = async (reseller: ResellerInsert) => {
    const { data, error } = await supabase
      .from('resellers')
      .insert({ ...reseller, created_by: user?.id })
      .select()
      .single();

    if (error) {
      console.error('Error creating reseller:', error);
      toast.error('Failed to create reseller');
      return null;
    }

    // Create wallet for the reseller
    await supabase.from('reseller_wallets').insert({ reseller_id: data.id });

    toast.success('Reseller created successfully');
    fetchResellers();
    return data;
  };

  const updateReseller = async (id: string, updates: ResellerUpdate) => {
    const { error } = await supabase
      .from('resellers')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating reseller:', error);
      toast.error('Failed to update reseller');
      return false;
    }

    toast.success('Reseller updated successfully');
    fetchResellers();
    return true;
  };

  const deleteReseller = async (id: string, reason: string) => {
    // Log the deletion
    await supabase.from('reseller_audit_logs').insert({
      reseller_id: id,
      action: 'Reseller Deleted',
      action_type: 'delete',
      entity_type: 'reseller',
      entity_id: id,
      details: reason,
      performed_by: user?.id,
      performed_by_name: user?.email
    });

    const { error } = await supabase
      .from('resellers')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) {
      console.error('Error deleting reseller:', error);
      toast.error('Failed to delete reseller');
      return false;
    }

    toast.success('Reseller deleted successfully');
    fetchResellers();
    return true;
  };

  return { resellers, loading, fetchResellers, createReseller, updateReseller, deleteReseller };
}

// Hook for Reseller Plans
export function useResellerPlans() {
  const [plans, setPlans] = useState<ResellerPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from('reseller_plans')
        .select('*')
        .eq('is_active', true)
        .order('monthly_fee', { ascending: true });

      if (error) {
        console.error('Error fetching plans:', error);
      } else {
        setPlans(data || []);
      }
      setLoading(false);
    };

    fetchPlans();
  }, []);

  return { plans, loading };
}

// Hook for Reseller Scopes
export function useResellerScopes(resellerId?: string) {
  const { user } = useAuth();
  const [scopes, setScopes] = useState<ResellerScope[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScopes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    
    let query = supabase
      .from('reseller_scopes')
      .select('*, resellers(*)')
      .eq('is_deleted', false)
      .order('priority', { ascending: true });

    if (resellerId) {
      query = query.eq('reseller_id', resellerId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching scopes:', error);
    } else {
      setScopes(data || []);
    }
    setLoading(false);
  }, [user, resellerId]);

  useEffect(() => {
    fetchScopes();
  }, [fetchScopes]);

  const createScope = async (scope: ResellerScopeInsert) => {
    const { data, error } = await supabase
      .from('reseller_scopes')
      .insert({ ...scope, assigned_by: user?.id })
      .select()
      .single();

    if (error) {
      console.error('Error creating scope:', error);
      toast.error('Failed to assign scope');
      return null;
    }

    toast.success('Scope assigned successfully');
    fetchScopes();
    return data;
  };

  const updateScope = async (id: string, updates: Partial<ResellerScope>) => {
    const { error } = await supabase
      .from('reseller_scopes')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating scope:', error);
      toast.error('Failed to update scope');
      return false;
    }

    toast.success('Scope updated successfully');
    fetchScopes();
    return true;
  };

  const deleteScope = async (id: string) => {
    const { error } = await supabase
      .from('reseller_scopes')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) {
      console.error('Error deleting scope:', error);
      toast.error('Failed to delete scope');
      return false;
    }

    toast.success('Scope removed successfully');
    fetchScopes();
    return true;
  };

  return { scopes, loading, fetchScopes, createScope, updateScope, deleteScope };
}

// Hook for Lead Distribution Rules
export function useLeadDistributionRules() {
  const { user } = useAuth();
  const [rules, setRules] = useState<LeadDistributionRule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRules = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('lead_distribution_rules')
      .select('*')
      .eq('is_deleted', false)
      .order('priority', { ascending: true });

    if (error) {
      console.error('Error fetching rules:', error);
    } else {
      setRules(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const createRule = async (rule: LeadDistributionRuleInsert) => {
    const { data, error } = await supabase
      .from('lead_distribution_rules')
      .insert({ ...rule, created_by: user?.id })
      .select()
      .single();

    if (error) {
      console.error('Error creating rule:', error);
      toast.error('Failed to create rule');
      return null;
    }

    toast.success('Rule created successfully');
    fetchRules();
    return data;
  };

  const updateRule = async (id: string, updates: Partial<LeadDistributionRule>) => {
    const { error } = await supabase
      .from('lead_distribution_rules')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating rule:', error);
      toast.error('Failed to update rule');
      return false;
    }

    toast.success('Rule updated successfully');
    fetchRules();
    return true;
  };

  const deleteRule = async (id: string) => {
    const { error } = await supabase
      .from('lead_distribution_rules')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) {
      console.error('Error deleting rule:', error);
      toast.error('Failed to delete rule');
      return false;
    }

    toast.success('Rule deleted successfully');
    fetchRules();
    return true;
  };

  return { rules, loading, fetchRules, createRule, updateRule, deleteRule };
}

// Hook for Reseller Wallets
export function useResellerWallets(resellerId?: string) {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<ResellerWallet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWallets = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    
    let query = supabase
      .from('reseller_wallets')
      .select('*, resellers(*)')
      .order('balance', { ascending: false });

    if (resellerId) {
      query = query.eq('reseller_id', resellerId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching wallets:', error);
    } else {
      setWallets(data || []);
    }
    setLoading(false);
  }, [user, resellerId]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const addTransaction = async (transaction: Omit<WalletLedgerInsert, 'balance_before' | 'balance_after'>) => {
    // Get current wallet balance
    const { data: wallet } = await supabase
      .from('reseller_wallets')
      .select('balance')
      .eq('id', transaction.wallet_id)
      .single();

    if (!wallet) {
      toast.error('Wallet not found');
      return null;
    }

    const balanceBefore = Number(wallet.balance);
    const balanceAfter = transaction.transaction_type === 'credit' || transaction.transaction_type === 'adjustment'
      ? balanceBefore + transaction.amount
      : balanceBefore - transaction.amount;

    // Insert ledger entry
    const { data, error } = await supabase
      .from('wallet_ledger')
      .insert({
        ...transaction,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        performed_by: user?.id,
        performed_by_name: user?.email
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
      return null;
    }

    // Update wallet balance
    await supabase
      .from('reseller_wallets')
      .update({ balance: balanceAfter })
      .eq('id', transaction.wallet_id);

    toast.success('Transaction added successfully');
    fetchWallets();
    return data;
  };

  const lockWallet = async (walletId: string, reason: string) => {
    const { error } = await supabase
      .from('reseller_wallets')
      .update({
        is_locked: true,
        locked_reason: reason,
        locked_at: new Date().toISOString(),
        locked_by: user?.id
      })
      .eq('id', walletId);

    if (error) {
      console.error('Error locking wallet:', error);
      toast.error('Failed to lock wallet');
      return false;
    }

    toast.success('Wallet locked successfully');
    fetchWallets();
    return true;
  };

  const unlockWallet = async (walletId: string) => {
    const { error } = await supabase
      .from('reseller_wallets')
      .update({
        is_locked: false,
        locked_reason: null,
        locked_at: null,
        locked_by: null
      })
      .eq('id', walletId);

    if (error) {
      console.error('Error unlocking wallet:', error);
      toast.error('Failed to unlock wallet');
      return false;
    }

    toast.success('Wallet unlocked successfully');
    fetchWallets();
    return true;
  };

  return { wallets, loading, fetchWallets, addTransaction, lockWallet, unlockWallet };
}

// Hook for Wallet Ledger
export function useWalletLedger(walletId?: string, resellerId?: string) {
  const { user } = useAuth();
  const [ledger, setLedger] = useState<WalletLedger[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedger = async () => {
      if (!user) return;
      
      let query = supabase
        .from('wallet_ledger')
        .select('*')
        .order('created_at', { ascending: false });

      if (walletId) {
        query = query.eq('wallet_id', walletId);
      }
      if (resellerId) {
        query = query.eq('reseller_id', resellerId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching ledger:', error);
      } else {
        setLedger(data || []);
      }
      setLoading(false);
    };

    fetchLedger();
  }, [user, walletId, resellerId]);

  return { ledger, loading };
}

// Hook for Reseller Performance
export function useResellerPerformance(resellerId?: string) {
  const { user } = useAuth();
  const [performance, setPerformance] = useState<ResellerPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      if (!user) return;
      
      let query = supabase
        .from('reseller_performance')
        .select('*, resellers(*)')
        .eq('is_deleted', false)
        .order('period_start', { ascending: false });

      if (resellerId) {
        query = query.eq('reseller_id', resellerId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching performance:', error);
      } else {
        setPerformance(data || []);
      }
      setLoading(false);
    };

    fetchPerformance();
  }, [user, resellerId]);

  return { performance, loading };
}

// Hook for Reseller Violations
export function useResellerViolations(resellerId?: string) {
  const { user } = useAuth();
  const [violations, setViolations] = useState<ResellerViolation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchViolations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    
    let query = supabase
      .from('reseller_violations')
      .select('*, resellers(*)')
      .eq('is_deleted', false)
      .order('reported_at', { ascending: false });

    if (resellerId) {
      query = query.eq('reseller_id', resellerId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching violations:', error);
    } else {
      setViolations(data || []);
    }
    setLoading(false);
  }, [user, resellerId]);

  useEffect(() => {
    fetchViolations();
  }, [fetchViolations]);

  const createViolation = async (violation: ResellerViolationInsert) => {
    const { data, error } = await supabase
      .from('reseller_violations')
      .insert({ ...violation, reported_by: user?.id })
      .select()
      .single();

    if (error) {
      console.error('Error creating violation:', error);
      toast.error('Failed to report violation');
      return null;
    }

    toast.success('Violation reported successfully');
    fetchViolations();
    return data;
  };

  const updateViolation = async (id: string, updates: ResellerViolationUpdate) => {
    const { error } = await supabase
      .from('reseller_violations')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating violation:', error);
      toast.error('Failed to update violation');
      return false;
    }

    toast.success('Violation updated successfully');
    fetchViolations();
    return true;
  };

  const issueWarning = async (id: string) => {
    const { error } = await supabase
      .from('reseller_violations')
      .update({
        status: 'warning_issued' as const,
        warning_issued_at: new Date().toISOString(),
        warning_issued_by: user?.id
      })
      .eq('id', id);

    if (error) {
      console.error('Error issuing warning:', error);
      toast.error('Failed to issue warning');
      return false;
    }

    toast.success('Warning issued successfully');
    fetchViolations();
    return true;
  };

  const closeViolation = async (id: string, notes: string) => {
    const { error } = await supabase
      .from('reseller_violations')
      .update({
        status: 'closed' as const,
        resolution_notes: notes,
        resolved_at: new Date().toISOString(),
        resolved_by: user?.id
      })
      .eq('id', id);

    if (error) {
      console.error('Error closing violation:', error);
      toast.error('Failed to close violation');
      return false;
    }

    toast.success('Violation closed successfully');
    fetchViolations();
    return true;
  };

  return { violations, loading, fetchViolations, createViolation, updateViolation, issueWarning, closeViolation };
}

// Hook for Dashboard Stats
export function useResellerDashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ResellerDashboardStats>({
    totalResellers: 0,
    activeResellers: 0,
    pausedResellers: 0,
    pendingResellers: 0,
    leadsToday: 0,
    avgConversionRate: 0,
    totalWalletBalance: 0,
    openViolations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      // Fetch reseller counts
      const { data: resellers } = await supabase
        .from('resellers')
        .select('status')
        .eq('is_deleted', false);

      // Fetch wallet balances
      const { data: wallets } = await supabase
        .from('reseller_wallets')
        .select('balance');

      // Fetch open violations
      const { data: violations } = await supabase
        .from('reseller_violations')
        .select('id')
        .eq('status', 'open')
        .eq('is_deleted', false);

      // Fetch performance for conversion rate
      const { data: performance } = await supabase
        .from('reseller_performance')
        .select('conversion_rate')
        .eq('is_deleted', false);

      if (resellers) {
        const active = resellers.filter(r => r.status === 'active').length;
        const paused = resellers.filter(r => r.status === 'paused').length;
        const pending = resellers.filter(r => r.status === 'pending').length;

        const totalBalance = wallets?.reduce((sum, w) => sum + Number(w.balance), 0) || 0;
        const avgConversion = performance && performance.length > 0
          ? performance.reduce((sum, p) => sum + Number(p.conversion_rate), 0) / performance.length
          : 0;

        setStats({
          totalResellers: resellers.length,
          activeResellers: active,
          pausedResellers: paused,
          pendingResellers: pending,
          leadsToday: 0, // Would need to query leads table
          avgConversionRate: Math.round(avgConversion * 100) / 100,
          totalWalletBalance: totalBalance,
          openViolations: violations?.length || 0
        });
      }

      setLoading(false);
    };

    fetchStats();
  }, [user]);

  return { stats, loading };
}

// Realtime hook
export function useResellerRealtime(onUpdate: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('reseller-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resellers' }, onUpdate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reseller_scopes' }, onUpdate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reseller_wallets' }, onUpdate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reseller_violations' }, onUpdate)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);
}
