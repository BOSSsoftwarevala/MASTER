-- Development Manager Module Tables
-- Enums for development manager
CREATE TYPE developer_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE developer_level AS ENUM ('junior', 'mid', 'senior', 'lead', 'principal');
CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'archived');
CREATE TYPE task_status AS ENUM ('backlog', 'todo', 'in_progress', 'review', 'completed', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE bug_severity AS ENUM ('low', 'medium', 'high', 'critical', 'blocker');
CREATE TYPE bug_status AS ENUM ('open', 'in_progress', 'resolved', 'closed', 'wont_fix');
CREATE TYPE qa_test_status AS ENUM ('pending', 'passed', 'failed', 'skipped');

-- Developers table
CREATE TABLE public.developers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  skill_set TEXT[] DEFAULT '{}',
  level developer_level NOT NULL DEFAULT 'mid',
  status developer_status NOT NULL DEFAULT 'active',
  avatar_url TEXT,
  phone TEXT,
  department TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  category TEXT,
  status project_status NOT NULL DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  estimated_hours INTEGER,
  actual_hours INTEGER DEFAULT 0,
  repo_url TEXT,
  staging_url TEXT,
  production_url TEXT,
  lead_developer_id UUID REFERENCES public.developers(id),
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Project Developers (Many-to-Many)
CREATE TABLE public.project_developers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  developer_id UUID NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'developer',
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  assigned_by UUID,
  UNIQUE(project_id, developer_id)
);

-- Tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'backlog',
  priority task_priority NOT NULL DEFAULT 'medium',
  assigned_to UUID REFERENCES public.developers(id),
  estimated_hours NUMERIC,
  actual_hours NUMERIC DEFAULT 0,
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  parent_task_id UUID REFERENCES public.tasks(id),
  tags TEXT[] DEFAULT '{}',
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Task Comments
CREATE TABLE public.task_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID,
  author_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bugs table
CREATE TABLE public.bugs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id),
  title TEXT NOT NULL,
  description TEXT,
  steps_to_reproduce TEXT,
  expected_behavior TEXT,
  actual_behavior TEXT,
  severity bug_severity NOT NULL DEFAULT 'medium',
  status bug_status NOT NULL DEFAULT 'open',
  assigned_to UUID REFERENCES public.developers(id),
  reported_by UUID,
  reporter_name TEXT,
  environment TEXT,
  browser TEXT,
  attachments JSONB DEFAULT '[]',
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- QA Tests table
CREATE TABLE public.qa_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  build_request_id UUID REFERENCES public.build_requests(id),
  name TEXT NOT NULL,
  description TEXT,
  test_type TEXT DEFAULT 'manual',
  status qa_test_status NOT NULL DEFAULT 'pending',
  executed_by UUID,
  executed_at TIMESTAMP WITH TIME ZONE,
  expected_result TEXT,
  actual_result TEXT,
  notes TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Development Audit Logs
CREATE TABLE public.development_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  performed_by UUID,
  performed_by_name TEXT,
  old_value JSONB,
  new_value JSONB,
  details TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for developers
CREATE POLICY "Admins can view developers" ON public.developers FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Admins can create developers" ON public.developers FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));
CREATE POLICY "Admins can update developers" ON public.developers FOR UPDATE USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Super Admin can delete developers" ON public.developers FOR DELETE USING (is_super_admin(auth.uid()));

-- RLS Policies for projects
CREATE POLICY "Admins can view projects" ON public.projects FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Admins can create projects" ON public.projects FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Super Admin can delete projects" ON public.projects FOR DELETE USING (is_super_admin(auth.uid()));

-- RLS Policies for project_developers
CREATE POLICY "Admins can view project developers" ON public.project_developers FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Admins can manage project developers" ON public.project_developers FOR ALL USING (is_admin_or_super(auth.uid()));

-- RLS Policies for tasks
CREATE POLICY "Admins can view tasks" ON public.tasks FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Admins can create tasks" ON public.tasks FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));
CREATE POLICY "Admins can update tasks" ON public.tasks FOR UPDATE USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Super Admin can delete tasks" ON public.tasks FOR DELETE USING (is_super_admin(auth.uid()));

-- RLS Policies for task_comments
CREATE POLICY "Admins can view task comments" ON public.task_comments FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Admins can create task comments" ON public.task_comments FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

-- RLS Policies for bugs
CREATE POLICY "Admins can view bugs" ON public.bugs FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Admins can create bugs" ON public.bugs FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));
CREATE POLICY "Admins can update bugs" ON public.bugs FOR UPDATE USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Super Admin can delete bugs" ON public.bugs FOR DELETE USING (is_super_admin(auth.uid()));

-- RLS Policies for qa_tests
CREATE POLICY "Admins can view qa tests" ON public.qa_tests FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Admins can create qa tests" ON public.qa_tests FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));
CREATE POLICY "Admins can update qa tests" ON public.qa_tests FOR UPDATE USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Super Admin can delete qa tests" ON public.qa_tests FOR DELETE USING (is_super_admin(auth.uid()));

-- RLS Policies for development_audit_logs
CREATE POLICY "Admins can view dev audit logs" ON public.development_audit_logs FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "System can insert dev audit logs" ON public.development_audit_logs FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON public.developers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bugs_updated_at BEFORE UPDATE ON public.bugs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_qa_tests_updated_at BEFORE UPDATE ON public.qa_tests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_developers_status ON public.developers(status);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_bugs_project_id ON public.bugs(project_id);
CREATE INDEX idx_bugs_status ON public.bugs(status);
CREATE INDEX idx_qa_tests_project_id ON public.qa_tests(project_id);
CREATE INDEX idx_qa_tests_build_request_id ON public.qa_tests(build_request_id);