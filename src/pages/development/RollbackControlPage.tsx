import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RotateCcw, CheckCircle, Clock, Tag, Calendar } from "lucide-react";
import { useDeployRequests, usePendingRollbackRequests, useCreateRollbackRequest } from "@/hooks/useDevelopmentData";
import { formatDistanceToNow, format } from "date-fns";

const RollbackControlPage = () => {
  const { data: deploys, isLoading } = useDeployRequests();
  const { data: pendingRollbacks } = usePendingRollbackRequests();
  const createRollback = useCreateRollbackRequest();

  // Get successful production deploys as rollback points
  const rollbackPoints = deploys?.filter(d => 
    d.status === 'success' && d.environment === 'production'
  ).slice(0, 10) || [];

  const currentVersion = rollbackPoints[0]?.version || 'N/A';
  const lastKnownGood = rollbackPoints[1];

  const handleRequestRollback = (version: string, deployId: string) => {
    createRollback.mutate({
      deploy_request_id: deployId,
      target_version: version,
      reason: `Rollback to stable version ${version}`,
      impact_scope: 'production',
      status: 'pending',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rollback Control</h1>
          <p className="text-muted-foreground">Request rollbacks to previous stable versions (Approval Required)</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Points</CardTitle>
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rollbackPoints.length}</div>
              <p className="text-xs text-muted-foreground">stable rollback points</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Known Good</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">
                {lastKnownGood?.version || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">recommended for rollback</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Rollbacks</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRollbacks?.length || 0}</div>
              <p className="text-xs text-muted-foreground">awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Version</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentVersion}</div>
              <p className="text-xs text-muted-foreground">in production</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Rollback Requests */}
        {pendingRollbacks && pendingRollbacks.length > 0 && (
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Pending Rollback Requests
              </CardTitle>
              <CardDescription>Rollbacks awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRollbacks.map((rollback) => (
                  <div key={rollback.id} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-amber-500/20">
                          <RotateCcw className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Rollback to {rollback.target_version}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(rollback.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                        Awaiting Approval
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reason: {rollback.reason}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Rollback Points */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Available Rollback Points
            </CardTitle>
            <CardDescription>Select a stable version to request rollback</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : rollbackPoints.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No rollback points available</p>
            ) : (
              <div className="space-y-4">
                {rollbackPoints.slice(1).map((point, idx) => (
                  <div key={point.id} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${idx === 0 ? 'bg-emerald-500/20' : 'bg-muted/50'}`}>
                          {idx === 0 ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <Tag className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold">{point.version}</span>
                            {idx === 0 && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                Last Known Good
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(point.deployed_at || point.created_at), 'yyyy-MM-dd HH:mm')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          className="gap-2"
                          onClick={() => handleRequestRollback(point.version, point.id)}
                          disabled={createRollback.isPending}
                        >
                          <RotateCcw className="h-4 w-4" />
                          Request Rollback
                        </Button>
                      </div>
                    </div>
                    {point.release_notes && (
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <p className="text-sm text-muted-foreground">{point.release_notes}</p>
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

export default RollbackControlPage;
