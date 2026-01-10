import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingDown, Zap, PiggyBank, CheckCircle, Clock, RotateCcw, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function CostOptimizerPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['cost-optimizer-suggestions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cost_optimizer_suggestions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: costLimits, isLoading: limitsLoading } = useQuery({
    queryKey: ['ai-cost-limits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_cost_limits')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    }
  });

  const applySuggestion = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cost_optimizer_suggestions')
        .update({ 
          status: 'applied', 
          auto_applied: false,
          applied_at: new Date().toISOString()
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cost-optimizer-suggestions'] });
      toast({ title: 'Optimization applied successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to apply optimization', variant: 'destructive' });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"><CheckCircle className="h-3 w-3 mr-1" />Applied</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><RotateCcw className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, string> = {
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    return <Badge className={config[priority] || 'bg-muted'}>{priority}</Badge>;
  };

  const getSuggestionTypeBadge = (type: string) => {
    const config: Record<string, { color: string; label: string }> = {
      model_switch: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Switch Model' },
      batch_processing: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Batch Processing' },
      cache_optimization: { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', label: 'Cache Optimization' },
      reduce_frequency: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'Reduce Frequency' }
    };
    const c = config[type] || { color: 'bg-muted', label: type };
    return <Badge className={c.color}>{c.label}</Badge>;
  };

  const totalProjectedSavings = suggestions?.filter(s => s.status === 'pending').reduce((sum, s) => sum + Number(s.projected_savings || 0), 0) || 0;
  const totalAppliedSavings = suggestions?.filter(s => s.status === 'applied').reduce((sum, s) => sum + Number(s.projected_savings || 0), 0) || 0;
  const pendingCount = suggestions?.filter(s => s.status === 'pending').length || 0;
  const appliedCount = suggestions?.filter(s => s.status === 'applied').length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Cost Optimizer Engine</h1>
            <p className="text-muted-foreground">AI-powered cost reduction and budget enforcement</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <TrendingDown className="h-4 w-4 mr-2" />
            Run Optimization Scan
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <PiggyBank className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Potential Savings</p>
                  <p className="text-2xl font-bold text-emerald-400">${totalProjectedSavings.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <DollarSign className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applied Savings</p>
                  <p className="text-2xl font-bold text-blue-400">${totalAppliedSavings.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <CheckCircle className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applied</p>
                  <p className="text-2xl font-bold">{appliedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Limits by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Budget Limits by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {limitsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
              ) : costLimits && costLimits.length > 0 ? (
                <div className="space-y-4">
                  {costLimits.map((limit) => {
                    const dailyUsagePercent = limit.daily_limit > 0 
                      ? Math.min(100, (Number(limit.current_daily_usage) / Number(limit.daily_limit)) * 100) 
                      : 0;
                    const monthlyUsagePercent = limit.monthly_limit > 0 
                      ? Math.min(100, (Number(limit.current_monthly_usage) / Number(limit.monthly_limit)) * 100) 
                      : 0;
                    const isWarning = monthlyUsagePercent >= (limit.alert_threshold_percent || 80);
                    
                    return (
                      <div key={limit.id} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium capitalize">{limit.category.replace('_', ' ')} AI</h4>
                          <Badge className={isWarning ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}>
                            {monthlyUsagePercent.toFixed(0)}% used
                          </Badge>
                        </div>
                        <Progress value={monthlyUsagePercent} className="h-2 mb-3" />
                        <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="block text-xs">Daily</span>
                            <span className="font-medium text-foreground">${Number(limit.current_daily_usage).toFixed(0)} / ${Number(limit.daily_limit).toFixed(0)}</span>
                          </div>
                          <div>
                            <span className="block text-xs">Monthly</span>
                            <span className="font-medium text-foreground">${Number(limit.current_monthly_usage).toFixed(0)} / ${Number(limit.monthly_limit).toFixed(0)}</span>
                          </div>
                          <div>
                            <span className="block text-xs">Auto-Pause</span>
                            <span className="font-medium text-foreground">{limit.auto_pause_on_limit ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <PiggyBank className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No budget limits configured</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Optimization Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Optimization Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {suggestionsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full" />)}
                </div>
              ) : suggestions && suggestions.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getSuggestionTypeBadge(suggestion.suggestion_type)}
                          {getPriorityBadge(suggestion.priority)}
                        </div>
                        {getStatusBadge(suggestion.status)}
                      </div>
                      <p className="text-sm font-medium mb-1">{suggestion.recommendation}</p>
                      <p className="text-xs text-muted-foreground mb-2">Target: {suggestion.target_service}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Current: <span className="text-foreground">${Number(suggestion.current_cost).toFixed(2)}</span>
                          </span>
                          <span className="text-emerald-400">
                            Save: ${Number(suggestion.projected_savings).toFixed(2)}
                          </span>
                        </div>
                        {suggestion.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => applySuggestion.mutate(suggestion.id)}
                            disabled={applySuggestion.isPending}
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-emerald-500" />
                  <p>No optimization suggestions - costs are optimized</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Optimization Strategies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-blue-500" />
              Active Optimization Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  <h4 className="font-medium">Smart Model Switching</h4>
                </div>
                <p className="text-sm text-muted-foreground">Switch to cheaper AI models for simple tasks</p>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Active</Badge>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <h4 className="font-medium">Request Throttling</h4>
                </div>
                <p className="text-sm text-muted-foreground">Reduce API frequency during non-peak hours</p>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Active</Badge>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-cyan-400" />
                  <h4 className="font-medium">Response Caching</h4>
                </div>
                <p className="text-sm text-muted-foreground">Cache repeated queries to avoid redundant calls</p>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Active</Badge>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <h4 className="font-medium">Budget Enforcement</h4>
                </div>
                <p className="text-sm text-muted-foreground">Auto-pause services when budget limit reached</p>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}