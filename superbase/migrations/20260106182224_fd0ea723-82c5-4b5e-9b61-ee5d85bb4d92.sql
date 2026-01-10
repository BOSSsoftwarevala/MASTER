-- Add secure credential columns to servers table
ALTER TABLE public.servers 
ADD COLUMN IF NOT EXISTS login_user_id TEXT,
ADD COLUMN IF NOT EXISTS login_password_hash TEXT,
ADD COLUMN IF NOT EXISTS added_by_user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS added_by_email TEXT,
ADD COLUMN IF NOT EXISTS added_from_ip INET;

-- Create server audit log table for tracking actions
CREATE TABLE IF NOT EXISTS public.server_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id UUID REFERENCES public.servers(id),
  action TEXT NOT NULL,
  performed_by UUID REFERENCES auth.users(id),
  performed_by_email TEXT,
  ip_address INET,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on server_audit_logs
ALTER TABLE public.server_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only super_admin and admin can view audit logs
CREATE POLICY "Admins can view server audit logs" 
ON public.server_audit_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

-- Only system (via service role) can insert audit logs
CREATE POLICY "Service role can insert audit logs" 
ON public.server_audit_logs 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_server_audit_logs_server_id ON public.server_audit_logs(server_id);
CREATE INDEX IF NOT EXISTS idx_server_audit_logs_created_at ON public.server_audit_logs(created_at DESC);