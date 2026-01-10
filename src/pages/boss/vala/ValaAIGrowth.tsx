import { useState } from 'react';
import { UltraLuxuryLayout } from '@/components/layout/UltraLuxuryLayout';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useUserRoles } from '@/hooks/useUserRoles';
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Target,
  Shield,
  Play,
  Calendar,
  XCircle,
  Package,
  Megaphone,
  Server,
  AlertTriangle,
  Bot,
  Percent,
  Clock,
  CheckCircle2,
  Lock,
  FileText,
  RotateCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface GrowthRecommendation {
  id: string;
  area: 'product' | 'demo' | 'pricing' | 'infrastructure' | 'marketing';
  priority: 'high' | 'medium' | 'low';
  aiInsight: string;
  expectedImpact: number;
  timeToResult: string;
  confidenceLevel: number;
  status: 'pending' | 'applied' | 'scheduled' | 'ignored';
  riskNote: string | null;
}

const mockRecommendations: GrowthRecommendation[] = [
  {
    id: 'GROW-001',
    area: 'demo',
    priority: 'high',
    aiInsight: 'Demo conversion rate is 34% below benchmark. Simplifying the onboarding flow from 7 steps to 4 could recover 2,400 users monthly.',
    expectedImpact: 28,
    timeToResult: '2-3 weeks',
    confidenceLevel: 92,
    status: 'pending',
    riskNote: null
  },
  {
    id: 'GROW-002',
    area: 'pricing',
    priority: 'high',
    aiInsight: '18% of Pro users hit usage limits monthly. Adding Enterprise tier at $299/mo could capture $120K additional ARR with minimal churn risk.',
    expectedImpact: 34,
    timeToResult: '4-6 weeks',
    confidenceLevel: 85,
    status: 'pending',
    riskNote: 'Requires pricing page update'
  },
  {
    id: 'GROW-003',
    area: 'infrastructure',
    priority: 'medium',
    aiInsight: 'Detected 3 oversized instances and 12 unused resources. Rightsizing could reduce cloud costs by ₹4.2L/month without performance impact.',
    expectedImpact: 18,
    timeToResult: '1 week',
    confidenceLevel: 96,
    status: 'pending',
    riskNote: null
  },
  {
    id: 'GROW-004',
    area: 'product',
    priority: 'high',
    aiInsight: 'SSO feature requested in 45% of enterprise RFPs. Missing feature causes 23% deal loss. Adding SSO could unlock $180K pipeline.',
    expectedImpact: 42,
    timeToResult: '6-8 weeks',
    confidenceLevel: 91,
    status: 'scheduled',
    riskNote: 'Dev team capacity needed'
  },
  {
    id: 'GROW-005',
    area: 'marketing',
    priority: 'medium',
    aiInsight: '2,100 users started demos but did not complete. Email retargeting campaign could recover 15% at low cost.',
    expectedImpact: 12,
    timeToResult: '1-2 weeks',
    confidenceLevel: 78,
    status: 'pending',
    riskNote: null
  },
  {
    id: 'GROW-006',
    area: 'demo',
    priority: 'low',
    aiInsight: 'Legacy CRM v1 demo has 0.3% conversion vs 8.2% platform average. Retiring it saves $800/mo maintenance and focuses user attention.',
    expectedImpact: 8,
    timeToResult: '3 days',
    confidenceLevel: 88,
    status: 'pending',
    riskNote: null
  },
  {
    id: 'GROW-007',
    area: 'product',
    priority: 'medium',
    aiInsight: 'Users who complete interactive walkthrough have 4.2x higher retention. Current completion rate is only 38%. Gamification could double it.',
    expectedImpact: 24,
    timeToResult: '3-4 weeks',
    confidenceLevel: 87,
    status: 'pending',
    riskNote: null
  },
  {
    id: 'GROW-008',
    area: 'infrastructure',
    priority: 'low',
    aiInsight: 'APAC users experience 340ms latency vs 45ms US. Adding Singapore region could reduce churn by 12% in that market.',
    expectedImpact: 15,
    timeToResult: '8-10 weeks',
    confidenceLevel: 82,
    status: 'ignored',
    riskNote: 'High initial investment'
  }
];

