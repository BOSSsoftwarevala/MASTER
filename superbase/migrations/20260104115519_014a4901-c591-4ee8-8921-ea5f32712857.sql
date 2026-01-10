-- HR Manager Module Tables

-- Employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  employee_code TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  department TEXT,
  designation TEXT,
  employment_type TEXT DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'intern')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'on_notice', 'inactive', 'terminated')),
  joining_date DATE,
  notice_date DATE,
  exit_date DATE,
  reporting_to UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  salary NUMERIC DEFAULT 0,
  avatar_url TEXT,
  address JSONB DEFAULT '{}'::jsonb,
  emergency_contact JSONB DEFAULT '{}'::jsonb,
  bank_details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by UUID,
  is_deleted BOOLEAN DEFAULT false
);

-- Employee documents
CREATE TABLE public.employee_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  file_url TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  uploaded_by UUID,
  verified_at TIMESTAMPTZ,
  verified_by UUID,
  is_deleted BOOLEAN DEFAULT false
);

-- Job openings
CREATE TABLE public.job_openings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT,
  description TEXT,
  requirements TEXT,
  location TEXT,
  employment_type TEXT DEFAULT 'full_time',
  salary_range_min NUMERIC,
  salary_range_max NUMERIC,
  positions_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'open' CHECK (status IN ('draft', 'open', 'closed', 'on_hold')),
  posted_at TIMESTAMPTZ,
  closes_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by UUID,
  is_deleted BOOLEAN DEFAULT false
);

-- Job applications
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.job_openings(id) ON DELETE CASCADE NOT NULL,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  candidate_phone TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'shortlisted', 'interview', 'offered', 'hired', 'rejected')),
  interview_date TIMESTAMPTZ,
  interview_notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_deleted BOOLEAN DEFAULT false
);

-- Attendance logs
CREATE TABLE public.attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'half_day', 'work_from_home', 'on_leave')),
  notes TEXT,
  adjusted_by UUID,
  adjusted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(employee_id, date)
);

-- Leave requests
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('casual', 'sick', 'earned', 'maternity', 'paternity', 'unpaid', 'other')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_count INTEGER NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_deleted BOOLEAN DEFAULT false
);

-- Performance reviews
CREATE TABLE public.performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'acknowledged', 'closed')),
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  goals_achieved TEXT,
  strengths TEXT,
  improvements TEXT,
  reviewer_comments TEXT,
  employee_comments TEXT,
  submitted_at TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by UUID,
  is_deleted BOOLEAN DEFAULT false
);

-- Employee goals
CREATE TABLE public.employee_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by UUID,
  is_deleted BOOLEAN DEFAULT false
);

-- Exit requests
CREATE TABLE public.exit_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  exit_type TEXT NOT NULL CHECK (exit_type IN ('resignation', 'termination', 'retirement', 'end_of_contract')),
  reason TEXT,
  notice_date DATE NOT NULL,
  last_working_date DATE,
  status TEXT DEFAULT 'initiated' CHECK (status IN ('initiated', 'in_progress', 'clearance_pending', 'completed', 'cancelled')),
  exit_interview_done BOOLEAN DEFAULT false,
  exit_interview_notes TEXT,
  clearance_hr BOOLEAN DEFAULT false,
  clearance_it BOOLEAN DEFAULT false,
  clearance_finance BOOLEAN DEFAULT false,
  clearance_admin BOOLEAN DEFAULT false,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by UUID,
  is_deleted BOOLEAN DEFAULT false
);

-- HR activity logs
CREATE TABLE public.hr_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  action_type TEXT NOT NULL,
  details TEXT,
  old_value JSONB,
  new_value JSONB,
  performed_by UUID,
  performed_by_name TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_activity_logs ENABLE ROW LEVEL SECURITY;

-- HR Manager role check function
CREATE OR REPLACE FUNCTION public.is_hr_manager(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('hr_manager', 'admin', 'super_admin')
  )
$$;

-- RLS Policies for employees
CREATE POLICY "HR managers can view employees" ON public.employees FOR SELECT USING (is_hr_manager(auth.uid()));
CREATE POLICY "HR managers can create employees" ON public.employees FOR INSERT WITH CHECK (is_hr_manager(auth.uid()));
CREATE POLICY "HR managers can update employees" ON public.employees FOR UPDATE USING (is_hr_manager(auth.uid()));
CREATE POLICY "Super Admin can delete employees" ON public.employees FOR DELETE USING (is_super_admin(auth.uid()));

-- RLS for employee_documents
CREATE POLICY "HR managers can view documents" ON public.employee_documents FOR SELECT USING (is_hr_manager(auth.uid()));
CREATE POLICY "HR managers can manage documents" ON public.employee_documents FOR ALL USING (is_hr_manager(auth.uid()));

-- RLS for job_openings
CREATE POLICY "HR managers can view jobs" ON public.job_openings FOR SELECT USING (is_hr_manager(auth.uid()));
CREATE POLICY "HR managers can manage jobs" ON public.job_openings FOR ALL USING (is_hr_manager(auth.uid()));

-- RLS for job_applications
CREATE POLICY "HR managers can view applications" ON public.job_applications FOR SELECT USING (is_hr_manager(auth.uid()));
CREATE POLICY "HR managers can manage applications" ON public.job_applications FOR ALL USING (is_hr_manager(auth.uid()));

-- RLS for attendance_logs
CREATE POLICY "HR managers can view attendance" ON public.attendance_logs FOR SELECT USING (is_hr_manager(auth.uid()));
CREATE POLICY "HR managers can manage attendance" ON public.attendance_logs FOR ALL USING (is_hr_manager(auth.uid()));

-- RLS for leave_requests
CREATE POLICY "HR managers can view leaves" ON public.leave_requests FOR SELECT USING (is_hr_manager(auth.uid()));
CREATE POLICY "HR managers can manage leaves" ON public.leave_requests FOR ALL USING (is_hr_manager(auth.uid()));

-- RLS for performance_reviews
CREATE POLICY "HR managers can view reviews" ON public.performance_reviews FOR SELECT USING (is_hr_manager(auth.uid()));
CREATE POLICY "HR managers can manage reviews" ON public.performance_reviews FOR ALL USING (is_hr_manager(auth.uid()));

-- RLS for employee_goals
CREATE POLICY "HR managers can view goals" ON public.employee_goals FOR SELECT USING (is_hr_manager(auth.uid()));
CREATE POLICY "HR managers can manage goals" ON public.employee_goals FOR ALL USING (is_hr_manager(auth.uid()));

-- RLS for exit_requests
CREATE POLICY "HR managers can view exits" ON public.exit_requests FOR SELECT USING (is_hr_manager(auth.uid()));
CREATE POLICY "HR managers can manage exits" ON public.exit_requests FOR ALL USING (is_hr_manager(auth.uid()));

-- RLS for hr_activity_logs
CREATE POLICY "HR managers can view hr logs" ON public.hr_activity_logs FOR SELECT USING (is_hr_manager(auth.uid()));
CREATE POLICY "System can insert hr logs" ON public.hr_activity_logs FOR INSERT WITH CHECK (is_hr_manager(auth.uid()));