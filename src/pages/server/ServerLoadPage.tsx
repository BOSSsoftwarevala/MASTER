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
  Gauge, 
  TrendingUp,
  TrendingDown,
  Cpu,
  MemoryStick,
  HardDrive,
  Activity
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useServers, useServerRealtime } from '@/hooks/useServerData';

export default function ServerLoadPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  
  useServerRealtime();
  
  const { data: servers, isLoading } = useServers();
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const avgCpu = servers?.length 
    ? Math.round(servers.reduce((sum, s) => sum + (s.current_cpu_load || 0), 0) / servers.length)
    : 0;
  const avgRam = servers?.length 
    ? Math.round(servers.reduce((sum, s) => sum + (s.current_ram_load || 0), 0) / servers.length)
    : 0;
  const avgDisk = servers?.length 
    ? Math.round(servers.reduce((sum, s) => sum + (s.current_disk_usage || 0), 0) / servers.length)
    : 0;

  const highLoadServers = servers?.filter(s => (s.current_cpu_load || 0) > 80).length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Gauge className="h-8 w-8 text-primary" />
              Server Load Monitor
            </h1>
            <p className="text-muted-foreground mt-1">
              CPU, Memory, and Disk usage across all servers
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-1">
                <Cpu className="h-4 w-4" /> Avg CPU
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{avgCpu}%</span>
                  {avgCpu > 70 ? (
                    <TrendingUp className="h-5 w-5 text-destructive" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-green-500" />
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-1">
                <MemoryStick className="h-4 w-4" /> Avg RAM
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{avgRam}%</span>
                  {avgRam > 70 ? (
                    <TrendingUp className="h-5 w-5 text-destructive" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-green-500" />
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-1">
                <HardDrive className="h-4 w-4" /> Avg Disk
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{avgDisk}%</span>
                  {avgDisk > 70 ? (
                    <TrendingUp className="h-5 w-5 text-destructive" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-green-500" />
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={highLoadServers > 0 ? 'border-destructive' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">High Load Servers</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-destructive">{highLoadServers}</span>
                  <span className="text-sm text-muted-foreground">&gt;80% CPU</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Server Load Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Current Server Load
            </CardTitle>
            <CardDescription>Real-time resource utilization</CardDescription>
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
                    <TableHead>Type</TableHead>
                    <TableHead>CPU Load</TableHead>
                    <TableHead>RAM Usage</TableHead>
                    <TableHead>Disk Usage</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servers?.sort((a, b) => (b.current_cpu_load || 0) - (a.current_cpu_load || 0)).map((server) => (
                    <TableRow key={server.id}>
                      <TableCell className="font-medium">{server.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{server.owner_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                (server.current_cpu_load || 0) > 80 ? 'bg-destructive' : 
                                (server.current_cpu_load || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${server.current_cpu_load || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12">{server.current_cpu_load || 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                (server.current_ram_load || 0) > 80 ? 'bg-destructive' : 
                                (server.current_ram_load || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${server.current_ram_load || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12">{server.current_ram_load || 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                (server.current_disk_usage || 0) > 80 ? 'bg-destructive' : 
                                (server.current_disk_usage || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${server.current_disk_usage || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12">{server.current_disk_usage || 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          server.status === 'running' ? 'default' : 
                          server.status === 'warning' ? 'secondary' : 'destructive'
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
