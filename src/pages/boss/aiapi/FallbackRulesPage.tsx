import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Plus, MessageSquare, Database, Zap, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export default function FallbackRulesPage() {
  const { data: fallbackRules, isLoading } = useQuery({
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

  const getFallbackTypeIcon = (type: string) => {
    switch (type) {
      case 'cached_data':
        return <Database className="h-4 w-4" />;
      case 'default_response':
        return <MessageSquare className="h-4 w-4" />;
      case 'alternative_service':
        return <Zap className="h-4 w-4" />;
      case 'safe_mode':
        return <Shield className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getFallbackTypeBadge = (type: string) => {
    const config: Record<string, { color: string; label: string }> = {
      cached_data: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Cached Data' },
      default_response: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Default Response' },
      alternative_service: { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', label: 'Alternative Service' },
      safe_mode: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Safe Mode' }
    };
    const c = config[type] || { color: 'bg-muted', label: type };
    return <Badge className={c.color}>{getFallbackTypeIcon(type)}<span className="ml-1">{c.label}</span></Badge>;
  };

  const getServiceTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      ai_service: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      api_provider: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      edge_function: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return <Badge className={colors[type] || 'bg-muted'}>{type.replace('_', ' ')}</Badge>;
  };

  const activeCount = fallbackRules?.filter(r => r.is_enabled).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fallback Rules</h1>
          <p className="text-muted-foreground">Configure graceful degradation for system failures</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Fallback Rule
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/20">
              <Shield className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Positive Response Engine</h3>
              <p className="text-muted-foreground mb-4">
                Users never see raw errors. When a service fails, the system automatically shows a friendly message
                while the real error is logged internally for debugging.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                  <span className="text-sm">{activeCount} Active Rules</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-muted"></div>
                  <span className="text-sm">{(fallbackRules?.length || 0) - activeCount} Disabled</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fallback Rules List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-500" />
            Configured Fallback Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {fallbackRules?.map((rule) => (
                <div key={rule.id} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getServiceTypeBadge(rule.service_type)}
                      {getFallbackTypeBadge(rule.fallback_type)}
                      <Badge variant="outline">Priority: {rule.priority}</Badge>
                    </div>
                    <Switch checked={rule.is_enabled} />
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground mb-1">User Message:</p>
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-sm text-emerald-400 italic">"{rule.positive_message}"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={rule.is_enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted'}>
                      {rule.is_enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Example Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Positive Message Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-center gap-2 mb-2 text-red-400">
                <span className="text-xs font-medium">❌ NEVER SHOW</span>
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                "Error 500: Internal server error. Connection timeout to OpenAI API."
              </p>
            </div>

            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <span className="text-xs font-medium">✓ SHOW THIS</span>
              </div>
              <p className="text-sm text-emerald-400">
                "We're optimizing your request for faster loading. Please wait a moment."
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-center gap-2 mb-2 text-red-400">
                <span className="text-xs font-medium">❌ NEVER SHOW</span>
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                "Database connection failed. PostgreSQL max connections exceeded."
              </p>
            </div>

            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <span className="text-xs font-medium">✓ SHOW THIS</span>
              </div>
              <p className="text-sm text-emerald-400">
                "Loading your data from our optimized cache. This will be quick!"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
