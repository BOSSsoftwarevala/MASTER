-- Common role tables
CREATE TABLE public.role_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_type VARCHAR(50) NOT NULL,
    role_id UUID NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.role_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_type VARCHAR(50) NOT NULL,
    role_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.role_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_type VARCHAR(50) NOT NULL,
    role_id UUID NOT NULL,
    device_info JSONB,
    ip_address INET,
    is_active BOOLEAN DEFAULT true,
    last_activity TIMESTAMPTZ DEFAULT now(),
    started_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ
);

CREATE TABLE public.role_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_type VARCHAR(50) NOT NULL,
    role_id UUID NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    currency VARCHAR(10) DEFAULT 'USD',
    timezone VARCHAR(100) DEFAULT 'UTC',
    notifications_enabled BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Franchise additional tables
CREATE TABLE public.franchise_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_id UUID REFERENCES public.franchises(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(100) NOT NULL,
    access_level VARCHAR(50) DEFAULT 'read_only',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.franchise_sla (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_id UUID REFERENCES public.franchises(id) ON DELETE CASCADE,
    promise_type VARCHAR(100) NOT NULL,
    description TEXT,
    target_value INTEGER,
    current_value INTEGER DEFAULT 0,
    unit VARCHAR(50),
    status VARCHAR(50) DEFAULT 'on_track',
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.franchise_ai_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_id UUID REFERENCES public.franchises(id) ON DELETE CASCADE,
    score_type VARCHAR(100) NOT NULL,
    score_value DECIMAL(5,2) NOT NULL,
    factors JSONB,
    recommendations TEXT[],
    calculated_at TIMESTAMPTZ DEFAULT now()
);

-- Reseller additional tables
CREATE TABLE public.reseller_followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id UUID REFERENCES public.resellers(id) ON DELETE CASCADE,
    lead_id UUID,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    call_outcome VARCHAR(100),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.reseller_penalties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id UUID REFERENCES public.resellers(id) ON DELETE CASCADE,
    penalty_type VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    amount DECIMAL(12,2),
    severity VARCHAR(50) DEFAULT 'warning',
    status VARCHAR(50) DEFAULT 'active',
    issued_by VARCHAR(255),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.reseller_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id UUID REFERENCES public.resellers(id) ON DELETE CASCADE,
    target_type VARCHAR(100) NOT NULL,
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'in_progress',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Developer additional tables
CREATE TABLE public.dev_time_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID REFERENCES public.developers(id) ON DELETE CASCADE,
    task_id UUID,
    hours_logged DECIMAL(5,2) NOT NULL,
    description TEXT,
    log_date DATE DEFAULT CURRENT_DATE,
    is_billable BOOLEAN DEFAULT true,
    approved_by VARCHAR(255),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.dev_bug_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID REFERENCES public.developers(id) ON DELETE CASCADE,
    bug_id UUID REFERENCES public.bugs(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    status VARCHAR(50) DEFAULT 'assigned',
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ
);

CREATE TABLE public.dev_release_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    release_type VARCHAR(50) DEFAULT 'minor',
    features TEXT[],
    fixes TEXT[],
    breaking_changes TEXT[],
    released_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.developers(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Influencer additional tables
CREATE TABLE public.influencer_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.influencer_campaigns(id) ON DELETE CASCADE,
    link_code VARCHAR(100) NOT NULL UNIQUE,
    target_url TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.influencer_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.influencer_campaigns(id),
    content_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_url TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    submitted_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    approved_by VARCHAR(255),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.influencer_bonus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE,
    bonus_type VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    eligible_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.role_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_sla ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_ai_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_penalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dev_time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dev_bug_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dev_release_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_bonus ENABLE ROW LEVEL SECURITY;

-- RLS policies for authenticated users
CREATE POLICY "Authenticated users can view role activity logs" ON public.role_activity_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view role notifications" ON public.role_notifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view role sessions" ON public.role_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage role preferences" ON public.role_preferences FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view franchise staff" ON public.franchise_staff FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view franchise sla" ON public.franchise_sla FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view franchise ai scores" ON public.franchise_ai_scores FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage reseller followups" ON public.reseller_followups FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can view reseller penalties" ON public.reseller_penalties FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view reseller targets" ON public.reseller_targets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage dev time logs" ON public.dev_time_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage dev bug map" ON public.dev_bug_map FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can view dev release notes" ON public.dev_release_notes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage influencer links" ON public.influencer_links FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage influencer content" ON public.influencer_content FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can view influencer bonus" ON public.influencer_bonus FOR SELECT TO authenticated USING (true);

-- Insert sample data
INSERT INTO public.role_activity_logs (role_type, role_id, action, details) VALUES
('franchise', gen_random_uuid(), 'login', 'Logged in from Chrome on Windows'),
('reseller', gen_random_uuid(), 'lead_accepted', 'Accepted lead #12345'),
('developer', gen_random_uuid(), 'task_completed', 'Completed task: Fix auth bug'),
('influencer', gen_random_uuid(), 'content_submitted', 'Submitted video for review');

INSERT INTO public.franchise_sla (franchise_id, promise_type, description, target_value, current_value, unit, status, due_date)
SELECT id, 'response_time', 'Lead response within 24 hours', 24, 18, 'hours', 'on_track', CURRENT_DATE + 30
FROM public.franchises LIMIT 1;

INSERT INTO public.dev_release_notes (version, title, content, release_type, features, fixes) VALUES
('2.1.0', 'January Feature Release', 'Major updates to dashboard and reporting', 'major', 
 ARRAY['New analytics dashboard', 'Export functionality', 'Dark mode support'],
 ARRAY['Fixed login timeout issue', 'Resolved payment calculation bug']);