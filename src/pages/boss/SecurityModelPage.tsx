import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUserRoles } from '@/hooks/useUserRoles';
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
  Smartphone,
  Globe,
  Server,
  Database,
  Cloud,
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Ban,
  Zap,
  Bot,
  Brain,
  MessageSquareWarning,
  FileText,
  ClipboardCheck,
  RefreshCw,
  TrendingUp,
  Crown,
  Hash,
  Layers,
  Network,
  HardDrive,
  RotateCcw,
  History,
  FileSearch,
  Download,
  Upload,
  Settings,
  Info,
} from 'lucide-react';

// Security Layer Card Component
interface SecurityLayerCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'active' | 'monitoring' | 'warning' | 'disabled';
  features: string[];
  stats?: { label: string; value: string | number }[];
}

function SecurityLayerCard({ icon, title, description, status, features, stats }: SecurityLayerCardProps) {
  const statusConfig = {
    active: { badge: 'Active', color: 'border-emerald-500/50 bg-emerald-900/30 text-emerald-300', glow: 'border-l-emerald-500' },
    monitoring: { badge: 'Monitoring', color: 'border-blue-500/50 bg-blue-900/30 text-blue-300', glow: 'border-l-blue-500' },
    warning: { badge: 'Warning', color: 'border-amber-500/50 bg-amber-900/30 text-amber-300', glow: 'border-l-amber-500' },
    disabled: { badge: 'Disabled', color: 'border-gray-500/50 bg-gray-900/30 text-gray-300', glow: 'border-l-gray-500' },
  };

  const config = statusConfig[status];

  return (
    <Card className={`bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 ${config.glow} hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-700/30">
              {icon}
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

export default function SecurityModelPage() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock security stats
  const securityStats = {
    overallScore: 98,
    threatsBlocked: 1247,
    activeMonitors: 42,
    lastAudit: '2 hours ago',
    zeroTrustStatus: 'Enforced',
    encryptionStatus: 'AES-256',
  };

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-4">
          <Skeleton className="h-8 w-64 bg-gray-700" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 bg-gray-700" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isSuperAdmin()) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6">
          <Card className="bg-red-900/30 border-red-700/50">
            <CardHeader>
              <CardTitle className="text-red-300 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                Access Denied
              </CardTitle>
              <CardDescription className="text-red-400">
                Super Admin access required for Security Model access.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                <Shield className="h-8 w-8 text-emerald-400" />
                Security Model
              </h1>
              <p className="text-gray-400 mt-1">Zero-Trust • AI-Guarded • Enterprise-Grade</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-emerald-500/50 bg-emerald-900/30 text-emerald-300 px-3 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                Score: {securityStats.overallScore}%
              </Badge>
              <Badge variant="outline" className="border-purple-500/50 bg-purple-900/30 text-purple-300 px-3 py-1.5">
                <Lock className="h-3.5 w-3.5 mr-1.5" />
                {securityStats.zeroTrustStatus}
              </Badge>
            </div>
          </div>

          {/* Security Philosophy Banner */}
          <Card className="bg-gradient-to-r from-emerald-900/40 via-[hsl(var(--boss-card-bg))] to-purple-900/40 border-[hsl(var(--boss-card-border))]">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-emerald-900/50 border border-emerald-700/50">
                    <ShieldCheck className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Zero-Trust Security Model</h3>
                    <p className="text-gray-400 text-sm">Trust Nothing • Verify Everything • Log Always • Fail Silently</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-gray-400">Threats Blocked</p>
                    <p className="text-xl font-bold text-emerald-400">{securityStats.threatsBlocked}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">Active Monitors</p>
                    <p className="text-xl font-bold text-blue-400">{securityStats.activeMonitors}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">Encryption</p>
                    <p className="text-xl font-bold text-purple-400">{securityStats.encryptionStatus}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-[hsl(var(--boss-card-bg))] border border-[hsl(var(--boss-card-border))] p-1 flex flex-wrap">
              <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Layers className="h-4 w-4 mr-2" />All Layers
              </TabsTrigger>
              <TabsTrigger value="identity" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Fingerprint className="h-4 w-4 mr-2" />Identity
              </TabsTrigger>
              <TabsTrigger value="access" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Key className="h-4 w-4 mr-2" />Access
              </TabsTrigger>
              <TabsTrigger value="data" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Database className="h-4 w-4 mr-2" />Data
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Brain className="h-4 w-4 mr-2" />AI Safety
              </TabsTrigger>
              <TabsTrigger value="threats" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <AlertTriangle className="h-4 w-4 mr-2" />Threats
              </TabsTrigger>
            </TabsList>

            {/* All Layers Overview */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Layer 1: Identity & Access */}
                <SecurityLayerCard
                  icon={<Fingerprint className="h-5 w-5 text-emerald-400" />}
                  title="Layer 1: Identity & Access"
                  description="User verification & device binding"
                  status="active"
                  stats={[
                    { label: 'MFA Enabled', value: '100%' },
                    { label: 'Devices', value: 156 },
                    { label: 'Pending', value: 3 },
                  ]}
                  features={[
                    'Unique ID per role (Boss = Crown + 001)',
                    'Masked email/mobile for all users',
                    'MFA for privileged roles',
                    'Device fingerprint binding',
                    'New device requires approval',
                  ]}
                />

                {/* Layer 2: Role & Permission */}
                <SecurityLayerCard
                  icon={<UserCheck className="h-5 w-5 text-blue-400" />}
                  title="Layer 2: Role & Permission"
                  description="Least-privilege enforcement"
                  status="active"
                  stats={[
                    { label: 'Roles', value: 12 },
                    { label: 'Permissions', value: 89 },
                    { label: 'Violations', value: 0 },
                  ]}
                  features={[
                    'Fixed permission scope per role',
                    'No cross-role screen access',
                    'Temporary access with expiry',
                    'Changes require approval',
                    'Silent revoke on misuse',
                  ]}
                />

                {/* Layer 3: Session & Auth */}
                <SecurityLayerCard
                  icon={<Monitor className="h-5 w-5 text-purple-400" />}
                  title="Layer 3: Session & Auth"
                  description="Session integrity protection"
                  status="monitoring"
                  stats={[
                    { label: 'Active', value: 45 },
                    { label: 'Anomalies', value: 2 },
                    { label: 'Expired', value: 128 },
                  ]}
                  features={[
                    'Token bound to device + IP',
                    'Session anomaly detection',
                    'Auto logout on mismatch',
                    'Idle timeout enforced',
                    'No parallel admin sessions',
                  ]}
                />

                {/* Layer 4: API & Backend */}
                <SecurityLayerCard
                  icon={<Server className="h-5 w-5 text-cyan-400" />}
                  title="Layer 4: API & Backend"
                  description="API protection & rate limiting"
                  status="active"
                  stats={[
                    { label: 'APIs', value: 34 },
                    { label: 'Rate Limited', value: 7 },
                    { label: 'Blocked', value: 156 },
                  ]}
                  features={[
                    'API key per service',
                    'Rate limit per role',
                    'Abuse auto-block',
                    'Generic response on failure',
                    'No error disclosure',
                  ]}
                />

                {/* Layer 5: Data Protection */}
                <SecurityLayerCard
                  icon={<Database className="h-5 w-5 text-amber-400" />}
                  title="Layer 5: Data Protection"
                  description="Encryption & privacy"
                  status="active"
                  stats={[
                    { label: 'Encrypted', value: '100%' },
                    { label: 'Masked Fields', value: 23 },
                    { label: 'Backups', value: 'Daily' },
                  ]}
                  features={[
                    'AES-256 encryption at rest',
                    'TLS 1.3 in transit',
                    'Field-level PII masking',
                    'No hard delete (freeze only)',
                    'Immutable audit logs',
                  ]}
                />

                {/* Layer 6: Domain & License */}
                <SecurityLayerCard
                  icon={<Globe className="h-5 w-5 text-red-400" />}
                  title="Layer 6: Domain & License"
                  description="Build integrity & licensing"
                  status="active"
                  stats={[
                    { label: 'Domains', value: 3 },
                    { label: 'Licenses', value: 1 },
                    { label: 'Verified', value: 'Yes' },
                  ]}
                  features={[
                    'Domain hash in build',
                    'Approved domains only',
                    'Silent feature disable on mismatch',
                    'License auto-bind with order',
                    'Auto crash on tampering',
                  ]}
                />

                {/* Layer 7: AI Safety */}
                <SecurityLayerCard
                  icon={<Brain className="h-5 w-5 text-pink-400" />}
                  title="Layer 7: AI Safety & Control"
                  description="AI behavior boundaries"
                  status="monitoring"
                  stats={[
                    { label: 'AI Actions', value: 892 },
                    { label: 'Blocked', value: 12 },
                    { label: 'Pending', value: 5 },
                  ]}
                  features={[
                    'AI can: Suggest, Analyze, Predict',
                    'AI cannot: Deploy without approval',
                    'AI cannot: Override security',
                    'AI behavior monitored',
                    'Auto lock on AI misuse',
                  ]}
                />

                {/* Layer 8: Internal Chat */}
                <SecurityLayerCard
                  icon={<MessageSquareWarning className="h-5 w-5 text-orange-400" />}
                  title="Layer 8: Internal Chat & Assist"
                  description="Secure communication"
                  status="active"
                  stats={[
                    { label: 'Sessions', value: 45 },
                    { label: 'Logged', value: '100%' },
                    { label: 'Blocked', value: 3 },
                  ]}
                  features={[
                    'Approval required before chat',
                    'Reason mandatory',
                    'No copy/share/screenshot',
                    'Auto translate',
                    'Full audit trail',
                  ]}
                />

                {/* Layer 9: Threat Detection */}
                <SecurityLayerCard
                  icon={<AlertTriangle className="h-5 w-5 text-red-400" />}
                  title="Layer 9: Threat Detection"
                  description="Active threat monitoring"
                  status="active"
                  stats={[
                    { label: 'Scans', value: '24/7' },
                    { label: 'Detected', value: 23 },
                    { label: 'Contained', value: 23 },
                  ]}
                  features={[
                    'Brute force detection',
                    'Insider behavior monitoring',
                    'Geo anomaly alerts',
                    'API abuse detection',
                    'Silent containment',
                  ]}
                />

                {/* Layer 10: Auto Recovery */}
                <SecurityLayerCard
                  icon={<RotateCcw className="h-5 w-5 text-emerald-400" />}
                  title="Layer 10: Auto Recovery"
                  description="Self-healing systems"
                  status="active"
                  stats={[
                    { label: 'Recoveries', value: 12 },
                    { label: 'Rollbacks', value: 3 },
                    { label: 'Uptime', value: '99.9%' },
                  ]}
                  features={[
                    'AI predicts failure',
                    'Auto rollback',
                    'Auto isolate server',
                    'Immutable backup restore',
                    'Zero downtime exposure',
                  ]}
                />

                {/* Layer 11: Compliance */}
                <SecurityLayerCard
                  icon={<ClipboardCheck className="h-5 w-5 text-blue-400" />}
                  title="Layer 11: Compliance & Audit"
                  description="Regulatory readiness"
                  status="active"
                  stats={[
                    { label: 'Logs', value: '∞' },
                    { label: 'Retention', value: '7y' },
                    { label: 'Exports', value: 'Encrypted' },
                  ]}
                  features={[
                    'One-click audit export',
                    'Role-wise logs',
                    'Retention enforced',
                    'Compliance ready (ISO-style)',
                    'Immutable trail',
                  ]}
                />

                {/* Positive Response */}
                <SecurityLayerCard
                  icon={<CheckCircle className="h-5 w-5 text-emerald-400" />}
                  title="Positive Response Engine"
                  description="User-friendly error handling"
                  status="active"
                  stats={[
                    { label: 'Errors Masked', value: 456 },
                    { label: 'UX Score', value: '98%' },
                    { label: 'Panic Events', value: 0 },
                  ]}
                  features={[
                    '"System optimizing, please wait…"',
                    'No panic messages',
                    'No technical exposure',
                    'Silent logging',
                    'Brand trust protected',
                  ]}
                />
              </div>
            </TabsContent>

            {/* Identity Tab */}
            <TabsContent value="identity" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Crown className="h-5 w-5 text-amber-400" />
                      Role Identity System
                    </CardTitle>
                    <CardDescription className="text-gray-400">Unique identification per role type</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { role: 'Boss / Owner', icon: '👑', id: '001', color: 'text-amber-400' },
                      { role: 'Franchise', icon: '🏢', id: 'FR-001', color: 'text-blue-400' },
                      { role: 'Reseller', icon: '🤝', id: 'RS-001', color: 'text-emerald-400' },
                      { role: 'Developer', icon: '💻', id: 'DEV-001', color: 'text-purple-400' },
                      { role: 'Influencer', icon: '⭐', id: 'INF-001', color: 'text-pink-400' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-gray-300">{item.role}</span>
                        </div>
                        <Badge variant="outline" className={`${item.color} border-current`}>
                          <Hash className="h-3 w-3 mr-1" />
                          {item.id}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <EyeOff className="h-5 w-5 text-red-400" />
                      Data Masking Rules
                    </CardTitle>
                    <CardDescription className="text-gray-400">PII protection for all users</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { field: 'Email', masked: 'j***@example.com', status: 'Masked' },
                      { field: 'Mobile', masked: '+91 ****7890', status: 'Masked' },
                      { field: 'KYC ID', masked: 'XXXX-XXXX-1234', status: 'Masked' },
                      { field: 'Bank Account', masked: '****-****-5678', status: 'Masked' },
                      { field: 'Address', masked: '[Hidden]', status: 'Hidden' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                        <span className="text-gray-300">{item.field}</span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">{item.masked}</code>
                          <Badge variant="outline" className="border-emerald-500/50 bg-emerald-900/30 text-emerald-300">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Access Tab */}
            <TabsContent value="access" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Lock className="h-5 w-5 text-emerald-400" />
                      Access Control Matrix
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { action: 'View Dashboard', roles: ['All'], status: 'allowed' },
                      { action: 'Edit Settings', roles: ['Admin', 'Boss'], status: 'restricted' },
                      { action: 'Delete Records', roles: ['Super Admin'], status: 'restricted' },
                      { action: 'Export Data', roles: ['Boss'], status: 'restricted' },
                      { action: 'System Freeze', roles: ['Super Admin'], status: 'critical' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                        <span className="text-gray-300">{item.action}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{item.roles.join(', ')}</span>
                          <Badge variant="outline" className={
                            item.status === 'allowed' ? 'border-emerald-500/50 bg-emerald-900/30 text-emerald-300' :
                            item.status === 'critical' ? 'border-red-500/50 bg-red-900/30 text-red-300' :
                            'border-amber-500/50 bg-amber-900/30 text-amber-300'
                          }>
                            {item.status === 'allowed' ? <CheckCircle className="h-3 w-3" /> :
                             item.status === 'critical' ? <XCircle className="h-3 w-3" /> :
                             <Lock className="h-3 w-3" />}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-purple-400" />
                      Device Binding
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { device: 'MacBook Pro', fingerprint: 'fp_x7a...', status: 'trusted', last: '2 min ago' },
                      { device: 'iPhone 15', fingerprint: 'fp_9b2...', status: 'trusted', last: '1 hour ago' },
                      { device: 'Windows PC', fingerprint: 'fp_4c1...', status: 'pending', last: 'New' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                        <div>
                          <p className="text-gray-300">{item.device}</p>
                          <p className="text-xs text-gray-500">{item.fingerprint}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{item.last}</span>
                          <Badge variant="outline" className={
                            item.status === 'trusted' ? 'border-emerald-500/50 bg-emerald-900/30 text-emerald-300' :
                            'border-amber-500/50 bg-amber-900/30 text-amber-300'
                          }>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Data Tab */}
            <TabsContent value="data" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-emerald-500">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Lock className="h-5 w-5 text-emerald-400" />
                      Encryption Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">At Rest</span>
                        <Badge variant="outline" className="border-emerald-500/50 bg-emerald-900/30 text-emerald-300">AES-256</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">In Transit</span>
                        <Badge variant="outline" className="border-emerald-500/50 bg-emerald-900/30 text-emerald-300">TLS 1.3</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Backups</span>
                        <Badge variant="outline" className="border-emerald-500/50 bg-emerald-900/30 text-emerald-300">Encrypted</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-amber-500">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Ban className="h-5 w-5 text-amber-400" />
                      No Hard Delete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4">Records are frozen, never deleted</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frozen Records</span>
                        <span className="text-white font-medium">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Recoverable</span>
                        <span className="text-emerald-400 font-medium">100%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileSearch className="h-5 w-5 text-blue-400" />
                      Audit Trail
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4">Immutable logging system</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Logs</span>
                        <span className="text-white font-medium">∞</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Retention</span>
                        <span className="text-white font-medium">7 Years</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Safety Tab */}
            <TabsContent value="ai" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      AI CAN Do
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {['Suggest actions', 'Analyze data patterns', 'Predict failures', 'Auto-recover systems', 'Generate reports'].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded bg-emerald-900/20 border border-emerald-700/30">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-400" />
                      AI CANNOT Do
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {['Deploy without approval', 'Override security policies', 'Export sensitive data', 'Access other roles', 'Modify audit logs'].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded bg-red-900/20 border border-red-700/30">
                        <XCircle className="h-4 w-4 text-red-400" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Threats Tab */}
            <TabsContent value="threats" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { threat: 'Brute Force', status: 'Protected', count: 156, icon: <Lock className="h-5 w-5" /> },
                  { threat: 'Geo Anomaly', status: 'Monitoring', count: 23, icon: <Globe className="h-5 w-5" /> },
                  { threat: 'Session Hijack', status: 'Protected', count: 0, icon: <Monitor className="h-5 w-5" /> },
                  { threat: 'Data Exfiltration', status: 'Protected', count: 0, icon: <Download className="h-5 w-5" /> },
                ].map((item, idx) => (
                  <Card key={idx} className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-gray-800/50 text-gray-400">
                          {item.icon}
                        </div>
                        <Badge variant="outline" className={
                          item.status === 'Protected' ? 'border-emerald-500/50 bg-emerald-900/30 text-emerald-300' :
                          'border-amber-500/50 bg-amber-900/30 text-amber-300'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                      <h4 className="text-white font-medium">{item.threat}</h4>
                      <p className="text-2xl font-bold text-gray-400">{item.count} blocked</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-400" />
                    Silent Containment Protocol
                  </CardTitle>
                  <CardDescription className="text-gray-400">How threats are handled without user panic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 overflow-x-auto pb-2">
                    {['Detect', 'Analyze', 'Contain', 'Log', 'Alert Boss', 'Auto-Fix'].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-700/50 flex items-center justify-center text-emerald-400 text-sm font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-gray-300 text-sm">{step}</span>
                        {idx < 5 && <span className="text-gray-600">→</span>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer Notice */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="py-3">
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <Lock className="h-4 w-4" />
                <span>Security Model is locked and enforced across all modules</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
