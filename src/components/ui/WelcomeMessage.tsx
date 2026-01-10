import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles, AppRole } from '@/hooks/useUserRoles';
import { supabase } from '@/integrations/supabase/client';
import { Crown, Code, Headphones, TrendingUp, MapPin, Shield, User, Briefcase, Target, Megaphone, Users } from 'lucide-react';

interface Profile {
  first_name: string | null;
  last_name: string | null;
}

const roleConfig: Record<string, { label: string; icon: typeof Crown; greeting: string }> = {
  super_admin: { label: 'Boss', icon: Crown, greeting: 'Welcome Boss' },
  admin: { label: 'Admin', icon: Shield, greeting: 'Welcome Admin' },
  code_manager: { label: 'Developer', icon: Code, greeting: 'Welcome Developer' },
  project_manager: { label: 'Project Manager', icon: Briefcase, greeting: 'Welcome PM' },
  lead_manager: { label: 'Lead Manager', icon: Target, greeting: 'Welcome Lead Manager' },
  seo_manager: { label: 'SEO Manager', icon: Megaphone, greeting: 'Welcome SEO Manager' },
  franchise_country: { label: 'Country Franchise', icon: MapPin, greeting: 'Welcome Franchise Partner' },
  franchise_state: { label: 'State Franchise', icon: MapPin, greeting: 'Welcome Franchise Partner' },
  franchise_city: { label: 'City Franchise', icon: MapPin, greeting: 'Welcome Franchise Partner' },
  reseller_pro: { label: 'Pro Reseller', icon: TrendingUp, greeting: 'Welcome Reseller' },
  reseller_basic: { label: 'Reseller', icon: TrendingUp, greeting: 'Welcome Reseller' },
  influencer: { label: 'Influencer', icon: Users, greeting: 'Welcome Influencer' },
  user_pro: { label: 'Pro User', icon: User, greeting: 'Welcome' },
  user_basic: { label: 'User', icon: User, greeting: 'Welcome' },
};

const WELCOME_STORAGE_KEY = 'last_welcome_shown';

export function WelcomeMessage() {
  const { user } = useAuth();
  const { roles, loading: rolesLoading } = useUserRoles();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [firstLogin, setFirstLogin] = useState(false);

  // Fetch profile name
  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();
      
      if (data) setProfile(data);
    };

    fetchProfile();
  }, [user?.id]);

  // Check if should show welcome (first login of the day)
  useEffect(() => {
    if (rolesLoading || !user?.id) return;

    const today = new Date().toDateString();
    const lastShown = localStorage.getItem(`${WELCOME_STORAGE_KEY}_${user.id}`);

    if (lastShown !== today) {
      setFirstLogin(true);
      localStorage.setItem(`${WELCOME_STORAGE_KEY}_${user.id}`, today);
      
      // Show after 300ms as per spec
      const showTimer = setTimeout(() => setVisible(true), 300);
      
      // Auto-hide after 4 seconds
      const hideTimer = setTimeout(() => {
        setExiting(true);
        setTimeout(() => setVisible(false), 300);
      }, 4300);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [user?.id, rolesLoading]);

  if (!visible || rolesLoading) return null;

  // Get primary role (highest priority)
  const primaryRole = roles[0] || 'user_basic';
  const config = roleConfig[primaryRole] || roleConfig.user_basic;
  const Icon = config.icon;

  const displayName = profile?.first_name 
    ? `${profile.first_name}${profile.last_name ? ` ${profile.last_name}` : ''}`
    : user?.email?.split('@')[0] || 'User';

  return (
    <div 
      className={`fixed top-20 right-6 z-50 ${exiting ? 'animate-welcome-exit' : 'animate-welcome-enter'}`}
      role="status"
      aria-live="polite"
    >
      <div className="glass-card rounded-xl px-5 py-4 flex items-center gap-4 shadow-elegant border border-primary/20">
        <div className={`w-10 h-10 rounded-xl gradient-primary flex items-center justify-center ${firstLogin ? 'animate-icon-pulse' : ''}`}>
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {config.greeting}
          </span>
          <span className="text-xs text-muted-foreground">
            Good to see you, {displayName}
          </span>
        </div>
      </div>
    </div>
  );
}
