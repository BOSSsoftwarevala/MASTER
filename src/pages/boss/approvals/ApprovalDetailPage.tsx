import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAuth } from '@/hooks/useAuth';
import { useApprovals, useUpdateApproval, useCreateAuditLog } from '@/hooks/useBossData';
import { usePendingDeployRequests, useUpdateDeployRequest } from '@/hooks/useDevelopmentData';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  ArrowLeft,
  User,
  Calendar,
  DollarSign,
  FileText,
  Sparkles,
  RotateCcw,
  Pause
} from 'lucide-react';

export default function ApprovalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source') || 'approval';
  const navigate = useNavigate();
  const { isSuperAdmin } = useUserRoles();
  const { user } = useAuth();
  
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  
  const { data: approvals = [], isLoading: approvalsLoading } = useApprovals();
  const { data: deploys = [], isLoading: deploysLoading } = usePendingDeployRequests();
  const updateApproval = useUpdateApproval();
  const updateDeploy = useUpdateDeployRequest();
  const createAuditLog = useCreateAuditLog();

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

  // Find the item
  let item: any = null;
  if (source === 'approval') {
    item = approvals.find(a => a.id === id);
  } else if (source === 'deploy') {
    const deploy = deploys.find(d => d.id === id);
    if (deploy) {
      item = {
        id: deploy.id,
        type: 'deployment',
        title: `Deploy ${deploy.version}`,
        description: deploy.release_notes || `Deploy to ${deploy.environment}`,
        requester: deploy.requested_by,
        priority: deploy.risk_level || 'medium',
        amount: null,
        created_at: deploy.created_at,
        status: deploy.status,
        environment: deploy.environment,
        rollback_plan: deploy.rollback_plan,
        source: 'deploy',
      };
    }
  }

  const handleApprove = async () => {
    if (!item) return;
    
    if (source === 'approval') {
      updateApproval.mutate({ id: item.id, status: 'approved' });
    } else {
      updateDeploy.mutate({ id: item.id, status: 'approved' });
    }
    
    // Log the action
    createAuditLog.mutate({
      action: 'approval_granted',
      module: 'approval_center',
      user_email: user?.email || 'unknown',
      user_role: 'super_admin',
      details: `Approved: ${item.title}`,
      severity: 'info',
    });
    
    navigate('/dashboard/boss/approvals/pending');
  };

  const handleReject = async () => {
    if (!item || !rejectionReason) return;
    
    if (source === 'approval') {
      updateApproval.mutate({ id: item.id, status: 'rejected', rejection_reason: rejectionReason });
    } else {
      updateDeploy.mutate({ id: item.id, status: 'rejected' });
    }
    
    // Log the action
    createAuditLog.mutate({
      action: 'approval_rejected',
      module: 'approval_center',
      user_email: user?.email || 'unknown',
      user_role: 'super_admin',
      details: `Rejected: ${item.title} - Reason: ${rejectionReason}`,
      severity: 'warn',
    });
    
    navigate('/dashboard/boss/approvals/pending');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'medium': return 'bg-amber-500/20 text-amber-600 border-amber-500/30';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!item) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 mx-auto text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Request Not Found</h2>
            <p className="text-muted-foreground">This approval request may have been processed already.</p>
            <Button className="mt-4" onClick={() => navigate('/dashboard/boss/approvals/pending')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Queue
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Approval Detail</h1>
            <p className="text-muted-foreground">Review request before making a decision</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription className="mt-1">Request ID: {item.id}</CardDescription>
                  </div>
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority} priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1 text-foreground">{item.description || 'No description provided'}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Requested By</p>
                      <p className="font-medium text-foreground">{item.requester}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Created At</p>
                      <p className="font-medium text-foreground">{new Date(item.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  {item.amount && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="font-medium text-foreground">₹{item.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-medium text-foreground capitalize">{item.type}</p>
                    </div>
                  </div>
                </div>

                {item.rollback_plan && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <RotateCcw className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-muted-foreground">Rollback Plan</Label>
                      </div>
                      <p className="text-foreground bg-muted p-3 rounded-lg">{item.rollback_plan}</p>
                    </div>
                  </>
                )}

                {item.environment && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-muted-foreground">Target Environment</Label>
                      <Badge className="mt-2" variant={item.environment === 'production' ? 'destructive' : 'secondary'}>
                        {item.environment}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* AI Risk Summary (Mock) */}
            <Card className="border-purple-500/30">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <CardTitle>AI Risk Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Risk Score</span>
                    <Badge className={getPriorityColor(item.priority)}>{item.priority === 'high' ? '8.5/10' : item.priority === 'medium' ? '5.2/10' : '2.1/10'}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Affected Systems</span>
                    <span className="text-foreground">{item.type === 'deployment' ? 'Production servers' : 'Core modules'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Estimated Impact</span>
                    <span className="text-foreground">{item.priority === 'high' ? 'Critical' : item.priority === 'medium' ? 'Moderate' : 'Minimal'}</span>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      <strong>AI Recommendation:</strong> {item.priority === 'high' 
                        ? 'Careful review recommended. Consider scheduling during low-traffic period.' 
                        : 'Standard risk level. Proceed with normal approval workflow.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Decision</CardTitle>
                <CardDescription>Make your approval decision</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showRejectForm ? (
                  <>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      size="lg"
                      onClick={handleApprove}
                      disabled={updateApproval.isPending || updateDeploy.isPending}
                    >
                      <CheckCircle className="h-5 w-5 mr-2" /> Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      size="lg"
                      onClick={() => setShowRejectForm(true)}
                    >
                      <XCircle className="h-5 w-5 mr-2" /> Reject
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="lg"
                    >
                      <Pause className="h-5 w-5 mr-2" /> Hold
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label>Rejection Reason (Required)</Label>
                      <Textarea 
                        placeholder="Provide reason for rejection..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="mt-2"
                        rows={4}
                      />
                    </div>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={handleReject}
                      disabled={!rejectionReason || updateApproval.isPending || updateDeploy.isPending}
                    >
                      <XCircle className="h-5 w-5 mr-2" /> Confirm Rejection
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowRejectForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Audit Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Audit Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Action</span>
                    <span className="text-foreground">Approval Decision</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Module</span>
                    <span className="text-foreground">Approval Center</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User</span>
                    <span className="text-foreground">{user?.email || 'Super Admin'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timestamp</span>
                    <span className="text-foreground">{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
