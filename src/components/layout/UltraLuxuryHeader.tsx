import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import { AlertBell } from '@/components/header/AlertBell';
import { InternalChatBot } from '@/components/header/InternalChatBot';
import { AssistButton } from '@/components/header/AssistButton';
import { PromiseButton } from '@/components/header/PromiseButton';
import { TaskButton } from '@/components/header/TaskButton';
import { BuzzerControl } from '@/components/header/BuzzerControl';
import { SoftwareValaIcon } from '@/components/ui/SoftwareValaIcon';

type RoleType = 'boss' | 'franchise' | 'reseller' | 'developer' | 'influencer' | 'support' | 'product' | 'demo' | 'seo' | 'hr' | 'sales';

interface UltraLuxuryHeaderProps {
  role: RoleType;
  /** kept optional for backwards compatibility; header positioning is fixed to 96px sidebar */
  sidebarExpanded?: boolean;
}

interface Profile {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string;
}

export function UltraLuxuryHeader({ role }: UltraLuxuryHeaderProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url, email')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile(data);
        }
      };

      fetchProfile();
    }
  }, [user]);

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  // Map role to TaskButton compatible role
  const getTaskRole = (): 'franchise' | 'reseller' | 'developer' | 'influencer' | 'support' => {
    if (role === 'boss' || ['product', 'demo', 'seo', 'hr', 'sales'].includes(role)) {
      return 'support';
    }
    return role as 'franchise' | 'reseller' | 'developer' | 'influencer' | 'support';
  };

  return (
    <header
      className="fixed top-0 right-0 left-[96px] h-[72px] z-40 bg-[hsl(var(--luxury-header-bg))] rounded-b-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.35)]"
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Left: Logo - Perfect circle, no background, no padding */}
        <div className="flex items-center">
          <SoftwareValaIcon size="header" />
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative h-[44px] rounded-[14px] flex items-center px-4 bg-[hsl(var(--luxury-search-bg))]">
            <Search className="w-5 h-5 text-[hsl(var(--luxury-search-placeholder))] mr-3" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-sm text-[hsl(var(--luxury-icon-active))] placeholder:text-[hsl(var(--luxury-search-placeholder))]"
            />
          </div>
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-2">
          <AlertBell />
          <BuzzerControl role={getTaskRole()} />
          <InternalChatBot />
          <AssistButton />
          <PromiseButton />
          <TaskButton role={getTaskRole()} />

          {/* User Avatar */}
          <div className="ml-4 flex items-center gap-3">
            <Avatar className="h-9 w-9 ring-2 ring-[hsl(var(--luxury-active-bg))]">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-sm font-medium text-[hsl(var(--luxury-icon-active))] bg-[hsl(var(--luxury-active-bg))]">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}