export default function ValaAIGrowth() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const [recommendations, setRecommendations] = useState<GrowthRecommendation[]>(mockRecommendations);

  if (rolesLoading) {
    return (
      <UltraLuxuryLayout role="boss" variant="boss">
        <div className="space-y-6 p-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
          <Skeleton className="h-[500px]" />
        </div>
      </UltraLuxuryLayout>
    );
  }

  if (!isSuperAdmin()) {
    return (
      <UltraLuxuryLayout role="boss" variant="boss">
        <div className="flex items-center justify-center h-96">
          <Card className="bg-card/50 border-destructive/50 p-8 text-center">
            <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">VALA AI Growth is restricted to Super Admins only.</p>
          </Card>
        </div>
      </UltraLuxuryLayout>
    );
  }

  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'product': return <Package className="h-4 w-4" />;
      case 'demo': return <Target className="h-4 w-4" />;
      case 'pricing': return <DollarSign className="h-4 w-4" />;
      case 'marketing': return <Megaphone className="h-4 w-4" />;
      case 'infrastructure': return <Server className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'product': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'demo': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'pricing': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'marketing': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'infrastructure': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const growthScore = Math.round(
    recommendations.filter(r => r.status !== 'ignored').reduce((sum, r) => sum + r.confidenceLevel, 0) / 
    recommendations.filter(r => r.status !== 'ignored').length
  );

  const totalRevenueOpportunity = recommendations
    .filter(r => r.status !== 'ignored')
    .reduce((sum, r) => sum + r.expectedImpact * 1000, 0);

  const costOptimization = recommendations
    .filter(r => r.area === 'infrastructure' && r.status !== 'ignored')
    .reduce((sum, r) => sum + r.expectedImpact * 500, 0);

  const highRiskCount = recommendations.filter(r => r.riskNote !== null).length;
  const overallRisk = highRiskCount <= 2 ? 'Low' : highRiskCount <= 4 ? 'Medium' : 'High';
  const riskColor = overallRisk === 'Low' ? 'text-emerald-400' : overallRisk === 'Medium' ? 'text-amber-400' : 'text-red-400';

  const handleApplyNow = (id: string) => {
    setRecommendations(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'applied' as const } : r
    ));
  };

  const handleSchedule = (id: string) => {
    setRecommendations(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'scheduled' as const } : r
    ));
  };

  const handleIgnore = (id: string) => {
    setRecommendations(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'ignored' as const } : r
    ));
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount}`;
  };

  return (
    <UltraLuxuryLayout role="boss" variant="boss">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard/boss/vala">
                <Button variant="ghost" size="sm" className="gap-2 text-emerald-400 hover:text-emerald-300">
                  <ArrowLeft className="h-4 w-4" />
                  Back to VALA AI
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Growth Recommendations</h1>
                  <p className="text-xs text-muted-foreground">AI-driven • Data-backed • Business-focused</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 gap-1">
                <Bot className="h-3 w-3" />
                AI Analysis Active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* TOP SUMMARY STRIP */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Growth Score</p>
                  <p className="text-2xl font-bold text-emerald-400">{growthScore}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <Percent className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              <Progress value={growthScore} className="h-1.5 mt-3" />
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Revenue Opportunity</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenueOpportunity)}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <DollarSign className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Annual potential</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Cost Optimization</p>
                  <p className="text-2xl font-bold text-cyan-400">{formatCurrency(costOptimization)}</p>
                </div>
                <div className="p-3 rounded-lg bg-cyan-500/10">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Savings potential</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Risk Level</p>
                  <p className={`text-2xl font-bold ${riskColor}`}>{overallRisk}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{highRiskCount} items with notes</p>
            </CardContent>
          </Card>
        </div>

        {/* RECOMMENDATION CARDS */}
        <ScrollArea className="h-[calc(100vh-340px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pr-4">
            {recommendations.map(rec => (
              <Card 
                key={rec.id}
                className={`bg-card/50 border-border/50 hover:border-primary/30 transition-all ${
                  rec.status === 'ignored' ? 'opacity-50' : ''
                }`}
              >
                {/* CARD HEADER */}
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{rec.id}</span>
                      <Badge variant="outline" className={`text-[10px] ${getAreaColor(rec.area)}`}>
                        {getAreaIcon(rec.area)}
                        <span className="ml-1">{rec.area.charAt(0).toUpperCase() + rec.area.slice(1)}</span>
                      </Badge>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${getPriorityColor(rec.priority)}`}>
                      {rec.priority.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>

                {/* CARD BODY */}
                <CardContent className="space-y-4">
                  {/* AI Insight (Plain English) */}
                  <div className="flex gap-2">
                    <Bot className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground leading-relaxed">{rec.aiInsight}</p>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="text-center p-2 rounded-lg bg-muted/30">
                      <TrendingUp className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Impact</p>
                      <p className="text-sm font-bold text-foreground">+{rec.expectedImpact}%</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/30">
                      <Clock className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-bold text-foreground">{rec.timeToResult}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/30">
                      <Percent className="h-4 w-4 text-purple-400 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <p className="text-sm font-bold text-foreground">{rec.confidenceLevel}%</p>
                    </div>
                  </div>
                </CardContent>

                {/* CARD FOOTER */}
                <CardFooter className="flex flex-col gap-3 pt-3 border-t border-border/30">
                  {/* Risk Note */}
                  {rec.riskNote && (
                    <div className="flex items-center gap-2 w-full text-amber-400 text-xs">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{rec.riskNote}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 w-full">
                    {rec.status === 'pending' ? (
                      <>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30"
                          onClick={() => handleApplyNow(rec.id)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Apply Now
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleSchedule(rec.id)}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-muted-foreground hover:text-red-400"
                          onClick={() => handleIgnore(rec.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        {rec.status === 'applied' && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Applied
                          </Badge>
                        )}
                        {rec.status === 'scheduled' && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 gap-1">
                            <Calendar className="h-3 w-3" />
                            Scheduled
                          </Badge>
                        )}
                        {rec.status === 'ignored' && (
                          <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 gap-1">
                            <XCircle className="h-3 w-3" />
                            Ignored (Logged)
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* SECURITY & CONTROL FOOTER */}
        <Card className="bg-card/30 border-border/30">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-emerald-400" />
                  <span>No manual edits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3 w-3 text-blue-400" />
                  <span>Full audit trail</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="h-3 w-3 text-purple-400" />
                  <span>Rollback available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-amber-400" />
                  <span>Boss override required</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] bg-muted/30">
                  AI suggests only • Execution requires approval
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UltraLuxuryLayout>
  );
}
