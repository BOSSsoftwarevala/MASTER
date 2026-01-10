import { useState, useEffect } from 'react';
import { UltraLuxuryLayout } from '@/components/layout/UltraLuxuryLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useUserRoles } from '@/hooks/useUserRoles';
import { VALA_AI_IDENTITY } from '@/hooks/useValaAI';
import {
  ListOrdered,
  AlertTriangle,
  Clock,
  Shield,
  Server,
  Bug,
  Wrench,
  Bot,
  Timer,
  Lock,
  Eye,
  Sparkles,
  Activity,
  Target,
  Brain,
  AlertOctagon,
  Package,
  Users,
  Snowflake,
  ArrowDown,
  Skull,
  TrendingUp,
  Hash,
  Calendar,
  Play,
  CheckCircle2,
  UserCheck,
  XCircle,
  Zap
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

// ===== TYPES =====
type TaskOwner = 'vala_ai' | 'dev_bot' | 'support_bot';
type TaskCategory = 'security' | 'bug_fix' | 'deployment' | 'demo_build' | 'optimization';
type TaskStatus = 'ready' | 'waiting_dependency' | 'approval_required';
type RiskLevel = 'low' | 'medium' | 'high';

interface QueueTask {
  id: string;
  rank: number;
  owner: TaskOwner;
  priorityReason: string;
  category: TaskCategory;
  businessImpact: number;
  riskScore: number;
  dependencyCheck: string | null;
  estimatedExecutionTime: string;
  status: TaskStatus;
  autoRunTimer: Date;
  lastReEvaluated: Date;
  title: string;
  description: string;
  aiLogic: {
    whyAboveOthers: string;
    whatHappensIfDelayed: string;
    whatBreaksIfSkipped: string;
  };
}

// ===== COMPONENT =====
export default function ValaAIPriorityQueue() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  
  // State
  const [pulseActive, setPulseActive] = useState(true);
  const [selectedTask, setSelectedTask] = useState<QueueTask | null>(null);
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [downgradeDialogOpen, setDowngradeDialogOpen] = useState(false);
  const [downgradeReason, setDowngradeReason] = useState('');

  // Simulate live pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseActive(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Mock queue tasks - AUTO-ORDERED BY AI
  const [tasks] = useState<QueueTask[]>([
    {
      id: 'PQ-VALA-001',
      rank: 1,
      owner: 'vala_ai',
      priorityReason: 'SSL expiry detected within 12 hours',
      category: 'security',
      businessImpact: 98,
      riskScore: 95,
      dependencyCheck: null,
      estimatedExecutionTime: '~5 min',
      status: 'ready',
      autoRunTimer: new Date(Date.now() + 300000),
      lastReEvaluated: new Date(Date.now() - 60000),
      title: 'Renew SSL Certificate',
      description: 'api.softwarevala.com certificate expires in 12 hours',
      aiLogic: {
        whyAboveOthers: 'This task moved to #1 because SSL expiry detected within 12 hours. All HTTPS traffic will fail if not renewed. No dependencies blocking execution.',
        whatHappensIfDelayed: 'If delayed beyond 12 hours, all API endpoints become unreachable. Users will see security warnings. Payment processing will halt.',
        whatBreaksIfSkipped: 'Complete service outage. Trust and SEO rankings will be damaged. Payment gateways will be disconnected.'
      }
    },
    {
      id: 'PQ-VALA-002',
      rank: 2,
      owner: 'vala_ai',
      priorityReason: 'Database connections at 92% capacity',
      category: 'optimization',
      businessImpact: 92,
      riskScore: 85,
      dependencyCheck: null,
      estimatedExecutionTime: '~3 min',
      status: 'ready',
      autoRunTimer: new Date(Date.now() + 180000),
      lastReEvaluated: new Date(Date.now() - 30000),
      title: 'Scale Database Connection Pool',
      description: 'Production DB hitting max connections, affecting 2,400 users',
      aiLogic: {
        whyAboveOthers: 'Critical infrastructure issue. At 92% capacity, new connections will be rejected soon. Higher impact than bug fixes.',
        whatHappensIfDelayed: 'Connection pool exhaustion will cause request timeouts. Users will see 500 errors. Data writes may fail.',
        whatBreaksIfSkipped: 'Database will reject new connections. Checkout flow breaks. User sessions will be lost.'
      }
    },
    {
      id: 'PQ-VALA-003',
      rank: 3,
      owner: 'dev_bot',
      priorityReason: 'Security patch for auth vulnerability',
      category: 'bug_fix',
      businessImpact: 85,
      riskScore: 78,
      dependencyCheck: null,
      estimatedExecutionTime: '~8 min',
      status: 'approval_required',
      autoRunTimer: new Date(Date.now() + 600000),
      lastReEvaluated: new Date(Date.now() - 120000),
      title: 'Patch Authentication Edge Case',
      description: 'Token refresh failing for 0.3% of mobile sessions',
      aiLogic: {
        whyAboveOthers: 'Security-related bug affecting user authentication. Could be exploited if not patched. Prioritized over non-security issues.',
        whatHappensIfDelayed: '0.3% of users continue to experience session drops. Potential for exploit if vulnerability is discovered externally.',
        whatBreaksIfSkipped: 'Affected users cannot maintain sessions. Security audit will flag this as a vulnerability.'
      }
    },
    {
      id: 'PQ-VALA-004',
      rank: 4,
      owner: 'vala_ai',
      priorityReason: 'Scheduled deployment window',
      category: 'deployment',
      businessImpact: 72,
      riskScore: 45,
      dependencyCheck: 'PQ-VALA-002',
      estimatedExecutionTime: '~12 min',
      status: 'waiting_dependency',
      autoRunTimer: new Date(Date.now() + 1200000),
      lastReEvaluated: new Date(Date.now() - 90000),
      title: 'Deploy Feature Branch v2.4.1',
      description: 'New dashboard features ready for production',
      aiLogic: {
        whyAboveOthers: 'Scheduled deployment with approved code. Waiting for database scaling to complete first to ensure stability.',
        whatHappensIfDelayed: 'Feature rollout delayed. Marketing campaign timing may be affected. No critical impact.',
        whatBreaksIfSkipped: 'Features remain in staging. No production breakage but roadmap delay.'
      }
    },
    {
      id: 'PQ-VALA-005',
      rank: 5,
      owner: 'support_bot',
      priorityReason: 'Ticket queue exceeded threshold',
      category: 'optimization',
      businessImpact: 55,
      riskScore: 20,
      dependencyCheck: null,
      estimatedExecutionTime: '~15 min',
      status: 'ready',
      autoRunTimer: new Date(Date.now() + 900000),
      lastReEvaluated: new Date(Date.now() - 180000),
      title: 'Auto-respond to Ticket Batch',
      description: '47 low-priority tickets awaiting AI response',
      aiLogic: {
        whyAboveOthers: 'Support SLA approaching. Batch processing is more efficient. Lower priority than infrastructure issues.',
        whatHappensIfDelayed: 'Customer satisfaction may decrease. SLA breach for some tickets. No system impact.',
        whatBreaksIfSkipped: 'Tickets remain unanswered. Potential escalation from customers.'
      }
    },
    {
      id: 'PQ-VALA-006',
      rank: 6,
      owner: 'vala_ai',
      priorityReason: 'Demo request from enterprise client',
      category: 'demo_build',
      businessImpact: 48,
      riskScore: 10,
      dependencyCheck: null,
      estimatedExecutionTime: '~20 min',
      status: 'ready',
      autoRunTimer: new Date(Date.now() + 1800000),
      lastReEvaluated: new Date(Date.now() - 300000),
      title: 'Generate Enterprise Demo Preview',
      description: 'Custom demo for Acme Corp sales call',
      aiLogic: {
        whyAboveOthers: 'Business opportunity but not urgent. Scheduled for later execution window.',
        whatHappensIfDelayed: 'Sales call may proceed without customized demo. Lower conversion probability.',
        whatBreaksIfSkipped: 'No demo available for call. Sales team uses generic presentation.'
      }
    }
  ]);

  // Handlers
  const handleViewReason = (task: QueueTask) => {
    setSelectedTask(task);
    setReasonDialogOpen(true);
  };

  const handleFreezePosition = (taskId: string) => {
    console.log('Freezing position (Boss only):', taskId);
  };

  const handleDowngrade = (task: QueueTask) => {
    setSelectedTask(task);
    setDowngradeDialogOpen(true);
  };

  const handleKillTask = (taskId: string) => {
    console.log('Killing task (requires confirmation):', taskId);
  };

  // Config helpers
  const getOwnerConfig = (owner: TaskOwner) => {
    switch (owner) {
      case 'vala_ai': return { label: 'VALA AI', icon: Brain, color: 'text-blue-400 bg-blue-500/20' };
      case 'dev_bot': return { label: 'DEV BOT', icon: Wrench, color: 'text-purple-400 bg-purple-500/20' };
      case 'support_bot': return { label: 'SUPPORT BOT', icon: Users, color: 'text-cyan-400 bg-cyan-500/20' };
    }
  };

  const getCategoryConfig = (category: TaskCategory) => {
    switch (category) {
      case 'security': return { label: 'Security', icon: Shield, color: 'text-red-400 bg-red-500/20' };
      case 'bug_fix': return { label: 'Bug Fix', icon: Bug, color: 'text-amber-400 bg-amber-500/20' };
      case 'deployment': return { label: 'Deployment', icon: Package, color: 'text-purple-400 bg-purple-500/20' };
      case 'demo_build': return { label: 'Demo Build', icon: Sparkles, color: 'text-cyan-400 bg-cyan-500/20' };
      case 'optimization': return { label: 'Optimization', icon: TrendingUp, color: 'text-blue-400 bg-blue-500/20' };
    }
  };

  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case 'ready': return { label: 'READY', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 };
      case 'waiting_dependency': return { label: 'WAITING DEPENDENCY', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock };
      case 'approval_required': return { label: 'APPROVAL REQUIRED', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: UserCheck };
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-red-500 text-white';
    if (rank === 2) return 'bg-amber-500 text-white';
    if (rank === 3) return 'bg-blue-500 text-white';
    return 'bg-muted text-muted-foreground';
  };

  // Stats
  const totalQueued = tasks.length;
  const avgWaitTime = '8 min';
  const criticalCount = tasks.filter(t => t.riskScore >= 80).length;

  // Loading state
  if (rolesLoading) {
    return (
      <UltraLuxuryLayout role="boss" variant="boss">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-20 w-full" />
          <div className="space-y-4">
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
                Priority Queue is restricted to Boss/Super Admin only.
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
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-700 shadow-lg">
              <ListOrdered className={`h-8 w-8 text-white ${pulseActive ? 'animate-pulse' : ''}`} />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full border-2 border-background animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  {VALA_AI_IDENTITY.BADGE} VALA AI
                </Badge>
                <h1 className="text-xl font-bold">Priority Queue</h1>
              </div>
              <p className="text-xs text-muted-foreground">
                AI-driven priority • One clear execution line
              </p>
            </div>
          </div>
        </div>

        {/* ===== TOP CONTROL BAR ===== */}
        <Card className="border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-background to-purple-950/30">
          <CardContent className="py-4">
            <div className="grid grid-cols-5 gap-6">
              {/* Queue Mode */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Bot className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Queue Mode</p>
                  <div className="flex items-center gap-1">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">AUTO</Badge>
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              {/* Emergency Override */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertOctagon className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Emergency Override</p>
                  <p className="text-sm font-medium text-red-400">Boss Only</p>
                </div>
              </div>
              
              {/* Total Queued */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Queued</p>
                  <p className="text-2xl font-bold">{totalQueued}</p>
                </div>
              </div>
              
              {/* Avg Wait Time */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Timer className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Wait Time</p>
                  <p className="text-lg font-bold">{avgWaitTime}</p>
                </div>
              </div>
              
              {/* Critical Tasks */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Critical Tasks</p>
                  <p className={`text-2xl font-bold ${criticalCount > 0 ? 'text-red-400' : ''}`}>{criticalCount}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== PRIORITY STACK ===== */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ListOrdered className={`h-5 w-5 ${pulseActive ? 'text-purple-400 animate-pulse' : 'text-muted-foreground'}`} />
            Priority Stack
            <Badge variant="outline" className="text-xs ml-2">
              Top = Next to Run
            </Badge>
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            No drag & drop for users
          </div>
        </div>

        <ScrollArea className="h-[500px] pr-2">
          <div className="space-y-4">
            {tasks.map((task) => {
              const ownerConfig = getOwnerConfig(task.owner);
              const categoryConfig = getCategoryConfig(task.category);
              const statusConfig = getStatusConfig(task.status);
              const OwnerIcon = ownerConfig.icon;
              const CategoryIcon = categoryConfig.icon;
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={task.id} className="border-border/50 hover:border-purple-500/30 transition-all">
                  <CardContent className="pt-4 space-y-4">
                    {/* ===== CARD HEADER ===== */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {/* Priority Rank */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${getRankColor(task.rank)}`}>
                          #{task.rank}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{task.id}</code>
                            <Badge variant="outline" className={ownerConfig.color}>
                              <OwnerIcon className="h-3 w-3 mr-1" />
                              {ownerConfig.label}
                            </Badge>
                          </div>
                          <h4 className="font-semibold">{task.title}</h4>
                        </div>
                      </div>
                    </div>

                    {/* Priority Reason (AI-generated) */}
                    <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Brain className="h-3 w-3 text-purple-400" />
                        Priority Reason (AI)
                      </p>
                      <p className="text-sm">{task.priorityReason}</p>
                    </div>

                    {/* ===== CARD BODY ===== */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        {/* Category */}
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={categoryConfig.color}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {categoryConfig.label}
                          </Badge>
                        </div>
                        
                        {/* Business Impact + Risk Score */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 rounded bg-muted/30 text-center">
                            <Target className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                            <p className="text-xs text-muted-foreground">Business Impact</p>
                            <p className={`font-bold ${task.businessImpact >= 80 ? 'text-red-400' : task.businessImpact >= 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {task.businessImpact}
                            </p>
                          </div>
                          <div className="p-2 rounded bg-muted/30 text-center">
                            <AlertTriangle className="h-4 w-4 mx-auto mb-1 text-amber-400" />
                            <p className="text-xs text-muted-foreground">Risk Score</p>
                            <p className={`font-bold ${task.riskScore >= 80 ? 'text-red-400' : task.riskScore >= 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {task.riskScore}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Dependency Check */}
                        <div className="p-2 rounded bg-muted/30">
                          <p className="text-xs text-muted-foreground mb-1">Dependency Check</p>
                          {task.dependencyCheck ? (
                            <p className="text-sm text-amber-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Waiting on {task.dependencyCheck}
                            </p>
                          ) : (
                            <p className="text-sm text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              None
                            </p>
                          )}
                        </div>

                        {/* Estimated Execution Time */}
                        <div className="p-2 rounded bg-muted/30">
                          <p className="text-xs text-muted-foreground mb-1">Est. Execution Time</p>
                          <p className="text-sm font-medium">{task.estimatedExecutionTime}</p>
                        </div>
                      </div>
                    </div>

                    {/* ===== CARD FOOTER ===== */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={statusConfig.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          Auto-run: {format(task.autoRunTimer, 'HH:mm')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Re-evaluated: {formatDistanceToNow(task.lastReEvaluated, { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    {/* ===== QUEUE ACTIONS (RESTRICTED) ===== */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewReason(task)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Full Reason
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
                        onClick={() => handleFreezePosition(task.id)}
                      >
                        <Snowflake className="h-3 w-3 mr-1" />
                        Freeze Position
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                        onClick={() => handleDowngrade(task)}
                      >
                        <ArrowDown className="h-3 w-3 mr-1" />
                        Downgrade
                      </Button>
                      {task.riskScore >= 80 && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleKillTask(task.id)}
                        >
                          <Skull className="h-3 w-3 mr-1" />
                          Kill Task
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>

        {/* ===== FOOTER ===== */}
        <Card className="border-red-500/30 bg-gradient-to-r from-red-950/20 via-background to-red-950/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-red-400" />
                <span className="text-sm text-muted-foreground">
                  No manual reorder without authority • Every change logged • AI decisions immutable after execution start
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                Auto-Controlled
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* ===== VIEW REASON DIALOG ===== */}
        <Dialog open={reasonDialogOpen} onOpenChange={setReasonDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                AI Priority Logic
              </DialogTitle>
              <DialogDescription>
                {selectedTask?.id} • {selectedTask?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Why above others */}
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                  Why this task is above others
                </p>
                <p className="text-sm leading-relaxed">{selectedTask?.aiLogic.whyAboveOthers}</p>
              </div>

              {/* What happens if delayed */}
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-amber-400" />
                  What happens if delayed
                </p>
                <p className="text-sm leading-relaxed">{selectedTask?.aiLogic.whatHappensIfDelayed}</p>
              </div>

              {/* What breaks if skipped */}
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <XCircle className="h-3 w-3 text-red-400" />
                  What breaks if skipped
                </p>
                <p className="text-sm leading-relaxed">{selectedTask?.aiLogic.whatBreaksIfSkipped}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ===== DOWNGRADE DIALOG ===== */}
        <Dialog open={downgradeDialogOpen} onOpenChange={setDowngradeDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowDown className="h-5 w-5 text-amber-400" />
                Downgrade Task Priority
              </DialogTitle>
              <DialogDescription>
                {selectedTask?.id} • Requires reason
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-sm text-amber-400">
                  Downgrading this task will move it lower in the queue. AI will log this action and may re-prioritize if conditions change.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Reason (Required)</label>
                <textarea 
                  className="w-full p-3 rounded-lg border bg-muted/30 text-sm resize-none"
                  rows={3}
                  placeholder="Explain why this task should be downgraded..."
                  value={downgradeReason}
                  onChange={(e) => setDowngradeReason(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setDowngradeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-amber-600 hover:bg-amber-700" 
                  disabled={!downgradeReason.trim()}
                  onClick={() => {
                    console.log('Downgrading with reason:', downgradeReason);
                    setDowngradeDialogOpen(false);
                    setDowngradeReason('');
                  }}
                >
                  Confirm Downgrade
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </UltraLuxuryLayout>
  );
}
