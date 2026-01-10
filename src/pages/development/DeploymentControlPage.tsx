import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Rocket, CheckCircle, XCircle, AlertTriangle, Clock, RotateCcw, Server } from "lucide-react";
import { usePendingDeployRequests, useDeployRequests, useUpdateDeployRequest } from "@/hooks/useDevelopmentData";
import { formatDistanceToNow } from "date-fns";

const DeploymentControlPage = () => {
  const { data: pendingDeployments, isLoading } = usePendingDeployRequests();
  const { data: allDeploys } = useDeployRequests();
  const updateDeploy = useUpdateDeployRequest();

  const todaysSuccessful = allDeploys?.filter(d => {
    const today = new Date().toDateString();
    return d.status === 'success' && new Date(d.deployed_at || d.created_at).toDateString() === today;
  }).length || 0;

  const highRiskCount = pendingDeployments?.filter(d => d.risk_level === 'high').length || 0;
  const withRollbackPlan = pendingDeployments?.filter(d => d.rollback_plan).length || 0;

  const getRiskBadge = (level: string | null) => {
    switch (level) {
      case "high":
        return <Badge variant="destructive">High Risk</Badge>;
      case "medium":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Medium Risk</Badge>;
      case "low":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Low Risk</Badge>;
      default:
        return <Badge variant="secondary">{level || 'Unknown'}</Badge>;
    }
  };

  const getEnvironmentBadge = (env: string) => {
    switch (env) {
      case "production":
        return <Badge variant="destructive">{env}</Badge>;
      case "staging":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{env}</Badge>;
      default:
        return <Badge variant="secondary">{env}</Badge>;
    }
  };

  const handleApprove = (id: string) => {
    updateDeploy.mutate({ id, status: 'approved' });
  };

  const handleReject = (id: string) => {
    updateDeploy.mutate({ id, status: 'rejected', rejection_reason: 'Rejected by admin' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deployment Control</h1>
          <p className="text-muted-foreground">Approve or reject pending deployments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Deploys</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingDeployments?.length || 0}</div>
              <p className="text-xs text-muted-foreground">awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Deploys</CardTitle>
              <Rocket className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">{todaysSuccessful}</div>
              <p className="text-xs text-muted-foreground">successfully deployed</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{highRiskCount}</div>
              <p className="text-xs text-muted-foreground">requires careful review</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rollback Ready</CardTitle>
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{withRollbackPlan}</div>
              <p className="text-xs text-muted-foreground">have rollback plans</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Deployments */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Pending Deployments
            </CardTitle>
            <CardDescription>Review and approve or reject deployment requests</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : !pendingDeployments || pendingDeployments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending deployments</p>
            ) : (
              <div className="space-y-4">
                {pendingDeployments.map((deploy) => (
                  <div key={deploy.id} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${deploy.risk_level === 'high' ? 'bg-destructive/20' : deploy.risk_level === 'medium' ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`}>
                          <Server className={`h-5 w-5 ${deploy.risk_level === 'high' ? 'text-destructive' : deploy.risk_level === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`} />
                        </div>
                        <div>
                          <p className="font-medium">Deploy Request</p>
                          <p className="text-sm text-muted-foreground">
                            Version {deploy.version} • {formatDistanceToNow(new Date(deploy.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getEnvironmentBadge(deploy.environment)}
                        {getRiskBadge(deploy.risk_level)}
                      </div>
                    </div>

                    {deploy.release_notes && (
                      <div className="mb-4 p-3 rounded-lg bg-muted/20 border border-border/30">
                        <p className="text-sm text-muted-foreground">{deploy.release_notes}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-6 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        {deploy.rollback_plan ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span>Rollback Plan: {deploy.rollback_plan ? "Ready" : "Missing"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <Button 
                        onClick={() => handleApprove(deploy.id)} 
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                        disabled={updateDeploy.isPending}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve Deploy
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleReject(deploy.id)} 
                        className="gap-2"
                        disabled={updateDeploy.isPending}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject Deploy
                      </Button>
                    </div>
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

export default DeploymentControlPage;
