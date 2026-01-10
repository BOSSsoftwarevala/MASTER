import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useResellerPerformance, useResellers } from "@/hooks/useResellerManagerData";
import { BarChart3, TrendingUp, Users, Target, ArrowLeft, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ResellerPerformancePage() {
  const navigate = useNavigate();
  const { performance, loading: performanceLoading } = useResellerPerformance();
  const { resellers } = useResellers();

  // Calculate aggregated stats
  const totalLeads = performance.reduce((sum, p) => sum + (p.leads_received || 0), 0);
  const totalConverted = performance.reduce((sum, p) => sum + (p.leads_converted || 0), 0);
  const totalRevenue = performance.reduce((sum, p) => sum + Number(p.revenue_generated || 0), 0);
  const avgConversion = performance.length > 0
    ? performance.reduce((sum, p) => sum + Number(p.conversion_rate || 0), 0) / performance.length
    : 0;

  // Get top performers
  const topPerformers = [...performance]
    .sort((a, b) => (b.performance_score || 0) - (a.performance_score || 0))
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/reseller')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
            <p className="text-muted-foreground">Track reseller performance and metrics</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLeads.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all periods</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConverted.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {totalLeads > 0 ? `${((totalConverted / totalLeads) * 100).toFixed(1)}% rate` : 'No data'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgConversion.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Average across resellers</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {performanceLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : topPerformers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No performance data available yet
              </div>
            ) : (
              <div className="space-y-3">
                {topPerformers.map((perf, index) => {
                  const reseller = resellers.find(r => r.id === perf.reseller_id);
                  return (
                    <div
                      key={perf.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-600' :
                          index === 1 ? 'bg-gray-100 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-600' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-medium">
                            {reseller?.business_name || reseller?.legal_name || 'Unknown'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Score: {perf.performance_score || 0}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{Number(perf.revenue_generated || 0).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {perf.conversion_rate || 0}% conversion
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Performance Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {performanceLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : performance.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No performance records found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reseller</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Converted</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performance.map((perf) => {
                    const reseller = resellers.find(r => r.id === perf.reseller_id);
                    return (
                      <TableRow key={perf.id}>
                        <TableCell className="font-medium">
                          {reseller?.business_name || reseller?.legal_name || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {new Date(perf.period_start).toLocaleDateString()} - {new Date(perf.period_end).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{perf.leads_received || 0}</TableCell>
                        <TableCell>{perf.leads_converted || 0}</TableCell>
                        <TableCell>
                          <Badge variant={
                            Number(perf.conversion_rate) >= 20 ? 'default' :
                            Number(perf.conversion_rate) >= 10 ? 'secondary' : 'outline'
                          }>
                            {perf.conversion_rate || 0}%
                          </Badge>
                        </TableCell>
                        <TableCell>₹{Number(perf.revenue_generated || 0).toLocaleString()}</TableCell>
                        <TableCell>₹{Number(perf.commission_earned || 0).toLocaleString()}</TableCell>
                        <TableCell>
                          {perf.ranking ? (
                            <Badge variant="outline">#{perf.ranking}</Badge>
                          ) : '-'}
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
