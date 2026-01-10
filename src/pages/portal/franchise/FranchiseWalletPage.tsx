import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  CreditCard,
  History,
  TrendingUp
} from 'lucide-react';

// Mock data
const walletData = {
  balance: 24580,
  pendingPayout: 8500,
  thisMonthEarnings: 12500,
  lastPayout: 15000,
  lastPayoutDate: 'Dec 28, 2025',
};

const transactions = [
  { id: 1, type: 'credit', description: 'Commission - Tech Solutions Deal', amount: 2250, date: 'Jan 3, 2026' },
  { id: 2, type: 'credit', description: 'Commission - Cloud Enterprise', amount: 3300, date: 'Jan 2, 2026' },
  { id: 3, type: 'debit', description: 'Withdrawal to Bank', amount: 15000, date: 'Dec 28, 2025' },
  { id: 4, type: 'credit', description: 'Commission - Digital Services', amount: 1275, date: 'Dec 26, 2025' },
  { id: 5, type: 'credit', description: 'Bonus - Monthly Target', amount: 5000, date: 'Dec 25, 2025' },
];

export default function FranchiseWalletPage() {
  return (
    <RoleLayout role="franchise">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
            <p className="text-muted-foreground">Manage your earnings and payouts</p>
          </div>
          <Button>
            <CreditCard className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
        </div>

        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${walletData.balance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready to withdraw</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${walletData.pendingPayout.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${walletData.thisMonthEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500">+18%</span> vs last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Payout</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${walletData.lastPayout.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{walletData.lastPayoutDate}</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
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
                  <div className={`text-lg font-bold ${
                    tx.type === 'credit' ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString()}
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
