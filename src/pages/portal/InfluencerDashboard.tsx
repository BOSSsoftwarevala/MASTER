import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Eye,
  Megaphone,
  Award,
  ArrowUpRight,
  Wallet,
  BarChart3,
  Activity,
  Link as LinkIcon,
  Users
} from 'lucide-react';

// Mock data for influencer dashboard
const influencerStats = {
  totalReach: 485000,
  reachChange: 18,
  clicks: 12500,
  clicksChange: 24,
  leads: 580,
  leadsChange: 15,
  conversions: 120,
  conversionRate: 20.6,
  commission: 12000,
  pendingPayout: 3500,
  tier: 'Platinum',
  activeCampaigns: 4,
};

const activeCampaigns = [
  { id: 1, name: 'Summer Product Launch', platform: 'YouTube', status: 'in_progress', deadline: 'Jan 15', reach: 125000, target: 150000 },
  { id: 2, name: 'Tech Tutorial Series', platform: 'Instagram', status: 'completed', deadline: 'Jan 5', reach: 98000, target: 80000 },
  { id: 3, name: 'New Year Promo', platform: 'TikTok', status: 'assigned', deadline: 'Jan 20', reach: 0, target: 200000 },
  { id: 4, name: 'Product Review', platform: 'Blog', status: 'submitted', deadline: 'Jan 8', reach: 15000, target: 20000 },
];

const recentPayouts = [
  { id: 1, campaign: 'Tech Tutorial Series', amount: 2100, date: 'Dec 28', status: 'completed' },
  { id: 2, campaign: 'Holiday Campaign', amount: 1500, date: 'Dec 20', status: 'completed' },
  { id: 3, campaign: 'Product Unboxing', amount: 850, date: 'Dec 15', status: 'completed' },
];

const socialAccounts = [
  { platform: 'YouTube', followers: 245000, engagement: 4.2 },
  { platform: 'Instagram', followers: 180000, engagement: 5.8 },
  { platform: 'TikTok', followers: 320000, engagement: 8.1 },
  { platform: 'Twitter', followers: 45000, engagement: 2.4 },
];

export default function InfluencerDashboard() {
  return (
    <RoleLayout role="influencer">
      <div className="space-y-6">
        {/* Header with Dark Luxury Theme */}
        <div className="relative rounded-[18px] overflow-hidden p-6 bg-gradient-to-r from-[hsl(var(--boss-sidebar))] via-[hsl(var(--boss-card))] to-[hsl(var(--boss-card-hover))] border border-[hsl(var(--boss-border))] shadow-[0_8px_32px_hsl(0_0%_0%/0.4)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(280_100%_50%/0.08),transparent_50%)]" />
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--boss-text-primary))]">Influencer Dashboard</h1>
              <p className="text-[hsl(var(--boss-text-muted))]">Track your campaigns, reach, and earnings.</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                <Award className="h-3 w-3 mr-1" />
                {influencerStats.tier} Creator
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <Activity className="h-3 w-3 mr-1" />
                {influencerStats.activeCampaigns} Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">Total Reach</CardTitle>
              <Eye className="h-4 w-4 text-violet-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--boss-text-primary))]">{(influencerStats.totalReach / 1000).toFixed(0)}K</div>
              <p className="text-xs text-[hsl(var(--boss-text-muted))] flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">+{influencerStats.reachChange}%</span> this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">Clicks</CardTitle>
              <BarChart3 className="h-4 w-4 text-[hsl(var(--boss-accent-blue))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--boss-text-primary))]">{influencerStats.clicks.toLocaleString()}</div>
              <p className="text-xs text-[hsl(var(--boss-text-muted))] flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">+{influencerStats.clicksChange}%</span> this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">Leads Generated</CardTitle>
              <Target className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--boss-text-primary))]">{influencerStats.leads}</div>
              <p className="text-xs text-[hsl(var(--boss-text-muted))]">
                {influencerStats.conversions} converted ({influencerStats.conversionRate}%)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card))] border-violet-500/30 hover:bg-[hsl(var(--boss-card-hover))] transition-colors rounded-[18px] shadow-[0_4px_20px_hsl(280_100%_50%/0.1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-violet-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet-400">${influencerStats.commission.toLocaleString()}</div>
              <p className="text-xs text-[hsl(var(--boss-text-muted))]">
                ${influencerStats.pendingPayout.toLocaleString()} pending payout
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Active Campaigns */}
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text-primary))]">
                <Megaphone className="h-5 w-5 text-violet-400" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeCampaigns.map((campaign) => (
                  <div key={campaign.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm text-[hsl(var(--boss-text-primary))]">{campaign.name}</p>
                        <div className="flex items-center gap-2 text-xs text-[hsl(var(--boss-text-muted))]">
                          <span>{campaign.platform}</span>
                          <span>•</span>
                          <span>Due {campaign.deadline}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={
                        campaign.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        campaign.status === 'in_progress' ? 'bg-[hsl(var(--boss-accent-blue))]/20 text-[hsl(var(--boss-accent-blue))] border-[hsl(var(--boss-accent-blue))]/30' :
                        campaign.status === 'submitted' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        'bg-slate-500/20 text-slate-400 border-slate-500/30'
                      }>
                        {campaign.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={(campaign.reach / campaign.target) * 100} className="h-1 flex-1 bg-[hsl(var(--boss-sidebar))]" />
                      <span className="text-xs text-[hsl(var(--boss-text-muted))]">
                        {(campaign.reach / 1000).toFixed(0)}K / {(campaign.target / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Accounts */}
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text-primary))]">
                <LinkIcon className="h-5 w-5 text-[hsl(var(--boss-accent-blue))]" />
                Connected Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {socialAccounts.map((account, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--boss-sidebar))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-violet-400" />
                      </div>
                      <div>
                        <p className="font-medium text-[hsl(var(--boss-text-primary))]">{account.platform}</p>
                        <p className="text-sm text-[hsl(var(--boss-text-muted))]">
                          {(account.followers / 1000).toFixed(0)}K followers
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-emerald-400">{account.engagement}%</p>
                      <p className="text-xs text-[hsl(var(--boss-text-muted))]">engagement</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payouts */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text-primary))]">
              <Wallet className="h-5 w-5 text-[hsl(var(--boss-accent-neon))]" />
              Recent Payouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {recentPayouts.map((payout) => (
                <div key={payout.id} className="p-4 rounded-lg border border-[hsl(var(--boss-border))] bg-[hsl(var(--boss-sidebar))]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[hsl(var(--boss-text-primary))]">${payout.amount.toLocaleString()}</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      {payout.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-[hsl(var(--boss-text-muted))]">{payout.campaign}</p>
                  <p className="text-xs text-[hsl(var(--boss-text-muted))] mt-1">{payout.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
}
