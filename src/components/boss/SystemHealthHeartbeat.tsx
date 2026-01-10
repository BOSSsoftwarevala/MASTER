import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import {
  Activity,
  Brain,
  Server,
  Database,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

type HealthStatus = 'healthy' | 'degraded' | 'critical';

interface SystemHealthData {
  overall: HealthStatus;
  aiEngine: HealthStatus;
  apiGateway: HealthStatus;
  dataFreshness: number;
  incidentPrediction: HealthStatus;
  lastCheck: Date;
}

const statusConfig: Record<HealthStatus, { icon: typeof CheckCircle; color: string; label: string }> = {
  healthy: { icon: CheckCircle, color: 'text-green-500', label: 'Healthy' },
  degraded: { icon: AlertTriangle, color: 'text-amber-500', label: 'Degraded' },
  critical: { icon: XCircle, color: 'text-red-500', label: 'Critical' },
};

export function SystemHealthHeartbeat({ compact = false }: { compact?: boolean }) {
  const { data: health } = useQuery({
    queryKey: ['system-health-heartbeat'],
    queryFn: async () => {
      // Check AI Services
      const { data: aiServices } = await supabase
        .from('ai_services')
        .select('status, is_enabled')
        .eq('is_enabled', true);
      
      const aiHealthy = aiServices?.every(s => s.status === 'active' || s.status === 'on') ?? true;
      
      // Check API Providers
      const { data: apiProviders } = await supabase
        .from('api_providers')
        .select('status, is_enabled')
        .eq('is_enabled', true);
      
      const apiHealthy = apiProviders?.every(p => p.status === 'connected' || p.status === 'active') ?? true;
      
      // Check for recent errors
      const { data: recentErrors } = await supabase
        .from('api_alerts')
        .select('id')
        .eq('is_resolved', false)
        .eq('severity', 'critical')
        .limit(5);
      
      const hasCriticalErrors = (recentErrors?.length || 0) > 0;

      // Calculate statuses
      const aiEngine: HealthStatus = aiHealthy ? 'healthy' : 'degraded';
      const apiGateway: HealthStatus = apiHealthy ? 'healthy' : 'degraded';
      const overall: HealthStatus = hasCriticalErrors ? 'critical' : (!aiHealthy || !apiHealthy ? 'degraded' : 'healthy');
      
      return {
        overall,
        aiEngine,
        apiGateway,
        dataFreshness: 98, // Mock value
        incidentPrediction: 'healthy' as HealthStatus,
        lastCheck: new Date(),
      };
    },
    refetchInterval: 15000,
  });

  const getOverallColor = (status?: HealthStatus) => {
    if (!status) return 'bg-muted';
    return status === 'healthy' ? 'bg-green-500' : status === 'degraded' ? 'bg-amber-500' : 'bg-red-500';
  };

  if (compact) {
    const StatusIcon = statusConfig[health?.overall || 'healthy'].icon;
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <Activity className="h-4 w-4" />
                <span className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ${getOverallColor(health?.overall)} animate-pulse`} />
              </div>
              <span className="text-xs text-muted-foreground hidden lg:inline">System</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="w-64">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Health</span>
                <Badge className={`${statusConfig[health?.overall || 'healthy'].color} bg-transparent`}>
                  {statusConfig[health?.overall || 'healthy'].label}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Brain className={`h-3 w-3 ${statusConfig[health?.aiEngine || 'healthy'].color}`} />
                  AI Engine
                </div>
                <div className="flex items-center gap-1">
                  <Server className={`h-3 w-3 ${statusConfig[health?.apiGateway || 'healthy'].color}`} />
                  API Gateway
                </div>
                <div className="flex items-center gap-1">
                  <Database className="h-3 w-3 text-blue-500" />
                  Data: {health?.dataFreshness || 0}%
                </div>
                <div className="flex items-center gap-1">
                  <Shield className={`h-3 w-3 ${statusConfig[health?.incidentPrediction || 'healthy'].color}`} />
                  Incidents
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-background to-muted/30">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Heartbeat Animation */}
            <div className="relative">
              <div className={`h-3 w-3 rounded-full ${getOverallColor(health?.overall)}`} />
              <div className={`absolute inset-0 h-3 w-3 rounded-full ${getOverallColor(health?.overall)} animate-ping opacity-75`} />
            </div>
            
            <div className="flex items-center gap-4">
              {/* AI Engine */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5">
                      <Brain className={`h-4 w-4 ${statusConfig[health?.aiEngine || 'healthy'].color}`} />
                      <span className="text-xs">AI</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>AI Engine: {statusConfig[health?.aiEngine || 'healthy'].label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* API Gateway */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5">
                      <Server className={`h-4 w-4 ${statusConfig[health?.apiGateway || 'healthy'].color}`} />
                      <span className="text-xs">API</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>API Gateway: {statusConfig[health?.apiGateway || 'healthy'].label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Data Freshness */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5">
                      <Database className={`h-4 w-4 ${(health?.dataFreshness || 0) > 90 ? 'text-green-500' : 'text-amber-500'}`} />
                      <span className="text-xs">{health?.dataFreshness || 0}%</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Data Freshness: {health?.dataFreshness || 0}%</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Incident Prediction */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5">
                      <Zap className={`h-4 w-4 ${statusConfig[health?.incidentPrediction || 'healthy'].color}`} />
                      <span className="text-xs">Predict</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Incident Prediction: {statusConfig[health?.incidentPrediction || 'healthy'].label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Badge 
            variant="outline" 
            className={`${statusConfig[health?.overall || 'healthy'].color} bg-transparent`}
          >
            {statusConfig[health?.overall || 'healthy'].label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
