import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccessRequests, useUpdateAccessRequest, useRolePermissionsRealtime } from '@/hooks/useRolePermissions';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAuth } from '@/hooks/useAuth';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function PrivilegeEscalationPage() {
  const { isSuperAdmin } = useUserRoles();
  const { user } = useAuth();
  const { data: accessRequests, isLoading } = useAccessRequests();
  const updateMutation = useUpdateAccessRequest();
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  useRolePermissionsRealtime();

  if (!isSuperAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Shield className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const escalationRequests = accessRequests?.filter(r => r.request_type === 'privilege_escalation') || [];
  const pendingEscalations = escalationRequests.filter(r => r.status === 'pending');
  const resolvedEscalations = escalationRequests.filter(r => r.status !== 'pending');

  const handleApprove = (id: string) => {
    updateMutation.mutate({
      id,
      status: 'approved',
      reviewedBy: user?.id || '',
      reviewNotes: reviewNotes[id],
    });
  };

  const handleReject = (id: string) => {
    if (!reviewNotes[id]) {
      return;
    }
    updateMutation.mutate({
      id,
      status: 'rejected',
      reviewedBy: user?.id || '',
      reviewNotes: reviewNotes[id],
    });
  };

  const getRiskBadge = (level: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-500/10 text-green-500 border-green-500/20',
      medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      critical: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return (
      <Badge variant="outline" className={colors[level] || ''}>
        <AlertTriangle className="h-3 w-3 mr-1" />
        {level.toUpperCase()}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Privilege Escalation</h1>
          <p className="text-muted-foreground">Review and approve privilege escalation requests</p>
        </div>

        {/* Warning */}
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-600 dark:text-red-400">High Risk Actions</h3>
                <p className="text-sm text-muted-foreground">
                  Privilege escalations grant elevated access. Review each request carefully before approval.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingEscalations.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {pendingEscalations.filter(e => e.risk_level === 'high' || e.risk_level === 'critical').length}
                  </p>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{resolvedEscalations.length}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Escalations */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Escalation Requests</CardTitle>
            <CardDescription>Requests requiring your review and decision</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : pendingEscalations.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500/30 mb-4" />
                <p className="text-muted-foreground">No pending escalation requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingEscalations.map((request) => (
                  <Card key={request.id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold">{request.requester_name}</h4>
                            {getRiskBadge(request.risk_level)}
                            <Badge variant="outline">{request.requested_role}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{request.reason}</p>
                          {request.impact_summary && (
                            <p className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded">
                              <strong>Impact:</strong> {request.impact_summary}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(request.created_at), 'MMM d, yyyy HH:mm')}
                            </span>
                            <span>Scope: {request.scope}</span>
                          </div>
                          <div className="pt-2">
                            <Textarea
                              placeholder="Add review notes (required for rejection)..."
                              value={reviewNotes[request.id] || ''}
                              onChange={(e) => setReviewNotes({ ...reviewNotes, [request.id]: e.target.value })}
                              rows={2}
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            disabled={updateMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(request.id)}
                            disabled={updateMutation.isPending || !reviewNotes[request.id]}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
