-- Add milestones table for sprint/milestone management
CREATE TABLE public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  start_date DATE,
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress INT DEFAULT 0,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Add pull_requests table for code review flow
CREATE TABLE public.pull_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  source_branch TEXT NOT NULL,
  target_branch TEXT NOT NULL DEFAULT 'main',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'approved', 'merged', 'rejected', 'closed')),
  author_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
  reviewer_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
  pr_url TEXT,
  merge_commit_hash TEXT,
  merged_at TIMESTAMP WITH TIME ZONE,
  merged_by UUID REFERENCES public.developers(id) ON DELETE SET NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add code_reviews table for review tracking
CREATE TABLE public.code_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pull_request_id UUID NOT NULL REFERENCES public.pull_requests(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
  reviewer_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'changes_requested', 'rejected')),
  comments TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add qa_approvals table
CREATE TABLE public.qa_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  build_request_id UUID REFERENCES public.build_requests(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES public.developers(id) ON DELETE SET NULL,
  approver_name TEXT,
  notes TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add developer_access_expiry for tracking access expiry
ALTER TABLE public.developers ADD COLUMN IF NOT EXISTS access_expires_at TIMESTAMP WITH TIME ZONE;

-- Add milestone_id to tasks for linking
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL;

-- Add blocked status tracking to tasks  
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS blocked_reason TEXT;

-- Add failure_reason to build_requests
ALTER TABLE public.build_requests ADD COLUMN IF NOT EXISTS failure_reason TEXT;

-- Enable RLS on new tables
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pull_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_approvals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for milestones
CREATE POLICY "Allow read milestones" ON public.milestones FOR SELECT USING (true);
CREATE POLICY "Allow insert milestones" ON public.milestones FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update milestones" ON public.milestones FOR UPDATE USING (true);
CREATE POLICY "Allow delete milestones" ON public.milestones FOR DELETE USING (true);

-- RLS Policies for pull_requests
CREATE POLICY "Allow read pull_requests" ON public.pull_requests FOR SELECT USING (true);
CREATE POLICY "Allow insert pull_requests" ON public.pull_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update pull_requests" ON public.pull_requests FOR UPDATE USING (true);
CREATE POLICY "Allow delete pull_requests" ON public.pull_requests FOR DELETE USING (true);

-- RLS Policies for code_reviews
CREATE POLICY "Allow read code_reviews" ON public.code_reviews FOR SELECT USING (true);
CREATE POLICY "Allow insert code_reviews" ON public.code_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update code_reviews" ON public.code_reviews FOR UPDATE USING (true);
CREATE POLICY "Allow delete code_reviews" ON public.code_reviews FOR DELETE USING (true);

-- RLS Policies for qa_approvals
CREATE POLICY "Allow read qa_approvals" ON public.qa_approvals FOR SELECT USING (true);
CREATE POLICY "Allow insert qa_approvals" ON public.qa_approvals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update qa_approvals" ON public.qa_approvals FOR UPDATE USING (true);
CREATE POLICY "Allow delete qa_approvals" ON public.qa_approvals FOR DELETE USING (true);

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pull_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.code_reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.qa_approvals;