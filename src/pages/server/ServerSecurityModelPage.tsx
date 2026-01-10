import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Fingerprint,
  Eye,
  EyeOff,
  UserCheck,
  Users,
  Monitor,
  Globe,
  Server,
  Database,
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Ban,
  Zap,
  Bot,
  Brain,
  FileText,
  RefreshCw,
  Crown,
  Layers,
  Network,
  HardDrive,
  RotateCcw,
  History,
  Download,
  Settings,
  Info,
  Terminal,
  Radio,
  Wifi,
  WifiOff,
} from 'lucide-react';

// Security Layer Card
interface SecurityLayerCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'active' | 'monitoring' | 'warning' | 'disabled';
  features: string[];
  stats?: { label: string; value: string | number }[];
  layerNumber: number;
}

function SecurityLayerCard({ icon, title, description, status, features, stats, layerNumber }: SecurityLayerCardProps) {
  const statusConfig = {
    active: { badge: 'LOCKED', color: 'border-emerald-500/50 bg-emerald-900/30 text-emerald-300', glow: 'border-l-emerald-500' },
    monitoring: { badge: 'AI WATCHING', color: 'border-blue-500/50 bg-blue-900/30 text-blue-300', glow: 'border-l-blue-500' },
    warning: { badge: 'ATTENTION', color: 'border-amber-500/50 bg-amber-900/30 text-amber-300', glow: 'border-l-amber-500' },
    disabled: { badge: 'OFF', color: 'border-gray-500/50 bg-gray-900/30 text-gray-300', glow: 'border-l-gray-500' },
  };

  const config = statusConfig[status];

  return (
    <Card className={`bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 ${config.glow} hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-700/30">
                {icon}
              </div>
              <span className="absolute -top-1 -left-1 h-5 w-5 rounded-full bg-emerald-600 text-xs flex items-center justify-center text-white font-bold">
                {layerNumber}
              </span>
            </div>
            <div>
              <CardTitle className="text-white text-lg">{title}</CardTitle>
              <CardDescription className="text-gray-400 text-sm">{description}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={config.color}>
            {config.badge}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-2 rounded bg-gray-800/50 text-center">
                <p className="text-xs text-gray-400">{stat.label}</p>
                <p className="text-sm font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-1.5">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Command Flow Visualizer
function CommandFlowVisualizer() {
  const steps = [
    { icon: Users, label: 'User Click', status: 'complete' },
    { icon: Bot, label: 'AI Pre-Check', status: 'complete' },
    { icon: Activity, label: 'Risk Score', status: 'complete' },
    { icon: ShieldCheck, label: 'Allow/Block', status: 'active' },
    { icon: Zap, label: 'Execute', status: 'pending' },
    { icon: CheckCircle, label: 'Verify', status: 'pending' },
    { icon: History, label: 'Log', status: 'pending' },
  ];

  return (
    <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Terminal className="h-5 w-5 text-emerald-400" />
          Command Execution Lock Flow
        </CardTitle>
        <CardDescription className="text-gray-400">Every action passes through AI gate</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`p-2 rounded-lg border ${
                  step.status === 'complete' ? 'bg-emerald-900/50 border-emerald-500/50' :
                  step.status === 'active' ? 'bg-blue-900/50 border-blue-500/50 animate-pulse' :
                  'bg-gray-800/50 border-gray-600/50'
                }`}>
                  <step.icon className={`h-5 w-5 ${
                    step.status === 'complete' ? 'text-emerald-400' :
                    step.status === 'active' ? 'text-blue-400' :
                    'text-gray-500'
                  }`} />
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  step.status === 'complete' ? 'bg-emerald-500' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-gray-300">
              <strong className="text-white">High Risk</strong> → Auto Blocked • 
              <strong className="text-white"> Medium Risk</strong> → AI Fix Only • 
              <strong className="text-white"> Low Risk</strong> → Auto Execute
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Role Lock Matrix
function RoleLockMatrix() {
  const roles = [
    { name: 'Super Admin', icon: Crown, permissions: ['full', 'full', 'full', 'full', 'full'], color: 'text-purple-400' },
    { name: 'Admin', icon: ShieldCheck, permissions: ['read', 'write', 'approval', 'approval', 'deny'], color: 'text-blue-400' },
    { name: 'Dev', icon: Terminal, permissions: ['read', 'read', 'deny', 'deny', 'deny'], color: 'text-cyan-400' },
    { name: 'Viewer', icon: Eye, permissions: ['read', 'deny', 'deny', 'deny', 'deny'], color: 'text-gray-400' },
    { name: 'AI Bot', icon: Bot, permissions: ['execute', 'execute', 'execute', 'deny', 'deny'], color: 'text-emerald-400' },
  ];

  const actions = ['View', 'Modify', 'Kill/Restart', 'Port Control', 'Override AI'];

  const getPermissionBadge = (perm: string) => {
    switch (perm) {
      case 'full': return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Full</Badge>;
      case 'read': return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Read</Badge>;
      case 'write': return <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">Write</Badge>;
      case 'approval': return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">+AI</Badge>;
      case 'execute': return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Exec</Badge>;
      default: return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Deny</Badge>;
    }
  };

  return (
    <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Lock className="h-5 w-5 text-amber-400" />
          Role Lock Matrix
        </CardTitle>
        <CardDescription className="text-gray-400">Human cannot bypass AI decision</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3 text-gray-400 text-sm">Role</th>
                {actions.map(action => (
                  <th key={action} className="text-center py-2 px-2 text-gray-400 text-xs">{action}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.name} className="border-b border-gray-800/50">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <role.icon className={`h-4 w-4 ${role.color}`} />
                      <span className="text-white text-sm">{role.name}</span>
                    </div>
                  </td>
                  {role.permissions.map((perm, idx) => (
                    <td key={idx} className="text-center py-3 px-2">
                      {getPermissionBadge(perm)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ServerSecurityModelPage() {
  const { isSuperAdmin, isAdmin, loading: rolesLoading } = useUserRoles();
  const [activeTab, setActiveTab] = useState('all-layers');

  // Security stats
  const securityStats = {
    overallScore: 98,
    threatsBlocked: 1247,
    aiActionsToday: 892,
    auditLogs: '24/7',
    encryption: 'AES-256',
    zeroTrust: 'ENFORCED',
  };

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-4">
          <Skeleton className="h-8 w-64 bg-gray-700" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 bg-gray-700" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                <Shield className="h-8 w-8 text-emerald-400" />
                Server Security Model
              </h1>
              <p className="text-gray-400 mt-1">ENTERPRISE • ZERO-TRUST • AI-FIRST • LOCKED</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-emerald-500/50 bg-emerald-900/30 text-emerald-300 px-3 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                Score: {securityStats.overallScore}%
              </Badge>
              <Badge variant="outline" className="border-purple-500/50 bg-purple-900/30 text-purple-300 px-3 py-1.5">
                <Lock className="h-3.5 w-3.5 mr-1.5" />
                {securityStats.zeroTrust}
              </Badge>
            </div>
          </div>

          {/* Philosophy Banner */}
          <Card className="bg-gradient-to-r from-emerald-900/40 via-[hsl(var(--boss-card-bg))] to-purple-900/40 border-[hsl(var(--boss-card-border))]">
            <CardContent className="py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-emerald-900/50 border border-emerald-700/50">
                    <ShieldCheck className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Zero-Trust Architecture</h3>
                    <p className="text-gray-400 text-sm">No Hacking • No Backdoor • No Manual Risk • 99.9% AI-Controlled</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-gray-400">Threats Blocked</p>
                    <p className="text-xl font-bold text-emerald-400">{securityStats.threatsBlocked}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">AI Actions</p>
                    <p className="text-xl font-bold text-blue-400">{securityStats.aiActionsToday}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">Encryption</p>
                    <p className="text-xl font-bold text-purple-400">{securityStats.encryption}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-[hsl(var(--boss-card-bg))] border border-[hsl(var(--boss-card-border))] p-1 flex flex-wrap">
              <TabsTrigger value="all-layers" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Layers className="h-4 w-4 mr-2" />10 Security Layers
              </TabsTrigger>
              <TabsTrigger value="command-flow" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Terminal className="h-4 w-4 mr-2" />Command Lock
              </TabsTrigger>
              <TabsTrigger value="role-matrix" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <UserCheck className="h-4 w-4 mr-2" />Role Matrix
              </TabsTrigger>
              <TabsTrigger value="ai-engine" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Brain className="h-4 w-4 mr-2" />AI Engine
              </TabsTrigger>
            </TabsList>

            {/* All 10 Layers */}
            <TabsContent value="all-layers" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Layer 1: Zero Trust Core */}
                <SecurityLayerCard
                  layerNumber={1}
                  icon={<Shield className="h-5 w-5 text-emerald-400" />}
                  title="Zero Trust Core"
                  description="Default deny everything"
                  status="active"
                  stats={[
                    { label: 'Mode', value: 'Enforced' },
                    { label: 'Denied', value: 1247 },
                    { label: 'Uptime', value: '99.9%' },
                  ]}
                  features={[
                    'Default deny all access',
                    'Least privilege enforcement',
                    'AI-Gate before every command',
                    'Immutable audit logs',
                    'No client-side secrets',
                  ]}
                />

                {/* Layer 2: Auth & Access Lock */}
                <SecurityLayerCard
                  layerNumber={2}
                  icon={<Fingerprint className="h-5 w-5 text-blue-400" />}
                  title="Auth & Access Lock"
                  description="Multi-factor identity verification"
                  status="active"
                  stats={[
                    { label: 'MFA', value: '100%' },
                    { label: 'Sessions', value: 45 },
                    { label: 'Blocked', value: 23 },
                  ]}
                  features={[
                    'Email + Password + OTP',
                    'Device fingerprint binding',
                    'IP + Geo lock (country)',
                    'Session auto-expire',
                    'One active session/user',
                    'Brute-force auto block (AI)',
                  ]}
                />

                {/* Layer 3: Role Lock Matrix */}
                <SecurityLayerCard
                  layerNumber={3}
                  icon={<UserCheck className="h-5 w-5 text-purple-400" />}
                  title="Role Lock Matrix"
                  description="Permission boundaries"
                  status="active"
                  stats={[
                    { label: 'Roles', value: 5 },
                    { label: 'Rules', value: 25 },
                    { label: 'Overrides', value: 0 },
                  ]}
                  features={[
                    'Super Admin (full access)',
                    'Admin (no kill without AI)',
                    'Dev (read + scan only)',
                    'Viewer (read only)',
                    'AI Bot (execute only)',
                  ]}
                />

                {/* Layer 4: Command Execution Lock */}
                <SecurityLayerCard
                  layerNumber={4}
                  icon={<Terminal className="h-5 w-5 text-cyan-400" />}
                  title="Command Execution Lock"
                  description="AI-gated command flow"
                  status="monitoring"
                  stats={[
                    { label: 'High Risk', value: 'Block' },
                    { label: 'Medium', value: 'AI Fix' },
                    { label: 'Low Risk', value: 'Auto' },
                  ]}
                  features={[
                    'User Click → AI Pre-Check',
                    'Risk Score calculation',
                    'Allow / Block decision',
                    'Execute → Verify → Log',
                    'Human cannot bypass AI',
                  ]}
                />

                {/* Layer 5: Data & Secret Security */}
                <SecurityLayerCard
                  layerNumber={5}
                  icon={<Database className="h-5 w-5 text-amber-400" />}
                  title="Data & Secret Security"
                  description="Encryption & vault"
                  status="active"
                  stats={[
                    { label: 'Encrypted', value: '100%' },
                    { label: 'Algorithm', value: 'AES-256' },
                    { label: 'Rotation', value: 'Auto' },
                  ]}
                  features={[
                    'Credentials encrypted (AES-256)',
                    'Passwords never shown again',
                    'Secrets server-side only',
                    'No hardcoded keys',
                    'Token rotation enabled',
                  ]}
                />

                {/* Layer 6: Network & Port Lock */}
                <SecurityLayerCard
                  layerNumber={6}
                  icon={<Network className="h-5 w-5 text-red-400" />}
                  title="Network & Port Lock"
                  description="Network perimeter control"
                  status="monitoring"
                  stats={[
                    { label: 'Ports Open', value: 3 },
                    { label: 'Monitored', value: 65535 },
                    { label: 'Blocked', value: 12 },
                  ]}
                  features={[
                    'Closed by default',
                    'AI monitors open ports',
                    'Unknown port → auto close',
                    'Backdoor pattern detection',
                    'Traffic anomaly detection',
                    'Download spike throttle',
                  ]}
                />

                {/* Layer 7: AI Security Engine */}
                <SecurityLayerCard
                  layerNumber={7}
                  icon={<Brain className="h-5 w-5 text-pink-400" />}
                  title="AI Security Engine"
                  description="Autonomous threat response"
                  status="monitoring"
                  stats={[
                    { label: 'Actions', value: 892 },
                    { label: 'Auto Fix', value: 156 },
                    { label: 'Alerts', value: 12 },
                  ]}
                  features={[
                    'Malware scan',
                    'Backdoor detection',
                    'Config drift check',
                    'SSL expiry watch',
                    'Login behavior analysis',
                    'Country anomaly alerts',
                  ]}
                />

                {/* Layer 8: UI Security Lock */}
                <SecurityLayerCard
                  layerNumber={8}
                  icon={<Monitor className="h-5 w-5 text-orange-400" />}
                  title="UI Security Lock"
                  description="Client-side protection"
                  status="active"
                  stats={[
                    { label: 'Inspect', value: 'Blocked' },
                    { label: 'Copy', value: 'Disabled' },
                    { label: 'Masked', value: 23 },
                  ]}
                  features={[
                    'No right click inspect',
                    'No copy sensitive data',
                    'Masked fields by default',
                    'Read-only fallback mode',
                    'Error-safe screens (no crash)',
                  ]}
                />

                {/* Layer 9: Audit & Log Lock */}
                <SecurityLayerCard
                  layerNumber={9}
                  icon={<History className="h-5 w-5 text-blue-400" />}
                  title="Audit & Log Lock"
                  description="Immutable compliance trail"
                  status="active"
                  stats={[
                    { label: 'Logged', value: '100%' },
                    { label: 'Immutable', value: 'Yes' },
                    { label: 'Compliant', value: 'ISO/GDPR' },
                  ]}
                  features={[
                    'Every action logged',
                    'Cannot edit/delete logs',
                    'Timestamp + actor (AI/Human)',
                    'Download audit report',
                    'Compliance ready (ISO/GDPR)',
                  ]}
                />

                {/* Layer 10: Fail-Safe & Recovery */}
                <SecurityLayerCard
                  layerNumber={10}
                  icon={<RotateCcw className="h-5 w-5 text-emerald-400" />}
                  title="Fail-Safe & Recovery"
                  description="Self-healing systems"
                  status="active"
                  stats={[
                    { label: 'Recoveries', value: 12 },
                    { label: 'Snapshots', value: 'Auto' },
                    { label: 'Rollback', value: 'Ready' },
                  ]}
                  features={[
                    'If API down → safe mode',
                    'If AI unsure → block + alert',
                    'Auto rollback on failure',
                    'Snapshot before critical action',
                    'Zero downtime recovery',
                  ]}
                />
              </div>
            </TabsContent>

            {/* Command Lock Flow */}
            <TabsContent value="command-flow" className="space-y-4">
              <CommandFlowVisualizer />
              
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Ban className="h-5 w-5 text-red-400" />
                      Blocked Actions (Require Approval)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { action: 'Kill Server Process', risk: 'HIGH' },
                      { action: 'Restart Server', risk: 'HIGH' },
                      { action: 'Open Port', risk: 'MEDIUM' },
                      { action: 'Change Firewall Rules', risk: 'HIGH' },
                      { action: 'Delete Logs', risk: 'CRITICAL' },
                      { action: 'Override AI Decision', risk: 'CRITICAL' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-gray-800/50">
                        <span className="text-gray-300">{item.action}</span>
                        <Badge className={
                          item.risk === 'CRITICAL' ? 'bg-red-500/20 text-red-300' :
                          item.risk === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-blue-500/20 text-blue-300'
                        }>{item.risk}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-emerald-400" />
                      Auto-Executed (Low Risk)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { action: 'View Server Status', risk: 'SAFE' },
                      { action: 'View Logs', risk: 'SAFE' },
                      { action: 'Run Health Check', risk: 'SAFE' },
                      { action: 'View Metrics', risk: 'SAFE' },
                      { action: 'Export Report', risk: 'LOW' },
                      { action: 'Refresh Data', risk: 'SAFE' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-gray-800/50">
                        <span className="text-gray-300">{item.action}</span>
                        <Badge className="bg-emerald-500/20 text-emerald-300">{item.risk}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Role Matrix */}
            <TabsContent value="role-matrix" className="space-y-4">
              <RoleLockMatrix />
              
              <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-400" />
                    Role Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { rule: 'Kill / Restart / Port actions require Admin + AI approval', icon: Lock },
                    { rule: 'Human cannot bypass AI decision', icon: Bot },
                    { rule: 'Dev role cannot execute any write operations', icon: Terminal },
                    { rule: 'Viewer role is read-only with masked sensitive data', icon: Eye },
                    { rule: 'AI Bot can only execute pre-approved actions', icon: Brain },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded bg-gray-800/50 border border-gray-700/50">
                      <item.icon className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-300">{item.rule}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Engine */}
            <TabsContent value="ai-engine" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Brain className="h-5 w-5 text-emerald-400" />
                      AI Security Tasks
                    </CardTitle>
                    <CardDescription className="text-gray-400">Autonomous monitoring & response</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { task: 'Malware Scan', status: 'active', interval: 'Every 4h' },
                      { task: 'Backdoor Detection', status: 'active', interval: 'Real-time' },
                      { task: 'Config Drift Check', status: 'active', interval: 'Every 1h' },
                      { task: 'SSL Expiry Watch', status: 'active', interval: 'Daily' },
                      { task: 'Login Behavior Analysis', status: 'active', interval: 'Real-time' },
                      { task: 'Country Anomaly Alerts', status: 'active', interval: 'Real-time' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded bg-gray-800/50">
                        <div className="flex items-center gap-2">
                          <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                          <span className="text-gray-300">{item.task}</span>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-300">{item.interval}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-400" />
                      AI Auto-Actions
                    </CardTitle>
                    <CardDescription className="text-gray-400">Actions AI takes autonomously</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { action: 'Auto fix minor issues', enabled: true },
                      { action: 'Auto isolate compromised server', enabled: true },
                      { action: 'Auto restart failed service', enabled: true },
                      { action: 'Auto notify admin on threats', enabled: true },
                      { action: 'Auto block suspicious IPs', enabled: true },
                      { action: 'Auto close unknown ports', enabled: true },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded bg-gray-800/50">
                        <span className="text-gray-300">{item.action}</span>
                        <Switch checked={item.enabled} className="data-[state=checked]:bg-emerald-500" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-amber-900/20 to-red-900/20 border-amber-700/50">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-400" />
                    <div>
                      <h3 className="text-white font-semibold">Human Approval Required For:</h3>
                      <p className="text-gray-400 text-sm">Critical actions • Override AI decisions • Kill server • Delete data • Change security rules</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Final Status Banner */}
          <Card className="bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 border-emerald-700/50">
            <CardContent className="py-4">
              <div className="flex items-center justify-center gap-8 flex-wrap">
                {[
                  { label: 'Hacking-proof', icon: Shield },
                  { label: 'Backdoor-proof', icon: Lock },
                  { label: 'Bug-safe', icon: CheckCircle },
                  { label: 'AI-controlled', icon: Brain },
                  { label: 'Enterprise ready', icon: ShieldCheck },
                  { label: 'Locked by default', icon: Key },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-300 text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
