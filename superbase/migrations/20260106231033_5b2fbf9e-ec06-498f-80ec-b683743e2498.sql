-- Insert VALA AI role into the roles table
INSERT INTO public.roles (role_key, name, description, role_type, status, is_system_role)
VALUES (
  'vala_ai',
  'VALA AI',
  'System AI role with full read authority, auto-actions, recovery, and optimization capabilities. Reports to Boss only. Non-editable, non-deletable.',
  'system',
  'active',
  true
)
ON CONFLICT (role_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  role_type = EXCLUDED.role_type,
  status = EXCLUDED.status,
  is_system_role = EXCLUDED.is_system_role;

-- Create VALA AI configuration table for storing AI settings and state
CREATE TABLE IF NOT EXISTS public.vala_ai_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT NOT NULL UNIQUE,
  config_value JSONB NOT NULL DEFAULT '{}',
  is_locked BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default VALA AI configuration
INSERT INTO public.vala_ai_config (config_key, config_value, is_locked) VALUES
  ('identity', '{"role_code": "AI-000", "priority_level": "highest", "reports_to": ["boss", "owner"], "ui_badge": "👑 AI", "color_tag": "royal_blue"}', true),
  ('permissions', '{"can_read_all": true, "can_monitor_roles": true, "can_suggest_actions": true, "can_execute_auto_actions": true, "can_trigger_auto_fix": true, "can_trigger_auto_recovery": true, "can_pause_risky_ops": true, "can_route_leads": true, "can_score_leads": true, "can_optimize_costs": true, "can_generate_reports": true, "can_request_approvals": true}', true),
  ('restrictions', '{"can_delete_data": false, "can_remove_black_box": false, "can_override_boss_lock": false, "can_change_core_security": false, "can_expose_internal_logic": false}', true),
  ('scope', '{"modules": ["development", "server", "support", "marketing", "finance", "hr", "product", "demo", "reseller", "franchise", "security", "audit", "routing", "notification", "incident"]}', true),
  ('operation_mode', '{"silent_mode": true, "high_risk_requires_approval": true, "immutable_logging": true, "monitored_by_black_box": true, "impersonation_blocked": true, "session_sharing_blocked": true}', true)
ON CONFLICT (config_key) DO NOTHING;

-- Enable RLS on vala_ai_config
ALTER TABLE public.vala_ai_config ENABLE ROW LEVEL SECURITY;

-- Only super_admin can view VALA AI config (read-only)
CREATE POLICY "Super admins can view vala_ai_config"
ON public.vala_ai_config FOR SELECT
USING (public.has_role(auth.uid(), 'super_admin'));

-- No one can update or delete VALA AI config (immutable)
CREATE POLICY "No one can modify vala_ai_config"
ON public.vala_ai_config FOR UPDATE
USING (false);

CREATE POLICY "No one can delete vala_ai_config"
ON public.vala_ai_config FOR DELETE
USING (false);

-- Create VALA AI action log table for immutable logging
CREATE TABLE IF NOT EXISTS public.vala_ai_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  action_scope TEXT NOT NULL,
  target_entity_type TEXT,
  target_entity_id TEXT,
  action_details JSONB NOT NULL DEFAULT '{}',
  risk_level TEXT NOT NULL DEFAULT 'low',
  approval_required BOOLEAN NOT NULL DEFAULT false,
  approval_status TEXT DEFAULT 'pending',
  approved_by UUID,
  executed_at TIMESTAMP WITH TIME ZONE,
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on action logs
ALTER TABLE public.vala_ai_action_logs ENABLE ROW LEVEL SECURITY;

-- Super admins and boss can view VALA AI action logs
CREATE POLICY "Admins can view vala_ai_action_logs"
ON public.vala_ai_action_logs FOR SELECT
USING (public.is_admin_or_super(auth.uid()));

-- Only VALA AI system can insert (via edge functions with service role)
-- No direct user inserts allowed
CREATE POLICY "No direct inserts to vala_ai_action_logs"
ON public.vala_ai_action_logs FOR INSERT
WITH CHECK (false);

-- No updates or deletes allowed (immutable)
CREATE POLICY "No updates to vala_ai_action_logs"
ON public.vala_ai_action_logs FOR UPDATE
USING (false);

CREATE POLICY "No deletes from vala_ai_action_logs"
ON public.vala_ai_action_logs FOR DELETE
USING (false);

-- Add updated_at trigger for vala_ai_config
CREATE TRIGGER update_vala_ai_config_updated_at
BEFORE UPDATE ON public.vala_ai_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();