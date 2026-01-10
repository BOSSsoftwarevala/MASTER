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
  AlertOctagon, 
  Server,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpCircle,
  Snowflake,
  Eye
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useServerIncidents, useIncidentSummary, useUpdateServerIncident, useServerRealtime, ServerIncident } from '@/hooks/useServerData';

export default function ServerIncidentPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  
  // Enable real-time updates
  useServerRealtime();
  
  const { data: incidents, isLoading } = useServerIncidents();
  const { data: summary, isLoading: summaryLoading } = useIncidentSummary();
  const updateIncident = useUpdateServerIncident();
  
  const [viewDialog, setViewDialog] = useState<{open: boolean; incident: ServerIncident | null}>({ open: false, incident: null });
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleEscalate = (incident: ServerIncident) => {
    updateIncident.mutate({ id: incident.id, status: 'escalated' });
    toast.success(`Incident ${incident.id.slice(0, 8)} escalated to Boss`);
  };

  const handleFreeze = (incident: ServerIncident) => {
    toast.success(`Freeze request for ${incident.servers?.name || 'server'} submitted`);
  };

  function formatDuration(startedAt: string, resolvedAt: string | null) {
    const start = new Date(startedAt);
    const end = resolvedAt ? new Date(resolvedAt) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    
    if (diffHours > 0) {
      return `${diffHours}h ${remainingMins}m`;
    }
    return `${diffMins}m`;
  }

  function formatAvgRecovery(minutes: number) {
    if (minutes === 0) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <AlertOctagon className="h-8 w-8 text-destructive" />
              Downtime & Incidents
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage server incidents
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Active Critical</CardTitle>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-9 w-8" />
              ) : (
                <div className="text-3xl font-bold text-destructive">
                  {summary?.activeCritical || 0}
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-9 w-8" />
              ) : (
                <div className="text-3xl font-bold text-yellow-600">
                  {summary?.monitoring || 0}
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Resolved Today</CardTitle>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-9 w-8" />
              ) : (
                <div className="text-3xl font-bold text-green-600">
                  {summary?.resolvedToday || 0}
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Avg Recovery</CardTitle>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <div className="text-3xl font-bold">{formatAvgRecovery(summary?.avgRecovery || 0)}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Incidents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Log</CardTitle>
            <CardDescription>All infrastructure incidents</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Server</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Impacted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents?.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-mono">INC-{incident.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-muted-foreground" />
                          {incident.servers?.name || 'Unknown'}
                        </div>
                      </TableCell>
                      <TableCell>{incident.incident_type}</TableCell>
                      <TableCell>
                        <Badge variant={incident.severity === 'critical' || incident.severity === 'high' ? 'destructive' : 'secondary'}>
                          {incident.severity === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {incident.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          incident.status === 'resolved' ? 'default' :
                          incident.status === 'active' ? 'destructive' : 'secondary'
                        }>
                          {incident.status === 'resolved' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {formatDuration(incident.started_at, incident.resolved_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {incident.affected_services?.length || 0} service(s)
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setViewDialog({ open: true, incident })}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {incident.status !== 'resolved' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEscalate(incident)}
                                className="text-orange-600"
                              >
                                <ArrowUpCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleFreeze(incident)}
                                className="text-blue-600"
                              >
                                <Snowflake className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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
        <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, incident: null })}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Incident Details</DialogTitle>
              <DialogDescription>
                INC-{viewDialog.incident?.id.slice(0, 8)}
              </DialogDescription>
            </DialogHeader>
            {viewDialog.incident && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Server</p>
                    <p className="font-medium">{viewDialog.incident.servers?.name || 'Unknown'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{viewDialog.incident.incident_type}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Start Time</p>
                    <p className="font-medium">{new Date(viewDialog.incident.started_at).toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Recovery Time</p>
                    <p className="font-medium">
                      {viewDialog.incident.resolved_at 
                        ? new Date(viewDialog.incident.resolved_at).toLocaleString() 
                        : 'Ongoing'}
                    </p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Root Cause</p>
                  <p className="font-medium">{viewDialog.incident.root_cause || 'Under investigation'}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-2">Impacted Services</p>
                  <div className="flex flex-wrap gap-2">
                    {viewDialog.incident.affected_services?.map((service: string, i: number) => (
                      <Badge key={i} variant="outline">{service}</Badge>
                    ))}
                    {(!viewDialog.incident.affected_services || viewDialog.incident.affected_services.length === 0) && (
                      <span className="text-sm text-muted-foreground">None specified</span>
                    )}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialog({ open: false, incident: null })}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}