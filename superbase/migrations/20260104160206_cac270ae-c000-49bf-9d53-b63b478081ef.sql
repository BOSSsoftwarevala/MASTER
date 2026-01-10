-- Add product_demo_manager role to app_role enum if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'product_demo_manager' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
    ALTER TYPE public.app_role ADD VALUE 'product_demo_manager';
  END IF;
END $$;

-- Add status column to products if not exists
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Demos table
CREATE TABLE IF NOT EXISTS public.demos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID,
  user_email TEXT,
  user_name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  extended_count INTEGER DEFAULT 0,
  max_extensions INTEGER DEFAULT 1,
  access_code TEXT,
  notes TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Demo limits table
CREATE TABLE IF NOT EXISTS public.demo_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  max_users INTEGER DEFAULT 5,
  max_storage_mb INTEGER DEFAULT 100,
  max_api_calls INTEGER DEFAULT 1000,
  allowed_features JSONB,
  restricted_features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Demo requests table
CREATE TABLE IF NOT EXISTS public.demo_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_phone TEXT,
  company_name TEXT,
  company_size TEXT,
  use_case TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejected_by UUID,
  rejection_reason TEXT,
  demo_id UUID,
  notes TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Plan mappings table
CREATE TABLE IF NOT EXISTS public.plan_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.finance_plans(id) ON DELETE CASCADE,
  is_visible BOOLEAN DEFAULT true,
  visibility_regions TEXT[],
  visibility_rules JSONB,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, plan_id)
);

-- Demo usage tracking
CREATE TABLE IF NOT EXISTS public.demo_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  demo_id UUID NOT NULL REFERENCES public.demos(id) ON DELETE CASCADE,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  session_count INTEGER DEFAULT 0,
  feature_usage JSONB,
  page_views INTEGER DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  storage_used_mb NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Conversions table
CREATE TABLE IF NOT EXISTS public.conversions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  demo_id UUID NOT NULL REFERENCES public.demos(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID,
  user_email TEXT,
  converted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  plan_id UUID REFERENCES public.finance_plans(id),
  conversion_value NUMERIC(10,2),
  attribution_source TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Product demo activity logs
CREATE TABLE IF NOT EXISTS public.product_demo_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  performed_by UUID,
  performed_by_name TEXT,
  details TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add demo_id FK to demo_requests after demos table exists
ALTER TABLE public.demo_requests DROP CONSTRAINT IF EXISTS demo_requests_demo_id_fkey;
ALTER TABLE public.demo_requests ADD CONSTRAINT demo_requests_demo_id_fkey 
  FOREIGN KEY (demo_id) REFERENCES public.demos(id);

-- Enable RLS
ALTER TABLE public.demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_demo_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create product_demo_manager check function
CREATE OR REPLACE FUNCTION public.is_product_demo_manager()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('product_demo_manager', 'super_admin', 'boss')
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for demos
CREATE POLICY "Product demo managers can view demos" ON public.demos
  FOR SELECT USING (public.is_product_demo_manager() AND is_deleted = false);
CREATE POLICY "Product demo managers can insert demos" ON public.demos
  FOR INSERT WITH CHECK (public.is_product_demo_manager());
CREATE POLICY "Product demo managers can update demos" ON public.demos
  FOR UPDATE USING (public.is_product_demo_manager());

-- RLS Policies for demo_limits
CREATE POLICY "Product demo managers can view demo_limits" ON public.demo_limits
  FOR SELECT USING (public.is_product_demo_manager());
CREATE POLICY "Product demo managers can insert demo_limits" ON public.demo_limits
  FOR INSERT WITH CHECK (public.is_product_demo_manager());
CREATE POLICY "Product demo managers can update demo_limits" ON public.demo_limits
  FOR UPDATE USING (public.is_product_demo_manager());

-- RLS Policies for demo_requests
CREATE POLICY "Product demo managers can view demo_requests" ON public.demo_requests
  FOR SELECT USING (public.is_product_demo_manager() AND is_deleted = false);
CREATE POLICY "Product demo managers can insert demo_requests" ON public.demo_requests
  FOR INSERT WITH CHECK (public.is_product_demo_manager());
CREATE POLICY "Product demo managers can update demo_requests" ON public.demo_requests
  FOR UPDATE USING (public.is_product_demo_manager());

-- RLS Policies for plan_mappings
CREATE POLICY "Product demo managers can view plan_mappings" ON public.plan_mappings
  FOR SELECT USING (public.is_product_demo_manager());
CREATE POLICY "Product demo managers can insert plan_mappings" ON public.plan_mappings
  FOR INSERT WITH CHECK (public.is_product_demo_manager());
CREATE POLICY "Product demo managers can update plan_mappings" ON public.plan_mappings
  FOR UPDATE USING (public.is_product_demo_manager());
CREATE POLICY "Product demo managers can delete plan_mappings" ON public.plan_mappings
  FOR DELETE USING (public.is_product_demo_manager());

-- RLS Policies for demo_usage
CREATE POLICY "Product demo managers can view demo_usage" ON public.demo_usage
  FOR SELECT USING (public.is_product_demo_manager());
CREATE POLICY "Product demo managers can insert demo_usage" ON public.demo_usage
  FOR INSERT WITH CHECK (public.is_product_demo_manager());

-- RLS Policies for conversions
CREATE POLICY "Product demo managers can view conversions" ON public.conversions
  FOR SELECT USING (public.is_product_demo_manager());
CREATE POLICY "Product demo managers can insert conversions" ON public.conversions
  FOR INSERT WITH CHECK (public.is_product_demo_manager());

-- RLS Policies for activity logs
CREATE POLICY "Product demo managers can view activity_logs" ON public.product_demo_activity_logs
  FOR SELECT USING (public.is_product_demo_manager());
CREATE POLICY "Product demo managers can insert activity_logs" ON public.product_demo_activity_logs
  FOR INSERT WITH CHECK (public.is_product_demo_manager());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_demos_product ON public.demos(product_id);
CREATE INDEX IF NOT EXISTS idx_demos_status ON public.demos(status);
CREATE INDEX IF NOT EXISTS idx_demos_expires_at ON public.demos(expires_at);
CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON public.demo_requests(status);
CREATE INDEX IF NOT EXISTS idx_demo_usage_demo ON public.demo_usage(demo_id);
CREATE INDEX IF NOT EXISTS idx_conversions_demo ON public.conversions(demo_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_demos_updated_at ON public.demos;
CREATE TRIGGER update_demos_updated_at BEFORE UPDATE ON public.demos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_demo_limits_updated_at ON public.demo_limits;
CREATE TRIGGER update_demo_limits_updated_at BEFORE UPDATE ON public.demo_limits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_demo_requests_updated_at ON public.demo_requests;
CREATE TRIGGER update_demo_requests_updated_at BEFORE UPDATE ON public.demo_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_plan_mappings_updated_at ON public.plan_mappings;
CREATE TRIGGER update_plan_mappings_updated_at BEFORE UPDATE ON public.plan_mappings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_demo_usage_updated_at ON public.demo_usage;
CREATE TRIGGER update_demo_usage_updated_at BEFORE UPDATE ON public.demo_usage
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();