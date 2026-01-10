import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { supabase } from '@/integrations/supabase/client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LogOut, User, Settings, ChevronDown, Crown, Shield, Code, Headphones } from 'lucide-react';
import { SystemStatus } from '@/components/header/SystemStatus';
import { GlobalSearch } from '@/components/header/GlobalSearch';
import { ProductSwitcher } from '@/components/header/ProductSwitcher';
import { OfferSlider } from '@/components/header/OfferSlider';
import { PromiseButton } from '@/components/header/PromiseButton';
import { QuickActions } from '@/components/header/QuickActions';
import { AISupportChat } from '@/components/header/AISupportChat';
import { InternalChatBot } from '@/components/header/InternalChatBot';
import { AlertBell } from '@/components/header/AlertBell';
import { LanguageCurrencySwitch } from '@/components/header/LanguageCurrencySwitch';
import { QuickSettings } from '@/components/header/QuickSettings';

interface Profile {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string;
}

export function DashboardHeader() {
  const { user, signOut } = useAuth();
  const { roles, isAdmin, isSuperAdmin, isManager } = useUserRoles();
  const [profile, setProfile] = useState<Profile | null>(null);

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

  const getDisplayName = () => {
    if (profile?.first_name) {
      return profile.last_name 
        ? `${profile.first_name} ${profile.last_name}` 
        : profile.first_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getPrimaryRole = () => {
    if (isSuperAdmin()) return 'Super Admin';
    if (isAdmin()) return 'Admin';
    if (roles.length > 0) {
      return roles[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return 'User';
  };

  const getRoleIcon = () => {
    if (isSuperAdmin()) return <Crown className="h-3 w-3" />;
    if (isAdmin()) return <Shield className="h-3 w-3" />;
    if (roles.some(r => r.includes('code') || r.includes('developer'))) return <Code className="h-3 w-3" />;
    if (roles.some(r => r.includes('support'))) return <Headphones className="h-3 w-3" />;
    return <User className="h-3 w-3" />;
  };

  const getRoleBadgeClass = () => {
    if (isSuperAdmin()) return 'bg-success text-success-foreground border-transparent';
    if (isAdmin()) return 'bg-info text-info-foreground border-transparent';
    return '';
  };

  const isEmployee = isAdmin() || isManager() || roles.length > 0;

  return (
    <header className="h-[72px] md:h-[72px] h-[64px] border-b flex items-center justify-between px-4 lg:px-6 gap-2 boss-header">
      {/* Left Section: Logo + System Status + Product Switcher + Search */}
      <div className="flex items-center gap-3 lg:gap-4 min-w-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="h-9 w-9 shrink-0 boss-header-icon" />
          </TooltipTrigger>
          <TooltipContent>System Control Center</TooltipContent>
        </Tooltip>
        
        {/* System Status */}
        <SystemStatus />

        {/* Context Title - Center optional */}
        {isSuperAdmin() && (
          <span className="hidden lg:block text-[hsl(var(--boss-header-text-primary))] font-medium text-sm">
            Boss Panel
          </span>
        )}

        {/* Product Switcher */}
        <ProductSwitcher />

        {/* Global Search */}
        <GlobalSearch />
      </div>

      {/* Center Section: Notifications + Promise + Chats */}
      <div className="flex items-center gap-1 lg:gap-2">
        {/* Alert Bell - employees only */}
        {isEmployee && <AlertBell />}

        {/* Promise Button - visible to all */}
        <PromiseButton />

        {/* Internal Chat Bot - employees only */}
        {isEmployee && <InternalChatBot />}

        {/* AI Support Chat - visible to all */}
        <AISupportChat />
      </div>

      {/* Right Section: Language + Offers + Identity + Settings + Logout */}
      <div className="flex items-center gap-1 lg:gap-2">
        {/* Language/Currency Switch */}
        <LanguageCurrencySwitch />

        {/* Offer Slider - visible to all */}
        <OfferSlider />

        {/* Quick Actions - role-based */}
        <QuickActions />

        {/* Quick Settings */}
        <QuickSettings />

        {/* User Menu with Role Badge */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 boss-header-icon hover:bg-[hsl(var(--boss-header-accent)/0.1)]">
              <Avatar className="h-8 w-8 ring-1 ring-[hsl(var(--boss-header-accent)/0.3)]">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-[hsl(var(--boss-header-accent))] text-white text-sm font-medium">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-[hsl(var(--boss-header-text-primary))]">{getDisplayName()}</span>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 flex items-center gap-1 border-[hsl(var(--boss-header-accent)/0.3)] text-[hsl(var(--boss-header-text-secondary))] ${getRoleBadgeClass()}`}>
                  {getRoleIcon()}
                  {getPrimaryRole()}
                </Badge>
              </div>
              <ChevronDown className="h-4 w-4 text-[hsl(var(--boss-header-text-secondary))]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{getDisplayName()}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <Badge variant="outline" className={`text-[10px] w-fit mt-1 flex items-center gap-1 ${getRoleBadgeClass()}`}>
                  {getRoleIcon()}
                  {getPrimaryRole()}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              Security
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Visible Logout Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 boss-header-icon"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Secure Logout</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
