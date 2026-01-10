import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Json } from '@/integrations/supabase/types';

// Types
export interface Developer {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  skill_set: string[];
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
  status: 'active' | 'inactive' | 'suspended';
  avatar_url: string | null;
  phone: string | null;
  department: string | null;
  joined_at: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  access_expires_at: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  tech_stack: string[];
  category: string | null;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
  start_date: string | null;
  end_date: string | null;
  estimated_hours: number | null;
  actual_hours: number;
  repo_url: string | null;
  staging_url: string | null;
  production_url: string | null;
  lead_developer_id: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to: string | null;
  estimated_hours: number | null;
  actual_hours: number;
  due_date: string | null;
  completed_at: string | null;
  parent_task_id: string | null;
  tags: string[];
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  milestone_id: string | null;
  blocked_reason: string | null;
}

export interface TaskComment {
  id: string;
  task_id: string;
  content: string;
  author_id: string | null;
  author_name: string | null;
  created_at: string;
}

export interface Bug {
  id: string;
  project_id: string;
  task_id: string | null;
  title: string;
  description: string | null;
  steps_to_reproduce: string | null;
  expected_behavior: string | null;
  actual_behavior: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'blocker';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'wont_fix';
  assigned_to: string | null;
  reported_by: string | null;
  reporter_name: string | null;
  environment: string | null;
  browser: string | null;
  attachments: Json;
  resolved_at: string | null;
  resolved_by: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface QATest {
  id: string;
  project_id: string;
  build_request_id: string | null;
  name: string;
  description: string | null;
  test_type: string;
  status: 'pending' | 'passed' | 'failed' | 'skipped';
  executed_by: string | null;
  executed_at: string | null;
  expected_result: string | null;
  actual_result: string | null;
  notes: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// Developer Hooks
export function useDevelopers() {
  return useQuery({
    queryKey: ['developers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('*')
        .eq('is_deleted', false)
        .order('name');
      if (error) throw error;
      return data as Developer[];
    },
  });
}

export function useActiveDevelopers() {
  return useQuery({
    queryKey: ['developers', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('*')
        .eq('is_deleted', false)
        .eq('status', 'active')
        .order('name');
      if (error) throw error;
      return data as Developer[];
    },
  });
}

export function useCreateDeveloper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (developer: Omit<Developer, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>) => {
      const { data, error } = await supabase.from('developers').insert(developer).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developers'] });
      toast.success('Developer added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add developer: ${error.message}`);
    },
  });
}

export function useUpdateDeveloper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Developer> & { id: string }) => {
      const { data, error } = await supabase.from('developers').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developers'] });
      toast.success('Developer updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update developer: ${error.message}`);
    },
  });
}

export function useDeleteDeveloper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('developers').update({ is_deleted: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developers'] });
      toast.success('Developer removed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove developer: ${error.message}`);
    },
  });
}

// Project Hooks
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useActiveProjects() {
  return useQuery({
    queryKey: ['projects', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_deleted', false)
        .in('status', ['planning', 'active', 'on_hold'])
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'is_deleted' | 'actual_hours'>) => {
      const { data, error } = await supabase.from('projects').insert(project).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create project: ${error.message}`);
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update project: ${error.message}`);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').update({ is_deleted: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project archived successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to archive project: ${error.message}`);
    },
  });
}

// Task Hooks
export function useTasks(projectId?: string) {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      let query = supabase.from('tasks').select('*').eq('is_deleted', false);
      if (projectId) query = query.eq('project_id', projectId);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as Task[];
    },
  });
}

export function useTasksByStatus(status: Task['status']) {
  return useQuery({
    queryKey: ['tasks', 'status', status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('is_deleted', false)
        .eq('status', status)
        .order('priority', { ascending: false });
      if (error) throw error;
      return data as Task[];
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'is_deleted' | 'actual_hours' | 'completed_at'>) => {
      const { data, error } = await supabase.from('tasks').insert(task).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update task: ${error.message}`);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').update({ is_deleted: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete task: ${error.message}`);
    },
  });
}

// Task Comments
export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: ['task-comments', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_comments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as TaskComment[];
    },
    enabled: !!taskId,
  });
}

