import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet, Shield, Building, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useFranchiseWallets } from '@/hooks/useFranchiseData';
import { useUserRoles } from '@/hooks/useUserRoles';
import { format } from 'date-fns';

export default function FranchiseWalletPage() {
  const { data: wallets, isLoading } = useFranchiseWallets();
  const { isAdmin } = useUserRoles();

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

  // Calculate totals
  const totalBalance = wallets?.reduce((sum, w) => sum + Number(w.balance || 0), 0) || 0;
  const totalPending = wallets?.reduce((sum, w) => sum + Number(w.pending_payouts || 0), 0) || 0;
  const totalEarned = wallets?.reduce((sum, w) => sum + Number(w.total_earned || 0), 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Franchise Wallet View</h1>
            <p className="text-muted-foreground">Read-only view of franchise financial balances</p>
          </div>
          <Badge variant="outline" className="gap-1">
            <Wallet className="h-3 w-3" />
            {wallets?.length || 0} Wallets
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                  <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalBalance)}</p>
                </div>
                <Wallet className="h-8 w-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payouts</p>
                  <p className="text-2xl font-bold text-yellow-400">{formatCurrency(totalPending)}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earned (All Time)</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalEarned)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Balances (Read-Only)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : wallets && wallets.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Franchise</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Pending Payouts</TableHead>
                    <TableHead className="text-right">Total Earned</TableHead>
                    <TableHead className="text-right">Total Deductions</TableHead>
                    <TableHead>Last Settlement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell>
                        {wallet.franchises ? (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{wallet.franchises.legal_name}</p>
                              {wallet.franchises.business_name && (
                                <p className="text-sm text-muted-foreground">{wallet.franchises.business_name}</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-emerald-400">
                          {formatCurrency(Number(wallet.balance || 0))}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Clock className="h-3 w-3 text-yellow-400" />
                          <span className="text-yellow-400">
                            {formatCurrency(Number(wallet.pending_payouts || 0))}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <TrendingUp className="h-3 w-3 text-blue-400" />
                          {formatCurrency(Number(wallet.total_earned || 0))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 text-destructive">
                          <TrendingDown className="h-3 w-3" />
                          {formatCurrency(Number(wallet.total_deductions || 0))}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {wallet.last_settlement_at 
                          ? format(new Date(wallet.last_settlement_at), 'MMM dd, yyyy')
                          : 'Never'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Wallet Data</h3>
                <p className="text-muted-foreground">No franchise wallets have been created yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
