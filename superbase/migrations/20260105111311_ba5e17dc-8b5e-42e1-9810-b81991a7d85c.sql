-- Influencer tables (missing)
CREATE TABLE public.influencers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'terminated')),
  tier TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  social_accounts JSONB DEFAULT '{}',
  bio TEXT,
  country TEXT,
  city TEXT,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  total_leads INTEGER NOT NULL DEFAULT 0,
  total_conversions INTEGER NOT NULL DEFAULT 0,
  total_earnings DECIMAL(12,2) NOT NULL DEFAULT 0,
  kyc_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.influencer_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
  campaign_name TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'post' CHECK (content_type IN ('post', 'story', 'video', 'reel', 'blog')),
  platform TEXT NOT NULL DEFAULT 'instagram' CHECK (platform IN ('instagram', 'youtube', 'tiktok', 'twitter', 'facebook', 'blog', 'other')),
  target_reach INTEGER,
  actual_reach INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  commission DECIMAL(12,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'submitted', 'approved', 'rejected', 'completed')),
  deadline TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  content_url TEXT,
  notes TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.influencer_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  campaign_id UUID REFERENCES public.influencer_campaigns(id) ON DELETE SET NULL,
  lead_name TEXT,
  lead_email TEXT,
  lead_phone TEXT,
  source_platform TEXT,
  tracking_code TEXT,
  converted BOOLEAN NOT NULL DEFAULT FALSE,
  converted_at TIMESTAMPTZ,
  conversion_value DECIMAL(12,2),
  commission_earned DECIMAL(12,2) DEFAULT 0,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.influencer_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  payout_method TEXT DEFAULT 'bank_transfer',
  reference TEXT,
  notes TEXT,
  processed_at TIMESTAMPTZ,
  processed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.influencer_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_clicks INTEGER DEFAULT 0,
  total_impressions INTEGER DEFAULT 0,
  total_leads INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_earnings DECIMAL(12,2) DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for influencers (Admins can manage all, influencers see own data)
CREATE POLICY "Admins can manage influencers" ON public.influencers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Influencers see own record" ON public.influencers
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for influencer_campaigns
CREATE POLICY "Admins manage influencer campaigns" ON public.influencer_campaigns
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Influencers see own campaigns" ON public.influencer_campaigns
  FOR SELECT TO authenticated
  USING (influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid()));

-- RLS Policies for influencer_leads
CREATE POLICY "Admins manage influencer leads" ON public.influencer_leads
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Influencers see own leads" ON public.influencer_leads
  FOR SELECT TO authenticated
  USING (influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid()));

-- RLS Policies for influencer_payouts
CREATE POLICY "Admins manage influencer payouts" ON public.influencer_payouts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Influencers see own payouts" ON public.influencer_payouts
  FOR SELECT TO authenticated
  USING (influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid()));

-- RLS Policies for influencer_stats
CREATE POLICY "Admins manage influencer stats" ON public.influencer_stats
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Influencers see own stats" ON public.influencer_stats
  FOR SELECT TO authenticated
  USING (influencer_id IN (SELECT id FROM public.influencers WHERE user_id = auth.uid()));

-- Insert sample data for testing
INSERT INTO public.influencers (name, email, status, tier, country, city, commission_rate, total_leads, total_conversions, total_earnings) VALUES
  ('Alex Rivera', 'alex.rivera@example.com', 'active', 'gold', 'USA', 'Los Angeles', 15.00, 250, 45, 4500.00),
  ('Priya Sharma', 'priya.sharma@example.com', 'active', 'platinum', 'India', 'Mumbai', 20.00, 580, 120, 12000.00),
  ('Marcus Chen', 'marcus.chen@example.com', 'active', 'silver', 'Canada', 'Toronto', 12.00, 120, 25, 1500.00),
  ('Sofia Rodriguez', 'sofia.r@example.com', 'pending', 'bronze', 'Mexico', 'Mexico City', 10.00, 0, 0, 0);

INSERT INTO public.influencer_campaigns (influencer_id, campaign_name, content_type, platform, target_reach, actual_reach, clicks, conversions, commission, status, deadline) 
SELECT 
  i.id,
  'Summer Product Launch',
  'video',
  'youtube',
  50000,
  48500,
  2400,
  85,
  850.00,
  'completed',
  now() + interval '30 days'
FROM public.influencers i WHERE i.email = 'alex.rivera@example.com';

INSERT INTO public.influencer_campaigns (influencer_id, campaign_name, content_type, platform, target_reach, actual_reach, clicks, conversions, commission, status, deadline)
SELECT 
  i.id,
  'Tech Tutorial Series',
  'reel',
  'instagram',
  100000,
  125000,
  8500,
  210,
  2100.00,
  'completed',
  now() + interval '15 days'
FROM public.influencers i WHERE i.email = 'priya.sharma@example.com';