import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Server,
  Cpu,
  HardDrive,
  Network,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface CostItem {
  id: string;
  name: string;
  type: string;
  currentCost: number;
  projectedCost: number;
  budget: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

const mockCosts: CostItem[] = [
  { id: '1', name: 'Primary VPS', type: 'Compute', currentCost: 45, projectedCost: 52, budget: 60, trend: 'up', trendPercent: 15 },
  { id: '2', name: 'Database Cluster', type: 'Storage', currentCost: 28, projectedCost: 30, budget: 35, trend: 'up', trendPercent: 7 },
  { id: '3', name: 'CDN Bandwidth', type: 'Network', currentCost: 18, projectedCost: 15, budget: 25, trend: 'down', trendPercent: 12 },
  { id: '4', name: 'Backup Storage', type: 'Storage', currentCost: 12, projectedCost: 12, budget: 20, trend: 'stable', trendPercent: 0 },
  { id: '5', name: 'Load Balancer', type: 'Network', currentCost: 15, projectedCost: 15, budget: 20, trend: 'stable', trendPercent: 0 },
];

export default function CostControlPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const [refreshing, setRefreshing] = useState(false);
  const [costs] = useState<CostItem[]>(mockCosts);

  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1500));
    setRefreshing(false);
  };

  const totalCurrent = costs.reduce((acc, c) => acc + c.currentCost, 0);
  const totalBudget = costs.reduce((acc, c) => acc + c.budget, 0);
  const totalProjected = costs.reduce((acc, c) => acc + c.projectedCost, 0);
  const budgetUsage = (totalCurrent / totalBudget) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-[hsl(var(--boss-text))]">
              <DollarSign className="h-8 w-8 text-[hsl(var(--boss-accent))]" />
              Cost Control
            </h1>
            <p className="text-[hsl(var(--boss-text-muted))] mt-1">
              AI-powered cost monitoring and optimization
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              className="gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]"
            >
              <Calendar className="h-4 w-4" />
              This Month
            </Button>
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Budget Overview */}
        <Card className="bg-gradient-to-br from-[hsl(var(--boss-card))] to-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-[hsl(var(--boss-text-muted))]">Monthly Budget Usage</p>
                <p className="text-4xl font-bold text-[hsl(var(--boss-text))]">
                  ${totalCurrent.toFixed(2)} <span className="text-lg text-[hsl(var(--boss-text-muted))]">/ ${totalBudget.toFixed(2)}</span>
                </p>
              </div>
              <div className={`text-right ${budgetUsage > 80 ? 'text-red-400' : budgetUsage > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                <p className="text-3xl font-bold">{budgetUsage.toFixed(0)}%</p>
                <p className="text-sm">used</p>
              </div>
            </div>
            <Progress 
              value={budgetUsage} 
              className={`h-3 ${budgetUsage > 80 ? '[&>div]:bg-red-500' : budgetUsage > 60 ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'}`}
            />
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="flex items-center gap-2 text-[hsl(var(--boss-text-muted))]">
                <Target className="h-4 w-4" />
                Projected: ${totalProjected.toFixed(2)}
              </div>
              <div className="flex items-center gap-2">
                {totalProjected > totalBudget ? (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Over Budget Risk
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-500/20 text-emerald-400 gap-1">
                    <Zap className="h-3 w-3" />
                    On Track
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Compute', value: costs.filter(c => c.type === 'Compute').reduce((a, c) => a + c.currentCost, 0), icon: Cpu, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Storage', value: costs.filter(c => c.type === 'Storage').reduce((a, c) => a + c.currentCost, 0), icon: HardDrive, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Network', value: costs.filter(c => c.type === 'Network').reduce((a, c) => a + c.currentCost, 0), icon: Network, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          ].map((item) => (
            <Card key={item.label} className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[hsl(var(--boss-text-muted))]">{item.label}</p>
                    <p className="text-2xl font-bold text-[hsl(var(--boss-text))]">${item.value.toFixed(2)}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Recommendations */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-accent))]/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text))]">
              <Zap className="h-5 w-5 text-[hsl(var(--boss-accent))]" />
              AI Cost Optimization
            </CardTitle>
            <CardDescription className="text-[hsl(var(--boss-text-muted))]">
              Recommendations to reduce costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Downsize Primary VPS', saving: 12, desc: 'Current CPU usage is below 30%. Switching to a smaller instance can save $12/month.' },
                { title: 'Enable CDN Caching', saving: 8, desc: 'Enable aggressive caching to reduce bandwidth costs by approximately $8/month.' },
                { title: 'Optimize Database Queries', saving: 5, desc: 'Detected inefficient queries causing extra storage I/O. Optimization can save $5/month.' },
              ].map((rec, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg bg-[hsl(var(--boss-card-elevated))] border border-[hsl(var(--boss-border))]"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <TrendingDown className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(var(--boss-text))]">{rec.title}</p>
                      <p className="text-sm text-[hsl(var(--boss-text-muted))] mt-1">{rec.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-400">-${rec.saving}</p>
                      <p className="text-xs text-[hsl(var(--boss-text-muted))]">/month</p>
                    </div>
                    <Button size="sm" className="bg-[hsl(var(--boss-accent))] hover:bg-[hsl(var(--boss-accent))]/90">
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Cost List */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text))]">
              <Server className="h-5 w-5 text-[hsl(var(--boss-accent))]" />
              Cost Breakdown
            </CardTitle>
            <CardDescription className="text-[hsl(var(--boss-text-muted))]">
              Detailed cost per resource
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {costs.map((cost) => (
                <div 
                  key={cost.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[hsl(var(--boss-card-elevated))] border border-[hsl(var(--boss-border))]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      cost.type === 'Compute' ? 'bg-blue-500/10' :
                      cost.type === 'Storage' ? 'bg-amber-500/10' :
                      'bg-emerald-500/10'
                    }`}>
                      {cost.type === 'Compute' && <Cpu className="h-5 w-5 text-blue-400" />}
                      {cost.type === 'Storage' && <HardDrive className="h-5 w-5 text-amber-400" />}
                      {cost.type === 'Network' && <Network className="h-5 w-5 text-emerald-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(var(--boss-text))]">{cost.name}</p>
                      <p className="text-sm text-[hsl(var(--boss-text-muted))]">{cost.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-medium text-[hsl(var(--boss-text))]">${cost.currentCost.toFixed(2)}</p>
                      <p className="text-xs text-[hsl(var(--boss-text-muted))]">of ${cost.budget} budget</p>
                    </div>
                    <div className="w-24">
                      <Progress 
                        value={(cost.currentCost / cost.budget) * 100} 
                        className="h-2"
                      />
                    </div>
                    <div className={`flex items-center gap-1 ${
                      cost.trend === 'up' ? 'text-red-400' :
                      cost.trend === 'down' ? 'text-emerald-400' :
                      'text-[hsl(var(--boss-text-muted))]'
                    }`}>
                      {cost.trend === 'up' && <ArrowUpRight className="h-4 w-4" />}
                      {cost.trend === 'down' && <ArrowDownRight className="h-4 w-4" />}
                      {cost.trend !== 'stable' && <span className="text-sm">{cost.trendPercent}%</span>}
                      {cost.trend === 'stable' && <span className="text-sm">Stable</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
