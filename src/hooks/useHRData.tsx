import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface Employee {
  id: string;
  user_id?: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department?: string;
  designation?: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  status: 'active' | 'on_notice' | 'inactive' | 'terminated';
  joining_date?: string;
  notice_date?: string;
  exit_date?: string;
  reporting_to?: string;
  salary: number;
  avatar_url?: string;
  address?: Record<string, unknown>;
  emergency_contact?: Record<string, unknown>;
  bank_details?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_deleted: boolean;
}

export interface EmployeeDocument {
  id: string;
  employee_id: string;
  document_type: string;
  document_name: string;
  file_url?: string;
  uploaded_at: string;
  uploaded_by?: string;
  verified_at?: string;
  verified_by?: string;
  is_deleted: boolean;
}

export interface JobOpening {
  id: string;
  title: string;
  department?: string;
  description?: string;
  requirements?: string;
  location?: string;
  employment_type: string;
  salary_range_min?: number;
  salary_range_max?: number;
  positions_count: number;
  status: 'draft' | 'open' | 'closed' | 'on_hold';
  posted_at?: string;
  closes_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_deleted: boolean;
}

export interface JobApplication {
  id: string;
  job_id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone?: string;
  resume_url?: string;
  cover_letter?: string;
  status: 'applied' | 'screening' | 'shortlisted' | 'interview' | 'offered' | 'hired' | 'rejected';
  interview_date?: string;
  interview_notes?: string;
  rating?: number;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  job_openings?: JobOpening;
}

export interface AttendanceLog {
  id: string;
  employee_id: string;
  date: string;
  check_in?: string;
  check_out?: string;
  status: 'present' | 'absent' | 'half_day' | 'work_from_home' | 'on_leave';
  notes?: string;
  adjusted_by?: string;
  adjusted_at?: string;
  created_at: string;
  updated_at: string;
  employees?: Employee;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: 'casual' | 'sick' | 'earned' | 'maternity' | 'paternity' | 'unpaid' | 'other';
  start_date: string;
  end_date: string;
  days_count: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  employees?: Employee;
}

export interface PerformanceReview {
  id: string;
  employee_id: string;
  reviewer_id?: string;
  review_period_start: string;
  review_period_end: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'acknowledged' | 'closed';
  overall_rating?: number;
  goals_achieved?: string;
  strengths?: string;
  improvements?: string;
  reviewer_comments?: string;
  employee_comments?: string;
  submitted_at?: string;
  acknowledged_at?: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_deleted: boolean;
  employees?: Employee;
}

export interface EmployeeGoal {
  id: string;
  employee_id: string;
  title: string;
  description?: string;
  target_date?: string;
  status: 'active' | 'completed' | 'cancelled';
  progress: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_deleted: boolean;
  employees?: Employee;
}

export interface ExitRequest {
  id: string;
  employee_id: string;
  exit_type: 'resignation' | 'termination' | 'retirement' | 'end_of_contract';
  reason?: string;
  notice_date: string;
  last_working_date?: string;
  status: 'initiated' | 'in_progress' | 'clearance_pending' | 'completed' | 'cancelled';
  exit_interview_done: boolean;
  exit_interview_notes?: string;
  clearance_hr: boolean;
  clearance_it: boolean;
  clearance_finance: boolean;
  clearance_admin: boolean;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_deleted: boolean;
  employees?: Employee;
}

