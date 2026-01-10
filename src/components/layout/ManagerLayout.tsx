import { ReactNode } from 'react';
import { UltraLuxuryLayout, AllRoleTypes } from './UltraLuxuryLayout';

export type ManagerRoleType = 'product' | 'demo' | 'seo' | 'hr' | 'sales' | 'support';

interface ManagerLayoutProps {
  role: ManagerRoleType;
  children: ReactNode;
}

const roleLabels: Record<ManagerRoleType, string> = {
  product: 'Product',
  demo: 'Demo',
  seo: 'SEO',
  hr: 'HR',
  sales: 'Sales',
  support: 'Support',
};

export function ManagerLayout({ role, children }: ManagerLayoutProps) {
  return (
    <UltraLuxuryLayout role={role as AllRoleTypes} variant="manager">
      {children}
    </UltraLuxuryLayout>
  );
}