export function useCreateTaskComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comment: Omit<TaskComment, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('task_comments').insert(comment).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task-comments', variables.task_id] });
      toast.success('Comment added');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add comment: ${error.message}`);
    },
  });
}

// Bug Hooks
export function useBugs(projectId?: string) {
  return useQuery({
    queryKey: ['bugs', projectId],
    queryFn: async () => {
      let query = supabase.from('bugs').select('*').eq('is_deleted', false);
      if (projectId) query = query.eq('project_id', projectId);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as Bug[];
    },
  });
}

export function useOpenBugs() {
  return useQuery({
    queryKey: ['bugs', 'open'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bugs')
        .select('*')
        .eq('is_deleted', false)
        .in('status', ['open', 'in_progress'])
        .order('severity', { ascending: false });
      if (error) throw error;
      return data as Bug[];
    },
  });
}

export function useCreateBug() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bug: Omit<Bug, 'id' | 'created_at' | 'updated_at' | 'is_deleted' | 'resolved_at' | 'resolved_by'>) => {
      const { data, error } = await supabase.from('bugs').insert(bug).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugs'] });
      toast.success('Bug reported successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to report bug: ${error.message}`);
    },
  });
}

export function useUpdateBug() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Bug> & { id: string }) => {
      const { data, error } = await supabase.from('bugs').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugs'] });
      toast.success('Bug updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update bug: ${error.message}`);
    },
  });
}

// QA Test Hooks
export function useQATests(projectId?: string) {
  return useQuery({
    queryKey: ['qa-tests', projectId],
    queryFn: async () => {
      let query = supabase.from('qa_tests').select('*').eq('is_deleted', false);
      if (projectId) query = query.eq('project_id', projectId);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as QATest[];
    },
  });
}

export function useCreateQATest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (test: Omit<QATest, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>) => {
      const { data, error } = await supabase.from('qa_tests').insert(test).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa-tests'] });
      toast.success('QA test created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create QA test: ${error.message}`);
    },
  });
}

export function useUpdateQATest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<QATest> & { id: string }) => {
      const { data, error } = await supabase.from('qa_tests').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa-tests'] });
      toast.success('QA test updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update QA test: ${error.message}`);
    },
  });
}

// Stats
export function useDevelopmentStats() {
  return useQuery({
    queryKey: ['development-stats'],
    queryFn: async () => {
      const [developersRes, projectsRes, tasksRes, bugsRes, qaTestsRes] = await Promise.all([
        supabase.from('developers').select('id, status', { count: 'exact' }).eq('is_deleted', false),
        supabase.from('projects').select('id, status', { count: 'exact' }).eq('is_deleted', false),
        supabase.from('tasks').select('id, status', { count: 'exact' }).eq('is_deleted', false),
        supabase.from('bugs').select('id, status', { count: 'exact' }).eq('is_deleted', false),
        supabase.from('qa_tests').select('id, status', { count: 'exact' }).eq('is_deleted', false),
      ]);

      const developers = developersRes.data || [];
      const projects = projectsRes.data || [];
      const tasks = tasksRes.data || [];
      const bugs = bugsRes.data || [];
      const qaTests = qaTestsRes.data || [];

      const activeDevelopers = developers.filter(d => d.status === 'active').length;
      const activeProjects = projects.filter(p => ['planning', 'active', 'on_hold'].includes(p.status)).length;
      const openTasks = tasks.filter(t => !['completed', 'cancelled'].includes(t.status)).length;
      const openBugs = bugs.filter(b => ['open', 'in_progress'].includes(b.status)).length;
      const passedTests = qaTests.filter(t => t.status === 'passed').length;
      const qaPassRate = qaTests.length > 0 ? Math.round((passedTests / qaTests.length) * 100) : 0;

      return {
        totalDevelopers: developers.length,
        activeDevelopers,
        totalProjects: projects.length,
        activeProjects,
        totalTasks: tasks.length,
        openTasks,
        totalBugs: bugs.length,
        openBugs,
        totalTests: qaTests.length,
        qaPassRate,
      };
    },
  });
}

