import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Trophy,
  Medal,
  TrendingUp,
  Target,
  DollarSign
} from 'lucide-react';

const leaderboard = [
  { rank: 1, name: 'Sarah Kim', conversions: 24, earnings: 9600, tier: 'Platinum', change: 0 },
  { rank: 2, name: 'Mike Johnson', conversions: 21, earnings: 8400, tier: 'Platinum', change: 1 },
  { rank: 3, name: 'Emily Brown', conversions: 19, earnings: 7600, tier: 'Gold', change: -1 },
  { rank: 4, name: 'David Lee', conversions: 15, earnings: 6000, tier: 'Gold', change: 2 },
  { rank: 5, name: 'You', conversions: 12, earnings: 4800, tier: 'Gold', change: 0, isCurrentUser: true },
  { rank: 6, name: 'Lisa Chen', conversions: 11, earnings: 4400, tier: 'Silver', change: -2 },
  { rank: 7, name: 'Robert Kim', conversions: 10, earnings: 4000, tier: 'Silver', change: 1 },
  { rank: 8, name: 'Anna Davis', conversions: 9, earnings: 3600, tier: 'Silver', change: 0 },
  { rank: 9, name: 'James Wilson', conversions: 8, earnings: 3200, tier: 'Bronze', change: 3 },
  { rank: 10, name: 'Maria Garcia', conversions: 7, earnings: 2800, tier: 'Bronze', change: -1 },
];

const yourStats = {
  rank: 5,
  totalResellers: 142,
  percentile: 96.5,
  conversions: 12,
  earnings: 4800,
  tier: 'Gold',
};

export default function ResellerLeaderboardPage() {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-amber-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return null;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
      case 'Gold': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Silver': return 'bg-slate-400/20 text-slate-400 border-slate-400/30';
      default: return 'bg-amber-700/20 text-amber-700 border-amber-700/30';
    }
  };

  return (
    <RoleLayout role="reseller">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rank Board</h1>
            <p className="text-muted-foreground">See how you compare to other resellers</p>
          </div>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Award className="h-3 w-3 mr-1" />
            Top {100 - yourStats.percentile}%
          </Badge>
        </div>

        {/* Your Position */}
        <Card className="border-blue-500/30 bg-blue-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Award className="h-5 w-5" />
              Your Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Rank</p>
                <p className="text-3xl font-bold">#{yourStats.rank}</p>
                <p className="text-xs text-muted-foreground">of {yourStats.totalResellers} resellers</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversions</p>
                <p className="text-3xl font-bold">{yourStats.conversions}</p>
                <p className="text-xs text-muted-foreground">this month</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Earnings</p>
                <p className="text-3xl font-bold">${yourStats.earnings.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">this month</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Tier</p>
                <Badge variant="outline" className={`mt-2 ${getTierColor(yourStats.tier)}`}>
                  {yourStats.tier}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Monthly Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div 
                  key={entry.rank} 
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    entry.isCurrentUser 
                      ? 'bg-blue-500/20 border border-blue-500/30' 
                      : 'bg-muted/50 hover:bg-muted/80 transition-colors'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      entry.rank === 1 ? 'bg-amber-500 text-white' :
                      entry.rank === 2 ? 'bg-slate-400 text-white' :
                      entry.rank === 3 ? 'bg-amber-700 text-white' :
                      'bg-muted-foreground/20'
                    }`}>
                      {getRankIcon(entry.rank) || entry.rank}
                    </div>
                    <div>
                      <span className={`font-medium ${entry.isCurrentUser ? 'text-blue-400' : ''}`}>
                        {entry.name}
                      </span>
                      <Badge variant="outline" className={`ml-2 ${getTierColor(entry.tier)}`}>
                        {entry.tier}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <Target className="h-3 w-3 text-muted-foreground" />
                        <span>{entry.conversions} sales</span>
                      </div>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span>${entry.earnings.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="min-w-[40px] text-right">
                      {entry.change !== 0 && (
                        <span className={`text-sm ${entry.change > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {entry.change > 0 ? `↑${entry.change}` : `↓${Math.abs(entry.change)}`}
                        </span>
                      )}
                      {entry.change === 0 && (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-sm text-blue-400">
            <strong>AI Tip:</strong> You're only 3 conversions away from rank #4! 
            Focus on your hottest leads to climb the leaderboard.
          </p>
        </div>
      </div>
    </RoleLayout>
  );
}
