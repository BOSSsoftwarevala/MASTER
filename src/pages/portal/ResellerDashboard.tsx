import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Award,
  ArrowUpRight,
  Wallet,
  Calendar,
  Clock
} from 'lucide-react';

// Mock data for reseller dashboard
const resellerStats = {
  rank: 5,
  totalResellers: 142,
  assignedLeads: 28,
  pendingFollowups: 8,
  conversions: 12,
  conversionRate: 42.8,
  walletBalance: 4580,
  pendingPayout: 1200,
  thisMonthEarnings: 2800,
  tier: 'Gold',
};

const assignedLeads = [
  { id: 1, name: 'Alex Thompson', company: 'TechStart Inc', status: 'hot', nextFollowup: 'Today 3:00 PM', value: 8500 },
  { id: 2, name: 'Maria Garcia', company: 'Digital Wave', status: 'warm', nextFollowup: 'Tomorrow 10:00 AM', value: 5200 },
  { id: 3, name: 'James Wilson', company: 'Cloud Nine LLC', status: 'warm', nextFollowup: 'Wed 2:00 PM', value: 12000 },
  { id: 4, name: 'Lisa Chen', company: 'Smart Solutions', status: 'cold', nextFollowup: 'Fri 11:00 AM', value: 3500 },
];

const leaderboard = [
  { rank: 1, name: 'Sarah Kim', conversions: 24, earnings: 9600 },
  { rank: 2, name: 'Mike Johnson', conversions: 21, earnings: 8400 },
  { rank: 3, name: 'Emily Brown', conversions: 19, earnings: 7600 },
  { rank: 4, name: 'David Lee', conversions: 15, earnings: 6000 },
  { rank: 5, name: 'You', conversions: 12, earnings: 4800, isCurrentUser: true },
];

export default function ResellerDashboard() {
  return (
    <RoleLayout role="reseller">
      <div className="space-y-6">
        {/* Header with Dark Luxury Theme */}
        <div className="relative rounded-[18px] overflow-hidden p-6 bg-gradient-to-r from-[hsl(var(--boss-sidebar))] via-[hsl(var(--boss-card))] to-[hsl(var(--boss-card-hover))] border border-[hsl(var(--boss-border))] shadow-[0_8px_32px_hsl(0_0%_0%/0.4)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(206_100%_50%/0.08),transparent_50%)]" />
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--boss-text-primary))]">Reseller Dashboard</h1>
              <p className="text-[hsl(var(--boss-text-muted))]">Track your leads, conversions, and earnings.</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                <Award className="h-3 w-3 mr-1" />
                {resellerStats.tier} Tier
              </Badge>
              <Badge className="bg-[hsl(var(--boss-accent-blue))]/20 text-[hsl(var(--boss-accent-blue))] border-[hsl(var(--boss-accent-blue))]/30">
                <TrendingUp className="h-3 w-3 mr-1" />
                Rank #{resellerStats.rank}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">Assigned Leads</CardTitle>
              <Target className="h-4 w-4 text-[hsl(var(--boss-accent-blue))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--boss-text-primary))]">{resellerStats.assignedLeads}</div>
              <p className="text-xs text-[hsl(var(--boss-text-muted))]">
                {resellerStats.pendingFollowups} pending follow-ups
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">Conversions</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--boss-text-primary))]">{resellerStats.conversions}</div>
              <p className="text-xs text-[hsl(var(--boss-text-muted))]">
                {resellerStats.conversionRate}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-[hsl(var(--boss-accent-neon))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--boss-accent-blue))]">${resellerStats.walletBalance.toLocaleString()}</div>
              <p className="text-xs text-[hsl(var(--boss-text-muted))]">
                ${resellerStats.pendingPayout} pending payout
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--boss-text-primary))]">${resellerStats.thisMonthEarnings.toLocaleString()}</div>
              <p className="text-xs text-[hsl(var(--boss-text-muted))] flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">+15%</span> vs last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Today's Follow-ups */}
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text-primary))]">
                <Calendar className="h-5 w-5 text-[hsl(var(--boss-accent-blue))]" />
                Today's Follow-ups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedLeads.slice(0, 3).map((lead) => (
                  <div key={lead.id} className="flex items-start justify-between p-3 rounded-lg bg-[hsl(var(--boss-sidebar))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors">
                    <div>
                      <p className="font-medium text-[hsl(var(--boss-text-primary))]">{lead.name}</p>
                      <p className="text-sm text-[hsl(var(--boss-text-muted))]">{lead.company}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-3 w-3 text-[hsl(var(--boss-text-muted))]" />
                        <span className="text-xs text-[hsl(var(--boss-text-muted))]">{lead.nextFollowup}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={
                        lead.status === 'hot' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        lead.status === 'warm' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        'bg-[hsl(var(--boss-accent-blue))]/20 text-[hsl(var(--boss-accent-blue))] border-[hsl(var(--boss-accent-blue))]/30'
                      }>
                        {lead.status}
                      </Badge>
                      <p className="text-sm font-medium mt-2 text-[hsl(var(--boss-text-primary))]">${lead.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rank Board */}
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text-primary))]">
                <Award className="h-5 w-5 text-amber-400" />
                Rank Board
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.rank} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.isCurrentUser ? 'bg-[hsl(var(--boss-accent-blue))]/20 border border-[hsl(var(--boss-accent-blue))]/30' : 'bg-[hsl(var(--boss-sidebar))]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        entry.rank === 1 ? 'bg-amber-500 text-white' :
                        entry.rank === 2 ? 'bg-slate-400 text-white' :
                        entry.rank === 3 ? 'bg-amber-700 text-white' :
                        'bg-[hsl(var(--boss-sidebar))] text-[hsl(var(--boss-text-muted))]'
                      }`}>
                        {entry.rank}
                      </div>
                      <span className={`font-medium ${entry.isCurrentUser ? 'text-[hsl(var(--boss-accent-blue))]' : 'text-[hsl(var(--boss-text-primary))]'}`}>
                        {entry.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[hsl(var(--boss-text-primary))]">{entry.conversions} sales</p>
                      <p className="text-xs text-[hsl(var(--boss-text-muted))]">${entry.earnings.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Next Tier */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--boss-text-primary))]">Progress to Platinum Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[hsl(var(--boss-text-primary))]">Monthly Conversions</span>
                  <span className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">12 / 20</span>
                </div>
                <Progress value={60} className="h-2 bg-[hsl(var(--boss-sidebar))]" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[hsl(var(--boss-text-primary))]">Total Earnings</span>
                  <span className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">$4,800 / $10,000</span>
                </div>
                <Progress value={48} className="h-2 bg-[hsl(var(--boss-sidebar))]" />
              </div>
              <p className="text-sm text-[hsl(var(--boss-text-muted))]">
                Complete 8 more conversions and earn $5,200 more to unlock Platinum tier benefits.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
}
