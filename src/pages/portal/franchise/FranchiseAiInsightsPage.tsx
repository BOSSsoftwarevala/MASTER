import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  DollarSign, 
  MapPin,
  Lightbulb,
  Target,
  BarChart3,
  RefreshCw
} from 'lucide-react';

const aiScores = [
  { 
    type: 'Territory Health', 
    score: 85, 
    trend: 'up', 
    factors: ['Strong lead flow', 'Good conversion rate', 'Active resellers'],
    recommendation: 'Consider expanding to adjacent areas for growth'
  },
  { 
    type: 'ROI Prediction', 
    score: 78, 
    trend: 'stable', 
    factors: ['Ad spend efficiency', 'Cost per lead', 'Commission margins'],
    recommendation: 'Optimize Google Ads targeting for better ROI'
  },
  { 
    type: 'Budget Efficiency', 
    score: 92, 
    trend: 'up', 
    factors: ['Under budget', 'High conversion value', 'Low waste'],
    recommendation: 'Budget utilization is optimal, maintain current strategy'
  },
];

const recommendations = [
  {
    id: 1,
    title: 'Increase Facebook Ad Budget',
    description: 'AI predicts 23% higher conversions with +$500/month budget',
    impact: 'high',
    confidence: 87,
  },
  {
    id: 2,
    title: 'Focus on Enterprise Leads',
    description: 'Enterprise leads show 2.5x higher LTV in your territory',
    impact: 'medium',
    confidence: 79,
  },
  {
    id: 3,
    title: 'Onboard 2 More Resellers',
    description: 'Coverage gaps detected in downtown area',
    impact: 'high',
    confidence: 91,
  },
  {
    id: 4,
    title: 'Schedule More Follow-ups',
    description: 'Leads contacted within 4 hours convert 40% more',
    impact: 'medium',
    confidence: 85,
  },
];

export default function FranchiseAiInsightsPage() {
  return (
    <RoleLayout role="franchise">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Insights & Predictions</h1>
            <p className="text-muted-foreground">AI-powered analysis and recommendations for your franchise</p>
          </div>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>

        {/* AI Scores */}
        <div className="grid gap-4 md:grid-cols-3">
          {aiScores.map((score, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{score.type}</CardTitle>
                  <Badge variant="outline" className={
                    score.trend === 'up' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                  }>
                    {score.trend === 'up' ? '↑ Improving' : '→ Stable'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl font-bold">{score.score}</div>
                  <Progress value={score.score} className="flex-1 h-3" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Key Factors:</p>
                  <div className="flex flex-wrap gap-1">
                    {score.factors.map((factor, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-primary/10">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                    <p className="text-xs">{score.recommendation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Recommendations
            </CardTitle>
            <CardDescription>
              Actionable insights generated from your franchise data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-start justify-between p-4 rounded-lg border">
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      rec.impact === 'high' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
                    }`}>
                      {rec.impact === 'high' ? (
                        <TrendingUp className={`h-5 w-5 ${rec.impact === 'high' ? 'text-emerald-500' : 'text-blue-500'}`} />
                      ) : (
                        <Target className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{rec.title}</p>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={
                      rec.impact === 'high' 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }>
                      {rec.impact} impact
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {rec.confidence}% confidence
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Predictive Analytics */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next Month</span>
                  <span className="font-medium">$92,000 - $98,000</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next Quarter</span>
                  <span className="font-medium">$280,000 - $310,000</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Based on historical data and current trends
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Territory Expansion Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-6">
                  <div className="text-5xl font-bold text-emerald-500 mb-2">8.2</div>
                  <p className="text-sm text-muted-foreground">Ready for Expansion</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 rounded bg-muted/50">
                    <p className="text-muted-foreground">Market Saturation</p>
                    <p className="font-medium">42%</p>
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    <p className="text-muted-foreground">Growth Potential</p>
                    <p className="font-medium">High</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <p className="text-sm text-amber-400">
            <strong>Note:</strong> AI insights are suggestions only and do not auto-execute. 
            All actions require your approval before implementation.
          </p>
        </div>
      </div>
    </RoleLayout>
  );
}
