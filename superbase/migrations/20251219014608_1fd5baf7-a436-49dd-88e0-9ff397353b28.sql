-- =============================================
-- SOFTWARE VALA PLATFORM - COMPLETE DATABASE SCHEMA
-- =============================================

-- =============================================
-- PART 1: ENUM TYPES
-- =============================================

-- User Role Enum (all 13 roles)
CREATE TYPE public.app_role AS ENUM (
  'user_basic',
  'user_pro', 
  'reseller_basic',
  'reseller_pro',
  'franchise_city',
  'franchise_state',
  'franchise_country',
  'influencer',
  'lead_manager',
  'project_manager',
  'code_manager',
  'seo_manager',
  'admin',
  'super_admin'
);

-- KYC Status Enum
CREATE TYPE public.kyc_status AS ENUM ('pending', 'verified', 'rejected');

-- Account Status Enum
CREATE TYPE public.account_status AS ENUM ('active', 'suspended', 'pending_verification');

-- Lead Status Enum
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'qualified', 'demo_scheduled', 'demo_done', 'proposal_sent', 'negotiation', 'won', 'lost', 'on_hold');

-- Lead Temperature Enum
CREATE TYPE public.lead_temperature AS ENUM ('cold', 'warm', 'hot');

-- Lead Source Enum
CREATE TYPE public.lead_source AS ENUM ('website', 'referral', 'google_ads', 'facebook_ads', 'linkedin', 'cold_call', 'email_campaign', 'trade_show', 'partner', 'other');

-- Pricing Model Enum
CREATE TYPE public.pricing_model AS ENUM ('one_time', 'subscription', 'usage_based', 'freemium', 'tiered');

-- License Type Enum
CREATE TYPE public.license_type AS ENUM ('perpetual', 'subscription', 'trial', 'freemium', 'enterprise');

-- Billing Cycle Enum
CREATE TYPE public.billing_cycle AS ENUM ('monthly', 'quarterly', 'semi_annual', 'annual', 'one_time', 'custom');

-- License Status Enum
CREATE TYPE public.license_status AS ENUM ('active', 'expired', 'suspended', 'revoked');

-- Order Status Enum
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded');

-- Payment Status Enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'partial');

-- =============================================
-- PART 2: CORE USER TABLES
-- =============================================

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  email_masked TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN LENGTH(SPLIT_PART(email, '@', 1)) > 2 
      THEN LEFT(SPLIT_PART(email, '@', 1), 1) || '***' || '@' || SPLIT_PART(email, '@', 2)
      ELSE '***@' || SPLIT_PART(email, '@', 2)
    END
  ) STORED,
  mobile TEXT,
  mobile_masked TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN mobile IS NOT NULL AND LENGTH(mobile) > 4 
      THEN LEFT(mobile, 3) || '****' || RIGHT(mobile, 4)
      ELSE NULL
    END
  ) STORED,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  designation TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  pincode TEXT,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.profiles(id),
  account_status public.account_status DEFAULT 'active',
  kyc_status public.kyc_status DEFAULT 'pending',
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- User KYC Documents
CREATE TABLE public.user_kyc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL, -- 'aadhaar', 'pan', 'gst', 'passport', etc.
  document_number TEXT, -- Encrypted/masked
  document_url TEXT, -- Storage path
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Notes (internal admin notes)
CREATE TABLE public.user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  note TEXT NOT NULL,
  note_type TEXT DEFAULT 'general', -- 'general', 'warning', 'follow_up', 'important'
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 3: PRODUCT CATALOG TABLES
-- =============================================

-- Categories (hierarchical)
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES public.categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendors/Publishers
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products (main software catalog)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  vendor_id UUID REFERENCES public.vendors(id),
  category_id UUID REFERENCES public.categories(id),
  logo_url TEXT,
  banner_url TEXT,
  pricing_model public.pricing_model DEFAULT 'subscription',
  license_type public.license_type DEFAULT 'subscription',
  base_price DECIMAL(12,2),
  currency TEXT DEFAULT 'INR',
  commission_rate DECIMAL(5,2) DEFAULT 10.00, -- Default 10% commission
  reseller_commission DECIMAL(5,2) DEFAULT 15.00,
  influencer_commission DECIMAL(5,2) DEFAULT 5.00,
  franchise_commission DECIMAL(5,2) DEFAULT 20.00,
  website_url TEXT,
  demo_url TEXT,
  documentation_url TEXT,
  min_users INTEGER DEFAULT 1,
  max_users INTEGER,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Secondary Categories
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (product_id, category_id)
);

