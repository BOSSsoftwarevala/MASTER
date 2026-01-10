import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Gift, 
  Award,
  DollarSign,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';

const bonuses = [
  { 
    id: 1,
    type: 'Performance Bonus',
    amount: 500,
    reason: 'Exceeded Q4 conversion target by 25%',
    status: 'paid',
    eligibleAt: 'Jan 1, 2026',
    paidAt: 'Jan 3, 2026'
  },
  { 
    id: 2,
    type: 'Campaign Completion',
    amount: 300,
    reason: 'Successfully completed Holiday Campaign',
    status: 'paid',
    eligibleAt: 'Dec 26, 2025',
    paidAt: 'Dec 28, 2025'
  },
  { 
    id: 3,
    type: 'Viral Content Bonus',
    amount: 750,
    reason: 'Tech Tutorial video reached 100K+ views',
    status: 'pending',
    eligibleAt: 'Jan 10, 2026',
  },
  { 
    id: 4,
    type: 'Top Performer',
    amount: 1000,
    reason: 'Ranked #1 influencer in December',
    status: 'pending',
    eligibleAt: 'Jan 15, 2026',
  },
];

const eligibilityProgress = [
  { 
    tier: 'Bronze Bonus',
    requirement: '50 conversions',
    current: 50,
    target: 50,
    reward: '$200',
    achieved: true
  },
  { 
    tier: 'Silver Bonus',
    requirement: '100 conversions',
    current: 85,
    target: 100,
    reward: '$500',
    achieved: false
  },
  { 
    tier: 'Gold Bonus',
    requirement: '200 conversions',
    current: 85,
    target: 200,
    reward: '$1,500',
    achieved: false
  },
  { 
    tier: 'Platinum Bonus',
    requirement: '500 conversions',
    current: 85,
    target: 500,
    reward: '$5,000',
    achieved: false
  },
];

export default function InfluencerBonusPage() {
  const totalEarned = bonuses.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);
  const totalPending = bonuses.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0);

  return (
    <RoleLayout role="influencer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bonus Eligibility</h1>
            <p className="text-muted-foreground">Track your bonus earnings and progress</p>
          </div>
          <Badge variant="outline" className="bg-violet-500/20 text-violet-400 border-violet-500/30">
            <Star className="h-3 w-3 mr-1" />
            Platinum Creator
          </Badge>
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="text-3xl font-bold text-emerald-500">${totalEarned.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-amber-500">${totalPending.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-violet-500/10 to-violet-500/5 border-violet-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-violet-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Bonus</p>
                  <p className="text-3xl font-bold text-violet-500">Jan 10</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tier Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Bonus Tier Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {eligibilityProgress.map((tier, idx) => (
                <div key={idx} className={`p-4 rounded-lg border ${
                  tier.achieved 
                    ? 'border-emerald-500/30 bg-emerald-500/10' 
                    : 'border-muted'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Award className={`h-5 w-5 ${
                        tier.tier.includes('Platinum') ? 'text-violet-500' :
                        tier.tier.includes('Gold') ? 'text-amber-500' :
                        tier.tier.includes('Silver') ? 'text-slate-400' :
                        'text-amber-700'
                      }`} />
                      <span className="font-medium">{tier.tier}</span>
                    </div>
                    {tier.achieved ? (
                      <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Achieved
                      </Badge>
                    ) : (
                      <span className="text-lg font-bold text-primary">{tier.reward}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{tier.requirement}</p>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={(tier.current / tier.target) * 100} 
                      className={`h-2 flex-1 ${tier.achieved ? '[&>div]:bg-emerald-500' : ''}`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {tier.current}/{tier.target}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bonus History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Bonus History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bonuses.map((bonus) => (
                <div key={bonus.id} className={`flex items-center justify-between p-4 rounded-lg ${
                  bonus.status === 'pending' ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-muted/50'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      bonus.status === 'paid' ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                    }`}>
                      {bonus.status === 'paid' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{bonus.type}</p>
                      <p className="text-sm text-muted-foreground">{bonus.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-500">${bonus.amount}</p>
                    <Badge variant="outline" className={
                      bonus.status === 'paid' 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }>
                      {bonus.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {bonus.paidAt ? `Paid: ${bonus.paidAt}` : `Eligible: ${bonus.eligibleAt}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tip */}
        <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
          <p className="text-sm text-violet-400">
            <strong>Tip:</strong> You're only 15 conversions away from the Silver Bonus tier! 
            Focus on high-intent content to unlock the $500 bonus.
          </p>
        </div>
      </div>
    </RoleLayout>
  );
}
