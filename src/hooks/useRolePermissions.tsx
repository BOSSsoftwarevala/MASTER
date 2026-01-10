import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Role = Database['public']['Tables']['roles']['Row'];
type Permission = Database['public']['Tables']['permissions']['Row'];
type RolePermission = Database['public']['Tables']['role_permissions']['Row'];
type TempAccessGrant = Database['public']['Tables']['temp_access_grants']['Row'];
type AccessRequest = Database['public']['Tables']['access_requests']['Row'];
type AccessViolation = Database['public']['Tables']['access_violations']['Row'];
type RoleAuditLog = Database['public']['Tables']['role_audit_logs']['Row'];

// Fetch roles registry
export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Role[];
    },
  });
}

// Fetch permissions
export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('module', { ascending: true });
      
      if (error) throw error;
      return data as Permission[];
    },
  });
}

// Fetch role permissions matrix
export function useRolePermissions() {
  return useQuery({
    queryKey: ['role_permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          *,
          roles:role_id(id, name, role_key),
          permissions:permission_id(id, feature_key, feature_name, module)
        `);
      
      if (error) throw error;
      return data;
    },
  });
}

// Fetch temp access grants
export function useTempAccessGrants() {
  return useQuery({
    queryKey: ['temp_access_grants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temp_access_grants')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TempAccessGrant[];
    },
  });
}

// Fetch access requests
export function useAccessRequests(status?: 'pending' | 'approved' | 'rejected' | 'expired') {
  return useQuery({
    queryKey: ['access_requests', status],
    queryFn: async () => {
      let query = supabase
        .from('access_requests')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as AccessRequest[];
    },
  });
}

// Fetch access violations
export function useAccessViolations() {
  return useQuery({
    queryKey: ['access_violations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('access_violations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as AccessViolation[];
    },
  });
}

// Fetch role audit logs
export function useRoleAuditLogs() {
  return useQuery({
    queryKey: ['role_audit_logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as RoleAuditLog[];
    },
  });
}

// Update access request status
export function useUpdateAccessRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      reviewedBy,
      reviewNotes 
    }: { 
      id: string; 
      status: 'approved' | 'rejected';
      reviewedBy: string;
      reviewNotes?: string;
    }) => {
      const { data, error } = await supabase
        .from('access_requests')
        .update({
          status,
          reviewed_by: reviewedBy,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access_requests'] });
      toast({
        title: 'Request Updated',
        description: 'Access request has been processed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update access request.',
        variant: 'destructive',
      });
    },
  });
}

// Grant temp access
export function useGrantTempAccess() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (grant: {
      user_id: string;
      role_key: string;
      reason: string;
      granted_by: string;
      expires_at: string;
    }) => {
      const { data, error } = await supabase
        .from('temp_access_grants')
        .insert({
          user_id: grant.user_id,
          role_key: grant.role_key as any,
          reason: grant.reason,
          granted_by: grant.granted_by,
          expires_at: grant.expires_at,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['temp_access_grants'] });
      toast({
        title: 'Access Granted',
        description: 'Temporary access has been granted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to grant temporary access.',
        variant: 'destructive',
      });
    },
  });
}

// Revoke temp access
export function useRevokeTempAccess() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('temp_access_grants')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['temp_access_grants'] });
      toast({
        title: 'Access Revoked',
        description: 'Temporary access has been revoked.',
      });
    },
  });
}

// Realtime hook for access requests and temp access
export function useRolePermissionsRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('role-permissions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'access_requests' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['access_requests'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'temp_access_grants' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['temp_access_grants'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