-- Product Features
CREATE TABLE public.product_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  feature_name TEXT NOT NULL,
  feature_description TEXT,
  is_highlighted BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Media (screenshots, videos)
CREATE TABLE public.product_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  media_type TEXT NOT NULL, -- 'image', 'video', 'document'
  media_url TEXT NOT NULL,
  title TEXT,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing Tiers
CREATE TABLE public.pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- 'Basic', 'Pro', 'Enterprise'
  slug TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  billing_cycle public.billing_cycle DEFAULT 'monthly',
  user_limit INTEGER,
  storage_limit TEXT, -- '10GB', '100GB', 'Unlimited'
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (product_id, slug)
);

-- Tier Features
CREATE TABLE public.tier_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id UUID REFERENCES public.pricing_tiers(id) ON DELETE CASCADE NOT NULL,
  feature_name TEXT NOT NULL,
  feature_value TEXT, -- 'true', 'false', '100', 'Unlimited'
  is_included BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

-- =============================================
-- PART 4: LEAD MANAGEMENT TABLES
-- =============================================

-- Leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  email_masked TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN LENGTH(SPLIT_PART(email, '@', 1)) > 2 
      THEN LEFT(SPLIT_PART(email, '@', 1), 1) || '***' || '@' || SPLIT_PART(email, '@', 2)
      ELSE '***@' || SPLIT_PART(email, '@', 2)
    END
  ) STORED,
  mobile TEXT,
  mobile_masked TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN mobile IS NOT NULL AND LENGTH(mobile) > 4 
      THEN LEFT(mobile, 3) || '****' || RIGHT(mobile, 4)
      ELSE NULL
    END
  ) STORED,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  designation TEXT,
  company_size TEXT,
  industry TEXT,
  website TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  source public.lead_source DEFAULT 'website',
  source_detail TEXT, -- Campaign name, referrer URL, etc.
  status public.lead_status DEFAULT 'new',
  temperature public.lead_temperature DEFAULT 'cold',
  ai_close_probability DECIMAL(5,2), -- AI predicted close probability
  interested_products UUID[], -- Array of product IDs
  budget_range TEXT,
  expected_close_date DATE,
  assigned_to UUID REFERENCES auth.users(id),
  referred_by UUID REFERENCES auth.users(id), -- Reseller/Influencer who referred
  referral_code TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  first_contact_at TIMESTAMPTZ,
  last_contact_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  converted_to UUID, -- User ID if converted
  is_deleted BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead Notes
CREATE TABLE public.lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  note TEXT NOT NULL,
  note_type TEXT DEFAULT 'general', -- 'call', 'email', 'meeting', 'general'
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead Activity Log
CREATE TABLE public.lead_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL, -- 'status_change', 'assignment', 'note_added', 'email_sent', 'call_made'
  old_value TEXT,
  new_value TEXT,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 5: SALES & ORDERS TABLES
-- =============================================

-- Sales (Orders)
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES auth.users(id),
  lead_id UUID REFERENCES public.leads(id),
  order_status public.order_status DEFAULT 'pending',
  payment_status public.payment_status DEFAULT 'pending',
  subtotal DECIMAL(12,2) NOT NULL,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT,
  payment_reference TEXT,
  billing_address JSONB,
  notes TEXT,
  referred_by UUID REFERENCES auth.users(id), -- Reseller/Influencer
  referral_code TEXT,
  commission_calculated BOOLEAN DEFAULT FALSE,
  commission_paid BOOLEAN DEFAULT FALSE,
  invoice_url TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sale Items (Order Line Items)
CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  pricing_tier_id UUID REFERENCES public.pricing_tiers(id),
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  tax_percent DECIMAL(5,2) DEFAULT 18.00, -- GST
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  license_duration_months INTEGER,
  license_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 6: LICENSE MANAGEMENT TABLES
