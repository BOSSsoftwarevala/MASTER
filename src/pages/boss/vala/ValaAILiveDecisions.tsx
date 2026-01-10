import { useState, useEffect } from 'react';
import { UltraLuxuryLayout } from '@/components/layout/UltraLuxuryLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
  Zap,
  Eye,
  Clock,
  Server,
  DollarSign,
  Package,
  Play,
  Calendar,
  RotateCcw,
  History,
  AlertOctagon,
  Timer,
  Target,
  Sparkles,
  Radio,
  Hash,
  User,
  Bot,
  TrendingUp,
  Database,
  Code,
  Pause,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Cpu,
  Gauge
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

// ===== TYPES =====
type AIStatus = 'active' | 'paused' | 'locked';
type RiskLevel = 'low' | 'medium' | 'high';
type TriggerSource = 'user_command' | 'auto_monitor' | 'security_alert' | 'schedule';
type DecisionType = 'fix' | 'block' | 'optimize' | 'suggest';
type DecisionStatus = 'done' | 'waiting' | 'need_approval';
type ImpactCategory = 'performance' | 'cost' | 'security';

interface LiveDecision {
  id: string;
  triggerId: string;
  triggerSource: TriggerSource;
  decisionType: DecisionType;
  title: string;
  actionTaken: string;
  confidence: number;
  impact: {
    performance: number;
    cost: number;
    security: number;
  };
  status: DecisionStatus;
  rollbackAvailable: boolean;
  createdAt: Date;
  aiExplanation: string;
}

interface DecisionHistoryItem {
  id: string;
  title: string;
  decisionType: DecisionType;
  approver: 'ai' | 'boss';
  result: 'success' | 'partial' | 'failed';
  timestamp: Date;
  decisionHash: string;
}

