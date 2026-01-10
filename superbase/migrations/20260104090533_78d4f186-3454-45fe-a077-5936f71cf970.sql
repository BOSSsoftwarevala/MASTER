-- Create reseller status enum
CREATE TYPE public.reseller_status AS ENUM ('active', 'paused', 'pending', 'suspended');

-- Create reseller plan tier enum
CREATE TYPE public.reseller_plan_tier AS ENUM ('silver', 'gold', 'platinum');

-- Create wallet transaction type enum
CREATE TYPE public.wallet_transaction_type AS ENUM ('credit', 'debit', 'adjustment', 'settlement');

-- Create reseller violation status enum
CREATE TYPE public.reseller_violation_status AS ENUM ('open', 'warning_issued', 'suspended', 'closed');

-- Reseller Plans table
CREATE TABLE public.reseller_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tier reseller_plan_tier NOT NULL,
  description TEXT,
  monthly_fee NUMERIC NOT NULL DEFAULT 0,
  commission_rate NUMERIC NOT NULL DEFAULT 10,
  lead_cap INTEGER DEFAULT 100,
  benefits JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Resellers table
CREATE TABLE public.resellers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_id UUID REFERENCES public.profiles(id),
  plan_id UUID REFERENCES public.reseller_plans(id),
  business_name TEXT,
  legal_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  status reseller_status NOT NULL DEFAULT 'pending',
  kyc_status kyc_status DEFAULT 'pending',
  kyc_documents JSONB DEFAULT '[]'::jsonb,
  referral_code TEXT UNIQUE,
  geo_scope JSONB DEFAULT '{}'::jsonb,
  joined_at TIMESTAMP WITH TIME ZONE,
  suspended_at TIMESTAMP WITH TIME ZONE,
  suspended_reason TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reseller Scopes (geo & lead assignment)
CREATE TABLE public.reseller_scopes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
  scope_type TEXT NOT NULL DEFAULT 'geo', -- geo, product, industry
  country TEXT,
  state TEXT,
  city TEXT,
  product_ids UUID[],
  industry_tags TEXT[],
  priority INTEGER DEFAULT 1,
  lead_cap INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT true,
  assigned_by UUID,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead Distribution Rules
CREATE TABLE public.lead_distribution_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  rule_type TEXT NOT NULL, -- round_robin, priority, geo_match, capacity
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  priority INTEGER DEFAULT 1,
  is_enabled BOOLEAN DEFAULT true,
  created_by UUID,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reseller Wallets
CREATE TABLE public.reseller_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE UNIQUE,
  balance NUMERIC NOT NULL DEFAULT 0,
  pending_credits NUMERIC DEFAULT 0,
  pending_debits NUMERIC DEFAULT 0,
  total_earned NUMERIC DEFAULT 0,
  total_withdrawn NUMERIC DEFAULT 0,
  is_locked BOOLEAN DEFAULT false,
  locked_reason TEXT,
  locked_at TIMESTAMP WITH TIME ZONE,
  locked_by UUID,
  last_settlement_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Wallet Ledger (transaction history)
CREATE TABLE public.wallet_ledger (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID NOT NULL REFERENCES public.reseller_wallets(id) ON DELETE CASCADE,
  reseller_id UUID NOT NULL REFERENCES public.resellers(id),
  transaction_type wallet_transaction_type NOT NULL,
  amount NUMERIC NOT NULL,
  balance_before NUMERIC NOT NULL,
  balance_after NUMERIC NOT NULL,
  reference_type TEXT, -- sale, lead, adjustment, payout
  reference_id UUID,
  description TEXT,
  performed_by UUID,
  performed_by_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reseller Performance
CREATE TABLE public.reseller_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  leads_received INTEGER DEFAULT 0,
  leads_converted INTEGER DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  revenue_generated NUMERIC DEFAULT 0,
  commission_earned NUMERIC DEFAULT 0,
  ranking INTEGER,
  performance_score NUMERIC DEFAULT 0,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reseller Violations
CREATE TABLE public.reseller_violations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
  violation_type TEXT NOT NULL,
  severity violation_severity NOT NULL DEFAULT 'medium',
  status reseller_violation_status NOT NULL DEFAULT 'open',
  title TEXT NOT NULL,
  description TEXT,
  evidence JSONB DEFAULT '[]'::jsonb,
  reported_by UUID,
  reported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  warning_issued_at TIMESTAMP WITH TIME ZONE,
  warning_issued_by UUID,
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reseller Audit Logs
CREATE TABLE public.reseller_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reseller_id UUID REFERENCES public.resellers(id),
  action TEXT NOT NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  details TEXT,
  performed_by UUID,
  performed_by_name TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.reseller_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_scopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_distribution_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reseller_plans
CREATE POLICY "Anyone can view active reseller plans" ON public.reseller_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage reseller plans" ON public.reseller_plans FOR ALL USING (is_admin_or_super(auth.uid()));

-- RLS Policies for resellers
CREATE POLICY "Admins can view all resellers" ON public.resellers FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Users can view own reseller profile" ON public.resellers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage resellers" ON public.resellers FOR ALL USING (is_admin_or_super(auth.uid()));

-- RLS Policies for reseller_scopes
CREATE POLICY "Admins can view all scopes" ON public.reseller_scopes FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Resellers can view own scopes" ON public.reseller_scopes FOR SELECT USING (
  EXISTS (SELECT 1 FROM resellers WHERE resellers.id = reseller_scopes.reseller_id AND resellers.user_id = auth.uid())
);
CREATE POLICY "Admins can manage scopes" ON public.reseller_scopes FOR ALL USING (is_admin_or_super(auth.uid()));