-- =============================================

-- Licenses
CREATE TABLE public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key TEXT UNIQUE NOT NULL,
  sale_item_id UUID REFERENCES public.sale_items(id),
  product_id UUID REFERENCES public.products(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  license_type public.license_type NOT NULL,
  status public.license_status DEFAULT 'active',
  max_activations INTEGER DEFAULT 1,
  current_activations INTEGER DEFAULT 0,
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  last_validated_at TIMESTAMPTZ,
  metadata JSONB,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- License Activations
CREATE TABLE public.license_activations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID REFERENCES public.licenses(id) ON DELETE CASCADE NOT NULL,
  device_fingerprint TEXT NOT NULL, -- Semi-sensitive
  device_name TEXT,
  ip_address INET, -- Semi-sensitive
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  deactivated_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- =============================================
-- PART 7: REFERRAL & COMMISSION TABLES
-- =============================================

-- Referrals
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) NOT NULL, -- Reseller/Influencer
  referrer_type public.app_role NOT NULL, -- reseller_basic, influencer, etc.
  referral_code TEXT UNIQUE NOT NULL,
  total_clicks INTEGER DEFAULT 0,
  total_signups INTEGER DEFAULT 0,
  total_leads INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  total_commission DECIMAL(12,2) DEFAULT 0,
  commission_paid DECIMAL(12,2) DEFAULT 0,
  commission_pending DECIMAL(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral Events
CREATE TABLE public.referral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID REFERENCES public.referrals(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL, -- 'click', 'signup', 'lead', 'sale'
  event_data JSONB,
  user_id UUID REFERENCES auth.users(id),
  lead_id UUID REFERENCES public.leads(id),
  sale_id UUID REFERENCES public.sales(id),
  commission_amount DECIMAL(12,2),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commission Payouts
CREATE TABLE public.commission_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  referral_id UUID REFERENCES public.referrals(id),
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payout_method TEXT, -- 'bank_transfer', 'upi', 'paypal'
  payout_reference TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 8: SECURITY DEFINER FUNCTIONS
-- =============================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'super_admin'
  )
$$;

-- Function to check if user is admin or super admin
CREATE OR REPLACE FUNCTION public.is_admin_or_super(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'super_admin')
  )
$$;

-- Function to check if user is any type of manager
CREATE OR REPLACE FUNCTION public.is_manager(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('lead_manager', 'project_manager', 'code_manager', 'seo_manager', 'admin', 'super_admin')
  )
$$;

-- =============================================
-- PART 9: UPDATED_AT TRIGGER FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pricing_tiers_updated_at BEFORE UPDATE ON public.pricing_tiers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON public.sales FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_licenses_updated_at BEFORE UPDATE ON public.licenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON public.referrals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_kyc_updated_at BEFORE UPDATE ON public.user_kyc FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_notes_updated_at BEFORE UPDATE ON public.user_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_commission_payouts_updated_at BEFORE UPDATE ON public.commission_payouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- PART 10: AUTO-CREATE PROFILE ON SIGNUP
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ref_code TEXT;
BEGIN
  -- Generate unique referral code
  ref_code := UPPER(SUBSTRING(MD5(NEW.id::TEXT || NOW()::TEXT) FROM 1 FOR 8));
  
  INSERT INTO public.profiles (id, email, first_name, last_name, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    ref_code
  );
  
  -- Assign default 'user_basic' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user_basic');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- PART 11: ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tier_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_payouts ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES POLICIES
-- =============================================

-- Users can view their own profile (masked data)
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Admins can view all profiles (with masked data for non-super-admin)
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Super Admin can update any profile
CREATE POLICY "Super Admin can update any profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.is_super_admin(auth.uid()));

-- Only Super Admin can delete (soft delete)
CREATE POLICY "Super Admin can delete profiles"
ON public.profiles FOR DELETE
TO authenticated
USING (public.is_super_admin(auth.uid()));

-- =============================================
-- USER ROLES POLICIES
-- =============================================

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

