import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Bot,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

interface FraudCheckProps {
  trafficScore?: number;
  followerQuality?: number;
  engagementRate?: number;
  botPercentage?: number;
  lastScan?: string;
  alerts?: { type: string; message: string }[];
}

export function InfluencerFraudAlert({
  trafficScore = 94,
  followerQuality = 92,
  engagementRate = 4.5,
  botPercentage = 2,
  lastScan = 'Jan 5, 2026',
  alerts = []
}: FraudCheckProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'emerald';
    if (score >= 70) return 'amber';
    return 'red';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Traffic & Fraud Monitoring
        </CardTitle>
        <CardDescription>Automated quality checks on your audience and engagement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className={`p-4 rounded-lg border bg-${getScoreColor(trafficScore)}-500/10 border-${getScoreColor(trafficScore)}-500/30`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-lg bg-${getScoreColor(trafficScore)}-500/20 flex items-center justify-center`}>
                <Activity className={`h-6 w-6 text-${getScoreColor(trafficScore)}-500`} />
              </div>
              <div>
                <p className="font-semibold">Traffic Quality Score</p>
                <p className="text-xs text-muted-foreground">Last scan: {lastScan}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold text-${getScoreColor(trafficScore)}-500`}>{trafficScore}</p>
              <Badge variant="outline" className={`bg-${getScoreColor(trafficScore)}-500/20 text-${getScoreColor(trafficScore)}-400 border-${getScoreColor(trafficScore)}-500/30`}>
                {trafficScore >= 90 ? 'Excellent' : trafficScore >= 70 ? 'Good' : 'Needs Review'}
              </Badge>
            </div>
          </div>
          <Progress value={trafficScore} className="h-2" />
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Follower Quality</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{followerQuality}%</p>
              <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Real, active followers</p>
          </div>

          <div className="p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-violet-500" />
              <span className="text-sm text-muted-foreground">Engagement Rate</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{engagementRate}%</p>
              <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                Above Avg
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Industry avg: 2.5%</p>
          </div>

          <div className="p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Bot Detection</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{botPercentage}%</p>
              <Badge variant="outline" className={
                botPercentage < 5 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }>
                {botPercentage < 5 ? 'Clean' : 'Warning'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Threshold: &lt;5%</p>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
            {alerts.map((alert, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{alert.type}</p>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Notice */}
        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <p className="text-sm text-cyan-400">
            <strong>How it works:</strong> Our system automatically scans your linked social accounts 
            for bot activity, fake followers, and engagement manipulation. Low scores may result in 
            payout holds and bonus restrictions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
