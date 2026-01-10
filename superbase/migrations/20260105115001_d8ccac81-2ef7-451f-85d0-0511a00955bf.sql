-- Add auto_recovery_logs for tracking recovery events
CREATE TABLE public.auto_recovery_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trigger_type TEXT NOT NULL,
  trigger_source TEXT,
  original_error TEXT,
  recovery_action TEXT NOT NULL,
  recovery_status TEXT DEFAULT 'pending',
  fallback_used TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  duration_ms INTEGER,
  user_impacted BOOLEAN DEFAULT false,
  silent_recovery BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Add cost_optimizer_suggestions for AI cost recommendations
CREATE TABLE public.cost_optimizer_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  suggestion_type TEXT NOT NULL,
  target_service TEXT,
  target_provider TEXT,
  current_cost DECIMAL(10,2) DEFAULT 0,
  projected_savings DECIMAL(10,2) DEFAULT 0,
  recommendation TEXT NOT NULL,
  action_required TEXT,
  auto_applied BOOLEAN DEFAULT false,
  applied_at TIMESTAMPTZ,
  applied_by UUID,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add ai_cost_limits for per-category budget control
CREATE TABLE public.ai_cost_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  daily_limit DECIMAL(10,2) DEFAULT 100,
  monthly_limit DECIMAL(10,2) DEFAULT 2000,
  current_daily_usage DECIMAL(10,2) DEFAULT 0,
  current_monthly_usage DECIMAL(10,2) DEFAULT 0,
  alert_threshold_percent INTEGER DEFAULT 80,
  auto_pause_on_limit BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  last_reset_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.auto_recovery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_optimizer_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_cost_limits ENABLE ROW LEVEL SECURITY;

-- RLS policies for auto_recovery_logs
CREATE POLICY "Auto recovery logs viewable by authenticated users" 
ON public.auto_recovery_logs FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Auto recovery logs insertable by authenticated users" 
ON public.auto_recovery_logs FOR INSERT 
TO authenticated WITH CHECK (true);

-- RLS policies for cost_optimizer_suggestions
CREATE POLICY "Cost optimizer suggestions viewable by authenticated users" 
ON public.cost_optimizer_suggestions FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Cost optimizer suggestions modifiable by authenticated users" 
ON public.cost_optimizer_suggestions FOR ALL 
TO authenticated USING (true) WITH CHECK (true);

-- RLS policies for ai_cost_limits
CREATE POLICY "AI cost limits viewable by authenticated users" 
ON public.ai_cost_limits FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "AI cost limits modifiable by authenticated users" 
ON public.ai_cost_limits FOR ALL 
TO authenticated USING (true) WITH CHECK (true);

-- Insert default AI cost limits for each category
INSERT INTO public.ai_cost_limits (category, daily_limit, monthly_limit, alert_threshold_percent)
VALUES 
  ('development', 200.00, 4000.00, 80),
  ('seo', 100.00, 2000.00, 80),
  ('lead', 150.00, 3000.00, 80),
  ('chatbot', 100.00, 2000.00, 80),
  ('supervisor', 50.00, 1000.00, 90);

-- Insert sample auto recovery logs
INSERT INTO public.auto_recovery_logs (trigger_type, trigger_source, original_error, recovery_action, recovery_status, silent_recovery)
VALUES 
  ('timeout', 'openai_api', 'Request timed out after 30s', 'Retry with exponential backoff', 'success', true),
  ('rate_limit', 'google_ai', 'Rate limit exceeded', 'Switch to backup provider', 'success', true),
  ('connection_error', 'payment_gateway', 'Connection refused', 'Queue request for retry', 'pending', true);

-- Insert sample cost optimizer suggestions
INSERT INTO public.cost_optimizer_suggestions (suggestion_type, target_service, current_cost, projected_savings, recommendation, priority, status)
VALUES 
  ('model_switch', 'development_ai', 500.00, 150.00, 'Switch from GPT-4 to GPT-3.5 for simple code completion tasks', 'high', 'pending'),
  ('batch_processing', 'seo_ai', 200.00, 50.00, 'Batch SEO content generation to reduce API calls', 'medium', 'pending'),
  ('cache_optimization', 'lead_ai', 150.00, 75.00, 'Enable response caching for repeated lead scoring queries', 'high', 'pending');