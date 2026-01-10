
-- Create enum for build/deploy status
CREATE TYPE public.build_status AS ENUM ('pending', 'queued', 'building', 'success', 'failed', 'cancelled');
CREATE TYPE public.deploy_status AS ENUM ('pending', 'approved', 'rejected', 'deploying', 'success', 'failed', 'rolled_back');
CREATE TYPE public.environment_type AS ENUM ('development', 'staging', 'production');
CREATE TYPE public.incident_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Build Requests Table
CREATE TABLE public.build_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_name TEXT NOT NULL,
    branch TEXT NOT NULL,
    commit_hash TEXT,
    commit_message TEXT,
    build_type environment_type NOT NULL DEFAULT 'development',
    status build_status NOT NULL DEFAULT 'pending',
    requested_by UUID NOT NULL,
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    build_duration_seconds INTEGER,
    error_message TEXT,
    build_logs TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_deleted BOOLEAN DEFAULT false
);

-- Deploy Requests Table
CREATE TABLE public.deploy_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    build_request_id UUID REFERENCES public.build_requests(id),
    environment environment_type NOT NULL,
    version TEXT NOT NULL,
    release_notes TEXT,
    risk_level TEXT DEFAULT 'low',
    rollback_plan TEXT,
    status deploy_status NOT NULL DEFAULT 'pending',
    requested_by UUID NOT NULL,
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_by UUID,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    deployed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_deleted BOOLEAN DEFAULT false
);

-- Test Results Table
CREATE TABLE public.test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    build_request_id UUID REFERENCES public.build_requests(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL, -- 'unit', 'integration', 'e2e', 'security'
    test_name TEXT NOT NULL,
    status TEXT NOT NULL, -- 'passed', 'failed', 'skipped'
    duration_ms INTEGER,
    error_message TEXT,
    stack_trace TEXT,
    coverage_percent NUMERIC(5,2),
    total_tests INTEGER,
    passed_tests INTEGER,
    failed_tests INTEGER,
    skipped_tests INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Deploy Incidents Table
CREATE TABLE public.deploy_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deploy_request_id UUID REFERENCES public.deploy_requests(id),
    title TEXT NOT NULL,
    description TEXT,
    severity incident_severity NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'escalated'
    root_cause TEXT,
    resolution TEXT,
    recovery_time_minutes INTEGER,
    affected_services TEXT[],
    reported_by UUID NOT NULL,
    assigned_to UUID,
    escalated_to UUID,
    resolved_by UUID,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_deleted BOOLEAN DEFAULT false
);

-- Rollback Requests Table
CREATE TABLE public.rollback_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deploy_request_id UUID REFERENCES public.deploy_requests(id),
    target_version TEXT NOT NULL,
    reason TEXT NOT NULL,
    impact_scope TEXT,
    status deploy_status NOT NULL DEFAULT 'pending',
    requested_by UUID NOT NULL,
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.build_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deploy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deploy_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rollback_requests ENABLE ROW LEVEL SECURITY;

-- Helper function for code_manager role
CREATE OR REPLACE FUNCTION public.is_code_manager(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('code_manager', 'project_manager', 'admin', 'super_admin')
  )
$$;

-- Build Requests Policies
CREATE POLICY "Code managers can view all build requests"
ON public.build_requests FOR SELECT
USING (is_code_manager(auth.uid()));

CREATE POLICY "Code managers can create build requests"
ON public.build_requests FOR INSERT
WITH CHECK (is_code_manager(auth.uid()));

CREATE POLICY "Code managers can update build requests"
ON public.build_requests FOR UPDATE
USING (is_code_manager(auth.uid()));

CREATE POLICY "Super Admin can delete build requests"
ON public.build_requests FOR DELETE
USING (is_super_admin(auth.uid()));

-- Deploy Requests Policies
CREATE POLICY "Code managers can view all deploy requests"
ON public.deploy_requests FOR SELECT
USING (is_code_manager(auth.uid()));

CREATE POLICY "Code managers can create deploy requests"
ON public.deploy_requests FOR INSERT
WITH CHECK (is_code_manager(auth.uid()));

CREATE POLICY "Admins can update deploy requests"
ON public.deploy_requests FOR UPDATE
USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Super Admin can delete deploy requests"
ON public.deploy_requests FOR DELETE
USING (is_super_admin(auth.uid()));

-- Test Results Policies
CREATE POLICY "Code managers can view test results"
ON public.test_results FOR SELECT
USING (is_code_manager(auth.uid()));

CREATE POLICY "System can insert test results"
ON public.test_results FOR INSERT
WITH CHECK (is_code_manager(auth.uid()));

-- Deploy Incidents Policies
CREATE POLICY "Code managers can view deploy incidents"
ON public.deploy_incidents FOR SELECT
USING (is_code_manager(auth.uid()));

CREATE POLICY "Code managers can create deploy incidents"
ON public.deploy_incidents FOR INSERT
WITH CHECK (is_code_manager(auth.uid()));

CREATE POLICY "Code managers can update deploy incidents"
ON public.deploy_incidents FOR UPDATE
USING (is_code_manager(auth.uid()));

CREATE POLICY "Super Admin can delete deploy incidents"
ON public.deploy_incidents FOR DELETE
USING (is_super_admin(auth.uid()));

-- Rollback Requests Policies
CREATE POLICY "Code managers can view rollback requests"
ON public.rollback_requests FOR SELECT
USING (is_code_manager(auth.uid()));

CREATE POLICY "Code managers can create rollback requests"
ON public.rollback_requests FOR INSERT
WITH CHECK (is_code_manager(auth.uid()));

CREATE POLICY "Admins can update rollback requests"
ON public.rollback_requests FOR UPDATE
USING (is_admin_or_super(auth.uid()));

-- Create updated_at triggers
CREATE TRIGGER update_build_requests_updated_at
BEFORE UPDATE ON public.build_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deploy_requests_updated_at
BEFORE UPDATE ON public.deploy_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deploy_incidents_updated_at
BEFORE UPDATE ON public.deploy_incidents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rollback_requests_updated_at
BEFORE UPDATE ON public.rollback_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_build_requests_status ON public.build_requests(status);
CREATE INDEX idx_build_requests_requested_by ON public.build_requests(requested_by);
CREATE INDEX idx_deploy_requests_status ON public.deploy_requests(status);
CREATE INDEX idx_deploy_requests_environment ON public.deploy_requests(environment);
CREATE INDEX idx_test_results_build_id ON public.test_results(build_request_id);
CREATE INDEX idx_deploy_incidents_status ON public.deploy_incidents(status);
CREATE INDEX idx_deploy_incidents_severity ON public.deploy_incidents(severity);
