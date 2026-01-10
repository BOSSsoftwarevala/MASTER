-- Add role-based delivery and navigation fields to notifications
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS target_roles text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS target_url text,
ADD COLUMN IF NOT EXISTS delivery_status text DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'delivered', 'read', 'failed')),
ADD COLUMN IF NOT EXISTS delivered_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS retry_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone;

-- Create index for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_notifications_target_roles ON public.notifications USING GIN (target_roles);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications (user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_delivery_status ON public.notifications (delivery_status) WHERE delivery_status = 'pending';