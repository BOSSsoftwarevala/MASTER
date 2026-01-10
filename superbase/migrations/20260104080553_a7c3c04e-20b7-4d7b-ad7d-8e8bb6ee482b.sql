-- Role & Permission Control Module Tables

-- Create role_type enum
CREATE TYPE public.role_type AS ENUM ('system', 'business', 'support');

-- Create role_status enum
CREATE TYPE public.role_status AS ENUM ('active', 'locked', 'deprecated');

-- Create access_level enum
CREATE TYPE public.access_level AS ENUM ('none', 'view', 'request', 'execute');

-- Create request_status enum for access requests
CREATE TYPE public.access_request_status AS ENUM ('pending', 'approved', 'rejected', 'expired');

-- Create violation_severity enum
CREATE TYPE public.violation_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Roles Registry Table (metadata about each role)
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key public.app_role NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  role_type public.role_type NOT NULL DEFAULT 'business',
  status public.role_status NOT NULL DEFAULT 'active',
  is_system_role BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Permissions Table (features/actions that can be controlled)
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT NOT NULL UNIQUE,
  feature_name TEXT NOT NULL,
  module TEXT NOT NULL,
  description TEXT,
  is_sensitive BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Role Permissions Matrix (junction table)
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  access_level public.access_level NOT NULL DEFAULT 'none',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- Temporary Access Grants
CREATE TABLE public.temp_access_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role_key public.app_role NOT NULL,
  reason TEXT NOT NULL,
  granted_by UUID NOT NULL,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Access Requests (for role assignments/escalations)
CREATE TABLE public.access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL,
  requester_name TEXT NOT NULL,
  request_type TEXT NOT NULL, -- 'role_assignment', 'privilege_escalation', 'temp_access'
  requested_role public.app_role,
  scope TEXT NOT NULL DEFAULT 'global', -- 'global', 'limited'
  reason TEXT NOT NULL,
  risk_level TEXT NOT NULL DEFAULT 'medium',
  impact_summary TEXT,
  status public.access_request_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Access Violations Log
CREATE TABLE public.access_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_email TEXT,
  attempted_action TEXT NOT NULL,
  attempted_resource TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  blocked_reason TEXT NOT NULL,
  severity public.violation_severity NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Role Audit Logs
CREATE TABLE public.role_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL, -- 'role_assigned', 'role_removed', 'temp_access_granted', 'escalation_approved', etc.
  target_user_id UUID,
  target_user_email TEXT,
  role_affected public.app_role,
  requested_by UUID,
  requested_by_name TEXT,
  approved_by UUID,
  approved_by_name TEXT,
  details TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temp_access_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roles table (read-only for admins)
CREATE POLICY "Admins can view roles"
ON public.roles FOR SELECT
USING (is_admin_or_super(auth.uid()));

-- RLS Policies for permissions table (read-only for admins)
CREATE POLICY "Admins can view permissions"
ON public.permissions FOR SELECT
USING (is_admin_or_super(auth.uid()));

-- RLS Policies for role_permissions (read-only for admins)
CREATE POLICY "Admins can view role permissions"
ON public.role_permissions FOR SELECT
USING (is_admin_or_super(auth.uid()));

-- RLS Policies for temp_access_grants
CREATE POLICY "Super Admin can manage temp access"
ON public.temp_access_grants FOR ALL
USING (is_super_admin(auth.uid()));

CREATE POLICY "Users can view own temp access"
ON public.temp_access_grants FOR SELECT
USING (user_id = auth.uid());

-- RLS Policies for access_requests
CREATE POLICY "Super Admin can manage access requests"
ON public.access_requests FOR ALL
USING (is_super_admin(auth.uid()));

CREATE POLICY "Users can create access requests"
ON public.access_requests FOR INSERT
WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can view own access requests"
ON public.access_requests FOR SELECT
USING (requester_id = auth.uid() OR is_super_admin(auth.uid()));

-- RLS Policies for access_violations (read-only for super admin)
CREATE POLICY "Super Admin can view access violations"
ON public.access_violations FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "System can insert access violations"
ON public.access_violations FOR INSERT
WITH CHECK (is_admin_or_super(auth.uid()));

-- RLS Policies for role_audit_logs (read-only for super admin)
CREATE POLICY "Super Admin can view role audit logs"
ON public.role_audit_logs FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "System can insert role audit logs"
ON public.role_audit_logs FOR INSERT
WITH CHECK (is_admin_or_super(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_role_permissions_updated_at
  BEFORE UPDATE ON public.role_permissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_temp_access_grants_updated_at
  BEFORE UPDATE ON public.temp_access_grants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_access_requests_updated_at
  BEFORE UPDATE ON public.access_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_temp_access_grants_user_id ON public.temp_access_grants(user_id);
CREATE INDEX idx_temp_access_grants_active ON public.temp_access_grants(is_active, expires_at);
CREATE INDEX idx_access_requests_status ON public.access_requests(status);
CREATE INDEX idx_access_requests_requester ON public.access_requests(requester_id);
CREATE INDEX idx_access_violations_severity ON public.access_violations(severity);
CREATE INDEX idx_access_violations_user ON public.access_violations(user_id);
CREATE INDEX idx_role_audit_logs_action ON public.role_audit_logs(action);
CREATE INDEX idx_role_audit_logs_created ON public.role_audit_logs(created_at DESC);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.access_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.temp_access_grants;