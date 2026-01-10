import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoles } from '@/hooks/useRolePermissions';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Shield, Lock, Unlock, Building2, Wrench, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function RoleRegistryPage() {
  const { isSuperAdmin } = useUserRoles();
  const { data: roles, isLoading } = useRoles();

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

  const getRoleTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Wrench className="h-4 w-4" />;
      case 'business': return <Building2 className="h-4 w-4" />;
      case 'support': return <Users className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getRoleTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      system: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      business: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      support: 'bg-green-500/10 text-green-500 border-green-500/20',
    };
    return (
      <Badge variant="outline" className={colors[type] || ''}>
        {getRoleTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/10 text-green-500 border-green-500/20',
      locked: 'bg-red-500/10 text-red-500 border-red-500/20',
      deprecated: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    };
    const icons: Record<string, React.ReactNode> = {
      active: <Unlock className="h-3 w-3" />,
      locked: <Lock className="h-3 w-3" />,
      deprecated: <Lock className="h-3 w-3" />,
    };
    return (
      <Badge variant="outline" className={colors[status] || ''}>
        {icons[status]}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  const systemRoles = roles?.filter(r => r.is_system_role) || [];
  const businessRoles = roles?.filter(r => !r.is_system_role) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Registry</h1>
          <p className="text-muted-foreground">View all defined roles in the system</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{roles?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{systemRoles.length}</p>
                  <p className="text-sm text-muted-foreground">System Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{businessRoles.length}</p>
                  <p className="text-sm text-muted-foreground">Business Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Unlock className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{roles?.filter(r => r.status === 'active').length || 0}</p>
                  <p className="text-sm text-muted-foreground">Active Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Roles Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Roles</CardTitle>
            <CardDescription>Complete registry of system and business roles</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Role Key</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>System Role</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles?.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{role.name}</p>
                          {role.description && (
                            <p className="text-xs text-muted-foreground">{role.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{role.role_key}</code>
                      </TableCell>
                      <TableCell>{getRoleTypeBadge(role.role_type)}</TableCell>
                      <TableCell>{getStatusBadge(role.status)}</TableCell>
                      <TableCell>
                        {role.is_system_role ? (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                            System
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">No</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(role.created_at), 'MMM d, yyyy')}
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
