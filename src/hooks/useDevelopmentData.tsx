import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Types based on database schema
export interface BuildRequest {
  id: string;
  repo_name: string;
  branch: string;
  commit_hash: string | null;
  commit_message: string | null;
  build_type: 'development' | 'staging' | 'production';
  status: 'pending' | 'queued' | 'building' | 'success' | 'failed' | 'cancelled';
  requested_by: string;
  approved_by: string | null;
  approved_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  build_duration_seconds: number | null;
  error_message: string | null;
  build_logs: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface DeployRequest {
  id: string;
  build_request_id: string | null;
  environment: 'development' | 'staging' | 'production';
  version: string;
  release_notes: string | null;
  risk_level: string | null;
  rollback_plan: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'deploying' | 'success' | 'failed' | 'rolled_back';
  requested_by: string;
  approved_by: string | null;
  approved_at: string | null;
  rejected_by: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  deployed_at: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface TestResult {
  id: string;
  build_request_id: string | null;
  test_type: string;
  test_name: string;
  status: string;
  duration_ms: number | null;
  error_message: string | null;
  stack_trace: string | null;
  coverage_percent: number | null;
  total_tests: number | null;
  passed_tests: number | null;
  failed_tests: number | null;
  skipped_tests: number | null;
  created_at: string;
}

export interface DeployIncident {
  id: string;
  deploy_request_id: string | null;
  title: string;
  description: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  root_cause: string | null;
  resolution: string | null;
  recovery_time_minutes: number | null;
  affected_services: string[] | null;
  reported_by: string;
  assigned_to: string | null;
  escalated_to: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface RollbackRequest {
  id: string;
  deploy_request_id: string | null;
  target_version: string;
  reason: string;
  impact_scope: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'deploying' | 'success' | 'failed' | 'rolled_back';
  requested_by: string;
  approved_by: string | null;
  approved_at: string | null;
  executed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Build Requests Hooks
export const useBuildRequests = () => {
  return useQuery({
    queryKey: ['build-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('build_requests')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BuildRequest[];
    },
  });
};

export const usePendingBuildRequests = () => {
  return useQuery({
    queryKey: ['build-requests', 'pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('build_requests')
        .select('*')
        .eq('is_deleted', false)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BuildRequest[];
    },
  });
};

export const useCreateBuildRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (buildRequest: { repo_name: string; branch: string; commit_hash?: string | null; build_type: 'development' | 'staging' | 'production'; status?: 'pending' }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('build_requests')
        .insert({
          repo_name: buildRequest.repo_name,
          branch: buildRequest.branch,
          commit_hash: buildRequest.commit_hash || null,
          build_type: buildRequest.build_type,
          status: buildRequest.status || 'pending',
          requested_by: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['build-requests'] });
      toast.success("Build request submitted for approval");
    },
    onError: (error: Error) => {
      toast.error("Failed to submit build request", { description: error.message });
    },
  });
};

// Deploy Requests Hooks
export const useDeployRequests = () => {
  return useQuery({
    queryKey: ['deploy-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deploy_requests')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DeployRequest[];
    },
  });
};

export const usePendingDeployRequests = () => {
  return useQuery({
    queryKey: ['deploy-requests', 'pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deploy_requests')
        .select('*')
        .eq('is_deleted', false)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DeployRequest[];
    },
  });
};

export const useUpdateDeployRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, status, rejection_reason }: { id: string; status: string; rejection_reason?: string }) => {
      const updateData: Record<string, unknown> = { status };
      
      if (status === 'approved') {
        updateData.approved_by = user?.id;
        updateData.approved_at = new Date().toISOString();
      } else if (status === 'rejected') {
        updateData.rejected_by = user?.id;
        updateData.rejected_at = new Date().toISOString();
        if (rejection_reason) updateData.rejection_reason = rejection_reason;
      }

      const { data, error } = await supabase
        .from('deploy_requests')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deploy-requests'] });
      toast.success(variables.status === 'approved' ? "Deployment approved" : "Deployment rejected");
    },
    onError: (error: Error) => {
      toast.error("Failed to update deployment", { description: error.message });
    },
  });
};

