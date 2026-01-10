import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, AlertTriangle, TrendingUp, Shield, CheckCircle, Clock, Zap } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function IncidentPredictionPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ['incident-predictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incident_predictions')
        .select('*')
        .order('risk_score', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const resolvePrediction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('incident_predictions')
        .update({ 
          status: 'resolved', 
          resolved_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident-predictions'] });
      toast({ title: 'Prediction marked as resolved' });
    },
    onError: () => {
      toast({ title: 'Failed to resolve prediction', variant: 'destructive' });
    }
  });

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  const getPredictionTypeBadge = (type: string) => {
    const config: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
      cpu_spike: { icon: <Zap className="h-3 w-3" />, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', label: 'CPU Spike' },
      latency_degradation: { icon: <Clock className="h-3 w-3" />, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Latency Degradation' },
      cost_overrun: { icon: <TrendingUp className="h-3 w-3" />, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Cost Overrun' },
      traffic_spike: { icon: <TrendingUp className="h-3 w-3" />, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', label: 'Traffic Spike' },
      error_rate_increase: { icon: <AlertTriangle className="h-3 w-3" />, color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Error Rate' },
      memory_pressure: { icon: <AlertTriangle className="h-3 w-3" />, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'Memory Pressure' }
    };
    const c = config[type] || { icon: <AlertTriangle className="h-3 w-3" />, color: 'bg-muted', label: type.replace('_', ' ') };
    return <Badge className={c.color}>{c.icon}<span className="ml-1">{c.label}</span></Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'resolved':
      case 'mitigated':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>;
      case 'occurred':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><AlertTriangle className="h-3 w-3 mr-1" />Occurred</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const activePredictions = predictions?.filter(p => p.status !== 'resolved' && p.status !== 'mitigated') || [];
  const resolvedPredictions = predictions?.filter(p => p.status === 'resolved' || p.status === 'mitigated') || [];
  const highRiskCount = activePredictions.filter(p => Number(p.risk_score) >= 70).length;
  const mediumRiskCount = activePredictions.filter(p => Number(p.risk_score) >= 40 && Number(p.risk_score) < 70).length;
  const autoActionCount = activePredictions.filter(p => p.is_auto_action_enabled).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Incident Prediction Engine</h1>
            <p className="text-muted-foreground">AI-powered prediction to prevent issues before they happen</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Brain className="h-4 w-4 mr-2" />
            Run Prediction Scan
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                  <p className="text-2xl font-bold text-red-400">{highRiskCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <TrendingUp className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Medium Risk</p>
                  <p className="text-2xl font-bold text-amber-400">{mediumRiskCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-emerald-400">{resolvedPredictions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Zap className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Auto-Actions</p>
                  <p className="text-2xl font-bold">{autoActionCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              Active Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {predictionsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
              </div>
            ) : activePredictions.length > 0 ? (
              <div className="space-y-4">
                {activePredictions.map((prediction) => {
                  const riskScore = Number(prediction.risk_score) || 0;
                  return (
                    <div key={prediction.id} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getPredictionTypeBadge(prediction.prediction_type)}
                          {getStatusBadge(prediction.status)}
                          {prediction.is_auto_action_enabled && (
                            <Badge className="bg-blue-500/20 text-blue-400">Auto-Action Enabled</Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`text-2xl font-bold ${getRiskColor(riskScore)}`}>
                            {riskScore}%
                          </span>
                          <p className="text-xs text-muted-foreground">Risk Score</p>
                        </div>
                      </div>
                      
                      <Progress 
                        value={riskScore} 
                        className="h-2 mb-3"
                      />
                      
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">{prediction.predicted_incident}</p>
                        {prediction.suggested_action && (
                          <p className="text-sm text-muted-foreground">
                            <span className="text-emerald-400">Suggested:</span> {prediction.suggested_action}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          <span>Affects: {prediction.affected_service || 'Unknown'}</span>
                          <span className="mx-2">•</span>
                          <span>{format(new Date(prediction.created_at), 'MMM d, HH:mm')}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => resolvePrediction.mutate(prediction.id)}
                          disabled={resolvePrediction.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50 text-emerald-500" />
                <p className="text-lg font-medium text-foreground">All Systems Healthy</p>
                <p className="text-sm">No predicted incidents at this time</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prediction Monitors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-500" />
              Active Monitoring Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-orange-400" />
                  <h4 className="font-medium">CPU Usage Monitor</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Predict spikes based on usage patterns</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400">Warning: 70%</span>
                  <span className="text-red-400">Critical: 90%</span>
                </div>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Active</Badge>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <h4 className="font-medium">Latency Monitor</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Detect API response time degradation</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400">Warning: 500ms</span>
                  <span className="text-red-400">Critical: 2000ms</span>
                </div>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Active</Badge>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <h4 className="font-medium">Cost Monitor</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Predict budget overruns before they happen</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400">Warning: 80%</span>
                  <span className="text-red-400">Critical: 95%</span>
                </div>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Active</Badge>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <h4 className="font-medium">Error Rate Monitor</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Track error patterns across services</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400">Warning: 1%</span>
                  <span className="text-red-400">Critical: 5%</span>
                </div>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Active</Badge>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  <h4 className="font-medium">Traffic Monitor</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Anticipate traffic surges and scale</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400">Warning: 150%</span>
                  <span className="text-red-400">Critical: 200%</span>
                </div>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Active</Badge>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-amber-400" />
                  <h4 className="font-medium">AI Usage Monitor</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Predict token usage and API limits</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400">Warning: 80%</span>
                  <span className="text-red-400">Critical: 95%</span>
                </div>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}