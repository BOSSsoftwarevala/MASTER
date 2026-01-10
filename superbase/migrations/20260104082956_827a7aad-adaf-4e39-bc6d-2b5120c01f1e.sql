
-- Create franchise-related enums
CREATE TYPE public.franchise_status AS ENUM ('pending', 'active', 'suspended', 'terminated');
CREATE TYPE public.franchise_plan_tier AS ENUM ('silver', 'gold', 'platinum');
CREATE TYPE public.territory_type AS ENUM ('exclusive', 'shared');
CREATE TYPE public.franchise_violation_type AS ENUM ('policy_breach', 'territory_abuse', 'payment_issue', 'sla_violation', 'brand_misuse');
CREATE TYPE public.franchise_violation_status AS ENUM ('open', 'warning_issued', 'suspended', 'resolved', 'escalated');

-- Franchise Plans table (reference data)
CREATE TABLE public.franchise_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier franchise_plan_tier NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  setup_fee NUMERIC NOT NULL DEFAULT 0,
  monthly_fee NUMERIC NOT NULL DEFAULT 0,
  commission_rate NUMERIC NOT NULL DEFAULT 20,
  benefits JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Franchises table
CREATE TABLE public.franchises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  legal_name TEXT NOT NULL,
  business_name TEXT,
  status franchise_status NOT NULL DEFAULT 'pending',
  plan_id UUID REFERENCES public.franchise_plans(id),
  territory_level TEXT NOT NULL CHECK (territory_level IN ('city', 'state', 'country')),
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address JSONB,
  kyc_status public.kyc_status DEFAULT 'pending',
  kyc_documents JSONB DEFAULT '[]'::jsonb,
  joined_at TIMESTAMPTZ,
  suspended_at TIMESTAMPTZ,
  suspended_reason TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Franchise Applications table
CREATE TABLE public.franchise_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_user_id UUID NOT NULL,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  business_name TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  territory_level TEXT NOT NULL CHECK (territory_level IN ('city', 'state', 'country')),
  requested_territory JSONB NOT NULL, -- {country, state, city}
  plan_tier franchise_plan_tier NOT NULL,
  kyc_documents JSONB DEFAULT '[]'::jsonb,
  business_experience TEXT,
  investment_capacity TEXT,
  status public.access_request_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  rejection_reason TEXT,
  approved_franchise_id UUID REFERENCES public.franchises(id),
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Franchise Territories table
CREATE TABLE public.franchise_territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchises(id) ON DELETE CASCADE,
  country TEXT NOT NULL,
  state TEXT,
  city TEXT,
  territory_type territory_type NOT NULL DEFAULT 'exclusive',
  is_active BOOLEAN DEFAULT true,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID,
  expires_at TIMESTAMPTZ,
  notes TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(country, state, city, territory_type)
);

-- Franchise Performance table
CREATE TABLE public.franchise_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchises(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  leads_received INTEGER DEFAULT 0,
  leads_converted INTEGER DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  revenue_generated NUMERIC DEFAULT 0,
  commission_earned NUMERIC DEFAULT 0,
  sla_score NUMERIC DEFAULT 100,
  ranking INTEGER,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(franchise_id, period_start, period_end)
);

-- Franchise Wallet (view of finance data)
CREATE TABLE public.franchise_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchises(id) ON DELETE CASCADE UNIQUE,
  balance NUMERIC NOT NULL DEFAULT 0,
  pending_payouts NUMERIC DEFAULT 0,
  total_earned NUMERIC DEFAULT 0,
  total_deductions NUMERIC DEFAULT 0,
  last_settlement_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Franchise Violations table
CREATE TABLE public.franchise_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchises(id) ON DELETE CASCADE,
  violation_type franchise_violation_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity public.violation_severity NOT NULL DEFAULT 'medium',
  status franchise_violation_status NOT NULL DEFAULT 'open',
  evidence JSONB DEFAULT '[]'::jsonb,
  reported_by UUID,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  warning_issued_at TIMESTAMPTZ,
  warning_issued_by UUID,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  resolution_notes TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Franchise Audit Logs table
CREATE TABLE public.franchise_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID REFERENCES public.franchises(id),
  action TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'application', 'territory', 'status', 'violation', 'wallet'
  details TEXT,
  old_value JSONB,
  new_value JSONB,
  performed_by UUID,
  performed_by_name TEXT,
  approved_by UUID,
  approved_by_name TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.franchise_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for franchise_plans (public read, admin write)
CREATE POLICY "Anyone can view active franchise plans" ON public.franchise_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage franchise plans" ON public.franchise_plans
  FOR ALL USING (is_admin_or_super(auth.uid()));

