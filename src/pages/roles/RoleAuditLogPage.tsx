import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoleAuditLogs } from '@/hooks/useRolePermissions';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Shield, ScrollText, UserPlus, UserMinus, Clock, TrendingUp, Key } from 'lucide-react';
import { format } from 'date-fns';

export default function RoleAuditLogPage() {
  const { isSuperAdmin } = useUserRoles();
  const { data: auditLogs, isLoading } = useRoleAuditLogs();

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

  const getActionIcon = (action: string) => {
    if (action.includes('assigned')) return <UserPlus className="h-4 w-4 text-green-500" />;
    if (action.includes('removed')) return <UserMinus className="h-4 w-4 text-red-500" />;
    if (action.includes('temp')) return <Clock className="h-4 w-4 text-yellow-500" />;
    if (action.includes('escalation')) return <TrendingUp className="h-4 w-4 text-orange-500" />;
    return <Key className="h-4 w-4 text-blue-500" />;
  };

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      role_assigned: 'bg-green-500/10 text-green-500 border-green-500/20',
      role_removed: 'bg-red-500/10 text-red-500 border-red-500/20',
      temp_access_granted: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      temp_access_revoked: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      escalation_approved: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      escalation_rejected: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    };
    return (
      <Badge variant="outline" className={colors[action] || ''}>
        {getActionIcon(action)}
        <span className="ml-1">{action.replace(/_/g, ' ')}</span>
      </Badge>
    );
  };

  const assignedCount = auditLogs?.filter(l => l.action === 'role_assigned').length || 0;
  const removedCount = auditLogs?.filter(l => l.action === 'role_removed').length || 0;
  const tempAccessCount = auditLogs?.filter(l => l.action.includes('temp')).length || 0;
  const escalationCount = auditLogs?.filter(l => l.action.includes('escalation')).length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Activity Audit</h1>
          <p className="text-muted-foreground">Complete audit trail of all role-related changes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{assignedCount}</p>
                  <p className="text-sm text-muted-foreground">Roles Assigned</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <UserMinus className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{removedCount}</p>
                  <p className="text-sm text-muted-foreground">Roles Removed</p>
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
                  <p className="text-2xl font-bold">{tempAccessCount}</p>
                  <p className="text-sm text-muted-foreground">Temp Access</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{escalationCount}</p>
                  <p className="text-sm text-muted-foreground">Escalations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Log Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              Audit Trail
            </CardTitle>
            <CardDescription>Read-only log of all role changes</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : auditLogs?.length === 0 ? (
              <div className="text-center py-12">
                <ScrollText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No audit records found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Approved By</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs?.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {format(new Date(log.created_at), 'MMM d, HH:mm')}
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell className="text-sm">{log.target_user_email || '-'}</TableCell>
                      <TableCell>
                        {log.role_affected ? (
                          <Badge variant="outline">{log.role_affected}</Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-sm">{log.requested_by_name || '-'}</TableCell>
                      <TableCell className="text-sm">{log.approved_by_name || '-'}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                        {log.details || '-'}
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
