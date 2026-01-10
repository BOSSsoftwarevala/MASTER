
-- AI Decisions Log (tracks all AI automated decisions)
CREATE TABLE public.ai_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_engine TEXT NOT NULL, -- 'auto_recovery', 'incident_prediction', 'cost_optimizer'
  decision_type TEXT NOT NULL,
  trigger_event TEXT,
  action_taken TEXT NOT NULL,
  affected_entity TEXT,
  affected_entity_id UUID,
  severity TEXT DEFAULT 'info',
  was_approved BOOLEAN DEFAULT false,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  user_message TEXT, -- positive message shown to user
  internal_details TEXT, -- real error/issue logged internally
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Incident Predictions
CREATE TABLE public.incident_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_type TEXT NOT NULL, -- 'cpu_spike', 'api_latency', 'cost_surge', 'traffic_spike', 'error_rate'
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  predicted_incident TEXT NOT NULL,
  suggested_action TEXT,
  affected_service TEXT,
  affected_service_id UUID,
  is_auto_action_enabled BOOLEAN DEFAULT false,
  action_taken TEXT,
  action_taken_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- 'pending', 'mitigated', 'occurred', 'false_alarm'
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Recovery Events
CREATE TABLE public.recovery_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'api_timeout', 'server_slow', 'db_delay', 'edge_crash', 'deploy_error'
  original_error TEXT,
  recovery_action TEXT NOT NULL,
  recovery_status TEXT DEFAULT 'pending', -- 'pending', 'success', 'failed', 'manual_required'
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  fallback_used BOOLEAN DEFAULT false,
  fallback_type TEXT,
  user_notified BOOLEAN DEFAULT false,
  owner_notified BOOLEAN DEFAULT false,
  affected_service TEXT,
  affected_service_id UUID,
  user_message TEXT, -- positive message shown
  internal_log TEXT, -- real error details
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Optimization Actions (Cost Optimizer)
CREATE TABLE public.optimization_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  optimization_type TEXT NOT NULL, -- 'switch_model', 'reduce_frequency', 'cache_response', 'pause_service'
  target_service TEXT NOT NULL,
  target_service_id UUID,
  reason TEXT,
  savings_estimated DECIMAL(10,2),
  savings_actual DECIMAL(10,2),
  old_config JSONB,
  new_config JSONB,
  status TEXT DEFAULT 'pending', -- 'pending', 'applied', 'reverted', 'failed'
  applied_at TIMESTAMPTZ,
  applied_by UUID,
  reverted_at TIMESTAMPTZ,
  reverted_by UUID,
  is_auto_applied BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Recovery Rules
CREATE TABLE public.recovery_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  trigger_condition TEXT NOT NULL, -- 'api_timeout', 'error_rate > 5%', 'latency > 2000ms'
  action_type TEXT NOT NULL, -- 'retry', 'fallback', 'disable', 'notify'
  action_config JSONB DEFAULT '{}'::jsonb,
  priority INTEGER DEFAULT 1,
  is_enabled BOOLEAN DEFAULT true,
  requires_approval BOOLEAN DEFAULT false,
  max_auto_retries INTEGER DEFAULT 3,
  cooldown_seconds INTEGER DEFAULT 60,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Prediction Rules
CREATE TABLE public.prediction_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  metric_type TEXT NOT NULL, -- 'cpu', 'memory', 'api_latency', 'error_rate', 'cost', 'traffic'
  threshold_warning DECIMAL(10,2),
  threshold_critical DECIMAL(10,2),
  prediction_window_minutes INTEGER DEFAULT 30,
  auto_action_enabled BOOLEAN DEFAULT false,
  auto_action_type TEXT, -- 'scale', 'throttle', 'disable'
  notification_channels TEXT[] DEFAULT ARRAY['dashboard'],
  is_enabled BOOLEAN DEFAULT true,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Fallback Rules
CREATE TABLE public.fallback_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT NOT NULL, -- 'ai_service', 'api_provider', 'edge_function'
  service_id UUID,
  fallback_type TEXT NOT NULL, -- 'cached_data', 'default_response', 'alternative_service', 'safe_mode'
  fallback_config JSONB DEFAULT '{}'::jsonb,
  positive_message TEXT DEFAULT 'We are optimizing your request, please wait...',
  priority INTEGER DEFAULT 1,
  is_enabled BOOLEAN DEFAULT true,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- API Registry (extended from api_providers)
