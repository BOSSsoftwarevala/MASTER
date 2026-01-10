-- Fix the permissive INSERT policy for server_audit_logs
-- Drop the old policy and create a proper one
DROP POLICY IF EXISTS "Service role can insert audit logs" ON public.server_audit_logs;

-- Only allow inserts from authenticated admin users
CREATE POLICY "Admins can insert server audit logs" 
ON public.server_audit_logs 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);