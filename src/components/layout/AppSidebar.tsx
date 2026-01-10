import { useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { useUserRoles } from '@/hooks/useUserRoles';
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
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Package,
  Target,
  Key,
  Shield,
  Building2,
  Eye,
  CheckCircle,
  Snowflake,
  KeyRound,
  DollarSign,
  Server,
  Code2,
  AlertTriangle,
  ScrollText,
  UserCircle,
  Activity,
  Scaling,
  CalendarClock,
  AlertOctagon,
  ShieldCheck,
  Hammer,
  Rocket,
  XCircle,
  Tag,
  RotateCcw,
  Clock,
  CreditCard,
  UserPlus,
  History,
  TrendingUp,
  MapPin,
  Wallet,
  Building,
  HardDrive,
  FolderGit2,
  ListTodo,
  Bug,
  TestTube,
  Megaphone,
  FileText,
  Search,
  Sparkle,
  PieChart,
  Ticket,
  Headphones,
  Star,
  Calendar,
  Play,
  Eye as EyeIcon,
  Layers,
  GitPullRequest,
  FileCode,
  Sliders,
  Bell,
  Home,
  ArrowLeft,
  LogOut,
  Settings,
  Lock,
  Ban,
  Fingerprint,
  Monitor,
  RefreshCw,
  Brain,
  Gauge,
} from 'lucide-react';

// Module type for internal navigation
type ModuleType = 
  | 'boss' | 'boss-approvals' | 'boss-snapshots' | 'boss-security' | 'boss-governance'
  | 'server' | 'devmanager' | 'development' | 'marketing' | 'reseller' | 'franchise' 
  | 'finance' | 'hr' | 'support' | 'product' | 'demo' | 'roles' | 'aiapi' | 'aiceo';

// Sidebar items - All modules under ONE Boss Panel
const bossHomeItem = { title: 'Boss Dashboard', url: '/dashboard/boss', icon: Home };

// Main sidebar items - SINGLE SIDEBAR STRUCTURE (All routes under /dashboard/boss/...)
const sidebarModules = [
  { title: 'AI CEO', url: '/dashboard/boss/ai-ceo', icon: Brain, color: 'text-violet-500' },
  { title: 'Fail-Safe Governance', url: '/dashboard/boss/governance/inactivity', icon: Shield, color: 'text-red-500' },
  { title: 'AI / API Manager', url: '/dashboard/boss/aiapi', icon: Sparkle, color: 'text-violet-500' },
  { title: 'Security & Audit', url: '/dashboard/boss/security', icon: Shield, color: 'text-red-500' },
  { title: 'Server Management', url: '/dashboard/boss/server', icon: Server, color: 'text-success' },
  { title: 'Development Control', url: '/dashboard/boss/development', icon: Rocket, color: 'text-purple-500' },
  { title: 'Approval Center', url: '/dashboard/boss/approvals', icon: CheckCircle, color: 'text-emerald-500' },
  { title: 'Role & Permission', url: '/dashboard/boss/roles', icon: ShieldCheck, color: 'text-amber-500' },
  { title: 'Franchise Management', url: '/dashboard/boss/franchise', icon: Building, color: 'text-emerald-500' },
  { title: 'Reseller Management', url: '/dashboard/boss/reseller', icon: Users, color: 'text-emerald-500' },
  { title: 'Developer Management', url: '/dashboard/boss/devmanager', icon: Code2, color: 'text-cyan-500' },
  { title: 'Finance & Wallet', url: '/dashboard/boss/finance', icon: DollarSign, color: 'text-green-500' },
  { title: 'Marketing', url: '/dashboard/boss/marketing', icon: Megaphone, color: 'text-pink-500' },
  { title: 'Support & Assist', url: '/dashboard/boss/support', icon: Headphones, color: 'text-teal-500' },
  { title: 'Product & Demo', url: '/dashboard/boss/product', icon: Package, color: 'text-blue-600' },
  { title: 'HR Management', url: '/dashboard/boss/hr', icon: Users, color: 'text-orange-500' },
  { title: 'Legal & Compliance', url: '/dashboard/boss/legal', icon: FileText, color: 'text-slate-500' },
  { title: 'Black Box (Vault)', url: '/dashboard/boss/blackbox', icon: Lock, color: 'text-muted-foreground' },
  { title: 'Settings', url: '/dashboard/boss/settings', icon: Settings, color: 'text-muted-foreground' },
];

