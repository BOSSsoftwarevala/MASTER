import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';
import { SoftwareValaIcon } from '@/components/ui/SoftwareValaIcon';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  ArrowLeft,
  Brain,
  Building,
  CheckCircle,
  Code2,
  DollarSign,
  FileText,
  Gavel,
  Headphones,
  Home,
  Lock,
  Megaphone,
  Network,
  Package,
  Tag,
  Rocket,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  Server,
  LogOut,
  ChevronLeft,
  ChevronRight,

  // Portal / manager icons
  Target,
  Wallet,
  MapPin,
  BarChart3,
  Clock,
  Key,
  UserCircle,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Award,
  ListTodo,
  FolderOpen,
  Bug,
  GitPullRequest,
  Kanban,
  Hammer,
  Workflow,
  RotateCcw,
  TestTube,
  MessageSquare,
  MessageCircle,
  FileCheck,
  Link,
  Briefcase,
  UserPlus,
  ClipboardCheck,
  Handshake,
  Ticket,
  Layers,
  Star,
  CreditCard,
  Eye,
  Play,
  Search,
  Globe,
  Zap,
  Bot,
} from 'lucide-react';

// Role types
export type LuxuryRoleType = 'franchise' | 'reseller' | 'developer' | 'influencer';
export type ManagerRoleType = 'product' | 'demo' | 'seo' | 'hr' | 'sales' | 'support';
export type BossRoleType = 'boss';
export type AllRoleTypes = LuxuryRoleType | ManagerRoleType | BossRoleType;

interface UltraLuxurySidebarProps {
  role: AllRoleTypes;
  variant: 'portal' | 'manager' | 'boss';
}

type NavItem = { title: string; url: string; icon: LucideIcon };

type BossModuleKey =
  | 'vala'
  | 'ai-ceo'
  | 'governance'
  | 'aiapi'
  | 'security'
  | 'server'
  | 'development'
  | 'approvals'
  | 'roles'
  | 'franchise'
  | 'reseller'
  | 'devmanager'
  | 'finance'
  | 'marketing'
  | 'support'
  | 'product'
  | 'hr'
  | 'legal'
  | 'blackbox'
  | 'settings';

const bossModules: Array<NavItem & { key: BossModuleKey; base: string }> = [
  { key: 'boss' as never, title: 'Boss Dashboard', url: '/dashboard/boss', base: '/dashboard/boss', icon: Home },
  { key: 'vala', title: 'VALA AI', url: '/dashboard/boss/vala', base: '/dashboard/boss/vala', icon: Zap },
  { key: 'ai-ceo', title: 'AI CEO', url: '/dashboard/boss/ai-ceo', base: '/dashboard/boss/ai-ceo', icon: Brain },
  { key: 'governance', title: 'Fail-Safe Governance', url: '/dashboard/boss/governance/inactivity', base: '/dashboard/boss/governance', icon: Shield },
  { key: 'aiapi', title: 'AI / API Manager', url: '/dashboard/boss/aiapi', base: '/dashboard/boss/aiapi', icon: Sparkles },
  { key: 'security', title: 'Security & Audit', url: '/dashboard/boss/security', base: '/dashboard/boss/security', icon: Shield },
  { key: 'server', title: 'Server Management', url: '/dashboard/boss/server', base: '/dashboard/boss/server', icon: Server },
  { key: 'development', title: 'Development Control', url: '/dashboard/boss/development', base: '/dashboard/boss/development', icon: Rocket },
  { key: 'approvals', title: 'Approval Center', url: '/dashboard/boss/approvals', base: '/dashboard/boss/approvals', icon: CheckCircle },
  { key: 'roles', title: 'Role & Permission', url: '/dashboard/boss/roles', base: '/dashboard/boss/roles', icon: ShieldCheck },
  { key: 'franchise', title: 'Franchise Management', url: '/dashboard/boss/franchise', base: '/dashboard/boss/franchise', icon: Building },
  { key: 'reseller', title: 'Reseller Management', url: '/dashboard/boss/reseller', base: '/dashboard/boss/reseller', icon: Users },
  { key: 'devmanager', title: 'Developer Management', url: '/dashboard/boss/devmanager', base: '/dashboard/boss/devmanager', icon: Code2 },
  { key: 'finance', title: 'Finance & Wallet', url: '/dashboard/boss/finance', base: '/dashboard/boss/finance', icon: DollarSign },
  { key: 'marketing', title: 'Marketing', url: '/dashboard/boss/marketing', base: '/dashboard/boss/marketing', icon: Megaphone },
  { key: 'support', title: 'Support & Assist', url: '/dashboard/boss/support', base: '/dashboard/boss/support', icon: Headphones },
  { key: 'product', title: 'Product & Demo', url: '/dashboard/boss/product', base: '/dashboard/boss/product', icon: Package },
  { key: 'hr', title: 'HR Management', url: '/dashboard/boss/hr', base: '/dashboard/boss/hr', icon: Users },
  { key: 'legal', title: 'Legal & Compliance', url: '/dashboard/boss/legal', base: '/dashboard/boss/legal', icon: Gavel },
  { key: 'blackbox', title: 'Black Box (Vault)', url: '/dashboard/boss/blackbox', base: '/dashboard/boss/blackbox', icon: Lock },
  { key: 'settings', title: 'Settings', url: '/dashboard/boss/settings', base: '/dashboard/boss/settings', icon: Settings },
];

