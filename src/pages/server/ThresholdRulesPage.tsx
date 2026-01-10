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
  Sliders, 
  Plus,
  Server,
  Edit2,
  Check,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  useAutoScalingPolicies, 
  useCreateScalingPolicy, 
  useUpdateScalingPolicy,
  useServers,
  useServerRealtime,
  AutoScalingPolicy,
  useCreateServerActivityLog
} from '@/hooks/useServerData';
import { useAuth } from '@/hooks/useAuth';

export default function ThresholdRulesPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const { user } = useAuth();
  
  useServerRealtime();
  
  const { data: policies, isLoading } = useAutoScalingPolicies();
  const { data: servers } = useServers();
  const createPolicy = useCreateScalingPolicy();
  const updatePolicy = useUpdateScalingPolicy();
  const createActivityLog = useCreateServerActivityLog();
  
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{open: boolean; policy: AutoScalingPolicy | null}>({
    open: false, policy: null
  });
  const [reason, setReason] = useState('');
  const [formData, setFormData] = useState({
    server_id: '',
    metric: 'cpu',
    scale_up_threshold: '80',
    scale_down_threshold: '30',
    cooldown_seconds: '300',
    min_instances: '1',
    max_instances: '10'
  });
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const resetForm = () => {
    setFormData({
      server_id: '',
      metric: 'cpu',
      scale_up_threshold: '80',
      scale_down_threshold: '30',
      cooldown_seconds: '300',
      min_instances: '1',
      max_instances: '10'
    });
    setReason('');
  };

  const handleCreate = () => {
    if (!formData.server_id) {
      toast.error('Server is required');
      return;
    }
    
    createPolicy.mutate({
      server_id: formData.server_id,
      metric: formData.metric as 'cpu' | 'memory' | 'requests' | 'connections',
      scale_up_threshold: parseInt(formData.scale_up_threshold),
      scale_down_threshold: parseInt(formData.scale_down_threshold),
      cooldown_seconds: parseInt(formData.cooldown_seconds),
      min_instances: parseInt(formData.min_instances),
      max_instances: parseInt(formData.max_instances),
      is_enabled: true
    });
    
    setCreateDialog(false);
    resetForm();
  };

  const handleEdit = (policy: AutoScalingPolicy) => {
    setFormData({
      server_id: policy.server_id || '',
      metric: policy.metric,
      scale_up_threshold: policy.scale_up_threshold.toString(),
      scale_down_threshold: policy.scale_down_threshold.toString(),
      cooldown_seconds: policy.cooldown_seconds.toString(),
      min_instances: policy.min_instances.toString(),
      max_instances: policy.max_instances.toString()
    });
    setEditDialog({ open: true, policy });
  };

  const handleUpdate = () => {
    if (!editDialog.policy || !reason.trim()) {
      toast.error('Reason is required for changes');
      return;
    }
    
    // Log the change request
    createActivityLog.mutate({
      server_id: editDialog.policy.server_id || undefined,
      action: 'Threshold Rule Change',
      requested_by: user?.id,
      requested_by_name: user?.email?.split('@')[0] || 'Unknown',
      approval_status: 'pending',
      details: reason
    });
    
    toast.success('Rule change request submitted for approval');
    setEditDialog({ open: false, policy: null });
    resetForm();
  };

  const handleToggleEnabled = (policy: AutoScalingPolicy) => {
    createActivityLog.mutate({
      server_id: policy.server_id || undefined,
      action: `${policy.is_enabled ? 'Disable' : 'Enable'} Scaling Rule`,
      requested_by: user?.id,
      requested_by_name: user?.email?.split('@')[0] || 'Unknown',
      approval_status: 'pending',
      details: `Request to ${policy.is_enabled ? 'disable' : 'enable'} scaling rule for ${policy.servers?.name || 'Unknown server'}`
    });
    
    toast.success('Toggle request submitted for approval');
  };

  const enabledRules = policies?.filter(p => p.is_enabled).length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sliders className="h-8 w-8 text-primary" />
              Threshold Rules
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure scaling trigger conditions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Changes Require Approval</Badge>
            <Button onClick={() => setCreateDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Rule
            </Button>
          </div>
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
                  <Sliders className="h-6 w-6 text-primary" />
                  <span className="text-3xl font-bold">{policies?.length || 0}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Enabled Rules</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <Check className="h-6 w-6 text-green-500" />
                  <span className="text-3xl font-bold">{enabledRules}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Servers With Rules</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <Server className="h-6 w-6 text-primary" />
                  <span className="text-3xl font-bold">
                    {new Set(policies?.map(p => p.server_id)).size}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rules Table */}
        <Card>
          <CardHeader>
            <CardTitle>Scaling Threshold Rules</CardTitle>
            <CardDescription>Conditions that trigger auto-scaling actions</CardDescription>
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
                    <TableHead>Metric</TableHead>
                    <TableHead>Scale Up @</TableHead>
                    <TableHead>Scale Down @</TableHead>
                    <TableHead>Instance Range</TableHead>
                    <TableHead>Cooldown</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies?.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-muted-foreground" />
                          {policy.servers?.name || 'Unknown'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{policy.metric}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-green-600">
                          <ArrowUp className="h-3 w-3" />
                          {policy.scale_up_threshold}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-orange-600">
                          <ArrowDown className="h-3 w-3" />
                          {policy.scale_down_threshold}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {policy.min_instances} - {policy.max_instances}
                        </span>
                      </TableCell>
                      <TableCell>{policy.cooldown_seconds}s</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleEnabled(policy)}
                          className={policy.is_enabled ? 'text-green-600' : 'text-muted-foreground'}
                        >
                          {policy.is_enabled ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          {policy.is_enabled ? 'Enabled' : 'Disabled'}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(policy)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
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
              <DialogTitle>Add Threshold Rule</DialogTitle>
              <DialogDescription>
                Create a new auto-scaling threshold rule
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
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
              <div className="space-y-2">
                <Label>Metric</Label>
                <Select 
                  value={formData.metric}
                  onValueChange={(v) => setFormData({...formData, metric: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpu">CPU</SelectItem>
                    <SelectItem value="memory">Memory</SelectItem>
                    <SelectItem value="requests">Requests</SelectItem>
                    <SelectItem value="connections">Connections</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Scale Up Threshold (%)</Label>
                  <Input 
                    type="number"
                    value={formData.scale_up_threshold}
                    onChange={(e) => setFormData({...formData, scale_up_threshold: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Scale Down Threshold (%)</Label>
                  <Input 
                    type="number"
                    value={formData.scale_down_threshold}
                    onChange={(e) => setFormData({...formData, scale_down_threshold: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Instances</Label>
                  <Input 
                    type="number"
                    value={formData.min_instances}
                    onChange={(e) => setFormData({...formData, min_instances: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Instances</Label>
                  <Input 
                    type="number"
                    value={formData.max_instances}
                    onChange={(e) => setFormData({...formData, max_instances: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cooldown (seconds)</Label>
                <Input 
                  type="number"
                  value={formData.cooldown_seconds}
                  onChange={(e) => setFormData({...formData, cooldown_seconds: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setCreateDialog(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createPolicy.isPending}>
                Create Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialog.open} onOpenChange={(open) => { setEditDialog({...editDialog, open}); if (!open) resetForm(); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Threshold Rule</DialogTitle>
              <DialogDescription>
                Changes require approval before taking effect
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Server</p>
                <p className="font-medium">{editDialog.policy?.servers?.name || 'Unknown'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Scale Up Threshold (%)</Label>
                  <Input 
                    type="number"
                    value={formData.scale_up_threshold}
                    onChange={(e) => setFormData({...formData, scale_up_threshold: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Scale Down Threshold (%)</Label>
                  <Input 
                    type="number"
                    value={formData.scale_down_threshold}
                    onChange={(e) => setFormData({...formData, scale_down_threshold: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Instances</Label>
                  <Input 
                    type="number"
                    value={formData.min_instances}
                    onChange={(e) => setFormData({...formData, min_instances: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Instances</Label>
                  <Input 
                    type="number"
                    value={formData.max_instances}
                    onChange={(e) => setFormData({...formData, max_instances: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reason for Change *</Label>
                <Textarea 
                  placeholder="Explain why this change is needed..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⚠️ This proposal will be reviewed before implementation.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setEditDialog({open: false, policy: null}); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={createActivityLog.isPending}>
                Submit Proposal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
