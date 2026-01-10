import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Shield, Building, Target, DollarSign, Star } from 'lucide-react';
import { useFranchisePerformance } from '@/hooks/useFranchiseData';
import { useUserRoles } from '@/hooks/useUserRoles';
import { format } from 'date-fns';

export default function FranchisePerformancePage() {
  const { data: performance, isLoading } = useFranchisePerformance();
  const { isAdmin } = useUserRoles();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSLABadge = (score: number) => {
    if (score >= 90) {
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{score}%</Badge>;
    } else if (score >= 70) {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{score}%</Badge>;
    }
    return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{score}%</Badge>;
  };

  const getRankBadge = (rank: number | null) => {
    if (!rank) return <span className="text-muted-foreground">-</span>;
    if (rank <= 3) {
      return (
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1">
          <Star className="h-3 w-3 fill-current" />
          #{rank}
        </Badge>
      );
    }
    return <Badge variant="outline">#{rank}</Badge>;
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

  // Calculate summary stats
  const totalRevenue = performance?.reduce((sum, p) => sum + Number(p.revenue_generated || 0), 0) || 0;
  const totalLeads = performance?.reduce((sum, p) => sum + (p.leads_received || 0), 0) || 0;
  const avgConversion = performance?.length 
    ? performance.reduce((sum, p) => sum + Number(p.conversion_rate || 0), 0) / performance.length 
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Franchise Performance</h1>
            <p className="text-muted-foreground">Monitor franchise metrics and rankings</p>
          </div>
          <Badge variant="outline" className="gap-1">
            <TrendingUp className="h-3 w-3" />
            {performance?.length || 0} Records
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold">{totalLeads.toLocaleString()}</p>
                </div>
                <Target className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Conversion</p>
                  <p className="text-2xl font-bold">{avgConversion.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-violet-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : performance && performance.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Franchise</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Leads</TableHead>
                    <TableHead className="text-right">Conversions</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead className="text-center">SLA Score</TableHead>
                    <TableHead className="text-center">Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {record.franchises ? (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{record.franchises.legal_name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(record.period_start), 'MMM dd')} - {format(new Date(record.period_end), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">{record.leads_received || 0}</TableCell>
                      <TableCell className="text-right">
                        {record.leads_converted || 0}
                        <span className="text-muted-foreground text-xs ml-1">
                          ({Number(record.conversion_rate || 0).toFixed(1)}%)
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(Number(record.revenue_generated || 0))}
                      </TableCell>
                      <TableCell className="text-right text-emerald-400">
                        {formatCurrency(Number(record.commission_earned || 0))}
                      </TableCell>
                      <TableCell className="text-center">
                        {getSLABadge(Number(record.sla_score || 0))}
                      </TableCell>
                      <TableCell className="text-center">
                        {getRankBadge(record.ranking)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Performance Data</h3>
                <p className="text-muted-foreground">No performance records have been recorded yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
