import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Plus,
  AlertOctagon,
  Calendar,
  Shield,
  Cpu,
  HardDrive,
  Wifi,
  Scaling,
  Eye,
  Settings,
  Snowflake,
  Bell,
  Clock,
  Wrench,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  RefreshCw,
  Database,
  FileText
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  useServerSummary, 
  useActiveIncidents, 
  useServerRealtime,
  useServerMaintenance,
  useScalingEvents,
  useAutoScalingPolicies,
  useServerAlerts,
  useServers,
  useServerBackups,
  type Server as ServerType
} from '@/hooks/useServerData';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  ServerStateDistribution,
  ClientImpactView,
  CommandStatusWidget,
  ServerGroupSummary,
  BackupStatusWidget,
  PatchSecurityStatus,
  CostRiskAlert,
  ServerSearchFilter,
  PermissionAwareButton,
  DataStalenessIndicator,
  type WidgetServer
} from '@/components/server/ServerDashboardWidgets';

export default function ServerManagerDashboard() {
  const { isSuperAdmin, isAdmin, loading: rolesLoading } = useUserRoles();
  const navigate = useNavigate();
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [filteredServers, setFilteredServers] = useState<WidgetServer[]>([]);
  
  useServerRealtime();
  
  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useServerSummary();
  const { data: incidents, isLoading: incidentsLoading } = useActiveIncidents();
  const { data: maintenance } = useServerMaintenance();
  const { data: scalingEvents } = useScalingEvents(24);
  const { data: scalingPolicies } = useAutoScalingPolicies();
  const { data: alerts } = useServerAlerts();
  const { data: servers, isLoading: serversLoading } = useServers();
  const { data: backups } = useServerBackups();
  
  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchSummary();
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [refetchSummary]);

  // Initialize filtered servers
  useEffect(() => {
    if (servers) {
      setFilteredServers(servers);
    }
  }, [servers]);

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Calculate additional metrics
  const companyServers = servers?.filter(s => s.owner_type === 'own').length || 0;
  const clientServers = servers?.filter(s => s.owner_type === 'client').length || 0;
  const degradedServers = servers?.filter(s => s.status === 'warning').length || 0;
  const maintenanceServers = servers?.filter(s => s.status === 'maintenance').length || 0;
  
  const avgCpu = servers?.length ? Math.round(servers.reduce((sum, s) => sum + (s.current_cpu_load || 0), 0) / servers.length) : 0;
  const avgRam = servers?.length ? Math.round(servers.reduce((sum, s) => sum + (s.current_ram_load || 0), 0) / servers.length) : 0;
  const avgDisk = servers?.length ? Math.round(servers.reduce((sum, s) => sum + (s.current_disk_usage || 0), 0) / servers.length) : 0;
  
  const activeScalingRules = scalingPolicies?.filter(p => p.is_enabled).length || 0;
  const scalingEventsLast24h = scalingEvents?.length || 0;
  
  const criticalAlerts = alerts?.filter(a => a.severity === 'critical').length || 0;
  const warningAlerts = alerts?.filter(a => a.severity === 'high' || a.severity === 'medium').length || 0;
  const infoAlerts = alerts?.filter(a => a.severity === 'low').length || 0;
  
  // Expiry calculations
  const now = new Date();
  const expiry7Days = servers?.filter(s => {
    if (!s.expires_at) return false;
    const exp = new Date(s.expires_at);
    const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 7;
  }).length || 0;
  
  const expiry15Days = servers?.filter(s => {
    if (!s.expires_at) return false;
    const exp = new Date(s.expires_at);
    const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 7 && diff <= 15;
  }).length || 0;
  
  const expiry30Days = servers?.filter(s => {
    if (!s.expires_at) return false;
    const exp = new Date(s.expires_at);
    const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 15 && diff <= 30;
  }).length || 0;

  const upcomingMaintenance = maintenance?.filter(m => m.status === 'scheduled').slice(0, 5) || [];
  
  const handleEmergencyFreeze = () => {
    toast.success('Emergency freeze initiated - All server operations paused');
    setFreezeDialogOpen(false);
  };

  const canPerformCriticalActions = isSuperAdmin();

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[hsl(var(--boss-canvas))] p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-[hsl(var(--boss-text))]">
              <Server className="h-8 w-8 text-[hsl(var(--boss-accent))]" />
              Server Manager Dashboard
            </h1>
            <div className="text-[hsl(var(--boss-text-muted))] mt-1 flex items-center gap-2 flex-wrap">
              <span>Live Infrastructure Control Center</span>
              <DataStalenessIndicator lastUpdated={lastRefresh} isLoading={summaryLoading} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { refetchSummary(); setLastRefresh(new Date()); }} className="gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))] hover:bg-[hsl(var(--boss-card))]">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <PermissionAwareButton
              onClick={() => navigate('/dashboard/boss/server/add')}
              canPerform={isAdmin() || isSuperAdmin()}
              reason="Only Admins can add servers"
              className="gap-2 bg-[hsl(var(--boss-accent))] hover:bg-[hsl(var(--boss-accent))]/90"
              variant="default"
            >
              <Plus className="h-4 w-4" />
              Add Server
            </PermissionAwareButton>
          </div>
        </div>

        {/* GLOBAL SEARCH & FILTER */}
        <ServerSearchFilter 
          servers={servers || []} 
          onFilter={setFilteredServers} 
        />

        {/* TOP SUMMARY WIDGETS - Row 1: Server Counts */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="border-l-4 border-l-[hsl(var(--boss-accent))] bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-[hsl(var(--boss-text-muted))] uppercase tracking-wider">Total Servers</CardTitle>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-8 w-16 bg-[hsl(var(--boss-card-elevated))]" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-[hsl(var(--boss-text))]">{summary?.total || 0}</div>
                  <div className="flex gap-2 mt-1 text-xs text-[hsl(var(--boss-text-muted))]">
                    <span className="flex items-center gap-1">
                      <Server className="h-3 w-3" /> {companyServers} Own
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" /> {clientServers} Client
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-[hsl(var(--boss-text-muted))] uppercase tracking-wider">Online</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
                <span className="text-3xl font-bold text-[hsl(var(--boss-text))]">{summary?.running || 0}</span>
              </div>
              <div className="h-1.5 w-full bg-[hsl(var(--boss-card-elevated))] rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${summary?.total ? ((summary.running || 0) / summary.total) * 100 : 0}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-[hsl(var(--boss-text-muted))] uppercase tracking-wider">Degraded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-400" />
                <span className="text-3xl font-bold text-[hsl(var(--boss-text))]">{degradedServers}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-[hsl(var(--boss-text-muted))] uppercase tracking-wider">Offline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <XCircle className="h-6 w-6 text-red-400" />
                <span className="text-3xl font-bold text-[hsl(var(--boss-text))]">{summary?.down || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-[hsl(var(--boss-text-muted))] uppercase tracking-wider">Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Wrench className="h-6 w-6 text-blue-400" />
                <span className="text-3xl font-bold text-[hsl(var(--boss-text))]">{maintenanceServers}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-[hsl(var(--boss-text-muted))] uppercase tracking-wider">Active Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertOctagon className="h-6 w-6 text-orange-400" />
                <span className="text-3xl font-bold text-[hsl(var(--boss-text))]">{incidents?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NEW WIDGETS ROW - State Distribution, Client Impact, Command Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ServerStateDistribution 
            servers={servers || []} 
            lastUpdated={lastRefresh} 
          />
          <ClientImpactView 
            incidents={incidents || []} 
            servers={servers || []} 
            lastUpdated={lastRefresh} 
          />
          <CommandStatusWidget 
            scalingEvents={scalingEvents || []} 
            lastUpdated={lastRefresh} 
          />
        </div>

        {/* TOP SUMMARY WIDGETS - Row 2: Resource Load (LIVE) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <Cpu className="h-4 w-4 text-blue-400" />
                Avg CPU Load
                <Badge variant="outline" className="ml-auto text-xs border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))]">LIVE</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-[hsl(var(--boss-text))]">{avgCpu}%</span>
                <span className={`text-sm flex items-center ${avgCpu > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {avgCpu > 70 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </span>
              </div>
              <Progress value={avgCpu} className="mt-3 bg-[hsl(var(--boss-card-elevated))]" />
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <HardDrive className="h-4 w-4 text-purple-400" />
                Avg RAM Usage
                <Badge variant="outline" className="ml-auto text-xs border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))]">LIVE</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-[hsl(var(--boss-text))]">{avgRam}%</span>
                <span className={`text-sm flex items-center ${avgRam > 80 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {avgRam > 80 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </span>
              </div>
              <Progress value={avgRam} className="mt-3 bg-[hsl(var(--boss-card-elevated))]" />
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <Wifi className="h-4 w-4 text-cyan-400" />
                Avg Disk Usage
                <Badge variant="outline" className="ml-auto text-xs border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))]">LIVE</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-[hsl(var(--boss-text))]">{avgDisk}%</span>
                <span className={`text-sm flex items-center ${avgDisk > 85 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {avgDisk > 85 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </span>
              </div>
              <Progress value={avgDisk} className="mt-3 bg-[hsl(var(--boss-card-elevated))]" />
            </CardContent>
          </Card>
        </div>

        {/* NEW WIDGETS ROW - Group Summary, Backup, Patch, Cost */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ServerGroupSummary 
            servers={servers || []} 
            lastUpdated={lastRefresh} 
          />
          <BackupStatusWidget 
            backups={backups || []} 
            lastUpdated={lastRefresh} 
          />
          <PatchSecurityStatus 
            servers={servers || []} 
            lastUpdated={lastRefresh} 
          />
          <CostRiskAlert 
            servers={servers || []} 
            lastUpdated={lastRefresh} 
          />
        </div>

        {/* TOP SUMMARY WIDGETS - Row 3: Auto-Scaling, Alerts, Expiry */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Auto-Scaling */}
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <Scaling className="h-4 w-4 text-[hsl(var(--boss-accent))]" />
                Auto-Scaling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[hsl(var(--boss-text-muted))]">Active Rules</span>
                <Badge className="bg-[hsl(var(--boss-card-elevated))] text-[hsl(var(--boss-text))] border-[hsl(var(--boss-border))]">{activeScalingRules}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--boss-text-muted))]">Events (24h)</span>
                <Badge variant="outline" className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))]">{scalingEventsLast24h}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <Bell className="h-4 w-4 text-amber-400" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{criticalAlerts}</div>
                  <div className="text-xs text-[hsl(var(--boss-text-muted))]">Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{warningAlerts}</div>
                  <div className="text-xs text-[hsl(var(--boss-text-muted))]">Warning</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{infoAlerts}</div>
                  <div className="text-xs text-[hsl(var(--boss-text-muted))]">Info</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expiry / Renewal */}
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <Clock className="h-4 w-4 text-orange-400" />
                Expiry / Renewal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{expiry7Days}</div>
                  <div className="text-xs text-[hsl(var(--boss-text-muted))]">7 Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{expiry15Days}</div>
                  <div className="text-xs text-[hsl(var(--boss-text-muted))]">15 Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{expiry30Days}</div>
                  <div className="text-xs text-[hsl(var(--boss-text-muted))]">30 Days</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QUICK ACTION BAR - WITH PERMISSION VISIBILITY */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-[hsl(var(--boss-text))]">
              <Zap className="h-5 w-5 text-[hsl(var(--boss-accent))]" />
              Quick Actions
              <Badge variant="outline" className="ml-auto text-xs border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))]">
                {canPerformCriticalActions ? 'Full Access' : 'Limited Access'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              <PermissionAwareButton
                onClick={() => navigate('/dashboard/boss/server/add')}
                canPerform={isAdmin() || isSuperAdmin()}
                reason="Only Admins can add servers"
                className="h-auto py-4 flex flex-col items-center gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))] hover:border-[hsl(var(--boss-accent))] hover:bg-[hsl(var(--boss-accent))]/10 hover:text-[hsl(var(--boss-text))]"
                variant="outline"
              >
                <Plus className="h-5 w-5 text-[hsl(var(--boss-accent))]" />
                <span className="text-xs">Add Server</span>
              </PermissionAwareButton>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))] hover:border-blue-400 hover:bg-blue-400/10 hover:text-[hsl(var(--boss-text))]"
                onClick={() => navigate('/dashboard/boss/server/monitoring/health')}
              >
                <Eye className="h-5 w-5 text-blue-400" />
                <span className="text-xs">Monitoring</span>
              </Button>
              
              <PermissionAwareButton
                onClick={() => navigate('/dashboard/boss/server/scaling/auto')}
                canPerform={isAdmin() || isSuperAdmin()}
                reason="Only Admins can configure scaling"
                className="h-auto py-4 flex flex-col items-center gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))] hover:border-purple-400 hover:bg-purple-400/10 hover:text-[hsl(var(--boss-text))]"
                variant="outline"
              >
                <Settings className="h-5 w-5 text-purple-400" />
                <span className="text-xs">Scaling</span>
              </PermissionAwareButton>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))] hover:border-emerald-400 hover:bg-emerald-400/10 hover:text-[hsl(var(--boss-text))]"
                onClick={() => navigate('/dashboard/boss/server/security/access-control')}
              >
                <Shield className="h-5 w-5 text-emerald-400" />
                <span className="text-xs">Security</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))] hover:border-amber-400 hover:bg-amber-400/10 hover:text-[hsl(var(--boss-text))]"
                onClick={() => navigate('/dashboard/boss/server/alerts')}
              >
                <Bell className="h-5 w-5 text-amber-400" />
                <span className="text-xs">Alerts</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))] hover:border-purple-400 hover:bg-purple-400/10 hover:text-[hsl(var(--boss-text))]"
                onClick={() => navigate('/dashboard/boss/server/backups')}
              >
                <Database className="h-5 w-5 text-purple-400" />
                <span className="text-xs">Backup</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))] hover:border-orange-400 hover:bg-orange-400/10 hover:text-[hsl(var(--boss-text))]"
                onClick={() => navigate('/dashboard/boss/server/incidents')}
              >
                <AlertOctagon className="h-5 w-5 text-orange-400" />
                <span className="text-xs">Incidents</span>
              </Button>
              
              <PermissionAwareButton
                onClick={() => setFreezeDialogOpen(true)}
                canPerform={canPerformCriticalActions}
                reason="Only Super Admins can trigger Emergency Freeze"
                className="h-auto py-4 flex flex-col items-center gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))] hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-[hsl(var(--boss-text))]"
                variant="outline"
              >
                <Snowflake className="h-5 w-5 text-cyan-400" />
                <span className="text-xs">Freeze</span>
              </PermissionAwareButton>
            </div>
          </CardContent>
        </Card>

        {/* LIVE VISUAL PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incident Feed */}
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <AlertOctagon className="h-5 w-5 text-orange-400" />
                Active Incident Feed
                <Badge variant="outline" className="ml-auto border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))]">P1–P4</Badge>
              </CardTitle>
              <CardDescription className="text-[hsl(var(--boss-text-muted))]">Real-time incident tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
              {incidentsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full bg-[hsl(var(--boss-card-elevated))]" />
                  <Skeleton className="h-12 w-full bg-[hsl(var(--boss-card-elevated))]" />
                </div>
              ) : incidents?.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-emerald-400 mb-2" />
                  <p className="text-sm text-[hsl(var(--boss-text-muted))]">No active incidents</p>
                </div>
              ) : (
                incidents?.slice(0, 5).map((incident) => (
                  <div 
                    key={incident.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--boss-card-elevated))] hover:border-[hsl(var(--boss-accent))]/30 border border-transparent cursor-pointer transition-colors"
                    onClick={() => navigate('/dashboard/boss/server/incidents')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${
                        incident.severity === 'critical' ? 'bg-red-500 animate-pulse' :
                        incident.severity === 'high' ? 'bg-orange-400' :
                        incident.severity === 'medium' ? 'bg-amber-400' : 'bg-blue-400'
                      }`} />
                      <div>
                        <p className="font-medium text-sm text-[hsl(var(--boss-text))]">{incident.title}</p>
                        <p className="text-xs text-[hsl(var(--boss-text-muted))]">{incident.servers?.name || 'Unknown server'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={incident.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-[hsl(var(--boss-card))] text-[hsl(var(--boss-text-muted))] border-[hsl(var(--boss-border))]'}>
                        {incident.severity}
                      </Badge>
                      <p className="text-xs text-[hsl(var(--boss-text-muted))] mt-1">
                        {new Date(incident.started_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Auto-Scaling Events Feed */}
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <Scaling className="h-5 w-5 text-[hsl(var(--boss-accent))]" />
                Auto-Scaling Events
                <Badge variant="outline" className="ml-auto border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))]">Last 24h</Badge>
              </CardTitle>
              <CardDescription className="text-[hsl(var(--boss-text-muted))]">Recent scaling activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
              {scalingEvents?.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto text-[hsl(var(--boss-text-muted))] mb-2" />
                  <p className="text-sm text-[hsl(var(--boss-text-muted))]">No scaling events in the last 24h</p>
                </div>
              ) : (
                scalingEvents?.slice(0, 5).map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--boss-card-elevated))]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        event.action === 'scale_up' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
                      }`}>
                        {event.action === 'scale_up' ? (
                          <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-blue-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[hsl(var(--boss-text))]">{event.action === 'scale_up' ? 'Scale Up' : 'Scale Down'}</p>
                        <p className="text-xs text-[hsl(var(--boss-text-muted))]">{event.servers?.name || 'Unknown server'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-[hsl(var(--boss-card))] text-[hsl(var(--boss-text))] border-[hsl(var(--boss-border))]">
                        {event.from_instances} → {event.to_instances}
                      </Badge>
                      <p className="text-xs text-[hsl(var(--boss-text-muted))] mt-1">
                        {new Date(event.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Maintenance */}
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <Calendar className="h-5 w-5 text-[hsl(var(--boss-accent))]" />
                Upcoming Maintenance
              </CardTitle>
              <CardDescription className="text-[hsl(var(--boss-text-muted))]">Scheduled maintenance windows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingMaintenance.length === 0 ? (
                <p className="text-sm text-[hsl(var(--boss-text-muted))] text-center py-4">No upcoming maintenance scheduled</p>
              ) : (
                upcomingMaintenance.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--boss-card-elevated))]">
                    <div>
                      <p className="font-medium text-[hsl(var(--boss-text))]">{m.title}</p>
                      <p className="text-sm text-[hsl(var(--boss-text-muted))]">{m.servers?.name || 'Unknown server'}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))]">{m.maintenance_type}</Badge>
                      <p className="text-xs text-[hsl(var(--boss-text-muted))] mt-1">
                        {new Date(m.scheduled_start).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                Recent Alerts
              </CardTitle>
              <CardDescription className="text-[hsl(var(--boss-text-muted))]">Latest infrastructure alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
              {alerts?.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-emerald-400 mb-2" />
                  <p className="text-sm text-[hsl(var(--boss-text-muted))]">No active alerts</p>
                </div>
              ) : (
                alerts?.slice(0, 5).map((alert) => (
                  <div 
                    key={alert.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--boss-card-elevated))] hover:border-[hsl(var(--boss-accent))]/30 border border-transparent cursor-pointer transition-colors"
                    onClick={() => navigate('/dashboard/boss/server/alerts')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${
                        alert.severity === 'critical' ? 'bg-red-500' :
                        alert.severity === 'high' ? 'bg-orange-400' :
                        alert.severity === 'medium' ? 'bg-amber-400' : 'bg-blue-400'
                      }`} />
                      <div>
                        <p className="font-medium text-sm text-[hsl(var(--boss-text))]">{alert.title}</p>
                        <p className="text-xs text-[hsl(var(--boss-text-muted))]">{alert.servers?.name || 'System'}</p>
                      </div>
                    </div>
                    <Badge className={alert.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-[hsl(var(--boss-card))] text-[hsl(var(--boss-text-muted))] border-[hsl(var(--boss-border))]'}>
                      {alert.severity}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Emergency Freeze Dialog */}
      <Dialog open={freezeDialogOpen} onOpenChange={setFreezeDialogOpen}>
        <DialogContent className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <Snowflake className="h-5 w-5" />
              Emergency Freeze
            </DialogTitle>
            <DialogDescription className="text-[hsl(var(--boss-text-muted))]">
              This will immediately pause all server operations, auto-scaling, and maintenance tasks. 
              This action is logged and reversible.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-sm font-medium text-red-400">Warning: This is a critical operation</p>
            <ul className="text-sm text-[hsl(var(--boss-text-muted))] mt-2 space-y-1">
              <li>• All auto-scaling will be disabled</li>
              <li>• Scheduled maintenance will be postponed</li>
              <li>• No new deployments will be allowed</li>
              <li>• All server access will be restricted</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFreezeDialogOpen(false)} className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))] hover:bg-[hsl(var(--boss-card-elevated))]">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleEmergencyFreeze} className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
              Confirm Freeze
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
