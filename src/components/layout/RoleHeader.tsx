import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { supabase } from '@/integrations/supabase/client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  LogOut, 
  User, 
  Settings, 
  ChevronDown, 
  Shield,
  Building2,
  UserCheck,
  Code,
  Megaphone,
  Headphones
} from 'lucide-react';
import { SystemStatus } from '@/components/header/SystemStatus';
import { GlobalSearch } from '@/components/header/GlobalSearch';
import { ProductSwitcher } from '@/components/header/ProductSwitcher';
import { OfferSlider } from '@/components/header/OfferSlider';
import { PromiseButton } from '@/components/header/PromiseButton';
import { AISupportChat } from '@/components/header/AISupportChat';
import { AlertBell } from '@/components/header/AlertBell';
import { LanguageCurrencySwitch } from '@/components/header/LanguageCurrencySwitch';
import { QuickSettings } from '@/components/header/QuickSettings';
import { SeoButton } from '@/components/header/SeoButton';
import { RatingButton } from '@/components/header/RatingButton';
import { AssistButton } from '@/components/header/AssistButton';
import { TaskButton } from '@/components/header/TaskButton';
import { BuzzerControl } from '@/components/header/BuzzerControl';
import { TipButton } from '@/components/header/TipButton';
import { InternalChatBot } from '@/components/header/InternalChatBot';

type RoleType = 'franchise' | 'reseller' | 'developer' | 'influencer' | 'support';

interface RoleHeaderProps {
  role: RoleType;
}

interface Profile {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string;
}

const roleConfig: Record<RoleType, { label: string; icon: React.ReactNode; color: string; tipEnabled: boolean }> = {
  franchise: { 
    label: 'Franchise', 
    icon: <Building2 className="h-3 w-3" />, 
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    tipEnabled: false,
  },
  reseller: { 
    label: 'Reseller', 
    icon: <UserCheck className="h-3 w-3" />, 
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    tipEnabled: true,
  },
  developer: { 
    label: 'Developer', 
    icon: <Code className="h-3 w-3" />, 
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    tipEnabled: false,
  },
  influencer: { 
    label: 'Influencer', 
    icon: <Megaphone className="h-3 w-3" />, 
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
    tipEnabled: false,
  },
  support: { 
    label: 'Support', 
    icon: <Headphones className="h-3 w-3" />, 
    color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30',
    tipEnabled: true,
  },
};

export function RoleHeader({ role }: RoleHeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin, isManager } = useUserRoles();
  const [profile, setProfile] = useState<Profile | null>(null);

  const config = roleConfig[role];

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

  // Check if user is internal employee (for showing internal-only features)
  const isEmployee = isAdmin() || isManager();

  return (
    <header className="h-16 border-b border-border border-l-4 border-l-primary bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 gap-2 sticky top-0 z-40">
      {/* Left Section */}
      <div className="flex items-center gap-2 lg:gap-4 min-w-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="h-9 w-9 shrink-0" />
          </TooltipTrigger>
          <TooltipContent>{config.label} Portal Menu</TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-6" />
        
        {/* Portal Badge */}
        <Badge variant="outline" className={`hidden sm:flex items-center gap-1 ${config.color}`}>
          {config.icon}
          {config.label} Portal
        </Badge>

        {/* System Status */}
        <SystemStatus />

        {/* Product Switcher */}
        <ProductSwitcher />

        {/* Global Search */}
        <div className="hidden md:block">
          <GlobalSearch />
        </div>
      </div>

      {/* Center Section: Notifications + Actions */}
      <div className="flex items-center gap-1 lg:gap-2">
        {/* Task Button - Role-specific task list */}
        <TaskButton role={role} />

        {/* Assist Button */}
        <AssistButton />

        {/* Promise Button */}
        <PromiseButton />

        {/* Internal Chat - Team only */}
        <InternalChatBot />

        {/* Alert Bell */}
        <AlertBell />

        {/* Buzzer Control - Sound + Visual alerts */}
        <BuzzerControl role={role} />

        {/* Tip Button - Only for roles where enabled */}
        {config.tipEnabled && <TipButton recipientRole={config.label} />}

        {/* SEO Button - Franchise/Reseller only */}
        {(role === 'franchise' || role === 'reseller') && <SeoButton />}

        {/* Rating Button */}
        <RatingButton />

        {/* AI Support Chat */}
        <AISupportChat />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 lg:gap-2">
        {/* Language/Currency Switch */}
        <LanguageCurrencySwitch />

        {/* Offer Slider */}
        <OfferSlider />

        {/* Quick Settings */}
        <QuickSettings />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="gradient-primary text-primary-foreground text-sm">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{getDisplayName()}</span>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 flex items-center gap-1 ${config.color}`}>
                  {config.icon}
                  {config.label}
                </Badge>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{getDisplayName()}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <Badge variant="outline" className={`text-[10px] w-fit mt-1 flex items-center gap-1 ${config.color}`}>
                  {config.icon}
                  {config.label}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/portal/${role}/profile`)}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/portal/${role}/security`)}>
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
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
