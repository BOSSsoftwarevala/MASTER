import { useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Home,
  Package,
  Layers,
  Star,
  CreditCard,
  Eye,
  Play,
  Clock,
  Users,
  TrendingUp,
  Shield,
  Search,
  FileText,
  Globe,
  BarChart3,
  Zap,
  Briefcase,
  UserPlus,
  Calendar,
  ClipboardCheck,
  Target,
  DollarSign,
  PieChart,
  Handshake,
  Ticket,
  Headphones,
  AlertTriangle,
  MessageSquare,
  LogOut,
  UserCircle,
  Activity,
  Link,
  Award,
  CheckCircle,
} from 'lucide-react';

export type ManagerRoleType = 'product' | 'demo' | 'seo' | 'hr' | 'sales' | 'support';

interface ManagerSidebarProps {
  role: ManagerRoleType;
}

// Product Manager sidebar items
const productItems = [
  { title: 'Dashboard', url: '/manager/product', icon: Home },
  { title: 'Product List', url: '/manager/product/products', icon: Package },
  { title: 'Categories', url: '/manager/product/categories', icon: Layers },
  { title: 'Features', url: '/manager/product/features', icon: Star },
  { title: 'Plan Mapping', url: '/manager/product/pricing', icon: CreditCard },
  { title: 'Status Control', url: '/manager/product/status', icon: Eye },
  { title: 'Version Info', url: '/manager/product/versions', icon: FileText },
];

// Demo Manager sidebar items
const demoItems = [
  { title: 'Dashboard', url: '/manager/demo', icon: Home },
  { title: 'Demo List', url: '/manager/demo/demos', icon: Play },
  { title: 'Demo URLs', url: '/manager/demo/urls', icon: Link },
  { title: 'Access Rules', url: '/manager/demo/access', icon: Shield },
  { title: 'Conversion', url: '/manager/demo/conversion', icon: TrendingUp },
  { title: 'Expiry Control', url: '/manager/demo/expiry', icon: Clock },
  { title: 'Copy Protection', url: '/manager/demo/security', icon: Shield },
];

// SEO Manager sidebar items
const seoItems = [
  { title: 'Dashboard', url: '/manager/seo', icon: Home },
  { title: 'AI Content', url: '/manager/seo/content', icon: Zap },
  { title: 'Page Optimization', url: '/manager/seo/pages', icon: FileText },
  { title: 'Keywords', url: '/manager/seo/keywords', icon: Search },
  { title: 'Country SEO', url: '/manager/seo/regions', icon: Globe },
  { title: 'Traffic', url: '/manager/seo/traffic', icon: BarChart3 },
  { title: 'Rankings', url: '/manager/seo/rankings', icon: TrendingUp },
];

// HR Manager sidebar items
const hrItems = [
  { title: 'Dashboard', url: '/manager/hr', icon: Home },
  { title: 'Job Posts', url: '/manager/hr/jobs', icon: Briefcase },
  { title: 'Applications', url: '/manager/hr/applications', icon: UserPlus },
  { title: 'Interviews', url: '/manager/hr/interviews', icon: Calendar },
  { title: 'Employees', url: '/manager/hr/employees', icon: Users },
  { title: 'Attendance', url: '/manager/hr/attendance', icon: ClipboardCheck },
  { title: 'Policies', url: '/manager/hr/policies', icon: FileText },
];

// Sales Manager sidebar items
const salesItems = [
  { title: 'Dashboard', url: '/manager/sales', icon: Home },
  { title: 'Sales Leads', url: '/manager/sales/leads', icon: Target },
  { title: 'Pipeline', url: '/manager/sales/pipeline', icon: TrendingUp },
  { title: 'Follow-ups', url: '/manager/sales/followups', icon: Calendar },
  { title: 'Active Deals', url: '/manager/sales/deals', icon: Handshake },
  { title: 'Closed Deals', url: '/manager/sales/closed', icon: CheckCircle },
  { title: 'Targets', url: '/manager/sales/targets', icon: Award },
];

// Support Manager sidebar items
const supportItems = [
  { title: 'Dashboard', url: '/manager/support', icon: Home },
  { title: 'Open Tickets', url: '/manager/support/tickets', icon: Ticket },
  { title: 'Priority Queue', url: '/manager/support/priority', icon: AlertTriangle },
  { title: 'SLA Timers', url: '/manager/support/sla', icon: Clock },
  { title: 'Assist Sessions', url: '/manager/support/assist', icon: Headphones },
  { title: 'Resolution Logs', url: '/manager/support/logs', icon: FileText },
  { title: 'Feedback', url: '/manager/support/feedback', icon: MessageSquare },
];

const roleConfig: Record<ManagerRoleType, { title: string; color: string; bgColor: string; items: typeof productItems }> = {
  product: { title: 'Product Manager', color: 'text-blue-500', bgColor: 'bg-blue-500', items: productItems },
  demo: { title: 'Demo Manager', color: 'text-purple-500', bgColor: 'bg-purple-500', items: demoItems },
  seo: { title: 'SEO Manager', color: 'text-green-500', bgColor: 'bg-green-500', items: seoItems },
  hr: { title: 'HR Manager', color: 'text-amber-500', bgColor: 'bg-amber-500', items: hrItems },
  sales: { title: 'Sales Manager', color: 'text-rose-500', bgColor: 'bg-rose-500', items: salesItems },
  support: { title: 'Support Manager', color: 'text-cyan-500', bgColor: 'bg-cyan-500', items: supportItems },
};

const roleIcons: Record<ManagerRoleType, typeof Package> = {
  product: Package,
  demo: Play,
  seo: Search,
  hr: Users,
  sales: Target,
  support: Headphones,
};

export function ManagerSidebar({ role }: ManagerSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = state === 'collapsed';
  
  const config = roleConfig[role];
  const RoleIcon = roleIcons[role];

  const renderNavItem = (item: { title: string; url: string; icon: typeof Home }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.url;

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <NavLink 
            to={item.url} 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-sidebar-accent ${isActive ? 'bg-sidebar-accent font-medium' : ''}`}
          >
            <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? config.color : 'text-muted-foreground'}`} />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${config.bgColor}`}>
            <RoleIcon className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className={`font-bold text-lg ${config.color}`}>{config.title}</h1>
              <p className="text-xs text-muted-foreground">Operational Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className={`${config.color}/80 text-xs uppercase tracking-wider mb-2 font-bold`}>
              Operations
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {config.items.map((item) => renderNavItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Profile & Logout */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to={`/manager/${role}/profile`}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-sidebar-accent"
                  >
                    <UserCircle className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    {!collapsed && <span>Profile</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/auth" 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-destructive/10 text-destructive"
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>Logout</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <div className="text-xs text-muted-foreground text-center capitalize">
            {role} Manager v1.0
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
