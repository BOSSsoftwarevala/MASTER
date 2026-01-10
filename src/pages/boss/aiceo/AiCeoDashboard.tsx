import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useSystemHealth, useBusinessMetrics, useAiSuggestions, useRiskIndicators } from '@/hooks/useAiCeoData';
import { RealTimeRefresh, DataSourceBadge } from '@/components/boss/RealTimeRefresh';
import { SystemHealthHeartbeat } from '@/components/boss/SystemHealthHeartbeat';
import { GlobalEventTimeline } from '@/components/boss/GlobalEventTimeline';
import {
  Brain,
  Activity,
  TrendingUp,
  Shield,
  AlertTriangle,
  DollarSign,
  Lightbulb,
  Eye,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  ArrowRight,
  ScrollText,
} from 'lucide-react';

export default function AiCeoDashboard() {
  const navigate = useNavigate();
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { data: health, isLoading: healthLoading } = useSystemHealth();
  const { data: business, isLoading: businessLoading } = useBusinessMetrics();
  const { data: suggestions, isLoading: suggestionsLoading } = useAiSuggestions('pending');
  const { data: risks, isLoading: risksLoading } = useRiskIndicators();

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isSuperAdmin) {
    return (
      <DashboardLayout>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>AI CEO is restricted to Super Admins only.</CardDescription>
          </CardHeader>
        </Card>
      </DashboardLayout>
    );
  }

  const unresolvedRisks = risks?.filter(r => !r.resolved) || [];
  const highRisks = unresolvedRisks.filter(r => r.severity === 'high' || r.severity === 'critical');

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const [lastUpdate] = useState(new Date());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* System Health Heartbeat - Always Visible */}
        <SystemHealthHeartbeat />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
              <Brain className="h-8 w-8 text-violet-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI CEO Dashboard</h1>
              <p className="text-muted-foreground">System Brain • Autonomous Supervision</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RealTimeRefresh 
              lastUpdate={lastUpdate}
              onRefresh={() => window.location.reload()}
              dataSource="AI"
            />
            <Badge variant="outline" className="text-violet-500 border-violet-500/50">
              <Activity className="h-3 w-3 mr-1" />
              AI Active
            </Badge>
          </div>
        </div>

        {/* AI Notice Banner */}
        <Card className="bg-violet-500/10 border-violet-500/30">
          <CardContent className="py-3 flex items-center gap-3">
            <Shield className="h-5 w-5 text-violet-500" />
            <p className="text-sm text-[hsl(var(--boss-text))]">
              <strong>AI CEO observes, analyzes, and suggests only.</strong> All actions require your explicit approval.
            </p>
          </CardContent>
        </Card>

        {/* Main Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* System Health Score */}
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-border))]">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-[hsl(var(--boss-muted))]">
                <Activity className="h-4 w-4" />
                System Health
              </CardDescription>
            </CardHeader>
            <CardContent>
              {healthLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <>
                  <div className={`text-3xl font-bold ${getHealthColor(health?.healthScore || 0)}`}>
                    {health?.healthScore || 0}%
                  </div>
                  <Progress value={health?.healthScore} className="mt-2 h-2" />
                </>
              )}
            </CardContent>
          </Card>

          {/* Revenue vs Burn */}
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-border))]">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-[hsl(var(--boss-muted))]">
                <DollarSign className="h-4 w-4" />
                Revenue / Burn
              </CardDescription>
            </CardHeader>
            <CardContent>
              {businessLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-500">
                    ${((business?.totalRevenue || 0) / 1000).toFixed(0)}K
                  </div>
                  <p className="text-xs text-[hsl(var(--boss-muted))]">
                    Burn: ${((business?.monthlyBurn || 0) / 1000).toFixed(0)}K/mo
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Risk Level */}
          <Card className={`bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-border))] ${highRisks.length > 0 ? 'border-red-500/50' : ''}`}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-[hsl(var(--boss-muted))]">
                <AlertTriangle className="h-4 w-4" />
                Risk Level
              </CardDescription>
            </CardHeader>
            <CardContent>
              {risksLoading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <>
                  <div className={`text-2xl font-bold ${highRisks.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {highRisks.length > 0 ? 'HIGH' : unresolvedRisks.length > 0 ? 'MEDIUM' : 'LOW'}
                  </div>
                  <p className="text-xs text-[hsl(var(--boss-muted))]">
                    {unresolvedRisks.length} active {unresolvedRisks.length === 1 ? 'risk' : 'risks'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Pending Decisions */}
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-border))]">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-[hsl(var(--boss-muted))]">
                <Lightbulb className="h-4 w-4" />
                Pending Decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {suggestionsLoading ? (
                <Skeleton className="h-10 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-amber-500">
                    {suggestions?.length || 0}
                  </div>
                  <p className="text-xs text-[hsl(var(--boss-muted))]">Awaiting your approval</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* AI Confidence */}
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-border))]">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-[hsl(var(--boss-muted))]">
                <Brain className="h-4 w-4" />
                AI Confidence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet-500">87%</div>
              <p className="text-xs text-[hsl(var(--boss-muted))]">Prediction accuracy</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card 
            className="cursor-pointer hover:border-violet-500/50 transition-colors bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-border))]"
            onClick={() => navigate('/dashboard/boss/ai-ceo/suggestions')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                View Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[hsl(var(--boss-muted))] mb-3">
                Review AI recommendations for scaling, budget, and security.
              </p>
              <Button variant="outline" size="sm" className="w-full border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))] hover:bg-[hsl(var(--boss-accent))]">
                Open <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-red-500/50 transition-colors bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-border))]"
            onClick={() => navigate('/dashboard/boss/ai-ceo/risks')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                View Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[hsl(var(--boss-muted))] mb-3">
                Monitor detected anomalies and security threats.
              </p>
              <Button variant="outline" size="sm" className="w-full border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))] hover:bg-[hsl(var(--boss-accent))]">
                Open <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-blue-500/50 transition-colors bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-border))]"
            onClick={() => navigate('/dashboard/boss/ai-ceo/predictions')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                View Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[hsl(var(--boss-muted))] mb-3">
                Forecasts for revenue, load, leads, and risk.
              </p>
              <Button variant="outline" size="sm" className="w-full border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))] hover:bg-[hsl(var(--boss-accent))]">
                Open <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-green-500/50 transition-colors bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-border))]"
            onClick={() => navigate('/dashboard/boss/ai-ceo/business')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Business Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[hsl(var(--boss-muted))] mb-3">
                Revenue trends, cost analysis, and performance.
              </p>
              <Button variant="outline" size="sm" className="w-full border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))] hover:bg-[hsl(var(--boss-accent))]">
                Open <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Second Row of Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card 
            className="cursor-pointer hover:border-cyan-500/50 transition-colors bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-border))]"
            onClick={() => navigate('/dashboard/boss/ai-ceo/monitor')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <Eye className="h-5 w-5 text-cyan-500" />
                System Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[hsl(var(--boss-muted))] mb-3">
                Real-time server, deployment, and API health.
              </p>
              <Button variant="outline" size="sm" className="w-full border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))] hover:bg-[hsl(var(--boss-accent))]">
                Open <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-purple-500/50 transition-colors bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-border))]"
            onClick={() => navigate('/dashboard/boss/ai-ceo/decisions')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <ScrollText className="h-5 w-5 text-purple-500" />
                Decision Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[hsl(var(--boss-muted))] mb-3">
                Historical record of AI suggestions and actions.
              </p>
              <Button variant="outline" size="sm" className="w-full border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))] hover:bg-[hsl(var(--boss-accent))]">
                Open <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-indigo-500/50 transition-colors bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-border))]"
            onClick={() => navigate('/dashboard/boss/aiapi')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <Activity className="h-5 w-5 text-indigo-500" />
                AI/API Manager
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[hsl(var(--boss-muted))] mb-3">
                Manage AI services, providers, and costs.
              </p>
              <Button variant="outline" size="sm" className="w-full border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))] hover:bg-[hsl(var(--boss-accent))]">
                Open <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Latest Suggestions */}
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-border))]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Latest AI Suggestions
              </CardTitle>
              <CardDescription className="text-[hsl(var(--boss-muted))]">Pending decisions requiring your approval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestionsLoading ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)
              ) : suggestions?.length === 0 ? (
                <p className="text-sm text-[hsl(var(--boss-muted))] text-center py-4">
                  No pending suggestions. All caught up!
                </p>
              ) : (
                suggestions?.slice(0, 3).map(suggestion => (
                  <div key={suggestion.id} className="flex items-start gap-3 p-3 rounded-lg bg-[hsl(var(--boss-accent))]">
                    <div className={`p-2 rounded-lg ${
                      suggestion.impact_level === 'high' 
                        ? 'bg-red-500/20 text-red-500' 
                        : 'bg-amber-500/20 text-amber-500'
                    }`}>
                      <Lightbulb className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-[hsl(var(--boss-text))]">{suggestion.title}</h4>
                      <p className="text-xs text-[hsl(var(--boss-muted))] truncate">{suggestion.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs border-[hsl(var(--boss-border))] text-[hsl(var(--boss-muted))]">
                          {Math.round(suggestion.confidence_score * 100)}% confident
                        </Badge>
                        <span className="text-xs text-[hsl(var(--boss-muted))] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(suggestion.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {(suggestions?.length || 0) > 0 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-[hsl(var(--boss-muted))] hover:text-[hsl(var(--boss-text))] hover:bg-[hsl(var(--boss-accent))]" 
                  onClick={() => navigate('/dashboard/boss/ai-ceo/suggestions')}
                >
                  View All Suggestions
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Active Risks */}
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-border))]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-[hsl(var(--boss-text))]">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Active Risk Alerts
              </CardTitle>
              <CardDescription className="text-[hsl(var(--boss-muted))]">Anomalies and threats detected by AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {risksLoading ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)
              ) : unresolvedRisks.length === 0 ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-[hsl(var(--boss-muted))]">No active risks detected</p>
                </div>
              ) : (
                unresolvedRisks.slice(0, 3).map(risk => (
                  <div key={risk.id} className="flex items-start gap-3 p-3 rounded-lg bg-[hsl(var(--boss-accent))]">
                    <div className={`p-2 rounded-lg ${
                      risk.severity === 'critical' || risk.severity === 'high'
                        ? 'bg-red-500/20 text-red-500'
                        : risk.severity === 'medium'
                        ? 'bg-amber-500/20 text-amber-500'
                        : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-[hsl(var(--boss-text))]">{risk.title}</h4>
                      <p className="text-xs text-[hsl(var(--boss-muted))] truncate">{risk.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getRiskBadgeVariant(risk.severity)} className="text-xs capitalize">
                          {risk.severity}
                        </Badge>
                        <span className="text-xs text-[hsl(var(--boss-muted))] capitalize">{risk.type}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {unresolvedRisks.length > 0 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-[hsl(var(--boss-muted))] hover:text-[hsl(var(--boss-text))] hover:bg-[hsl(var(--boss-accent))]" 
                  onClick={() => navigate('/dashboard/boss/ai-ceo/risks')}
                >
                  View All Risks
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Global Event Timeline */}
        <GlobalEventTimeline />
      </div>
    </DashboardLayout>
  );
}