// AI/API Manager sub-items
const aiApiItems = [
  { title: 'Dashboard', url: '/dashboard/boss/aiapi', icon: Activity },
  { title: 'Auto Recovery AI', url: '/dashboard/boss/aiapi/auto-recovery', icon: RefreshCw },
  { title: 'Incident Prediction', url: '/dashboard/boss/aiapi/incident-prediction', icon: AlertTriangle },
  { title: 'Cost Optimizer', url: '/dashboard/boss/aiapi/cost-optimizer', icon: DollarSign },
  { title: 'AI Services', url: '/dashboard/boss/aiapi/ai-services', icon: Sparkle },
  { title: 'API Registry', url: '/dashboard/boss/aiapi/api-registry', icon: Server },
  { title: 'API Providers', url: '/dashboard/boss/aiapi/api-providers', icon: Key },
  { title: 'Fallback Rules', url: '/dashboard/boss/aiapi/fallback-rules', icon: Shield },
  { title: 'AI Decisions Log', url: '/dashboard/boss/aiapi/decisions', icon: ScrollText },
  { title: 'Usage Logs', url: '/dashboard/boss/aiapi/logs', icon: Activity },
];

// Security sub-items
const securityItems = [
  { title: 'Security Dashboard', url: '/dashboard/boss/security', icon: Shield },
  { title: 'Threat Monitor', url: '/dashboard/boss/security/threats', icon: AlertTriangle },
  { title: 'IP Blocklist', url: '/dashboard/boss/security/ip-blocklist', icon: Ban },
  { title: 'Device Trust', url: '/dashboard/boss/security/devices', icon: Fingerprint },
  { title: 'Session Control', url: '/dashboard/boss/sessions', icon: UserCircle },
  { title: 'Audit Logs', url: '/dashboard/boss/audit', icon: ScrollText },
];

// Governance sub-items (Fail-Safe Layer)
const governanceItems = [
  { title: 'Inactivity Governance', url: '/dashboard/boss/governance/inactivity', icon: Clock },
  { title: 'Reputation Protection', url: '/dashboard/boss/governance/reputation', icon: Star },
  { title: 'System Takeover', url: '/dashboard/boss/governance/takeover', icon: Shield },
  { title: 'AI Fail-Safe', url: '/dashboard/boss/governance/ai-failsafe', icon: Brain },
  { title: 'Zero-Blame Incidents', url: '/dashboard/boss/governance/zero-blame', icon: Eye },
  { title: 'Boss Override', url: '/dashboard/boss/governance/override', icon: Lock },
];

// AI CEO sub-items
const aiCeoItems = [
  { title: 'Dashboard', url: '/dashboard/boss/ai-ceo', icon: Brain },
  { title: 'System Monitor', url: '/dashboard/boss/ai-ceo/monitor', icon: Activity },
  { title: 'Business Intelligence', url: '/dashboard/boss/ai-ceo/business', icon: TrendingUp },
  { title: 'Risk Detection', url: '/dashboard/boss/ai-ceo/risks', icon: AlertTriangle },
  { title: 'AI Suggestions', url: '/dashboard/boss/ai-ceo/suggestions', icon: Sparkle },
  { title: 'Predictions', url: '/dashboard/boss/ai-ceo/predictions', icon: PieChart },
  { title: 'Decision Log', url: '/dashboard/boss/ai-ceo/decisions', icon: ScrollText },
];

