import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HardDrive, Plus, Download, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { 
  useServerBackups, 
  useCreateBackup, 
  useServers,
  useServerRealtime 
} from '@/hooks/useServerData';
import { toast } from 'sonner';

export default function BackupsPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  
  useServerRealtime();
  
  const { data: backups, isLoading } = useServerBackups();
  const { data: servers } = useServers();
  const createBackup = useCreateBackup();
  
  const [createDialog, setCreateDialog] = useState(false);
  const [backupForm, setBackupForm] = useState({
    server_id: '',
    backup_type: 'full',
  });
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleCreateBackup = async () => {
    if (!backupForm.server_id) {
      toast.error('Please select a server');
      return;
    }
    
    await createBackup.mutateAsync({
      server_id: backupForm.server_id,
      backup_type: backupForm.backup_type,
      status: 'pending',
    });
    
    setCreateDialog(false);
    setBackupForm({ server_id: '', backup_type: 'full' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'running':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Running</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const formatSize = (mb: number | null) => {
    if (!mb) return 'N/A';
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  // Summary stats
  const completedBackups = backups?.filter(b => b.status === 'completed').length || 0;
  const totalSize = backups?.reduce((sum, b) => sum + (b.size_mb || 0), 0) || 0;
  const lastBackup = backups?.[0];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <HardDrive className="h-8 w-8 text-primary" />
              Server Backups
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor server backup operations
            </p>
          </div>
          <Button onClick={() => setCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Backup
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Backups</p>
                  <p className="text-2xl font-bold">{backups?.length || 0}</p>
                </div>
                <HardDrive className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-500">{completedBackups}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Size</p>
                  <p className="text-2xl font-bold">{formatSize(totalSize)}</p>
                </div>
                <Download className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Backup</p>
                  <p className="text-sm font-medium">
                    {lastBackup ? new Date(lastBackup.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Backups Table */}
        <Card>
          <CardHeader>
            <CardTitle>Backup History</CardTitle>
            <CardDescription>All server backup operations</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : backups && backups.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Server</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Retention</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-medium">{backup.servers?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{backup.backup_type}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(backup.status)}</TableCell>
                      <TableCell>{formatSize(backup.size_mb)}</TableCell>
                      <TableCell>
                        {backup.started_at ? new Date(backup.started_at).toLocaleString() : 'Pending'}
                      </TableCell>
                      <TableCell>
                        {backup.completed_at ? new Date(backup.completed_at).toLocaleString() : '-'}
                      </TableCell>
                      <TableCell>{backup.retention_days} days</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <HardDrive className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No backups found</p>
                <Button className="mt-4" onClick={() => setCreateDialog(true)}>Create First Backup</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Backup Dialog */}
        <Dialog open={createDialog} onOpenChange={setCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Backup</DialogTitle>
              <DialogDescription>Initiate a new backup for a server</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Server *</Label>
                <Select value={backupForm.server_id} onValueChange={(v) => setBackupForm({ ...backupForm, server_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select server" /></SelectTrigger>
                  <SelectContent>
                    {servers?.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Backup Type</Label>
                <Select value={backupForm.backup_type} onValueChange={(v) => setBackupForm({ ...backupForm, backup_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Backup</SelectItem>
                    <SelectItem value="incremental">Incremental</SelectItem>
                    <SelectItem value="differential">Differential</SelectItem>
                    <SelectItem value="snapshot">Snapshot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateBackup} disabled={createBackup.isPending}>
                {createBackup.isPending ? 'Creating...' : 'Create Backup'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}