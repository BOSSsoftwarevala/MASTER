-- Marketing Manager Module Tables

-- Campaign status enum
CREATE TYPE public.campaign_status AS ENUM ('draft', 'pending_approval', 'active', 'paused', 'completed', 'cancelled');

-- Content status enum
CREATE TYPE public.content_status AS ENUM ('draft', 'pending_review', 'approved', 'published', 'archived');

-- Campaign type enum
CREATE TYPE public.campaign_type AS ENUM ('google_ads', 'meta_ads', 'linkedin_ads', 'email', 'sms', 'whatsapp', 'organic');

-- SEO issue severity enum
CREATE TYPE public.seo_issue_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- AI suggestion status enum
CREATE TYPE public.ai_suggestion_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');

-- Marketing Campaigns table
CREATE TABLE public.marketing_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  campaign_type public.campaign_type NOT NULL DEFAULT 'google_ads',
  status public.campaign_status NOT NULL DEFAULT 'draft',
  budget DECIMAL(12,2) NOT NULL DEFAULT 0,
  spent DECIMAL(12,2) NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  geo_targeting JSONB DEFAULT '{}',
  target_audience JSONB DEFAULT '{}',
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  cost_per_lead DECIMAL(10,2),
  created_by UUID REFERENCES auth.users(id),
  paused_at TIMESTAMPTZ,
  paused_by UUID REFERENCES auth.users(id),
  paused_reason TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Campaign budget history table
CREATE TABLE public.campaign_budget_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  old_budget DECIMAL(12,2) NOT NULL,
  new_budget DECIMAL(12,2) NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SEO Keywords table
CREATE TABLE public.seo_keywords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  search_volume INTEGER,
  difficulty INTEGER CHECK (difficulty >= 0 AND difficulty <= 100),
  current_rank INTEGER,
  target_rank INTEGER,
  page_url TEXT,
  status TEXT DEFAULT 'tracking',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SEO Pages table
CREATE TABLE public.seo_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  meta_description TEXT,
  h1_tag TEXT,
  page_score INTEGER CHECK (page_score >= 0 AND page_score <= 100),
  mobile_score INTEGER CHECK (mobile_score >= 0 AND mobile_score <= 100),
  speed_score INTEGER CHECK (speed_score >= 0 AND speed_score <= 100),
  last_crawled_at TIMESTAMPTZ,
  indexed BOOLEAN DEFAULT FALSE,
  canonical_url TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SEO Issues table
CREATE TABLE public.seo_issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES public.seo_pages(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL,
  severity public.seo_issue_severity NOT NULL DEFAULT 'medium',
  description TEXT NOT NULL,
  recommendation TEXT,
  status TEXT DEFAULT 'open',
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Content items table
CREATE TABLE public.content_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'blog',
  body TEXT,
  status public.content_status NOT NULL DEFAULT 'draft',
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  tags TEXT[],
  seo_title TEXT,
  seo_description TEXT,
  featured_image TEXT,
  views INTEGER DEFAULT 0,
  engagement_score DECIMAL(5,2),
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Content schedule table
CREATE TABLE public.content_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  platform TEXT NOT NULL DEFAULT 'website',
  status TEXT DEFAULT 'scheduled',
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lead sources table
CREATE TABLE public.lead_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 5,
  daily_cap INTEGER,
  monthly_cap INTEGER,
  leads_today INTEGER DEFAULT 0,
  leads_this_month INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2),
  cost_per_lead DECIMAL(10,2),
  duplicate_filter_enabled BOOLEAN DEFAULT TRUE,
  geo_restrictions JSONB DEFAULT '[]',
  routing_rules JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI Marketing Suggestions table
CREATE TABLE public.ai_marketing_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  suggestion_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  impact_level TEXT DEFAULT 'medium',
  estimated_cost DECIMAL(12,2),
  estimated_benefit DECIMAL(12,2),
  confidence_score DECIMAL(5,2),
  status public.ai_suggestion_status NOT NULL DEFAULT 'pending',
  accepted_at TIMESTAMPTZ,
  accepted_by UUID REFERENCES auth.users(id),
  rejected_at TIMESTAMPTZ,
  rejected_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  auto_apply_blocked BOOLEAN DEFAULT TRUE,
  target_entity_type TEXT,
  target_entity_id UUID,
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Marketing Audit Logs table
CREATE TABLE public.marketing_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  performed_by UUID REFERENCES auth.users(id),
  performed_by_name TEXT,
  details TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_budget_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_marketing_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for managers and admins
