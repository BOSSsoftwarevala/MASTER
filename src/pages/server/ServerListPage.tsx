import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Server, Plus, Eye, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, Cpu, HardDrive, Database } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useServers, useServerRealtime, Server as ServerType } from '@/hooks/useServerData';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function ServerListPage() {
  const { isSuperAdmin, isAdmin, loading: rolesLoading } = useUserRoles();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useServerRealtime();
  
  const { data: servers, isLoading, refetch } = useServers();
  
  // Show loading skeleton while roles are being fetched
  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--boss-accent))]" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Server list refreshed');
    }, 500);
  };

  const getStatusBadge = (server: ServerType) => {
    const hasMetrics = server.current_cpu_load !== null && server.current_cpu_load !== undefined;
    
    if (server.status === 'down') {
      return (
        <div className="flex items-center gap-2">
          <XCircle className="h-4 w-4 text-red-400" />
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Offline</Badge>
        </div>
      );
    }
    
    if (server.status === 'maintenance') {
      return (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-400" />
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Maintenance</Badge>
        </div>
      );
    }
    
    if (server.status === 'warning') {
      return (
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Degraded</Badge>
        </div>
      );
    }
    
    if (server.status === 'running' && hasMetrics) {
      return (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Online</Badge>
        </div>
      );
    }
    
    // Pending state (new server, no metrics yet)
    return (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-amber-400" />
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending</Badge>
      </div>
    );
  };

  const getMetricDisplay = (value: number | null, suffix: string = '%') => {
    if (value === null || value === undefined) {
      return <span className="text-[hsl(var(--boss-text-muted))] text-sm">—</span>;
    }
    
    const color = value > 80 ? 'text-red-400' : value > 60 ? 'text-amber-400' : 'text-emerald-400';
    return <span className={`font-medium ${color}`}>{value}{suffix}</span>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-[hsl(var(--boss-text))]">
              <Server className="h-8 w-8 text-[hsl(var(--boss-accent))]" />
              Servers List
            </h1>
            <p className="text-[hsl(var(--boss-text-muted))] mt-1">
              View and manage all registered servers
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))] hover:bg-[hsl(var(--boss-card))]"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => navigate('/dashboard/boss/server/add')}
              className="gap-2 bg-[hsl(var(--boss-accent))] hover:bg-[hsl(var(--boss-accent))]/90"
            >
              <Plus className="h-4 w-4" />
              Add Server
            </Button>
          </div>
        </div>

        {/* Server Table */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--boss-text))]">All Servers</CardTitle>
            <CardDescription className="text-[hsl(var(--boss-text-muted))]">
              {servers?.length || 0} servers registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full bg-[hsl(var(--boss-card-elevated))]" />
                ))}
              </div>
            ) : servers && servers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-[hsl(var(--boss-border))] hover:bg-transparent">
                    <TableHead className="text-[hsl(var(--boss-text-muted))]">Server Name</TableHead>
                    <TableHead className="text-[hsl(var(--boss-text-muted))]">Type</TableHead>
                    <TableHead className="text-[hsl(var(--boss-text-muted))]">Status</TableHead>
                    <TableHead className="text-[hsl(var(--boss-text-muted))]">
                      <div className="flex items-center gap-1">
                        <Cpu className="h-3 w-3" /> CPU
                      </div>
                    </TableHead>
                    <TableHead className="text-[hsl(var(--boss-text-muted))]">
                      <div className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3" /> RAM
                      </div>
                    </TableHead>
                    <TableHead className="text-[hsl(var(--boss-text-muted))]">
                      <div className="flex items-center gap-1">
                        <Database className="h-3 w-3" /> Disk
                      </div>
                    </TableHead>
                    <TableHead className="text-[hsl(var(--boss-text-muted))]">Created</TableHead>
                    <TableHead className="text-right text-[hsl(var(--boss-text-muted))]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servers.map((server) => (
                    <TableRow 
                      key={server.id} 
                      className="border-[hsl(var(--boss-border))] hover:bg-[hsl(var(--boss-card-elevated))] cursor-pointer"
                      onClick={() => navigate(`/dashboard/boss/server/detail/${server.id}`)}
                    >
                      <TableCell className="font-medium text-[hsl(var(--boss-text))]">
                        {server.name}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={server.owner_type === 'own' 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                            : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          }
                        >
                          {server.owner_type === 'own' ? '🏢 Company' : '👤 Client'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(server)}
                      </TableCell>
                      <TableCell className="text-[hsl(var(--boss-text))]">
                        {getMetricDisplay(server.current_cpu_load)}
                      </TableCell>
                      <TableCell className="text-[hsl(var(--boss-text))]">
                        {getMetricDisplay(server.current_ram_load)}
                      </TableCell>
                      <TableCell className="text-[hsl(var(--boss-text))]">
                        {getMetricDisplay(server.current_disk_usage)}
                      </TableCell>
                      <TableCell className="text-[hsl(var(--boss-text-muted))]">
                        {format(new Date(server.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/boss/server/detail/${server.id}`);
                          }}
                          className="gap-2 text-[hsl(var(--boss-text-muted))] hover:text-[hsl(var(--boss-text))]"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Server className="h-12 w-12 text-[hsl(var(--boss-text-muted))] mx-auto mb-4" />
                <p className="text-[hsl(var(--boss-text-muted))]">No servers registered yet</p>
                <Button 
                  onClick={() => navigate('/dashboard/boss/server/add')}
                  className="mt-4 gap-2 bg-[hsl(var(--boss-accent))] hover:bg-[hsl(var(--boss-accent))]/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Your First Server
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
