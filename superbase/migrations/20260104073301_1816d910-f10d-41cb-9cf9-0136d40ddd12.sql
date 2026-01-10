
-- Create enum for approval types
CREATE TYPE public.approval_type AS ENUM ('system', 'payment', 'risk', 'ai', 'access', 'deployment', 'rollback');

-- Create enum for approval status
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');

-- Create approvals table
CREATE TABLE public.approvals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    type approval_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    requester TEXT NOT NULL,
    requester_id UUID,
    priority TEXT NOT NULL DEFAULT 'medium',
    amount NUMERIC,
    reference_id UUID,
    reference_table TEXT,
    status approval_status NOT NULL DEFAULT 'pending',
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_by UUID,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_deleted BOOLEAN DEFAULT false
);

-- Create audit_logs table (immutable)
CREATE TABLE public.audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_id UUID,
    user_role TEXT NOT NULL,
    details TEXT,
    ip_address INET,
    user_agent TEXT,
    severity TEXT NOT NULL DEFAULT 'info',
    metadata JSONB
);

-- Create system_freeze table
CREATE TABLE public.system_freeze (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    freeze_type TEXT NOT NULL,
    module_id TEXT,
    reason TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    frozen_by UUID NOT NULL,
    frozen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    resumed_by UUID,
    resumed_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_freeze ENABLE ROW LEVEL SECURITY;

-- RLS Policies for approvals (Super Admin only)
CREATE POLICY "Super Admin can view all approvals"
ON public.approvals FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super Admin can create approvals"
ON public.approvals FOR INSERT
WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Super Admin can update approvals"
ON public.approvals FOR UPDATE
USING (is_super_admin(auth.uid()));

-- RLS Policies for audit_logs (Super Admin view only - no delete/update)
CREATE POLICY "Super Admin can view audit logs"
ON public.audit_logs FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "System can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (is_admin_or_super(auth.uid()));

-- RLS Policies for system_freeze (Super Admin only)
CREATE POLICY "Super Admin can view system freeze"
ON public.system_freeze FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super Admin can manage system freeze"
ON public.system_freeze FOR INSERT
WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Super Admin can update system freeze"
ON public.system_freeze FOR UPDATE
USING (is_super_admin(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_approvals_updated_at
BEFORE UPDATE ON public.approvals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_freeze_updated_at
BEFORE UPDATE ON public.system_freeze
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_approvals_status ON public.approvals(status);
CREATE INDEX idx_approvals_type ON public.approvals(type);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_module ON public.audit_logs(module);
CREATE INDEX idx_audit_logs_severity ON public.audit_logs(severity);
CREATE INDEX idx_system_freeze_is_active ON public.system_freeze(is_active);