CREATE POLICY "Managers can view marketing campaigns" ON public.marketing_campaigns FOR SELECT USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can insert marketing campaigns" ON public.marketing_campaigns FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Managers can update marketing campaigns" ON public.marketing_campaigns FOR UPDATE USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can delete marketing campaigns" ON public.marketing_campaigns FOR DELETE USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Managers can view budget history" ON public.campaign_budget_history FOR SELECT USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can insert budget history" ON public.campaign_budget_history FOR INSERT WITH CHECK (public.is_manager(auth.uid()));

CREATE POLICY "Managers can view seo keywords" ON public.seo_keywords FOR SELECT USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can insert seo keywords" ON public.seo_keywords FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Managers can update seo keywords" ON public.seo_keywords FOR UPDATE USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can delete seo keywords" ON public.seo_keywords FOR DELETE USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Managers can view seo pages" ON public.seo_pages FOR SELECT USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can insert seo pages" ON public.seo_pages FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Managers can update seo pages" ON public.seo_pages FOR UPDATE USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can delete seo pages" ON public.seo_pages FOR DELETE USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Managers can view seo issues" ON public.seo_issues FOR SELECT USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can insert seo issues" ON public.seo_issues FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Managers can update seo issues" ON public.seo_issues FOR UPDATE USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can delete seo issues" ON public.seo_issues FOR DELETE USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Managers can view content items" ON public.content_items FOR SELECT USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can insert content items" ON public.content_items FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Managers can update content items" ON public.content_items FOR UPDATE USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can delete content items" ON public.content_items FOR DELETE USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Managers can view content schedule" ON public.content_schedule FOR SELECT USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can insert content schedule" ON public.content_schedule FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Managers can update content schedule" ON public.content_schedule FOR UPDATE USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can delete content schedule" ON public.content_schedule FOR DELETE USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Managers can view lead sources" ON public.lead_sources FOR SELECT USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can insert lead sources" ON public.lead_sources FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Managers can update lead sources" ON public.lead_sources FOR UPDATE USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can delete lead sources" ON public.lead_sources FOR DELETE USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Managers can view ai suggestions" ON public.ai_marketing_suggestions FOR SELECT USING (public.is_manager(auth.uid()));
CREATE POLICY "Managers can insert ai suggestions" ON public.ai_marketing_suggestions FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Managers can update ai suggestions" ON public.ai_marketing_suggestions FOR UPDATE USING (public.is_manager(auth.uid()));

CREATE POLICY "Managers can view marketing audit logs" ON public.marketing_audit_logs FOR SELECT USING (public.is_manager(auth.uid()));
CREATE POLICY "System can insert marketing audit logs" ON public.marketing_audit_logs FOR INSERT WITH CHECK (true);

-- Updated_at triggers
CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON public.marketing_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seo_keywords_updated_at BEFORE UPDATE ON public.seo_keywords FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seo_pages_updated_at BEFORE UPDATE ON public.seo_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_seo_issues_updated_at BEFORE UPDATE ON public.seo_issues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_content_schedule_updated_at BEFORE UPDATE ON public.content_schedule FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lead_sources_updated_at BEFORE UPDATE ON public.lead_sources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_marketing_suggestions_updated_at BEFORE UPDATE ON public.ai_marketing_suggestions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Performance indexes
CREATE INDEX idx_marketing_campaigns_status ON public.marketing_campaigns(status);
CREATE INDEX idx_marketing_campaigns_type ON public.marketing_campaigns(campaign_type);
CREATE INDEX idx_seo_keywords_keyword ON public.seo_keywords(keyword);
CREATE INDEX idx_seo_pages_url ON public.seo_pages(url);
CREATE INDEX idx_seo_issues_severity ON public.seo_issues(severity);
CREATE INDEX idx_content_items_status ON public.content_items(status);
CREATE INDEX idx_lead_sources_type ON public.lead_sources(source_type);
CREATE INDEX idx_ai_suggestions_status ON public.ai_marketing_suggestions(status);
CREATE INDEX idx_marketing_audit_entity ON public.marketing_audit_logs(entity_type, entity_id);