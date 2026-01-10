-- Server status enum
CREATE TYPE public.server_status AS ENUM ('running', 'warning', 'down', 'maintenance');

-- Server type enum
CREATE TYPE public.server_type AS ENUM ('cloud', 'dedicated', 'vps');

-- Server owner type enum
CREATE TYPE public.server_owner_type AS ENUM ('own', 'client');

-- Scaling metric enum
CREATE TYPE public.scaling_metric AS ENUM ('cpu', 'memory', 'requests', 'connections');

-- Server incident status enum
CREATE TYPE public.server_incident_status AS ENUM ('active', 'monitoring', 'resolved', 'escalated');

-- Servers table
CREATE TABLE public.servers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_type server_owner_type NOT NULL DEFAULT 'own',
  server_type server_type NOT NULL DEFAULT 'cloud',
  provider TEXT NOT NULL,
  cpu_spec TEXT,
  ram_spec TEXT,
  disk_spec TEXT,
  current_cpu_load NUMERIC DEFAULT 0,
  current_ram_load NUMERIC DEFAULT 0,
  current_disk_usage NUMERIC DEFAULT 0,
  status server_status NOT NULL DEFAULT 'running',
  auto_scale_enabled BOOLEAN DEFAULT false,
  monthly_cost NUMERIC DEFAULT 0,
  ip_address TEXT,
  region TEXT,
  client_name TEXT,
  client_sla TEXT,
  is_management_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  last_health_check TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  is_deleted BOOLEAN DEFAULT false
);

-- Auto-scaling policies table
CREATE TABLE public.auto_scaling_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES public.servers(id) ON DELETE CASCADE,
  metric scaling_metric NOT NULL DEFAULT 'cpu',
  scale_up_threshold NUMERIC NOT NULL DEFAULT 80,
  scale_down_threshold NUMERIC NOT NULL DEFAULT 30,
  cooldown_seconds INTEGER NOT NULL DEFAULT 300,
  min_instances INTEGER NOT NULL DEFAULT 1,
  max_instances INTEGER NOT NULL DEFAULT 5,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  is_deleted BOOLEAN DEFAULT false
);

-- Scaling events table (for history)
CREATE TABLE public.scaling_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES public.servers(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES public.auto_scaling_policies(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  from_instances INTEGER,
  to_instances INTEGER,
  trigger_value NUMERIC,
  trigger_metric scaling_metric,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Server incidents table
CREATE TABLE public.server_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES public.servers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  incident_type TEXT NOT NULL,
  severity incident_severity NOT NULL DEFAULT 'medium',
  status server_incident_status NOT NULL DEFAULT 'active',
  root_cause TEXT,
  affected_services TEXT[] DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  recovery_time_minutes INTEGER,
  reported_by UUID,
  assigned_to UUID,
  escalated_to UUID,
  resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_deleted BOOLEAN DEFAULT false
);

-- Server activity logs table
CREATE TABLE public.server_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES public.servers(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  requested_by UUID,
  requested_by_name TEXT,
  approval_status TEXT DEFAULT 'pending',
  approved_by UUID,
  approved_by_name TEXT,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_scaling_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scaling_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for servers
CREATE POLICY "Admins can view all servers" ON public.servers
  FOR SELECT USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can create servers" ON public.servers
  FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can update servers" ON public.servers
  FOR UPDATE USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Super Admin can delete servers" ON public.servers
  FOR DELETE USING (is_super_admin(auth.uid()));

-- RLS Policies for auto_scaling_policies
CREATE POLICY "Admins can view scaling policies" ON public.auto_scaling_policies
  FOR SELECT USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can create scaling policies" ON public.auto_scaling_policies
  FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can update scaling policies" ON public.auto_scaling_policies
  FOR UPDATE USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Super Admin can delete scaling policies" ON public.auto_scaling_policies
  FOR DELETE USING (is_super_admin(auth.uid()));

-- RLS Policies for scaling_events
CREATE POLICY "Admins can view scaling events" ON public.scaling_events
  FOR SELECT USING (is_admin_or_super(auth.uid()));

CREATE POLICY "System can insert scaling events" ON public.scaling_events
  FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

-- RLS Policies for server_incidents
CREATE POLICY "Admins can view server incidents" ON public.server_incidents
  FOR SELECT USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can create server incidents" ON public.server_incidents
  FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can update server incidents" ON public.server_incidents
  FOR UPDATE USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Super Admin can delete server incidents" ON public.server_incidents
  FOR DELETE USING (is_super_admin(auth.uid()));

-- RLS Policies for server_activity_logs
CREATE POLICY "Admins can view server activity logs" ON public.server_activity_logs
  FOR SELECT USING (is_admin_or_super(auth.uid()));

CREATE POLICY "System can insert server activity logs" ON public.server_activity_logs
  FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_servers_updated_at
  BEFORE UPDATE ON public.servers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_auto_scaling_policies_updated_at
  BEFORE UPDATE ON public.auto_scaling_policies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_server_incidents_updated_at
  BEFORE UPDATE ON public.server_incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_servers_owner_type ON public.servers(owner_type);
CREATE INDEX idx_servers_status ON public.servers(status);
CREATE INDEX idx_auto_scaling_policies_server ON public.auto_scaling_policies(server_id);
CREATE INDEX idx_scaling_events_server ON public.scaling_events(server_id);
CREATE INDEX idx_server_incidents_status ON public.server_incidents(status);
CREATE INDEX idx_server_incidents_severity ON public.server_incidents(severity);
CREATE INDEX idx_server_activity_logs_server ON public.server_activity_logs(server_id);