// Boss Approvals sub-items
const bossApprovalsItems = [
  { title: 'Approval Dashboard', url: '/dashboard/boss/approvals', icon: CheckCircle },
  { title: 'Pending Queue', url: '/dashboard/boss/approvals/pending', icon: Clock },
  { title: 'High-Risk Actions', url: '/dashboard/boss/approvals/high-risk', icon: AlertTriangle },
  { title: 'Payment Approvals', url: '/dashboard/boss/approvals/payment', icon: CreditCard },
  { title: 'Access Approvals', url: '/dashboard/boss/approvals/access', icon: KeyRound },
  { title: 'AI Approvals', url: '/dashboard/boss/approvals/ai', icon: Sparkle },
  { title: 'Approval History', url: '/dashboard/boss/approvals/history', icon: History },
];

// Server Manager sub-items
const serverItems = [
  { title: 'Dashboard', url: '/dashboard/boss/server', icon: Activity },
  { title: 'Company Servers', url: '/dashboard/boss/server/servers/company', icon: Server },
  { title: 'Client Servers', url: '/dashboard/boss/server/servers/client', icon: Building2 },
  { title: 'Add Server', url: '/dashboard/boss/server/add', icon: UserPlus },
  { title: 'Health', url: '/dashboard/boss/server/monitoring/health', icon: Activity },
  { title: 'Load', url: '/dashboard/boss/server/monitoring/load', icon: TrendingUp },
  { title: 'Uptime', url: '/dashboard/boss/server/monitoring/uptime', icon: Clock },
  { title: 'Auto Scaling', url: '/dashboard/boss/server/scaling/auto', icon: Scaling },
  { title: 'Firewall', url: '/dashboard/boss/server/security/firewall', icon: Shield },
  { title: 'Access Control', url: '/dashboard/boss/server/security/access-control', icon: ShieldCheck },
  { title: 'Backups', url: '/dashboard/boss/server/backups', icon: HardDrive },
  { title: 'Alerts', url: '/dashboard/boss/server/alerts', icon: AlertOctagon },
  { title: 'Incidents', url: '/dashboard/boss/server/incidents', icon: AlertTriangle },
  { title: 'Expiry Tracker', url: '/dashboard/boss/server/renewals', icon: CalendarClock },
  { title: 'Maintenance', url: '/dashboard/boss/server/maintenance', icon: Hammer },
];

// Development Control sub-items
const developmentItems = [
  { title: 'Pipeline Overview', url: '/dashboard/boss/development', icon: Activity },
  { title: 'Build Trigger', url: '/dashboard/boss/development/trigger', icon: Hammer },
  { title: 'Test & QA Gate', url: '/dashboard/boss/development/tests', icon: CheckCircle },
  { title: 'Deployment Control', url: '/dashboard/boss/development/deploy', icon: Rocket },
  { title: 'Release Management', url: '/dashboard/boss/development/releases', icon: Tag },
  { title: 'Rollback Control', url: '/dashboard/boss/development/rollback', icon: RotateCcw },
  { title: 'Version Governance', url: '/dashboard/boss/development/governance', icon: Shield },
  { title: 'Deploy Incidents', url: '/dashboard/boss/development/incidents', icon: XCircle },
];

// Dev Manager sub-items
const devManagerItems = [
  { title: 'Dev Home', url: '/dashboard/boss/devmanager', icon: Activity },
  { title: 'All Developers', url: '/dashboard/boss/devmanager/developers', icon: Users },
  { title: 'Access Expiry', url: '/dashboard/boss/devmanager/access-expiry', icon: Clock },
  { title: 'All Projects', url: '/dashboard/boss/devmanager/projects', icon: FolderGit2 },
  { title: 'Milestones', url: '/dashboard/boss/devmanager/milestones', icon: Target },
  { title: 'Task Board', url: '/dashboard/boss/devmanager/tasks', icon: ListTodo },
  { title: 'Blocked Tasks', url: '/dashboard/boss/devmanager/blocked-tasks', icon: XCircle },
  { title: 'Build Requests', url: '/dashboard/boss/devmanager/builds', icon: Hammer },
  { title: 'Failed Builds', url: '/dashboard/boss/devmanager/builds/failed', icon: XCircle },
  { title: 'Bugs', url: '/dashboard/boss/devmanager/bugs', icon: Bug },
  { title: 'QA Tests', url: '/dashboard/boss/devmanager/qa', icon: TestTube },
  { title: 'QA Approvals', url: '/dashboard/boss/devmanager/qa/approvals', icon: ShieldCheck },
  { title: 'Pull Requests', url: '/dashboard/boss/devmanager/pull-requests', icon: GitPullRequest },
  { title: 'Code Reviews', url: '/dashboard/boss/devmanager/code-reviews', icon: FileCode },
];

