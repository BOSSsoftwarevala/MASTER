import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Users, 
  MapPin, 
  Award,
  ArrowUpRight,
  Wallet,
  Package,
  ShoppingCart,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for franchise dashboard
const franchiseStats = {
  totalLeads: 245,
  leadsChange: 12,
  conversions: 42,
  conversionRate: 17.1,
  revenue: 84500,
  revenueChange: 8.5,
  commission: 12675,
  commissionRate: 30,
  territory: 'Los Angeles Metro',
  tier: 'Gold',
  localResellers: 8,
  pendingOrders: 5,
};

const recentLeads = [
  { id: 1, name: 'Tech Solutions Inc', status: 'hot', value: 15000, date: '2 hours ago' },
  { id: 2, name: 'Digital Services LLC', status: 'warm', value: 8500, date: '5 hours ago' },
  { id: 3, name: 'Cloud Enterprise', status: 'hot', value: 22000, date: 'Yesterday' },
  { id: 4, name: 'Smart Retail Co', status: 'cold', value: 5000, date: 'Yesterday' },
];

const topResellers = [
  { name: 'John Smith', leads: 45, conversions: 12, commission: 2400 },
  { name: 'Sarah Johnson', leads: 38, conversions: 9, commission: 1800 },
  { name: 'Mike Chen', leads: 32, conversions: 7, commission: 1400 },
];

const pendingOrders = [
  { id: 1, product: 'School ERP Pro', client: 'ABC Academy', amount: 12500, status: 'processing', time: '1h 45m left' },
  { id: 2, product: 'Healthcare CRM', client: 'City Hospital', amount: 18000, status: 'pending', time: '2h 30m left' },
  { id: 3, product: 'E-Commerce Suite', client: 'Fashion Store', amount: 8500, status: 'processing', time: '45m left' },
];