// ===== COMPONENT =====
export default function ValaAILiveDecisions() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  
  // State
  const [aiStatus, setAIStatus] = useState<AIStatus>('active');
  const [currentLoad, setCurrentLoad] = useState(67);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('medium');
  const [lastDecisionTime, setLastDecisionTime] = useState(new Date());
  const [pulseActive, setPulseActive] = useState(true);
  const [selectedDecision, setSelectedDecision] = useState<LiveDecision | null>(null);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [simulationOpen, setSimulationOpen] = useState(false);
  
  // Simulate live pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseActive(prev => !prev);
      // Simulate changing load
      setCurrentLoad(prev => Math.min(95, Math.max(30, prev + (Math.random() - 0.5) * 10)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Mock live decisions - NO EMPTY CARDS
  const [liveDecisions] = useState<LiveDecision[]>([
    { 
      id: 'AI-DEC-0001',
      triggerId: 'MON-CPU-4521',
      triggerSource: 'auto_monitor',
      decisionType: 'fix',
      title: 'High CPU Usage Detected',
      actionTaken: 'Scaled service +2 instances',
      confidence: 94,
      impact: { performance: 34, cost: 12, security: 0 },
      status: 'done',
      rollbackAvailable: true,
      createdAt: new Date(Date.now() - 30000),
      aiExplanation: 'AI detected high CPU usage at 92%. Predicted overload in 6 minutes. Scaled service +2 instances. Expected stability improvement +34%.'
    },
    { 
      id: 'AI-DEC-0002',
      triggerId: 'SEC-LOGIN-7842',
      triggerSource: 'security_alert',
      decisionType: 'block',
      title: 'Suspicious Login Attempt Blocked',
      actionTaken: 'Blocked IP 192.168.1.45',
      confidence: 98,
      impact: { performance: 0, cost: 0, security: 85 },
      status: 'done',
      rollbackAvailable: false,
      createdAt: new Date(Date.now() - 120000),
      aiExplanation: 'Multiple failed login attempts from IP 192.168.1.45. Pattern matches known brute-force attack. Blocked IP for 24 hours. Security risk mitigated.'
    },
    { 
      id: 'AI-DEC-0003',
      triggerId: 'CMD-USR-3291',
      triggerSource: 'user_command',
      decisionType: 'optimize',
      title: 'Database Query Optimization',
      actionTaken: 'Applied index to users_orders table',
      confidence: 87,
      impact: { performance: 45, cost: -8, security: 0 },
      status: 'waiting',
      rollbackAvailable: true,
      createdAt: new Date(Date.now() - 300000),
      aiExplanation: 'User requested query optimization. Analyzed slow query logs. Added composite index on users_orders(user_id, created_at). Query time reduced by 45%.'
    },
    { 
      id: 'AI-DEC-0004',
      triggerId: 'SCH-MAINT-0001',
      triggerSource: 'schedule',
      decisionType: 'suggest',
      title: 'SSL Certificate Renewal Suggested',
      actionTaken: 'Queued auto-renewal for approval',
      confidence: 99,
      impact: { performance: 0, cost: 5, security: 100 },
      status: 'need_approval',
      rollbackAvailable: false,
      createdAt: new Date(Date.now() - 600000),
      aiExplanation: 'SSL certificate expires in 7 days. Auto-renewal queued. Requires Boss approval to execute. No downtime expected.'
    },
    { 
      id: 'AI-DEC-0005',
      triggerId: 'MON-MEM-8823',
      triggerSource: 'auto_monitor',
      decisionType: 'fix',
      title: 'Memory Leak Patched',
      actionTaken: 'Recycled worker processes',
      confidence: 91,
      impact: { performance: 28, cost: -5, security: 0 },
      status: 'done',
      rollbackAvailable: true,
      createdAt: new Date(Date.now() - 450000),
      aiExplanation: 'Memory usage growing 2% per hour detected. Identified unclosed WebSocket connections. Recycled affected worker processes. Memory stabilized.'
    },
  ]);

  // Mock decision history
  const [decisionHistory] = useState<DecisionHistoryItem[]>([
    { id: 'HIST-001', title: 'Auto-scaled server cluster', decisionType: 'fix', approver: 'ai', result: 'success', timestamp: new Date(Date.now() - 1800000), decisionHash: '0xf4c3...8a2d' },
    { id: 'HIST-002', title: 'Blocked suspicious login', decisionType: 'block', approver: 'ai', result: 'success', timestamp: new Date(Date.now() - 3600000), decisionHash: '0x9e7b...3f1a' },
    { id: 'HIST-003', title: 'Cache invalidation', decisionType: 'optimize', approver: 'boss', result: 'success', timestamp: new Date(Date.now() - 7200000), decisionHash: '0x2a8c...7d5e' },
    { id: 'HIST-004', title: 'Database query optimization', decisionType: 'optimize', approver: 'ai', result: 'partial', timestamp: new Date(Date.now() - 10800000), decisionHash: '0x6b1f...9c4d' },
    { id: 'HIST-005', title: 'API rate limit adjustment', decisionType: 'suggest', approver: 'boss', result: 'success', timestamp: new Date(Date.now() - 14400000), decisionHash: '0x3d4e...2b7f' },
  ]);

  // Handlers
  const handleViewReason = (decision: LiveDecision) => {
    setSelectedDecision(decision);
    setExplanationOpen(true);
  };

  const handleSimulate = (decision: LiveDecision) => {
    setSelectedDecision(decision);
    setSimulationOpen(true);
  };

  const handleRollback = (id: string) => {
    console.log(`Rolling back decision: ${id}`);
  };

  const handleApprove = (id: string) => {
    console.log(`Approving decision: ${id}`);
  };

  const handleReject = (id: string) => {
    console.log(`Rejecting decision: ${id}`);
  };

  // Config helpers
  const getAIStatusConfig = (status: AIStatus) => {
    switch (status) {
      case 'active': return { label: 'ACTIVE', color: 'bg-emerald-500', textColor: 'text-emerald-400', icon: Activity };
      case 'paused': return { label: 'PAUSED', color: 'bg-amber-500', textColor: 'text-amber-400', icon: Pause };
      case 'locked': return { label: 'LOCKED', color: 'bg-red-500', textColor: 'text-red-400', icon: Lock };
    }
  };

  const getRiskLevelConfig = (level: RiskLevel) => {
    switch (level) {
      case 'low': return { label: 'LOW', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'medium': return { label: 'MEDIUM', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'high': return { label: 'HIGH', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    }
  };

  const getTriggerConfig = (source: TriggerSource) => {
    switch (source) {
      case 'user_command': return { label: 'User Command', icon: User, color: 'text-purple-400' };
      case 'auto_monitor': return { label: 'Auto Monitor', icon: Activity, color: 'text-blue-400' };
      case 'security_alert': return { label: 'Security Alert', icon: Shield, color: 'text-red-400' };
      case 'schedule': return { label: 'Schedule', icon: Calendar, color: 'text-cyan-400' };
    }
  };

  const getDecisionTypeConfig = (type: DecisionType) => {
    switch (type) {
      case 'fix': return { label: 'FIX', color: 'bg-emerald-500', icon: Zap };
      case 'block': return { label: 'BLOCK', color: 'bg-red-500', icon: Shield };
      case 'optimize': return { label: 'OPTIMIZE', color: 'bg-blue-500', icon: TrendingUp };
      case 'suggest': return { label: 'SUGGEST', color: 'bg-purple-500', icon: Sparkles };
    }
  };

  const getStatusConfig = (status: DecisionStatus) => {
    switch (status) {
      case 'done': return { label: 'DONE', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 };
      case 'waiting': return { label: 'WAITING', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Loader2 };
      case 'need_approval': return { label: 'NEED APPROVAL', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: User };
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-emerald-400';
    if (confidence >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  const getResultBadge = (result: 'success' | 'partial' | 'failed') => {
    switch (result) {
      case 'success': return <Badge className="bg-emerald-500 hover:bg-emerald-600"><CheckCircle2 className="h-3 w-3 mr-1" />Success</Badge>;
      case 'partial': return <Badge className="bg-amber-500 hover:bg-amber-600"><AlertTriangle className="h-3 w-3 mr-1" />Partial</Badge>;
      case 'failed': return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
    }
  };

  // Loading state
  if (rolesLoading) {
    return (
      <UltraLuxuryLayout role="boss" variant="boss">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48" />)}
          </div>
        </div>
      </UltraLuxuryLayout>
    );
  }

  // Access denied
  if (!isSuperAdmin()) {
    return (
      <UltraLuxuryLayout role="boss" variant="boss">
        <div className="flex items-center justify-center h-96">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <Lock className="h-12 w-12 mx-auto text-destructive mb-4" />
              <h2 className="text-xl font-bold">Access Denied</h2>
              <p className="text-muted-foreground mt-2">
                Live Decisions is restricted to Boss/Super Admin only.
              </p>
            </CardContent>
          </Card>
        </div>
      </UltraLuxuryLayout>
    );
  }

  const aiStatusConfig = getAIStatusConfig(aiStatus);
  const riskConfig = getRiskLevelConfig(riskLevel);
  const AIStatusIcon = aiStatusConfig.icon;
  const pendingCount = liveDecisions.filter(d => d.status === 'need_approval').length;
  const doneCount = liveDecisions.filter(d => d.status === 'done').length;

  return (
    <UltraLuxuryLayout role="boss" variant="boss">
      <div className="space-y-6">
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative p-3 rounded-xl bg-gradient-to-br from-red-600 to-orange-700 shadow-lg">
              <Radio className={`h-8 w-8 text-white ${pulseActive ? 'animate-pulse' : ''}`} />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full border-2 border-background animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  {VALA_AI_IDENTITY.BADGE} VALA AI
                </Badge>
                <h1 className="text-xl font-bold">Live Decisions</h1>
              </div>
              <p className="text-xs text-muted-foreground">
                Real-time AI decision stream • Zero silent decisions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {doneCount} Done
            </Badge>
            {pendingCount > 0 && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse">
                <User className="h-3 w-3 mr-1" />
                {pendingCount} Need Approval
              </Badge>
            )}
          </div>
        </div>

        {/* ===== TOP STATUS BAR ===== */}
        <Card className="border-blue-500/30 bg-gradient-to-r from-blue-950/30 via-background to-blue-950/30">
          <CardContent className="py-4">
            <div className="grid grid-cols-4 gap-6">
              {/* AI Status */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${aiStatusConfig.color}/20`}>
                  <AIStatusIcon className={`h-5 w-5 ${aiStatusConfig.textColor}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">AI Status</p>
                  <p className={`font-bold ${aiStatusConfig.textColor}`}>{aiStatusConfig.label}</p>
                </div>
              </div>
              
              {/* Current Load */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Gauge className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current Load</p>
                  <p className={`font-bold ${currentLoad > 80 ? 'text-red-400' : currentLoad > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {Math.round(currentLoad)}%
                  </p>
                </div>
              </div>
              
              {/* Risk Level */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Risk Level</p>
                  <Badge variant="outline" className={riskConfig.color}>{riskConfig.label}</Badge>
                </div>
              </div>
              
              {/* Last Decision Time */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Clock className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Decision</p>
                  <p className="font-medium text-sm">{formatDistanceToNow(lastDecisionTime, { addSuffix: true })}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== MAIN CONTENT ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Decision Stream */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Radio className={`h-5 w-5 ${pulseActive ? 'text-emerald-400 animate-pulse' : 'text-muted-foreground'}`} />
                Decision Stream
              </h2>
              <Badge variant="outline" className="text-xs">
                <span className={`h-2 w-2 rounded-full mr-2 ${pulseActive ? 'bg-emerald-400' : 'bg-muted'}`} />
                Real-time
              </Badge>
            </div>

            <ScrollArea className="h-[500px] pr-2">
              <div className="space-y-4">
                {liveDecisions.map((decision) => {
                  const triggerConfig = getTriggerConfig(decision.triggerSource);
                  const typeConfig = getDecisionTypeConfig(decision.decisionType);
                  const statusConfig = getStatusConfig(decision.status);
                  const TriggerIcon = triggerConfig.icon;
                  const TypeIcon = typeConfig.icon;
                  const StatusIcon = statusConfig.icon;

                  return (
                    <Card key={decision.id} className="border-border/50 hover:border-blue-500/30 transition-all">
                      <CardContent className="pt-4">
                        {/* Top Row: ID + Trigger + Type + Confidence */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{decision.id}</code>
                              <Badge variant="outline" className={triggerConfig.color}>
                                <TriggerIcon className="h-3 w-3 mr-1" />
                                {triggerConfig.label}
                              </Badge>
                              <Badge className={typeConfig.color}>
                                <TypeIcon className="h-3 w-3 mr-1" />
                                {typeConfig.label}
                              </Badge>
                            </div>
                            <h4 className="font-semibold">{decision.title}</h4>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Confidence</p>
                            <p className={`text-2xl font-bold ${getConfidenceColor(decision.confidence)}`}>
                              {decision.confidence}%
                            </p>
                          </div>
                        </div>

                        {/* Action Taken */}
                        <div className="p-3 rounded-lg bg-muted/30 border mb-3">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <Zap className="h-4 w-4 text-blue-400" />
                            Action: {decision.actionTaken}
                          </p>
                        </div>

                        {/* Impact Metrics */}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="p-2 rounded bg-muted/20 text-center">
                            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                            <p className="text-xs text-muted-foreground">Performance</p>
                            <p className={`font-bold ${decision.impact.performance > 0 ? 'text-emerald-400' : decision.impact.performance < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                              {decision.impact.performance > 0 ? '+' : ''}{decision.impact.performance}%
                            </p>
                          </div>
                          <div className="p-2 rounded bg-muted/20 text-center">
                            <DollarSign className="h-4 w-4 mx-auto mb-1 text-emerald-400" />
                            <p className="text-xs text-muted-foreground">Cost</p>
                            <p className={`font-bold ${decision.impact.cost < 0 ? 'text-emerald-400' : decision.impact.cost > 0 ? 'text-amber-400' : 'text-muted-foreground'}`}>
                              {decision.impact.cost > 0 ? '+' : ''}{decision.impact.cost}%
                            </p>
                          </div>
                          <div className="p-2 rounded bg-muted/20 text-center">
                            <Shield className="h-4 w-4 mx-auto mb-1 text-red-400" />
                            <p className="text-xs text-muted-foreground">Security</p>
                            <p className={`font-bold ${decision.impact.security > 0 ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                              {decision.impact.security > 0 ? '+' : ''}{decision.impact.security}%
                            </p>
                          </div>
                        </div>

                        {/* Status Row */}
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline" className={statusConfig.color}>
                            <StatusIcon className={`h-3 w-3 mr-1 ${decision.status === 'waiting' ? 'animate-spin' : ''}`} />
                            {statusConfig.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {formatDistanceToNow(decision.createdAt, { addSuffix: true })}
                          </span>
                        </div>

                        {/* Control Actions */}
                        <div className="flex flex-wrap gap-2 pt-3 border-t">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewReason(decision)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Reason
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleSimulate(decision)}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            Simulate Alternative
                          </Button>
                          {decision.rollbackAvailable && decision.status === 'done' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                              onClick={() => handleRollback(decision.id)}
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Rollback
                            </Button>
                          )}
                          {decision.status === 'need_approval' && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => handleApprove(decision.id)}
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleReject(decision.id)}
                              >
                                <ThumbsDown className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel: History + Security */}
          <div className="space-y-4">
            {/* Decision History */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Recent Decisions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px]">
                  <div className="space-y-3">
                    {decisionHistory.map((item) => {
                      const typeConfig = getDecisionTypeConfig(item.decisionType);
                      return (
                        <div key={item.id} className="p-3 rounded-lg border bg-muted/20">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={`${typeConfig.color} text-xs`}>
                                {typeConfig.label}
                              </Badge>
                              {item.approver === 'ai' ? (
                                <Bot className="h-3 w-3 text-blue-400" />
                              ) : (
                                <User className="h-3 w-3 text-purple-400" />
                              )}
                            </div>
                            {getResultBadge(item.result)}
                          </div>
                          <p className="text-sm font-medium mb-1">{item.title}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              {item.decisionHash}
                            </span>
                            <span>{format(item.timestamp, 'HH:mm')}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Security Rules */}
            <Card className="border-red-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-400" />
                  Security Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30 text-xs">
                  <Lock className="h-3 w-3 text-blue-400" />
                  <span>AI cannot hide decisions</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30 text-xs">
                  <Pause className="h-3 w-3 text-amber-400" />
                  <span>High-risk auto-paused</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30 text-xs">
                  <History className="h-3 w-3 text-purple-400" />
                  <span>Manual override logged</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30 text-xs">
                  <Hash className="h-3 w-3 text-emerald-400" />
                  <span>All actions immutable</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <Card className="border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-background to-emerald-950/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-emerald-400" />
                <span className="text-sm text-muted-foreground">
                  Boss sees AI brain • Trust increases • No confusion • Enterprise-grade control
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                Immutable Audit Trail
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* ===== AI EXPLANATION DIALOG ===== */}
        <Dialog open={explanationOpen} onOpenChange={setExplanationOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                AI Explanation
              </DialogTitle>
              <DialogDescription>
                {selectedDecision?.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm leading-relaxed">
                  {selectedDecision?.aiExplanation}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded bg-muted/30 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                  <p className={`text-xl font-bold ${getConfidenceColor(selectedDecision?.confidence || 0)}`}>
                    {selectedDecision?.confidence}%
                  </p>
                </div>
                <div className="p-3 rounded bg-muted/30 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Rollback</p>
                  <p className={`text-xl font-bold ${selectedDecision?.rollbackAvailable ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedDecision?.rollbackAvailable ? 'Available' : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ===== SIMULATION DIALOG ===== */}
        <Dialog open={simulationOpen} onOpenChange={setSimulationOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Simulate Alternative
              </DialogTitle>
              <DialogDescription>
                {selectedDecision?.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <p className="text-sm font-medium mb-2">Alternative Actions:</p>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Do nothing (wait for natural recovery)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400" />
                    Apply minimal fix (lower impact)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    Escalate to development team
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded bg-muted/30 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Resolution</p>
                  <p className="text-lg font-bold text-emerald-400">92%</p>
                </div>
                <div className="p-3 rounded bg-muted/30 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Est. Time</p>
                  <p className="text-lg font-bold">~3 min</p>
                </div>
                <div className="p-3 rounded bg-muted/30 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Side Effects</p>
                  <p className="text-lg font-bold text-amber-400">Minor</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Run Full Simulation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </UltraLuxuryLayout>
  );
}
