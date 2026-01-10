import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAiApiStats, useApiAlerts, useResolveApiAlert } from '@/hooks/useAiApiManagerData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { RealTimeRefresh, DataSourceBadge } from '@/components/boss/RealTimeRefresh';
import { SystemHealthHeartbeat } from '@/components/boss/SystemHealthHeartbeat';
import { AlertPrioritySystem } from '@/components/boss/AlertPrioritySystem';
import { AiActionControl } from '@/components/boss/AiActionControl';
import { GlobalEventTimeline } from '@/components/boss/GlobalEventTimeline';
import {
  Brain,
  Plug,
  DollarSign,
  AlertTriangle,
  Settings,
  Activity,
  CheckCircle,
  XCircle,
  ChevronRight,
  Bell,
  Cpu,
  Code2,
  Search,
  Target,
  MessageSquare,
  Eye,
  Zap,
} from 'lucide-react';

const categoryIcons: Record<string, typeof Brain> = {
  development: Code2,
  seo: Search,
  lead: Target,
  chatbot: MessageSquare,
  supervisor: Eye,
};

const categoryColors: Record<string, string> = {
  development: 'text-purple-500 bg-purple-500/10',
  seo: 'text-blue-500 bg-blue-500/10',
  lead: 'text-green-500 bg-green-500/10',
  chatbot: 'text-teal-500 bg-teal-500/10',
  supervisor: 'text-amber-500 bg-amber-500/10',
};

const statusColors: Record<string, string> = {
  off: 'bg-muted text-muted-foreground',
  on: 'bg-success/10 text-success',
  limited: 'bg-amber-500/10 text-amber-500',
  scheduled: 'bg-blue-500/10 text-blue-500',
  not_connected: 'bg-muted text-muted-foreground',
  connected: 'bg-success/10 text-success',
  error: 'bg-destructive/10 text-destructive',
  paused: 'bg-amber-500/10 text-amber-500',
};

export default function AiApiManagerPage() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const navigate = useNavigate();
  const { data: stats, isLoading } = useAiApiStats();
  const { data: alerts } = useApiAlerts();
  const resolveAlert = useResolveApiAlert();

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isSuperAdmin()) {
    return <Navigate to="/dashboard/boss" replace />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // Trigger refetch of all queries
    window.location.reload();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* System Health Heartbeat - Always Visible */}
        <SystemHealthHeartbeat />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
              <Brain className="h-8 w-8 text-violet-500" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">AI / API Manager</h1>
              <p className="text-muted-foreground mt-1">Central intelligence & integration hub</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <RealTimeRefresh 
              lastUpdate={lastUpdate}
              onRefresh={handleRefresh}
              isRefreshing={isLoading}
              dataSource="System"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/dashboard/boss/aiapi/logs')}>
                <Activity className="h-4 w-4 mr-2" />
                View Logs
              </Button>
              <Button onClick={() => navigate('/dashboard/boss/aiapi/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-violet-500/5 to-purple-500/5 border-violet-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Services</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      {stats?.activeAiServices} / {stats?.totalAiServices}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Active / Total</p>
                </div>
                <div className="p-3 rounded-lg bg-violet-500/10">
                  <Brain className="h-6 w-6 text-violet-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">API Providers</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      {stats?.connectedApis} / {stats?.totalApiProviders}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Connected / Total</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Plug className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly AI Cost</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(stats?.monthlyAiCost || 0)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-12 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">{stats?.unresolvedAlerts || 0}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Unresolved</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Safe Mode Notice */}
        <Card className="bg-muted/30 border-muted">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium text-foreground">Fail-Safe Mode Active</p>
                <p className="text-sm text-muted-foreground">
                  If any API is not connected, the system runs in demo/safe mode. No errors will be shown to clients.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Services */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-violet-500" />
                    AI Services
                  </CardTitle>
                  <CardDescription>Manage AI capabilities</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/boss/aiapi/ai-services')}>
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))
              ) : (
                stats?.aiServices?.map((service) => {
                  const Icon = categoryIcons[service.category] || Cpu;
                  const colorClass = categoryColors[service.category] || 'text-muted-foreground bg-muted';
                  
                  return (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/dashboard/boss/aiapi/ai-services/${service.service_key}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{service.name}</p>
                          <p className="text-xs text-muted-foreground">{service.model_name || 'Not configured'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[service.status]}>
                          {service.status.toUpperCase()}
                        </Badge>
                        {service.is_enabled ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* API Providers */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Plug className="h-5 w-5 text-blue-500" />
                    API Providers
                  </CardTitle>
                  <CardDescription>External service integrations</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/boss/aiapi/api-providers')}>
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))
              ) : (
                stats?.apiProviders?.slice(0, 6).map((provider) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/dashboard/boss/aiapi/api-providers/${provider.provider_key}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Plug className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{provider.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{provider.category}</p>
                      </div>
                    </div>
                    <Badge className={statusColors[provider.status]}>
                      {provider.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alert Priority System */}
        <AlertPrioritySystem />

        {/* AI Action Control with Decision Traceability */}
        <AiActionControl />

        {/* Global Event Timeline */}
        <GlobalEventTimeline />
      </div>
    </DashboardLayout>
  );
}
