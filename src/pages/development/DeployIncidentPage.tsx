import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { XCircle, AlertTriangle, Clock, ArrowUpRight, Pause, Server, Calendar } from "lucide-react";
import { useDeployIncidents, useActiveDeployIncidents, useUpdateDeployIncident } from "@/hooks/useDevelopmentData";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";

const DeployIncidentPage = () => {
  const { data: allIncidents, isLoading } = useDeployIncidents();
  const { data: activeIncidents } = useActiveDeployIncidents();
  const updateIncident = useUpdateDeployIncident();

  const resolvedIncidents = allIncidents?.filter(i => i.status === 'resolved') || [];
  
  const avgRecoveryTime = resolvedIncidents.length > 0
    ? Math.round(resolvedIncidents.reduce((acc, i) => acc + (i.recovery_time_minutes || 0), 0) / resolvedIncidents.length)
    : 0;

  const escalatedCount = allIncidents?.filter(i => i.escalated_to).length || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Resolved</Badge>;
      case "open":
        return <Badge variant="destructive">Active</Badge>;
      case "investigating":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Investigating</Badge>;
      case "escalated":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Escalated</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">High</Badge>;
      case "medium":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Low</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const handleEscalate = (id: string) => {
    updateIncident.mutate({ id, status: 'escalated' });
    toast.info("Incident escalated to Boss", {
      description: "Boss has been notified about this incident"
    });
  };

  const handleFreezePipeline = (id: string) => {
    toast.warning("Pipeline freeze requested", {
      description: "Approval required to freeze the pipeline"
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deploy Incidents</h1>
          <p className="text-muted-foreground">Failed deployments and incident management</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{activeIncidents?.length || 0}</div>
              <p className="text-xs text-muted-foreground">require attention</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedIncidents.length}</div>
              <p className="text-xs text-muted-foreground">incidents resolved</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Recovery</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRecoveryTime} min</div>
              <p className="text-xs text-muted-foreground">average recovery time</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escalated</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{escalatedCount}</div>
              <p className="text-xs text-muted-foreground">escalated to Boss</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Incidents */}
        {activeIncidents && activeIncidents.length > 0 && (
          <Card className="bg-destructive/10 border-destructive/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Active Incidents
              </CardTitle>
              <CardDescription>Incidents requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeIncidents.map((incident) => (
                  <div key={incident.id} className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-destructive/20">
                          <XCircle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium">{incident.title}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(incident.created_at), 'yyyy-MM-dd HH:mm')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(incident.severity)}
                        {getStatusBadge(incident.status)}
                      </div>
                    </div>
                    
                    {incident.description && (
                      <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border/30">
                        <p className="text-sm font-medium mb-1">Description:</p>
                        <p className="text-sm text-muted-foreground">{incident.description}</p>
                      </div>
                    )}

                    {incident.root_cause && (
                      <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border/30">
                        <p className="text-sm font-medium mb-1">Root Cause:</p>
                        <p className="text-sm text-muted-foreground">{incident.root_cause}</p>
                      </div>
                    )}

                    {incident.affected_services && incident.affected_services.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {incident.affected_services.map((service, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => handleEscalate(incident.id)}
                        disabled={updateIncident.isPending}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        Escalate to Boss
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="gap-2"
                        onClick={() => handleFreezePipeline(incident.id)}
                      >
                        <Pause className="h-4 w-4" />
                        Freeze Pipeline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resolved Incidents */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Recent Incidents
            </CardTitle>
            <CardDescription>Failed deployments and their resolution</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : resolvedIncidents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No resolved incidents</p>
            ) : (
              <div className="space-y-4">
                {resolvedIncidents.map((incident) => (
                  <div key={incident.id} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-muted/50">
                          <XCircle className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{incident.title}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDistanceToNow(new Date(incident.created_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">Recovery Time</p>
                          <p className="font-medium">{incident.recovery_time_minutes || 'N/A'} min</p>
                        </div>
                        {getStatusBadge(incident.status)}
                      </div>
                    </div>
                    
                    {incident.root_cause && (
                      <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                        <p className="text-sm"><span className="font-medium">Root Cause:</span> {incident.root_cause}</p>
                      </div>
                    )}

                    {incident.resolution && (
                      <div className="p-3 rounded-lg bg-muted/20 border border-border/30 mt-2">
                        <p className="text-sm"><span className="font-medium">Resolution:</span> {incident.resolution}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DeployIncidentPage;
