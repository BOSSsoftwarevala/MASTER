import { useMemo, useState, useEffect, type ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Code,
  DollarSign,
  HeartHandshake,
  KeyRound,
  Megaphone,
  Package,
  Server,
  Settings,
  Snowflake,
  Store,
  Building,
  Users,
  Shield,
  Lock,
  Scale,
  Terminal,
  Clock,
  Play,
} from 'lucide-react';

type CommandStatus = 'executing' | 'completed' | 'scheduled' | 'blocked';

type Command = {
  id: string;
  text: string;
  target: string;
  status: CommandStatus;
  timestamp: string;
};

type LiveActivity = {
  liveCount: number;
  lastAction: string;
  lastActionTime: string;
  isActive: boolean;
};

type DashboardModule = {
  title: string;
  description: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  liveLabel: string;
  actionLabel: string;
};

// Read-only widgets data (mock for now)
const widgetData = {
  totalRevenue: '$125,430',
  activeServers: 24,
  activeClients: 156,
  pendingApprovals: 7,
  riskAlerts: 3,
  aiCostBurn: '$2,450',
  systemHealth: 'Healthy',
};

// Mock live activity data generator
const generateLiveActivity = (): Record<string, LiveActivity> => ({
  'Server Management': { liveCount: 24, lastAction: 'Health check passed', lastActionTime: '8 sec ago', isActive: true },
  'Development Control': { liveCount: 5, lastAction: 'Build completed', lastActionTime: '23 sec ago', isActive: true },
  'Approval Center': { liveCount: 7, lastAction: 'Request approved', lastActionTime: '1 min ago', isActive: true },
  'Role & Permission': { liveCount: 2, lastAction: 'Role updated', lastActionTime: '5 min ago', isActive: false },
  'Franchise Management': { liveCount: 12, lastAction: 'Performance synced', lastActionTime: '45 sec ago', isActive: true },
  'Reseller Management': { liveCount: 8, lastAction: 'Commission calculated', lastActionTime: '2 min ago', isActive: false },
  'Developer Management': { liveCount: 15, lastAction: 'Task assigned', lastActionTime: '15 sec ago', isActive: true },
  'Finance & Wallet': { liveCount: 3, lastAction: 'Payout processed', lastActionTime: '3 min ago', isActive: false },
  'Marketing': { liveCount: 4, lastAction: 'Campaign launched', lastActionTime: '30 sec ago', isActive: true },
  'Support & Assist': { liveCount: 9, lastAction: 'Ticket replied', lastActionTime: '12 sec ago', isActive: true },
  'Product & Demo': { liveCount: 6, lastAction: 'Demo opened', lastActionTime: '18 sec ago', isActive: true },
  'HR Management': { liveCount: 28, lastAction: 'Attendance update', lastActionTime: '5 sec ago', isActive: true },
  'Legal & Compliance': { liveCount: 1, lastAction: 'Document approved', lastActionTime: '10 min ago', isActive: false },
  'Black Box (Vault)': { liveCount: 2, lastAction: 'Vault access logged', lastActionTime: '1 min ago', isActive: true },
  'Settings': { liveCount: 0, lastAction: 'Config saved', lastActionTime: '2 hr ago', isActive: false },
  'System Freeze': { liveCount: 0, lastAction: 'Status check', lastActionTime: '5 min ago', isActive: false },
  'Access Override': { liveCount: 1, lastAction: 'Access granted', lastActionTime: '15 min ago', isActive: false },
});

