import { useState } from 'react';
import { UltraLuxuryLayout } from '@/components/layout/UltraLuxuryLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserRoles } from '@/hooks/useUserRoles';
import { VALA_AI_IDENTITY } from '@/hooks/useValaAI';
import { 
  Brain, 
  Shield, 
  Activity, 
  Lock, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Server,
  Users,
  Zap,
  Eye,
  EyeOff,
  Download,
  FileText,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Clock,
  AlertOctagon,
  Target,
  BarChart3,
  HeartPulse,
  Cpu,
  ArrowUpRight,
  ArrowDownRight,
  Timer,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

// Types
interface InsightCard {
  id: string;
  title: string;
  description: string;
  confidence: number;
  type: 'positive' | 'attention' | 'risk';
  impact: 'low' | 'medium' | 'high';
  suggestedAction?: string;
  autoFixAvailable?: boolean;
}

interface DecisionSuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: 'low' | 'medium' | 'high';
  impact: string;
  confidence: number;
  status: 'pending' | 'approved' | 'delayed' | 'ignored';
}

export default function ValaAICeoInsights() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const [autoMode, setAutoMode] = useState(true);
  const [escalationLevel, setEscalationLevel] = useState<'ai' | 'boss'>('ai');
  const [reportFrequency, setReportFrequency] = useState<'daily' | 'weekly'>('daily');
  const [insightDepth, setInsightDepth] = useState<'brief' | 'deep'>('brief');
  const [showSilentRisks, setShowSilentRisks] = useState(false);

  // Mock data
  const [systemMetrics] = useState({
    systemHealth: 98.7,
    activeRisks: 3,
    revenueToday: 12450,
    revenueWeek: 87320,
    costLeakage: 234,
    demoSuccessRate: 73,
    productStability: 99.2
  });

  const [positiveInsights] = useState<InsightCard[]>([
    { id: 'POS-001', title: 'Server Uptime Excellent', description: '99.97% uptime maintained for 30 days straight. Zero unplanned downtime.', confidence: 99, type: 'positive', impact: 'high' },
    { id: 'POS-002', title: 'Demo Conversion Improved', description: 'Trial-to-paid conversion rate increased by 8% this week after AI optimizations.', confidence: 92, type: 'positive', impact: 'high' },
    { id: 'POS-003', title: 'Support Response Fast', description: 'Average first response time reduced to 4 minutes. SLA compliance at 100%.', confidence: 95, type: 'positive', impact: 'medium' },
  ]);

  const [attentionItems] = useState<InsightCard[]>([
    { id: 'ATT-001', title: 'API Rate Limits Approaching', description: 'External API usage at 78% of monthly quota. May need optimization.', confidence: 87, type: 'attention', impact: 'medium', suggestedAction: 'Enable request caching' },
    { id: 'ATT-002', title: 'Pending Security Reviews', description: '5 access requests pending approval for over 48 hours.', confidence: 100, type: 'attention', impact: 'high', suggestedAction: 'Review and approve/reject' },
  ]);

  const [silentRisks] = useState<InsightCard[]>([
    { id: 'RISK-001', title: 'Unusual Login Pattern Detected', description: 'Multiple failed login attempts from new geo-location. Not yet actionable.', confidence: 72, type: 'risk', impact: 'medium', autoFixAvailable: true },
    { id: 'RISK-002', title: 'Database Query Slowdown', description: 'Gradual 12% increase in average query time over 7 days. Early warning.', confidence: 68, type: 'risk', impact: 'low', autoFixAvailable: true },
    { id: 'RISK-003', title: 'Cost Creep in AI Services', description: 'Monthly AI cost trending 15% higher than last month at current pace.', confidence: 81, type: 'risk', impact: 'medium', autoFixAvailable: false },
  ]);

  const [decisions] = useState<DecisionSuggestion[]>([
    { id: 'DEC-001', title: 'Approve Server Scaling', description: 'Auto-scale cluster during peak hours to handle 2x traffic', category: 'Infrastructure', urgency: 'high', impact: '+23% performance', confidence: 94, status: 'pending' },
    { id: 'DEC-002', title: 'Enable Demo Auto-Follow-up', description: 'Send automated follow-up emails to trial users after 3 days', category: 'Marketing', urgency: 'medium', impact: '+15% conversion', confidence: 87, status: 'pending' },
    { id: 'DEC-003', title: 'Consolidate Night Servers', description: 'Reduce server instances by 40% during off-peak hours (12am-6am)', category: 'Cost', urgency: 'low', impact: '-$890/month', confidence: 91, status: 'pending' },
  ]);

  const handleDecision = (id: string, action: 'approve' | 'delay' | 'ignore') => {
    console.log(`Decision ${id}: ${action}`);
    // Would update state and send to backend
  };

  if (rolesLoading) {
    return (
      <UltraLuxuryLayout role="boss" variant="boss">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
        </div>
      </UltraLuxuryLayout>
    );
  }

  if (!isSuperAdmin()) {
    return (
      <UltraLuxuryLayout role="boss" variant="boss">
        <div className="flex items-center justify-center h-96">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <Lock className="h-12 w-12 mx-auto text-destructive mb-4" />
              <h2 className="text-xl font-bold">Access Denied</h2>
              <p className="text-muted-foreground mt-2">
                AI CEO Insights is restricted to Boss/Super Admin only.
              </p>
            </CardContent>
          </Card>
        </div>
      </UltraLuxuryLayout>
    );
  }

  return (
    <UltraLuxuryLayout role="boss" variant="boss">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {VALA_AI_IDENTITY.BADGE} AI CEO Insights
              </h1>
              <p className="text-muted-foreground">
                Executive Dashboard • Auto-generated • {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generated
            </Badge>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-background">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-1">
                <HeartPulse className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-emerald-400">+0.3%</span>
              </div>
              <p className="text-2xl font-bold">{systemMetrics.systemHealth}%</p>
              <p className="text-xs text-muted-foreground">System Health</p>
            </CardContent>
          </Card>

          <Card className="border-red-500/30 bg-gradient-to-br from-red-950/30 to-background">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-1">
                <AlertOctagon className="h-4 w-4 text-red-400" />
                <span className="text-xs text-red-400">Active</span>
              </div>
              <p className="text-2xl font-bold">{systemMetrics.activeRisks}</p>
              <p className="text-xs text-muted-foreground">Active Risks</p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/30 bg-gradient-to-br from-blue-950/30 to-background">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-1">
                <DollarSign className="h-4 w-4 text-blue-400" />
                <ArrowUpRight className="h-3 w-3 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold">${systemMetrics.revenueToday.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Revenue Today</p>
            </CardContent>
          </Card>

          <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 to-background">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-1">
                <BarChart3 className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-emerald-400">+12%</span>
              </div>
              <p className="text-2xl font-bold">${systemMetrics.revenueWeek.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Revenue Week</p>
            </CardContent>
          </Card>

          <Card className="border-amber-500/30 bg-gradient-to-br from-amber-950/30 to-background">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-1">
                <TrendingDown className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-amber-400">Detected</span>
              </div>
              <p className="text-2xl font-bold">${systemMetrics.costLeakage}</p>
              <p className="text-xs text-muted-foreground">Cost Leakage</p>
            </CardContent>
          </Card>

          <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 to-background">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-1">
                <Target className="h-4 w-4 text-cyan-400" />
                <span className="text-xs text-emerald-400">+8%</span>
              </div>
              <p className="text-2xl font-bold">{systemMetrics.demoSuccessRate}%</p>
              <p className="text-xs text-muted-foreground">Demo Success</p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-gradient-to-br from-purple-950/30 to-background">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-1">
                <Cpu className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-emerald-400">Stable</span>
              </div>
              <p className="text-2xl font-bold">{systemMetrics.productStability}%</p>
              <p className="text-xs text-muted-foreground">Product Stability</p>
            </CardContent>
          </Card>
        </div>

        {/* Insight Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* What's Going Right */}
          <Card className="border-emerald-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-emerald-500">
                <CheckCircle2 className="h-5 w-5" />
                What's Going Right
              </CardTitle>
              <CardDescription>AI-generated positive indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                <div className="space-y-3">
                  {positiveInsights.map((insight) => (
                    <div key={insight.id} className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/30">
                          {insight.confidence}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* What Needs Attention */}
          <Card className="border-amber-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-amber-500">
                <AlertTriangle className="h-5 w-5" />
                What Needs Attention
              </CardTitle>
              <CardDescription>Red / Amber issues with suggested actions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                <div className="space-y-3">
                  {attentionItems.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <Badge 
                          variant={item.impact === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {item.impact.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                      {item.suggestedAction && (
                        <div className="flex items-center gap-2 pt-2 border-t border-amber-500/20">
                          <Zap className="h-3 w-3 text-amber-500" />
                          <span className="text-xs text-amber-500">{item.suggestedAction}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Silent Risks */}
          <Card className="border-red-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <EyeOff className="h-5 w-5" />
                  Silent Risks (Hidden)
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowSilentRisks(!showSilentRisks)}
                >
                  {showSilentRisks ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <CardDescription>Detected but not yet visible to users</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                {showSilentRisks ? (
                  <div className="space-y-3">
                    {silentRisks.map((risk) => (
                      <div key={risk.id} className="p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{risk.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {risk.confidence}% conf.
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{risk.description}</p>
                        {risk.autoFixAvailable && (
                          <div className="flex items-center justify-between pt-2 border-t border-red-500/20">
                            <span className="text-xs text-muted-foreground">Auto-fix available</span>
                            <Switch />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                    <Shield className="h-12 w-12 mb-3 opacity-30" />
                    <p className="text-sm">Hidden for security</p>
                    <p className="text-xs">Click eye icon to reveal</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Decision Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Decision Suggestions
            </CardTitle>
            <CardDescription>One-click approval • Auto-execute after Boss approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {decisions.map((decision) => (
                <div key={decision.id} className="p-4 rounded-lg border bg-muted/20 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{decision.category}</Badge>
                        <Badge 
                          variant={decision.urgency === 'high' ? 'destructive' : decision.urgency === 'medium' ? 'default' : 'secondary'}
                          className={decision.urgency === 'high' ? '' : decision.urgency === 'medium' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                        >
                          {decision.urgency.toUpperCase()} URGENCY
                        </Badge>
                      </div>
                      <h4 className="font-semibold mb-1">{decision.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{decision.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-emerald-500">
                          <ArrowUpRight className="h-3 w-3" />
                          Impact: {decision.impact}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Target className="h-3 w-3" />
                          {decision.confidence}% confidence
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button 
                        size="sm" 
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleDecision(decision.id, 'approve')}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDecision(decision.id, 'delay')}
                      >
                        <Clock className="h-3 w-3 mr-1" /> Delay
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-muted-foreground"
                        onClick={() => handleDecision(decision.id, 'ignore')}
                      >
                        <XCircle className="h-3 w-3 mr-1" /> Ignore
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily/Weekly Report & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {reportFrequency === 'daily' ? 'Daily' : 'Weekly'} Executive Report
              </CardTitle>
              <CardDescription>Auto-generated CEO-style summary • No technical jargon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-muted/30 border space-y-3 text-sm">
                <p>
                  <strong>Overview:</strong> Your system is performing excellently today. 
                  Revenue is up 12% compared to last week, and all critical services are stable.
                </p>
                <p>
                  <strong>Wins:</strong> Server uptime remains at 99.97%, demo conversions improved by 8%, 
                  and support response times are at an all-time low of 4 minutes.
                </p>
                <p>
                  <strong>Watch:</strong> API usage is approaching monthly limits. Consider enabling 
                  caching to extend quota. 5 access requests need your attention.
                </p>
                <p>
                  <strong>Recommendation:</strong> Approve the server scaling decision to handle 
                  anticipated peak traffic this weekend.
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" /> View Full Report
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Controls
              </CardTitle>
              <CardDescription>Configure AI CEO behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Mode</p>
                  <p className="text-xs text-muted-foreground">Allow AI to auto-execute low-risk decisions</p>
                </div>
                <Switch checked={autoMode} onCheckedChange={setAutoMode} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Escalation Level</p>
                  <p className="text-xs text-muted-foreground">Who handles medium-risk decisions</p>
                </div>
                <Select value={escalationLevel} onValueChange={(v: 'ai' | 'boss') => setEscalationLevel(v)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai">AI First</SelectItem>
                    <SelectItem value="boss">Boss Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Report Frequency</p>
                  <p className="text-xs text-muted-foreground">How often to generate reports</p>
                </div>
                <Select value={reportFrequency} onValueChange={(v: 'daily' | 'weekly') => setReportFrequency(v)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Insight Depth</p>
                  <p className="text-xs text-muted-foreground">Level of detail in insights</p>
                </div>
                <Select value={insightDepth} onValueChange={(v: 'brief' | 'deep') => setInsightDepth(v)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brief">Brief</SelectItem>
                    <SelectItem value="deep">Deep</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Footer */}
        <Card className="border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-background to-purple-950/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-purple-400" />
                <span className="text-sm text-muted-foreground">
                  Read-only by default • No manual edits • Logged to audit trail • Black-box AI reasoning
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                Boss + VALA AI Only
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </UltraLuxuryLayout>
  );
}

// Settings icon component for CardTitle
const Settings = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);