// ============= SUB-NAVIGATION ITEMS FOR EACH BOSS MODULE =============

const bossDevelopmentItems: NavItem[] = [
  { title: 'Pipeline Overview', url: '/dashboard/boss/development', icon: Activity },
  { title: 'Build Trigger', url: '/dashboard/boss/development/trigger', icon: Hammer },
  { title: 'Test & QA Gate', url: '/dashboard/boss/development/tests', icon: CheckCircle },
  { title: 'Deployment Control', url: '/dashboard/boss/development/deploy', icon: Rocket },
  { title: 'Release Management', url: '/dashboard/boss/development/releases', icon: Tag },
  { title: 'Rollback Control', url: '/dashboard/boss/development/rollback', icon: RotateCcw },
  { title: 'Version Governance', url: '/dashboard/boss/development/governance', icon: Shield },
  { title: 'Deploy Incidents', url: '/dashboard/boss/development/incidents', icon: AlertTriangle },
];

const bossServerItems: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard/boss/server', icon: Home },
  { title: 'Add Server', url: '/dashboard/boss/server/add', icon: UserPlus },
  { title: 'Servers List', url: '/dashboard/boss/server/list', icon: Server },
  { title: 'Live Monitoring', url: '/dashboard/boss/server/monitoring/health', icon: Activity },
  { title: 'Security Center', url: '/dashboard/boss/server/security-center', icon: Shield },
  { title: 'AI Alerts', url: '/dashboard/boss/server/alerts', icon: AlertTriangle },
  { title: 'User Activity', url: '/dashboard/boss/server/user-activity', icon: Users },
  { title: 'Geo Control', url: '/dashboard/boss/server/geo-control', icon: Globe },
  { title: 'Backdoor Scan', url: '/dashboard/boss/server/backdoor-scan', icon: Bug },
  { title: 'Port Control', url: '/dashboard/boss/server/port-control', icon: Network },
  { title: 'Cost Control', url: '/dashboard/boss/server/cost-control', icon: DollarSign },
  { title: 'Logs & Forensics', url: '/dashboard/boss/server/logs', icon: FileText },
  { title: 'Settings', url: '/dashboard/boss/server/settings', icon: Settings },
];

