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
import { Textarea } from '@/components/ui/textarea';
import { 
  Server, 
  ArrowUpCircle, 
  ArrowDownCircle,
  RefreshCw,
  Cpu,
  HardDrive,
  MemoryStick,
  Gauge
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useOwnServers, useCreateServerActivityLog, useServerRealtime, Server as ServerType } from '@/hooks/useServerData';
import { useAuth } from '@/hooks/useAuth';

export default function OwnServerPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const { user } = useAuth();
  
  // Enable real-time updates
  useServerRealtime();
  
  const { data: servers, isLoading } = useOwnServers();
  const createActivityLog = useCreateServerActivityLog();
  
  const [actionDialog, setActionDialog] = useState<{open: boolean; type: string; server: ServerType | null}>({
    open: false, type: '', server: null
  });
  const [reason, setReason] = useState('');
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAction = (type: string, server: ServerType) => {
    setActionDialog({ open: true, type, server });
  };

  const submitRequest = () => {
    if (!reason.trim()) {
      toast.error('Reason is required for approval');
      return;
    }
    
    if (actionDialog.server) {
      createActivityLog.mutate({
        server_id: actionDialog.server.id,
        action: `${actionDialog.type} Request`,
        requested_by: user?.id,
        requested_by_name: user?.email?.split('@')[0] || 'Unknown',
        approval_status: 'pending',
        details: reason,
      });
    }
    
    toast.success(`${actionDialog.type} request submitted for ${actionDialog.server?.name}. Pending approval.`);
    setActionDialog({ open: false, type: '', server: null });
    setReason('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Server className="h-8 w-8 text-primary" />
              Own Server Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage company-owned infrastructure
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            Approval Required for Actions
          </Badge>
        </div>

        {/* Server Table */}
        <Card>
          <CardHeader>
            <CardTitle>Server Inventory</CardTitle>
            <CardDescription>All company-owned servers</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Server</TableHead>
                    <TableHead>Type / Provider</TableHead>
                    <TableHead>Resources</TableHead>
                    <TableHead>Current Load</TableHead>
                    <TableHead>Auto-Scale</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servers?.map((server) => (
                    <TableRow key={server.id}>
                      <TableCell className="font-medium">{server.name}</TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="outline" className="capitalize">{server.server_type}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{server.provider}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-1">
                            <Cpu className="h-3 w-3" /> {server.cpu_spec || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1">
                            <MemoryStick className="h-3 w-3" /> {server.ram_spec || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3" /> {server.disk_spec || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-20">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <Gauge className="h-3 w-3" />
                            <span>{server.current_cpu_load || 0}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                (server.current_cpu_load || 0) > 80 ? 'bg-destructive' : 
                                (server.current_cpu_load || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${server.current_cpu_load || 0}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={server.auto_scale_enabled ? 'default' : 'secondary'}>
                          {server.auto_scale_enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          server.status === 'running' ? 'default' : 
                          server.status === 'warning' ? 'secondary' : 'destructive'
                        }>
                          {server.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAction('Scale Up', server)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <ArrowUpCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAction('Scale Down', server)}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <ArrowDownCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAction('Restart', server)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <RefreshCw className="h-4 w-4" />
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

        {/* Action Dialog */}
        <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request {actionDialog.type}</DialogTitle>
              <DialogDescription>
                This action requires approval from the Boss/Owner.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Server</p>
                <p className="font-medium">{actionDialog.server?.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Request *</label>
                <Textarea 
                  placeholder="Explain why this action is needed..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⚠️ This request will be sent for approval. No automatic actions are allowed.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog({ open: false, type: '', server: null })}>
                Cancel
              </Button>
              <Button onClick={submitRequest} disabled={createActivityLog.isPending}>
                Submit for Approval
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}