-- Login Analytics table for tracking all login events
CREATE TABLE IF NOT EXISTS public.login_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  ip_address INET NOT NULL,
  country_code TEXT,
  country_name TEXT,
  city TEXT,
  isp TEXT,
  device_fingerprint TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  login_status TEXT NOT NULL DEFAULT 'success',
  failure_reason TEXT,
  session_id UUID,
  is_suspicious BOOLEAN DEFAULT false,
  suspicion_reason TEXT,
  auto_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Country blocklist for geo-blocking
CREATE TABLE IF NOT EXISTS public.country_blocklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  block_type TEXT DEFAULT 'permanent',
  expires_at TIMESTAMPTZ,
  reason TEXT NOT NULL,
  blocked_by UUID NOT NULL,
  blocked_at TIMESTAMPTZ DEFAULT now(),
  unblocked_at TIMESTAMPTZ,
  unblocked_by UUID,
  is_active BOOLEAN DEFAULT true
);

-- Download tracking for exfiltration control
CREATE TABLE IF NOT EXISTS public.download_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  file_name TEXT NOT NULL,
  file_path TEXT,
  file_size_bytes BIGINT,
  file_type TEXT,
  download_source TEXT,
  ip_address INET,
  is_bulk_download BOOLEAN DEFAULT false,
  is_blocked BOOLEAN DEFAULT false,
  block_reason TEXT,
  risk_level TEXT DEFAULT 'low',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Port monitoring table
CREATE TABLE IF NOT EXISTS public.port_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES public.servers(id) ON DELETE CASCADE,
  port_number INTEGER NOT NULL,
  protocol TEXT DEFAULT 'tcp',
  service_name TEXT,
  is_open BOOLEAN DEFAULT true,
  is_allowed BOOLEAN DEFAULT true,
  traffic_bytes_in BIGINT DEFAULT 0,
  traffic_bytes_out BIGINT DEFAULT 0,
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  blocked_at TIMESTAMPTZ,
  blocked_by UUID,
  block_reason TEXT,
  is_anomalous BOOLEAN DEFAULT false,
  anomaly_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(server_id, port_number, protocol)
);

-- Security alerts table (enhanced)
CREATE TABLE IF NOT EXISTS public.security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  source_ip INET,
  target_user_id UUID,
  target_resource TEXT,
  ai_suggestion TEXT,
  ai_confidence NUMERIC(3,2),
  status TEXT DEFAULT 'active',
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by UUID,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  resolution_notes TEXT,
  auto_action_taken TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.login_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_blocklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.port_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for Super Admin only
CREATE POLICY "Super admins can view login_analytics" ON public.login_analytics
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage country_blocklist" ON public.country_blocklist
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can view download_tracking" ON public.download_tracking
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage port_monitoring" ON public.port_monitoring
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage security_alerts" ON public.security_alerts
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_login_analytics_created_at ON public.login_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_analytics_user_id ON public.login_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_login_analytics_country ON public.login_analytics(country_code);
CREATE INDEX IF NOT EXISTS idx_login_analytics_ip ON public.login_analytics(ip_address);
CREATE INDEX IF NOT EXISTS idx_download_tracking_user ON public.download_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_download_tracking_created ON public.download_tracking(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_alerts_status ON public.security_alerts(status);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON public.security_alerts(severity);

-- Enable realtime for security_alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.security_alerts;