// ============= VALA AI COMMAND CENTER SUB-NAVIGATION =============
const bossValaItems: NavItem[] = [
  // Primary: VALA AI Command Center
  { title: 'Command Center', url: '/dashboard/boss/vala', icon: Zap },
  { title: 'Live Decisions', url: '/dashboard/boss/vala/decisions', icon: Activity },
  { title: 'Active Tasks', url: '/dashboard/boss/vala/tasks', icon: ListTodo },
  { title: 'Priority Queue', url: '/dashboard/boss/vala/priority', icon: Target },
  
  // AI CEO Section (Strategic)
  { title: 'AI CEO Insights', url: '/dashboard/boss/vala/ceo', icon: Brain },
  { title: 'Growth Recommendations', url: '/dashboard/boss/vala/growth', icon: TrendingUp },
  { title: 'Risk Flags', url: '/dashboard/boss/vala/risks', icon: AlertTriangle },
  
  // Development Control
  { title: 'Build Monitor', url: '/dashboard/boss/vala/builds', icon: Hammer },
  { title: 'Auto Fix Engine', url: '/dashboard/boss/vala/autofix', icon: RotateCcw },
  { title: 'Bug Kill Switch', url: '/dashboard/boss/vala/bugs', icon: Bug },
  
  // Demo & Product Brain
  { title: 'Demo Health', url: '/dashboard/boss/vala/demo', icon: Play },
  { title: 'Feature Suggestions', url: '/dashboard/boss/vala/features', icon: Star },
  
  // Server & Infra
  { title: 'Server Health', url: '/dashboard/boss/vala/servers', icon: Server },
  { title: 'Backup Status', url: '/dashboard/boss/vala/backups', icon: Shield },
  
  // Support Team (AI)
  { title: 'Issue Intake', url: '/dashboard/boss/vala/issues', icon: Ticket },
  { title: 'Auto Resolution', url: '/dashboard/boss/vala/resolution', icon: CheckCircle },
  { title: 'Silent Fix Log', url: '/dashboard/boss/vala/silent-fixes', icon: FileText },
  
  // Security & Audit
  { title: 'Threat Monitor', url: '/dashboard/boss/vala/threats', icon: Shield },
  { title: 'Access Violations', url: '/dashboard/boss/vala/violations', icon: Lock },
  { title: 'Audit Logs', url: '/dashboard/boss/vala/audit', icon: FileText },
  
  // AI/API Manager
  { title: 'AI Models', url: '/dashboard/boss/vala/models', icon: Brain },
  { title: 'API Usage', url: '/dashboard/boss/vala/api-usage', icon: BarChart3 },
  { title: 'Key Health', url: '/dashboard/boss/vala/keys', icon: Key },
  
  // Fail-Safe Governance
  { title: 'Emergency Lock', url: '/dashboard/boss/vala/emergency', icon: Lock },
  { title: 'Rollback Authority', url: '/dashboard/boss/vala/rollback', icon: RotateCcw },
  { title: 'Hard Stop Rules', url: '/dashboard/boss/vala/hard-stop', icon: ShieldCheck },
  
  // Bottom Section
  { title: 'System Logs', url: '/dashboard/boss/vala/logs', icon: FileText },
  { title: 'Activity Timeline', url: '/dashboard/boss/vala/timeline', icon: Clock },
];

const bossAiCeoItems: NavItem[] = [
  { title: 'AI CEO Dashboard', url: '/dashboard/boss/ai-ceo', icon: Brain },
  { title: 'System Monitor', url: '/dashboard/boss/ai-ceo/monitor', icon: Activity },
  { title: 'Business Intel', url: '/dashboard/boss/ai-ceo/business', icon: TrendingUp },
  { title: 'Risk Detection', url: '/dashboard/boss/ai-ceo/risks', icon: AlertTriangle },
  { title: 'Suggestions', url: '/dashboard/boss/ai-ceo/suggestions', icon: Sparkles },
  { title: 'Predictions', url: '/dashboard/boss/ai-ceo/predictions', icon: Eye },
  { title: 'Decision Log', url: '/dashboard/boss/ai-ceo/decisions', icon: FileText },
];

const bossAiapiItems: NavItem[] = [
  { title: 'AI/API Dashboard', url: '/dashboard/boss/aiapi', icon: Sparkles },
  { title: 'AI Services', url: '/dashboard/boss/aiapi/ai-services', icon: Brain },
  { title: 'API Providers', url: '/dashboard/boss/aiapi/api-providers', icon: Globe },
  { title: 'Auto Recovery', url: '/dashboard/boss/aiapi/auto-recovery', icon: RotateCcw },
  { title: 'Incident Prediction', url: '/dashboard/boss/aiapi/incident-prediction', icon: AlertTriangle },
  { title: 'Cost Optimizer', url: '/dashboard/boss/aiapi/cost-optimizer', icon: DollarSign },
  { title: 'API Registry', url: '/dashboard/boss/aiapi/api-registry', icon: Layers },
  { title: 'Fallback Rules', url: '/dashboard/boss/aiapi/fallback-rules', icon: Shield },
  { title: 'Usage Logs', url: '/dashboard/boss/aiapi/logs', icon: FileText },
  { title: 'AI Decisions', url: '/dashboard/boss/aiapi/decisions', icon: CheckCircle },
];

const bossGovernanceItems: NavItem[] = [
  { title: 'Inactivity Control', url: '/dashboard/boss/governance/inactivity', icon: Clock },
  { title: 'Reputation Protection', url: '/dashboard/boss/governance/reputation', icon: Shield },
  { title: 'System Takeover', url: '/dashboard/boss/governance/takeover', icon: Lock },
  { title: 'AI Failsafe', url: '/dashboard/boss/governance/ai-failsafe', icon: AlertTriangle },
  { title: 'Zero Blame Logs', url: '/dashboard/boss/governance/zero-blame', icon: FileText },
  { title: 'Boss Override', url: '/dashboard/boss/governance/override', icon: ShieldCheck },
];

