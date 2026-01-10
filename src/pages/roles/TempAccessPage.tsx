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
import { useTempAccessGrants, useRoles, useRevokeTempAccess, useRolePermissionsRealtime } from '@/hooks/useRolePermissions';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Shield, Clock, UserPlus, XCircle, CheckCircle } from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function TempAccessPage() {
  const { isSuperAdmin } = useUserRoles();
  const { user } = useAuth();
  const { data: tempGrants, isLoading, refetch } = useTempAccessGrants();
  const { data: roles } = useRoles();
  const revokeMutation = useRevokeTempAccess();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    roleKey: '',
    reason: '',
    duration: '24',
  });

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

  const handleGrantAccess = async () => {
    if (!formData.userId || !formData.roleKey || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + parseInt(formData.duration));

      const { error } = await supabase.from('temp_access_grants').insert({
        user_id: formData.userId,
        role_key: formData.roleKey as any,
        reason: formData.reason,
        granted_by: user?.id || '00000000-0000-0000-0000-000000000000',
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      });

      if (error) throw error;

      toast.success('Temporary access granted');
      setDialogOpen(false);
      setFormData({ userId: '', roleKey: '', reason: '', duration: '24' });
      refetch();
    } catch (error) {
      toast.error('Failed to grant access');
    } finally {
      setSubmitting(false);
    }
  };

  const activeGrants = tempGrants?.filter(g => g.is_active && !isPast(new Date(g.expires_at))) || [];
  const expiredGrants = tempGrants?.filter(g => !g.is_active || isPast(new Date(g.expires_at))) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Temporary Access</h1>
            <p className="text-muted-foreground">Grant and manage time-limited role access</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Grant Temporary Access
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Grant Temporary Access</DialogTitle>
                <DialogDescription>
                  Grant time-limited role access. Access will auto-expire.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>User ID *</Label>
                  <Input
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    placeholder="Enter user UUID"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role to Grant *</Label>
                  <Select
                    value={formData.roleKey}
                    onValueChange={(v) => setFormData({ ...formData, roleKey: v })}
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
                  <Label>Duration</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(v) => setFormData({ ...formData, duration: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="48">48 hours</SelectItem>
                      <SelectItem value="72">72 hours</SelectItem>
                      <SelectItem value="168">1 week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reason *</Label>
                  <Textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Explain why temporary access is needed..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleGrantAccess} disabled={submitting}>
                  {submitting ? 'Granting...' : 'Grant Access'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeGrants.length}</p>
                  <p className="text-sm text-muted-foreground">Active Grants</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {activeGrants.filter(g => {
                      const hours = (new Date(g.expires_at).getTime() - Date.now()) / (1000 * 60 * 60);
                      return hours <= 4;
                    }).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Expiring Soon (&lt;4h)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{expiredGrants.length}</p>
                  <p className="text-sm text-muted-foreground">Expired/Revoked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Grants */}
        <Card>
          <CardHeader>
            <CardTitle>Active Temporary Access</CardTitle>
            <CardDescription>Currently active time-limited access grants</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : activeGrants.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No active temporary access grants</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Role Granted</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Time Remaining</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeGrants.map((grant) => {
                    const hoursRemaining = (new Date(grant.expires_at).getTime() - Date.now()) / (1000 * 60 * 60);
                    const isExpiringSoon = hoursRemaining <= 4;
                    
                    return (
                      <TableRow key={grant.id}>
                        <TableCell className="font-mono text-xs">{grant.user_id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          <Badge variant="outline">{grant.role_key}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{grant.reason}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(grant.expires_at), 'MMM d, HH:mm')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            isExpiringSoon 
                              ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                              : 'bg-green-500/10 text-green-500 border-green-500/20'
                          }>
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(grant.expires_at))}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => revokeMutation.mutate(grant.id)}
                          >
                            Revoke
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
