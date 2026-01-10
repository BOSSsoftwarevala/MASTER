import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CreditCard
} from 'lucide-react';

const walletData = {
  balance: 4580,
  pendingPayout: 1200,
  thisMonth: 2800,
  lastMonth: 2430,
  lifetimeEarnings: 28500,
};

const transactions = [
  { id: 1, type: 'credit', description: 'Commission - TechStart Inc', amount: 850, date: 'Jan 5, 2026', status: 'completed' },
  { id: 2, type: 'credit', description: 'Commission - Digital Wave', amount: 520, date: 'Jan 3, 2026', status: 'completed' },
  { id: 3, type: 'debit', description: 'Withdrawal to Bank', amount: 1000, date: 'Jan 2, 2026', status: 'completed' },
  { id: 4, type: 'credit', description: 'Bonus - Gold Tier Achievement', amount: 200, date: 'Dec 28, 2025', status: 'completed' },
  { id: 5, type: 'credit', description: 'Commission - Cloud Nine LLC', amount: 1200, date: 'Dec 26, 2025', status: 'pending' },
];

export default function ResellerWalletPage() {
  return (
    <RoleLayout role="reseller">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
            <p className="text-muted-foreground">Manage your earnings and payouts</p>
          </div>
          <Button className="gap-2">
            <CreditCard className="h-4 w-4" />
            Request Withdrawal
          </Button>
        </div>

        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">${walletData.balance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Ready for withdrawal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">${walletData.pendingPayout.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Processing within 3-5 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${walletData.thisMonth.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">+15%</span> vs last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lifetime Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${walletData.lifetimeEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Since joining</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      tx.type === 'credit' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}>
                      {tx.type === 'credit' ? (
                        <ArrowDownRight className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${tx.type === 'credit' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </p>
                    <Badge variant="outline" className={
                      tx.status === 'completed' 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
}
