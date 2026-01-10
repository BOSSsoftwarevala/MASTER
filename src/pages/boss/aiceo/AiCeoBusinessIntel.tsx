import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useBusinessMetrics } from '@/hooks/useAiCeoData';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Building2,
  Briefcase,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function AiCeoBusinessIntel() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { data: metrics, isLoading: metricsLoading } = useBusinessMetrics();

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isSuperAdmin) {
    return (
      <DashboardLayout>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>This page is restricted to Super Admins only.</CardDescription>
          </CardHeader>
        </Card>
      </DashboardLayout>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            Business Intelligence
          </h1>
          <p className="text-muted-foreground">Revenue, costs, and performance analytics</p>
        </div>

        {/* Main Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/30">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Revenue (30d)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-green-500">
                    {formatCurrency(metrics?.totalRevenue || 0)}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>+{metrics?.revenueGrowth}% vs last month</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/5 border-red-500/30">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Monthly Burn
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-red-500">
                    {formatCurrency(metrics?.monthlyBurn || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Operating costs this month
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Lead Conversion
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <>
                  <div className="text-3xl font-bold text-blue-500">
                    {metrics?.leadConversionRate}%
                  </div>
                  <Progress value={metrics?.leadConversionRate} className="mt-2 h-2" />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Growth Rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <>
                  <div className={`text-3xl font-bold ${(metrics?.revenueGrowth || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(metrics?.revenueGrowth || 0) >= 0 ? '+' : ''}{metrics?.revenueGrowth}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Month over month</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Trends
            </CardTitle>
            <CardDescription>Monthly revenue breakdown and projections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground">New Subscriptions</div>
                <div className="text-2xl font-bold text-green-500">$45,200</div>
                <Badge variant="outline" className="mt-1 text-green-500">+12%</Badge>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground">Renewals</div>
                <div className="text-2xl font-bold text-blue-500">$78,400</div>
                <Badge variant="outline" className="mt-1 text-blue-500">+8%</Badge>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground">Upgrades</div>
                <div className="text-2xl font-bold text-violet-500">$12,800</div>
                <Badge variant="outline" className="mt-1 text-violet-500">+23%</Badge>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground">Churn Loss</div>
                <div className="text-2xl font-bold text-red-500">-$8,200</div>
                <Badge variant="outline" className="mt-1 text-red-500">-3%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Leakage Detection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-amber-500" />
              Cost Leakage Detection
            </CardTitle>
            <CardDescription>AI-detected areas of unnecessary spend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div>
                <p className="font-medium">Unused server resources</p>
                <p className="text-sm text-muted-foreground">2 servers running below 10% capacity</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-amber-500">$1,200/mo</div>
                <Badge variant="outline">Potential savings</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div>
                <p className="font-medium">Duplicate API calls</p>
                <p className="text-sm text-muted-foreground">SEO API being called twice per page</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-amber-500">$340/mo</div>
                <Badge variant="outline">Potential savings</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">No significant leakage detected</p>
                <p className="text-sm text-muted-foreground">Other cost centers within normal range</p>
              </div>
              <Badge className="bg-green-500">Optimized</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Partner Performance */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Franchise Performance
              </CardTitle>
              <CardDescription>Revenue contribution and growth</CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-24" />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Score</span>
                    <span className="font-bold text-lg">{metrics?.franchisePerformance}%</span>
                  </div>
                  <Progress value={metrics?.franchisePerformance} className="h-3" />
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">12</div>
                      <div className="text-xs text-muted-foreground">Top Performers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-amber-500">8</div>
                      <div className="text-xs text-muted-foreground">Average</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-500">3</div>
                      <div className="text-xs text-muted-foreground">Need Attention</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Reseller Performance
              </CardTitle>
              <CardDescription>Sales contribution and activity</CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-24" />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Score</span>
                    <span className="font-bold text-lg">{metrics?.resellerPerformance}%</span>
                  </div>
                  <Progress value={metrics?.resellerPerformance} className="h-3" />
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">28</div>
                      <div className="text-xs text-muted-foreground">Active</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-amber-500">15</div>
                      <div className="text-xs text-muted-foreground">Low Activity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-500">7</div>
                      <div className="text-xs text-muted-foreground">Inactive</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lead Quality */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Lead Quality Drift
            </CardTitle>
            <CardDescription>Monitoring changes in lead quality over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 rounded-lg border text-center">
                <div className="text-sm text-muted-foreground mb-1">Hot Leads</div>
                <div className="text-2xl font-bold text-green-500">124</div>
                <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                  <ArrowUpRight className="h-3 w-3" /> +15%
                </div>
              </div>
              <div className="p-4 rounded-lg border text-center">
                <div className="text-sm text-muted-foreground mb-1">Warm Leads</div>
                <div className="text-2xl font-bold text-amber-500">287</div>
                <div className="text-xs text-amber-600 flex items-center justify-center gap-1">
                  <ArrowUpRight className="h-3 w-3" /> +8%
                </div>
              </div>
              <div className="p-4 rounded-lg border text-center">
                <div className="text-sm text-muted-foreground mb-1">Cold Leads</div>
                <div className="text-2xl font-bold text-blue-500">456</div>
                <div className="text-xs text-red-600 flex items-center justify-center gap-1">
                  <ArrowDownRight className="h-3 w-3" /> -3%
                </div>
              </div>
              <div className="p-4 rounded-lg border text-center">
                <div className="text-sm text-muted-foreground mb-1">Quality Score</div>
                <div className="text-2xl font-bold text-violet-500">78%</div>
                <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                  <ArrowUpRight className="h-3 w-3" /> +2%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