export default function FranchiseDashboard() {
  const navigate = useNavigate();

  return (
    <RoleLayout role="franchise">
      <div className="space-y-6">
        {/* Header with Dark Luxury Theme */}
        <div className="relative rounded-[18px] overflow-hidden p-6 bg-gradient-to-r from-[hsl(var(--boss-sidebar))] via-[hsl(var(--boss-card))] to-[hsl(var(--boss-card-hover))] border border-[hsl(var(--boss-border))] shadow-[0_8px_32px_hsl(0_0%_0%/0.4)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(206_100%_50%/0.08),transparent_50%)]" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-[hsl(var(--boss-accent-blue))]" />
                <span className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">Welcome to Your Territory</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--boss-text-primary))]">Franchise Dashboard</h1>
              <p className="text-[hsl(var(--boss-text-muted))] mt-1">Manage leads, orders, and commissions from one place.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                <Award className="h-3 w-3 mr-1" />
                {franchiseStats.tier} Tier
              </Badge>
              <Badge className="bg-[hsl(var(--boss-accent-blue))]/20 text-[hsl(var(--boss-accent-blue))] border-[hsl(var(--boss-accent-blue))]/30">
                <MapPin className="h-3 w-3 mr-1" />
                {franchiseStats.territory}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">Total Leads</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-[hsl(var(--boss-accent-blue))]/10 flex items-center justify-center">
                <Target className="h-4 w-4 text-[hsl(var(--boss-accent-blue))]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--boss-text-primary))]">{franchiseStats.totalLeads}</div>
              <p className="text-xs text-[hsl(var(--boss-text-muted))] flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">+{franchiseStats.leadsChange}%</span> this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">Conversions</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--boss-text-primary))]">{franchiseStats.conversions}</div>
              <p className="text-xs text-[hsl(var(--boss-text-muted))] mt-1">
                {franchiseStats.conversionRate}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">Revenue</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-[hsl(var(--boss-accent-blue))]/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-[hsl(var(--boss-accent-blue))]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--boss-text-primary))]">${franchiseStats.revenue.toLocaleString()}</div>
              <p className="text-xs text-[hsl(var(--boss-text-muted))] flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">+{franchiseStats.revenueChange}%</span> growth
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-accent-blue))]/30 hover:bg-[hsl(var(--boss-card-hover))] transition-colors rounded-[18px] shadow-[0_4px_20px_hsl(206_100%_50%/0.15)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">Commission</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-[hsl(var(--boss-accent-neon))]/10 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-[hsl(var(--boss-accent-neon))]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--boss-accent-blue))]">${franchiseStats.commission.toLocaleString()}</div>
              <p className="text-xs text-[hsl(var(--boss-text-muted))] mt-1">
                {franchiseStats.commissionRate}% auto-deducted
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card))] border-amber-500/30 hover:bg-[hsl(var(--boss-card-hover))] transition-colors rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">Pending Orders</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--boss-text-primary))]">{franchiseStats.pendingOrders}</div>
              <p className="text-xs text-[hsl(var(--boss-text-muted))] mt-1">
                2-hour delivery target
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders & Resellers Grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Pending Orders */}
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text-primary))]">
                  <ShoppingCart className="h-5 w-5 text-[hsl(var(--boss-accent-blue))]" />
                  Order Requests
                </CardTitle>
                <p className="text-sm text-[hsl(var(--boss-text-muted))] mt-1">Auto-commission on delivery</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/portal/franchise/orders')}
                className="border-[hsl(var(--boss-accent-blue))]/30 text-[hsl(var(--boss-accent-blue))] hover:bg-[hsl(var(--boss-accent-blue))]/10"
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--boss-sidebar))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[hsl(var(--boss-text-primary))]">{order.product}</p>
                      <p className="text-xs text-[hsl(var(--boss-text-muted))]">{order.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[hsl(var(--boss-text-primary))]">${order.amount.toLocaleString()}</p>
                      <div className="flex items-center gap-1 text-xs">
                        {order.status === 'processing' ? (
                          <>
                            <Clock className="h-3 w-3 text-amber-400" />
                            <span className="text-amber-400">{order.time}</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 text-[hsl(var(--boss-accent-blue))]" />
                            <span className="text-[hsl(var(--boss-accent-blue))]">Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-[hsl(var(--boss-accent-blue))]/5 border border-[hsl(var(--boss-accent-blue))]/20">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--boss-accent-blue))]" />
                  <span className="text-[hsl(var(--boss-text-secondary))]">Commission auto-credited on order completion</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Local Resellers */}
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text-primary))]">
                  <Users className="h-5 w-5 text-emerald-400" />
                  Local Resellers
                </CardTitle>
                <p className="text-sm text-[hsl(var(--boss-text-muted))] mt-1">{franchiseStats.localResellers} active in territory</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/portal/franchise/staff')}
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
              >
                Manage
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topResellers.map((reseller, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--boss-sidebar))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                        idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-400' : 'bg-orange-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[hsl(var(--boss-text-primary))]">{reseller.name}</p>
                        <p className="text-xs text-[hsl(var(--boss-text-muted))]">{reseller.leads} leads</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-400">${reseller.commission}</p>
                      <p className="text-xs text-[hsl(var(--boss-text-muted))]">{reseller.conversions} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Leads */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text-primary))]">
                <Target className="h-5 w-5 text-[hsl(var(--boss-accent-blue))]" />
                Incoming Leads
              </CardTitle>
              <p className="text-sm text-[hsl(var(--boss-text-muted))] mt-1">Territory-locked leads</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/portal/franchise/leads')}
              className="border-[hsl(var(--boss-accent-blue))]/30 text-[hsl(var(--boss-accent-blue))] hover:bg-[hsl(var(--boss-accent-blue))]/10"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--boss-sidebar))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--boss-text-primary))]">{lead.name}</p>
                    <p className="text-xs text-[hsl(var(--boss-text-muted))]">{lead.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={
                      lead.status === 'hot' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      lead.status === 'warm' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-[hsl(var(--boss-accent-blue))]/20 text-[hsl(var(--boss-accent-blue))] border-[hsl(var(--boss-accent-blue))]/30'
                    }>
                      {lead.status}
                    </Badge>
                    <span className="text-sm font-semibold text-[hsl(var(--boss-text-primary))]">${lead.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Target Progress */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text-primary))]">
              <TrendingUp className="h-5 w-5 text-[hsl(var(--boss-accent-blue))]" />
              Monthly Target Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[hsl(var(--boss-text-primary))]">Lead Target</span>
                  <span className="text-sm text-[hsl(var(--boss-text-muted))]">245 / 300</span>
                </div>
                <Progress value={81.6} className="h-2 bg-[hsl(var(--boss-sidebar))]" />
                <p className="text-xs text-emerald-400">81.6% Complete</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[hsl(var(--boss-text-primary))]">Revenue Target</span>
                  <span className="text-sm text-[hsl(var(--boss-text-muted))]">$84,500 / $100,000</span>
                </div>
                <Progress value={84.5} className="h-2 bg-[hsl(var(--boss-sidebar))]" />
                <p className="text-xs text-emerald-400">84.5% Complete</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[hsl(var(--boss-text-primary))]">Conversion Target</span>
                  <span className="text-sm text-[hsl(var(--boss-text-muted))]">42 / 50</span>
                </div>
                <Progress value={84} className="h-2 bg-[hsl(var(--boss-sidebar))]" />
                <p className="text-xs text-emerald-400">84% Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
}
