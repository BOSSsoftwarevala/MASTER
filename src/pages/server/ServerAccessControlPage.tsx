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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Plus,
  Network,
  Server,
  Edit2,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  useServerAccessControls, 
  useCreateServerAccessControl, 
  useUpdateServerAccessControl,
  useDeleteServerAccessControl,
  useServers,
  useServerRealtime,
  ServerAccessControl 
} from '@/hooks/useServerData';
import { useAuth } from '@/hooks/useAuth';

export default function ServerAccessControlPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const { user } = useAuth();
  
  useServerRealtime();
  
  const { data: accessControls, isLoading } = useServerAccessControls();
  const { data: servers } = useServers();
  const createAccessControl = useCreateServerAccessControl();
  const updateAccessControl = useUpdateServerAccessControl();
  const deleteAccessControl = useDeleteServerAccessControl();
  
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{open: boolean; control: ServerAccessControl | null}>({
    open: false, control: null
  });
  const [formData, setFormData] = useState({
    server_id: '',
    name: '',
    allowed_ip: '',
    ip_range: '',
    access_type: 'ssh',
    port: '',
    notes: ''
  });
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const resetForm = () => {
    setFormData({
      server_id: '',
      name: '',
      allowed_ip: '',
      ip_range: '',
      access_type: 'ssh',
      port: '',
      notes: ''
    });
  };

  const handleCreate = () => {
    if (!formData.name || !formData.server_id) {
      toast.error('Name and server are required');
      return;
    }
    
    createAccessControl.mutate({
      server_id: formData.server_id,
      name: formData.name,
      allowed_ip: formData.allowed_ip || null,
      ip_range: formData.ip_range || null,
      access_type: formData.access_type,
      port: formData.port ? parseInt(formData.port) : null,
      notes: formData.notes || null,
      created_by: user?.id,
      created_by_name: user?.email?.split('@')[0] || 'Unknown'
    });
    
    setCreateDialog(false);
    resetForm();
  };

  const handleEdit = (control: ServerAccessControl) => {
    setFormData({
      server_id: control.server_id || '',
      name: control.name,
      allowed_ip: control.allowed_ip || '',
      ip_range: control.ip_range || '',
      access_type: control.access_type,
      port: control.port?.toString() || '',
      notes: control.notes || ''
    });
    setEditDialog({ open: true, control });
  };

  const handleUpdate = () => {
    if (!editDialog.control) return;
    
    updateAccessControl.mutate({
      id: editDialog.control.id,
      name: formData.name,
      allowed_ip: formData.allowed_ip || null,
      ip_range: formData.ip_range || null,
      access_type: formData.access_type,
      port: formData.port ? parseInt(formData.port) : null,
      notes: formData.notes || null
    });
    
    setEditDialog({ open: false, control: null });
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this access rule?')) {
      deleteAccessControl.mutate(id);
    }
  };

  const handleToggleEnabled = (control: ServerAccessControl) => {
    updateAccessControl.mutate({
      id: control.id,
      is_enabled: !control.is_enabled
    });
  };

  const activeRules = accessControls?.filter(ac => ac.is_enabled).length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Access Control
            </h1>
            <p className="text-muted-foreground mt-1">
              IP-based access rules for servers
            </p>
          </div>
          <Button onClick={() => setCreateDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Rule
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Rules</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <Network className="h-6 w-6 text-primary" />
                  <span className="text-3xl font-bold">{accessControls?.length || 0}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Active Rules</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <Check className="h-6 w-6 text-green-500" />
                  <span className="text-3xl font-bold">{activeRules}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Servers Covered</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <Server className="h-6 w-6 text-primary" />
                  <span className="text-3xl font-bold">
                    {new Set(accessControls?.map(ac => ac.server_id)).size}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Access Rules Table */}
        <Card>
          <CardHeader>
            <CardTitle>Access Rules</CardTitle>
            <CardDescription>IP-based access control configuration</CardDescription>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Server</TableHead>
                    <TableHead>IP / Range</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Port</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessControls?.map((control) => (
                    <TableRow key={control.id}>
                      <TableCell className="font-medium">{control.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-muted-foreground" />
                          {control.servers?.name || 'Unknown'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-0.5 rounded">
                          {control.allowed_ip || control.ip_range || 'N/A'}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">{control.access_type}</Badge>
                      </TableCell>
                      <TableCell>{control.port || 'Any'}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleEnabled(control)}
                          className={control.is_enabled ? 'text-green-600' : 'text-muted-foreground'}
                        >
                          {control.is_enabled ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          {control.is_enabled ? 'Enabled' : 'Disabled'}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(control)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(control.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
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

        {/* Create Dialog */}
        <Dialog open={createDialog} onOpenChange={setCreateDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Access Rule</DialogTitle>
              <DialogDescription>
                Create a new IP-based access control rule
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Rule Name *</Label>
                <Input 
                  placeholder="e.g., Office IP Access"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Server *</Label>
                <Select 
                  value={formData.server_id}
                  onValueChange={(v) => setFormData({...formData, server_id: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select server" />
                  </SelectTrigger>
                  <SelectContent>
                    {servers?.map((server) => (
                      <SelectItem key={server.id} value={server.id}>
                        {server.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Allowed IP</Label>
                  <Input 
                    placeholder="192.168.1.100"
                    value={formData.allowed_ip}
                    onChange={(e) => setFormData({...formData, allowed_ip: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>IP Range (CIDR)</Label>
                  <Input 
                    placeholder="192.168.1.0/24"
                    value={formData.ip_range}
                    onChange={(e) => setFormData({...formData, ip_range: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Access Type</Label>
                  <Select 
                    value={formData.access_type}
                    onValueChange={(v) => setFormData({...formData, access_type: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ssh">SSH</SelectItem>
                      <SelectItem value="rdp">RDP</SelectItem>
                      <SelectItem value="https">HTTPS</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Port</Label>
                  <Input 
                    type="number"
                    placeholder="22"
                    value={formData.port}
                    onChange={(e) => setFormData({...formData, port: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea 
                  placeholder="Optional description..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setCreateDialog(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createAccessControl.isPending}>
                Create Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialog.open} onOpenChange={(open) => { setEditDialog({...editDialog, open}); if (!open) resetForm(); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Access Rule</DialogTitle>
              <DialogDescription>
                Update access control configuration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Rule Name *</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Allowed IP</Label>
                  <Input 
                    value={formData.allowed_ip}
                    onChange={(e) => setFormData({...formData, allowed_ip: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>IP Range (CIDR)</Label>
                  <Input 
                    value={formData.ip_range}
                    onChange={(e) => setFormData({...formData, ip_range: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Access Type</Label>
                  <Select 
                    value={formData.access_type}
                    onValueChange={(v) => setFormData({...formData, access_type: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ssh">SSH</SelectItem>
                      <SelectItem value="rdp">RDP</SelectItem>
                      <SelectItem value="https">HTTPS</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Port</Label>
                  <Input 
                    type="number"
                    value={formData.port}
                    onChange={(e) => setFormData({...formData, port: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setEditDialog({open: false, control: null}); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={updateAccessControl.isPending}>
                Update Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