-- Only Super Admin can assign/modify roles
CREATE POLICY "Super Admin can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Super Admin can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super Admin can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.is_super_admin(auth.uid()));

-- =============================================
-- USER KYC POLICIES
-- =============================================

-- Users can view their own KYC
CREATE POLICY "Users can view own KYC"
ON public.user_kyc FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can view all KYC
CREATE POLICY "Admins can view all KYC"
ON public.user_kyc FOR SELECT
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

-- Users can submit their own KYC
CREATE POLICY "Users can insert own KYC"
ON public.user_kyc FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Admins can update KYC (verify/reject)
CREATE POLICY "Admins can update KYC"
ON public.user_kyc FOR UPDATE
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

-- =============================================
-- USER NOTES POLICIES (Admin only)
-- =============================================

CREATE POLICY "Admins can view user notes"
ON public.user_notes FOR SELECT
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can insert user notes"
ON public.user_notes FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can update user notes"
ON public.user_notes FOR UPDATE
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can delete user notes"
ON public.user_notes FOR DELETE
TO authenticated
USING (public.is_super_admin(auth.uid()));

-- =============================================
-- CATEGORIES POLICIES (Public read, Admin write)
-- =============================================

CREATE POLICY "Anyone can view active categories"
ON public.categories FOR SELECT
USING (is_active = TRUE AND is_deleted = FALSE);

CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

-- =============================================
-- VENDORS POLICIES
-- =============================================

CREATE POLICY "Anyone can view active vendors"
ON public.vendors FOR SELECT
USING (is_active = TRUE AND is_deleted = FALSE);

CREATE POLICY "Admins can manage vendors"
ON public.vendors FOR ALL
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

-- =============================================
-- PRODUCTS POLICIES (Public read, Admin write)
-- =============================================

CREATE POLICY "Anyone can view active products"
ON public.products FOR SELECT
USING (is_active = TRUE AND is_deleted = FALSE);

CREATE POLICY "Admins can manage products"
ON public.products FOR ALL
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

-- =============================================
-- PRODUCT RELATED TABLES POLICIES
-- =============================================

CREATE POLICY "Anyone can view product categories"
ON public.product_categories FOR SELECT
USING (TRUE);

CREATE POLICY "Admins can manage product categories"
ON public.product_categories FOR ALL
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Anyone can view product features"
ON public.product_features FOR SELECT
USING (TRUE);

CREATE POLICY "Admins can manage product features"
ON public.product_features FOR ALL
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Anyone can view product media"
ON public.product_media FOR SELECT
USING (TRUE);

CREATE POLICY "Admins can manage product media"
ON public.product_media FOR ALL
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Anyone can view pricing tiers"
ON public.pricing_tiers FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "Admins can manage pricing tiers"
ON public.pricing_tiers FOR ALL
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Anyone can view tier features"
ON public.tier_features FOR SELECT
USING (TRUE);

CREATE POLICY "Admins can manage tier features"
ON public.tier_features FOR ALL
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

-- =============================================
-- LEADS POLICIES
-- =============================================

-- Managers and assigned users can view leads
CREATE POLICY "Managers can view all leads"
ON public.leads FOR SELECT
TO authenticated
USING (public.is_manager(auth.uid()) OR assigned_to = auth.uid() OR referred_by = auth.uid());

-- Managers can create leads
CREATE POLICY "Managers can create leads"
ON public.leads FOR INSERT
TO authenticated
WITH CHECK (public.is_manager(auth.uid()));

-- Assigned user or managers can update leads
CREATE POLICY "Managers can update leads"
ON public.leads FOR UPDATE
TO authenticated
USING (public.is_manager(auth.uid()) OR assigned_to = auth.uid());

-- Only Super Admin can delete leads
CREATE POLICY "Super Admin can delete leads"
ON public.leads FOR DELETE
TO authenticated
USING (public.is_super_admin(auth.uid()));

-- =============================================
-- LEAD NOTES & ACTIVITY POLICIES
-- =============================================

CREATE POLICY "Managers can view lead notes"
ON public.lead_notes FOR SELECT
TO authenticated
USING (public.is_manager(auth.uid()));