// Role & Permission sub-items
const roleItems = [
  { title: 'Role Registry', url: '/dashboard/boss/roles', icon: Shield },
  { title: 'Permission Matrix', url: '/dashboard/boss/roles/matrix', icon: Key },
  { title: 'Role Assignment', url: '/dashboard/boss/roles/assignment', icon: UserPlus },
  { title: 'Temp Access', url: '/dashboard/boss/roles/temp-access', icon: Clock },
  { title: 'Privilege Escalation', url: '/dashboard/boss/roles/escalation', icon: TrendingUp },
  { title: 'Violations Log', url: '/dashboard/boss/roles/violations', icon: AlertOctagon },
  { title: 'Role Audit', url: '/dashboard/boss/roles/audit', icon: ScrollText },
];

// Franchise sub-items
const franchiseItems = [
  { title: 'Franchise Registry', url: '/dashboard/boss/franchise', icon: Building },
  { title: 'Onboarding', url: '/dashboard/boss/franchise/onboarding', icon: UserPlus },
  { title: 'Territory Assignment', url: '/dashboard/boss/franchise/territories', icon: MapPin },
  { title: 'Plans & Pricing', url: '/dashboard/boss/franchise/plans', icon: CreditCard },
  { title: 'Performance', url: '/dashboard/boss/franchise/performance', icon: TrendingUp },
  { title: 'Wallet View', url: '/dashboard/boss/franchise/wallet', icon: Wallet },
  { title: 'Violations', url: '/dashboard/boss/franchise/violations', icon: AlertOctagon },
  { title: 'Audit Log', url: '/dashboard/boss/franchise/audit', icon: ScrollText },
];

// Reseller sub-items
const resellerItems = [
  { title: 'Reseller Home', url: '/dashboard/boss/reseller', icon: Activity },
  { title: 'All Resellers', url: '/dashboard/boss/reseller/list', icon: Users },
  { title: 'Lead Scopes', url: '/dashboard/boss/reseller/scopes', icon: Target },
  { title: 'Wallets', url: '/dashboard/boss/reseller/wallets', icon: Wallet },
  { title: 'Performance', url: '/dashboard/boss/reseller/performance', icon: TrendingUp },
  { title: 'Plans', url: '/dashboard/boss/reseller/plans', icon: CreditCard },
  { title: 'Violations', url: '/dashboard/boss/reseller/violations', icon: AlertOctagon },
];

// Finance sub-items
const financeItems = [
  { title: 'Finance Home', url: '/dashboard/boss/finance', icon: DollarSign },
  { title: 'Wallets', url: '/dashboard/boss/finance/wallets', icon: Wallet },
  { title: 'Invoices', url: '/dashboard/boss/finance/invoices', icon: FileText },
  { title: 'Plans', url: '/dashboard/boss/finance/plans', icon: CreditCard },
  { title: 'Subscriptions', url: '/dashboard/boss/finance/subscriptions', icon: CreditCard },
  { title: 'Payouts', url: '/dashboard/boss/finance/payouts', icon: DollarSign },
  { title: 'Cost & Burn', url: '/dashboard/boss/finance/costs', icon: TrendingUp },
];

// Marketing sub-items
const marketingItems = [
  { title: 'Marketing Home', url: '/dashboard/boss/marketing', icon: Activity },
  { title: 'Campaigns', url: '/dashboard/boss/marketing/campaigns', icon: Megaphone },
  { title: 'SEO', url: '/dashboard/boss/marketing/seo', icon: Search },
  { title: 'Content', url: '/dashboard/boss/marketing/content', icon: FileText },
  { title: 'Lead Sources', url: '/dashboard/boss/marketing/lead-sources', icon: Target },
  { title: 'AI Tools', url: '/dashboard/boss/marketing/ai-tools', icon: Sparkle },
  { title: 'Analytics', url: '/dashboard/boss/marketing/analytics', icon: PieChart },
];