-- RLS Policies for franchises
CREATE POLICY "Users can view own franchise" ON public.franchises
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all franchises" ON public.franchises
  FOR SELECT USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Super Admin can manage franchises" ON public.franchises
  FOR ALL USING (is_super_admin(auth.uid()));

-- RLS Policies for franchise_applications
CREATE POLICY "Users can create own applications" ON public.franchise_applications
  FOR INSERT WITH CHECK (applicant_user_id = auth.uid());

CREATE POLICY "Users can view own applications" ON public.franchise_applications
  FOR SELECT USING (applicant_user_id = auth.uid() OR is_admin_or_super(auth.uid()));

CREATE POLICY "Super Admin can manage applications" ON public.franchise_applications
  FOR ALL USING (is_super_admin(auth.uid()));

-- RLS Policies for franchise_territories
CREATE POLICY "Admins can view territories" ON public.franchise_territories
  FOR SELECT USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Franchise owners can view own territories" ON public.franchise_territories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.franchises 
      WHERE franchises.id = franchise_territories.franchise_id 
      AND franchises.user_id = auth.uid()
    )
  );

CREATE POLICY "Super Admin can manage territories" ON public.franchise_territories
  FOR ALL USING (is_super_admin(auth.uid()));

-- RLS Policies for franchise_performance
CREATE POLICY "Admins can view all performance" ON public.franchise_performance
  FOR SELECT USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Franchise owners can view own performance" ON public.franchise_performance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.franchises 
      WHERE franchises.id = franchise_performance.franchise_id 
      AND franchises.user_id = auth.uid()
    )
  );

CREATE POLICY "Super Admin can manage performance" ON public.franchise_performance
  FOR ALL USING (is_super_admin(auth.uid()));

-- RLS Policies for franchise_wallets
CREATE POLICY "Admins can view all wallets" ON public.franchise_wallets
  FOR SELECT USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Franchise owners can view own wallet" ON public.franchise_wallets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.franchises 
      WHERE franchises.id = franchise_wallets.franchise_id 
      AND franchises.user_id = auth.uid()
    )
  );

-- RLS Policies for franchise_violations
CREATE POLICY "Admins can view violations" ON public.franchise_violations
  FOR SELECT USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Super Admin can manage violations" ON public.franchise_violations
  FOR ALL USING (is_super_admin(auth.uid()));

-- RLS Policies for franchise_audit_logs
CREATE POLICY "Super Admin can view franchise audit logs" ON public.franchise_audit_logs
  FOR SELECT USING (is_super_admin(auth.uid()));

CREATE POLICY "System can insert franchise audit logs" ON public.franchise_audit_logs
  FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

-- Create updated_at triggers
CREATE TRIGGER update_franchise_plans_updated_at BEFORE UPDATE ON public.franchise_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_franchises_updated_at BEFORE UPDATE ON public.franchises
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_franchise_applications_updated_at BEFORE UPDATE ON public.franchise_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_franchise_territories_updated_at BEFORE UPDATE ON public.franchise_territories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_franchise_performance_updated_at BEFORE UPDATE ON public.franchise_performance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_franchise_wallets_updated_at BEFORE UPDATE ON public.franchise_wallets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_franchise_violations_updated_at BEFORE UPDATE ON public.franchise_violations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_franchises_user_id ON public.franchises(user_id);
CREATE INDEX idx_franchises_status ON public.franchises(status);
CREATE INDEX idx_franchise_applications_status ON public.franchise_applications(status);
CREATE INDEX idx_franchise_territories_franchise_id ON public.franchise_territories(franchise_id);
CREATE INDEX idx_franchise_territories_location ON public.franchise_territories(country, state, city);
CREATE INDEX idx_franchise_performance_franchise_id ON public.franchise_performance(franchise_id);
CREATE INDEX idx_franchise_violations_franchise_id ON public.franchise_violations(franchise_id);
CREATE INDEX idx_franchise_violations_status ON public.franchise_violations(status);
CREATE INDEX idx_franchise_audit_logs_franchise_id ON public.franchise_audit_logs(franchise_id);

-- Insert default franchise plans
INSERT INTO public.franchise_plans (tier, name, description, setup_fee, monthly_fee, commission_rate, benefits) VALUES
('silver', 'Silver Partner', 'Entry-level franchise partnership', 50000, 5000, 15, '["Basic territory access", "Standard support", "Monthly reports"]'::jsonb),
('gold', 'Gold Partner', 'Premium franchise partnership with expanded benefits', 150000, 10000, 20, '["Priority territory access", "Dedicated support", "Weekly reports", "Marketing materials", "Training programs"]'::jsonb),
('platinum', 'Platinum Partner', 'Elite franchise partnership with maximum benefits', 500000, 25000, 25, '["Exclusive territory rights", "24/7 dedicated support", "Real-time analytics", "Custom marketing", "Executive training", "Priority lead allocation"]'::jsonb);
