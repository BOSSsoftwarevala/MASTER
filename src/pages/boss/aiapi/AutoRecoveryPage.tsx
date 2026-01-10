import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, CheckCircle, AlertTriangle, XCircle, Zap, Shield, Clock, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { format } from 'date-fns';

export default function AutoRecoveryPage() {
  const { data: recoveryLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['auto-recovery-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auto_recovery_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    }
  });

  const { data: fallbackRules, isLoading: rulesLoading } = useQuery({
    queryKey: ['fallback-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fallback_rules')
        .select('*')
        .order('priority', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"><CheckCircle className="h-3 w-3 mr-1" />Success</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTriggerTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      timeout: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      rate_limit: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      connection_error: 'bg-red-500/20 text-red-400 border-red-500/30',
      server_error: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      api_failure: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    return <Badge className={colors[type] || 'bg-muted'}>{type.replace('_', ' ')}</Badge>;
  };

  const getFallbackTypeBadge = (type: string) => {
    const config: Record<string, { color: string; label: string }> = {
      cached_data: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Cached Data' },
      default_response: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Default Response' },
      alternative_service: { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', label: 'Alternative Service' },
      safe_mode: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Safe Mode' }
    };
    const c = config[type] || { color: 'bg-muted', label: type };
    return <Badge className={c.color}>{c.label}</Badge>;
  };

  const successCount = recoveryLogs?.filter(e => e.recovery_status === 'success').length || 0;
  const totalCount = recoveryLogs?.length || 0;
  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 100;
  const silentRecoveries = recoveryLogs?.filter(e => e.silent_recovery).length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Auto Recovery Engine</h1>
            <p className="text-muted-foreground">Self-healing system that fixes issues automatically without user impact</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Run Health Check
          </Button>
        </div>

        {/* Safe Mode Notice */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="font-medium text-foreground">Positive Response Engine Active</p>
                <p className="text-sm text-muted-foreground">
                  Users never see technical errors. All failures are converted to friendly messages while the system auto-recovers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Recovery Rate</p>
                  <p className="text-2xl font-bold text-emerald-400">{successRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Zap className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Recoveries</p>
                  <p className="text-2xl font-bold">{totalCount}</p>
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
                  <p className="text-sm text-muted-foreground">Silent Recoveries</p>
                  <p className="text-2xl font-bold">{silentRecoveries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Settings className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Rules</p>
                  <p className="text-2xl font-bold">{fallbackRules?.filter(r => r.is_enabled).length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fallback Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                Fallback Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rulesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
              ) : fallbackRules && fallbackRules.length > 0 ? (
                <div className="space-y-3">
                  {fallbackRules.map((rule) => (
                    <div key={rule.id} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">{rule.service_type.replace('_', ' ')}</h4>
                        <Switch checked={rule.is_enabled} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Type: {rule.fallback_type}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getFallbackTypeBadge(rule.fallback_type)}
                        <Badge variant="outline">Priority: {rule.priority}</Badge>
                      </div>
                      {rule.positive_message && (
                        <p className="text-xs text-emerald-400 mt-2">
                          User sees: "{rule.positive_message}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No fallback rules configured</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Recovery Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-500" />
                Recent Recovery Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
              ) : recoveryLogs && recoveryLogs.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {recoveryLogs.map((log) => (
                    <div key={log.id} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        {getTriggerTypeBadge(log.trigger_type)}
                        {getStatusBadge(log.recovery_status)}
                      </div>
                      <p className="text-sm font-medium mb-1">{log.recovery_action}</p>
                      {log.original_error && (
                        <p className="text-xs text-red-400 mb-1">Error: {log.original_error}</p>
                      )}
                      {log.silent_recovery && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-xs mb-1">Silent Recovery</Badge>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          Source: {log.trigger_source || 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), 'MMM d, HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-emerald-500" />
                  <p>No recovery events - system running smoothly</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recovery Strategies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              Active Recovery Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-400" />
                  <h4 className="font-medium">Timeout Retry</h4>
                </div>
                <p className="text-sm text-muted-foreground">Retry with exponential backoff on API timeouts</p>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Active</Badge>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="h-5 w-5 text-blue-400" />
                  <h4 className="font-medium">Provider Failover</h4>
                </div>
                <p className="text-sm text-muted-foreground">Switch to backup provider on rate limits</p>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Active</Badge>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-purple-400" />
                  <h4 className="font-medium">Cached Response</h4>
                </div>
                <p className="text-sm text-muted-foreground">Serve cached data when live data unavailable</p>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Active</Badge>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-emerald-400" />
                  <h4 className="font-medium">Graceful Degradation</h4>
                </div>
                <p className="text-sm text-muted-foreground">Reduce functionality instead of failing</p>
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}