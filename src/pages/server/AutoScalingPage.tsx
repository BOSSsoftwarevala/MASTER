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
import { Textarea } from '@/components/ui/textarea';
import { 
  Scaling, 
  Server,
  Clock,
  ArrowUp,
  ArrowDown,
  Edit2,
  History
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAutoScalingPolicies, useScalingEvents, useCreateServerActivityLog, useServerRealtime, AutoScalingPolicy } from '@/hooks/useServerData';
import { useAuth } from '@/hooks/useAuth';

export default function AutoScalingPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const { user } = useAuth();
  
  // Enable real-time updates
  useServerRealtime();
  
  const { data: policies, isLoading: policiesLoading } = useAutoScalingPolicies();
  const { data: events, isLoading: eventsLoading } = useScalingEvents(10);
  const createActivityLog = useCreateServerActivityLog();
  
  const [editDialog, setEditDialog] = useState<{open: boolean; rule: AutoScalingPolicy | null}>({ open: false, rule: null });
  const [reason, setReason] = useState('');
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const submitRuleChange = () => {
    if (!reason.trim()) {
      toast.error('Reason is required for approval');
      return;
    }
    
    if (editDialog.rule) {
      createActivityLog.mutate({
        server_id: editDialog.rule.server_id || undefined,
        action: 'Scaling Rule Change',
        requested_by: user?.id,
        requested_by_name: user?.email?.split('@')[0] || 'Unknown',
        approval_status: 'pending',
        details: reason,
      });
    }
    
    toast.success('Rule change request submitted for approval');
    setEditDialog({ open: false, rule: null });
    setReason('');
  };

  function formatTimeAgo(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Scaling className="h-8 w-8 text-primary" />
              Auto-Scaling Control
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage scaling rules and thresholds
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            Rule Changes Require Approval
          </Badge>
        </div>

        {/* Scaling Rules Table */}
        <Card>
          <CardHeader>
            <CardTitle>Scaling Rules</CardTitle>
            <CardDescription>Active auto-scaling configurations</CardDescription>
          </CardHeader>
          <CardContent>
            {policiesLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
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
                    <TableHead>Cooldown</TableHead>
                    <TableHead>Instance Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies?.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-muted-foreground" />
                          {rule.servers?.name || 'Unknown'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{rule.metric}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-green-600">
                          <ArrowUp className="h-3 w-3" />
                          {rule.scale_up_threshold}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-orange-600">
                          <ArrowDown className="h-3 w-3" />
                          {rule.scale_down_threshold}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {rule.cooldown_seconds}s
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {rule.min_instances} - {rule.max_instances}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.is_enabled ? 'default' : 'secondary'}>
                          {rule.is_enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditDialog({ open: true, rule })}
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

        {/* Recent Scaling Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Scaling Events
            </CardTitle>
            <CardDescription>Last auto-scaling actions</CardDescription>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : events?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No scaling events recorded</p>
            ) : (
              <div className="space-y-3">
                {events?.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        event.action === 'Scale Up' ? 'bg-green-500/10' : 'bg-orange-500/10'
                      }`}>
                        {event.action === 'Scale Up' ? (
                          <ArrowUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{event.servers?.name || 'Unknown Server'}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.from_instances} → {event.to_instances} instances
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="capitalize">
                        {event.trigger_metric} {event.trigger_value}%
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(event.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Rule Dialog */}
        <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, rule: null })}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Propose Rule Change</DialogTitle>
              <DialogDescription>
                Changes require approval before taking effect
              </DialogDescription>
            </DialogHeader>
            {editDialog.rule && (
              <div className="space-y-4 py-4">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Server</p>
                  <p className="font-medium">{editDialog.rule.servers?.name || 'Unknown'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Scale Up Threshold (%)</Label>
                    <Input type="number" defaultValue={editDialog.rule.scale_up_threshold} />
                  </div>
                  <div className="space-y-2">
                    <Label>Scale Down Threshold (%)</Label>
                    <Input type="number" defaultValue={editDialog.rule.scale_down_threshold} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cooldown (seconds)</Label>
                    <Input type="number" defaultValue={editDialog.rule.cooldown_seconds} />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Instances</Label>
                    <Input type="number" defaultValue={editDialog.rule.max_instances} />
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
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialog({ open: false, rule: null })}>
                Cancel
              </Button>
              <Button onClick={submitRuleChange} disabled={createActivityLog.isPending}>
                Submit Proposal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}