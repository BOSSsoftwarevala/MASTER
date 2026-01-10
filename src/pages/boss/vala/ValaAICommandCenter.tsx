import { useState, useEffect, useRef } from 'react';
import { UltraLuxuryLayout } from '@/components/layout/UltraLuxuryLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useValaAIConfig, useValaAIActionLogs, useValaAIRole, VALA_AI_IDENTITY } from '@/hooks/useValaAI';
import { useAuth } from '@/hooks/useAuth';
import { 
  classifyCommand, 
  executeCommand, 
  rollbackLastAction,
  type CommandPreCheck,
  type CommandResult,
  type CommandStatus
} from '@/lib/valaCommandEngine';
import { 
  Brain, 
  Shield, 
  Activity, 
  Eye, 
  Zap, 
  Lock, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Clock,
  Server,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Bell,
  Settings,
  Cpu,
  Play,
  Pause,
  RotateCcw,
  Send,
  Upload,
  Image,
  History,
  Sparkles,
  Target,
  ArrowUpRight,
  ThumbsUp,
  ThumbsDown,
  Timer,
  GripVertical,
  StopCircle,
  RefreshCw,
  Lightbulb,
  TrendingDown,
  AlertOctagon,
  BrainCircuit,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

// Types
interface AIDecision {
  id: string;
  action: string;
  module: string;
  riskScore: number;
  status: 'auto' | 'manual' | 'pending';
  timestamp: Date;
  impact: string;
}

interface AITask {
  id: string;
  name: string;
  module: string;
  status: 'running' | 'waiting' | 'blocked' | 'done';
  progress: number;
  priority: number;
  slaMinutes: number;
  startedAt: Date;
}

interface CommandHistoryItem {
  id: string;
  command: string;
  result: CommandStatus;
  timestamp: Date;
  aiId: string;
  action: string;
  resultDetails: string;
  rollbackAvailable: boolean;
  confidence: number;
  executionTimeMs: number;
}

interface GrowthRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  category: string;
}

