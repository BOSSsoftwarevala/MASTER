import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useFinancialSnapshot, usePendingPayouts } from '@/hooks/useBossData';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  CreditCard,
  Clock,
  ArrowRight,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinancialSnapshotPage() {
  const { data: financialData, isLoading: financialLoading } = useFinancialSnapshot();
  const { data: pendingPayoutsData, isLoading: payoutsLoading } = usePendingPayouts();

  const isLoading = financialLoading || payoutsLoading;

  const walletBalances = [
    { name: 'Master Wallet', balance: 8500000, currency: 'INR' },
    { name: 'Franchise Wallet', balance: 2300000, currency: 'INR' },
    { name: 'Reseller Wallet', balance: 1800000, currency: 'INR' },
    { name: 'Client Wallet', balance: 950000, currency: 'INR' },
  ];

  const burnRate = {
    monthly: 850000,
    daily: 28333,
  };

  const profitLoss = financialData ? {
    revenue: financialData.thisMonthRevenue,
    expenses: burnRate.monthly,
    netProfit: financialData.thisMonthRevenue - burnRate.monthly,
    margin: financialData.thisMonthRevenue > 0 
      ? Math.round(((financialData.thisMonthRevenue - burnRate.monthly) / financialData.thisMonthRevenue) * 100)
      : 0,
  } : null;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Financial Snapshot</h1>
          <p className="text-gray-400 mt-1">Read-only overview of all financial metrics</p>
          <Badge variant="outline" className="mt-2 border-gray-600 text-gray-400">
            <Eye className="h-3 w-3 mr-1" />
            View Only — Redirect to Finance module for actions
          </Badge>
        </div>

        {/* Revenue Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-gray-600">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <Skeleton className="h-4 w-24 bg-gray-700" />
                    <Skeleton className="h-4 w-4 bg-gray-700" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20 mb-2 bg-gray-700" />
                    <Skeleton className="h-3 w-32 bg-gray-700" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-emerald-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ₹{((financialData?.totalRevenue || 0) / 100000).toFixed(1)}L
                  </div>
                  <div className="flex items-center text-xs mt-1">
                    {financialData?.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-emerald-400 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                    )}
                    <span className={financialData?.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}>
                      {financialData?.trendPercentage.toFixed(1)}%
                    </span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">This Month</CardTitle>
                  <CreditCard className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ₹{((financialData?.thisMonthRevenue || 0) / 100000).toFixed(1)}L
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-red-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Monthly Burn</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ₹{(burnRate.monthly / 100000).toFixed(1)}L
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ~₹{(burnRate.daily / 1000).toFixed(0)}K per day
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Net Profit</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ₹{((profitLoss?.netProfit || 0) / 100000).toFixed(1)}L
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {profitLoss?.margin || 0}% margin
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Wallet Balances */}
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Wallet className="h-5 w-5 text-blue-400" />
                Wallet Balances
              </CardTitle>
              <CardDescription className="text-gray-400">Current balance across all wallets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {walletBalances.map((wallet) => (
                  <div key={wallet.name} className="flex items-center justify-between p-3 rounded-lg border border-[hsl(var(--boss-card-border))] bg-[hsl(var(--boss-panel-bg))]">
                    <span className="font-medium text-gray-300">{wallet.name}</span>
                    <span className="font-bold text-white">
                      ₹{(wallet.balance / 100000).toFixed(2)}L
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[hsl(var(--boss-card-border))]">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-400">Total Balance</span>
                    <span className="font-bold text-lg text-white">
                      ₹{(walletBalances.reduce((sum, w) => sum + w.balance, 0) / 100000).toFixed(2)}L
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Payouts */}
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-5 w-5 text-amber-400" />
                Pending Payouts
              </CardTitle>
              <CardDescription className="text-gray-400">Payouts waiting for processing</CardDescription>
            </CardHeader>
            <CardContent>
              {payoutsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-[hsl(var(--boss-card-border))]">
                      <Skeleton className="h-4 w-32 bg-gray-700" />
                      <Skeleton className="h-4 w-16 bg-gray-700" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[hsl(var(--boss-card-border))] bg-[hsl(var(--boss-panel-bg))]">
                    <div>
                      <span className="font-medium text-gray-300">Commission Payouts</span>
                      <p className="text-xs text-gray-500">{pendingPayoutsData?.count || 0} pending</p>
                    </div>
                    <span className="font-bold text-white">
                      ₹{((pendingPayoutsData?.totalAmount || 0) / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[hsl(var(--boss-card-border))]">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-400">Total Pending</span>
                      <span className="font-bold text-lg text-amber-400">
                        ₹{((pendingPayoutsData?.totalAmount || 0) / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profit vs Burn */}
        {profitLoss && (
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
            <CardHeader>
              <CardTitle className="text-white">Profit vs Burn (This Month)</CardTitle>
              <CardDescription className="text-gray-400">Revenue and expense breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Revenue</span>
                    <span className="text-sm font-bold text-emerald-400">₹{(profitLoss.revenue / 100000).toFixed(1)}L</span>
                  </div>
                  <Progress value={100} className="h-3 bg-gray-800" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Expenses</span>
                    <span className="text-sm font-bold text-red-400">₹{(profitLoss.expenses / 100000).toFixed(1)}L</span>
                  </div>
                  <Progress 
                    value={profitLoss.revenue > 0 ? (profitLoss.expenses / profitLoss.revenue) * 100 : 0} 
                    className="h-3 bg-gray-800" 
                  />
                </div>
                <div className="p-4 bg-emerald-900/30 rounded-lg border border-emerald-700/50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-emerald-300">Net Profit</span>
                    <span className="text-xl font-bold text-emerald-400">₹{(profitLoss.netProfit / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Redirect Note */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowRight className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-white">Need to take action?</p>
                  <p className="text-sm text-gray-400">Go to Finance & Wallet module for full control</p>
                </div>
              </div>
              <Button variant="outline" asChild className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white">
                <Link to="/dashboard/finance">
                  Open Finance Module
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}