const bossApprovalsItems: NavItem[] = [
  { title: 'Approval Dashboard', url: '/dashboard/boss/approvals', icon: CheckCircle },
  { title: 'Pending Approvals', url: '/dashboard/boss/approvals/pending', icon: Clock },
  { title: 'High Risk', url: '/dashboard/boss/approvals/high-risk', icon: AlertTriangle },
  { title: 'AI Approvals', url: '/dashboard/boss/approvals/ai', icon: Brain },
  { title: 'Payment Approvals', url: '/dashboard/boss/approvals/payment', icon: DollarSign },
  { title: 'Access Approvals', url: '/dashboard/boss/approvals/access', icon: Shield },
  { title: 'History', url: '/dashboard/boss/approvals/history', icon: FileText },
];

const bossRolesItems: NavItem[] = [
  { title: 'Role Registry', url: '/dashboard/boss/roles', icon: ShieldCheck },
  { title: 'Permission Matrix', url: '/dashboard/boss/roles/matrix', icon: Layers },
  { title: 'Role Assignment', url: '/dashboard/boss/roles/assignment', icon: Users },
  { title: 'Temp Access', url: '/dashboard/boss/roles/temp-access', icon: Clock },
  { title: 'Privilege Escalation', url: '/dashboard/boss/roles/escalation', icon: TrendingUp },
  { title: 'Violations', url: '/dashboard/boss/roles/violations', icon: AlertTriangle },
  { title: 'Audit Log', url: '/dashboard/boss/roles/audit', icon: FileText },
];

const bossFranchiseItems: NavItem[] = [
  { title: 'Franchise Registry', url: '/dashboard/boss/franchise', icon: Building },
  { title: 'Onboarding', url: '/dashboard/boss/franchise/onboarding', icon: UserPlus },
  { title: 'Territory Map', url: '/dashboard/boss/franchise/territories', icon: MapPin },
  { title: 'Plans', url: '/dashboard/boss/franchise/plans', icon: CreditCard },
  { title: 'Performance', url: '/dashboard/boss/franchise/performance', icon: BarChart3 },
  { title: 'Wallet', url: '/dashboard/boss/franchise/wallet', icon: Wallet },
  { title: 'Violations', url: '/dashboard/boss/franchise/violations', icon: AlertTriangle },
  { title: 'Audit Log', url: '/dashboard/boss/franchise/audit', icon: FileText },
];

const bossResellerItems: NavItem[] = [
  { title: 'Reseller Dashboard', url: '/dashboard/boss/reseller', icon: Users },
  { title: 'Reseller List', url: '/dashboard/boss/reseller/list', icon: Users },
  { title: 'Add Reseller', url: '/dashboard/boss/reseller/add', icon: UserPlus },
  { title: 'Scopes', url: '/dashboard/boss/reseller/scopes', icon: Shield },
  { title: 'Wallets', url: '/dashboard/boss/reseller/wallets', icon: Wallet },
  { title: 'Performance', url: '/dashboard/boss/reseller/performance', icon: BarChart3 },
  { title: 'Violations', url: '/dashboard/boss/reseller/violations', icon: AlertTriangle },
  { title: 'Plans', url: '/dashboard/boss/reseller/plans', icon: CreditCard },
];

const bossDevManagerItems: NavItem[] = [
  { title: 'Dev Dashboard', url: '/dashboard/boss/devmanager', icon: Code2 },
  { title: 'Developers', url: '/dashboard/boss/devmanager/developers', icon: Users },
  { title: 'Projects', url: '/dashboard/boss/devmanager/projects', icon: FolderOpen },
  { title: 'Tasks', url: '/dashboard/boss/devmanager/tasks', icon: ListTodo },
  { title: 'Bugs', url: '/dashboard/boss/devmanager/bugs', icon: Bug },
  { title: 'Builds', url: '/dashboard/boss/devmanager/builds', icon: Hammer },
  { title: 'QA Tests', url: '/dashboard/boss/devmanager/qa', icon: TestTube },
  { title: 'Milestones', url: '/dashboard/boss/devmanager/milestones', icon: Target },
  { title: 'Pull Requests', url: '/dashboard/boss/devmanager/pull-requests', icon: GitPullRequest },
  { title: 'Code Reviews', url: '/dashboard/boss/devmanager/code-reviews', icon: FileCheck },
  { title: 'Access Expiry', url: '/dashboard/boss/devmanager/access-expiry', icon: Clock },
  { title: 'Blocked Tasks', url: '/dashboard/boss/devmanager/blocked-tasks', icon: AlertTriangle },
];

