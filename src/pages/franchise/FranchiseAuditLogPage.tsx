import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollText, Shield, Building, User, Clock } from 'lucide-react';
import { useFranchiseAuditLogs } from '@/hooks/useFranchiseData';
import { useUserRoles } from '@/hooks/useUserRoles';
import { format } from 'date-fns';

export default function FranchiseAuditLogPage() {
  const { data: logs, isLoading } = useFranchiseAuditLogs();
  const { isSuperAdmin } = useUserRoles();

  const getActionTypeBadge = (actionType: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      application: { className: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Application' },
      territory: { className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Territory' },
      status: { className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Status' },
      violation: { className: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Violation' },
      wallet: { className: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Wallet' },
    };
    return variants[actionType] || { className: 'bg-muted text-muted-foreground', label: actionType };
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Franchise Audit Log</h1>
            <p className="text-muted-foreground">Complete history of all franchise-related actions</p>
          </div>
          <Badge variant="outline" className="gap-1">
            <ScrollText className="h-3 w-3" />
            {logs?.length || 0} Records
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              Audit Trail (Read-Only)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : logs && logs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Franchise</TableHead>
                    <TableHead>Action Type</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Approved By</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">
                            {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.franchises ? (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{log.franchises.legal_name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">System</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionTypeBadge(log.action_type).className}>
                          {getActionTypeBadge(log.action_type).label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{log.action}</span>
                      </TableCell>
                      <TableCell>
                        {log.performed_by_name ? (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{log.performed_by_name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {log.approved_by_name ? (
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-emerald-400" />
                            <span className="text-sm text-emerald-400">{log.approved_by_name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {log.details || '-'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <ScrollText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Audit Logs</h3>
                <p className="text-muted-foreground">No franchise audit records have been logged yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
