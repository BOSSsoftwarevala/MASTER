
-- Enable realtime for server tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.servers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.server_incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scaling_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.server_activity_logs;
