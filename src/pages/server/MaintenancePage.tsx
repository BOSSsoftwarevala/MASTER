import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Wrench, Plus, Calendar, Clock, CheckCircle, Play, Pause } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { 
  useServerMaintenance, 
  useCreateMaintenance, 
  useUpdateMaintenance,
  useServers,
  useServerRealtime 
} from '@/hooks/useServerData';
import { toast } from 'sonner';

export default function MaintenancePage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  
  useServerRealtime();
  
  const { data: maintenance, isLoading } = useServerMaintenance();
  const { data: servers } = useServers();
  const createMaintenance = useCreateMaintenance();
  const updateMaintenance = useUpdateMaintenance();
  
  const [createDialog, setCreateDialog] = useState(false);
  const [form, setForm] = useState({
    server_id: '',
    title: '',
    description: '',
    maintenance_type: 'scheduled',
    scheduled_start: '',
    scheduled_end: '',
  });
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleCreate = async () => {
    if (!form.title || !form.scheduled_start) {
      toast.error('Title and scheduled start are required');
      return;
    }
    
    await createMaintenance.mutateAsync({
      server_id: form.server_id || null,
      title: form.title,
      description: form.description || null,
      maintenance_type: form.maintenance_type,
      scheduled_start: form.scheduled_start,
      scheduled_end: form.scheduled_end || null,
    });
    
    setCreateDialog(false);
    setForm({ server_id: '', title: '', description: '', maintenance_type: 'scheduled', scheduled_start: '', scheduled_end: '' });
  };

  const handleStartMaintenance = async (id: string) => {
    await updateMaintenance.mutateAsync({
      id,
      status: 'in_progress',
      actual_start: new Date().toISOString(),
    });
  };

  const handleCompleteMaintenance = async (id: string) => {
    await updateMaintenance.mutateAsync({
      id,
      status: 'completed',
      actual_end: new Date().toISOString(),
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Play className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><Pause className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary"><Calendar className="h-3 w-3 mr-1" />Scheduled</Badge>;
    }
  };

  const scheduled = maintenance?.filter(m => m.status === 'scheduled') || [];
  const inProgress = maintenance?.filter(m => m.status === 'in_progress') || [];
  const completed = maintenance?.filter(m => m.status === 'completed').slice(0, 10) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Wrench className="h-8 w-8 text-primary" />
              Maintenance Schedules
            </h1>
            <p className="text-muted-foreground mt-1">
              Plan and manage server maintenance windows
            </p>
          </div>
          <Button onClick={() => setCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Maintenance
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold">{scheduled.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{inProgress.length}</p>
                </div>
                <Play className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed (Recent)</p>
                  <p className="text-2xl font-bold">{completed.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Maintenance Windows</CardTitle>
            <CardDescription>Scheduled and completed maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : maintenance && maintenance.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Server</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled Start</TableHead>
                    <TableHead>Scheduled End</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenance.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.title}</TableCell>
                      <TableCell>{m.servers?.name || 'All'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{m.maintenance_type}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(m.status)}</TableCell>
                      <TableCell>{new Date(m.scheduled_start).toLocaleString()}</TableCell>
                      <TableCell>
                        {m.scheduled_end ? new Date(m.scheduled_end).toLocaleString() : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {m.status === 'scheduled' && (
                          <Button size="sm" variant="outline" onClick={() => handleStartMaintenance(m.id)}>
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        )}
                        {m.status === 'in_progress' && (
                          <Button size="sm" onClick={() => handleCompleteMaintenance(m.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No maintenance scheduled</p>
                <Button className="mt-4" onClick={() => setCreateDialog(true)}>Schedule First Maintenance</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <Dialog open={createDialog} onOpenChange={setCreateDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Schedule Maintenance</DialogTitle>
              <DialogDescription>Plan a new maintenance window</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Monthly Security Patches"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Server (Optional)</Label>
                  <Select value={form.server_id} onValueChange={(v) => setForm({ ...form, server_id: v })}>
                    <SelectTrigger><SelectValue placeholder="All servers" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Servers</SelectItem>
                      {servers?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.maintenance_type} onValueChange={(v) => setForm({ ...form, maintenance_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="patch">Security Patch</SelectItem>
                      <SelectItem value="upgrade">Upgrade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Scheduled Start *</Label>
                  <Input
                    type="datetime-local"
                    value={form.scheduled_start}
                    onChange={(e) => setForm({ ...form, scheduled_start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Scheduled End</Label>
                  <Input
                    type="datetime-local"
                    value={form.scheduled_end}
                    onChange={(e) => setForm({ ...form, scheduled_end: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Details about the maintenance..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createMaintenance.isPending}>
                {createMaintenance.isPending ? 'Scheduling...' : 'Schedule'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}