-- RLS Policies for lead_distribution_rules
CREATE POLICY "Admins can view lead rules" ON public.lead_distribution_rules FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Admins can manage lead rules" ON public.lead_distribution_rules FOR ALL USING (is_admin_or_super(auth.uid()));

-- RLS Policies for reseller_wallets
CREATE POLICY "Admins can view all wallets" ON public.reseller_wallets FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Resellers can view own wallet" ON public.reseller_wallets FOR SELECT USING (
  EXISTS (SELECT 1 FROM resellers WHERE resellers.id = reseller_wallets.reseller_id AND resellers.user_id = auth.uid())
);
CREATE POLICY "Admins can manage wallets" ON public.reseller_wallets FOR ALL USING (is_admin_or_super(auth.uid()));

-- RLS Policies for wallet_ledger
CREATE POLICY "Admins can view all ledger" ON public.wallet_ledger FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Resellers can view own ledger" ON public.wallet_ledger FOR SELECT USING (
  EXISTS (SELECT 1 FROM resellers WHERE resellers.id = wallet_ledger.reseller_id AND resellers.user_id = auth.uid())
);
CREATE POLICY "Admins can insert ledger entries" ON public.wallet_ledger FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

-- RLS Policies for reseller_performance
CREATE POLICY "Admins can view all performance" ON public.reseller_performance FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Resellers can view own performance" ON public.reseller_performance FOR SELECT USING (
  EXISTS (SELECT 1 FROM resellers WHERE resellers.id = reseller_performance.reseller_id AND resellers.user_id = auth.uid())
);
CREATE POLICY "Admins can manage performance" ON public.reseller_performance FOR ALL USING (is_admin_or_super(auth.uid()));

-- RLS Policies for reseller_violations
CREATE POLICY "Admins can view all violations" ON public.reseller_violations FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Admins can manage violations" ON public.reseller_violations FOR ALL USING (is_admin_or_super(auth.uid()));

-- RLS Policies for reseller_audit_logs
CREATE POLICY "Admins can view reseller audit logs" ON public.reseller_audit_logs FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "System can insert reseller audit logs" ON public.reseller_audit_logs FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

-- Create updated_at triggers
CREATE TRIGGER update_reseller_plans_updated_at BEFORE UPDATE ON public.reseller_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_resellers_updated_at BEFORE UPDATE ON public.resellers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reseller_scopes_updated_at BEFORE UPDATE ON public.reseller_scopes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lead_distribution_rules_updated_at BEFORE UPDATE ON public.lead_distribution_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reseller_wallets_updated_at BEFORE UPDATE ON public.reseller_wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reseller_performance_updated_at BEFORE UPDATE ON public.reseller_performance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reseller_violations_updated_at BEFORE UPDATE ON public.reseller_violations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_resellers_user_id ON public.resellers(user_id);
CREATE INDEX idx_resellers_status ON public.resellers(status);
CREATE INDEX idx_reseller_scopes_reseller_id ON public.reseller_scopes(reseller_id);
CREATE INDEX idx_reseller_wallets_reseller_id ON public.reseller_wallets(reseller_id);
CREATE INDEX idx_wallet_ledger_wallet_id ON public.wallet_ledger(wallet_id);
CREATE INDEX idx_wallet_ledger_reseller_id ON public.wallet_ledger(reseller_id);
CREATE INDEX idx_reseller_performance_reseller_id ON public.reseller_performance(reseller_id);
CREATE INDEX idx_reseller_violations_reseller_id ON public.reseller_violations(reseller_id);
CREATE INDEX idx_reseller_audit_logs_reseller_id ON public.reseller_audit_logs(reseller_id);

-- Insert default reseller plans
INSERT INTO public.reseller_plans (name, tier, description, monthly_fee, commission_rate, lead_cap, benefits) VALUES
('Silver Partner', 'silver', 'Entry-level reseller partnership', 999, 10, 50, '["Basic support", "Monthly reports", "Standard leads"]'::jsonb),
('Gold Partner', 'gold', 'Enhanced reseller partnership', 2499, 15, 150, '["Priority support", "Weekly reports", "Premium leads", "Training access"]'::jsonb),
('Platinum Partner', 'platinum', 'Elite reseller partnership', 4999, 20, 500, '["24/7 support", "Real-time reports", "Exclusive leads", "Dedicated manager", "Custom pricing"]'::jsonb);