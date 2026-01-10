import { useState, useEffect } from 'react';
import { UltraLuxuryLayout } from '@/components/layout/UltraLuxuryLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useUserRoles } from '@/hooks/useUserRoles';
import { VALA_AI_IDENTITY } from '@/hooks/useValaAI';
import {
  Activity,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Zap,
  Server,
  Bug,
  Wrench,
  Bot,
  User,
  Shield,
  Eye,
  FileText,
  Sparkles,
  Timer,
  Lock,
  RefreshCw,
  Layers,
  AlertOctagon,
  Skull,
  Calendar,
  Package,
  Laptop,
  Users,
  Hash,
  Brain,
  History,
  StopCircle,
  UserCheck,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

// ===== TYPES =====
type TaskOwner = 'vala_ai' | 'dev_bot' | 'support_bot';
type TaskPriority = 'critical' | 'high' | 'normal';
type TaskType = 'bug_fix' | 'build' | 'optimization' | 'security_action' | 'demo_generation';
type TaskTrigger = 'user_command' | 'auto_detection' | 'scheduled';
type TaskStatus = 'running' | 'waiting_approval' | 'blocked' | 'completed';
type ImpactArea = 'server' | 'product' | 'demo' | 'client';
type RiskLevel = 'low' | 'medium' | 'high';

interface TaskStep {
  step: number;
  name: string;
  status: 'done' | 'running' | 'pending';
}

interface ActiveTask {
  id: string;
  owner: TaskOwner;
  priority: TaskPriority;
  startTime: Date;
  eta: Date;
  taskType: TaskType;
  trigger: TaskTrigger;
  currentStep: number;
  totalSteps: number;
  steps: TaskStep[];
  progress: number;
  impactArea: ImpactArea;
  riskLevel: RiskLevel;
  status: TaskStatus;
  title: string;
  description: string;
  aiExplanation: string;
}

// ===== COMPONENT =====
export default function ValaAIActiveTasks() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  
  // State
  const [pulseActive, setPulseActive] = useState(true);
  const [selectedTask, setSelectedTask] = useState<ActiveTask | null>(null);
  const [stepsDialogOpen, setStepsDialogOpen] = useState(false);
  const [logsDialogOpen, setLogsDialogOpen] = useState(false);

  // Simulate live pulse and progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseActive(prev => !prev);
      // Update task progress
      setTasks(prev => prev.map(task => {
        if (task.status === 'running' && task.progress < 100) {
          const newProgress = Math.min(task.progress + Math.random() * 3, 100);
          const newStep = Math.min(Math.ceil((newProgress / 100) * task.totalSteps), task.totalSteps);
          return {
            ...task,
            progress: newProgress,
            currentStep: newStep,
            status: newProgress >= 100 ? 'completed' as TaskStatus : 'running' as TaskStatus
          };
        }
        return task;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Mock tasks - NO TASK WITHOUT STATUS
  const [tasks, setTasks] = useState<ActiveTask[]>([
    {
      id: 'TASK-VALA-1023',
      owner: 'vala_ai',
      priority: 'critical',
      startTime: new Date(Date.now() - 180000),
      eta: new Date(Date.now() + 120000),
      taskType: 'security_action',
      trigger: 'auto_detection',
      currentStep: 5,
      totalSteps: 7,
      steps: [
        { step: 1, name: 'Detect Anomaly', status: 'done' },
        { step: 2, name: 'Analyze Pattern', status: 'done' },
        { step: 3, name: 'Identify Root Cause', status: 'done' },
        { step: 4, name: 'Generate Fix', status: 'done' },
        { step: 5, name: 'Apply Patch', status: 'running' },
        { step: 6, name: 'Verify Fix', status: 'pending' },
        { step: 7, name: 'Update Logs', status: 'pending' }
      ],
      progress: 71,
      impactArea: 'server',
      riskLevel: 'high',
      status: 'running',
      title: 'Blocking Brute Force Attack',
      description: 'Detected 1,247 failed login attempts from IP range 192.168.x.x',
      aiExplanation: 'This task was created because error rate crossed safe threshold. AI selected safest fix based on previous 312 similar cases. Pattern matches known brute-force signature. Blocking IP range for 24 hours.'
    },
    {
      id: 'TASK-VALA-1024',
      owner: 'dev_bot',
      priority: 'high',
      startTime: new Date(Date.now() - 300000),
      eta: new Date(Date.now() + 300000),
      taskType: 'bug_fix',
      trigger: 'auto_detection',
      currentStep: 3,
      totalSteps: 6,
      steps: [
        { step: 1, name: 'Log Analysis', status: 'done' },
        { step: 2, name: 'Pattern Match', status: 'done' },
        { step: 3, name: 'Generate Patch', status: 'running' },
        { step: 4, name: 'Test Patch', status: 'pending' },
        { step: 5, name: 'Deploy Patch', status: 'pending' },
        { step: 6, name: 'Verify Fix', status: 'pending' }
      ],
      progress: 45,
      impactArea: 'product',
      riskLevel: 'medium',
      status: 'running',
      title: 'Patching Authentication Edge Case',
      description: 'Fixing token refresh issue affecting 0.3% of user sessions',
      aiExplanation: 'Error rate spike detected in auth logs. AI identified token refresh race condition. Generating non-breaking patch. Rollback available if needed.'
    },
    {
      id: 'TASK-VALA-1025',
      owner: 'vala_ai',
      priority: 'high',
      startTime: new Date(Date.now() - 120000),
      eta: new Date(Date.now() + 180000),
      taskType: 'build',
      trigger: 'user_command',
      currentStep: 0,
      totalSteps: 5,
      steps: [
        { step: 1, name: 'Compile Assets', status: 'pending' },
        { step: 2, name: 'Run Tests', status: 'pending' },
        { step: 3, name: 'Build Bundle', status: 'pending' },
        { step: 4, name: 'Deploy to Staging', status: 'pending' },
        { step: 5, name: 'Verify Deployment', status: 'pending' }
      ],
      progress: 0,
      impactArea: 'product',
      riskLevel: 'medium',
      status: 'waiting_approval',
      title: 'Deploy Feature Branch v2.4.1',
      description: 'Waiting for Boss approval before deployment to production',
      aiExplanation: 'Manual deployment request from Dev Team. All tests passed. Code review complete. Staging verification pending. Requires Boss approval for production deployment.'
    },
    {
      id: 'TASK-VALA-1026',
      owner: 'support_bot',
      priority: 'normal',
      startTime: new Date(Date.now() - 600000),
      eta: new Date(Date.now() + 600000),
      taskType: 'optimization',
      trigger: 'scheduled',
      currentStep: 2,
      totalSteps: 4,
      steps: [
        { step: 1, name: 'Scan Tickets', status: 'done' },
        { step: 2, name: 'Categorize Issues', status: 'running' },
        { step: 3, name: 'Generate Responses', status: 'pending' },
        { step: 4, name: 'Queue Dispatch', status: 'pending' }
      ],
      progress: 35,
      impactArea: 'client',
      riskLevel: 'low',
      status: 'running',
      title: 'Auto-respond to Ticket Batch',
      description: 'Processing 12 low-priority support tickets with AI responses',
      aiExplanation: 'Scheduled task triggered by ticket queue threshold. AI generating contextual responses based on knowledge base. Human review not required for low-priority tickets.'
    },
    {
      id: 'TASK-VALA-1027',
      owner: 'vala_ai',
      priority: 'normal',
      startTime: new Date(Date.now() - 900000),
      eta: new Date(Date.now() + 300000),
      taskType: 'demo_generation',
      trigger: 'user_command',
      currentStep: 4,
      totalSteps: 5,
      steps: [
        { step: 1, name: 'Parse Requirements', status: 'done' },
        { step: 2, name: 'Generate Structure', status: 'done' },
        { step: 3, name: 'Build Components', status: 'done' },
        { step: 4, name: 'Apply Styling', status: 'running' },
        { step: 5, name: 'Deploy Preview', status: 'pending' }
      ],
      progress: 78,
      impactArea: 'demo',
      riskLevel: 'low',
      status: 'running',
      title: 'Generate Demo Preview',
      description: 'Creating interactive demo for Enterprise CRM product',
      aiExplanation: 'User command triggered demo generation. AI parsed product requirements and is building interactive preview. Expected completion in 5 minutes.'
    },
    {
      id: 'TASK-VALA-1028',
      owner: 'dev_bot',
      priority: 'high',
      startTime: new Date(Date.now() - 450000),
      eta: new Date(),
      taskType: 'build',
      trigger: 'auto_detection',
      currentStep: 3,
      totalSteps: 5,
      steps: [
        { step: 1, name: 'Identify Failure', status: 'done' },
        { step: 2, name: 'Analyze Cause', status: 'done' },
        { step: 3, name: 'Attempt Fix', status: 'done' },
        { step: 4, name: 'Escalate to Human', status: 'pending' },
        { step: 5, name: 'Manual Resolution', status: 'pending' }
      ],
      progress: 60,
      impactArea: 'product',
      riskLevel: 'high',
      status: 'blocked',
      title: 'Resolve Build Pipeline Failure',
      description: 'Blocked: Requires manual verification for dependency conflict',
      aiExplanation: 'Build pipeline failed due to conflicting package versions. AI attempted automatic resolution but conflict requires human decision. Escalating to development team.'
    }
  ]);

  // Handlers
  const handleViewSteps = (task: ActiveTask) => {
    setSelectedTask(task);
    setStepsDialogOpen(true);
  };

  const handlePauseTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'waiting_approval' as TaskStatus } : t
    ));
  };

  const handleKillTask = (taskId: string) => {
    console.log('Killing task (requires confirmation):', taskId);
  };

  const handleConvertToManual = (taskId: string) => {
    console.log('Converting to manual:', taskId);
  };

  const handleOpenLogs = (task: ActiveTask) => {
    setSelectedTask(task);
    setLogsDialogOpen(true);
  };

  // Config helpers
  const getOwnerConfig = (owner: TaskOwner) => {
    switch (owner) {
      case 'vala_ai': return { label: 'VALA AI', icon: Brain, color: 'text-blue-400 bg-blue-500/20' };
      case 'dev_bot': return { label: 'DEV BOT', icon: Wrench, color: 'text-purple-400 bg-purple-500/20' };
      case 'support_bot': return { label: 'SUPPORT BOT', icon: Users, color: 'text-cyan-400 bg-cyan-500/20' };
    }
  };

  const getPriorityConfig = (priority: TaskPriority) => {
    switch (priority) {
      case 'critical': return { label: 'CRITICAL', color: 'bg-red-500', textColor: 'text-red-400', icon: AlertOctagon };
      case 'high': return { label: 'HIGH', color: 'bg-amber-500', textColor: 'text-amber-400', icon: AlertTriangle };
      case 'normal': return { label: 'NORMAL', color: 'bg-blue-500', textColor: 'text-blue-400', icon: Activity };
    }
  };

  const getTaskTypeConfig = (type: TaskType) => {
    switch (type) {
      case 'bug_fix': return { label: 'Bug Fix', icon: Bug, color: 'text-red-400' };
      case 'build': return { label: 'Build', icon: Package, color: 'text-purple-400' };
      case 'optimization': return { label: 'Optimization', icon: TrendingUp, color: 'text-blue-400' };
      case 'security_action': return { label: 'Security Action', icon: Shield, color: 'text-amber-400' };
      case 'demo_generation': return { label: 'Demo Generation', icon: Sparkles, color: 'text-cyan-400' };
    }
  };

  const getTriggerConfig = (trigger: TaskTrigger) => {
    switch (trigger) {
      case 'user_command': return { label: 'User Command', icon: User, color: 'text-purple-400' };
      case 'auto_detection': return { label: 'Auto Detection', icon: Activity, color: 'text-blue-400' };
      case 'scheduled': return { label: 'Scheduled', icon: Calendar, color: 'text-cyan-400' };
    }
  };

  const getImpactConfig = (area: ImpactArea) => {
    switch (area) {
      case 'server': return { label: 'Server', icon: Server, color: 'text-blue-400' };
      case 'product': return { label: 'Product', icon: Package, color: 'text-purple-400' };
      case 'demo': return { label: 'Demo', icon: Play, color: 'text-cyan-400' };
      case 'client': return { label: 'Client', icon: Users, color: 'text-emerald-400' };
    }
  };

  const getRiskConfig = (risk: RiskLevel) => {
    switch (risk) {
      case 'low': return { label: 'LOW', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'medium': return { label: 'MEDIUM', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'high': return { label: 'HIGH', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    }
  };

  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case 'running': return { label: 'RUNNING', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: RefreshCw };
      case 'waiting_approval': return { label: 'WAITING APPROVAL', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: UserCheck };
      case 'blocked': return { label: 'BLOCKED', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle };
      case 'completed': return { label: 'COMPLETED', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: CheckCircle2 };
    }
  };

  // Stats
  const totalActive = tasks.length;
  const aiOwned = tasks.filter(t => t.owner === 'vala_ai').length;
  const pendingApproval = tasks.filter(t => t.status === 'waiting_approval').length;
  const blockedFailed = tasks.filter(t => t.status === 'blocked').length;

  // Loading state
  if (rolesLoading) {
    return (
      <UltraLuxuryLayout role="boss" variant="boss">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64" />)}
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
                Active Tasks is restricted to Boss/Super Admin only.
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
            <div className="relative p-3 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 shadow-lg">
              <Activity className={`h-8 w-8 text-white ${pulseActive ? 'animate-pulse' : ''}`} />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full border-2 border-background animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  {VALA_AI_IDENTITY.BADGE} VALA AI
                </Badge>
                <h1 className="text-xl font-bold">Active Tasks</h1>
              </div>
              <p className="text-xs text-muted-foreground">
                Real-time AI task monitoring • Zero ghost processes
              </p>
            </div>
          </div>
        </div>

        {/* ===== TOP SUMMARY STRIP ===== */}
        <Card className="border-blue-500/30 bg-gradient-to-r from-blue-950/30 via-background to-blue-950/30">
          <CardContent className="py-4">
            <div className="grid grid-cols-4 gap-6">
              {/* Total Active */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Layers className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Active</p>
                  <p className="text-2xl font-bold">{totalActive}</p>
                </div>
              </div>
              
              {/* AI-Owned */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">AI-Owned</p>
                  <p className="text-2xl font-bold text-purple-400">{aiOwned}</p>
                </div>
              </div>
              
              {/* Human Approval Pending */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <UserCheck className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Approval Pending</p>
                  <p className={`text-2xl font-bold ${pendingApproval > 0 ? 'text-amber-400' : ''}`}>{pendingApproval}</p>
                </div>
              </div>
              
              {/* Blocked / Failed */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Blocked / Failed</p>
                  <p className={`text-2xl font-bold ${blockedFailed > 0 ? 'text-red-400' : ''}`}>{blockedFailed}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== TASK LIST (CARDS) ===== */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className={`h-5 w-5 ${pulseActive ? 'text-emerald-400 animate-pulse' : 'text-muted-foreground'}`} />
            Task List
          </h2>
          <Badge variant="outline" className="text-xs">
            <span className={`h-2 w-2 rounded-full mr-2 ${pulseActive ? 'bg-emerald-400' : 'bg-muted'}`} />
            Live
          </Badge>
        </div>

        <ScrollArea className="h-[500px] pr-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {tasks.map((task) => {
              const ownerConfig = getOwnerConfig(task.owner);
              const priorityConfig = getPriorityConfig(task.priority);
              const typeConfig = getTaskTypeConfig(task.taskType);
              const triggerConfig = getTriggerConfig(task.trigger);
              const impactConfig = getImpactConfig(task.impactArea);
              const riskConfig = getRiskConfig(task.riskLevel);
              const statusConfig = getStatusConfig(task.status);
              const OwnerIcon = ownerConfig.icon;
              const PriorityIcon = priorityConfig.icon;
              const TypeIcon = typeConfig.icon;
              const TriggerIcon = triggerConfig.icon;
              const ImpactIcon = impactConfig.icon;
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={task.id} className="border-border/50 hover:border-blue-500/30 transition-all">
                  <CardContent className="pt-4 space-y-4">
                    {/* ===== TASK HEADER ===== */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{task.id}</code>
                          <Badge className={priorityConfig.color}>
                            <PriorityIcon className="h-3 w-3 mr-1" />
                            {priorityConfig.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={ownerConfig.color}>
                            <OwnerIcon className="h-3 w-3 mr-1" />
                            {ownerConfig.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <div className="flex items-center gap-1 justify-end">
                          <Clock className="h-3 w-3" />
                          <span>{formatDistanceToNow(task.startTime, { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <Timer className="h-3 w-3" />
                          <span>ETA: {format(task.eta, 'HH:mm')}</span>
                        </div>
                      </div>
                    </div>

                    {/* ===== TASK BODY ===== */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={typeConfig.color}>
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {typeConfig.label}
                        </Badge>
                        <Badge variant="outline" className={triggerConfig.color}>
                          <TriggerIcon className="h-3 w-3 mr-1" />
                          {triggerConfig.label}
                        </Badge>
                      </div>

                      {/* Current Step + Progress */}
                      <div className="p-3 rounded-lg bg-muted/30 border space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Step {task.currentStep} of {task.totalSteps}</span>
                          <span className={`font-bold ${task.progress >= 70 ? 'text-emerald-400' : task.progress >= 40 ? 'text-amber-400' : 'text-blue-400'}`}>
                            {Math.round(task.progress)}%
                          </span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    </div>

                    {/* ===== TASK FOOTER ===== */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={impactConfig.color}>
                          <ImpactIcon className="h-3 w-3 mr-1" />
                          {impactConfig.label}
                        </Badge>
                        <Badge variant="outline" className={riskConfig.color}>
                          Risk: {riskConfig.label}
                        </Badge>
                      </div>
                      <Badge variant="outline" className={statusConfig.color}>
                        <StatusIcon className={`h-3 w-3 mr-1 ${task.status === 'running' ? 'animate-spin' : ''}`} />
                        {statusConfig.label}
                      </Badge>
                    </div>

                    {/* ===== TASK ACTION BUTTONS ===== */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewSteps(task)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Steps
                      </Button>
                      {task.status === 'running' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                          onClick={() => handlePauseTask(task.id)}
                        >
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                      )}
                      {task.priority === 'critical' && task.status === 'running' && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleKillTask(task.id)}
                        >
                          <Skull className="h-3 w-3 mr-1" />
                          Kill Task
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleConvertToManual(task.id)}
                      >
                        <User className="h-3 w-3 mr-1" />
                        Convert to Manual
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleOpenLogs(task)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Open Logs
                      </Button>
                    </div>

                    {/* ===== AI EXPLANATION ===== */}
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Brain className="h-3 w-3 text-blue-400" />
                        AI Explanation
                      </p>
                      <p className="text-sm leading-relaxed">
                        {task.aiExplanation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>

        {/* ===== FOOTER ===== */}
        <Card className="border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-background to-emerald-950/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span className="text-sm text-muted-foreground">
                  AI cannot delete task history • Kill requires Boss confirmation • Every action timestamped • Task replay available
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                Full Accountability
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* ===== VIEW STEPS DIALOG ===== */}
        <Dialog open={stepsDialogOpen} onOpenChange={setStepsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-400" />
                Task Steps
              </DialogTitle>
              <DialogDescription>
                {selectedTask?.id} • {selectedTask?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {selectedTask?.steps.map((step) => (
                <div 
                  key={step.step}
                  className={`p-3 rounded-lg border flex items-center gap-3 ${
                    step.status === 'done' ? 'bg-emerald-500/10 border-emerald-500/30' :
                    step.status === 'running' ? 'bg-blue-500/10 border-blue-500/30' :
                    'bg-muted/30 border-border'
                  }`}
                >
                  {step.status === 'done' && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                  {step.status === 'running' && <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />}
                  {step.status === 'pending' && <Clock className="h-5 w-5 text-muted-foreground" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium">Step {step.step}: {step.name}</p>
                  </div>
                  <Badge variant="outline" className={
                    step.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' :
                    step.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-muted text-muted-foreground'
                  }>
                    {step.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* ===== LOGS DIALOG ===== */}
        <Dialog open={logsDialogOpen} onOpenChange={setLogsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-400" />
                Task Logs (Read-only)
              </DialogTitle>
              <DialogDescription>
                {selectedTask?.id} • Immutable log trail
              </DialogDescription>
            </DialogHeader>
            <div className="bg-muted/30 p-4 rounded-lg border font-mono text-xs space-y-1 max-h-80 overflow-auto">
              <p className="text-emerald-400">[{format(new Date(), 'HH:mm:ss')}] Task initialized</p>
              <p className="text-muted-foreground">[{format(new Date(Date.now() - 10000), 'HH:mm:ss')}] Starting step 1: Detect Anomaly</p>
              <p className="text-muted-foreground">[{format(new Date(Date.now() - 8000), 'HH:mm:ss')}] Step 1 completed successfully</p>
              <p className="text-muted-foreground">[{format(new Date(Date.now() - 6000), 'HH:mm:ss')}] Starting step 2: Analyze Pattern</p>
              <p className="text-blue-400">[{format(new Date(Date.now() - 4000), 'HH:mm:ss')}] AI confidence: 94%</p>
              <p className="text-muted-foreground">[{format(new Date(Date.now() - 2000), 'HH:mm:ss')}] Step 2 completed successfully</p>
              <p className="text-amber-400">[{format(new Date(), 'HH:mm:ss')}] Currently executing step 3...</p>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
              <span className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Log hash: 0x8f3c...2a9b
              </span>
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Immutable • Read-only
              </span>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </UltraLuxuryLayout>
  );
}
