import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AllRoleTypes, UltraLuxuryLayout } from './UltraLuxuryLayout';

interface DashboardLayoutProps {
  children: ReactNode;
}

function inferDashboardContext(pathname: string): { role: AllRoleTypes; variant: 'boss' | 'manager' } {
  if (pathname.startsWith('/dashboard/boss')) {
    return { role: 'boss', variant: 'boss' };
  }

  if (pathname.startsWith('/manager/')) {
    const role = pathname.split('/')[2] as AllRoleTypes | undefined;
    if (role && ['product', 'demo', 'seo', 'hr', 'sales', 'support'].includes(role)) {
      return { role: role as AllRoleTypes, variant: 'manager' };
    }
    return { role: 'support', variant: 'manager' };
  }

  // Fallback (legacy routes)
  return { role: 'boss', variant: 'boss' };
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { pathname } = useLocation();
  const { role, variant } = inferDashboardContext(pathname);

  return (
    <UltraLuxuryLayout role={role} variant={variant}>
      {children}
    </UltraLuxuryLayout>
  );
}