const bossFinanceItems: NavItem[] = [
  { title: 'Finance Dashboard', url: '/dashboard/boss/finance', icon: DollarSign },
  { title: 'Wallets', url: '/dashboard/boss/finance/wallets', icon: Wallet },
  { title: 'Invoices', url: '/dashboard/boss/finance/invoices', icon: FileText },
  { title: 'Subscriptions', url: '/dashboard/boss/finance/subscriptions', icon: CreditCard },
  { title: 'Plans', url: '/dashboard/boss/finance/plans', icon: CreditCard },
  { title: 'Payouts', url: '/dashboard/boss/finance/payouts', icon: Wallet },
  { title: 'Cost Analysis', url: '/dashboard/boss/finance/costs', icon: BarChart3 },
];

const bossMarketingItems: NavItem[] = [
  { title: 'Marketing Dashboard', url: '/dashboard/boss/marketing', icon: Megaphone },
  { title: 'AI SEO Engine', url: '/dashboard/boss/marketing/ai-seo', icon: Brain },
  { title: 'AI Lead Engine', url: '/dashboard/boss/marketing/ai-leads', icon: Users },
  { title: 'AI Sales Bot', url: '/dashboard/boss/marketing/ai-sales-bot', icon: Bot },
  { title: 'Campaigns', url: '/dashboard/boss/marketing/campaigns', icon: Target },
  { title: 'Content', url: '/dashboard/boss/marketing/content', icon: FileText },
  { title: 'SEO', url: '/dashboard/boss/marketing/seo', icon: Search },
  { title: 'Lead Sources', url: '/dashboard/boss/marketing/lead-sources', icon: Target },
  { title: 'AI Tools', url: '/dashboard/boss/marketing/ai-tools', icon: Sparkles },
  { title: 'Analytics', url: '/dashboard/boss/marketing/analytics', icon: BarChart3 },
];

const bossSupportItems: NavItem[] = [
  { title: 'Support Dashboard', url: '/dashboard/boss/support', icon: Headphones },
  { title: 'Tickets', url: '/dashboard/boss/support/tickets', icon: Ticket },
  { title: 'Assist Sessions', url: '/dashboard/boss/support/assist', icon: Headphones },
  { title: 'SLA Management', url: '/dashboard/boss/support/sla', icon: Clock },
  { title: 'Promise Tracker', url: '/dashboard/boss/support/promises', icon: CheckCircle },
  { title: 'Feedback', url: '/dashboard/boss/support/feedback', icon: MessageSquare },
];

const bossProductItems: NavItem[] = [
  { title: 'Product Dashboard', url: '/dashboard/boss/product', icon: Package },
  { title: 'Products', url: '/dashboard/boss/product/products', icon: Package },
  { title: 'Categories', url: '/dashboard/boss/product/categories', icon: Layers },
  { title: 'Features', url: '/dashboard/boss/product/features', icon: Star },
  { title: 'Plan Mapping', url: '/dashboard/boss/product/pricing/mapping', icon: CreditCard },
  { title: 'Visibility Rules', url: '/dashboard/boss/product/pricing/visibility', icon: Eye },
];

const bossHrItems: NavItem[] = [
  { title: 'HR Dashboard', url: '/dashboard/boss/hr', icon: Users },
  { title: 'Employees', url: '/dashboard/boss/hr/employees', icon: Users },
  { title: 'Job Posts', url: '/dashboard/boss/hr/jobs', icon: Briefcase },
  { title: 'Applications', url: '/dashboard/boss/hr/applications', icon: UserPlus },
  { title: 'Attendance', url: '/dashboard/boss/hr/attendance', icon: ClipboardCheck },
  { title: 'Leave Management', url: '/dashboard/boss/hr/leave', icon: Calendar },
  { title: 'Salary Summary', url: '/dashboard/boss/hr/salary', icon: DollarSign },
  { title: 'Payslips', url: '/dashboard/boss/hr/payslips', icon: FileText },
  { title: 'Reviews', url: '/dashboard/boss/hr/reviews', icon: Star },
  { title: 'Goals', url: '/dashboard/boss/hr/goals', icon: Target },
  { title: 'Exits', url: '/dashboard/boss/hr/exits', icon: LogOut },
  { title: 'Documents', url: '/dashboard/boss/hr/documents', icon: FileText },
];

const bossSecurityItems: NavItem[] = [
  { title: 'Security Alerts', url: '/dashboard/boss/security', icon: Shield },
  { title: 'Audit Logs', url: '/dashboard/boss/audit', icon: FileText },
  { title: 'Session Control', url: '/dashboard/boss/session', icon: Lock },
  { title: 'Threat Monitor', url: '/dashboard/boss/threat', icon: AlertTriangle },
  { title: 'Device Trust', url: '/dashboard/boss/device', icon: Shield },
  { title: 'IP Blocklist', url: '/dashboard/boss/ip-blocklist', icon: Lock },
];

