import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Server, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Cpu,
  HardDrive
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useServerSummary, useServers, useActiveIncidents, useServerRealtime } from '@/hooks/useServerData';

export default function ServerOverviewPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  
  // Enable real-time updates
  useServerRealtime();
  
  const { data: summary, isLoading: summaryLoading } = useServerSummary();
  const { data: servers, isLoading: serversLoading } = useServers();
  const { data: incidents, isLoading: incidentsLoading } = useActiveIncidents();
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const topServers = servers
    ?.sort((a, b) => (b.current_cpu_load || 0) - (a.current_cpu_load || 0))
    .slice(0, 4) || [];

  const recentAlerts = incidents?.slice(0, 5).map(incident => ({
    id: incident.id,
    server: incident.servers?.name || 'Unknown',
    type: incident.title,
    level: incident.severity === 'critical' ? 'critical' : 'warning',
    time: formatTimeAgo(incident.started_at)
  })) || [];

  function formatTimeAgo(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Server className="h-8 w-8 text-primary" />
              Server Overview
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time infrastructure monitoring • VIEW ONLY
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Read-Only View
          </Badge>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Servers</CardTitle>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-3xl font-bold">{summary?.total || 0}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {summary?.own || 0} Own • {summary?.client || 0} Client
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Live Status</CardTitle>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-bold">{summary?.running || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold">{summary?.warning || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="font-bold">{summary?.down || 0}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Load</CardTitle>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-3xl font-bold">{summary?.totalLoad || 0}%</div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${summary?.totalLoad || 0}%` }}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Cost</CardTitle>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-3xl font-bold">₹{(summary?.monthlyCost || 0).toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {incidents?.length || 0} Active Alerts
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Recent Alerts
              </CardTitle>
              <CardDescription>Latest infrastructure warnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {incidentsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))
              ) : recentAlerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No active alerts</p>
              ) : (
                recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${
                        alert.level === 'critical' ? 'bg-destructive animate-pulse' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium">{alert.server}</p>
                        <p className="text-sm text-muted-foreground">{alert.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={alert.level === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.level}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Top Servers by Load */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Top Servers by Load
              </CardTitle>
              <CardDescription>Highest resource utilization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {serversLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))
              ) : topServers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No servers found</p>
              ) : (
                topServers.map((server) => (
                  <div key={server.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{server.name}</span>
                        <Badge variant="outline" className="text-xs capitalize">{server.owner_type}</Badge>
                      </div>
                      <Badge variant={server.status === 'warning' ? 'secondary' : server.status === 'down' ? 'destructive' : 'default'}>
                        {server.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Cpu className="h-3 w-3" /> CPU
                          </span>
                          <span>{server.current_cpu_load || 0}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${(server.current_cpu_load || 0) > 80 ? 'bg-destructive' : 'bg-primary'}`}
                            style={{ width: `${server.current_cpu_load || 0}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3" /> RAM
                          </span>
                          <span>{server.current_ram_load || 0}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${(server.current_ram_load || 0) > 80 ? 'bg-destructive' : 'bg-blue-500'}`}
                            style={{ width: `${server.current_ram_load || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}