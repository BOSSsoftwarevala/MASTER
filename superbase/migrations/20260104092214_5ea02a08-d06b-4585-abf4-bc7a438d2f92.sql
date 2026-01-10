-- Add setup_fee column to reseller_plans if it doesn't exist
ALTER TABLE public.reseller_plans ADD COLUMN IF NOT EXISTS setup_fee numeric NOT NULL DEFAULT 0;

-- Add geo_level column to track geographic scope
ALTER TABLE public.reseller_plans ADD COLUMN IF NOT EXISTS geo_level text DEFAULT 'city';

-- Add support_level column
ALTER TABLE public.reseller_plans ADD COLUMN IF NOT EXISTS support_level text DEFAULT 'standard';

-- Update existing plans with the correct pricing from the spec
UPDATE public.reseller_plans 
SET 
  setup_fee = 5000,
  monthly_fee = 99,
  lead_cap = 200,
  commission_rate = 10,
  geo_level = 'city',
  support_level = 'standard',
  benefits = '["Standard support", "Monthly reports", "City-level geo targeting", "200 leads per month"]'::jsonb
WHERE tier = 'silver';

UPDATE public.reseller_plans 
SET 
  setup_fee = 7000,
  monthly_fee = 149,
  lead_cap = 500,
  commission_rate = 15,
  geo_level = 'district',
  support_level = 'priority',
  benefits = '["Priority support", "Weekly reports", "District-level geo targeting", "500 leads per month", "Training access"]'::jsonb
WHERE tier = 'gold';

UPDATE public.reseller_plans 
SET 
  setup_fee = 10000,
  monthly_fee = 199,
  lead_cap = 999999,
  commission_rate = 20,
  geo_level = 'state',
  support_level = 'dedicated',
  benefits = '["24/7 dedicated support", "Real-time reports", "State-level geo targeting", "Unlimited leads", "Dedicated account manager", "Custom pricing options"]'::jsonb
WHERE tier = 'platinum';