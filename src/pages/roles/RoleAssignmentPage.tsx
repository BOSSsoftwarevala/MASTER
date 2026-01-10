import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoles, useAccessRequests } from '@/hooks/useRolePermissions';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Shield, UserPlus, Globe, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function RoleAssignmentPage() {
  const { isSuperAdmin } = useUserRoles();
  const { user } = useAuth();
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const { data: accessRequests, isLoading: requestsLoading, refetch } = useAccessRequests();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    requestedRole: '',
    scope: 'global',
    reason: '',
  });

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

  const handleSubmitRequest = async () => {
    if (!formData.userName || !formData.requestedRole || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('access_requests').insert({
        requester_id: user?.id || '00000000-0000-0000-0000-000000000000',
        requester_name: formData.userName,
        request_type: 'role_assignment',
        requested_role: formData.requestedRole as any,
        scope: formData.scope,
        reason: formData.reason,
        risk_level: 'medium',
        impact_summary: `Requesting ${formData.requestedRole} role with ${formData.scope} scope`,
      });

      if (error) throw error;

      toast.success('Role assignment request submitted');
      setDialogOpen(false);
      setFormData({ userId: '', userName: '', requestedRole: '', scope: 'global', reason: '' });
      refetch();
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const roleAssignmentRequests = accessRequests?.filter(r => r.request_type === 'role_assignment') || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Role Assignment</h1>
            <p className="text-muted-foreground">Request and manage role assignments</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Request Role Assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Role Assignment</DialogTitle>
                <DialogDescription>
                  All role assignments require approval from Super Admin
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>User Name *</Label>
                  <Input
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    placeholder="Enter user name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Requested Role *</Label>
                  <Select
                    value={formData.requestedRole}
                    onValueChange={(v) => setFormData({ ...formData, requestedRole: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles?.map((role) => (
                        <SelectItem key={role.id} value={role.role_key}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Scope</Label>
                  <Select
                    value={formData.scope}
                    onValueChange={(v) => setFormData({ ...formData, scope: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reason *</Label>
                  <Textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Explain why this role is needed..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmitRequest} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Card */}
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-600 dark:text-amber-400">Approval Required</h3>
                <p className="text-sm text-muted-foreground">
                  All role assignments require Super Admin approval. Users cannot be assigned roles directly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Role Assignment Requests</CardTitle>
            <CardDescription>Pending and recent role assignment requests</CardDescription>
          </CardHeader>
          <CardContent>
            {requestsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : roleAssignmentRequests.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No role assignment requests</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Requested Role</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roleAssignmentRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.requester_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.requested_role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          request.scope === 'global' 
                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                            : 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                        }>
                          {request.scope === 'global' ? (
                            <><Globe className="h-3 w-3 mr-1" />Global</>
                          ) : (
                            <><MapPin className="h-3 w-3 mr-1" />Limited</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          request.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                          request.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(request.created_at), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