export default function ValaAICommandCenter() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { user } = useAuth();
  const { data: config, isLoading: configLoading } = useValaAIConfig();
  const { data: actionLogs, isLoading: logsLoading } = useValaAIActionLogs(20);
  const { data: roleInfo, isLoading: roleLoading } = useValaAIRole();

  const [systemPulse, setSystemPulse] = useState(true);
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string | null>(null);
  const [autoMode, setAutoMode] = useState(true);
  const [currentResult, setCurrentResult] = useState<CommandResult | null>(null);
  const [preCheck, setPreCheck] = useState<CommandPreCheck | null>(null);
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string | null>(null);
  const commandInputRef = useRef<HTMLTextAreaElement>(null);

  // Mock data for demonstration
  const [decisions] = useState<AIDecision[]>([
    { id: 'DEC-001', action: 'Auto-scaled server cluster', module: 'Server', riskScore: 15, status: 'auto', timestamp: new Date(), impact: 'Performance +23%' },
    { id: 'DEC-002', action: 'Blocked suspicious login attempt', module: 'Security', riskScore: 85, status: 'manual', timestamp: new Date(Date.now() - 300000), impact: 'Threat Mitigated' },
    { id: 'DEC-003', action: 'Optimized query performance', module: 'Development', riskScore: 10, status: 'auto', timestamp: new Date(Date.now() - 600000), impact: 'Latency -45ms' },
    { id: 'DEC-004', action: 'Rerouted traffic to backup', module: 'Server', riskScore: 40, status: 'pending', timestamp: new Date(Date.now() - 900000), impact: 'Uptime Protected' },
  ]);

  const [tasks] = useState<AITask[]>([
    { id: 'TASK-001', name: 'Security Audit Scan', module: 'Security', status: 'running', progress: 67, priority: 1, slaMinutes: 15, startedAt: new Date(Date.now() - 480000) },
    { id: 'TASK-002', name: 'Performance Optimization', module: 'Server', status: 'waiting', progress: 0, priority: 2, slaMinutes: 30, startedAt: new Date() },
    { id: 'TASK-003', name: 'Data Backup Validation', module: 'Development', status: 'done', progress: 100, priority: 3, slaMinutes: 20, startedAt: new Date(Date.now() - 1200000) },
    { id: 'TASK-004', name: 'API Rate Limit Check', module: 'Server', status: 'blocked', progress: 45, priority: 4, slaMinutes: 10, startedAt: new Date(Date.now() - 300000) },
  ]);

  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([
    { id: 'CMD-001', command: 'Scale server cluster to handle peak traffic', result: 'success', timestamp: new Date(Date.now() - 3600000), aiId: 'SUP-AI-000', action: 'Scaled server resources', resultDetails: 'Server capacity increased by 25%', rollbackAvailable: true, confidence: 94, executionTimeMs: 1234 },
    { id: 'CMD-002', command: 'Run security vulnerability scan', result: 'success', timestamp: new Date(Date.now() - 7200000), aiId: 'SUP-AI-000', action: 'Executed security scan', resultDetails: 'No vulnerabilities found', rollbackAvailable: false, confidence: 98, executionTimeMs: 2340 },
    { id: 'CMD-003', command: 'Simulate database failover', result: 'simulated', timestamp: new Date(Date.now() - 10800000), aiId: 'SUP-AI-000', action: 'Dry-run: Database failover test', resultDetails: 'Failover would complete in 12 seconds', rollbackAvailable: false, confidence: 89, executionTimeMs: 890 },
  ]);

  const [recommendations] = useState<GrowthRecommendation[]>([
    { id: 'REC-001', title: 'Optimize Demo Conversion Flow', description: 'Add auto-follow-up emails to increase trial-to-paid conversion by 15%', impact: 'high', confidence: 87, category: 'Conversion' },
    { id: 'REC-002', title: 'Reduce Server Costs', description: 'Consolidate underutilized instances during off-peak hours', impact: 'medium', confidence: 92, category: 'Cost' },
    { id: 'REC-003', title: 'Improve User Retention', description: 'Implement engagement notifications for inactive users', impact: 'high', confidence: 78, category: 'Retention' },
  ]);

  // Live pre-check as user types
  useEffect(() => {
    if (command.trim()) {
      const check = classifyCommand(command);
      setPreCheck(check);
    } else {
      setPreCheck(null);
    }
  }, [command]);

  // Simulate system pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // =============================================
  // EXECUTE COMMAND - Real backend execution
  // =============================================
  const handleExecuteCommand = async () => {
    if (!command.trim()) return;
    
    const check = classifyCommand(command);
    if (!check.isValid && check.intent === 'blocked') {
      setCurrentResult({
        status: 'blocked',
        action: 'Command rejected by safety filter',
        whatChanged: 'Nothing - command was blocked',
        confidence: 100,
        reason: check.reason,
        rollbackAvailable: false,
        executionTimeMs: 0,
        aiActionTaken: false
      });
      return;
    }
    
    setIsProcessing(true);
    setProcessingStage('parsing');
    setCurrentResult(null);
    setLastExecutedCommand(command);
    
    try {
      // Stage 1: Parsing
      await new Promise(r => setTimeout(r, 300));
      setProcessingStage('planning');
      
      // Stage 2: Planning
      await new Promise(r => setTimeout(r, 300));
      setProcessingStage('executing');
      
      // Stage 3: Execute via real backend
      const result = await executeCommand(command, 'execute', user?.id);
      setCurrentResult(result);
      
      // Add to history
      const newHistoryItem: CommandHistoryItem = {
        id: `CMD-${Date.now()}`,
        command: command,
        result: result.status,
        timestamp: new Date(),
        aiId: 'SUP-AI-000',
        action: result.action,
        resultDetails: result.whatChanged,
        rollbackAvailable: result.rollbackAvailable,
        confidence: result.confidence,
        executionTimeMs: result.executionTimeMs
      };
      setCommandHistory(prev => [newHistoryItem, ...prev]);
      setCommand('');
    } catch (err) {
      setCurrentResult({
        status: 'failed',
        action: 'Execution error',
        whatChanged: 'Nothing - an unexpected error occurred',
        confidence: 0,
        reason: err instanceof Error ? err.message : 'Unknown error',
        rollbackAvailable: false,
        executionTimeMs: 0,
        aiActionTaken: false
      });
    } finally {
      setIsProcessing(false);
      setProcessingStage(null);
    }
  };

  // =============================================
  // SIMULATE COMMAND - Dry run only
  // =============================================
  const handleSimulateCommand = async () => {
    if (!command.trim()) return;
    
    setIsProcessing(true);
    setProcessingStage('simulating');
    setCurrentResult(null);
    setLastExecutedCommand(command);
    
    try {
      const result = await executeCommand(command, 'simulate', user?.id);
      setCurrentResult(result);
      
      // Add to history
      const newHistoryItem: CommandHistoryItem = {
        id: `CMD-${Date.now()}`,
        command: command,
        result: 'simulated',
        timestamp: new Date(),
        aiId: 'SUP-AI-000',
        action: result.action,
        resultDetails: result.whatChanged,
        rollbackAvailable: false,
        confidence: result.confidence,
        executionTimeMs: result.executionTimeMs
      };
      setCommandHistory(prev => [newHistoryItem, ...prev]);
    } finally {
      setIsProcessing(false);
      setProcessingStage(null);
    }
  };

  // =============================================
  // ROLLBACK - Undo last action
  // =============================================
  const handleRollback = async () => {
    if (!currentResult?.rollbackAvailable || !lastExecutedCommand) return;
    
    setIsProcessing(true);
    setProcessingStage('rolling_back');
    
    try {
      const result = await rollbackLastAction(`CMD-${Date.now()}`, user?.id);
      setCurrentResult(result);
      
      const rollbackItem: CommandHistoryItem = {
        id: `CMD-${Date.now()}`,
        command: `Rollback: ${lastExecutedCommand}`,
        result: 'success',
        timestamp: new Date(),
        aiId: 'SUP-AI-000',
        action: 'Rollback executed',
        resultDetails: 'Previous state restored',
        rollbackAvailable: false,
        confidence: 100,
        executionTimeMs: result.executionTimeMs
      };
      setCommandHistory(prev => [rollbackItem, ...prev]);
    } finally {
      setIsProcessing(false);
      setProcessingStage(null);
    }
  };

  // =============================================
  // AUTO-FIX - Apply suggested fix
  // =============================================
  const handleAutoFix = async () => {
    if (!currentResult?.autoFixSuggestion) return;
    
    setIsProcessing(true);
    setProcessingStage('auto_fixing');
    
    try {
      const result = await executeCommand(`auto-fix: ${currentResult.autoFixSuggestion}`, 'execute', user?.id);
      setCurrentResult(result);
    } finally {
      setIsProcessing(false);
      setProcessingStage(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'waiting': return 'bg-amber-500';
      case 'blocked': return 'bg-red-500';
      case 'done': return 'bg-emerald-500';
      default: return 'bg-muted';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-emerald-500';
  };

  if (rolesLoading) {
    return (
      <UltraLuxuryLayout role="boss" variant="boss">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
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
                VALA AI Command Center is restricted to Boss/Super Admin only.
              </p>
            </CardContent>
          </Card>
        </div>
      </UltraLuxuryLayout>
    );
  }

  const isLoading = configLoading || logsLoading || roleLoading;

  return (
    <UltraLuxuryLayout role="boss" variant="boss">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`relative p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg ${systemPulse ? 'animate-pulse' : ''}`}>
              <BrainCircuit className="h-8 w-8 text-white" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full border-2 border-background animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {VALA_AI_IDENTITY.BADGE} VALA AI Command Center
              </h1>
              <p className="text-muted-foreground">
                Internal Copilot • AI ID: SUP-AI-{VALA_AI_IDENTITY.ROLE_CODE}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border">
              <span className="text-sm text-muted-foreground">Auto Mode</span>
              <Switch checked={autoMode} onCheckedChange={setAutoMode} />
            </div>
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
              <Activity className="h-4 w-4 mr-2" />
              ACTIVE
            </Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : (
          <Tabs defaultValue="command" className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="command" className="gap-2">
                <Send className="h-4 w-4" /> Command Center
              </TabsTrigger>
              <TabsTrigger value="decisions" className="gap-2">
                <Sparkles className="h-4 w-4" /> Live Decisions
              </TabsTrigger>
              <TabsTrigger value="tasks" className="gap-2">
                <Activity className="h-4 w-4" /> Active Tasks
              </TabsTrigger>
              <TabsTrigger value="queue" className="gap-2">
                <Target className="h-4 w-4" /> Priority Queue
              </TabsTrigger>
              <TabsTrigger value="ceo" className="gap-2">
                <TrendingUp className="h-4 w-4" /> AI CEO Insights
              </TabsTrigger>
              <TabsTrigger value="growth" className="gap-2">
                <Lightbulb className="h-4 w-4" /> Growth
              </TabsTrigger>
            </TabsList>

            {/* Command Center Tab */}
            <TabsContent value="command" className="space-y-6">
              {/* Global Command Input */}
              <Card className="border-blue-500/30 bg-gradient-to-br from-blue-950/20 to-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-blue-400" />
                    AI Command Input
                  </CardTitle>
                  <CardDescription>Natural language → System action. Type any command.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Textarea
                      ref={commandInputRef}
                      placeholder="Example: Scale servers to handle 10x traffic, Run security scan, Optimize database queries..."
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      className="min-h-[100px] pr-24 resize-none bg-background/50"
                      disabled={isProcessing}
                    />
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8" title="Upload file">
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" title="Add image">
                        <Image className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Pre-Check Status */}
                  {preCheck && command.trim() && (
                    <div className={`p-3 rounded-lg border flex items-center gap-3 ${
                      preCheck.intent === 'blocked' ? 'bg-red-950/30 border-red-500/50' :
                      preCheck.intent === 'risky' ? 'bg-amber-950/30 border-amber-500/50' :
                      'bg-emerald-950/30 border-emerald-500/50'
                    }`}>
                      {preCheck.intent === 'blocked' ? (
                        <XCircle className="h-5 w-5 text-red-400" />
                      ) : preCheck.intent === 'risky' ? (
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${
                            preCheck.intent === 'blocked' ? 'border-red-500/50 text-red-400' :
                            preCheck.intent === 'risky' ? 'border-amber-500/50 text-amber-400' :
                            'border-emerald-500/50 text-emerald-400'
                          }`}>
                            {preCheck.intent.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {preCheck.category.toUpperCase()}
                          </Badge>
                          {preCheck.requiresApproval && (
                            <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400">
                              <Lock className="h-3 w-3 mr-1" />
                              Approval Required
                            </Badge>
                          )}
                        </div>
                        {preCheck.reason && (
                          <p className="text-sm text-red-400 mt-1">{preCheck.reason}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Processing Stage Indicator */}
                  {isProcessing && processingStage && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-950/30 border border-blue-500/50">
                      <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                      <span className="text-blue-400 font-medium">
                        {processingStage === 'parsing' && 'AI Parsing command...'}
                        {processingStage === 'planning' && 'AI Planning action...'}
                        {processingStage === 'executing' && 'Executing on backend...'}
                        {processingStage === 'simulating' && 'Running simulation...'}
                        {processingStage === 'rolling_back' && 'Rolling back changes...'}
                        {processingStage === 'auto_fixing' && 'Applying auto-fix...'}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleExecuteCommand} 
                      disabled={!command.trim() || isProcessing || (preCheck && !preCheck.isValid)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                      Execute
                    </Button>
                    <Button 
                      onClick={handleSimulateCommand} 
                      variant="outline" 
                      disabled={!command.trim() || isProcessing}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Simulate
                    </Button>
                    <Button 
                      variant="outline" 
                      disabled={isProcessing || !currentResult?.rollbackAvailable}
                      onClick={handleRollback}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Rollback
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Command Result Panel */}
              {currentResult && (
                <Card className={`border-2 ${
                  currentResult.status === 'success' ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-950/20 to-background' :
                  currentResult.status === 'failed' ? 'border-red-500/50 bg-gradient-to-br from-red-950/20 to-background' :
                  currentResult.status === 'blocked' ? 'border-red-500/50 bg-gradient-to-br from-red-950/20 to-background' :
                  'border-blue-500/50 bg-gradient-to-br from-blue-950/20 to-background'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {currentResult.status === 'success' ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : currentResult.status === 'failed' ? (
                          <XCircle className="h-5 w-5 text-red-400" />
                        ) : currentResult.status === 'blocked' ? (
                          <XCircle className="h-5 w-5 text-red-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-blue-400" />
                        )}
                        Execution Result
                      </CardTitle>
                      <Badge className={`${
                        currentResult.status === 'success' ? 'bg-emerald-600' :
                        currentResult.status === 'failed' ? 'bg-red-600' :
                        currentResult.status === 'blocked' ? 'bg-red-600' :
                        'bg-blue-600'
                      } text-white`}>
                        {currentResult.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">What AI Did</p>
                        <p className="font-medium">{currentResult.action}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">What Changed</p>
                        <p className="font-medium">{currentResult.whatChanged}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Confidence:</span>
                        <Badge variant="outline" className={`${
                          currentResult.confidence >= 85 ? 'border-emerald-500/50 text-emerald-400' :
                          currentResult.confidence >= 70 ? 'border-amber-500/50 text-amber-400' :
                          'border-red-500/50 text-red-400'
                        }`}>
                          {currentResult.confidence}%
                        </Badge>
                      </div>
                      {currentResult.rollbackAvailable && (
                        <div className="flex items-center gap-2">
                          <RotateCcw className="h-4 w-4 text-amber-400" />
                          <span className="text-sm text-amber-400">Rollback Available</span>
                        </div>
                      )}
                    </div>

                    {currentResult.reason && (
                      <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30">
                        <p className="text-sm text-muted-foreground mb-1">Reason:</p>
                        <p className="text-red-400">{currentResult.reason}</p>
                      </div>
                    )}

                    {currentResult.autoFixSuggestion && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-amber-950/30 border border-amber-500/30">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Auto-Fix Suggestion:</p>
                          <p className="text-amber-400">{currentResult.autoFixSuggestion}</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-amber-600 hover:bg-amber-700"
                          onClick={handleAutoFix}
                          disabled={isProcessing}
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Auto-Fix
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Command History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Command History
                  </CardTitle>
                  <CardDescription>Read-only log of all executed commands</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-2">
                      {commandHistory.map((item) => (
                        <div key={item.id} className="p-3 rounded-lg border bg-muted/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                item.result === 'success' ? 'default' : 
                                item.result === 'simulated' ? 'secondary' : 
                                'destructive'
                              } className="text-xs">
                                {item.result.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-muted-foreground font-mono">{item.aiId}</span>
                              {item.rollbackAvailable && (
                                <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400">
                                  <RotateCcw className="h-3 w-3 mr-1" />
                                  Rollback
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {format(item.timestamp, 'HH:mm:ss')}
                            </span>
                          </div>
                          <p className="text-sm font-medium">{item.command}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{item.action}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.confidence}% confidence
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-background">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Commands Today</p>
                        <p className="text-2xl font-bold">47</p>
                      </div>
                      <Send className="h-8 w-8 text-emerald-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-blue-500/30 bg-gradient-to-br from-blue-950/30 to-background">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                        <p className="text-2xl font-bold">98.7%</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-blue-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-amber-500/30 bg-gradient-to-br from-amber-950/30 to-background">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Response</p>
                        <p className="text-2xl font-bold">1.2s</p>
                      </div>
                      <Timer className="h-8 w-8 text-amber-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-purple-500/30 bg-gradient-to-br from-purple-950/30 to-background">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Auto Actions</p>
                        <p className="text-2xl font-bold">156</p>
                      </div>
                      <Zap className="h-8 w-8 text-purple-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Live Decisions Tab */}
            <TabsContent value="decisions" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Real-Time AI Decisions</h2>
                  <p className="text-sm text-muted-foreground">Live feed of all AI-driven decisions</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border">
                  <span className="text-sm text-muted-foreground">Boss Override</span>
                  <Switch checked={!autoMode} onCheckedChange={(v) => setAutoMode(!v)} />
                </div>
              </div>

              <div className="space-y-3">
                {decisions.map((decision) => (
                  <Card key={decision.id} className="hover:border-blue-500/30 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{decision.module}</Badge>
                            <Badge 
                              variant={decision.status === 'auto' ? 'default' : decision.status === 'manual' ? 'secondary' : 'outline'}
                              className={decision.status === 'auto' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                            >
                              {decision.status === 'auto' ? 'Auto-Executed' : decision.status === 'manual' ? 'Manual' : 'Pending Approval'}
                            </Badge>
                          </div>
                          <p className="font-medium">{decision.action}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <ArrowUpRight className="h-3 w-3" />
                              {decision.impact}
                            </span>
                            <span>{format(decision.timestamp, 'HH:mm:ss')}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                          <p className={`text-2xl font-bold ${getRiskColor(decision.riskScore)}`}>
                            {decision.riskScore}%
                          </p>
                        </div>
                      </div>
                      {decision.status === 'pending' && (
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            <ThumbsUp className="h-3 w-3 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <ThumbsDown className="h-3 w-3 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Active Tasks Tab */}
            <TabsContent value="tasks" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">All Running AI Jobs</h2>
                  <p className="text-sm text-muted-foreground">{tasks.filter(t => t.status === 'running').length} running • {tasks.filter(t => t.status === 'waiting').length} waiting</p>
                </div>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <Card key={task.id} className={`${task.status === 'blocked' ? 'border-red-500/30' : ''}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(task.status)} ${task.status === 'running' ? 'animate-pulse' : ''}`} />
                          <span className="font-medium">{task.name}</span>
                          <Badge variant="outline">{task.module}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Timer className="h-3 w-3 mr-1" />
                            SLA: {task.slaMinutes}m
                          </Badge>
                          <Badge variant="outline" className="capitalize">{task.status}</Badge>
                        </div>
                      </div>
                      <Progress value={task.progress} className="h-2 mb-3" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{task.progress}% complete</span>
                        {task.status !== 'done' && (
                          <div className="flex gap-2">
                            {task.status === 'running' && (
                              <Button size="sm" variant="outline">
                                <Pause className="h-3 w-3 mr-1" /> Pause
                              </Button>
                            )}
                            {task.status === 'waiting' && (
                              <Button size="sm" variant="outline">
                                <Play className="h-3 w-3 mr-1" /> Start
                              </Button>
                            )}
                            {task.status === 'blocked' && (
                              <Button size="sm" variant="outline">
                                <RefreshCw className="h-3 w-3 mr-1" /> Retry
                              </Button>
                            )}
                            <Button size="sm" variant="destructive">
                              <StopCircle className="h-3 w-3 mr-1" /> Force Stop
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Priority Queue Tab */}
            <TabsContent value="queue" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Auto-Prioritized Task Queue</h2>
                  <p className="text-sm text-muted-foreground">Sorted by impact + urgency. Drag to reorder (Boss only)</p>
                </div>
              </div>

              <div className="space-y-2">
                {tasks.sort((a, b) => a.priority - b.priority).map((task, index) => (
                  <Card key={task.id} className="cursor-move hover:border-blue-500/30 transition-colors">
                    <CardContent className="py-3">
                      <div className="flex items-center gap-4">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <Badge className="bg-blue-600 text-white min-w-[24px] justify-center">
                          {index + 1}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium">{task.name}</p>
                          <p className="text-sm text-muted-foreground">{task.module}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">SLA Timer</p>
                            <p className="font-mono text-sm">{task.slaMinutes}:00</p>
                          </div>
                          <Badge variant="outline" className={`capitalize ${getStatusColor(task.status).replace('bg-', 'text-')}`}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* AI CEO Insights Tab */}
            <TabsContent value="ceo" className="space-y-6">
              <Card className="border-blue-500/30 bg-gradient-to-br from-blue-950/20 to-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-400" />
                    Daily Executive Summary
                  </CardTitle>
                  <CardDescription>AI-generated insights for {format(new Date(), 'MMMM d, yyyy')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    System health is <span className="text-emerald-500 font-medium">excellent</span> with 99.97% uptime. 
                    Revenue grew <span className="text-emerald-500 font-medium">+12%</span> this week. 
                    3 security threats were <span className="text-blue-400 font-medium">auto-blocked</span>. 
                    Recommended focus: <span className="text-amber-500 font-medium">Demo conversion optimization</span>.
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-emerald-500/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-muted-foreground">Cost Efficiency</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-500">+18%</p>
                    <Progress value={82} className="h-1 mt-2" />
                  </CardContent>
                </Card>
                <Card className="border-red-500/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertOctagon className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-muted-foreground">Risk Level</span>
                    </div>
                    <p className="text-2xl font-bold text-red-500">Low</p>
                    <Progress value={15} className="h-1 mt-2" />
                  </CardContent>
                </Card>
                <Card className="border-blue-500/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">Performance</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-500">A+</p>
                    <Progress value={95} className="h-1 mt-2" />
                  </CardContent>
                </Card>
                <Card className="border-purple-500/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-muted-foreground">Growth</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-500">+12%</p>
                    <Progress value={72} className="h-1 mt-2" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    What To Do Next
                  </CardTitle>
                  <CardDescription>AI-suggested priorities with confidence scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-600">1</Badge>
                        <span>Review pending security approvals (3 items)</span>
                      </div>
                      <Badge variant="outline">94% confidence</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">2</Badge>
                        <span>Optimize slow database queries in Demo module</span>
                      </div>
                      <Badge variant="outline">87% confidence</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">3</Badge>
                        <span>Scale down overnight server instances to save costs</span>
                      </div>
                      <Badge variant="outline">82% confidence</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Growth Recommendations Tab */}
            <TabsContent value="growth" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Growth Recommendations</h2>
                  <p className="text-sm text-muted-foreground">AI-powered suggestions for product & business improvement</p>
                </div>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="hover:border-blue-500/30 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{rec.category}</Badge>
                            <Badge 
                              variant={rec.impact === 'high' ? 'default' : 'secondary'}
                              className={rec.impact === 'high' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                            >
                              {rec.impact.toUpperCase()} IMPACT
                            </Badge>
                          </div>
                          <h3 className="font-semibold mb-1">{rec.title}</h3>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-muted-foreground">Confidence</p>
                          <p className="text-xl font-bold text-blue-500">{rec.confidence}%</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Auto-Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" /> Review Details
                        </Button>
                        <Button size="sm" variant="ghost" className="text-muted-foreground">
                          <XCircle className="h-3 w-3 mr-1" /> Ignore
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Security Footer */}
        <Card className="border-blue-500/30 bg-gradient-to-r from-blue-950/20 via-background to-blue-950/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-muted-foreground">
                  All actions logged • Kill-switch ready • Black-box execution active
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                Role-Locked • No DevTools
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </UltraLuxuryLayout>
  );
}
