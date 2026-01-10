
-- Create enums for finance module (only if not exists)
DO $$ BEGIN CREATE TYPE public.wallet_type AS ENUM ('company', 'franchise', 'reseller', 'user'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.transaction_type AS ENUM ('credit', 'debit', 'hold', 'release'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.invoice_status AS ENUM ('draft', 'pending', 'paid', 'cancelled', 'overdue'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.payout_status AS ENUM ('pending', 'approved', 'processing', 'completed', 'failed', 'held'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.plan_type AS ENUM ('prime_user', 'franchise', 'reseller', 'api'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.cost_category AS ENUM ('ai', 'api', 'server', 'storage', 'bandwidth', 'other'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Wallets table
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_type public.wallet_type NOT NULL,
  owner_id UUID NOT NULL,
  owner_name TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0,
  hold_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  is_locked BOOLEAN NOT NULL DEFAULT false,
  lock_reason TEXT,
  locked_at TIMESTAMP WITH TIME ZONE,
  locked_by UUID,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add wallet_id to wallet_ledger if it doesn't have it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'wallet_ledger' AND column_name = 'wallet_id') THEN
    ALTER TABLE public.wallet_ledger ADD COLUMN wallet_id UUID REFERENCES public.wallets(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'wallet_ledger' AND column_name = 'transaction_type') THEN
    ALTER TABLE public.wallet_ledger ADD COLUMN transaction_type TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'wallet_ledger' AND column_name = 'balance_before') THEN
    ALTER TABLE public.wallet_ledger ADD COLUMN balance_before NUMERIC DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'wallet_ledger' AND column_name = 'balance_after') THEN
    ALTER TABLE public.wallet_ledger ADD COLUMN balance_after NUMERIC DEFAULT 0;
  END IF;
END $$;

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  status public.invoice_status NOT NULL DEFAULT 'draft',
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_by_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Invoice items
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Finance plans table
CREATE TABLE IF NOT EXISTS public.finance_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  plan_type public.plan_type NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  features JSONB DEFAULT '[]'::jsonb,
  limits JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Finance subscriptions table
CREATE TABLE IF NOT EXISTS public.finance_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.finance_plans(id),
  status TEXT NOT NULL DEFAULT 'active',
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN NOT NULL DEFAULT true,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Finance payouts table
CREATE TABLE IF NOT EXISTS public.finance_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  beneficiary_id UUID NOT NULL,
  beneficiary_name TEXT NOT NULL,
  beneficiary_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  payout_method TEXT,
  bank_details JSONB,
  status public.payout_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  approved_by UUID,
  approved_by_name TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  processed_at TIMESTAMP WITH TIME ZONE,
  held_reason TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cost logs table
CREATE TABLE IF NOT EXISTS public.cost_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category public.cost_category NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cost limits table
CREATE TABLE IF NOT EXISTS public.cost_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category public.cost_category NOT NULL UNIQUE,
  daily_limit NUMERIC,
  monthly_limit NUMERIC,
  alert_threshold_percent INTEGER DEFAULT 80,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wallets
CREATE POLICY "Admins can manage wallets" ON public.wallets FOR ALL USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Users can view own wallet" ON public.wallets FOR SELECT USING (owner_id = auth.uid());

-- RLS Policies for wallet_ledger
CREATE POLICY "Admins can view ledger" ON public.wallet_ledger FOR SELECT USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Admins can insert ledger" ON public.wallet_ledger FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

-- RLS Policies for invoices
CREATE POLICY "Admins can manage invoices" ON public.invoices FOR ALL USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Users can view own invoices" ON public.invoices FOR SELECT USING (customer_id = auth.uid());

-- RLS Policies for invoice_items
CREATE POLICY "Admins can manage invoice items" ON public.invoice_items FOR ALL USING (is_admin_or_super(auth.uid()));

-- RLS Policies for finance_plans
CREATE POLICY "Admins can manage plans" ON public.finance_plans FOR ALL USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Anyone can view active plans" ON public.finance_plans FOR SELECT USING (is_active = true AND is_deleted = false);

-- RLS Policies for finance_subscriptions
CREATE POLICY "Admins can manage subscriptions" ON public.finance_subscriptions FOR ALL USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Users can view own subscriptions" ON public.finance_subscriptions FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for finance_payouts
CREATE POLICY "Admins can manage payouts" ON public.finance_payouts FOR ALL USING (is_admin_or_super(auth.uid()));
CREATE POLICY "Users can view own payouts" ON public.finance_payouts FOR SELECT USING (beneficiary_id = auth.uid());

-- RLS Policies for cost_logs
CREATE POLICY "Admins can manage cost logs" ON public.cost_logs FOR ALL USING (is_admin_or_super(auth.uid()));

-- RLS Policies for cost_limits
CREATE POLICY "Admins can manage cost limits" ON public.cost_limits FOR ALL USING (is_admin_or_super(auth.uid()));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wallets_owner ON public.wallets(owner_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_finance_subscriptions_user ON public.finance_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_finance_payouts_status ON public.finance_payouts(status);
CREATE INDEX IF NOT EXISTS idx_cost_logs_category ON public.cost_logs(category);
CREATE INDEX IF NOT EXISTS idx_cost_logs_date ON public.cost_logs(usage_date);

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_wallets_updated_at ON public.wallets;
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices;
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_finance_plans_updated_at ON public.finance_plans;
CREATE TRIGGER update_finance_plans_updated_at BEFORE UPDATE ON public.finance_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_finance_subscriptions_updated_at ON public.finance_subscriptions;
CREATE TRIGGER update_finance_subscriptions_updated_at BEFORE UPDATE ON public.finance_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_finance_payouts_updated_at ON public.finance_payouts;
CREATE TRIGGER update_finance_payouts_updated_at BEFORE UPDATE ON public.finance_payouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cost_limits_updated_at ON public.cost_limits;
CREATE TRIGGER update_cost_limits_updated_at BEFORE UPDATE ON public.cost_limits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
