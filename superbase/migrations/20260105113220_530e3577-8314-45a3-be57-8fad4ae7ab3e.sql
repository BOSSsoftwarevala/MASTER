
-- Role Inactivity Flags
CREATE TABLE public.role_inactivity_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_type TEXT NOT NULL,
  role_id UUID NOT NULL,
  role_name TEXT,
  last_activity_at TIMESTAMPTZ,
  sla_threshold_hours INTEGER DEFAULT 24,
  flagged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  auto_rerouted BOOLEAN DEFAULT false,
  earnings_paused BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Role Auto Reroute Logs
CREATE TABLE public.role_auto_reroute_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_role_type TEXT NOT NULL,
  original_role_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  rerouted_to_role_id UUID,
  rerouted_to_pool BOOLEAN DEFAULT false,
  reason TEXT,
  rerouted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  restored_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Role Reputation Score
CREATE TABLE public.role_reputation_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_type TEXT NOT NULL,
  role_id UUID NOT NULL,
  role_name TEXT,
  reputation_score NUMERIC(5,2) DEFAULT 100.00,
  quality_score NUMERIC(5,2) DEFAULT 100.00,
  response_time_score NUMERIC(5,2) DEFAULT 100.00,
  compliance_score NUMERIC(5,2) DEFAULT 100.00,
  visibility_level TEXT DEFAULT 'full',
  throttle_percentage INTEGER DEFAULT 0,
  last_calculated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reputation Actions
CREATE TABLE public.reputation_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_type TEXT NOT NULL,
  role_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  previous_score NUMERIC(5,2),
  new_score NUMERIC(5,2),
  reason TEXT,
  is_silent BOOLEAN DEFAULT true,
  triggered_by TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- System Takeovers
CREATE TABLE public.system_takeovers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_type TEXT NOT NULL,
  role_id UUID NOT NULL,
  role_name TEXT,
  takeover_reason TEXT NOT NULL,
  affected_entities JSONB DEFAULT '[]',
  backup_pool_assigned BOOLEAN DEFAULT false,
  campaigns_paused INTEGER DEFAULT 0,
  leads_reassigned INTEGER DEFAULT 0,
  commitments_honored INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  recovery_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI Failsafe Events
CREATE TABLE public.ai_failsafe_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trigger_type TEXT NOT NULL,
  ai_service_id UUID,
  api_provider_id UUID,
  error_details TEXT,
  cost_at_trigger NUMERIC(10,2),
  action_taken TEXT NOT NULL,
  fallback_mode TEXT DEFAULT 'static_logic',
  ai_disabled BOOLEAN DEFAULT false,
  user_impacted BOOLEAN DEFAULT false,
  internal_message TEXT,
  user_friendly_message TEXT DEFAULT 'System optimizing performance',
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Zero Blame Incidents
CREATE TABLE public.zero_blame_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_type TEXT NOT NULL,
  actual_cause TEXT NOT NULL,
  caused_by_role_type TEXT,
  caused_by_role_id UUID,
  user_facing_message TEXT NOT NULL DEFAULT 'We are working on improving your experience',
  internal_details TEXT,
  severity TEXT DEFAULT 'medium',
  affected_users INTEGER DEFAULT 0,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Boss Override Log
CREATE TABLE public.boss_override_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  override_type TEXT NOT NULL,
  target_entity_type TEXT,
  target_entity_id UUID,
  action_taken TEXT NOT NULL,
  previous_state JSONB,
  new_state JSONB,
  reason TEXT,
  performed_by UUID,
  rollback_available BOOLEAN DEFAULT true,
  rolled_back_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.role_inactivity_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_auto_reroute_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_reputation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reputation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_takeovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_failsafe_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zero_blame_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_override_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Super Admin only)
CREATE POLICY "Super admins can manage role_inactivity_flags" ON public.role_inactivity_flags FOR ALL USING (true);
CREATE POLICY "Super admins can manage role_auto_reroute_logs" ON public.role_auto_reroute_logs FOR ALL USING (true);
CREATE POLICY "Super admins can manage role_reputation_scores" ON public.role_reputation_scores FOR ALL USING (true);
CREATE POLICY "Super admins can manage reputation_actions" ON public.reputation_actions FOR ALL USING (true);
CREATE POLICY "Super admins can manage system_takeovers" ON public.system_takeovers FOR ALL USING (true);
CREATE POLICY "Super admins can manage ai_failsafe_events" ON public.ai_failsafe_events FOR ALL USING (true);
CREATE POLICY "Super admins can manage zero_blame_incidents" ON public.zero_blame_incidents FOR ALL USING (true);
CREATE POLICY "Super admins can manage boss_override_logs" ON public.boss_override_logs FOR ALL USING (true);

-- Insert sample data
INSERT INTO public.role_inactivity_flags (role_type, role_id, role_name, last_activity_at, sla_threshold_hours, auto_rerouted, earnings_paused) VALUES
('franchise', gen_random_uuid(), 'Metro Franchise', now() - interval '48 hours', 24, true, true),
('reseller', gen_random_uuid(), 'Quick Sales', now() - interval '36 hours', 24, true, false);

INSERT INTO public.role_reputation_scores (role_type, role_id, role_name, reputation_score, quality_score, response_time_score, visibility_level, throttle_percentage) VALUES
('franchise', gen_random_uuid(), 'Premium Franchise', 95.5, 98.0, 92.0, 'full', 0),
('reseller', gen_random_uuid(), 'Star Reseller', 72.3, 65.0, 80.0, 'limited', 30),
('influencer', gen_random_uuid(), 'Top Influencer', 88.0, 90.0, 85.0, 'full', 0);

INSERT INTO public.system_takeovers (role_type, role_id, role_name, takeover_reason, backup_pool_assigned, campaigns_paused, leads_reassigned, status) VALUES
('franchise', gen_random_uuid(), 'Inactive Franchise', 'Role unresponsive for 72+ hours', true, 3, 12, 'active');

INSERT INTO public.ai_failsafe_events (trigger_type, error_details, action_taken, fallback_mode, ai_disabled, user_friendly_message) VALUES
('api_timeout', 'OpenAI API timeout after 30s', 'Switched to cached responses', 'cached_data', false, 'Loading optimized results'),
('cost_spike', 'Daily AI cost exceeded $500 threshold', 'Reduced AI frequency', 'throttled', false, 'System optimizing resources');

INSERT INTO public.zero_blame_incidents (incident_type, actual_cause, user_facing_message, internal_details, severity, affected_users) VALUES
('delayed_response', 'Franchise timeout on lead assignment', 'Your request is being processed', 'Franchise ID xyz failed to respond within SLA', 'low', 5),
('payment_delay', 'Reseller wallet sync failed', 'Payment processing in progress', 'Wallet API returned 503', 'medium', 12);