// Test Results Hooks
export const useTestResults = () => {
  return useQuery({
    queryKey: ['test-results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TestResult[];
    },
  });
};

export const useTestResultsByBuild = (buildId: string | null) => {
  return useQuery({
    queryKey: ['test-results', buildId],
    queryFn: async () => {
      if (!buildId) return [];
      
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('build_request_id', buildId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TestResult[];
    },
    enabled: !!buildId,
  });
};

// Deploy Incidents Hooks
export const useDeployIncidents = () => {
  return useQuery({
    queryKey: ['deploy-incidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deploy_incidents')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DeployIncident[];
    },
  });
};

export const useActiveDeployIncidents = () => {
  return useQuery({
    queryKey: ['deploy-incidents', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deploy_incidents')
        .select('*')
        .eq('is_deleted', false)
        .in('status', ['open', 'investigating'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DeployIncident[];
    },
  });
};

export const useUpdateDeployIncident = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, status, escalated_to }: { id: string; status?: string; escalated_to?: string }) => {
      const updateData: Record<string, unknown> = {};
      if (status) updateData.status = status;
      if (escalated_to) updateData.escalated_to = escalated_to;
      if (status === 'resolved') {
        updateData.resolved_by = user?.id;
        updateData.resolved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('deploy_incidents')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deploy-incidents'] });
      toast.success("Incident updated");
    },
    onError: (error: Error) => {
      toast.error("Failed to update incident", { description: error.message });
    },
  });
};

// Rollback Requests Hooks
export const useRollbackRequests = () => {
  return useQuery({
    queryKey: ['rollback-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rollback_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as RollbackRequest[];
    },
  });
};

export const usePendingRollbackRequests = () => {
  return useQuery({
    queryKey: ['rollback-requests', 'pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rollback_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as RollbackRequest[];
    },
  });
};

export const useCreateRollbackRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (rollbackRequest: { deploy_request_id?: string; target_version: string; reason: string; impact_scope?: string; status?: 'pending' }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('rollback_requests')
        .insert({
          deploy_request_id: rollbackRequest.deploy_request_id || null,
          target_version: rollbackRequest.target_version,
          reason: rollbackRequest.reason,
          impact_scope: rollbackRequest.impact_scope || null,
          status: rollbackRequest.status || 'pending',
          requested_by: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rollback-requests'] });
      toast.success("Rollback request submitted for approval");
    },
    onError: (error: Error) => {
      toast.error("Failed to submit rollback request", { description: error.message });
    },
  });
};

// Build Statistics
export const useBuildStats = () => {
  return useQuery({
    queryKey: ['build-stats'],
    queryFn: async () => {
      const { data: builds, error } = await supabase
        .from('build_requests')
        .select('status, build_duration_seconds, build_type')
        .eq('is_deleted', false);
      
      if (error) throw error;
      
      const total = builds?.length || 0;
      const success = builds?.filter(b => b.status === 'success').length || 0;
      const failed = builds?.filter(b => b.status === 'failed').length || 0;
      const pending = builds?.filter(b => b.status === 'pending').length || 0;
      const building = builds?.filter(b => b.status === 'building' || b.status === 'queued').length || 0;
      
      const successRate = total > 0 ? (success / total) * 100 : 0;
      
      const avgBuildTime = builds?.filter(b => b.build_duration_seconds)
        .reduce((acc, b) => acc + (b.build_duration_seconds || 0), 0) / 
        (builds?.filter(b => b.build_duration_seconds).length || 1);

      return {
        total,
        success,
        failed,
        pending,
        building,
        successRate,
        avgBuildTime,
      };
    },
  });
};
