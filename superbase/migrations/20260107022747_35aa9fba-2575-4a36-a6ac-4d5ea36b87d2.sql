-- Create table for country-specific SEO pages (if not exists)
CREATE TABLE IF NOT EXISTS public.seo_country_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code VARCHAR(5) NOT NULL,
  country_name VARCHAR(100) NOT NULL,
  language_code VARCHAR(10) DEFAULT 'en',
  slug VARCHAR(100) NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  faq_schema JSONB,
  currency_code VARCHAR(5),
  is_active BOOLEAN DEFAULT true,
  low_bandwidth_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(country_code, language_code)
);

-- Create table for AI SEO tasks/actions (if not exists)
CREATE TABLE IF NOT EXISTS public.seo_ai_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_type VARCHAR(100) NOT NULL,
  target_country VARCHAR(5),
  target_url TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  ai_input JSONB,
  ai_output JSONB,
  error_message TEXT,
  executed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for SEO alerts/opportunities (if not exists)
CREATE TABLE IF NOT EXISTS public.seo_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type VARCHAR(100) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  country_code VARCHAR(5),
  priority VARCHAR(20) DEFAULT 'medium',
  is_read BOOLEAN DEFAULT false,
  is_actioned BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.seo_country_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_ai_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for super admins and admins only
CREATE POLICY "Admins can manage SEO country pages" 
ON public.seo_country_pages 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Admins can manage SEO AI tasks" 
ON public.seo_ai_tasks 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Admins can manage SEO alerts" 
ON public.seo_alerts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

-- Create updated_at trigger for country pages
DROP TRIGGER IF EXISTS update_seo_country_pages_updated_at ON public.seo_country_pages;
CREATE TRIGGER update_seo_country_pages_updated_at
BEFORE UPDATE ON public.seo_country_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();