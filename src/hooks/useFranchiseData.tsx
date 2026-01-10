import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type FranchiseStatus = Database['public']['Enums']['franchise_status'];
type FranchisePlanTier = Database['public']['Enums']['franchise_plan_tier'];
type TerritoryType = Database['public']['Enums']['territory_type'];
type FranchiseViolationType = Database['public']['Enums']['franchise_violation_type'];
type FranchiseViolationStatus = Database['public']['Enums']['franchise_violation_status'];
type AccessRequestStatus = Database['public']['Enums']['access_request_status'];

// Franchise Plans
export function useFranchisePlans() {
  return useQuery({
    queryKey: ['franchise-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('franchise_plans')
        .select('*')
        .eq('is_active', true)
        .order('setup_fee', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

// Franchises
export function useFranchises() {
  return useQuery({
    queryKey: ['franchises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('franchises')
        .select(`
          *,
          franchise_plans(*)
        `)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// Franchise Applications
export function useFranchiseApplications(status?: AccessRequestStatus) {
  return useQuery({
    queryKey: ['franchise-applications', status],
    queryFn: async () => {
      let query = supabase
        .from('franchise_applications')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

// Franchise Territories
export function useFranchiseTerritories() {
  return useQuery({
    queryKey: ['franchise-territories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('franchise_territories')
        .select(`
          *,
          franchises(id, legal_name, business_name, status)
        `)
        .eq('is_deleted', false)
        .order('country', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

// Franchise Performance
export function useFranchisePerformance() {
  return useQuery({
    queryKey: ['franchise-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('franchise_performance')
        .select(`
          *,
          franchises(id, legal_name, business_name, status)
        `)
        .eq('is_deleted', false)
        .order('period_end', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// Franchise Wallets
export function useFranchiseWallets() {
  return useQuery({
    queryKey: ['franchise-wallets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('franchise_wallets')
        .select(`
          *,
          franchises(id, legal_name, business_name, status)
        `)
        .order('balance', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// Franchise Violations
export function useFranchiseViolations(status?: FranchiseViolationStatus) {
  return useQuery({
    queryKey: ['franchise-violations', status],
    queryFn: async () => {
      let query = supabase
        .from('franchise_violations')
        .select(`
          *,
          franchises(id, legal_name, business_name, status)
        `)
        .eq('is_deleted', false)
        .order('reported_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

// Franchise Audit Logs
export function useFranchiseAuditLogs() {
  return useQuery({
    queryKey: ['franchise-audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('franchise_audit_logs')
        .select(`
          *,
          franchises(id, legal_name, business_name)
        `)
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });
}

// Mutations
export function useUpdateFranchiseApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      reviewedBy,
      reviewNotes,
      rejectionReason
    }: { 
      id: string; 
      status: AccessRequestStatus;
      reviewedBy: string;
      reviewNotes?: string;
      rejectionReason?: string;
    }) => {
      const { data, error } = await supabase
        .from('franchise_applications')
        .update({
          status,
          reviewed_by: reviewedBy,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes,
          rejection_reason: rejectionReason,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['franchise-applications'] });
      toast.success('Application updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update application');
      console.error(error);
    },
  });
}

export function useUpdateFranchiseViolation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      status,
      warningIssuedBy,
      resolvedBy,
      resolutionNotes
    }: { 
      id: string; 
      status: FranchiseViolationStatus;
      warningIssuedBy?: string;
      resolvedBy?: string;
      resolutionNotes?: string;
    }) => {
      const updateData: Record<string, unknown> = { status };
      
      if (status === 'warning_issued' && warningIssuedBy) {
        updateData.warning_issued_at = new Date().toISOString();
        updateData.warning_issued_by = warningIssuedBy;
      }
      
      if (status === 'resolved' && resolvedBy) {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolved_by = resolvedBy;
        updateData.resolution_notes = resolutionNotes;
      }
      
      const { data, error } = await supabase
        .from('franchise_violations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['franchise-violations'] });
      toast.success('Violation updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update violation');
      console.error(error);
    },
  });
}

export function useUpdateFranchiseTerritory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      franchiseId,
      territoryType,
      isActive,
      notes
    }: { 
      id: string; 
      franchiseId?: string;
      territoryType?: TerritoryType;
      isActive?: boolean;
      notes?: string;
    }) => {
      const updateData: Record<string, unknown> = {};
      if (franchiseId) updateData.franchise_id = franchiseId;
      if (territoryType) updateData.territory_type = territoryType;
      if (isActive !== undefined) updateData.is_active = isActive;
      if (notes) updateData.notes = notes;
      
      const { data, error } = await supabase
        .from('franchise_territories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['franchise-territories'] });
      toast.success('Territory updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update territory');
      console.error(error);
    },
  });
}

// Realtime subscription
export function useFranchiseRealtime() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const channel = supabase
      .channel('franchise-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'franchise_applications' },
        () => queryClient.invalidateQueries({ queryKey: ['franchise-applications'] })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'franchise_violations' },
        () => queryClient.invalidateQueries({ queryKey: ['franchise-violations'] })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'franchise_territories' },
        () => queryClient.invalidateQueries({ queryKey: ['franchise-territories'] })
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
