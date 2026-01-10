import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Shield, Globe, Building, AlertTriangle } from 'lucide-react';
import { useFranchiseTerritories, useFranchiseRealtime } from '@/hooks/useFranchiseData';
import { useUserRoles } from '@/hooks/useUserRoles';
import { format } from 'date-fns';

export default function TerritoryAssignmentPage() {
  const { data: territories, isLoading } = useFranchiseTerritories();
  const { isSuperAdmin } = useUserRoles();

  useFranchiseRealtime();

  const getTypeBadge = (type: string) => {
    if (type === 'exclusive') {
      return <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">Exclusive</Badge>;
    }
    return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Shared</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>;
    }
    return <Badge className="bg-muted text-muted-foreground">Inactive</Badge>;
  };

  // Check for territory conflicts (same location with exclusive + shared)
  const findConflicts = () => {
    if (!territories) return new Set<string>();
    const conflicts = new Set<string>();
    const locationMap = new Map<string, typeof territories>();
    
    territories.forEach(t => {
      const key = `${t.country}-${t.state || ''}-${t.city || ''}`;
      if (!locationMap.has(key)) {
        locationMap.set(key, []);
      }
      locationMap.get(key)!.push(t);
    });
    
    locationMap.forEach((group) => {
      if (group.length > 1 && group.some(t => t.territory_type === 'exclusive')) {
        group.forEach(t => conflicts.add(t.id));
      }
    });
    
    return conflicts;
  };

  const conflicts = findConflicts();

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
            <h1 className="text-3xl font-bold tracking-tight">Territory Assignment</h1>
            <p className="text-muted-foreground">Manage franchise territory allocations</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <MapPin className="h-3 w-3" />
              {territories?.length || 0} Territories
            </Badge>
            {conflicts.size > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                {conflicts.size} Conflicts
              </Badge>
            )}
          </div>
        </div>

        {conflicts.size > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium">Territory conflicts detected! Exclusive territories overlap with other assignments.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Territory Allocations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : territories && territories.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Territory</TableHead>
                    <TableHead>Franchise</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Conflict</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {territories.map((territory) => (
                    <TableRow key={territory.id} className={conflicts.has(territory.id) ? 'bg-destructive/10' : ''}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{territory.country}</p>
                            <p className="text-sm text-muted-foreground">
                              {[territory.state, territory.city].filter(Boolean).join(', ') || 'Country-wide'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {territory.franchises ? (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{territory.franchises.legal_name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getTypeBadge(territory.territory_type)}</TableCell>
                      <TableCell>{getStatusBadge(territory.is_active ?? false)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(territory.assigned_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {territory.expires_at 
                          ? format(new Date(territory.expires_at), 'MMM dd, yyyy')
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        {conflicts.has(territory.id) ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Conflict
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Territories Assigned</h3>
                <p className="text-muted-foreground">No territory assignments have been made yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
