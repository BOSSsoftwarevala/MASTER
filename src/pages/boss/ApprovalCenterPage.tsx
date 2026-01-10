import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserRoles } from '@/hooks/useUserRoles';
import { usePendingApprovals, useUpdateApproval } from '@/hooks/useBossData';
import { usePendingDeployRequests, useUpdateDeployRequest } from '@/hooks/useDevelopmentData';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield,
  Settings,
  CreditCard,
  AlertTriangle,
  Sparkles,
  UserPlus,
  Eye,
  Rocket,
  RotateCcw
} from 'lucide-react';

export default function ApprovalCenterPage() {
  const { isSuperAdmin } = useUserRoles();
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: approvals = [], isLoading: approvalsLoading } = usePendingApprovals();
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
            <p className="text-muted-foreground">Only Super Admin can access Approval Center.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Settings className="h-5 w-5" />;
      case 'payment': return <CreditCard className="h-5 w-5" />;
      case 'risk': return <AlertTriangle className="h-5 w-5" />;
      case 'ai': return <Sparkles className="h-5 w-5" />;
      case 'access': return <UserPlus className="h-5 w-5" />;
      case 'deployment': return <Rocket className="h-5 w-5" />;
      case 'rollback': return <RotateCcw className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'bg-primary/20 text-primary';
      case 'payment': return 'bg-green-500/20 text-green-600';
      case 'risk': return 'bg-destructive/20 text-destructive';
      case 'ai': return 'bg-purple-500/20 text-purple-500';
      case 'access': return 'bg-amber-500/20 text-amber-600';
      case 'deployment': return 'bg-blue-500/20 text-blue-600';
      case 'rollback': return 'bg-orange-500/20 text-orange-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-destructive/20 text-destructive border-destructive/30">High Priority</Badge>;
      case 'medium': return <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">Medium</Badge>;
      case 'low': return <Badge className="bg-muted text-muted-foreground">Low</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Combine approvals with pending deploys
  const allItems = [
    ...approvals.map(a => ({ ...a, source: 'approval' as const })),
    ...pendingDeploys.map(d => ({
      id: d.id,
      type: 'deployment' as const,
      title: `Deploy ${d.version}`,
      description: d.release_notes || `Deploy to ${d.environment}`,
      requester: d.requested_by,
      priority: d.risk_level || 'medium',
      amount: null,
      created_at: d.created_at,
      source: 'deploy' as const,
      environment: d.environment,
      risk_level: d.risk_level,
    })),
  ];

  const filteredItems = activeTab === 'all' 
    ? allItems 
    : allItems.filter(a => a.type === activeTab);

  const handleApprove = (item: typeof allItems[0]) => {
    if (item.source === 'approval') {
      updateApproval.mutate({ id: item.id, status: 'approved' });
    } else if (item.source === 'deploy') {
      updateDeploy.mutate({ id: item.id, status: 'approved' });
    }
  };

  const handleReject = (item: typeof allItems[0]) => {
    if (item.source === 'approval') {
      updateApproval.mutate({ id: item.id, status: 'rejected' });
    } else if (item.source === 'deploy') {
      updateDeploy.mutate({ id: item.id, status: 'rejected' });
    }
  };

  const isLoading = approvalsLoading || deploysLoading;

  const stats = [
    { label: 'System Changes', count: allItems.filter(a => a.type === 'system').length, icon: Settings, color: 'primary' },
    { label: 'Payments', count: allItems.filter(a => a.type === 'payment').length, icon: CreditCard, color: 'success' },
    { label: 'High Risk', count: allItems.filter(a => a.type === 'risk').length, icon: AlertTriangle, color: 'destructive' },
    { label: 'Deployments', count: allItems.filter(a => a.type === 'deployment').length, icon: Rocket, color: 'blue' },
    { label: 'Access Requests', count: allItems.filter(a => a.type === 'access').length, icon: UserPlus, color: 'warning' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Approval Center</h1>
            <p className="text-muted-foreground mt-1">Review and approve pending requests</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              {allItems.length} Pending
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <Card 
              key={stat.label} 
              className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => setActiveTab(stat.label.toLowerCase().split(' ')[0])}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.count}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Approval List */}
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All ({allItems.length})</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="deployment">Deploy</TabsTrigger>
                <TabsTrigger value="access">Access</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
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
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <p className="text-lg font-medium text-foreground">All caught up!</p>
                <p className="text-muted-foreground">No pending approvals in this category.</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{item.title}</p>
                        {getPriorityBadge(item.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>By: {item.requester}</span>
                        <span>{new Date(item.created_at).toLocaleString()}</span>
                        {item.amount && <span className="font-medium text-foreground">₹{item.amount.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" /> Review
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:text-destructive" 
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