// Support sub-items
const supportItems = [
  { title: 'Support Home', url: '/dashboard/boss/support', icon: Headphones },
  { title: 'Tickets', url: '/dashboard/boss/support/tickets', icon: Ticket },
  { title: 'Assist Sessions', url: '/dashboard/boss/support/assist', icon: Headphones },
  { title: 'SLA Management', url: '/dashboard/boss/support/sla', icon: Clock },
  { title: 'Promise Tracker', url: '/dashboard/boss/support/promises', icon: CheckCircle },
  { title: 'Feedback', url: '/dashboard/boss/support/feedback', icon: Star },
];

// Product & Demo sub-items
const productItems = [
  { title: 'Product Home', url: '/dashboard/boss/product', icon: Package },
  { title: 'Product List', url: '/dashboard/boss/product/products', icon: Package },
  { title: 'Categories', url: '/dashboard/boss/product/categories', icon: Layers },
  { title: 'Features', url: '/dashboard/boss/product/features', icon: Star },
  { title: 'Plan Mapping', url: '/dashboard/boss/product/pricing/mapping', icon: CreditCard },
  { title: 'Region Rules', url: '/dashboard/boss/product/pricing/visibility', icon: EyeIcon },
];

const demoItems = [
  { title: 'Demo Home', url: '/dashboard/boss/demo', icon: Play },
  { title: 'Active Demos', url: '/dashboard/boss/demo/active', icon: Play },
  { title: 'Expired Demos', url: '/dashboard/boss/demo/expired', icon: Clock },
  { title: 'Demo Requests', url: '/dashboard/boss/demo/requests', icon: UserPlus },
  { title: 'Usage', url: '/dashboard/boss/demo/usage', icon: Activity },
  { title: 'Conversion', url: '/dashboard/boss/demo/funnel', icon: TrendingUp },
];

// HR sub-items
const hrItems = [
  { title: 'HR Home', url: '/dashboard/boss/hr', icon: Activity },
  { title: 'Active Employees', url: '/dashboard/boss/hr/employees', icon: Users },
  { title: 'Job Openings', url: '/dashboard/boss/hr/jobs', icon: FileText },
  { title: 'Applications', url: '/dashboard/boss/hr/applications', icon: UserPlus },
  { title: 'Attendance', url: '/dashboard/boss/hr/attendance', icon: Clock },
  { title: 'Leave Requests', url: '/dashboard/boss/hr/leave', icon: Calendar },
  { title: 'Salary Summary', url: '/dashboard/boss/hr/salary', icon: DollarSign },
  { title: 'Payslips', url: '/dashboard/boss/hr/payslips', icon: FileText },
  { title: 'Reviews', url: '/dashboard/boss/hr/reviews', icon: Star },
  { title: 'Goals', url: '/dashboard/boss/hr/goals', icon: Target },
  { title: 'Resignations', url: '/dashboard/boss/hr/exits', icon: XCircle },
  { title: 'Documents', url: '/dashboard/boss/hr/documents', icon: FileText },
];

