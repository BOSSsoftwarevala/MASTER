import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserRoles } from '@/hooks/useUserRoles';
import { usePendingApprovals, useUpdateApproval } from '@/hooks/useBossData';
import { usePendingDeployRequests, useUpdateDeployRequest } from '@/hooks/useDevelopmentData';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Rocket,
  Server,
  CreditCard,
  UserPlus,
  Clock
} from 'lucide-react';

export default function HighRiskApprovalsPage() {
  const { isSuperAdmin } = useUserRoles();
  const navigate = useNavigate();
  
  const { data: pendingApprovals = [], isLoading: approvalsLoading } = usePendingApprovals();
  const { data: pendingDeploys = [], isLoading: deploysLoading } = usePendingDeployRequests();
  const updateApproval = useUpdateApproval();
  const updateDeploy = useUpdateDeployRequest();

  if (!isSuperAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Only Super Admin can access this page.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const isLoading = approvalsLoading || deploysLoading;

  // High-risk items: high priority OR production deploys OR large amounts
  const highRiskApprovals = pendingApprovals.filter(a => 
    a.priority === 'high' || 
    a.type === 'risk' ||
    (a.amount && a.amount > 100000)
  ).map(a => ({ ...a, source: 'approval' as const }));

  const highRiskDeploys = pendingDeploys.filter(d => 
    d.environment === 'production' || 
    d.risk_level === 'high'
  ).map(d => ({
    id: d.id,
    type: 'deployment' as const,
    title: `Deploy ${d.version} to ${d.environment}`,
    description: d.release_notes || 'Production deployment',
    requester: d.requested_by,
    priority: 'high' as const,
    amount: null,
    created_at: d.created_at,
    source: 'deploy' as const,
    environment: d.environment,
  }));

  const allHighRisk = [...highRiskApprovals, ...highRiskDeploys];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deployment': return <Rocket className="h-5 w-5" />;
      case 'payment': return <CreditCard className="h-5 w-5" />;
      case 'access': return <UserPlus className="h-5 w-5" />;
      case 'risk': return <AlertTriangle className="h-5 w-5" />;
      default: return <Server className="h-5 w-5" />;
    }
  };

  const handleApprove = (item: typeof allHighRisk[0]) => {
    if (item.source === 'approval') {
      updateApproval.mutate({ id: item.id, status: 'approved' });
    } else {
      updateDeploy.mutate({ id: item.id, status: 'approved' });
    }
  };

  const handleReject = (item: typeof allHighRisk[0]) => {
    if (item.source === 'approval') {
      updateApproval.mutate({ id: item.id, status: 'rejected', rejection_reason: 'Rejected from high-risk review' });
    } else {
      updateDeploy.mutate({ id: item.id, status: 'rejected' });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              High-Risk Actions
            </h1>
            <p className="text-muted-foreground mt-1">Critical actions requiring immediate attention</p>
          </div>
          <Badge className="bg-destructive text-destructive-foreground text-lg px-4 py-2">
            {allHighRisk.length} Critical
          </Badge>
        </div>

        {/* Warning Banner */}
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <div>
                <p className="font-medium text-destructive">High-Risk Review Required</p>
                <p className="text-sm text-muted-foreground">
                  These actions have significant impact. Review carefully before approving.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Rocket className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {highRiskDeploys.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Production Deploys</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {highRiskApprovals.filter(a => a.amount && a.amount > 100000).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Large Payouts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {highRiskApprovals.filter(a => a.type === 'access').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Permission Escalations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* High-Risk List */}
        <Card>
          <CardHeader>
            <CardTitle>Critical Actions Queue</CardTitle>
            <CardDescription>Actions requiring immediate Super Admin approval</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-destructive/30">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-64" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-20" />
                      <Skeleton className="h-9 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : allHighRisk.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <p className="text-lg font-medium text-foreground">No High-Risk Items</p>
                <p className="text-muted-foreground">All critical actions have been processed.</p>
              </div>
            ) : (
              allHighRisk.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-destructive/20 text-destructive">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{item.title}</p>
                        <Badge className="bg-destructive/20 text-destructive border-destructive/30">
                          HIGH RISK
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>By: {item.requester}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                        {item.amount && (
                          <span className="font-medium text-destructive">₹{item.amount.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/dashboard/boss/approvals/detail/${item.id}?source=${item.source}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Review
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:text-destructive border-destructive/30"
                      onClick={() => handleReject(item)}
                      disabled={updateApproval.isPending || updateDeploy.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(item)}
                      disabled={updateApproval.isPending || updateDeploy.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
