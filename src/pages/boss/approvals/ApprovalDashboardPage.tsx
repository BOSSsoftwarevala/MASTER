import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useUserRoles } from '@/hooks/useUserRoles';
import { usePendingApprovals, useApprovals } from '@/hooks/useBossData';
import { usePendingDeployRequests } from '@/hooks/useDevelopmentData';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Clock, 
  Settings, 
  CreditCard, 
  AlertTriangle, 
  Sparkles, 
  UserPlus,
  Rocket,
  RotateCcw,
  TrendingUp,
  ChevronRight,
  Timer
} from 'lucide-react';

export default function ApprovalDashboardPage() {
  const { isSuperAdmin } = useUserRoles();
  const navigate = useNavigate();
  
  const { data: pendingApprovals = [], isLoading: approvalsLoading } = usePendingApprovals();
  const { data: allApprovals = [], isLoading: historyLoading } = useApprovals();
  const { data: pendingDeploys = [], isLoading: deploysLoading } = usePendingDeployRequests();

  if (!isSuperAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Only Super Admin can access Approval Center.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const isLoading = approvalsLoading || deploysLoading || historyLoading;

  // Combine all pending items
  const allPending = [
    ...pendingApprovals,
    ...pendingDeploys.map(d => ({ 
      ...d, 
      type: 'deployment' as const,
      priority: d.risk_level || 'medium'
    })),
  ];

  // Stats by type
  const typeStats = {
    system: pendingApprovals.filter(a => a.type === 'system').length,
    payment: pendingApprovals.filter(a => a.type === 'payment').length,
    deployment: pendingDeploys.length,
    access: pendingApprovals.filter(a => a.type === 'access').length,
    ai: pendingApprovals.filter(a => a.type === 'ai').length,
    risk: pendingApprovals.filter(a => a.type === 'risk').length,
  };

  // Risk stats
  const highRiskCount = allPending.filter(a => a.priority === 'high').length;
  const mediumRiskCount = allPending.filter(a => a.priority === 'medium').length;
  const lowRiskCount = allPending.filter(a => a.priority === 'low').length;

  // SLA calculation (mock - items pending > 24 hours)
  const overdueCount = allPending.filter(a => {
    const created = new Date(a.created_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    return hoursDiff > 24;
  }).length;

  // Approval rate from history
  const approvedCount = allApprovals.filter(a => a.status === 'approved').length;
  const rejectedCount = allApprovals.filter(a => a.status === 'rejected').length;
  const approvalRate = allApprovals.length > 0 
    ? Math.round((approvedCount / (approvedCount + rejectedCount)) * 100) 
    : 0;

  const categoryCards = [
    { label: 'System Changes', count: typeStats.system, icon: Settings, color: 'primary', path: '/dashboard/boss/approvals/pending?type=system' },
    { label: 'Payments', count: typeStats.payment, icon: CreditCard, color: 'green-500', path: '/dashboard/boss/approvals/payment' },
    { label: 'Deployments', count: typeStats.deployment, icon: Rocket, color: 'blue-500', path: '/dashboard/boss/approvals/pending?type=deployment' },
    { label: 'Access Requests', count: typeStats.access, icon: UserPlus, color: 'amber-500', path: '/dashboard/boss/approvals/access' },
    { label: 'AI Suggestions', count: typeStats.ai, icon: Sparkles, color: 'purple-500', path: '/dashboard/boss/approvals/ai' },
    { label: 'High Risk', count: highRiskCount, icon: AlertTriangle, color: 'destructive', path: '/dashboard/boss/approvals/high-risk' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Approval Dashboard</h1>
            <p className="text-muted-foreground mt-1">Centralized authorization hub for all sensitive actions</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              {allPending.length} Pending
            </Badge>
            {overdueCount > 0 && (
              <Badge className="bg-destructive text-lg px-4 py-2">
                <Timer className="h-4 w-4 mr-2" />
                {overdueCount} Overdue
              </Badge>
            )}
          </div>
        </div>

        {/* Main Stats */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground">{allPending.length}</p>
                    <p className="text-sm text-muted-foreground">Total Pending</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-destructive">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground">{highRiskCount}</p>
                    <p className="text-sm text-muted-foreground">High Risk</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground">{overdueCount}</p>
                    <p className="text-sm text-muted-foreground">SLA Breached</p>
                  </div>
                  <Timer className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground">{approvalRate}%</p>
                    <p className="text-sm text-muted-foreground">Approval Rate</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Risk Level Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Level Breakdown</CardTitle>
            <CardDescription>Pending approvals by risk severity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm text-foreground">High Risk</span>
                </div>
                <span className="font-medium text-foreground">{highRiskCount}</span>
              </div>
              <Progress value={allPending.length > 0 ? (highRiskCount / allPending.length) * 100 : 0} className="h-2 bg-muted" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm text-foreground">Medium Risk</span>
                </div>
                <span className="font-medium text-foreground">{mediumRiskCount}</span>
              </div>
              <Progress value={allPending.length > 0 ? (mediumRiskCount / allPending.length) * 100 : 0} className="h-2 bg-muted" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-foreground">Low Risk</span>
                </div>
                <span className="font-medium text-foreground">{lowRiskCount}</span>
              </div>
              <Progress value={allPending.length > 0 ? (lowRiskCount / allPending.length) * 100 : 0} className="h-2 bg-muted" />
            </div>
          </CardContent>
        </Card>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryCards.map((card) => (
            <Card 
              key={card.label}
              className={`cursor-pointer hover:shadow-lg transition-all border-t-4 border-t-${card.color}`}
              onClick={() => navigate(card.path)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <card.icon className={`h-8 w-8 mb-2 text-${card.color}`} />
                  <p className="text-2xl font-bold text-foreground">{card.count}</p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/boss/approvals/pending')}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Review Pending Queue</p>
                  <p className="text-sm text-muted-foreground">{allPending.length} items waiting for your decision</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/boss/approvals/history')}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <RotateCcw className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">View Approval History</p>
                  <p className="text-sm text-muted-foreground">{allApprovals.length} total decisions made</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
