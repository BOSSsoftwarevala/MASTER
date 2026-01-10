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
  LayoutDashboard,
  Users,
  Target,
  DollarSign,
  TrendingUp,
  MapPin,
  Wallet,
  Building,
  Settings,
  LogOut,
  Megaphone,
  FileText,
  PieChart,
  Star,
  ListTodo,
  Bug,
  Hammer,
  Rocket,
  Headphones,
  Home,
  Activity,
  Calendar,
  CreditCard,
  Package,
  Eye,
  Play,
  UserCircle,
  ShieldCheck,
  AlertTriangle,
  GitPullRequest,
  Clock,
  Award,
  BarChart3,
  Link,
  Key,
  Shield,
  FolderOpen,
  Kanban,
  Workflow,
  RotateCcw,
  TestTube,
  MessageSquare,
  MessageCircle,
  FileCheck,
} from 'lucide-react';

type RoleType = 'franchise' | 'reseller' | 'developer' | 'influencer';

interface RoleSidebarProps {
  role: RoleType;
}

// Franchise sidebar items - Simplified per Figma spec
const franchiseItems = [
  { title: 'Dashboard', url: '/portal/franchise', icon: Home },
  { title: 'Incoming Leads', url: '/portal/franchise/leads', icon: Target },
  { title: 'Order Requests', url: '/portal/franchise/orders', icon: Package },
  { title: 'Commission Wallet', url: '/portal/franchise/wallet', icon: Wallet },
  { title: 'Territory', url: '/portal/franchise/territory', icon: MapPin },
  { title: 'Local Resellers', url: '/portal/franchise/resellers', icon: Users },
  { title: 'Reseller Performance', url: '/portal/franchise/reseller-performance', icon: BarChart3 },
  { title: 'SLA Tracker', url: '/portal/franchise/sla', icon: Clock },
  { title: 'Compliance', url: '/portal/franchise/compliance', icon: ShieldCheck },
  { title: 'Franchise Key', url: '/portal/franchise/keys', icon: Key },
  { title: 'Security', url: '/portal/franchise/security', icon: Shield },
  { title: 'Profile', url: '/portal/franchise/profile', icon: UserCircle },
];

// Reseller sidebar items
const resellerItems = [
  { title: 'Dashboard', url: '/portal/reseller', icon: Home },
  { title: 'Assigned Leads', url: '/portal/reseller/leads', icon: Target },
  { title: 'Follow-ups', url: '/portal/reseller/followups', icon: Calendar },
  { title: 'Daily Targets', url: '/portal/reseller/targets', icon: TrendingUp },
  { title: 'Penalties', url: '/portal/reseller/penalties', icon: AlertTriangle },
  { title: 'Wallet', url: '/portal/reseller/wallet', icon: Wallet },
  { title: 'Rank Board', url: '/portal/reseller/leaderboard', icon: Award },
  { title: 'Profile', url: '/portal/reseller/profile', icon: UserCircle },
];

// Developer sidebar items - Expanded per spec
const developerItems = [
  // Dashboard
  { title: 'Dashboard', url: '/portal/developer', icon: Home },
  // Work
  { title: 'Active Tasks', url: '/portal/developer/tasks', icon: ListTodo },
  { title: 'Projects', url: '/portal/developer/projects', icon: FolderOpen },
  { title: 'Bug Assignment', url: '/portal/developer/bugs', icon: Bug },
  { title: 'Code Reviews', url: '/portal/developer/reviews', icon: GitPullRequest },
  { title: 'Sprint Board', url: '/portal/developer/sprint', icon: Kanban },
  // Time & Productivity
  { title: 'Time Tracking', url: '/portal/developer/time', icon: Clock },
  { title: 'Work Log', url: '/portal/developer/worklog', icon: FileText },
  { title: 'Productivity', url: '/portal/developer/productivity', icon: TrendingUp },
  // Build & Release
  { title: 'Build Status', url: '/portal/developer/builds', icon: Hammer },
  { title: 'CI/CD Pipeline', url: '/portal/developer/pipeline', icon: Workflow },
  { title: 'Releases', url: '/portal/developer/releases', icon: Rocket },
  { title: 'Rollback History', url: '/portal/developer/rollback', icon: RotateCcw },
  // Quality
  { title: 'QA & Tests', url: '/portal/developer/qa', icon: TestTube },
  // Communication
  { title: 'Internal Chat', url: '/portal/developer/chat', icon: MessageSquare },
  { title: 'Task Comments', url: '/portal/developer/comments', icon: MessageCircle },
  { title: 'Announcements', url: '/portal/developer/announcements', icon: Megaphone },
  // Security & Compliance
  { title: 'NDA Status', url: '/portal/developer/nda', icon: FileCheck },
  { title: 'Access Scope', url: '/portal/developer/access', icon: Shield },
  { title: 'Activity Log', url: '/portal/developer/activity', icon: Activity },
  // Profile
  { title: 'Profile', url: '/portal/developer/profile', icon: UserCircle },
];

// Influencer sidebar items
const influencerItems = [
  { title: 'Dashboard', url: '/portal/influencer', icon: Home },
  { title: 'Campaigns', url: '/portal/influencer/campaigns', icon: Megaphone },
  { title: 'Link Generator', url: '/portal/influencer/links', icon: Link },
  { title: 'Content Status', url: '/portal/influencer/content', icon: FileText },
  { title: 'Bonus Eligibility', url: '/portal/influencer/bonus', icon: Award },
  { title: 'Payouts', url: '/portal/influencer/payouts', icon: Wallet },
  { title: 'Profile', url: '/portal/influencer/profile', icon: UserCircle },
];

const roleConfig: Record<RoleType, { title: string; color: string; items: typeof franchiseItems }> = {
  franchise: { title: 'Franchise Portal', color: 'text-emerald-500', items: franchiseItems },
  reseller: { title: 'Reseller Portal', color: 'text-blue-500', items: resellerItems },
  developer: { title: 'Developer Portal', color: 'text-cyan-500', items: developerItems },
  influencer: { title: 'Influencer Portal', color: 'text-violet-500', items: influencerItems },
};

const roleIcons: Record<RoleType, typeof Building> = {
  franchise: Building,
  reseller: Users,
  developer: Hammer,
  influencer: Star,
};

export function RoleSidebar({ role }: RoleSidebarProps) {
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
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
            role === 'franchise' ? 'bg-emerald-500' :
            role === 'reseller' ? 'bg-blue-500' :
            role === 'developer' ? 'bg-cyan-500' :
            'bg-violet-500'
          }`}>
            <RoleIcon className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className={`font-bold text-lg ${config.color}`}>{config.title}</h1>
              <p className="text-xs text-muted-foreground capitalize">{role} Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className={`${config.color}/80 text-xs uppercase tracking-wider mb-2 font-bold`}>
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {config.items.map((item) => renderNavItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
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
            {role} Portal v1.0
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
