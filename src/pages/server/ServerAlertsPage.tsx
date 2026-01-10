import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
  Bell, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  BellOff
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useServerAlerts, useUpdateServerAlert, useServerRealtime, ServerAlert } from '@/hooks/useServerData';
import { useAuth } from '@/hooks/useAuth';

export default function ServerAlertsPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const { user } = useAuth();
  
  useServerRealtime();
  
  const { data: alerts, isLoading } = useServerAlerts();
  const updateAlert = useUpdateServerAlert();
  
  const [actionDialog, setActionDialog] = useState<{open: boolean; type: string; alert: ServerAlert | null}>({
    open: false, type: '', alert: null
  });
  const [notes, setNotes] = useState('');
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAction = (type: string, alert: ServerAlert) => {
    setActionDialog({ open: true, type, alert });
  };

  const submitAction = () => {
    if (!actionDialog.alert) return;
    
    const updates: Partial<ServerAlert> = {};
    
    if (actionDialog.type === 'acknowledge') {
      updates.status = 'acknowledged';
      updates.acknowledged_at = new Date().toISOString();
      updates.acknowledged_by = user?.id;
      updates.acknowledged_by_name = user?.email?.split('@')[0] || 'Unknown';
    } else if (actionDialog.type === 'snooze') {
      updates.status = 'snoozed';
      const snoozeDate = new Date();
      snoozeDate.setHours(snoozeDate.getHours() + 1);
      updates.snoozed_until = snoozeDate.toISOString();
    } else if (actionDialog.type === 'resolve') {
      if (!notes.trim()) {
        toast.error('Resolution notes required');
        return;
      }
      updates.status = 'resolved';
      updates.resolved_at = new Date().toISOString();
      updates.resolved_by = user?.id;
      updates.resolved_by_name = user?.email?.split('@')[0] || 'Unknown';
      updates.resolution_notes = notes;
    }
    
    updateAlert.mutate({ id: actionDialog.alert.id, ...updates });
    
    toast.success(`Alert ${actionDialog.type}d successfully`);
    setActionDialog({ open: false, type: '', alert: null });
    setNotes('');
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-500">High</Badge>;
      case 'medium': return <Badge variant="secondary">Medium</Badge>;
      default: return <Badge variant="outline">Low</Badge>;
    }
  };

  function formatTimeAgo(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  }

  const activeAlerts = alerts?.filter(a => a.status === 'active') || [];
  const acknowledgedAlerts = alerts?.filter(a => a.status === 'acknowledged') || [];
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              Active Alerts
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage server alerts
            </p>
          </div>
          {criticalCount > 0 && (
            <Badge variant="destructive" className="text-sm px-4 py-2">
              {criticalCount} Critical Alert{criticalCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={activeAlerts.length > 0 ? 'border-destructive' : 'border-green-500'}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-6 w-6 ${activeAlerts.length > 0 ? 'text-destructive' : 'text-green-500'}`} />
                  <span className="text-3xl font-bold">{activeAlerts.length}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Acknowledged</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <Eye className="h-6 w-6 text-yellow-500" />
                  <span className="text-3xl font-bold">{acknowledgedAlerts.length}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Today</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <Bell className="h-6 w-6 text-primary" />
                  <span className="text-3xl font-bold">{alerts?.length || 0}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Queue</CardTitle>
            <CardDescription>Alerts requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : activeAlerts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium">All Clear</p>
                <p className="text-muted-foreground">No active alerts at this time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg border ${
                      alert.severity === 'critical' ? 'border-destructive bg-destructive/5' :
                      alert.severity === 'high' ? 'border-orange-500 bg-orange-500/5' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(alert.severity)}
                          <span className="font-medium">{alert.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <span>{alert.servers?.name || 'Unknown server'}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(alert.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAction('acknowledge', alert)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Acknowledge
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAction('snooze', alert)}
                        >
                          <BellOff className="h-4 w-4 mr-1" />
                          Snooze
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleAction('resolve', alert)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Dialog */}
        <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="capitalize">{actionDialog.type} Alert</DialogTitle>
              <DialogDescription>
                {actionDialog.type === 'resolve' 
                  ? 'Please provide resolution notes'
                  : `Are you sure you want to ${actionDialog.type} this alert?`
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Alert</p>
                <p className="font-medium">{actionDialog.alert?.title}</p>
              </div>
              {actionDialog.type === 'resolve' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resolution Notes *</label>
                  <Textarea 
                    placeholder="Describe how the issue was resolved..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog({ open: false, type: '', alert: null })}>
                Cancel
              </Button>
              <Button onClick={submitAction} disabled={updateAlert.isPending}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
