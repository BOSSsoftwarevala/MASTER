import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  RefreshCw
} from 'lucide-react';

const performanceData = [
  { 
    id: 1,
    name: 'Rajesh Kumar',
    territory: 'Patna Central',
    totalOrders: 45,
    completed: 42,
    conversion: 93.3,
    revenue: 1350000,
    commission: 135000,
    commissionPending: 45000,
    successRate: 98,
    trend: 'up',
    change: 12.5
  },
  { 
    id: 2,
    name: 'Priya Singh',
    territory: 'Patna East',
    totalOrders: 38,
    completed: 35,
    conversion: 92.1,
    revenue: 1125000,
    commission: 112500,
    commissionPending: 37500,
    successRate: 96,
    trend: 'up',
    change: 8.2
  },
  { 
    id: 3,
    name: 'Amit Verma',
    territory: 'Patna West',
    totalOrders: 32,
    completed: 28,
    conversion: 87.5,
    revenue: 890000,
    commission: 89000,
    commissionPending: 29000,
    successRate: 91,
    trend: 'down',
    change: -3.5
  },
  { 
    id: 4,
    name: 'Sunita Devi',
    territory: 'Danapur',
    totalOrders: 28,
    completed: 25,
    conversion: 89.3,
    revenue: 780000,
    commission: 78000,
    commissionPending: 26000,
    successRate: 94,
    trend: 'up',
    change: 5.8
  },
  { 
    id: 5,
    name: 'Mohammed Iqbal',
    territory: 'Phulwari Sharif',
    totalOrders: 22,
    completed: 18,
    conversion: 81.8,
    revenue: 540000,
    commission: 54000,
    commissionPending: 18000,
    successRate: 88,
    trend: 'down',
    change: -1.2
  },
];

const summaryStats = {
  totalResellers: 5,
  totalOrders: 165,
  totalRevenue: 4685000,
  totalCommissionPaid: 468500,
  totalCommissionPending: 155500,
  avgConversion: 88.8,
  avgSuccessRate: 93.4
};

export default function FranchiseResellerPerformancePage() {
  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  return (
    <RoleLayout role="franchise">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Reseller Performance
            </h1>
            <p className="text-muted-foreground mt-1">Track orders, conversions, and commissions in real-time</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardContent className="pt-6">
              <Users className="h-5 w-5 text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{summaryStats.totalResellers}</p>
              <p className="text-xs text-muted-foreground">Active Resellers</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="pt-6">
              <ShoppingCart className="h-5 w-5 text-purple-500 mb-2" />
              <p className="text-2xl font-bold">{summaryStats.totalOrders}</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
            <CardContent className="pt-6">
              <DollarSign className="h-5 w-5 text-emerald-500 mb-2" />
              <p className="text-2xl font-bold">{formatCurrency(summaryStats.totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <CardContent className="pt-6">
              <Target className="h-5 w-5 text-amber-500 mb-2" />
              <p className="text-2xl font-bold">{summaryStats.avgConversion}%</p>
              <p className="text-xs text-muted-foreground">Avg Conversion</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="pt-6">
              <Award className="h-5 w-5 text-green-500 mb-2" />
              <p className="text-2xl font-bold">{formatCurrency(summaryStats.totalCommissionPaid)}</p>
              <p className="text-xs text-muted-foreground">Commission Paid</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <CardContent className="pt-6">
              <DollarSign className="h-5 w-5 text-orange-500 mb-2" />
              <p className="text-2xl font-bold">{formatCurrency(summaryStats.totalCommissionPending)}</p>
              <p className="text-xs text-muted-foreground">Pending Payout</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <CardContent className="pt-6">
              <BarChart3 className="h-5 w-5 text-cyan-500 mb-2" />
              <p className="text-2xl font-bold">{summaryStats.avgSuccessRate}%</p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Reseller Performance Dashboard
            </CardTitle>
            <CardDescription>Live performance metrics for all resellers in your territory</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reseller</TableHead>
                  <TableHead>Territory</TableHead>
                  <TableHead className="text-center">Orders</TableHead>
                  <TableHead className="text-center">Completed</TableHead>
                  <TableHead className="text-center">Conversion %</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Commission Earned</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead className="text-center">Success Rate</TableHead>
                  <TableHead className="text-center">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceData.map((reseller) => (
                  <TableRow key={reseller.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {reseller.name.charAt(0)}
                        </div>
                        <span className="font-medium">{reseller.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{reseller.territory}</TableCell>
                    <TableCell className="text-center font-mono">{reseller.totalOrders}</TableCell>
                    <TableCell className="text-center font-mono text-emerald-500">{reseller.completed}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-2">
                        <Progress value={reseller.conversion} className="h-2 w-16" />
                        <span className="text-sm font-medium">{reseller.conversion}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">₹{reseller.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-emerald-500">₹{reseller.commission.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-amber-500">₹{reseller.commissionPending.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={reseller.successRate >= 95 ? 'default' : reseller.successRate >= 90 ? 'secondary' : 'outline'}
                        className={reseller.successRate >= 95 ? 'bg-emerald-500' : reseller.successRate >= 90 ? 'bg-blue-500' : ''}
                      >
                        {reseller.successRate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`flex items-center justify-center gap-1 ${reseller.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {reseller.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">{Math.abs(reseller.change)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Performer Highlight */}
        <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                <Award className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <span className="text-amber-500">🏆</span> Top Performer This Month
                </h3>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Rajesh Kumar</span> - Patna Central • 
                  45 Orders • 93.3% Conversion • ₹1.35L Commission
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
}