export default function BossOverviewPage() {
  const navigate = useNavigate();
  const { loading: rolesLoading } = useUserRoles();
  const [liveData, setLiveData] = useState<Record<string, LiveActivity>>(generateLiveActivity);

  // Silent refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(generateLiveActivity());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // All modules - visible from Boss Dashboard
  const allModules = useMemo<DashboardModule[]>(
    () => [
      {
        title: 'Server Management',
        description: 'Infrastructure, monitoring, scaling, security',
        href: '/dashboard/boss/server',
        icon: Server,
        liveLabel: 'Active servers',
        actionLabel: 'Health check',
      },
      {
        title: 'Development Control',
        description: 'Pipelines, test gates, deployments, rollbacks',
        href: '/dashboard/boss/development',
        icon: Activity,
        liveLabel: 'Active builds',
        actionLabel: 'Build status',
      },
      {
        title: 'Approval Center',
        description: 'Review and approve high-risk actions',
        href: '/dashboard/boss/approvals',
        icon: CheckCircle,
        liveLabel: 'Pending requests',
        actionLabel: 'Request action',
      },
      {
        title: 'Role & Permission',
        description: 'Access control, role registry, violations',
        href: '/dashboard/boss/roles',
        icon: Shield,
        liveLabel: 'Active sessions',
        actionLabel: 'Role change',
      },
      {
        title: 'Franchise Management',
        description: 'Registry, territories, performance',
        href: '/dashboard/boss/franchise',
        icon: Building,
        liveLabel: 'Active franchises',
        actionLabel: 'Performance sync',
      },
      {
        title: 'Reseller Management',
        description: 'Resellers, scopes, wallets, violations',
        href: '/dashboard/boss/reseller',
        icon: Store,
        liveLabel: 'Active resellers',
        actionLabel: 'Commission calc',
      },
      {
        title: 'Developer Management',
        description: 'Developers, projects, tasks, builds, QA',
        href: '/dashboard/boss/devmanager',
        icon: Code,
        liveLabel: 'Active devs',
        actionLabel: 'Task update',
      },
      {
        title: 'Finance & Wallet',
        description: 'Wallets, invoices, plans, payouts',
        href: '/dashboard/boss/finance',
        icon: DollarSign,
        liveLabel: 'Pending payouts',
        actionLabel: 'Transaction',
      },
      {
        title: 'Marketing',
        description: 'Campaigns, content, SEO, analytics',
        href: '/dashboard/boss/marketing',
        icon: Megaphone,
        liveLabel: 'Active campaigns',
        actionLabel: 'Campaign update',
      },
      {
        title: 'Support & Assist',
        description: 'Tickets, assist sessions, SLAs, feedback',
        href: '/dashboard/boss/support',
        icon: HeartHandshake,
        liveLabel: 'Open tickets',
        actionLabel: 'Ticket replied',
      },
      {
        title: 'Product & Demo',
        description: 'Products, categories, demos, conversions',
        href: '/dashboard/boss/product',
        icon: Package,
        liveLabel: 'Demo views',
        actionLabel: 'Demo opened',
      },
      {
        title: 'HR Management',
        description: 'Employees, attendance, payroll, reviews',
        href: '/dashboard/boss/hr',
        icon: Users,
        liveLabel: 'Active staff',
        actionLabel: 'Attendance update',
      },
      {
        title: 'Legal & Compliance',
        description: 'Legal documents and compliance status',
        href: '/dashboard/boss/legal',
        icon: Scale,
        liveLabel: 'Active reviews',
        actionLabel: 'Document action',
      },
      {
        title: 'Black Box (Vault)',
        description: 'Ultra-secure system vault',
        href: '/dashboard/boss/blackbox',
        icon: Lock,
        liveLabel: 'Secure access',
        actionLabel: 'Vault access logged',
      },
      {
        title: 'Settings',
        description: 'Panel configuration and preferences',
        href: '/dashboard/boss/settings',
        icon: Settings,
        liveLabel: 'Config changes',
        actionLabel: 'Config saved',
      },
    ],
    []
  );

  // Emergency controls
  const emergencyControls = useMemo<DashboardModule[]>(
    () => [
      {
        title: 'System Freeze',
        description: 'Emergency pause controls',
        href: '/dashboard/boss/freeze',
        icon: Snowflake,
        liveLabel: 'Freeze status',
        actionLabel: 'Status check',
      },
      {
        title: 'Access Override',
        description: 'Grant emergency access',
        href: '/dashboard/boss/access',
        icon: KeyRound,
        liveLabel: 'Override requests',
        actionLabel: 'Access granted',
      },
    ],
    []
  );

  const LiveActivityStrip = ({ title }: { title: string }) => {
    const activity = liveData[title];
    if (!activity) return null;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-3 pt-3 border-t border-[hsl(var(--boss-border)/0.5)] text-[10px] text-[hsl(var(--boss-text-muted))] space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span 
                  className={`w-1.5 h-1.5 rounded-full ${activity.isActive ? 'bg-emerald-500' : 'bg-[hsl(var(--boss-text-muted))]'}`} 
                />
                <span>Live now: {activity.liveCount}</span>
              </div>
              <div className="truncate">Last update: {activity.lastActionTime}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-secondary))]">
            <p>Live system activity (auto-updated)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Real-Time Command Center Component
  const RealTimeCommandCenter = () => {
    const [commandInput, setCommandInput] = useState('');
    const [commands, setCommands] = useState<Command[]>([
      { id: '1', text: 'Refresh all server metrics', target: 'System', status: 'completed', timestamp: '45 sec ago' },
      { id: '2', text: 'Pause marketing campaigns', target: 'Marketing', status: 'executing', timestamp: '12 sec ago' },
      { id: '3', text: 'Force sync finance data', target: 'Finance', status: 'scheduled', timestamp: '2 min ago' },
      { id: '4', text: 'Lock developer access', target: 'Security', status: 'blocked', timestamp: '5 min ago' },
      { id: '5', text: 'Restart API gateway', target: 'System', status: 'completed', timestamp: '8 min ago' },
    ]);

    const handleExecute = () => {
      if (!commandInput.trim()) return;
      const newCommand: Command = {
        id: Date.now().toString(),
        text: commandInput,
        target: 'System',
        status: 'executing',
        timestamp: 'Just now',
      };
      setCommands((prev) => [newCommand, ...prev]);
      setCommandInput('');
    };

    const handleSchedule = () => {
      if (!commandInput.trim()) return;
      const newCommand: Command = {
        id: Date.now().toString(),
        text: commandInput,
        target: 'System',
        status: 'scheduled',
        timestamp: 'Just now',
      };
      setCommands((prev) => [newCommand, ...prev]);
      setCommandInput('');
    };

    const getStatusBadge = (status: CommandStatus) => {
      const styles: Record<CommandStatus, string> = {
        executing: 'bg-[hsl(var(--boss-accent-blue)/0.15)] text-[hsl(var(--boss-accent-blue))] border-[hsl(var(--boss-accent-blue)/0.3)]',
        completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        blocked: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        scheduled: 'bg-[hsl(var(--boss-text-muted)/0.15)] text-[hsl(var(--boss-text-muted))] border-[hsl(var(--boss-border))]',
      };
      return (
        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${styles[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    };

    return (
      <section aria-label="Real-Time Command Center" className="space-y-4">
        <h2 className="text-lg font-semibold text-[hsl(var(--boss-text-primary))] flex items-center gap-2">
          <Terminal className="h-5 w-5 text-[hsl(var(--boss-accent-blue))]" />
          Real-Time Command Center
        </h2>
        <p className="text-xs text-[hsl(var(--boss-text-muted))] -mt-2">Live system control & execution feed</p>

        <div className="bg-[hsl(var(--boss-card))] rounded-xl border border-[hsl(var(--boss-border))] overflow-hidden shadow-lg">
          {/* Command Input */}
          <div className="p-4 border-b border-[hsl(var(--boss-border))]">
            <div className="flex gap-2">
              <Input
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Type command or instruction…"
                className="flex-1 bg-[hsl(var(--boss-canvas))] border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-primary))] placeholder:text-[hsl(var(--boss-text-muted))]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleExecute();
                }}
              />
              <Button
                onClick={handleExecute}
                size="sm"
                className="bg-[hsl(var(--boss-accent-blue))] hover:bg-[hsl(var(--boss-accent-blue)/0.9)] text-white"
              >
                <Play className="h-3.5 w-3.5 mr-1" />
                Execute
              </Button>
              <Button
                onClick={handleSchedule}
                size="sm"
                variant="outline"
                className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-secondary))] hover:bg-[hsl(var(--boss-border)/0.3)]"
              >
                <Clock className="h-3.5 w-3.5 mr-1" />
                Schedule
              </Button>
            </div>
          </div>

          {/* Command Feed */}
          <ScrollArea className="h-[240px]">
            <div className="p-2 space-y-1">
              {commands.map((cmd) => (
                <div
                  key={cmd.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[hsl(var(--boss-border)/0.2)] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[hsl(var(--boss-text-primary))] truncate">{cmd.text}</p>
                    <p className="text-[10px] text-[hsl(var(--boss-text-muted))]">
                      <span className="text-[hsl(var(--boss-text-secondary))]">Boss</span> → {cmd.target}
                    </p>
                  </div>
                  {getStatusBadge(cmd.status)}
                  <span className="text-[10px] text-[hsl(var(--boss-text-muted))] whitespace-nowrap">{cmd.timestamp}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </section>
    );
  };

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-[hsl(var(--boss-canvas))] -m-6 p-6">
        <div className="max-w-[1600px] mx-auto space-y-8">
          {/* Header */}
          <header className="space-y-2">
            <h1 className="text-3xl font-bold text-[hsl(var(--boss-text-primary))]">Boss Dashboard</h1>
            <p className="text-[hsl(var(--boss-text-secondary))]">
              One dashboard. One authority. All access.
            </p>
          </header>

          {/* Read-Only Widgets */}
          <section aria-label="System Overview" className="space-y-4">
            <h2 className="text-lg font-semibold text-[hsl(var(--boss-text-primary))] flex items-center gap-2">
              <Activity className="h-5 w-5 text-[hsl(var(--boss-accent-blue))]" />
              System Overview
              <span className="text-xs text-[hsl(var(--boss-text-muted))] font-normal">(Read-only)</span>
            </h2>

            {rolesLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="bg-[hsl(var(--boss-card))] rounded-xl p-4 border border-[hsl(var(--boss-border))]">
                    <Skeleton className="h-4 w-20 mb-2 bg-[hsl(var(--boss-border))]" />
                    <Skeleton className="h-6 w-16 bg-[hsl(var(--boss-border))]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                <div className="bg-[hsl(var(--boss-card))] rounded-xl p-4 border border-[hsl(var(--boss-border))] hover:border-[hsl(var(--boss-accent-blue)/0.3)] transition-all shadow-lg">
                  <p className="text-xs text-[hsl(var(--boss-text-muted))]">Total Revenue</p>
                  <p className="text-lg font-bold text-emerald-400">{widgetData.totalRevenue}</p>
                </div>
                <div className="bg-[hsl(var(--boss-card))] rounded-xl p-4 border border-[hsl(var(--boss-border))] hover:border-[hsl(var(--boss-accent-blue)/0.3)] transition-all shadow-lg">
                  <p className="text-xs text-[hsl(var(--boss-text-muted))]">Active Servers</p>
                  <p className="text-lg font-bold text-[hsl(var(--boss-accent-blue))]">{widgetData.activeServers}</p>
                </div>
                <div className="bg-[hsl(var(--boss-card))] rounded-xl p-4 border border-[hsl(var(--boss-border))] hover:border-[hsl(var(--boss-accent-blue)/0.3)] transition-all shadow-lg">
                  <p className="text-xs text-[hsl(var(--boss-text-muted))]">Active Clients</p>
                  <p className="text-lg font-bold text-[hsl(var(--boss-accent-blue))]">{widgetData.activeClients}</p>
                </div>
                <div className="bg-[hsl(var(--boss-card))] rounded-xl p-4 border border-[hsl(var(--boss-border))] hover:border-[hsl(var(--boss-accent-blue)/0.3)] transition-all shadow-lg">
                  <p className="text-xs text-[hsl(var(--boss-text-muted))]">Pending Approvals</p>
                  <p className="text-lg font-bold text-amber-400">{widgetData.pendingApprovals}</p>
                </div>
                <div className="bg-[hsl(var(--boss-card))] rounded-xl p-4 border border-[hsl(var(--boss-border))] hover:border-[hsl(var(--boss-accent-blue)/0.3)] transition-all shadow-lg">
                  <p className="text-xs text-[hsl(var(--boss-text-muted))]">Risk Alerts</p>
                  <p className="text-lg font-bold text-red-400">{widgetData.riskAlerts}</p>
                </div>
                <div className="bg-[hsl(var(--boss-card))] rounded-xl p-4 border border-[hsl(var(--boss-border))] hover:border-[hsl(var(--boss-accent-blue)/0.3)] transition-all shadow-lg">
                  <p className="text-xs text-[hsl(var(--boss-text-muted))]">AI Cost Burn</p>
                  <p className="text-lg font-bold text-purple-400">{widgetData.aiCostBurn}</p>
                </div>
                <div className="bg-[hsl(var(--boss-card))] rounded-xl p-4 border border-[hsl(var(--boss-border))] hover:border-[hsl(var(--boss-accent-blue)/0.3)] transition-all shadow-lg">
                  <p className="text-xs text-[hsl(var(--boss-text-muted))]">System Health</p>
                  <p className="text-lg font-bold text-emerald-400">{widgetData.systemHealth}</p>
                </div>
              </div>
            )}
          </section>

          {/* Emergency Controls + Real-Time Command Center */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Emergency Controls */}
            <section aria-label="Emergency Controls" className="space-y-4">
              <h2 className="text-lg font-semibold text-[hsl(var(--boss-text-primary))] flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                Emergency Controls
              </h2>

              <div className="grid gap-4">
                {emergencyControls.map((m) => (
                  <div
                    key={m.href}
                    role="button"
                    tabIndex={0}
                    className="bg-[hsl(var(--boss-card))] rounded-xl p-5 border border-[hsl(var(--boss-border))] cursor-pointer transition-all hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/5 group"
                    onClick={() => navigate(m.href)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') navigate(m.href);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                        <m.icon className="h-6 w-6 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[hsl(var(--boss-text-primary))]">{m.title}</h3>
                        <p className="text-sm text-[hsl(var(--boss-text-secondary))]">{m.description}</p>
                      </div>
                    </div>
                    <LiveActivityStrip title={m.title} />
                  </div>
                ))}
              </div>
            </section>

            {/* Real-Time Command Center */}
            <RealTimeCommandCenter />
          </div>

          {/* All Modules */}
          <section aria-label="All Modules" className="space-y-4">
            <h2 className="text-lg font-semibold text-[hsl(var(--boss-text-primary))]">All Modules</h2>

            {rolesLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-[hsl(var(--boss-card))] rounded-xl p-5 border border-[hsl(var(--boss-border))]">
                    <Skeleton className="h-12 w-12 rounded-xl bg-[hsl(var(--boss-border))]" />
                    <Skeleton className="h-4 w-32 mt-4 bg-[hsl(var(--boss-border))]" />
                    <Skeleton className="h-3 w-full mt-2 bg-[hsl(var(--boss-border))]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {allModules.map((m) => (
                  <div
                    key={m.href}
                    role="button"
                    tabIndex={0}
                    className="bg-[hsl(var(--boss-card))] rounded-xl p-5 border border-[hsl(var(--boss-border))] cursor-pointer transition-all hover:border-[hsl(var(--boss-accent-blue)/0.4)] hover:shadow-lg hover:shadow-[hsl(var(--boss-accent-blue)/0.05)] group"
                    onClick={() => navigate(m.href)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') navigate(m.href);
                    }}
                  >
                    <div className="h-12 w-12 rounded-xl bg-[hsl(var(--boss-accent-blue)/0.1)] flex items-center justify-center mb-4 group-hover:bg-[hsl(var(--boss-accent-blue)/0.15)] transition-colors">
                      <m.icon className="h-6 w-6 text-[hsl(var(--boss-accent-blue))]" />
                    </div>
                    <h3 className="font-semibold text-[hsl(var(--boss-text-primary))]">{m.title}</h3>
                    <p className="mt-1 text-sm text-[hsl(var(--boss-text-secondary))]">{m.description}</p>
                    <LiveActivityStrip title={m.title} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}
