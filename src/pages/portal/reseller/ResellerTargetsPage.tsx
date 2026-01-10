import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  Calendar,
  Award,
  DollarSign,
  Users
} from 'lucide-react';

const targets = [
  { 
    type: 'Leads Contacted',
    target: 50,
    current: 38,
    unit: 'leads',
    period: 'January 2026',
    status: 'on_track'
  },
  { 
    type: 'Conversions',
    target: 15,
    current: 12,
    unit: 'sales',
    period: 'January 2026',
    status: 'on_track'
  },
  { 
    type: 'Revenue Generated',
    target: 25000,
    current: 18500,
    unit: 'USD',
    period: 'January 2026',
    status: 'on_track'
  },
  { 
    type: 'Follow-up Rate',
    target: 90,
    current: 78,
    unit: '%',
    period: 'January 2026',
    status: 'at_risk'
  },
];

const weeklyProgress = [
  { week: 'Week 1', leads: 12, conversions: 3, earnings: 4200 },
  { week: 'Week 2', leads: 10, conversions: 4, earnings: 5800 },
  { week: 'Week 3', leads: 8, conversions: 3, earnings: 4500 },
  { week: 'Week 4', leads: 8, conversions: 2, earnings: 4000 },
];

const bonusTiers = [
  { tier: 'Bronze', requirement: '10 conversions', reward: '$200 bonus', achieved: true },
  { tier: 'Silver', requirement: '15 conversions', reward: '$500 bonus', achieved: false },
  { tier: 'Gold', requirement: '20 conversions', reward: '$1000 bonus', achieved: false },
];

export default function ResellerTargetsPage() {
  return (
    <RoleLayout role="reseller">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Target Tracker</h1>
            <p className="text-muted-foreground">Track your performance against monthly targets</p>
          </div>
          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <TrendingUp className="h-3 w-3 mr-1" />
            75% Target Achieved
          </Badge>
        </div>

        {/* Monthly Targets */}
        <div className="grid gap-4 md:grid-cols-2">
          {targets.map((target, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{target.type}</CardTitle>
                  <Badge variant="outline" className={
                    target.status === 'on_track' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }>
                    {target.status === 'on_track' ? 'On Track' : 'At Risk'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-3xl font-bold">
                        {target.unit === 'USD' ? `$${target.current.toLocaleString()}` : target.current}
                      </span>
                      <span className="text-muted-foreground">
                        {' / '}{target.unit === 'USD' ? `$${target.target.toLocaleString()}` : target.target}
                        {target.unit !== 'USD' && ` ${target.unit}`}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{target.period}</span>
                  </div>
                  <Progress 
                    value={(target.current / target.target) * 100} 
                    className={`h-2 ${target.status === 'at_risk' ? '[&>div]:bg-amber-500' : ''}`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weekly Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {weeklyProgress.map((week, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-muted/50">
                  <p className="font-medium mb-3">{week.week}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Leads
                      </span>
                      <span>{week.leads}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Conversions
                      </span>
                      <span>{week.conversions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Earnings
                      </span>
                      <span className="font-medium">${week.earnings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bonus Tiers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Bonus Tiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {bonusTiers.map((tier, idx) => (
                <div key={idx} className={`p-4 rounded-lg border ${
                  tier.achieved 
                    ? 'border-emerald-500/30 bg-emerald-500/10' 
                    : 'border-muted'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className={
                      tier.tier === 'Gold' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      tier.tier === 'Silver' ? 'bg-slate-400/20 text-slate-400 border-slate-400/30' :
                      'bg-amber-700/20 text-amber-700 border-amber-700/30'
                    }>
                      {tier.tier}
                    </Badge>
                    {tier.achieved && (
                      <span className="text-emerald-500 text-sm font-medium">✓ Achieved</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.requirement}</p>
                  <p className="font-medium mt-1">{tier.reward}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-sm text-blue-400">
            <strong>AI Tip:</strong> You're 3 conversions away from the Silver tier bonus! 
            Focus on your hottest leads to unlock the $500 bonus.
          </p>
        </div>
      </div>
    </RoleLayout>
  );
}
