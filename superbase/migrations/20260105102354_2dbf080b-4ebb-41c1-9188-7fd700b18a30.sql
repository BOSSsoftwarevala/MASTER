-- AI/API Manager Tables

-- AI Services Configuration
CREATE TABLE public.ai_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('development', 'seo', 'lead', 'chatbot', 'supervisor')),
  status TEXT NOT NULL DEFAULT 'off' CHECK (status IN ('off', 'on', 'limited', 'scheduled')),
  model_provider TEXT DEFAULT 'openai',
  model_name TEXT,
  monthly_limit NUMERIC DEFAULT 0,
  current_usage NUMERIC DEFAULT 0,
  cost_per_request NUMERIC DEFAULT 0,
  is_enabled BOOLEAN DEFAULT false,
  requires_approval BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- API Providers Configuration
CREATE TABLE public.api_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('ai', 'seo', 'lead', 'payment', 'notification', 'storage', 'other')),
  status TEXT NOT NULL DEFAULT 'not_connected' CHECK (status IN ('not_connected', 'connected', 'error', 'paused')),
  base_url TEXT,
  is_enabled BOOLEAN DEFAULT false,
  monthly_limit NUMERIC DEFAULT 0,
  current_usage NUMERIC DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  last_error TEXT,
  last_error_at TIMESTAMP WITH TIME ZONE,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- API Keys (encrypted storage reference)
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES public.api_providers(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  key_hint TEXT, -- Last 4 chars for display
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- API Usage Logs
CREATE TABLE public.api_usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES public.api_providers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.ai_services(id) ON DELETE SET NULL,
  endpoint TEXT,
  method TEXT,
  status_code INTEGER,
  response_time_ms INTEGER,
  tokens_used INTEGER,
  cost NUMERIC DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Execution Logs
CREATE TABLE public.ai_execution_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.ai_services(id) ON DELETE SET NULL,
  execution_type TEXT NOT NULL,
  input_summary TEXT,
  output_summary TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  tokens_input INTEGER,
  tokens_output INTEGER,
  cost NUMERIC DEFAULT 0,
  duration_ms INTEGER,
  error_message TEXT,
  approval_required BOOLEAN DEFAULT false,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- API Alerts
CREATE TABLE public.api_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES public.api_providers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.ai_services(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('limit_warning', 'limit_reached', 'error', 'expiry', 'connection_lost')),
  severity TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Super Admin only access)
CREATE POLICY "Super admins can manage ai_services" ON public.ai_services
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Super admins can manage api_providers" ON public.api_providers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Super admins can manage api_keys" ON public.api_keys
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Super admins can view api_usage_logs" ON public.api_usage_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "System can insert api_usage_logs" ON public.api_usage_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Super admins can manage ai_execution_logs" ON public.ai_execution_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Super admins can manage api_alerts" ON public.api_alerts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
  );

-- Insert default AI services
INSERT INTO public.ai_services (service_key, name, description, category, status, model_provider, model_name) VALUES
  ('auto_development', 'Auto Development AI', 'Code generation, bug fixing, feature development', 'development', 'off', 'openai', 'gpt-4.1'),
  ('seo_ai', 'SEO & Content AI', 'Keyword generation, SEO content, meta & schema', 'seo', 'off', 'openai', 'gpt-4.1-mini'),
  ('lead_ai', 'Lead & Marketing AI', 'Lead scoring, spam detection, campaign optimization', 'lead', 'off', 'openai', 'gpt-4.1-mini'),
  ('chatbot_ai', 'Chatbot AI', 'Client support, requirement clarification, translations', 'chatbot', 'off', 'openai', 'gpt-4.1-mini'),
  ('supervisor_ai', 'AI Supervisor', 'System monitoring, risk detection, recommendations', 'supervisor', 'off', 'openai', 'gpt-4.1-mini');

-- Insert default API providers
INSERT INTO public.api_providers (provider_key, name, description, category, status) VALUES
  ('openai', 'OpenAI', 'GPT-4 and GPT-4.1 models', 'ai', 'not_connected'),
  ('google_ai', 'Google AI', 'Gemini models', 'ai', 'not_connected'),
  ('anthropic', 'Anthropic', 'Claude models', 'ai', 'not_connected'),
  ('semrush', 'SEMrush', 'SEO analytics and keywords', 'seo', 'not_connected'),
  ('ahrefs', 'Ahrefs', 'Backlink and SEO analysis', 'seo', 'not_connected'),
  ('clearbit', 'Clearbit', 'Lead enrichment', 'lead', 'not_connected'),
  ('twilio', 'Twilio', 'SMS and voice notifications', 'notification', 'not_connected'),
  ('sendgrid', 'SendGrid', 'Email delivery', 'notification', 'not_connected');

-- Trigger for updated_at
CREATE TRIGGER update_ai_services_updated_at BEFORE UPDATE ON public.ai_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_api_providers_updated_at BEFORE UPDATE ON public.api_providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON public.api_keys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();