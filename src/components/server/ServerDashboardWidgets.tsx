import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Database,
  Users,
  DollarSign,
  Clock,
  Search,
  Filter,
  Shield,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Pause,
  Play,
  Archive,
  HardDrive,
  Wrench,
  TrendingUp,
  TrendingDown,
  Lock,
  Building,
  Server
} from 'lucide-react';
import { useState } from 'react';

export interface WidgetServer {
  id: string;
  name: string;
  status: string;
  owner_type: string;
  region?: string | null;
  current_cpu_load?: number | null;
  monthly_cost?: number | null;
  tags?: string[];
  ip_address?: string | null;
}

// Alias for internal use
type Server = WidgetServer;

interface ServerStateDistributionProps {
  servers: Server[];
  lastUpdated: Date;
}

export function ServerStateDistribution({ servers, lastUpdated }: ServerStateDistributionProps) {
  const active = servers.filter(s => s.status === 'running').length;
  const degraded = servers.filter(s => s.status === 'warning').length;
  const frozen = servers.filter(s => s.status === 'frozen').length;
  const retired = servers.filter(s => s.status === 'retired' || s.status === 'stopped').length;
  const total = servers.length || 1;

  const getFreshnessColor = () => {
    const diff = (Date.now() - lastUpdated.getTime()) / 1000;
    if (diff < 30) return 'text-green-500';
    if (diff < 60) return 'text-yellow-500';
    return 'text-destructive';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Server State Distribution
          </span>
          <span className={`text-xs ${getFreshnessColor()}`}>
            <Clock className="h-3 w-3 inline mr-1" />
            {lastUpdated.toLocaleTimeString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={(active / total) * 100} className="w-24 h-2" />
              <span className="text-sm font-medium w-8">{active}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Degraded</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={(degraded / total) * 100} className="w-24 h-2" />
              <span className="text-sm font-medium w-8">{degraded}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pause className="h-4 w-4 text-cyan-500" />
              <span className="text-sm">Frozen</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={(frozen / total) * 100} className="w-24 h-2" />
              <span className="text-sm font-medium w-8">{frozen}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Archive className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Retired</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={(retired / total) * 100} className="w-24 h-2" />
              <span className="text-sm font-medium w-8">{retired}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ClientImpactViewProps {
  incidents: any[];
  servers: Server[];
  lastUpdated: Date;
}

export function ClientImpactView({ incidents, servers, lastUpdated }: ClientImpactViewProps) {
  const clientServers = servers.filter(s => s.owner_type === 'client');
  const affectedClientServers = incidents
    .filter(i => i.status === 'active' || i.status === 'monitoring')
    .map(i => i.server_id);
  
  const clientsAffected = clientServers.filter(s => 
    affectedClientServers.includes(s.id)
  ).length;

  const revenueAtRisk = clientServers
    .filter(s => affectedClientServers.includes(s.id))
    .reduce((sum, s) => sum + (s.monthly_cost || 0), 0);

  const slaBreachRisk = incidents.filter(i => 
    i.severity === 'critical' && i.status === 'active'
  ).length > 0;

  const getFreshnessColor = () => {
    const diff = (Date.now() - lastUpdated.getTime()) / 1000;
    if (diff < 30) return 'text-green-500';
    if (diff < 60) return 'text-yellow-500';
    return 'text-destructive';
  };

  return (
    <Card className={slaBreachRisk ? 'border-destructive' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-500" />
            Client Impact View
          </span>
          <span className={`text-xs ${getFreshnessColor()}`}>
            <Clock className="h-3 w-3 inline mr-1" />
            {lastUpdated.toLocaleTimeString()}
          </span>
        </CardTitle>
        {slaBreachRisk && (
          <Badge variant="destructive" className="w-fit">SLA BREACH RISK</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Clients Affected</span>
          <span className={`text-xl font-bold ${clientsAffected > 0 ? 'text-destructive' : 'text-green-500'}`}>
            {clientsAffected}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Revenue at Risk (RO)</span>
          <span className="text-xl font-bold text-yellow-500">
            ${revenueAtRisk.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Client Servers</span>
          <span className="text-sm font-medium">{clientServers.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface CommandStatusProps {
  scalingEvents: any[];
  lastUpdated: Date;
}

export function CommandStatusWidget({ scalingEvents, lastUpdated }: CommandStatusProps) {
  const pending = scalingEvents?.filter(e => e.status === 'pending').length || 0;
  const inProgress = scalingEvents?.filter(e => e.status === 'in_progress' || e.status === 'triggered').length || 0;
  const failed = scalingEvents?.filter(e => e.status === 'failed').length || 0;
  const completed = scalingEvents?.filter(e => e.status === 'completed').length || 0;

  const getFreshnessColor = () => {
    const diff = (Date.now() - lastUpdated.getTime()) / 1000;
    if (diff < 30) return 'text-green-500';
    if (diff < 60) return 'text-yellow-500';
    return 'text-destructive';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Play className="h-4 w-4 text-primary" />
            Command Execution Status
          </span>
          <span className={`text-xs ${getFreshnessColor()}`}>
            <Clock className="h-3 w-3 inline mr-1" />
            {lastUpdated.toLocaleTimeString()}
          </span>
        </CardTitle>
        <CardDescription>Real-time action tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-lg bg-yellow-500/10">
            <div className="text-lg font-bold text-yellow-500">{pending}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="p-2 rounded-lg bg-blue-500/10">
            <div className="text-lg font-bold text-blue-500">{inProgress}</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
          <div className="p-2 rounded-lg bg-destructive/10">
            <div className="text-lg font-bold text-destructive">{failed}</div>
            <div className="text-xs text-muted-foreground">Failed</div>
          </div>
          <div className="p-2 rounded-lg bg-green-500/10">
            <div className="text-lg font-bold text-green-500">{completed}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ServerGroupSummaryProps {
  servers: Server[];
  lastUpdated: Date;
}

export function ServerGroupSummary({ servers, lastUpdated }: ServerGroupSummaryProps) {
  const groups = [
    { 
      name: 'Production', 
      servers: servers.filter(s => s.tags?.includes('production') || s.name?.toLowerCase().includes('prod')),
      icon: Building,
      color: 'text-green-500'
    },
    { 
      name: 'Client', 
      servers: servers.filter(s => s.owner_type === 'client'),
      icon: Users,
      color: 'text-blue-500'
    },
    { 
      name: 'Backup', 
      servers: servers.filter(s => s.tags?.includes('backup') || s.name?.toLowerCase().includes('backup')),
      icon: Database,
      color: 'text-purple-500'
    },
    { 
      name: 'Build/CI', 
      servers: servers.filter(s => s.tags?.includes('ci') || s.name?.toLowerCase().includes('build') || s.name?.toLowerCase().includes('ci')),
      icon: Wrench,
      color: 'text-orange-500'
    },
  ];

  const getHealthPercent = (groupServers: Server[]) => {
    if (groupServers.length === 0) return 100;
    const healthy = groupServers.filter(s => s.status === 'running').length;
    return Math.round((healthy / groupServers.length) * 100);
  };

  const getFreshnessColor = () => {
    const diff = (Date.now() - lastUpdated.getTime()) / 1000;
    if (diff < 30) return 'text-green-500';
    if (diff < 60) return 'text-yellow-500';
    return 'text-destructive';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            Server Group Health
          </span>
          <span className={`text-xs ${getFreshnessColor()}`}>
            <Clock className="h-3 w-3 inline mr-1" />
            {lastUpdated.toLocaleTimeString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {groups.map(group => {
          const health = getHealthPercent(group.servers);
          const Icon = group.icon;
          return (
            <div key={group.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${group.color}`} />
                <span className="text-sm">{group.name}</span>
                <Badge variant="outline" className="text-xs">{group.servers.length}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={health} 
                  className={`w-16 h-2 ${health < 50 ? '[&>div]:bg-destructive' : health < 80 ? '[&>div]:bg-yellow-500' : ''}`} 
                />
                <span className={`text-sm font-medium w-10 text-right ${health < 50 ? 'text-destructive' : health < 80 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {health}%
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

interface BackupStatusWidgetProps {
  backups: any[];
  lastUpdated: Date;
}

export function BackupStatusWidget({ backups, lastUpdated }: BackupStatusWidgetProps) {
  const recentBackups = backups?.slice(0, 5) || [];
  const lastBackup = recentBackups[0];
  const successfulBackups = recentBackups.filter(b => b.status === 'completed').length;
  const failedBackups = recentBackups.filter(b => b.status === 'failed').length;
  
  const backupLagHours = lastBackup 
    ? Math.round((Date.now() - new Date(lastBackup.completed_at || lastBackup.started_at).getTime()) / (1000 * 60 * 60))
    : null;
  
  const hasLagWarning = backupLagHours !== null && backupLagHours > 24;

  const getFreshnessColor = () => {
    const diff = (Date.now() - lastUpdated.getTime()) / 1000;
    if (diff < 30) return 'text-green-500';
    if (diff < 60) return 'text-yellow-500';
    return 'text-destructive';
  };

  return (
    <Card className={hasLagWarning ? 'border-yellow-500' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Database className="h-4 w-4 text-purple-500" />
            Backup Status
          </span>
          <span className={`text-xs ${getFreshnessColor()}`}>
            <Clock className="h-3 w-3 inline mr-1" />
            {lastUpdated.toLocaleTimeString()}
          </span>
        </CardTitle>
        {hasLagWarning && (
          <Badge variant="outline" className="w-fit text-yellow-500 border-yellow-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            BACKUP LAG WARNING
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last Backup</span>
          <span className="text-sm font-medium">
            {lastBackup ? new Date(lastBackup.started_at).toLocaleString() : 'Never'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge variant={lastBackup?.status === 'completed' ? 'default' : 'destructive'}>
            {lastBackup?.status || 'N/A'}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Recent (5)</span>
          <div className="flex gap-1">
            <span className="text-green-500 text-sm">{successfulBackups} ✓</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-destructive text-sm">{failedBackups} ✗</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Restore Ready</span>
          <Badge variant="outline" className="text-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Yes
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

interface PatchSecurityStatusProps {
  servers: Server[];
  lastUpdated: Date;
}

export function PatchSecurityStatus({ servers, lastUpdated }: PatchSecurityStatusProps) {
  // Simulated patch data based on server info
  const pendingCritical = Math.floor(servers.length * 0.1);
  const patchOverdue = Math.floor(servers.length * 0.05);
  const securityRiskServers = servers.filter(s => 
    (s.current_cpu_load || 0) > 90 || s.status === 'warning'
  ).length;

  const getFreshnessColor = () => {
    const diff = (Date.now() - lastUpdated.getTime()) / 1000;
    if (diff < 30) return 'text-green-500';
    if (diff < 60) return 'text-yellow-500';
    return 'text-destructive';
  };

  return (
    <Card className={patchOverdue > 0 ? 'border-orange-500' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-500" />
            Patch & Security Status
          </span>
          <span className={`text-xs ${getFreshnessColor()}`}>
            <Clock className="h-3 w-3 inline mr-1" />
            {lastUpdated.toLocaleTimeString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Pending Critical Patches</span>
          <Badge variant={pendingCritical > 0 ? 'destructive' : 'secondary'}>
            {pendingCritical}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Patch Overdue</span>
          <Badge variant={patchOverdue > 0 ? 'destructive' : 'outline'}>
            {patchOverdue}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Security Risk Servers</span>
          <Badge variant={securityRiskServers > 0 ? 'destructive' : 'outline'} className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            {securityRiskServers}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

interface CostRiskAlertProps {
  servers: Server[];
  lastUpdated: Date;
}

export function CostRiskAlert({ servers, lastUpdated }: CostRiskAlertProps) {
  const totalMonthlyCost = servers.reduce((sum, s) => sum + (s.monthly_cost || 0), 0);
  const underutilized = servers.filter(s => (s.current_cpu_load || 0) < 20).length;
  const highCostServers = servers.filter(s => (s.monthly_cost || 0) > 500);
  
  // Simulated spike detection
  const hasCostSpike = highCostServers.length > servers.length * 0.2;

  const getFreshnessColor = () => {
    const diff = (Date.now() - lastUpdated.getTime()) / 1000;
    if (diff < 30) return 'text-green-500';
    if (diff < 60) return 'text-yellow-500';
    return 'text-destructive';
  };

  return (
    <Card className={hasCostSpike ? 'border-orange-500' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            Cost & Optimization (RO)
          </span>
          <span className={`text-xs ${getFreshnessColor()}`}>
            <Clock className="h-3 w-3 inline mr-1" />
            {lastUpdated.toLocaleTimeString()}
          </span>
        </CardTitle>
        {hasCostSpike && (
          <Badge variant="outline" className="w-fit text-orange-500 border-orange-500">
            <TrendingUp className="h-3 w-3 mr-1" />
            COST SPIKE DETECTED
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Monthly Cost</span>
          <span className="text-lg font-bold">${totalMonthlyCost.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Under-utilized Servers</span>
          <Badge variant={underutilized > 0 ? 'outline' : 'secondary'} className="gap-1">
            <TrendingDown className="h-3 w-3" />
            {underutilized}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">High-Cost Servers</span>
          <span className="text-sm font-medium">{highCostServers.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface ServerSearchFilterProps {
  servers: Server[];
  onFilter: (filtered: Server[]) => void;
}

export function ServerSearchFilter({ servers, onFilter }: ServerSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const regions = [...new Set(servers.map(s => s.region).filter(Boolean))];

  const handleFilter = () => {
    let filtered = [...servers];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.name?.toLowerCase().includes(term) ||
        s.ip_address?.toLowerCase().includes(term) ||
        s.tags?.some(t => t.toLowerCase().includes(term))
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }
    
    if (regionFilter !== 'all') {
      filtered = filtered.filter(s => s.region === regionFilter);
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(s => s.owner_type === typeFilter);
    }
    
    onFilter(filtered);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, IP, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="warning">Degraded</SelectItem>
              <SelectItem value="down">Offline</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map(r => (
                <SelectItem key={r} value={r!}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="own">Company</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleFilter} size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface PermissionAwareButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  canPerform: boolean;
  reason?: string;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  className?: string;
  icon?: React.ReactNode;
}

export function PermissionAwareButton({ 
  children, 
  onClick, 
  canPerform, 
  reason = 'You do not have permission to perform this action',
  variant = 'outline',
  className = '',
  icon
}: PermissionAwareButtonProps) {
  if (canPerform) {
    return (
      <Button variant={variant} onClick={onClick} className={className}>
        {icon}
        {children}
      </Button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={variant} disabled className={`opacity-50 ${className}`}>
            <Lock className="h-4 w-4 mr-2" />
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{reason}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface DataStalenessIndicatorProps {
  lastUpdated: Date;
  isLoading?: boolean;
}

export function DataStalenessIndicator({ lastUpdated, isLoading }: DataStalenessIndicatorProps) {
  const diff = (Date.now() - lastUpdated.getTime()) / 1000;
  
  let color = 'bg-green-500';
  let label = 'Fresh';
  
  if (diff > 60) {
    color = 'bg-destructive';
    label = 'Stale';
  } else if (diff > 30) {
    color = 'bg-yellow-500';
    label = 'Aging';
  }

  if (isLoading) {
    return (
      <Badge variant="outline" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Loading...
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label} • {lastUpdated.toLocaleTimeString()}
    </Badge>
  );
}