// Employee Hooks
export const useEmployees = (status?: string) => {
  return useQuery({
    queryKey: ['employees', status],
    queryFn: async () => {
      let query = supabase
        .from('employees')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Employee[];
    },
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Employee;
    },
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (employee: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from('employees')
        .insert(employee as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add employee: ' + error.message);
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from('employees')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update employee: ' + error.message);
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('employees')
        .update({ is_deleted: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee deactivated successfully');
    },
    onError: (error) => {
      toast.error('Failed to deactivate employee: ' + error.message);
    },
  });
};

// Job Opening Hooks
export const useJobOpenings = (status?: string) => {
  return useQuery({
    queryKey: ['job_openings', status],
    queryFn: async () => {
      let query = supabase
        .from('job_openings')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as JobOpening[];
    },
  });
};

export const useCreateJobOpening = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (job: Omit<JobOpening, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>) => {
      const { data, error } = await supabase
        .from('job_openings')
        .insert(job)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_openings'] });
      toast.success('Job opening created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create job opening: ' + error.message);
    },
  });
};

export const useUpdateJobOpening = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<JobOpening> & { id: string }) => {
      const { data, error } = await supabase
        .from('job_openings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_openings'] });
      toast.success('Job opening updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update job opening: ' + error.message);
    },
  });
};

// Job Application Hooks
export const useJobApplications = (status?: string) => {
  return useQuery({
    queryKey: ['job_applications', status],
    queryFn: async () => {
      let query = supabase
        .from('job_applications')
        .select('*, job_openings(title, department)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as JobApplication[];
    },
  });
};

export const useUpdateJobApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<JobApplication> & { id: string }) => {
      const { data, error } = await supabase
        .from('job_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_applications'] });
      toast.success('Application updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update application: ' + error.message);
    },
  });
};

// Attendance Hooks
export const useAttendanceLogs = (date?: string) => {
  return useQuery({
    queryKey: ['attendance_logs', date],
    queryFn: async () => {
      let query = supabase
        .from('attendance_logs')
        .select('*, employees(first_name, last_name, employee_code, department)')
        .order('date', { ascending: false });
      
      if (date) {
        query = query.eq('date', date);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as AttendanceLog[];
    },
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AttendanceLog> & { id: string }) => {
      const { data, error } = await supabase
        .from('attendance_logs')
        .update({ ...updates, adjusted_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance_logs'] });
      toast.success('Attendance updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update attendance: ' + error.message);
    },
  });
};

// Leave Request Hooks
export const useLeaveRequests = (status?: string) => {
  return useQuery({
    queryKey: ['leave_requests', status],
    queryFn: async () => {
      let query = supabase
        .from('leave_requests')
        .select('*, employees(first_name, last_name, employee_code, department)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as LeaveRequest[];
    },
  });
};

export const useUpdateLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<LeaveRequest> & { id: string }) => {
      const { data, error } = await supabase
        .from('leave_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave_requests'] });
      toast.success('Leave request updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update leave request: ' + error.message);
    },
  });
};

// Performance Review Hooks
export const usePerformanceReviews = (status?: string) => {
  return useQuery({
    queryKey: ['performance_reviews', status],
    queryFn: async () => {
      let query = supabase
        .from('performance_reviews')
        .select('*, employees!performance_reviews_employee_id_fkey(first_name, last_name, employee_code, department)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as PerformanceReview[];
    },
  });
};

export const useCreatePerformanceReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: Omit<PerformanceReview, 'id' | 'created_at' | 'updated_at' | 'is_deleted' | 'employees'>) => {
      const { data, error } = await supabase
        .from('performance_reviews')
        .insert(review)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance_reviews'] });
      toast.success('Performance review created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create performance review: ' + error.message);
    },
  });
};

export const useUpdatePerformanceReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PerformanceReview> & { id: string }) => {
      const { data, error } = await supabase
        .from('performance_reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance_reviews'] });
      toast.success('Performance review updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update performance review: ' + error.message);
    },
  });
};

// Employee Documents Hooks
export const useEmployeeDocuments = (employeeId?: string) => {
  return useQuery({
    queryKey: ['employee_documents', employeeId],
    queryFn: async () => {
      let query = supabase
        .from('employee_documents')
        .select('*, employees(first_name, last_name, employee_code)')
        .eq('is_deleted', false)
        .order('uploaded_at', { ascending: false });
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as (EmployeeDocument & { employees?: { first_name: string; last_name: string; employee_code: string } })[];
    },
  });
};

