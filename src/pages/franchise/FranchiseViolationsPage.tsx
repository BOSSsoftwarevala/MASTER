import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Shield, Building, AlertCircle, Ban, Eye } from 'lucide-react';
import { useFranchiseViolations, useUpdateFranchiseViolation, useFranchiseRealtime } from '@/hooks/useFranchiseData';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { useState } from 'react';

export default function FranchiseViolationsPage() {
  const { data: violations, isLoading } = useFranchiseViolations();
  const updateViolation = useUpdateFranchiseViolation();
  const { isSuperAdmin } = useUserRoles();
  const { user } = useAuth();
  const [selectedViolation, setSelectedViolation] = useState<typeof violations extends (infer T)[] ? T : never | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actionType, setActionType] = useState<'view' | 'warn' | 'suspend' | null>(null);

  useFranchiseRealtime();

  const handleAction = (violation: NonNullable<typeof selectedViolation>, type: 'view' | 'warn' | 'suspend') => {
    setSelectedViolation(violation);
    setActionType(type);
    setResolutionNotes('');
  };

  const handleSubmit = async () => {
    if (!selectedViolation || !user || !actionType) return;

    if (actionType === 'warn') {
      await updateViolation.mutateAsync({
        id: selectedViolation.id,
        status: 'warning_issued',
        warningIssuedBy: user.id,
      });
    } else if (actionType === 'suspend') {
      await updateViolation.mutateAsync({
        id: selectedViolation.id,
        status: 'suspended',
        resolvedBy: user.id,
        resolutionNotes,
      });
    }

    setSelectedViolation(null);
    setActionType(null);
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      policy_breach: { className: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Policy Breach' },
      territory_abuse: { className: 'bg-orange-500/20 text-orange-400 border-orange-500/30', label: 'Territory Abuse' },
      payment_issue: { className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Payment Issue' },
      sla_violation: { className: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'SLA Violation' },
      brand_misuse: { className: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Brand Misuse' },
    };
    return variants[type] || { className: 'bg-muted text-muted-foreground', label: type };
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { className: string }> = {
      low: { className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      medium: { className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      high: { className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
      critical: { className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    };
    return variants[severity] || variants.medium;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      open: { className: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Open' },
      warning_issued: { className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Warning Issued' },
      suspended: { className: 'bg-orange-500/20 text-orange-400 border-orange-500/30', label: 'Suspended' },
      resolved: { className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Resolved' },
      escalated: { className: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Escalated' },
    };
    return variants[status] || { className: 'bg-muted text-muted-foreground', label: status };
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

  const openViolations = violations?.filter(v => v.status === 'open') || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Franchise Violations</h1>
            <p className="text-muted-foreground">Monitor and manage policy violations</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {violations?.length || 0} Total
            </Badge>
            {openViolations.length > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {openViolations.length} Open
              </Badge>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              All Violations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : violations && violations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Franchise</TableHead>
                    <TableHead>Violation</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {violations.map((violation) => (
                    <TableRow key={violation.id}>
                      <TableCell>
                        {violation.franchises ? (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{violation.franchises.legal_name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{violation.title}</p>
                          {violation.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">{violation.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeBadge(violation.violation_type).className}>
                          {getTypeBadge(violation.violation_type).label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityBadge(violation.severity).className}>
                          {violation.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(violation.status).className}>
                          {getStatusBadge(violation.status).label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(violation.reported_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction(violation, 'view')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {violation.status === 'open' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-yellow-400 hover:text-yellow-300"
                                onClick={() => handleAction(violation, 'warn')}
                              >
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive/80"
                                onClick={() => handleAction(violation, 'suspend')}
                              >
                                <Ban className="h-4 w-4" />
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
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Violations</h3>
                <p className="text-muted-foreground">No franchise violations have been reported.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedViolation && !!actionType} onOpenChange={() => { setSelectedViolation(null); setActionType(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'view' && 'Violation Details'}
              {actionType === 'warn' && 'Issue Warning'}
              {actionType === 'suspend' && 'Suspend Franchise'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'view' && 'Review the violation details'}
              {actionType === 'warn' && 'Issue a formal warning for this violation'}
              {actionType === 'suspend' && 'This action requires approval and will suspend the franchise'}
            </DialogDescription>
          </DialogHeader>

          {selectedViolation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Franchise</p>
                  <p className="font-medium">{selectedViolation.franchises?.legal_name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <Badge className={getTypeBadge(selectedViolation.violation_type).className}>
                    {getTypeBadge(selectedViolation.violation_type).label}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Severity</p>
                  <Badge className={getSeverityBadge(selectedViolation.severity).className}>
                    {selectedViolation.severity}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge className={getStatusBadge(selectedViolation.status).className}>
                    {getStatusBadge(selectedViolation.status).label}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Title</p>
                <p className="font-medium">{selectedViolation.title}</p>
              </div>

              {selectedViolation.description && (
                <div>
                  <p className="text-muted-foreground text-sm">Description</p>
                  <p>{selectedViolation.description}</p>
                </div>
              )}

              {actionType === 'suspend' && (
                <div>
                  <Label htmlFor="notes">Resolution Notes (Required)</Label>
                  <Textarea
                    id="notes"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Explain the reason for suspension..."
                    required
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedViolation(null); setActionType(null); }}>
              Close
            </Button>
            {actionType === 'warn' && (
              <Button 
                onClick={handleSubmit}
                disabled={updateViolation.isPending}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Issue Warning
              </Button>
            )}
            {actionType === 'suspend' && (
              <Button 
                variant="destructive"
                onClick={handleSubmit}
                disabled={updateViolation.isPending || !resolutionNotes}
              >
                Suspend Franchise
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