CREATE TABLE public.api_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_name TEXT NOT NULL,
  api_type TEXT NOT NULL, -- 'internal', 'external', 'third_party'
  base_url TEXT,
  health_check_url TEXT,
  health_status TEXT DEFAULT 'unknown', -- 'healthy', 'degraded', 'unhealthy', 'unknown'
  last_health_check TIMESTAMPTZ,
  response_time_ms INTEGER,
  uptime_percent DECIMAL(5,2) DEFAULT 100.00,
  rate_limit_per_minute INTEGER,
  rate_limit_per_day INTEGER,
  current_usage_minute INTEGER DEFAULT 0,
  current_usage_day INTEGER DEFAULT 0,
  fallback_enabled BOOLEAN DEFAULT true,
  fallback_response JSONB,
  is_enabled BOOLEAN DEFAULT true,
  requires_auth BOOLEAN DEFAULT true,
  auth_type TEXT, -- 'api_key', 'oauth', 'jwt', 'none'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.ai_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optimization_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fallback_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_registry ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Super Admin access
CREATE POLICY "Super admins can manage ai_decisions" ON public.ai_decisions FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins can manage incident_predictions" ON public.incident_predictions FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins can manage recovery_events" ON public.recovery_events FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins can manage optimization_actions" ON public.optimization_actions FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins can manage recovery_rules" ON public.recovery_rules FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins can manage prediction_rules" ON public.prediction_rules FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins can manage fallback_rules" ON public.fallback_rules FOR ALL USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins can manage api_registry" ON public.api_registry FOR ALL USING (public.is_super_admin(auth.uid()));

-- Insert sample data for demo
INSERT INTO public.recovery_rules (rule_name, trigger_condition, action_type, action_config, priority) VALUES
('API Timeout Recovery', 'api_timeout > 5000ms', 'retry', '{"max_retries": 3, "delay_ms": 1000}'::jsonb, 1),
('High Error Rate Fallback', 'error_rate > 5%', 'fallback', '{"type": "cached_data"}'::jsonb, 2),
('Server Overload Throttle', 'cpu > 90%', 'notify', '{"channels": ["dashboard", "email"]}'::jsonb, 3);

INSERT INTO public.prediction_rules (rule_name, metric_type, threshold_warning, threshold_critical, auto_action_enabled) VALUES
('CPU Spike Detection', 'cpu', 70, 90, false),
('API Latency Monitor', 'api_latency', 1000, 3000, true),
('Cost Surge Alert', 'cost', 80, 95, true),
('Traffic Spike Detection', 'traffic', 150, 200, false);

INSERT INTO public.fallback_rules (service_type, fallback_type, positive_message, priority) VALUES
('ai_service', 'safe_mode', 'We are optimizing your request, please retry shortly.', 1),
('api_provider', 'cached_data', 'Loading optimized data...', 2),
('edge_function', 'default_response', 'System is improving performance, please wait.', 3);

INSERT INTO public.api_registry (api_name, api_type, health_status, uptime_percent, rate_limit_per_minute) VALUES
('OpenAI GPT', 'external', 'healthy', 99.95, 60),
('Internal Auth API', 'internal', 'healthy', 99.99, 1000),
('Payment Gateway', 'third_party', 'healthy', 99.90, 100),
('Email Service', 'external', 'degraded', 98.50, 200);

-- Sample incident predictions
INSERT INTO public.incident_predictions (prediction_type, risk_score, predicted_incident, suggested_action, affected_service, status) VALUES
('api_latency', 75, 'OpenAI API response time increasing', 'Switch to cached responses or fallback model', 'OpenAI GPT', 'pending'),
('cost_surge', 45, 'AI token usage 45% above normal', 'Enable cost optimizer throttling', 'AI Services', 'mitigated'),
('traffic_spike', 30, 'Traffic increase detected in next 2 hours', 'Pre-scale edge functions', 'Edge Functions', 'pending');

-- Sample recovery events
INSERT INTO public.recovery_events (event_type, original_error, recovery_action, recovery_status, user_message, internal_log) VALUES
('api_timeout', 'OpenAI API timeout after 30s', 'Switched to cached response', 'success', 'We optimized your request for faster loading.', 'API timeout at 2024-01-05T10:30:00Z, fallback cache used'),
('edge_crash', 'Edge function memory limit exceeded', 'Restarted with reduced payload', 'success', 'System performance improved.', 'Memory limit hit, payload reduced and retried');

-- Sample optimization actions
INSERT INTO public.optimization_actions (optimization_type, target_service, reason, savings_estimated, status) VALUES
('switch_model', 'SEO Content AI', 'High token usage, switched to flash-lite', 45.00, 'applied'),
('cache_response', 'Lead Scoring AI', 'Repeated queries detected, caching enabled', 120.00, 'applied'),
('reduce_frequency', 'Auto Development AI', 'Non-peak hours detected', 30.00, 'pending');