CREATE POLICY "Managers can create lead notes"
ON public.lead_notes FOR INSERT
TO authenticated
WITH CHECK (public.is_manager(auth.uid()));

CREATE POLICY "Managers can view lead activity"
ON public.lead_activity_log FOR SELECT
TO authenticated
USING (public.is_manager(auth.uid()));

CREATE POLICY "System can insert lead activity"
ON public.lead_activity_log FOR INSERT
TO authenticated
WITH CHECK (public.is_manager(auth.uid()));

-- =============================================
-- SALES POLICIES
-- =============================================

-- Users can view their own sales
CREATE POLICY "Users can view own sales"
ON public.sales FOR SELECT
TO authenticated
USING (customer_id = auth.uid() OR referred_by = auth.uid());

-- Managers can view all sales
CREATE POLICY "Managers can view all sales"
ON public.sales FOR SELECT
TO authenticated
USING (public.is_manager(auth.uid()));

-- Managers can create/update sales
CREATE POLICY "Managers can manage sales"
ON public.sales FOR ALL
TO authenticated
USING (public.is_manager(auth.uid()));

-- =============================================
-- SALE ITEMS POLICIES
-- =============================================

CREATE POLICY "Users can view own sale items"
ON public.sale_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.sales 
    WHERE sales.id = sale_items.sale_id 
    AND (sales.customer_id = auth.uid() OR sales.referred_by = auth.uid())
  )
);

CREATE POLICY "Managers can view all sale items"
ON public.sale_items FOR SELECT
TO authenticated
USING (public.is_manager(auth.uid()));

CREATE POLICY "Managers can manage sale items"
ON public.sale_items FOR ALL
TO authenticated
USING (public.is_manager(auth.uid()));

-- =============================================
-- LICENSES POLICIES
-- =============================================

-- Users can view their own licenses
CREATE POLICY "Users can view own licenses"
ON public.licenses FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can view all licenses
CREATE POLICY "Admins can view all licenses"
ON public.licenses FOR SELECT
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

-- Admins can manage licenses
CREATE POLICY "Admins can manage licenses"
ON public.licenses FOR ALL
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

-- =============================================
-- LICENSE ACTIVATIONS POLICIES
-- =============================================

-- Users can view their own license activations
CREATE POLICY "Users can view own activations"
ON public.license_activations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.licenses 
    WHERE licenses.id = license_activations.license_id 
    AND licenses.user_id = auth.uid()
  )
);

-- Users can create their own activations
CREATE POLICY "Users can create activations"
ON public.license_activations FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.licenses 
    WHERE licenses.id = license_activations.license_id 
    AND licenses.user_id = auth.uid()
  )
);

-- Admins can manage all activations
CREATE POLICY "Admins can manage activations"
ON public.license_activations FOR ALL
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

-- =============================================
-- REFERRALS POLICIES
-- =============================================

-- Users can view their own referrals
CREATE POLICY "Users can view own referrals"
ON public.referrals FOR SELECT
TO authenticated
USING (referrer_id = auth.uid());

-- Admins can view all referrals
CREATE POLICY "Admins can view all referrals"
ON public.referrals FOR SELECT
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

-- System creates referrals
CREATE POLICY "Admins can manage referrals"
ON public.referrals FOR ALL
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

-- =============================================
-- REFERRAL EVENTS POLICIES
-- =============================================

CREATE POLICY "Users can view own referral events"
ON public.referral_events FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.referrals 
    WHERE referrals.id = referral_events.referral_id 
    AND referrals.referrer_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage referral events"
ON public.referral_events FOR ALL
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

-- Public can insert referral events (for tracking)
CREATE POLICY "Anyone can create referral events"
ON public.referral_events FOR INSERT
WITH CHECK (TRUE);

-- =============================================
-- COMMISSION PAYOUTS POLICIES
-- =============================================

CREATE POLICY "Users can view own payouts"
ON public.commission_payouts FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage payouts"
ON public.commission_payouts FOR ALL
TO authenticated
USING (public.is_admin_or_super(auth.uid()));

-- =============================================
-- PART 12: GENERATE ORDER NUMBER FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM public.sales;
  new_number := 'SV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 5, '0');
  RETURN new_number;
END;
$$;