// ============= BOSS SUB-NAV MAPPING =============
const bossSubnav: Partial<Record<BossModuleKey, NavItem[]>> = {
  vala: bossValaItems,
  development: bossDevelopmentItems,
  server: bossServerItems,
  'ai-ceo': bossAiCeoItems,
  aiapi: bossAiapiItems,
  governance: bossGovernanceItems,
  approvals: bossApprovalsItems,
  roles: bossRolesItems,
  franchise: bossFranchiseItems,
  reseller: bossResellerItems,
  devmanager: bossDevManagerItems,
  finance: bossFinanceItems,
  marketing: bossMarketingItems,
  support: bossSupportItems,
  product: bossProductItems,
  hr: bossHrItems,
  security: bossSecurityItems,
};

// Navigation items for each role (portals/managers)
const franchiseItems: NavItem[] = [
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

const resellerItems: NavItem[] = [
  { title: 'Dashboard', url: '/portal/reseller', icon: Home },
  { title: 'Assigned Leads', url: '/portal/reseller/leads', icon: Target },
  { title: 'Follow-ups', url: '/portal/reseller/followups', icon: Calendar },
  { title: 'Daily Targets', url: '/portal/reseller/targets', icon: TrendingUp },
  { title: 'Penalties', url: '/portal/reseller/penalties', icon: AlertTriangle },
  { title: 'Wallet', url: '/portal/reseller/wallet', icon: Wallet },
  { title: 'Rank Board', url: '/portal/reseller/leaderboard', icon: Award },
  { title: 'Profile', url: '/portal/reseller/profile', icon: UserCircle },
];

const developerItems: NavItem[] = [
  { title: 'Dashboard', url: '/portal/developer', icon: Home },
  { title: 'Active Tasks', url: '/portal/developer/tasks', icon: ListTodo },
  { title: 'Projects', url: '/portal/developer/projects', icon: FolderOpen },
  { title: 'Bug Assignment', url: '/portal/developer/bugs', icon: Bug },
  { title: 'Code Reviews', url: '/portal/developer/reviews', icon: GitPullRequest },
  { title: 'Sprint Board', url: '/portal/developer/sprint', icon: Kanban },
  { title: 'Time Tracking', url: '/portal/developer/time', icon: Clock },
  { title: 'Work Log', url: '/portal/developer/worklog', icon: FileText },
  { title: 'Productivity', url: '/portal/developer/productivity', icon: TrendingUp },
  { title: 'Build Status', url: '/portal/developer/builds', icon: Hammer },
  { title: 'CI/CD Pipeline', url: '/portal/developer/pipeline', icon: Workflow },
  { title: 'Releases', url: '/portal/developer/releases', icon: Rocket },
  { title: 'Rollback History', url: '/portal/developer/rollback', icon: RotateCcw },
  { title: 'QA & Tests', url: '/portal/developer/qa', icon: TestTube },
  { title: 'Internal Chat', url: '/portal/developer/chat', icon: MessageSquare },
  { title: 'Task Comments', url: '/portal/developer/comments', icon: MessageCircle },
  { title: 'Announcements', url: '/portal/developer/announcements', icon: Megaphone },
  { title: 'NDA Status', url: '/portal/developer/nda', icon: FileCheck },
  { title: 'Access Scope', url: '/portal/developer/access', icon: Shield },
  { title: 'Activity Log', url: '/portal/developer/activity', icon: Activity },
  { title: 'Profile', url: '/portal/developer/profile', icon: UserCircle },
];

const influencerItems: NavItem[] = [
  { title: 'Dashboard', url: '/portal/influencer', icon: Home },
  { title: 'Campaigns', url: '/portal/influencer/campaigns', icon: Megaphone },
  { title: 'Link Generator', url: '/portal/influencer/links', icon: Link },
  { title: 'Content Status', url: '/portal/influencer/content', icon: FileText },
  { title: 'Bonus Eligibility', url: '/portal/influencer/bonus', icon: Award },
  { title: 'Payouts', url: '/portal/influencer/payouts', icon: Wallet },
  { title: 'Profile', url: '/portal/influencer/profile', icon: UserCircle },
];

const productItems: NavItem[] = [
  { title: 'Dashboard', url: '/manager/product', icon: Home },
  { title: 'Product List', url: '/manager/product/products', icon: Package },
  { title: 'Categories', url: '/manager/product/categories', icon: Layers },
  { title: 'Features', url: '/manager/product/features', icon: Star },
  { title: 'Plan Mapping', url: '/manager/product/pricing', icon: CreditCard },
  { title: 'Status Control', url: '/manager/product/status', icon: Eye },
  { title: 'Version Info', url: '/manager/product/versions', icon: FileText },
];

const demoItems: NavItem[] = [
  { title: 'Dashboard', url: '/manager/demo', icon: Home },
  { title: 'Demo List', url: '/manager/demo/demos', icon: Play },
  { title: 'Demo URLs', url: '/manager/demo/urls', icon: Link },
  { title: 'Access Rules', url: '/manager/demo/access', icon: Shield },
  { title: 'Conversion', url: '/manager/demo/conversion', icon: TrendingUp },
  { title: 'Expiry Control', url: '/manager/demo/expiry', icon: Clock },
  { title: 'Copy Protection', url: '/manager/demo/security', icon: Shield },
];

const seoItems: NavItem[] = [
  { title: 'Dashboard', url: '/manager/seo', icon: Home },
  { title: 'AI Content', url: '/manager/seo/content', icon: Zap },
  { title: 'Page Optimization', url: '/manager/seo/pages', icon: FileText },
  { title: 'Keywords', url: '/manager/seo/keywords', icon: Search },
  { title: 'Country SEO', url: '/manager/seo/regions', icon: Globe },
  { title: 'Traffic', url: '/manager/seo/traffic', icon: BarChart3 },
  { title: 'Rankings', url: '/manager/seo/rankings', icon: TrendingUp },
];

const hrItems: NavItem[] = [
  { title: 'Dashboard', url: '/manager/hr', icon: Home },
  { title: 'Job Posts', url: '/manager/hr/jobs', icon: Briefcase },
  { title: 'Applications', url: '/manager/hr/applications', icon: UserPlus },
  { title: 'Interviews', url: '/manager/hr/interviews', icon: Calendar },
  { title: 'Employees', url: '/manager/hr/employees', icon: Users },
  { title: 'Attendance', url: '/manager/hr/attendance', icon: ClipboardCheck },
  { title: 'Policies', url: '/manager/hr/policies', icon: FileText },
];

const salesItems: NavItem[] = [
  { title: 'Dashboard', url: '/manager/sales', icon: Home },
  { title: 'Sales Leads', url: '/manager/sales/leads', icon: Target },
  { title: 'Pipeline', url: '/manager/sales/pipeline', icon: TrendingUp },
  { title: 'Follow-ups', url: '/manager/sales/followups', icon: Calendar },
  { title: 'Active Deals', url: '/manager/sales/deals', icon: Handshake },
  { title: 'Closed Deals', url: '/manager/sales/closed', icon: CheckCircle },
  { title: 'Targets', url: '/manager/sales/targets', icon: Award },
];

const supportItems: NavItem[] = [
  { title: 'Dashboard', url: '/manager/support', icon: Home },
  { title: 'Open Tickets', url: '/manager/support/tickets', icon: Ticket },
  { title: 'Priority Queue', url: '/manager/support/priority', icon: AlertTriangle },
  { title: 'SLA Timers', url: '/manager/support/sla', icon: Clock },
  { title: 'Assist Sessions', url: '/manager/support/assist', icon: Headphones },
  { title: 'Resolution Logs', url: '/manager/support/logs', icon: FileText },
  { title: 'Feedback', url: '/manager/support/feedback', icon: MessageSquare },
];

const getItemsForRole = (role: AllRoleTypes): NavItem[] => {
  switch (role) {
    case 'franchise':
      return franchiseItems;
    case 'reseller':
      return resellerItems;
    case 'developer':
      return developerItems;
    case 'influencer':
      return influencerItems;
    case 'product':
      return productItems;
    case 'demo':
      return demoItems;
    case 'seo':
      return seoItems;
    case 'hr':
      return hrItems;
    case 'sales':
      return salesItems;
    case 'support':
      return supportItems;
    default:
      return franchiseItems;
  }
};

function getBossModule(pathname: string): { key: BossModuleKey | null; title: string | null } {
  // Exact home
  if (pathname === '/dashboard/boss') {
    return { key: null, title: null };
  }

  const found = bossModules.find((m) => m.base !== '/dashboard/boss' && pathname.startsWith(m.base));
  if (!found) {
    return { key: null, title: null };
  }

  return { key: found.key, title: found.title };
}

export function UltraLuxurySidebar({ role }: UltraLuxurySidebarProps) {
  const [pinnedExpanded, setPinnedExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const expanded = pinnedExpanded || hovered;

  const location = useLocation();
  const navigate = useNavigate();

  const bossContext = useMemo(() => getBossModule(location.pathname), [location.pathname]);

  const { items, showBack, sectionTitle } = useMemo(() => {
    if (role !== 'boss') {
      return { items: getItemsForRole(role), showBack: false, sectionTitle: null as string | null };
    }

    if (!bossContext.key) {
      return { items: bossModules, showBack: false, sectionTitle: null as string | null };
    }

    const sub = bossSubnav[bossContext.key];
    if (sub && sub.length) {
      return { items: sub, showBack: true, sectionTitle: bossContext.title };
    }

    // If we don't have sub-nav yet for this module, keep the main module list (but still show Back).
    return { items: bossModules, showBack: true, sectionTitle: bossContext.title };
  }, [role, bossContext.key, bossContext.title]);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen z-50 transition-all duration-[220ms] ease-out bg-[hsl(var(--luxury-sidebar-bg))] rounded-[var(--luxury-sidebar-radius)]',
        expanded ? 'w-[260px]' : 'w-[96px]'
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="h-full flex flex-col p-4">
        {/* Logo area - Perfect circle, no background container */}
        <div className="flex items-center justify-center h-14 mb-4">
          <SoftwareValaIcon size={expanded ? 'sidebar-expanded' : 'sidebar-collapsed'} />
          {expanded && (
            <span className="ml-3 text-[hsl(var(--luxury-icon-active))] font-semibold text-[13px] whitespace-nowrap animate-fade-in">
              Software Vala
            </span>
          )}
        </div>

        {/* Boss back button + module label */}
        {role === 'boss' && showBack && (
          <div className="mb-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/boss')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all duration-200 group',
                'hover:bg-[hsl(var(--luxury-active-bg)/0.5)]'
              )}
            >
              <ArrowLeft className="w-[22px] h-[22px] text-[hsl(var(--luxury-icon-inactive))] group-hover:text-[hsl(var(--luxury-icon-active))] transition-colors" />
              {expanded && (
                <span className="text-sm text-[hsl(var(--luxury-icon-inactive))] group-hover:text-[hsl(var(--luxury-icon-active))] whitespace-nowrap animate-fade-in">
                  Back to Boss
                </span>
              )}
            </button>

            {expanded && sectionTitle && (
              <div className="mt-2 px-3">
                <p className="text-xs uppercase tracking-wider text-[hsl(var(--luxury-icon-inactive))]">{sectionTitle}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.url === '/dashboard/boss'
                ? location.pathname === '/dashboard/boss'
                : location.pathname === item.url || location.pathname.startsWith(item.url + '/');

            return (
              <NavLink
                key={item.url}
                to={item.url}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all duration-200 group',
                  isActive
                    ? 'bg-[hsl(var(--luxury-active-bg))]'
                    : 'hover:bg-[hsl(var(--luxury-active-bg)/0.5)]'
                )}
              >
                <div className="w-[22px] h-[22px] flex items-center justify-center flex-shrink-0">
                  <Icon
                    className={cn(
                      'w-[22px] h-[22px] transition-colors',
                      isActive
                        ? 'text-[hsl(var(--luxury-icon-active))]'
                        : 'text-[hsl(var(--luxury-icon-inactive))] group-hover:text-[hsl(var(--luxury-icon-active))]'
                    )}
                  />
                </div>

                {expanded && (
                  <span
                    className={cn(
                      'text-sm whitespace-nowrap transition-colors animate-fade-in',
                      isActive
                        ? 'text-[hsl(var(--luxury-icon-active))] font-medium'
                        : 'text-[hsl(var(--luxury-icon-inactive))] group-hover:text-[hsl(var(--luxury-icon-active))]'
                    )}
                  >
                    {item.title}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer controls */}
        <div className="pt-4 border-t border-[hsl(var(--luxury-active-bg))]">
          <button
            type="button"
            onClick={() => navigate('/auth')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] w-full transition-all duration-200 hover:bg-[hsl(var(--destructive)/0.12)] group"
          >
            <LogOut className="w-[22px] h-[22px] text-[hsl(var(--luxury-icon-inactive))] group-hover:text-destructive transition-colors" />
            {expanded && (
              <span className="text-sm text-[hsl(var(--luxury-icon-inactive))] group-hover:text-destructive whitespace-nowrap animate-fade-in">
                Logout
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setPinnedExpanded((v) => !v)}
            className="mt-2 flex items-center justify-center w-full rounded-[14px] px-3 py-2.5 transition-all duration-200 hover:bg-[hsl(var(--luxury-active-bg)/0.5)]"
            aria-label={pinnedExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {pinnedExpanded ? (
              <ChevronLeft className="w-[22px] h-[22px] text-[hsl(var(--luxury-icon-inactive))]" />
            ) : (
              <ChevronRight className="w-[22px] h-[22px] text-[hsl(var(--luxury-icon-inactive))]" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

