import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useResellerDashboardStats, useResellers, useResellerRealtime } from "@/hooks/useResellerManagerData";
import { Users, UserPlus, TrendingUp, Wallet, AlertTriangle, Target, BarChart3, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResellerManagerDashboard() {
  const navigate = useNavigate();
  const { stats, loading: statsLoading } = useResellerDashboardStats();
  const { resellers, loading: resellersLoading, fetchResellers } = useResellers();

  useResellerRealtime(() => {
    fetchResellers();
  });

  const recentResellers = resellers.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reseller Manager</h1>
            <p className="text-muted-foreground">Manage resellers, leads, wallets, and performance</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/dashboard/reseller/add')}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Reseller
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resellers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalResellers}</div>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="default">{stats.activeResellers} Active</Badge>
                    <Badge variant="secondary">{stats.pausedResellers} Paused</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.pendingResellers}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.avgConversionRate}%</div>
                  <p className="text-xs text-muted-foreground">Across all resellers</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">₹{stats.totalWalletBalance.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Aggregate balance</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Violations Alert */}
        {stats.openViolations > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="font-medium">Open Violations</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.openViolations} violation(s) require attention
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate('/dashboard/reseller/violations')}>
                View Violations
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/dashboard/reseller/list')}>
            <CardContent className="flex items-center gap-4 py-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">View Resellers</p>
                <p className="text-sm text-muted-foreground">Manage all resellers</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/dashboard/reseller/scopes')}>
            <CardContent className="flex items-center gap-4 py-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Lead Scopes</p>
                <p className="text-sm text-muted-foreground">Assign geo & lead scope</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/dashboard/reseller/wallets')}>
            <CardContent className="flex items-center gap-4 py-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Wallets</p>
                <p className="text-sm text-muted-foreground">Credits & debits</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/dashboard/reseller/performance')}>
            <CardContent className="flex items-center gap-4 py-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Performance</p>
                <p className="text-sm text-muted-foreground">Analytics & reports</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Resellers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Resellers</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/reseller/list')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {resellersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentResellers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No resellers found. Add your first reseller to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {recentResellers.map((reseller) => (
                  <div
                    key={reseller.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(`/dashboard/reseller/edit/${reseller.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{reseller.business_name || reseller.legal_name}</p>
                        <p className="text-sm text-muted-foreground">{reseller.contact_email}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        reseller.status === 'active' ? 'default' :
                        reseller.status === 'paused' ? 'secondary' :
                        reseller.status === 'pending' ? 'outline' : 'destructive'
                      }
                    >
                      {reseller.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
