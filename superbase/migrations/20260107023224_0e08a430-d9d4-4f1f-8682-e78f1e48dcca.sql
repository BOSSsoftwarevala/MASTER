-- Create table for AI-powered leads
CREATE TABLE IF NOT EXISTS public.ai_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel VARCHAR(50) NOT NULL,
  source_country VARCHAR(5),
  source_region VARCHAR(50),
  language_detected VARCHAR(10) DEFAULT 'en',
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  contact_company VARCHAR(255),
  raw_message TEXT,
  ai_intent VARCHAR(100),
  ai_score INTEGER DEFAULT 0,
  ai_temperature VARCHAR(20) DEFAULT 'cold',
  ai_action VARCHAR(50),
  ai_summary TEXT,
  ai_next_step TEXT,
  assigned_franchise_id UUID,
  assigned_reseller_id UUID,
  territory_code VARCHAR(10),
  routed_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'new',
  is_responded BOOLEAN DEFAULT false,
  response_time_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_deleted BOOLEAN DEFAULT false
);

-- Create table for AI lead messages
CREATE TABLE IF NOT EXISTS public.ai_lead_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.ai_leads(id) ON DELETE CASCADE,
  direction VARCHAR(10) NOT NULL,
  channel VARCHAR(50) NOT NULL,
  message_content TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for daily AI insights
CREATE TABLE IF NOT EXISTS public.ai_daily_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_type VARCHAR(100) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  country_code VARCHAR(5),
  region VARCHAR(50),
  priority VARCHAR(20) DEFAULT 'medium',
  metadata JSONB,
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_lead_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_daily_insights ENABLE ROW LEVEL SECURITY;

-- RLS policies for admins only (franchise isolation handled in app layer)
CREATE POLICY "Admins can manage all leads" 
ON public.ai_leads FOR ALL 
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admins can manage lead messages" 
ON public.ai_lead_messages FOR ALL 
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admins can manage daily insights" 
ON public.ai_daily_insights FOR ALL 
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_ai_leads_updated_at ON public.ai_leads;
CREATE TRIGGER update_ai_leads_updated_at
BEFORE UPDATE ON public.ai_leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();