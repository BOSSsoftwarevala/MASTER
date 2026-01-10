import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BarChart3,
  CreditCard,
  ArrowLeftRight,
  Package,
  MessageSquare,
  LogOut,
  LayoutGrid,
} from 'lucide-react';
import { SoftwareValaIcon } from '@/components/ui/SoftwareValaIcon';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/boss/development' },
  { icon: LayoutGrid, label: 'Category', path: '/dashboard/boss/development/category' },
  { icon: BarChart3, label: 'Statistics', path: '/dashboard/boss/development/statistics' },
  { icon: CreditCard, label: 'Payment', path: '/dashboard/boss/development/payment' },
  { icon: ArrowLeftRight, label: 'Transactions', path: '/dashboard/boss/development/transactions' },
  { icon: Package, label: 'Products', path: '/dashboard/boss/development/products' },
  { icon: MessageSquare, label: 'Messages', path: '/dashboard/boss/development/messages', badge: 5 },
];

export const ZarssSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-[240px] h-screen bg-[#0D0D0D] flex flex-col border-r border-[#1a1a1a] sticky top-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-[#2a2a2e] flex items-center justify-center">
          <span className="text-[#c4f441] font-bold text-lg">Z</span>
        </div>
        <span className="text-white font-semibold text-xl">Zarss</span>
      </div>

      {/* Software Vala DP - Perfect circle, no background */}
      <div className="px-6 py-4 flex flex-col items-center shrink-0">
        <SoftwareValaIcon size="sidebar-expanded" />
        <p className="text-[rgba(255,255,255,0.9)] text-[13px] font-medium mt-3">Software Vala</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-[#c4f441] text-[#0D0D0D]" 
                  : "text-[#6b6b6b] hover:text-white hover:bg-[#1a1a1e]"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-[#0D0D0D]" : "text-[#6b6b6b] group-hover:text-white"
              )} />
              <span className="text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span className={cn(
                  "ml-auto w-5 h-5 rounded-full text-xs flex items-center justify-center",
                  isActive ? "bg-[#0D0D0D] text-[#c4f441]" : "bg-[#c4f441] text-[#0D0D0D]"
                )}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-[#1a1a1a] shrink-0">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6b6b6b] hover:text-white hover:bg-[#1a1a1e] transition-all duration-200 w-full">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
};
