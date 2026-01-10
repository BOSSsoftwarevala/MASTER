import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Clock,
  Cpu,
  Eye,
  HardDrive,
  Server,
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useActiveIncidents, useServerRealtime, useServers, useServerSummary } from '@/hooks/useServerData';

export default function ServerSnapshotPage() {
  const navigate = useNavigate();
  const { isSuperAdmin, isAdmin } = useUserRoles();

  useServerRealtime();

  const { data: servers, isLoading: serversLoading } = useServers();
  const { data: incidents, isLoading: incidentsLoading } = useActiveIncidents();
  const { data: summary, isLoading: summaryLoading } = useServerSummary();

  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'down':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  const getProgressColor = (value: number) => {
    if (value > 80) return 'bg-destructive';
    if (value > 60) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <DashboardLayout>
      <main className="space-y-6">
        <header>
          <h1 className="text-3xl font-display font-bold text-foreground">Server Monitoring Snapshot</h1>
          <p className="text-muted-foreground mt-1">Read-only overview. Use other Server Manager sections for actions.</p>
          <Badge variant="outline" className="mt-2">
            <Eye className="h-3 w-3 mr-1" />
            Snapshot Only
          </Badge>
        </header>

        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-foreground">Need to take action?</p>
                <p className="text-sm text-muted-foreground">Open Server Home or Add Server from the sidebar.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" onClick={() => navigate('/dashboard/boss/server')}>
                  Open Server Home
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button onClick={() => navigate('/dashboard/boss/server/add')}>
                  Add Server
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-4" aria-label="Server snapshot summary">
          <Card className="border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Servers</CardTitle>
              <Server className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">{summary?.total || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">{summary?.own || 0} own • {summary?.client || 0} client</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Healthy</CardTitle>
              <Activity className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-success">{summary?.running || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Operating normally</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Warnings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-warning">{summary?.warning || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-info">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Incidents</CardTitle>
              <Clock className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              {incidentsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">{incidents?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Pending review</p>
                </>
              )}
            </CardContent>
          </Card>
        </section>

        <section aria-label="Server list snapshot">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Server Status
              </CardTitle>
              <CardDescription>Current health of servers (snapshot view)</CardDescription>
            </CardHeader>
            <CardContent>
              {serversLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : !servers?.length ? (
                <p className="text-sm text-muted-foreground text-center py-8">No servers configured</p>
              ) : (
                <div className="space-y-4">
                  {servers.slice(0, 6).map((server) => (
                    <article key={server.id} className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${getStatusColor(server.status)}`} aria-hidden />
                          <span className="font-medium text-foreground">{server.name}</span>
                          <Badge variant="outline" className="capitalize text-xs">{server.owner_type}</Badge>
                        </div>
                        <Badge
                          variant={server.status === 'running' ? 'default' : server.status === 'warning' ? 'secondary' : 'destructive'}
                        >
                          {server.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <Cpu className="h-3 w-3" />
                            CPU: {server.current_cpu_load || 0}%
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getProgressColor(server.current_cpu_load || 0)}`}
                              style={{ width: `${server.current_cpu_load || 0}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <Activity className="h-3 w-3" />
                            Memory: {server.current_ram_load || 0}%
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getProgressColor(server.current_ram_load || 0)}`}
                              style={{ width: `${server.current_ram_load || 0}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <HardDrive className="h-3 w-3" />
                            Disk: {server.current_disk_usage || 0}%
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getProgressColor(server.current_disk_usage || 0)}`}
                              style={{ width: `${server.current_disk_usage || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground">Provider: {server.provider} • Region: {server.region || 'N/A'}</p>
                    </article>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </DashboardLayout>
  );
}
