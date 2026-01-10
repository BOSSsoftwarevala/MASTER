import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Server, 
  Building2,
  Shield,
  DollarSign,
  Play,
  Pause,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useClientServers, useCreateServerActivityLog, useServerRealtime, Server as ServerType } from '@/hooks/useServerData';
import { useAuth } from '@/hooks/useAuth';

export default function ClientServerPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const { user } = useAuth();
  
  // Enable real-time updates
  useServerRealtime();
  
  const { data: servers, isLoading } = useClientServers();
  const createActivityLog = useCreateServerActivityLog();
  
  const [viewDialog, setViewDialog] = useState<{open: boolean; client: ServerType | null}>({ open: false, client: null });
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleToggleManagement = (client: ServerType) => {
    const action = client.is_management_active ? 'Pause' : 'Enable';
    
    createActivityLog.mutate({
      server_id: client.id,
      action: `${action} Management`,
      requested_by: user?.id,
      requested_by_name: user?.email?.split('@')[0] || 'Unknown',
      approval_status: 'pending',
      details: `Request to ${action.toLowerCase()} management for ${client.client_name}`,
    });
    
    toast.success(`${action} management request for ${client.client_name} submitted for approval.`);
  };

  function formatTimeAgo(dateStr: string | null) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  }

  const totalRevenue = servers?.reduce((sum, s) => sum + (s.monthly_cost || 0), 0) || 0;
  const activeManagement = servers?.filter(s => s.is_management_active).length || 0;
  const healthIssues = servers?.filter(s => s.status !== 'running').length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              Client Server Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Managed servers for clients with encrypted credentials
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-8" />
              ) : (
                <div className="text-3xl font-bold">{servers?.length || 0}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Active Management</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-8" />
              ) : (
                <div className="text-3xl font-bold text-green-600">{activeManagement}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-24" />
              ) : (
                <div className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Health Issues</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-8" />
              ) : (
                <div className="text-3xl font-bold text-destructive">{healthIssues}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Client Server Table */}
        <Card>
          <CardHeader>
            <CardTitle>Client Servers</CardTitle>
            <CardDescription>All managed client infrastructure</CardDescription>
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
                    <TableHead>Client</TableHead>
                    <TableHead>Server</TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead>SLA Level</TableHead>
                    <TableHead>Monthly Fee</TableHead>
                    <TableHead>Management</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servers?.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {client.client_name || 'Unknown Client'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-muted-foreground" />
                          <code className="text-sm bg-muted px-2 py-0.5 rounded">{client.name}</code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {client.status === 'running' && (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Healthy
                            </Badge>
                          )}
                          {client.status === 'warning' && (
                            <Badge variant="secondary" className="bg-yellow-500 text-black">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Warning
                            </Badge>
                          )}
                          {(client.status === 'down' || client.status === 'maintenance') && (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {client.status === 'down' ? 'Critical' : 'Maintenance'}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          client.client_sla === 'Platinum' ? 'default' :
                          client.client_sla === 'Gold' ? 'secondary' : 'outline'
                        }>
                          {client.client_sla || 'Standard'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">₹{(client.monthly_cost || 0).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.is_management_active ? 'default' : 'outline'}>
                          {client.is_management_active ? 'Active' : 'Paused'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setViewDialog({ open: true, client })}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleToggleManagement(client)}
                            className={client.is_management_active ? 'text-orange-600' : 'text-green-600'}
                          >
                            {client.is_management_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* View Details Dialog */}
        <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, client: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Server Details</DialogTitle>
              <DialogDescription>
                Client server information (credentials encrypted)
              </DialogDescription>
            </DialogHeader>
            {viewDialog.client && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{viewDialog.client.client_name}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Server</p>
                    <p className="font-medium font-mono">{viewDialog.client.name}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">SLA Level</p>
                    <p className="font-medium">{viewDialog.client.client_sla || 'Standard'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Monthly Fee</p>
                    <p className="font-medium">₹{(viewDialog.client.monthly_cost || 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Credentials are encrypted and stored securely</span>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Last Health Check</p>
                  <p className="font-medium">{formatTimeAgo(viewDialog.client.last_health_check)}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialog({ open: false, client: null })}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}