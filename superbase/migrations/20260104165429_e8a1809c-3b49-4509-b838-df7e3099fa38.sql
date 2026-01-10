-- Create server_metrics table for real-time monitoring data
CREATE TABLE IF NOT EXISTS public.server_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES public.servers(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL DEFAULT 'cpu', -- cpu, memory, disk, network
  metric_value NUMERIC NOT NULL DEFAULT 0,
  unit VARCHAR(20) DEFAULT '%',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create server_alerts table for active alerts
CREATE TABLE IF NOT EXISTS public.server_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES public.servers(id) ON DELETE SET NULL,
  alert_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, acknowledged, snoozed, resolved
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID,
  acknowledged_by_name VARCHAR(255),
  snoozed_until TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  resolved_by_name VARCHAR(255),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_deleted BOOLEAN DEFAULT false
);

-- Create server_access_controls table for IP-based access control
CREATE TABLE IF NOT EXISTS public.server_access_controls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES public.servers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  allowed_ip VARCHAR(45), -- IPv4 or IPv6
  ip_range VARCHAR(50), -- CIDR notation
  access_type VARCHAR(50) NOT NULL DEFAULT 'ssh', -- ssh, rdp, https, custom
  port INTEGER,
  is_enabled BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_by_name VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_deleted BOOLEAN DEFAULT false
);

-- Enable RLS on new tables
ALTER TABLE public.server_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_access_controls ENABLE ROW LEVEL SECURITY;

-- RLS policies for server_metrics
CREATE POLICY "Authenticated users can view server metrics" ON public.server_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert server metrics" ON public.server_metrics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update server metrics" ON public.server_metrics FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete server metrics" ON public.server_metrics FOR DELETE TO authenticated USING (true);

-- RLS policies for server_alerts
CREATE POLICY "Authenticated users can view server alerts" ON public.server_alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert server alerts" ON public.server_alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update server alerts" ON public.server_alerts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete server alerts" ON public.server_alerts FOR DELETE TO authenticated USING (true);

-- RLS policies for server_access_controls
CREATE POLICY "Authenticated users can view server access controls" ON public.server_access_controls FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert server access controls" ON public.server_access_controls FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update server access controls" ON public.server_access_controls FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete server access controls" ON public.server_access_controls FOR DELETE TO authenticated USING (true);

-- Enable realtime for server monitoring
ALTER PUBLICATION supabase_realtime ADD TABLE public.server_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.server_alerts;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_server_metrics_server_id ON public.server_metrics(server_id);
CREATE INDEX IF NOT EXISTS idx_server_metrics_type ON public.server_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_server_alerts_server_id ON public.server_alerts(server_id);
CREATE INDEX IF NOT EXISTS idx_server_alerts_status ON public.server_alerts(status);
CREATE INDEX IF NOT EXISTS idx_server_access_controls_server_id ON public.server_access_controls(server_id);