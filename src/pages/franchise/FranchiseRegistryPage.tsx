import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Shield, MapPin, Calendar } from 'lucide-react';
import { useFranchises } from '@/hooks/useFranchiseData';
import { useUserRoles } from '@/hooks/useUserRoles';
import { format } from 'date-fns';

export default function FranchiseRegistryPage() {
  const { data: franchises, isLoading } = useFranchises();
  const { isAdmin } = useUserRoles();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
      pending: { variant: 'secondary', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      active: { variant: 'default', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
      suspended: { variant: 'destructive', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
      terminated: { variant: 'outline', className: 'bg-muted text-muted-foreground' },
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

  if (!isAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <Shield className="h-12 w-12 mx-auto text-destructive mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">You don't have permission to view this page.</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Franchise Registry</h1>
            <p className="text-muted-foreground">View all registered franchises and their status</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Building2 className="h-3 w-3" />
              {franchises?.length || 0} Franchises
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              All Franchises
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : franchises && franchises.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Franchise ID</TableHead>
                    <TableHead>Legal Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Plan Tier</TableHead>
                    <TableHead>Territory Level</TableHead>
                    <TableHead>Joined Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {franchises.map((franchise) => (
                    <TableRow key={franchise.id}>
                      <TableCell className="font-mono text-xs">
                        {franchise.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{franchise.legal_name}</p>
                          {franchise.business_name && (
                            <p className="text-sm text-muted-foreground">{franchise.business_name}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusBadge(franchise.status).variant}
                          className={getStatusBadge(franchise.status).className}
                        >
                          {franchise.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {franchise.franchise_plans ? (
                          <Badge className={getPlanBadge(franchise.franchise_plans.tier)}>
                            {franchise.franchise_plans.tier}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="capitalize">{franchise.territory_level}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {franchise.joined_at 
                            ? format(new Date(franchise.joined_at), 'MMM dd, yyyy')
                            : 'Pending'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Franchises Found</h3>
                <p className="text-muted-foreground">No franchises have been registered yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
