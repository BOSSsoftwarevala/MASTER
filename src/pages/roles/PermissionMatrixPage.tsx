import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRoles, usePermissions, useRolePermissions } from '@/hooks/useRolePermissions';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Shield, Check, X, Eye, Send } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function PermissionMatrixPage() {
  const { isSuperAdmin } = useUserRoles();
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const { data: permissions, isLoading: permissionsLoading } = usePermissions();
  const { data: rolePermissions, isLoading: matrixLoading } = useRolePermissions();

  const isLoading = rolesLoading || permissionsLoading || matrixLoading;

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

  const getAccessIcon = (level: string) => {
    switch (level) {
      case 'execute':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'view':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'request':
        return <Send className="h-4 w-4 text-yellow-500" />;
      default:
        return <X className="h-4 w-4 text-muted-foreground/30" />;
    }
  };

  const getAccessLevel = (roleId: string, permissionId: string) => {
    const rp = rolePermissions?.find(
      (rp: any) => rp.role_id === roleId && rp.permission_id === permissionId
    );
    return rp?.access_level || 'none';
  };

  // Group permissions by module
  const permissionsByModule = permissions?.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permission Matrix</h1>
          <p className="text-muted-foreground">Role-based access control overview</p>
        </div>

        {/* Legend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Access Level Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-green-500/10 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Execute</p>
                  <p className="text-xs text-muted-foreground">Full access</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-blue-500/10 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">View</p>
                  <p className="text-xs text-muted-foreground">Read-only</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-yellow-500/10 flex items-center justify-center">
                  <Send className="h-4 w-4 text-yellow-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Request</p>
                  <p className="text-xs text-muted-foreground">Needs approval</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                  <X className="h-4 w-4 text-muted-foreground/30" />
                </div>
                <div>
                  <p className="font-medium text-sm">None</p>
                  <p className="text-xs text-muted-foreground">No access</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permission Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Role-Permission Matrix</CardTitle>
            <CardDescription>Access levels for each role across all features</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="min-w-[1200px]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="sticky left-0 bg-background z-10 p-3 text-left border-b font-medium text-sm">
                          Feature / Role
                        </th>
                        {roles?.slice(0, 6).map((role) => (
                          <th key={role.id} className="p-3 text-center border-b min-w-[100px]">
                            <div className="text-xs font-medium">{role.name}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {permissionsByModule && Object.entries(permissionsByModule).map(([module, perms]) => (
                        <>
                          <tr key={`module-${module}`}>
                            <td 
                              colSpan={(roles?.length || 0) + 1}
                              className="p-2 bg-muted/50 font-semibold text-sm border-b"
                            >
                              {module}
                            </td>
                          </tr>
                          {perms?.map((permission) => (
                            <tr key={permission.id} className="hover:bg-muted/30 transition-colors">
                              <td className="sticky left-0 bg-background z-10 p-3 border-b">
                                <div>
                                  <p className="text-sm font-medium">{permission.feature_name}</p>
                                  {permission.is_sensitive && (
                                    <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20 mt-1">
                                      Sensitive
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              {roles?.slice(0, 6).map((role) => {
                                const level = getAccessLevel(role.id, permission.id);
                                return (
                                  <td key={role.id} className="p-3 text-center border-b">
                                    <div className="flex justify-center">
                                      <div 
                                        className={`h-8 w-8 rounded flex items-center justify-center ${
                                          level === 'execute' ? 'bg-green-500/10' :
                                          level === 'view' ? 'bg-blue-500/10' :
                                          level === 'request' ? 'bg-yellow-500/10' :
                                          'bg-muted'
                                        }`}
                                      >
                                        {getAccessIcon(level)}
                                      </div>
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
