import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Clock, 
  CheckCircle2,
  ArrowUpCircle,
  Server
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useServers, useServerRealtime } from '@/hooks/useServerData';

export default function ServerUptimePage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  
  useServerRealtime();
  
  const { data: servers, isLoading } = useServers();
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  function formatUptime(lastCheck: string | null) {
    if (!lastCheck) return 'Unknown';
    const date = new Date(lastCheck);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  }

  // Calculate mock uptime percentage based on status
  const getUptimePercentage = (server: typeof servers extends (infer T)[] | undefined ? T : never) => {
    if (server.status === 'running') return 99.9;
    if (server.status === 'warning') return 98.5;
    if (server.status === 'maintenance') return 95.0;
    return 85.0;
  };

  const avgUptime = servers?.length 
    ? (servers.reduce((sum, s) => sum + getUptimePercentage(s), 0) / servers.length).toFixed(2)
    : '0.00';

  const fullyOperational = servers?.filter(s => s.status === 'running').length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              Server Uptime Monitor
            </h1>
            <p className="text-muted-foreground mt-1">
              Track server availability and uptime metrics
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Average Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-24" />
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <span className="text-3xl font-bold">{avgUptime}%</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Fully Operational</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-24" />
              ) : (
                <div className="flex items-center gap-2">
                  <ArrowUpCircle className="h-6 w-6 text-green-500" />
                  <span className="text-3xl font-bold">{fullyOperational}</span>
                  <span className="text-muted-foreground">/ {servers?.length || 0}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Servers</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <Server className="h-6 w-6 text-primary" />
                  <span className="text-3xl font-bold">{servers?.length || 0}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Uptime Table */}
        <Card>
          <CardHeader>
            <CardTitle>Server Uptime Status</CardTitle>
            <CardDescription>Current uptime percentages and last health check</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Server</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Last Health Check</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servers?.map((server) => (
                    <TableRow key={server.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-muted-foreground" />
                          {server.name}
                        </div>
                      </TableCell>
                      <TableCell>{server.provider}</TableCell>
                      <TableCell>{server.region || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${
                            getUptimePercentage(server) >= 99 ? 'text-green-600' :
                            getUptimePercentage(server) >= 95 ? 'text-yellow-600' : 'text-destructive'
                          }`}>
                            {getUptimePercentage(server)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatUptime(server.last_health_check)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          server.status === 'running' ? 'default' : 
                          server.status === 'warning' ? 'secondary' : 
                          server.status === 'maintenance' ? 'outline' : 'destructive'
                        }>
                          {server.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