// Helper to detect current module from path (ALL paths under /dashboard/boss/...)
function detectModule(pathname: string): ModuleType | null {
  if (pathname.startsWith('/dashboard/boss/ai-ceo')) return 'aiceo';
  if (pathname.startsWith('/dashboard/boss/aiapi')) return 'aiapi';
  if (pathname.startsWith('/dashboard/boss/approvals')) return 'boss-approvals';
  if (pathname.startsWith('/dashboard/boss/finance-snapshot') || 
      pathname.startsWith('/dashboard/boss/deploy-snapshot')) return 'boss-snapshots';
  if (pathname.startsWith('/dashboard/boss/security') || 
      pathname.startsWith('/dashboard/boss/audit') || 
      pathname.startsWith('/dashboard/boss/sessions')) return 'boss-security';
  if (pathname.startsWith('/dashboard/boss/server')) return 'server';
  if (pathname.startsWith('/dashboard/boss/servers')) return 'server';
  if (pathname.startsWith('/dashboard/boss/devmanager')) return 'devmanager';
  if (pathname.startsWith('/dashboard/boss/development')) return 'development';
  if (pathname.startsWith('/dashboard/boss/marketing')) return 'marketing';
  if (pathname.startsWith('/dashboard/boss/franchise')) return 'franchise';
  if (pathname.startsWith('/dashboard/boss/finance')) return 'finance';
  if (pathname.startsWith('/dashboard/boss/hr')) return 'hr';
  if (pathname.startsWith('/dashboard/boss/support')) return 'support';
  if (pathname.startsWith('/dashboard/boss/product')) return 'product';
  if (pathname.startsWith('/dashboard/boss/demo')) return 'demo';
  if (pathname.startsWith('/dashboard/boss/roles')) return 'roles';
  if (pathname.startsWith('/dashboard/boss/governance')) return 'boss-governance';
  // Legacy routes (redirect support)
  if (pathname.startsWith('/dashboard/server')) return 'server';
  if (pathname.startsWith('/dashboard/devmanager')) return 'devmanager';
  if (pathname.startsWith('/dashboard/development')) return 'development';
  if (pathname.startsWith('/dashboard/marketing')) return 'marketing';
  if (pathname.startsWith('/dashboard/reseller')) return 'reseller';
  if (pathname.startsWith('/dashboard/franchise')) return 'franchise';
  if (pathname.startsWith('/dashboard/finance')) return 'finance';
  if (pathname.startsWith('/dashboard/hr')) return 'hr';
  if (pathname.startsWith('/dashboard/support')) return 'support';
  if (pathname.startsWith('/dashboard/product')) return 'product';
  if (pathname.startsWith('/dashboard/demo')) return 'demo';
  if (pathname.startsWith('/dashboard/roles')) return 'roles';
  return null;
}

