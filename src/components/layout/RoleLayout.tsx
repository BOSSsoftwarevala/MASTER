import { ReactNode } from 'react';
import { UltraLuxuryLayout, AllRoleTypes } from './UltraLuxuryLayout';

type RoleType = 'franchise' | 'reseller' | 'developer' | 'influencer';

interface RoleLayoutProps {
  role: RoleType;
  children: ReactNode;
}

export function RoleLayout({ role, children }: RoleLayoutProps) {
  return (
    <UltraLuxuryLayout role={role as AllRoleTypes} variant="portal">
      {children}
    </UltraLuxuryLayout>
  );
}
