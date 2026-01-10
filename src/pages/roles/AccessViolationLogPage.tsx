import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccessViolations } from '@/hooks/useRolePermissions';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Shield, AlertOctagon, AlertTriangle, Info, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function AccessViolationLogPage() {
  const { isSuperAdmin } = useUserRoles();
  const { data: violations, isLoading } = useAccessViolations();

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

  const getSeverityBadge = (severity: string) => {
    const config: Record<string, { color: string; icon: React.ReactNode }> = {
      low: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: <Info className="h-3 w-3" /> },
      medium: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: <AlertTriangle className="h-3 w-3" /> },
      high: { color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: <AlertOctagon className="h-3 w-3" /> },
      critical: { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: <XCircle className="h-3 w-3" /> },
    };
    const { color, icon } = config[severity] || config.medium;
    return (
      <Badge variant="outline" className={color}>
        {icon}
        <span className="ml-1 capitalize">{severity}</span>
      </Badge>
    );
  };

  const criticalCount = violations?.filter(v => v.severity === 'critical').length || 0;
  const highCount = violations?.filter(v => v.severity === 'high').length || 0;
  const mediumCount = violations?.filter(v => v.severity === 'medium').length || 0;
  const lowCount = violations?.filter(v => v.severity === 'low').length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Access Violation Log</h1>
          <p className="text-muted-foreground">Unauthorized access attempts and blocked actions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-red-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">{criticalCount}</p>
                  <p className="text-sm text-muted-foreground">Critical</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <AlertOctagon className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-500">{highCount}</p>
                  <p className="text-sm text-muted-foreground">High</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-500">{mediumCount}</p>
                  <p className="text-sm text-muted-foreground">Medium</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Info className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-500">{lowCount}</p>
                  <p className="text-sm text-muted-foreground">Low</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Violations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Violations</CardTitle>
            <CardDescription>Read-only log of unauthorized access attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : violations?.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 mx-auto text-green-500/30 mb-4" />
                <p className="text-muted-foreground">No access violations recorded</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Blocked Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {violations?.map((violation) => (
                    <TableRow key={violation.id}>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {format(new Date(violation.created_at), 'MMM d, HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{violation.user_email || 'Unknown'}</p>
                          {violation.ip_address && (
                            <p className="text-xs text-muted-foreground font-mono">{String(violation.ip_address)}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {violation.attempted_action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs max-w-[200px] truncate">
                        {violation.attempted_resource}
                      </TableCell>
                      <TableCell>{getSeverityBadge(violation.severity)}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">
                        {violation.blocked_reason}
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
