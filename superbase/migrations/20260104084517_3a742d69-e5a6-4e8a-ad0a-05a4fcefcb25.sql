-- Server Security Rules table
CREATE TABLE public.server_security_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES public.servers(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL DEFAULT 'firewall',
  source_ip TEXT,
  destination_port INTEGER,
  protocol TEXT DEFAULT 'tcp',
  action TEXT NOT NULL DEFAULT 'allow',
  priority INTEGER DEFAULT 100,
  is_enabled BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  is_deleted BOOLEAN DEFAULT false
);

-- Server Backups table
CREATE TABLE public.server_backups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES public.servers(id) ON DELETE CASCADE,
  backup_type TEXT NOT NULL DEFAULT 'full',
  status TEXT NOT NULL DEFAULT 'pending',
  size_mb NUMERIC,
  storage_location TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  retention_days INTEGER DEFAULT 30,
  is_automated BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  is_deleted BOOLEAN DEFAULT false
);

-- Server Maintenance schedules table
CREATE TABLE public.server_maintenance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES public.servers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  maintenance_type TEXT NOT NULL DEFAULT 'scheduled',
  status TEXT NOT NULL DEFAULT 'scheduled',
  scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_end TIMESTAMP WITH TIME ZONE,
  actual_start TIMESTAMP WITH TIME ZONE,
  actual_end TIMESTAMP WITH TIME ZONE,
  affected_services TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  is_deleted BOOLEAN DEFAULT false
);

-- Access attempts / blocked IPs table
CREATE TABLE public.server_access_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES public.servers(id) ON DELETE SET NULL,
  source_ip TEXT NOT NULL,
  attempt_type TEXT NOT NULL,
  target_port INTEGER,
  blocked BOOLEAN DEFAULT true,
  block_reason TEXT,
  geo_location TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- IP Blocklist table
CREATE TABLE public.server_ip_blocklist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  ip_range TEXT,
  reason TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  blocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_permanent BOOLEAN DEFAULT false,
  blocked_by UUID,
  blocked_by_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.server_security_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_access_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_ip_blocklist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for server_security_rules
CREATE POLICY "Admins can view security rules" ON public.server_security_rules
  FOR SELECT USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can create security rules" ON public.server_security_rules
  FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can update security rules" ON public.server_security_rules
  FOR UPDATE USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Super Admin can delete security rules" ON public.server_security_rules
  FOR DELETE USING (is_super_admin(auth.uid()));

-- RLS Policies for server_backups
CREATE POLICY "Admins can view backups" ON public.server_backups
  FOR SELECT USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can create backups" ON public.server_backups
  FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can update backups" ON public.server_backups
  FOR UPDATE USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Super Admin can delete backups" ON public.server_backups
  FOR DELETE USING (is_super_admin(auth.uid()));

-- RLS Policies for server_maintenance
CREATE POLICY "Admins can view maintenance" ON public.server_maintenance
  FOR SELECT USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can create maintenance" ON public.server_maintenance
  FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can update maintenance" ON public.server_maintenance
  FOR UPDATE USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Super Admin can delete maintenance" ON public.server_maintenance
  FOR DELETE USING (is_super_admin(auth.uid()));

-- RLS Policies for server_access_attempts (read-only for admins)
CREATE POLICY "Admins can view access attempts" ON public.server_access_attempts
  FOR SELECT USING (is_admin_or_super(auth.uid()));

CREATE POLICY "System can insert access attempts" ON public.server_access_attempts
  FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

-- RLS Policies for server_ip_blocklist
CREATE POLICY "Admins can view IP blocklist" ON public.server_ip_blocklist
  FOR SELECT USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can create IP blocks" ON public.server_ip_blocklist
  FOR INSERT WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can update IP blocks" ON public.server_ip_blocklist
  FOR UPDATE USING (is_admin_or_super(auth.uid()));

CREATE POLICY "Super Admin can delete IP blocks" ON public.server_ip_blocklist
  FOR DELETE USING (is_super_admin(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_server_security_rules_updated_at
  BEFORE UPDATE ON public.server_security_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_server_maintenance_updated_at
  BEFORE UPDATE ON public.server_maintenance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_server_security_rules_server ON public.server_security_rules(server_id);
CREATE INDEX idx_server_backups_server ON public.server_backups(server_id);
CREATE INDEX idx_server_maintenance_server ON public.server_maintenance(server_id);
CREATE INDEX idx_server_access_attempts_server ON public.server_access_attempts(server_id);
CREATE INDEX idx_server_access_attempts_ip ON public.server_access_attempts(source_ip);
CREATE INDEX idx_server_ip_blocklist_ip ON public.server_ip_blocklist(ip_address);