export const useCreateEmployeeDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (doc: Omit<EmployeeDocument, 'id' | 'uploaded_at' | 'is_deleted' | 'verified_at' | 'verified_by' | 'uploaded_by'>) => {
      const { data, error } = await supabase
        .from('employee_documents')
        .insert(doc)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee_documents'] });
      toast.success('Document uploaded successfully');
    },
    onError: (error) => {
      toast.error('Failed to upload document: ' + error.message);
    },
  });
};

// Employee Goals Hooks
export const useEmployeeGoals = (employeeId?: string) => {
  return useQuery({
    queryKey: ['employee_goals', employeeId],
    queryFn: async () => {
      let query = supabase
        .from('employee_goals')
        .select('*, employees(first_name, last_name)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as EmployeeGoal[];
    },
  });
};

export const useCreateEmployeeGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (goal: Omit<EmployeeGoal, 'id' | 'created_at' | 'updated_at' | 'is_deleted' | 'employees'>) => {
      const { data, error } = await supabase
        .from('employee_goals')
        .insert(goal)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee_goals'] });
      toast.success('Goal created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create goal: ' + error.message);
    },
  });
};

export const useUpdateEmployeeGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<EmployeeGoal> & { id: string }) => {
      const { data, error } = await supabase
        .from('employee_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee_goals'] });
      toast.success('Goal updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update goal: ' + error.message);
    },
  });
};

// Exit Request Hooks
export const useExitRequests = (status?: string) => {
  return useQuery({
    queryKey: ['exit_requests', status],
    queryFn: async () => {
      let query = supabase
        .from('exit_requests')
        .select('*, employees(first_name, last_name, employee_code, department)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as ExitRequest[];
    },
  });
};

export const useCreateExitRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (exit: Omit<ExitRequest, 'id' | 'created_at' | 'updated_at' | 'is_deleted' | 'employees'>) => {
      const { data, error } = await supabase
        .from('exit_requests')
        .insert(exit)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exit_requests'] });
      toast.success('Exit request created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create exit request: ' + error.message);
    },
  });
};

export const useUpdateExitRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ExitRequest> & { id: string }) => {
      const { data, error } = await supabase
        .from('exit_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exit_requests'] });
      toast.success('Exit request updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update exit request: ' + error.message);
    },
  });
};

// HR Dashboard Stats
export const useHRDashboardStats = () => {
  return useQuery({
    queryKey: ['hr_dashboard_stats'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const [employees, jobOpenings, applications, leaveRequests, reviews, exits] = await Promise.all([
        supabase.from('employees').select('id, status').eq('is_deleted', false),
        supabase.from('job_openings').select('id').eq('status', 'open').eq('is_deleted', false),
        supabase.from('job_applications').select('id, created_at').eq('is_deleted', false),
        supabase.from('leave_requests').select('id, status').eq('status', 'pending').eq('is_deleted', false),
        supabase.from('performance_reviews').select('id, status').in('status', ['pending', 'in_progress']).eq('is_deleted', false),
        supabase.from('exit_requests').select('id').in('status', ['initiated', 'in_progress', 'clearance_pending']).eq('is_deleted', false),
      ]);

      const employeeData = employees.data || [];
      const applicationsData = applications.data || [];
      const todayApplications = applicationsData.filter(a => a.created_at?.startsWith(today));

      return {
        totalEmployees: employeeData.filter(e => e.status === 'active').length,
        onNotice: employeeData.filter(e => e.status === 'on_notice').length,
        openPositions: jobOpenings.data?.length || 0,
        applicationsToday: todayApplications.length,
        pendingLeaves: leaveRequests.data?.length || 0,
        reviewsDue: reviews.data?.length || 0,
        exitRequests: exits.data?.length || 0,
      };
    },
  });
};
