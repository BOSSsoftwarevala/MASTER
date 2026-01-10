import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Globe, CheckCircle, AlertTriangle, XCircle, Plus, RefreshCw, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export default function ApiRegistryPage() {
  const { data: apis, isLoading } = useQuery({
    queryKey: ['api-registry'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_registry')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"><CheckCircle className="h-3 w-3 mr-1" />Healthy</Badge>;
      case 'degraded':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30"><AlertTriangle className="h-3 w-3 mr-1" />Degraded</Badge>;
      case 'unhealthy':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="h-3 w-3 mr-1" />Unhealthy</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      internal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      external: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      third_party: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    };
    return <Badge className={colors[type] || 'bg-muted'}>{type.replace('_', ' ')}</Badge>;
  };

  const healthyCount = apis?.filter(a => a.health_status === 'healthy').length || 0;
  const degradedCount = apis?.filter(a => a.health_status === 'degraded').length || 0;
  const unhealthyCount = apis?.filter(a => a.health_status === 'unhealthy').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Registry</h1>
          <p className="text-muted-foreground">Register and manage all external APIs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Check All Health
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Register API
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Globe className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total APIs</p>
                <p className="text-2xl font-bold">{apis?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Healthy</p>
                <p className="text-2xl font-bold text-emerald-400">{healthyCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Degraded</p>
                <p className="text-2xl font-bold text-amber-400">{degradedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unhealthy</p>
                <p className="text-2xl font-bold text-red-400">{unhealthyCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            Registered APIs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {apis?.map((api) => {
                const usagePercent = api.rate_limit_per_minute 
                  ? Math.round((api.current_usage_minute / api.rate_limit_per_minute) * 100)
                  : 0;
                
                return (
                  <div key={api.id} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-lg">{api.api_name}</h4>
                          {getTypeBadge(api.api_type)}
                          {getHealthBadge(api.health_status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{api.base_url}</p>
                      </div>
                      <Switch checked={api.is_enabled} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Uptime</p>
                        <p className={`font-medium ${Number(api.uptime_percent) >= 99 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {api.uptime_percent}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Response Time</p>
                        <p className="font-medium">{api.response_time_ms || 'N/A'}ms</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Rate Limit</p>
                        <p className="font-medium">{api.rate_limit_per_minute}/min</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Auth Type</p>
                        <p className="font-medium capitalize">{api.auth_type || 'None'}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Usage this minute</span>
                        <span>{api.current_usage_minute}/{api.rate_limit_per_minute}</span>
                      </div>
                      <Progress value={usagePercent} className="h-1.5" />
                    </div>

                    {api.fallback_enabled && (
                      <div className="flex items-center gap-2 mt-3">
                        <Shield className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-emerald-400">Fallback Enabled</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
