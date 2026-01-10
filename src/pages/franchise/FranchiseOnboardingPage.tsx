import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UserPlus, Shield, FileText, MapPin, Check, X, Eye } from 'lucide-react';
import { useFranchiseApplications, useUpdateFranchiseApplication, useFranchiseRealtime } from '@/hooks/useFranchiseData';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { useState } from 'react';

export default function FranchiseOnboardingPage() {
  const { data: applications, isLoading } = useFranchiseApplications();
  const updateApplication = useUpdateFranchiseApplication();
  const { isSuperAdmin } = useUserRoles();
  const { user } = useAuth();
  const [selectedApp, setSelectedApp] = useState<typeof applications extends (infer T)[] ? T : never | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'view' | null>(null);

  useFranchiseRealtime();

  const handleAction = (app: NonNullable<typeof selectedApp>, type: 'approve' | 'reject' | 'view') => {
    setSelectedApp(app);
    setActionType(type);
    setReviewNotes('');
    setRejectionReason('');
  };

  const handleSubmit = async () => {
    if (!selectedApp || !user || !actionType) return;

    if (actionType === 'approve') {
      await updateApplication.mutateAsync({
        id: selectedApp.id,
        status: 'approved',
        reviewedBy: user.id,
        reviewNotes,
      });
    } else if (actionType === 'reject') {
      await updateApplication.mutateAsync({
        id: selectedApp.id,
        status: 'rejected',
        reviewedBy: user.id,
        reviewNotes,
        rejectionReason,
      });
    }

    setSelectedApp(null);
    setActionType(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
      pending: { variant: 'secondary', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      approved: { variant: 'default', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
      rejected: { variant: 'destructive', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
      expired: { variant: 'outline', className: 'bg-muted text-muted-foreground' },
    };
    return variants[status] || variants.pending;
  };

  const getPlanBadge = (tier: string) => {
    const variants: Record<string, string> = {
      silver: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
      gold: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      platinum: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    };
    return variants[tier] || variants.silver;
  };

  if (!isSuperAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <Shield className="h-12 w-12 mx-auto text-destructive mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">Only Super Admins can access this page.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const pendingApps = applications?.filter(a => a.status === 'pending') || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Franchise Onboarding</h1>
            <p className="text-muted-foreground">Review and approve franchise applications</p>
          </div>
          <Badge variant="outline" className="gap-1">
            <UserPlus className="h-3 w-3" />
            {pendingApps.length} Pending
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : applications && applications.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Territory</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{app.applicant_name}</p>
                          <p className="text-sm text-muted-foreground">{app.applicant_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{app.business_name}</p>
                          <p className="text-sm text-muted-foreground">{app.legal_name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="capitalize">{app.territory_level}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPlanBadge(app.plan_tier)}>
                          {app.plan_tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusBadge(app.status).variant}
                          className={getStatusBadge(app.status).className}
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(app.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction(app, 'view')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {app.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-emerald-400 hover:text-emerald-300"
                                onClick={() => handleAction(app, 'approve')}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive/80"
                                onClick={() => handleAction(app, 'reject')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Applications</h3>
                <p className="text-muted-foreground">No franchise applications to review.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedApp && !!actionType} onOpenChange={() => { setSelectedApp(null); setActionType(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'view' && 'Application Details'}
              {actionType === 'approve' && 'Approve Application'}
              {actionType === 'reject' && 'Reject Application'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'view' && 'Review the franchise application details'}
              {actionType === 'approve' && 'Confirm approval of this franchise application'}
              {actionType === 'reject' && 'Provide a reason for rejection'}
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Applicant</p>
                  <p className="font-medium">{selectedApp.applicant_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedApp.applicant_email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Business Name</p>
                  <p className="font-medium">{selectedApp.business_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Legal Name</p>
                  <p className="font-medium">{selectedApp.legal_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Territory Level</p>
                  <p className="font-medium capitalize">{selectedApp.territory_level}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Plan Tier</p>
                  <Badge className={getPlanBadge(selectedApp.plan_tier)}>
                    {selectedApp.plan_tier}
                  </Badge>
                </div>
              </div>

              {(actionType === 'approve' || actionType === 'reject') && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="notes">Review Notes</Label>
                    <Textarea
                      id="notes"
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add notes about this decision..."
                    />
                  </div>
                  {actionType === 'reject' && (
                    <div>
                      <Label htmlFor="reason">Rejection Reason (Required)</Label>
                      <Textarea
                        id="reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Explain why this application is being rejected..."
                        required
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedApp(null); setActionType(null); }}>
              Cancel
            </Button>
            {actionType === 'approve' && (
              <Button 
                onClick={handleSubmit}
                disabled={updateApplication.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Approve Franchise
              </Button>
            )}
            {actionType === 'reject' && (
              <Button 
                variant="destructive"
                onClick={handleSubmit}
                disabled={updateApplication.isPending || !rejectionReason}
              >
                Reject Application
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
