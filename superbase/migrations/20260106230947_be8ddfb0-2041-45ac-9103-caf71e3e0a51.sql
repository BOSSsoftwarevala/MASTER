-- Add 'vala_ai' to the app_role enum (this needs to commit first)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'vala_ai';