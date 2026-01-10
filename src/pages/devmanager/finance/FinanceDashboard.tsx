import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useFinanceDashboardStats, useFinanceRealtime } from '@/hooks/useFinanceData';
import { useUserRoles } from '@/hooks/useUserRoles';
import {
  Wallet,
  FileText,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Plus,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Banknote,
} from 'lucide-react';

export default function FinanceDashboard() {
  const navigate = useNavigate();
  const { isAdmin } = useUserRoles();
  const { data: stats, isLoading } = useFinanceDashboardStats();
  
  useFinanceRealtime();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Card className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access the Finance Manager.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const quickActions = [
    { label: 'Generate Invoice', icon: FileText, path: '/dashboard/finance/invoices/create', color: 'bg-blue-500' },
    { label: 'Add Wallet Credit', icon: Plus, path: '/dashboard/finance/wallets', color: 'bg-green-500' },
    { label: 'Process Payout', icon: Banknote, path: '/dashboard/finance/payouts', color: 'bg-purple-500' },
    { label: 'View Cost Report', icon: PieChart, path: '/dashboard/finance/costs', color: 'bg-orange-500' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Finance Manager</h1>
            <p className="text-muted-foreground mt-1">Manage wallets, billing, invoices, payouts & costs</p>
          </div>
          <Badge variant="outline" className="text-sm">
            <DollarSign className="h-3 w-3 mr-1" />
            Finance Operations
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue (MTD)</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats?.thisMonthRevenue || 0)}</div>
                  <div className="flex items-center text-xs text-green-500 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    This month's earnings
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balances</CardTitle>
                  <Wallet className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats?.totalWalletBalance || 0)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Hold: {formatCurrency(stats?.totalHoldAmount || 0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payouts</CardTitle>
                  <CreditCard className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats?.pendingPayouts || 0)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stats?.pendingPayoutsCount || 0} pending requests
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-l-4 ${(stats?.overdueInvoices || 0) > 0 ? 'border-l-red-500' : 'border-l-gray-500'}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Invoices</CardTitle>
                  <Receipt className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.overdueInvoices || 0}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {(stats?.overdueInvoices || 0) > 0 ? (
                      <span className="text-red-500 flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Requires attention
                      </span>
                    ) : (
                      'All invoices on track'
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card
              key={action.label}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(action.path)}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium">{action.label}</p>
                  <p className="text-sm text-muted-foreground">Quick action</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Category Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/finance/wallets')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Wallets
              </CardTitle>
              <CardDescription>Manage company, franchise, reseller & user wallets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="secondary">Balance</Badge>
                <Badge variant="secondary">Ledger</Badge>
                <Badge variant="secondary">Holds</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/finance/invoices')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Billing & Invoices
              </CardTitle>
              <CardDescription>Generate, track, and manage all invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="secondary">Generate</Badge>
                <Badge variant="secondary">Track</Badge>
                <Badge variant="secondary">Receipts</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/finance/plans')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Subscriptions & Plans
              </CardTitle>
              <CardDescription>Manage pricing plans and subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="secondary">Prime</Badge>
                <Badge variant="secondary">Franchise</Badge>
                <Badge variant="secondary">Reseller</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/finance/payouts')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-primary" />
                Payouts & Settlements
              </CardTitle>
              <CardDescription>Process and track all payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="secondary">Pending</Badge>
                <Badge variant="secondary">Approve</Badge>
                <Badge variant="secondary">Release</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/finance/costs')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Cost & Burn
              </CardTitle>
              <CardDescription>Monitor AI, API, and server costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="secondary">AI</Badge>
                <Badge variant="secondary">API</Badge>
                <Badge variant="secondary">Server</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Revenue Summary
              </CardTitle>
              <CardDescription>Total lifetime revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? <Skeleton className="h-8 w-32" /> : formatCurrency(stats?.totalRevenue || 0)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                From {stats?.totalInvoices || 0} invoices
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