// Real-time hook
export function useDevelopmentRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('development-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'developers' }, () => {
        queryClient.invalidateQueries({ queryKey: ['developers'] });
        queryClient.invalidateQueries({ queryKey: ['development-stats'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['development-stats'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['development-stats'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bugs' }, () => {
        queryClient.invalidateQueries({ queryKey: ['bugs'] });
        queryClient.invalidateQueries({ queryKey: ['development-stats'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'qa_tests' }, () => {
        queryClient.invalidateQueries({ queryKey: ['qa-tests'] });
        queryClient.invalidateQueries({ queryKey: ['development-stats'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'milestones' }, () => {
        queryClient.invalidateQueries({ queryKey: ['milestones'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pull_requests' }, () => {
        queryClient.invalidateQueries({ queryKey: ['pull-requests'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'code_reviews' }, () => {
        queryClient.invalidateQueries({ queryKey: ['code-reviews'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'qa_approvals' }, () => {
        queryClient.invalidateQueries({ queryKey: ['qa-approvals'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

// ============ NEW TYPES ============

export interface Milestone {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  status: 'active' | 'completed' | 'cancelled';
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  progress: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface PullRequest {
  id: string;
  project_id: string;
  task_id: string | null;
  title: string;
  description: string | null;
  source_branch: string;
  target_branch: string;
  status: 'open' | 'approved' | 'merged' | 'rejected' | 'closed';
  author_id: string | null;
  reviewer_id: string | null;
  pr_url: string | null;
  merge_commit_hash: string | null;
  merged_at: string | null;
  merged_by: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CodeReview {
  id: string;
  pull_request_id: string;
  reviewer_id: string | null;
  reviewer_name: string | null;
  status: 'pending' | 'approved' | 'changes_requested' | 'rejected';
  comments: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QAApproval {
  id: string;
  build_request_id: string | null;
  project_id: string | null;
  status: 'pending' | 'approved' | 'rejected';
  approved_by: string | null;
  approver_name: string | null;
  notes: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============ MILESTONE HOOKS ============

export function useMilestones(projectId?: string) {
  return useQuery({
    queryKey: ['milestones', projectId],
    queryFn: async () => {
      let query = supabase.from('milestones').select('*').eq('is_deleted', false);
      if (projectId) query = query.eq('project_id', projectId);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as Milestone[];
    },
  });
}

export function useCreateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at' | 'is_deleted' | 'completed_at'>) => {
      const { data, error } = await supabase.from('milestones').insert(milestone).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      toast.success('Milestone created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create milestone: ${error.message}`);
    },
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Milestone> & { id: string }) => {
      const { data, error } = await supabase.from('milestones').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      toast.success('Milestone updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update milestone: ${error.message}`);
    },
  });
}

// ============ PULL REQUEST HOOKS ============

export function usePullRequests(projectId?: string) {
  return useQuery({
    queryKey: ['pull-requests', projectId],
    queryFn: async () => {
      let query = supabase.from('pull_requests').select('*').eq('is_deleted', false);
      if (projectId) query = query.eq('project_id', projectId);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as PullRequest[];
    },
  });
}

export function useCreatePullRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pr: Omit<PullRequest, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>) => {
      const { data, error } = await supabase.from('pull_requests').insert(pr).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pull-requests'] });
      toast.success('Pull request created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create pull request: ${error.message}`);
    },
  });
}

export function useUpdatePullRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PullRequest> & { id: string }) => {
      const { data, error } = await supabase.from('pull_requests').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pull-requests'] });
      toast.success('Pull request updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update pull request: ${error.message}`);
    },
  });
}

// ============ CODE REVIEW HOOKS ============

export function useCodeReviews(prId?: string) {
  return useQuery({
    queryKey: ['code-reviews', prId],
    queryFn: async () => {
      let query = supabase.from('code_reviews').select('*');
      if (prId) query = query.eq('pull_request_id', prId);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as CodeReview[];
    },
  });
}

export function useUpdateCodeReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CodeReview> & { id: string }) => {
      const { data, error } = await supabase.from('code_reviews').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['code-reviews'] });
      toast.success('Code review updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update code review: ${error.message}`);
    },
  });
}

// ============ QA APPROVAL HOOKS ============

export function useQAApprovals() {
  return useQuery({
    queryKey: ['qa-approvals'],
    queryFn: async () => {
      const { data, error } = await supabase.from('qa_approvals').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as QAApproval[];
    },
  });
}

export function useCreateQAApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (approval: Omit<QAApproval, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('qa_approvals').insert(approval).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa-approvals'] });
      toast.success('QA approval requested successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create QA approval: ${error.message}`);
    },
  });
}

export function useUpdateQAApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<QAApproval> & { id: string }) => {
      const { data, error } = await supabase.from('qa_approvals').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa-approvals'] });
      toast.success('QA approval updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update QA approval: ${error.message}`);
    },
  });
}

// ============ FAILED BUILDS HOOK ============

export function useFailedBuilds() {
  return useQuery({
    queryKey: ['builds', 'failed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('build_requests')
        .select('*')
        .eq('status', 'failed')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
