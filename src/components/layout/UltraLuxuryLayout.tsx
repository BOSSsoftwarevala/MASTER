import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSecurityShield } from '@/hooks/useSecurityShield';
import { UltraLuxurySidebar } from './UltraLuxurySidebar';
import { UltraLuxuryHeader } from './UltraLuxuryHeader';
import { WelcomeMessage } from '@/components/ui/WelcomeMessage';

export type AllRoleTypes =
  | 'boss'
  | 'franchise'
  | 'reseller'
  | 'developer'
  | 'influencer'
  | 'product'
  | 'demo'
  | 'seo'
  | 'hr'
  | 'sales'
  | 'support';

interface UltraLuxuryLayoutProps {
  role: AllRoleTypes;
  variant: 'portal' | 'manager' | 'boss';
  children: ReactNode;
}

export function UltraLuxuryLayout({ role, variant, children }: UltraLuxuryLayoutProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Enable security shield on all dashboard layouts
  useSecurityShield();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="dark min-h-screen flex items-center justify-center bg-[hsl(var(--luxury-canvas-bg))] text-foreground">
        <div className="p-8 rounded-[18px] bg-[hsl(var(--luxury-card-bg))] shadow-[0_18px_60px_-24px_hsl(0_0%_0%/0.55)]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[hsl(var(--luxury-active-bg))] animate-spin" />
            <span className="text-[hsl(var(--luxury-icon-active))] text-lg font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dark min-h-screen bg-[hsl(var(--luxury-canvas-bg))] text-foreground">
      {/* Sidebar */}
      <UltraLuxurySidebar role={role} variant={variant} />

      {/* Header */}
      <UltraLuxuryHeader role={role} />

      {/* Main Content */}
      <main className="min-h-screen pt-[96px] pb-6 pr-6 pl-[120px]">
        <div className="animate-fade-up">{children}</div>
      </main>

      {/* Welcome Message */}
      <WelcomeMessage />
    </div>
  );
}

