-- Add hr_manager to app_role enum first
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'hr_manager';