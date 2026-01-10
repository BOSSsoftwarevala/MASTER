import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw, Shield, Zap, DollarSign, Filter, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export default function AiDecisionsLogPage() {
  const { data: decisions, isLoading } = useQuery({
    queryKey: ['ai-decisions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_decisions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    }
  });

  const getEngineBadge = (engine: string) => {
    const config: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
      auto_recovery: { icon: <RefreshCw className="h-3 w-3" />, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Auto Recovery' },
      incident_prediction: { icon: <Brain className="h-3 w-3" />, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Incident Prediction' },
      cost_optimizer: { icon: <DollarSign className="h-3 w-3" />, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Cost Optimizer' }
    };
    const c = config[engine] || { icon: <Zap className="h-3 w-3" />, color: 'bg-muted', label: engine };
    return <Badge className={c.color}>{c.icon}<span className="ml-1">{c.label}</span></Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      critical: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return <Badge className={colors[severity] || 'bg-muted'}>{severity}</Badge>;
  };

  const recoveryCount = decisions?.filter(d => d.ai_engine === 'auto_recovery').length || 0;
  const predictionCount = decisions?.filter(d => d.ai_engine === 'incident_prediction').length || 0;
  const costCount = decisions?.filter(d => d.ai_engine === 'cost_optimizer').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Decisions Log</h1>
          <p className="text-muted-foreground">Complete audit trail of all AI automated decisions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Brain className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Decisions</p>
                <p className="text-2xl font-bold">{decisions?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <RefreshCw className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recovery</p>
                <p className="text-2xl font-bold text-emerald-400">{recoveryCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Shield className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prediction</p>
                <p className="text-2xl font-bold text-purple-400">{predictionCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <DollarSign className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cost Optimizer</p>
                <p className="text-2xl font-bold text-cyan-400">{costCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decisions Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Decision History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
          ) : decisions && decisions.length > 0 ? (
            <div className="space-y-4">
              {decisions.map((decision) => (
                <div key={decision.id} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getEngineBadge(decision.ai_engine)}
                      <Badge variant="outline">{decision.decision_type}</Badge>
                      {getSeverityBadge(decision.severity)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(decision.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="mb-2">
                    <p className="text-sm font-medium">Action: {decision.action_taken}</p>
                    {decision.trigger_event && (
                      <p className="text-xs text-muted-foreground">Trigger: {decision.trigger_event}</p>
                    )}
                  </div>

                  {decision.user_message && (
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 mb-2">
                      <p className="text-xs text-muted-foreground">User saw:</p>
                      <p className="text-sm text-emerald-400">"{decision.user_message}"</p>
                    </div>
                  )}

                  {decision.internal_details && (
                    <div className="p-2 rounded bg-muted/50 border border-border/30">
                      <p className="text-xs text-muted-foreground">Internal log:</p>
                      <p className="text-xs font-mono text-muted-foreground">{decision.internal_details}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-2">
                    {decision.affected_entity && (
                      <span className="text-xs text-muted-foreground">
                        Affected: {decision.affected_entity}
                      </span>
                    )}
                    {decision.was_approved && (
                      <Badge className="bg-emerald-500/20 text-emerald-400">Approved</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No AI decisions logged yet</p>
              <p className="text-sm">Decisions will appear here when AI engines take automated actions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
