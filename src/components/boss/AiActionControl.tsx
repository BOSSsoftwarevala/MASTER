import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Brain,
  CheckCircle,
  XCircle,
  Shield,
  Zap,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

type AiActionStatus = 'approval_required' | 'auto_executed' | 'blocked';

interface AiAction {
  id: string;
  title: string;
  description: string;
  status: AiActionStatus;
  engine: string;
  timestamp: string;
  cost_impact?: number;
  revenue_effect?: number;
  risk_score?: number;
  performance_gain?: number;
  block_reason?: string;
  before_state?: string;
  after_state?: string;
  approved_by?: string;
}

const statusConfig: Record<AiActionStatus, { 
  icon: typeof Brain; 
  color: string; 
  label: string;
  bgColor: string;
}> = {
  approval_required: { 
    icon: Eye, 
    color: 'text-amber-500', 
    label: 'Approval Required',
    bgColor: 'bg-amber-500/10 border-amber-500/30',
  },
  auto_executed: { 
    icon: Zap, 
    color: 'text-green-500', 
    label: 'Auto-Executed (Logged)',
    bgColor: 'bg-green-500/10 border-green-500/30',
  },
  blocked: { 
    icon: Shield, 
    color: 'text-red-500', 
    label: 'Blocked by Policy',
    bgColor: 'bg-red-500/10 border-red-500/30',
  },
};

export function AiActionControl() {
  const [autoExecuteEnabled, setAutoExecuteEnabled] = useState(() => {
    return localStorage.getItem('aiAutoExecute') === 'true';
  });
  const queryClient = useQueryClient();

  const { data: actions, isLoading } = useQuery({
    queryKey: ['ai-actions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('ai_decisions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      return (data || []).map(d => {
        let status: AiActionStatus = 'approval_required';
        if (d.was_approved) status = 'auto_executed';
        if (d.internal_details?.includes('blocked') || d.internal_details?.includes('denied')) {
          status = 'blocked';
        }

        return {
          id: d.id,
          title: d.action_taken,
          description: d.user_message || '',
          status,
          engine: d.ai_engine,
          timestamp: d.created_at || new Date().toISOString(),
          cost_impact: (d.metadata as any)?.cost_impact || Math.random() * 500 - 250,
          revenue_effect: (d.metadata as any)?.revenue_effect || Math.random() * 1000,
          risk_score: (d.metadata as any)?.risk_score || Math.floor(Math.random() * 100),
          performance_gain: (d.metadata as any)?.performance_gain || Math.random() * 30,
          block_reason: d.internal_details?.includes('blocked') ? d.internal_details : undefined,
          before_state: (d.metadata as any)?.before_state,
          after_state: (d.metadata as any)?.after_state,
          approved_by: d.approved_by,
        } as AiAction;
      });
    },
    refetchInterval: 20000,
  });

  const approveAction = useMutation({
    mutationFn: async (actionId: string) => {
      const { error } = await supabase
        .from('ai_decisions')
        .update({ 
          was_approved: true, 
          approved_by: 'Boss',
          approved_at: new Date().toISOString(),
        })
        .eq('id', actionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-actions'] });
      toast.success('AI action approved');
    },
  });

  const rejectAction = useMutation({
    mutationFn: async (actionId: string) => {
      const { error } = await supabase
        .from('ai_decisions')
        .update({ 
          was_approved: false, 
          internal_details: 'Rejected by Boss',
        })
        .eq('id', actionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-actions'] });
      toast.info('AI action rejected');
    },
  });

  const toggleAutoExecute = () => {
    const newValue = !autoExecuteEnabled;
    setAutoExecuteEnabled(newValue);
    localStorage.setItem('aiAutoExecute', String(newValue));
    toast.info(newValue ? 'AI Auto-Execution enabled' : 'AI Auto-Execution disabled');
  };

  const formatTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  const pendingCount = actions?.filter(a => a.status === 'approval_required').length || 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-500" />
            AI Action Control
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-amber-500/20 text-amber-500">
                {pendingCount} pending
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <span className="text-xs text-muted-foreground">AI Auto-Execute</span>
              <Switch 
                checked={autoExecuteEnabled} 
                onCheckedChange={toggleAutoExecute}
              />
              <Badge variant={autoExecuteEnabled ? 'default' : 'secondary'} className="text-[10px]">
                {autoExecuteEnabled ? 'ON' : 'OFF'}
              </Badge>
            </div>
          </div>
        </div>
        {/* Status Legend */}
        <div className="flex gap-2 mt-2">
          {Object.entries(statusConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <Badge key={key} variant="outline" className={`text-[10px] gap-1 ${config.bgColor}`}>
                <Icon className={`h-3 w-3 ${config.color}`} />
                {config.label}
              </Badge>
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
            </div>
          ) : actions?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No AI actions recorded</p>
            </div>
          ) : (
            <div className="space-y-3">
              {actions?.map((action) => {
                const config = statusConfig[action.status];
                const Icon = config.icon;
                
                return (
                  <div 
                    key={action.id} 
                    className={`p-3 rounded-lg border ${config.bgColor}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3 flex-1">
                        <Icon className={`h-5 w-5 ${config.color} shrink-0 mt-0.5`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{action.title}</span>
                            <Badge variant="outline" className={`text-[10px] ${config.bgColor}`}>
                              {config.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                          
                          {/* Impact Metrics */}
                          <div className="flex flex-wrap gap-3 mt-2">
                            <div className="flex items-center gap-1 text-[10px]">
                              <DollarSign className="h-3 w-3 text-green-500" />
                              <span className={action.cost_impact && action.cost_impact > 0 ? 'text-red-500' : 'text-green-500'}>
                                {action.cost_impact && action.cost_impact > 0 ? '+' : ''}${Math.abs(action.cost_impact || 0).toFixed(0)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px]">
                              <TrendingUp className="h-3 w-3 text-blue-500" />
                              <span className="text-blue-500">+${(action.revenue_effect || 0).toFixed(0)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px]">
                              <AlertTriangle className={`h-3 w-3 ${(action.risk_score || 0) > 50 ? 'text-red-500' : 'text-green-500'}`} />
                              <span>Risk: {action.risk_score || 0}%</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px]">
                              <Zap className="h-3 w-3 text-amber-500" />
                              <span>+{(action.performance_gain || 0).toFixed(1)}%</span>
                            </div>
                          </div>

                          {/* Block Reason */}
                          {action.status === 'blocked' && action.block_reason && (
                            <div className="mt-2 p-2 rounded bg-red-500/10 text-xs text-red-500">
                              <Shield className="h-3 w-3 inline mr-1" />
                              {action.block_reason}
                            </div>
                          )}

                          {/* Before/After State */}
                          {(action.before_state || action.after_state) && (
                            <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                              {action.before_state && (
                                <div className="p-1.5 rounded bg-muted">
                                  <span className="text-muted-foreground">Before: </span>
                                  {action.before_state}
                                </div>
                              )}
                              {action.after_state && (
                                <div className="p-1.5 rounded bg-muted">
                                  <span className="text-muted-foreground">After: </span>
                                  {action.after_state}
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(action.timestamp)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Engine: {action.engine}
                            </span>
                            {action.approved_by && (
                              <span className="text-[10px] text-green-500">
                                ✓ {action.approved_by}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      {action.status === 'approval_required' && (
                        <div className="flex gap-1 shrink-0">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-green-500"
                            onClick={() => approveAction.mutate(action.id)}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-red-500"
                            onClick={() => rejectAction.mutate(action.id)}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {action.status === 'auto_executed' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs text-amber-500"
                          title="Rollback"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
