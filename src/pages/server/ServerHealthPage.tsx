import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useServers, useServerRealtime, Server } from '@/hooks/useServerData';

export default function ServerHealthPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  
  useServerRealtime();
  
  const { data: servers, isLoading } = useServers();
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'maintenance':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getLoadColor = (load: number) => {
    if (load > 80) return 'bg-destructive';
    if (load > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const healthyServers = servers?.filter(s => s.status === 'running').length || 0;
  const warningServers = servers?.filter(s => s.status === 'warning').length || 0;
  const downServers = servers?.filter(s => s.status === 'down' || s.status === 'maintenance').length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              Server Health Monitor
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time server health status
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Healthy</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-3xl font-bold">{healthyServers}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Warning</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  <span className="text-3xl font-bold">{warningServers}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Down / Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-6 w-6 text-destructive" />
                  <span className="text-3xl font-bold">{downServers}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Server Health Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))
          ) : (
            servers?.map((server) => {
              const isPending = server.status === 'maintenance';
              const showMetrics = !isPending;

              const cpuText = showMetrics && server.current_cpu_load !== null
                ? `${server.current_cpu_load}%`
                : 'Waiting for data…';

              const ramText = showMetrics && server.current_ram_load !== null
                ? `${server.current_ram_load}%`
                : 'Waiting for data…';

              const diskText = showMetrics && server.current_disk_usage !== null
                ? `${server.current_disk_usage}%`
                : 'Waiting for data…';

              return (
                <Card key={server.id} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    server.status === 'running' ? 'bg-green-500' :
                    server.status === 'warning' ? 'bg-yellow-500' :
                    server.status === 'maintenance' ? 'bg-yellow-500' :
                    'bg-destructive'
                  }`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getStatusIcon(server.status)}
                        {server.name}
                      </CardTitle>
                      <Badge variant={server.owner_type === 'own' ? 'default' : 'secondary'}>
                        {server.owner_type === 'own' ? 'Company' : 'Client'}
                      </Badge>
                    </div>
                    <CardDescription>
                      {server.provider}{server.region ? ` • ${server.region}` : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Cpu className="h-3 w-3" /> CPU
                        </span>
                        <span className="font-medium">{cpuText}</span>
                      </div>
                      {showMetrics && server.current_cpu_load !== null ? (
                        <Progress value={server.current_cpu_load} className="h-2" />
                      ) : (
                        <Skeleton className="h-2 w-full" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <MemoryStick className="h-3 w-3" /> RAM
                        </span>
                        <span className="font-medium">{ramText}</span>
                      </div>
                      {showMetrics && server.current_ram_load !== null ? (
                        <Progress value={server.current_ram_load} className="h-2" />
                      ) : (
                        <Skeleton className="h-2 w-full" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3" /> Disk
                        </span>
                        <span className="font-medium">{diskText}</span>
                      </div>
                      {showMetrics && server.current_disk_usage !== null ? (
                        <Progress value={server.current_disk_usage} className="h-2" />
                      ) : (
                        <Skeleton className="h-2 w-full" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
