import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AppRole =
  | 'user_basic'
  | 'user_pro'
  | 'reseller_basic'
  | 'reseller_pro'
  | 'franchise_city'
  | 'franchise_state'
  | 'franchise_country'
  | 'influencer'
  | 'lead_manager'
  | 'project_manager'
  | 'code_manager'
  | 'seo_manager'
  | 'admin'
  | 'super_admin'
  | 'vala_ai';

interface UserRoleRow {
  role: AppRole;
}

// In-memory cache to prevent "flash redirect" when navigating between pages.
const rolesCache = new Map<string, AppRole[]>();

export function useUserRoles() {
  const { user } = useAuth();
  const userId = user?.id;

  const cachedRoles = userId ? rolesCache.get(userId) : undefined;
  const [roles, setRoles] = useState<AppRole[]>(cachedRoles ?? []);
  const [loading, setLoading] = useState<boolean>(() => Boolean(userId && !cachedRoles));

  useEffect(() => {
    if (!userId) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const cachedNow = rolesCache.get(userId);
    if (cachedNow) {
      setRoles(cachedNow);
      setLoading(false);
    } else {
      setRoles([]);
      setLoading(true);
    }

    let cancelled = false;

    const fetchRoles = async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (cancelled) return;

      if (error) {
        console.error('Error fetching roles:', error);
        rolesCache.delete(userId);
        setRoles([]);
        setLoading(false);
        return;
      }

      const nextRoles = (data as UserRoleRow[] | null)?.map((r) => r.role) ?? [];
      rolesCache.set(userId, nextRoles);
      setRoles(nextRoles);
      setLoading(false);
    };

    fetchRoles();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const hasRole = (role: AppRole) => roles.includes(role);

  const isAdmin = () => hasRole('admin') || hasRole('super_admin');

  const isSuperAdmin = () => hasRole('super_admin');

  const isManager = () =>
    hasRole('lead_manager') ||
    hasRole('project_manager') ||
    hasRole('code_manager') ||
    hasRole('seo_manager') ||
    isAdmin();

  const isReseller = () => hasRole('reseller_basic') || hasRole('reseller_pro');

  const isFranchise = () =>
    hasRole('franchise_city') || hasRole('franchise_state') || hasRole('franchise_country');

  return {
    roles,
    loading,
    hasRole,
    isAdmin,
    isSuperAdmin,
    isManager,
    isReseller,
    isFranchise,
  };
}
