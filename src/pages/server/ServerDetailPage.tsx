import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ServerStatusCard } from '@/components/server/ServerStatusCard';
import { 
  Server, 
  ArrowLeft, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  FileText
} from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useServers, useUpdateServer } from '@/hooks/useServerData';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ServerDetailPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const navigate = useNavigate();
  const { id } = useParams();
  const updateServer = useUpdateServer();
  
  const { data: servers, isLoading } = useServers();
  const server = servers?.find(s => s.id === id);
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64 bg-[hsl(var(--boss-card-elevated))]" />
          <Skeleton className="h-64 w-full bg-[hsl(var(--boss-card-elevated))]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!server) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Server className="h-12 w-12 text-[hsl(var(--boss-text-muted))] mx-auto mb-4" />
          <p className="text-[hsl(var(--boss-text))]">Server not found</p>
          <Button 
            onClick={() => navigate('/dashboard/boss/server/list')}
            className="mt-4"
          >
            Back to List
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Running</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Warning</Badge>;
      case 'down':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Offline</Badge>;
      case 'maintenance':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Maintenance</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Pending</Badge>;
    }
  };

  const handleActivate = async () => {
    try {
      await updateServer.mutateAsync({
        id: server.id,
        status: 'running',
      });
      toast.success('Server activated successfully');
    } catch (err) {
      // Error handled by mutation
    }
  };

  const handleDisable = async () => {
    try {
      await updateServer.mutateAsync({
        id: server.id,
        status: 'down',
      });
      toast.success('Server disabled');
    } catch (err) {
      // Error handled by mutation
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboard/boss/server/list')}
            className="text-[hsl(var(--boss-text-muted))] hover:text-[hsl(var(--boss-text))]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-[hsl(var(--boss-text))]">
              <Server className="h-8 w-8 text-[hsl(var(--boss-accent))]" />
              {server.name}
            </h1>
            <p className="text-[hsl(var(--boss-text-muted))] mt-1">
              Server Details & Management
            </p>
          </div>
          {getStatusBadge(server.status)}
        </div>

        {/* Overview Card */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--boss-text))]">Overview</CardTitle>
            <CardDescription className="text-[hsl(var(--boss-text-muted))]">
              Server information and current state
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[hsl(var(--boss-card-elevated))]">
                <p className="text-sm text-[hsl(var(--boss-text-muted))]">Server Name</p>
                <p className="text-lg font-medium text-[hsl(var(--boss-text))]">{server.name}</p>
              </div>
              <div className="p-4 rounded-lg bg-[hsl(var(--boss-card-elevated))]">
                <p className="text-sm text-[hsl(var(--boss-text-muted))]">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(server.status)}
                  <span className="text-lg font-medium text-[hsl(var(--boss-text))] capitalize">{server.status}</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[hsl(var(--boss-card-elevated))]">
                <p className="text-sm text-[hsl(var(--boss-text-muted))]">Provider</p>
                <p className="text-lg font-medium text-[hsl(var(--boss-text))] capitalize">{server.provider || 'Own'}</p>
              </div>
              <div className="p-4 rounded-lg bg-[hsl(var(--boss-card-elevated))]">
                <p className="text-sm text-[hsl(var(--boss-text-muted))]">Created</p>
                <p className="text-lg font-medium text-[hsl(var(--boss-text))]">
                  {format(new Date(server.created_at), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Status Card */}
        <div>
          <h2 className="text-lg font-semibold text-[hsl(var(--boss-text))] mb-3">Live Status</h2>
          <ServerStatusCard server={server} showDiagnose={true} />
        </div>

        {/* Logs Card (Placeholder) */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text))]">
              <FileText className="h-5 w-5" />
              Activity Logs
            </CardTitle>
            <CardDescription className="text-[hsl(var(--boss-text-muted))]">
              Recent server activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="h-10 w-10 text-[hsl(var(--boss-text-muted))] mx-auto mb-3" />
              <p className="text-[hsl(var(--boss-text-muted))]">No recent activity logs</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--boss-text))]">Actions</CardTitle>
            <CardDescription className="text-[hsl(var(--boss-text-muted))]">
              Manage server status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={handleActivate}
                disabled={server.status === 'running' || updateServer.isPending}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle className="h-4 w-4" />
                Activate
              </Button>
              <Button
                onClick={handleDisable}
                disabled={server.status === 'down' || updateServer.isPending}
                variant="destructive"
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Disable
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
