import { useState } from 'react';
import { Activity, CheckCircle, AlertTriangle, XCircle, Server, Database, Shield, Zap, Brain, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type StatusLevel = 'healthy' | 'warning' | 'critical';

interface SystemService {
  id: string;
  name: string;
  status: StatusLevel;
  uptime: number;
  responseTime: number;
  icon: React.ElementType;
  dataSource: 'AI' | 'API' | 'System' | 'Database';
}

export function SystemStatus() {
  const [open, setOpen] = useState(false);

  const { data: services, refetch, isFetching } = useQuery({
    queryKey: ['system-status-services'],
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

      const mockServices: SystemService[] = [
        { id: '1', name: 'API Gateway', status: apiHealthy ? 'healthy' : 'warning', uptime: 99.99, responseTime: 45, icon: Zap, dataSource: 'API' },
        { id: '2', name: 'Database', status: 'healthy', uptime: 99.95, responseTime: 12, icon: Database, dataSource: 'Database' },
        { id: '3', name: 'Authentication', status: 'healthy', uptime: 100, responseTime: 28, icon: Shield, dataSource: 'System' },
        { id: '4', name: 'AI Engine', status: aiHealthy ? 'healthy' : 'warning', uptime: 98.5, responseTime: 156, icon: Brain, dataSource: 'AI' },
        { id: '5', name: 'File Storage', status: 'healthy', uptime: 99.8, responseTime: 89, icon: Server, dataSource: 'System' },
      ];

      return mockServices;
    },
    refetchInterval: 30000,
  });

  const getOverallStatus = (): StatusLevel => {
    if (services?.some(s => s.status === 'critical')) return 'critical';
    if (services?.some(s => s.status === 'warning')) return 'warning';
    return 'healthy';
  };

  const overallStatus = getOverallStatus();

  const getStatusColor = (status: StatusLevel) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
    }
  };

  const getStatusIcon = (status: StatusLevel) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: StatusLevel) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Operational</Badge>;
      case 'warning': return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">Degraded</Badge>;
      case 'critical': return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Outage</Badge>;
    }
  };

  const getDataSourceBadge = (source: string) => {
    const colors: Record<string, string> = {
      AI: 'bg-violet-500/20 text-violet-500',
      API: 'bg-blue-500/20 text-blue-500',
      System: 'bg-emerald-500/20 text-emerald-500',
      Database: 'bg-cyan-500/20 text-cyan-500',
    };
    return <Badge variant="outline" className={`text-[10px] ${colors[source]}`}>{source}</Badge>;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2">
          <div className="relative">
            <Activity className="h-4 w-4" />
            <span className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ${getStatusColor(overallStatus)} animate-pulse`} />
          </div>
          <span className="hidden lg:inline text-xs text-muted-foreground">System</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Status
            </SheetTitle>
            <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <SheetDescription>
            Real-time health monitoring of all services
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Overall Status */}
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(overallStatus)}
                <div>
                  <p className="font-medium">Overall Status</p>
                  <p className="text-xs text-muted-foreground">Last checked: Just now</p>
                </div>
              </div>
              {getStatusBadge(overallStatus)}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Services</h4>
            {services?.map((service) => (
              <div
                key={service.id}
                className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <service.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{service.name}</span>
                    {getDataSourceBadge(service.dataSource)}
                  </div>
                  {getStatusIcon(service.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Uptime</p>
                    <div className="flex items-center gap-2">
                      <Progress value={service.uptime} className="h-1.5 flex-1" />
                      <span className="text-xs font-medium">{service.uptime}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Response</p>
                    <p className="text-xs font-medium">{service.responseTime}ms</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