// Module titles and colors
const moduleConfig: Record<ModuleType, { title: string; color: string }> = {
  boss: { title: 'Boss Panel', color: 'text-emerald-500' },
  'boss-approvals': { title: 'Approval Center', color: 'text-emerald-500' },
  'boss-snapshots': { title: 'System Snapshots', color: 'text-emerald-500' },
  'boss-security': { title: 'Security & Audit', color: 'text-emerald-500' },
  'boss-governance': { title: 'Fail-Safe Governance', color: 'text-red-500' },
  aiceo: { title: 'AI CEO', color: 'text-violet-500' },
  aiapi: { title: 'AI / API Manager', color: 'text-violet-500' },
  server: { title: 'Server Management', color: 'text-success' },
  devmanager: { title: 'Developer Management', color: 'text-cyan-500' },
  development: { title: 'Development Control', color: 'text-purple-500' },
  marketing: { title: 'Marketing', color: 'text-pink-500' },
  reseller: { title: 'Reseller Management', color: 'text-emerald-500' },
  franchise: { title: 'Franchise Management', color: 'text-emerald-500' },
  finance: { title: 'Finance & Wallet', color: 'text-green-500' },
  hr: { title: 'HR Management', color: 'text-orange-500' },
  support: { title: 'Support & Assist', color: 'text-teal-500' },
  product: { title: 'Product & Demo', color: 'text-blue-600' },
  demo: { title: 'Demo Manager', color: 'text-purple-600' },
  roles: { title: 'Role & Permission', color: 'text-amber-500' },
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { isSuperAdmin, isAdmin, loading: rolesLoading } = useUserRoles();
  const collapsed = state === 'collapsed';
  
  const currentModule = detectModule(location.pathname);
  const isInModule = currentModule !== null;
  const isBossHome = location.pathname === '/dashboard/boss' || 
                     location.pathname === '/dashboard/boss/home' ||
                     location.pathname === '/dashboard/boss/freeze' ||
                     location.pathname === '/dashboard/boss/access' ||
                     location.pathname === '/dashboard/boss/blackbox' ||
                     location.pathname === '/dashboard/boss/legal' ||
                     location.pathname === '/dashboard/boss/settings';

  const isActive = (path: string) => location.pathname === path;
  const isModuleActive = (path: string) => location.pathname.startsWith(path);

  const renderNavItem = (item: { title: string; url: string; icon: typeof Server; color?: string }) => {
    if (rolesLoading) {
      return (
        <SidebarMenuItem key={item.title}>
          <div className="px-3 py-2">
            <div className="h-4 w-full rounded bg-sidebar-accent/40 animate-pulse" />
          </div>
        </SidebarMenuItem>
      );
    }

    const Icon = item.icon;
    const colorClass = item.color || 'text-muted-foreground';

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <NavLink 
            to={item.url} 
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-sidebar-accent"
            activeClassName="bg-sidebar-accent font-medium"
          >
            <Icon className={`h-5 w-5 flex-shrink-0 ${colorClass}`} />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const renderBackButton = () => {
    if (!isInModule || isBossHome) return null;

    return (
      <div className="mb-4">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={() => navigate('/dashboard/boss')}
          className="w-full justify-start gap-2 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
        >
          <ArrowLeft className="h-4 w-4" />
          {!collapsed && <span>Back to Boss</span>}
        </Button>
      </div>
    );
  };

  const renderModuleHeader = () => {
    if (!isInModule || isBossHome) return null;
    
    const config = moduleConfig[currentModule];
    return (
      <div className={`mb-4 p-3 rounded-lg bg-sidebar-accent/50 border border-sidebar-border`}>
        <div className="flex items-center gap-3">
          {!collapsed && (
            <div>
              <h2 className={`font-bold ${config.color}`}>{config.title}</h2>
              <p className="text-xs text-muted-foreground">Sub-Module</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Get items for current module
  const getModuleItems = () => {
    switch (currentModule) {
      case 'boss-approvals':
        return bossApprovalsItems;
      case 'boss-security':
        return securityItems;
      case 'boss-governance':
        return governanceItems;
      case 'aiceo':
        return aiCeoItems;
      case 'aiapi':
        return aiApiItems;
      case 'server':
        return serverItems;
      case 'development':
        return developmentItems;
      case 'devmanager':
        return devManagerItems;
      case 'roles':
        return roleItems;
      case 'franchise':
        return franchiseItems;
      case 'reseller':
        return resellerItems;
      case 'finance':
        return financeItems;
      case 'marketing':
        return marketingItems;
      case 'support':
        return supportItems;
      case 'product':
        return [...productItems, ...demoItems];
      case 'demo':
        return demoItems;
      case 'hr':
        return hrItems;
      default:
        return null;
    }
  };

  // Render main sidebar (Boss Home view)
  const renderMainSidebar = () => (
    <>
      {/* Boss Home */}
      <SidebarGroup>
        {!collapsed && <SidebarGroupLabel className="text-emerald-500/80 text-xs uppercase tracking-wider mb-2 font-bold">Boss Panel</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu>
            {renderNavItem({ ...bossHomeItem, color: 'text-emerald-500' })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* All Modules */}
      <SidebarGroup>
        {!collapsed && <SidebarGroupLabel className="text-muted-foreground/80 text-xs uppercase tracking-wider mb-2">Modules</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarModules.map((item) => renderNavItem(item))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Logout */}
      <SidebarGroup>
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
    </>
  );

  // Render module-specific sidebar
  const renderModuleSidebar = () => {
    const items = getModuleItems();
    if (!items) return renderMainSidebar();

    const config = currentModule ? moduleConfig[currentModule] : null;
    const colorClass = config?.color || 'text-muted-foreground';

    return (
      <>
        {renderBackButton()}
        {renderModuleHeader()}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className={`${colorClass}/80 text-xs uppercase tracking-wider mb-2 font-bold`}>{config?.title || 'Navigation'}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => renderNavItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Eye className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg text-foreground">Boss Panel</h1>
              <p className="text-xs text-muted-foreground">Owner Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {isInModule && !isBossHome ? renderModuleSidebar() : renderMainSidebar()}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <div className="text-xs text-muted-foreground text-center">
            Boss = Owner = Super Admin
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
