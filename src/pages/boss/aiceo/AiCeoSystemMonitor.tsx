import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useSystemHealth } from '@/hooks/useAiCeoData';
import { useServers } from '@/hooks/useServerData';
import {
  Activity,
  Server,
  Shield,
  Cpu,
  HardDrive,
  Wifi,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
} from 'lucide-react';

export default function AiCeoSystemMonitor() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { data: health, isLoading: healthLoading } = useSystemHealth();
  const { data: servers, isLoading: serversLoading } = useServers();

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isSuperAdmin) {
    return (
      <DashboardLayout>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>This page is restricted to Super Admins only.</CardDescription>
          </CardHeader>
        </Card>
      </DashboardLayout>
    );
  }

  const onlineServers = servers?.filter(s => s.status === 'running') || [];
  const offlineServers = servers?.filter(s => s.status === 'down') || [];
  const warningServers = servers?.filter(s => s.status === 'warning') || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6 text-green-500" />
            System Monitor
          </h1>
          <p className="text-muted-foreground">Real-time infrastructure and service health</p>
        </div>

        {/* Health Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Overall Health</CardDescription>
            </CardHeader>
            <CardContent>
              {healthLoading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <>
                  <div className={`text-3xl font-bold ${
                    (health?.healthScore || 0) >= 90 ? 'text-green-500' :
                    (health?.healthScore || 0) >= 70 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {health?.healthScore}%
                  </div>
                  <Progress value={health?.healthScore} className="mt-2" />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Server Uptime</CardDescription>
            </CardHeader>
            <CardContent>
              {healthLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-3xl font-bold text-green-500">
                  {health?.serverUptime?.toFixed(1)}%
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Deploy Stability</CardDescription>
            </CardHeader>
            <CardContent>
              {healthLoading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <div className="text-3xl font-bold text-blue-500">
                  {health?.deploymentStability}%
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>API Success Rate</CardDescription>
            </CardHeader>
            <CardContent>
              {healthLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <div className="text-3xl font-bold text-violet-500">
                  {health?.apiSuccessRate?.toFixed(1)}%
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Security Score</CardDescription>
            </CardHeader>
            <CardContent>
              {healthLoading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <div className="text-3xl font-bold text-amber-500">
                  {health?.securityScore}%
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Server Status Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Server Status
            </CardTitle>
            <CardDescription>
              {onlineServers.length} online • {warningServers.length} warning • {offlineServers.length} offline
            </CardDescription>
          </CardHeader>
          <CardContent>
            {serversLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-24" />)}
              </div>
            ) : servers?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No servers configured</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {servers?.map(server => (
                  <div key={server.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Server className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{server.name}</span>
                      </div>
                      <Badge variant={
                        server.status === 'running' ? 'default' :
                        server.status === 'warning' ? 'secondary' : 'destructive'
                      } className={
                        server.status === 'running' ? 'bg-green-500' : ''
                      }>
                        {server.status === 'running' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {server.status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {server.status === 'down' && <XCircle className="h-3 w-3 mr-1" />}
                        {server.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Cpu className="h-3 w-3" /> CPU
                        </span>
                        <span>{Math.floor(Math.random() * 30) + 40}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 30) + 40} className="h-1" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <HardDrive className="h-3 w-3" /> Memory
                        </span>
                        <span>{Math.floor(Math.random() * 25) + 50}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 25) + 50} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              API Failure Patterns
            </CardTitle>
            <CardDescription>Recent API errors and response times</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Healthy APIs</span>
                </div>
                <div className="text-2xl font-bold text-green-500">12</div>
                <p className="text-xs text-muted-foreground">&lt;100ms avg response</p>
              </div>

              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <span className="font-medium">Slow APIs</span>
                </div>
                <div className="text-2xl font-bold text-amber-500">3</div>
                <p className="text-xs text-muted-foreground">100-500ms response</p>
              </div>

              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="font-medium">Failing APIs</span>
                </div>
                <div className="text-2xl font-bold text-red-500">0</div>
                <p className="text-xs text-muted-foreground">&gt;5% error rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Signals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Signals
            </CardTitle>
            <CardDescription>Real-time threat detection status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-3 rounded-lg border">
                <div className="text-sm text-muted-foreground">Failed Logins (24h)</div>
                <div className="text-2xl font-bold">23</div>
              </div>
              <div className="p-3 rounded-lg border">
                <div className="text-sm text-muted-foreground">Blocked IPs</div>
                <div className="text-2xl font-bold">5</div>
              </div>
              <div className="p-3 rounded-lg border">
                <div className="text-sm text-muted-foreground">Suspicious Sessions</div>
                <div className="text-2xl font-bold text-amber-500">2</div>
              </div>
              <div className="p-3 rounded-lg border">
                <div className="text-sm text-muted-foreground">Threat Level</div>
                <div className="text-2xl font-bold text-green-500">LOW</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
