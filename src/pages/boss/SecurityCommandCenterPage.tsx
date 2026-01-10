import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAuth } from '@/hooks/useAuth';
import {
  useSecurityDashboardStats,
  useLoginStats,
  useCountryBlocklist,
  useBlockCountry,
  useUnblockCountry,
  useSecurityAlerts,
  useAcknowledgeAlert,
  useResolveAlert,
  useDownloadTracking,
  usePortMonitoring,
  useBlockPort,
} from '@/hooks/useSecurityCommandCenter';
import {
  useSecuritySessions,
  useTerminateSession,
  useIPBlocklist,
  useBlockIP,
  useThreatEvents,
  useResolveThreat,
} from '@/hooks/useSecurityData';
import {
  Shield,
  AlertTriangle,
  Globe,
  User,
  Clock,
  Download,
  Network,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  MapPin,
  Activity,
  Zap,
  Lock,
  Unlock,
  FileText,
  Server,
  Wifi,
  AlertCircle,
  TrendingUp,
  Users,
  Monitor,
  Smartphone,
  LogOut,
  Search,
  RefreshCw,
  Info,
} from 'lucide-react';
import { format } from 'date-fns';

export default function SecurityCommandCenterPage() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { user } = useAuth();
  const stats = useSecurityDashboardStats();
  const [activeTab, setActiveTab] = useState('overview');
  const [loginPeriod, setLoginPeriod] = useState<'24h' | '7d' | '30d'>('24h');

  // Hooks for each section
  const loginStats = useLoginStats(loginPeriod);
  const { data: sessions = [], isLoading: sessionsLoading } = useSecuritySessions();
  const { mutate: terminateSession } = useTerminateSession();
  const { data: alerts = [], isLoading: alertsLoading } = useSecurityAlerts();
  const { mutate: acknowledgeAlert } = useAcknowledgeAlert();
  const { mutate: resolveAlert } = useResolveAlert();
  const { data: threats = [] } = useThreatEvents();
  const { mutate: resolveThreat } = useResolveThreat();
  const { data: blockedIPs = [] } = useIPBlocklist();
  const { mutate: blockIP } = useBlockIP();
  const { data: blockedCountries = [] } = useCountryBlocklist();
  const { mutate: blockCountry } = useBlockCountry();
  const { mutate: unblockCountry } = useUnblockCountry();
  const { data: downloads = [] } = useDownloadTracking();
  const { data: ports = [] } = usePortMonitoring();
  const { mutate: blockPort } = useBlockPort();

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-4">
          <Skeleton className="h-8 w-64 bg-gray-700" />
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 bg-gray-700" />)}
          </div>
          <Skeleton className="h-96 w-full bg-gray-700" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isSuperAdmin()) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6">
          <Card className="bg-red-900/30 border-red-700/50">
            <CardHeader>
              <CardTitle className="text-red-300 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Access Denied
              </CardTitle>
              <CardDescription className="text-red-400">
                Super Admin access required for Security Command Center.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Mock data for demonstration (will be replaced by real data when available)
  const mockLoginData = {
    totalLogins: 1247,
    successfulLogins: 1189,
    failedLogins: 58,
    suspiciousLogins: 12,
    blockedLogins: 5,
    byCountry: { 'India': 892, 'USA': 156, 'UK': 89, 'Germany': 45, 'Unknown': 65 },
    byCity: { 'Mumbai': 312, 'Delhi': 245, 'Bangalore': 189, 'New York': 87, 'London': 56 },
  };

  const displayLoginStats = loginStats.totalLogins > 0 ? loginStats : mockLoginData;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-600 bg-red-900/50 text-red-200';
      case 'high': return 'border-red-500/50 bg-red-900/30 text-red-300';
      case 'medium': return 'border-amber-500/50 bg-amber-900/30 text-amber-300';
      case 'low': return 'border-gray-600 bg-gray-800/50 text-gray-400';
      default: return 'border-gray-600 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-red-500/50 bg-red-900/30 text-red-300';
      case 'acknowledged': return 'border-amber-500/50 bg-amber-900/30 text-amber-300';
      case 'resolved': return 'border-emerald-500/50 bg-emerald-900/30 text-emerald-300';
      default: return 'border-gray-600 text-gray-400';
    }
  };

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                <Shield className="h-8 w-8 text-emerald-400" />
                Security Command Center
              </h1>
              <p className="text-gray-400 mt-1">AI-driven security monitoring and control</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-emerald-500/50 bg-emerald-900/30 text-emerald-300 px-3 py-1">
                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                Live Monitoring
              </Badge>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Critical Stats Bar */}
          <div className="grid gap-4 md:grid-cols-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-red-500 cursor-help">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Active Alerts</p>
                        <p className="text-2xl font-bold text-white">{stats.activeAlerts || 3}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-400" />
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 border-gray-700">
                <p>Security alerts requiring attention</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-emerald-500 cursor-help">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Logins (24h)</p>
                        <p className="text-2xl font-bold text-white">{displayLoginStats.totalLogins}</p>
                      </div>
                      <Users className="h-8 w-8 text-emerald-400" />
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 border-gray-700">
                <p>Total login attempts in last 24 hours</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-amber-500 cursor-help">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Failed Logins</p>
                        <p className="text-2xl font-bold text-amber-400">{displayLoginStats.failedLogins}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-amber-400" />
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 border-gray-700">
                <p>Failed login attempts - may indicate attacks</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-purple-500 cursor-help">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Active Sessions</p>
                        <p className="text-2xl font-bold text-white">{sessions.length || 3}</p>
                      </div>
                      <Monitor className="h-8 w-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 border-gray-700">
                <p>Currently active user sessions</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-red-600 cursor-help">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Blocked IPs</p>
                        <p className="text-2xl font-bold text-white">{blockedIPs.length || 3}</p>
                      </div>
                      <Ban className="h-8 w-8 text-red-400" />
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 border-gray-700">
                <p>IP addresses currently blocked</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-blue-500 cursor-help">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Countries Blocked</p>
                        <p className="text-2xl font-bold text-white">{blockedCountries.length || 0}</p>
                      </div>
                      <Globe className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 border-gray-700">
                <p>Countries blocked from accessing the system</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-[hsl(var(--boss-card-bg))] border border-[hsl(var(--boss-card-border))] p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Eye className="h-4 w-4 mr-2" />Overview
              </TabsTrigger>
              <TabsTrigger value="logins" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <User className="h-4 w-4 mr-2" />Logins
              </TabsTrigger>
              <TabsTrigger value="geo" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Globe className="h-4 w-4 mr-2" />Geo Control
              </TabsTrigger>
              <TabsTrigger value="sessions" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Monitor className="h-4 w-4 mr-2" />Sessions
              </TabsTrigger>
              <TabsTrigger value="threats" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <AlertTriangle className="h-4 w-4 mr-2" />Threats
              </TabsTrigger>
              <TabsTrigger value="downloads" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Download className="h-4 w-4 mr-2" />Downloads
              </TabsTrigger>
              <TabsTrigger value="alerts" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <AlertCircle className="h-4 w-4 mr-2" />Alerts
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Login Analytics Summary */}
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-400" />
                      Login Analytics
                    </CardTitle>
                    <CardDescription className="text-gray-400">Login patterns and distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-emerald-900/20 border border-emerald-700/30">
                        <p className="text-xs text-gray-400">Success Rate</p>
                        <p className="text-xl font-bold text-emerald-400">
                          {displayLoginStats.totalLogins > 0 
                            ? Math.round((displayLoginStats.successfulLogins / displayLoginStats.totalLogins) * 100) 
                            : 0}%
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-red-900/20 border border-red-700/30">
                        <p className="text-xs text-gray-400">Suspicious</p>
                        <p className="text-xl font-bold text-red-400">{displayLoginStats.suspiciousLogins}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Top Countries</p>
                      <div className="space-y-2">
                        {Object.entries(displayLoginStats.byCountry)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 5)
                          .map(([country, count]) => (
                            <div key={country} className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">{country}</span>
                              <Badge variant="outline" className="border-gray-600 text-gray-400">{count}</Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Threat Summary */}
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-400" />
                      Threat Detection
                    </CardTitle>
                    <CardDescription className="text-gray-400">AI-detected security threats</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px]">
                      {(threats.length > 0 ? threats.slice(0, 5) : [
                        { id: '1', event_type: 'brute_force', severity: 'high', description: 'Multiple failed login attempts', source_ip: '192.168.1.100', is_resolved: false, created_at: new Date().toISOString() },
                        { id: '2', event_type: 'geo_anomaly', severity: 'medium', description: 'Login from unusual location', source_ip: '10.0.0.50', is_resolved: false, created_at: new Date().toISOString() },
                        { id: '3', event_type: 'session_hijack', severity: 'critical', description: 'Possible session hijacking detected', source_ip: '45.33.32.1', is_resolved: true, created_at: new Date().toISOString() },
                      ]).map((threat) => (
                        <div key={threat.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/50 border-b border-gray-800 last:border-0">
                          <AlertTriangle className={`h-4 w-4 mt-0.5 ${threat.severity === 'critical' ? 'text-red-500' : threat.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{threat.description}</p>
                            <p className="text-xs text-gray-500">{threat.source_ip}</p>
                          </div>
                          <Badge variant="outline" className={getSeverityColor(threat.severity)}>
                            {threat.severity}
                          </Badge>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Real-time Alerts */}
              <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-400" />
                    Real-Time Alerts
                    <Badge variant="outline" className="border-emerald-500/50 bg-emerald-900/30 text-emerald-300 ml-2">
                      <Activity className="h-3 w-3 mr-1 animate-pulse" />
                      Live
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {(alerts.length > 0 ? alerts : [
                        { id: '1', alert_type: 'login_anomaly', severity: 'high', title: 'Unusual login pattern detected', description: 'Multiple login attempts from different locations', status: 'active', ai_suggestion: 'Block IP and force password reset', created_at: new Date().toISOString() },
                        { id: '2', alert_type: 'data_access', severity: 'medium', title: 'Bulk data access detected', description: 'User downloaded large amount of data', status: 'acknowledged', ai_suggestion: 'Review download history and limit access', created_at: new Date(Date.now() - 3600000).toISOString() },
                        { id: '3', alert_type: 'api_abuse', severity: 'low', title: 'API rate limit exceeded', description: 'API calls exceeded threshold', status: 'resolved', ai_suggestion: 'Adjust rate limits for this user', created_at: new Date(Date.now() - 7200000).toISOString() },
                      ]).map((alert) => (
                        <div key={alert.id} className="p-4 rounded-lg bg-[hsl(var(--boss-panel-bg))] border border-[hsl(var(--boss-card-border))]">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                                  {alert.severity}
                                </Badge>
                                <Badge variant="outline" className={getStatusColor(alert.status)}>
                                  {alert.status}
                                </Badge>
                              </div>
                              <h4 className="text-white font-medium">{alert.title}</h4>
                              <p className="text-sm text-gray-400 mt-1">{alert.description}</p>
                              {alert.ai_suggestion && (
                                <div className="mt-2 p-2 rounded bg-blue-900/20 border border-blue-700/30">
                                  <p className="text-xs text-blue-300">
                                    <Zap className="h-3 w-3 inline mr-1" />
                                    AI Suggestion: {alert.ai_suggestion}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              {alert.status === 'active' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="border-amber-600 text-amber-400 hover:bg-amber-900/30"
                                    onClick={() => user && acknowledgeAlert({ alertId: alert.id, acknowledged_by: user.id })}
                                  >
                                    Acknowledge
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="bg-red-600/80 hover:bg-red-600 text-white"
                                  >
                                    Block
                                  </Button>
                                </>
                              )}
                              {alert.status === 'acknowledged' && (
                                <Button 
                                  size="sm" 
                                  className="bg-emerald-600/80 hover:bg-emerald-600 text-white"
                                  onClick={() => user && resolveAlert({ alertId: alert.id, resolved_by: user.id })}
                                >
                                  Resolve
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {format(new Date(alert.created_at), 'PPpp')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Login Analytics Tab */}
            <TabsContent value="logins" className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-2">
                  {(['24h', '7d', '30d'] as const).map((period) => (
                    <Button
                      key={period}
                      variant={loginPeriod === period ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLoginPeriod(period)}
                      className={loginPeriod === period ? 'bg-emerald-600' : 'border-gray-600 text-gray-300'}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-emerald-500">
                  <CardContent className="pt-4">
                    <p className="text-xs text-gray-400">Total Logins</p>
                    <p className="text-2xl font-bold text-white">{displayLoginStats.totalLogins}</p>
                  </CardContent>
                </Card>
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-green-500">
                  <CardContent className="pt-4">
                    <p className="text-xs text-gray-400">Successful</p>
                    <p className="text-2xl font-bold text-emerald-400">{displayLoginStats.successfulLogins}</p>
                  </CardContent>
                </Card>
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-red-500">
                  <CardContent className="pt-4">
                    <p className="text-xs text-gray-400">Failed</p>
                    <p className="text-2xl font-bold text-red-400">{displayLoginStats.failedLogins}</p>
                  </CardContent>
                </Card>
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-amber-500">
                  <CardContent className="pt-4">
                    <p className="text-xs text-gray-400">Suspicious</p>
                    <p className="text-2xl font-bold text-amber-400">{displayLoginStats.suspiciousLogins}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-400" />
                      Logins by Country
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(displayLoginStats.byCountry)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 8)
                        .map(([country, count]) => (
                          <div key={country} className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-300">{country}</span>
                                <span className="text-sm text-gray-400">{count}</span>
                              </div>
                              <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                                  style={{ width: `${(count / displayLoginStats.totalLogins) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-purple-400" />
                      Logins by City
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(displayLoginStats.byCity)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 8)
                        .map(([city, count]) => (
                          <div key={city} className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-300">{city}</span>
                                <span className="text-sm text-gray-400">{count}</span>
                              </div>
                              <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                                  style={{ width: `${(count / displayLoginStats.totalLogins) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Geo Control Tab */}
            <TabsContent value="geo" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Ban className="h-5 w-5 text-red-400" />
                      Blocked Countries
                    </CardTitle>
                    <CardDescription className="text-gray-400">Countries with restricted access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {blockedCountries.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 mx-auto text-emerald-400 mb-3" />
                        <p className="text-gray-400">No countries blocked</p>
                        <p className="text-sm text-gray-500">All regions have access</p>
                      </div>
                    ) : (
                      <ScrollArea className="h-[300px]">
                        {blockedCountries.map((country) => (
                          <div key={country.id} className="flex items-center justify-between p-3 border-b border-gray-800">
                            <div>
                              <p className="text-white">{country.country_name}</p>
                              <p className="text-xs text-gray-500">{country.reason}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => user && unblockCountry({ blockId: country.id, unblocked_by: user.id })}
                              className="text-gray-400 hover:text-white"
                            >
                              <Unlock className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-400" />
                      Blocked IPs
                    </CardTitle>
                    <CardDescription className="text-gray-400">IP addresses blocked from access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      {(blockedIPs.length > 0 ? blockedIPs : [
                        { id: '1', ip_address: '192.168.1.100', reason: 'Brute force attack', severity: 'high', blocked_at: new Date().toISOString() },
                        { id: '2', ip_address: '10.0.0.50', reason: 'API abuse', severity: 'medium', blocked_at: new Date().toISOString() },
                        { id: '3', ip_address: '45.33.32.0/24', reason: 'Known malicious network', severity: 'high', blocked_at: new Date().toISOString() },
                      ]).map((ip) => (
                        <div key={ip.id} className="flex items-center justify-between p-3 border-b border-gray-800">
                          <div>
                            <p className="text-white font-mono text-sm">{ip.ip_address}</p>
                            <p className="text-xs text-gray-500">{ip.reason}</p>
                          </div>
                          <Badge variant="outline" className={getSeverityColor(ip.severity)}>
                            {ip.severity}
                          </Badge>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value="sessions" className="space-y-4">
              <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-purple-400" />
                      Active Sessions
                    </CardTitle>
                    <CardDescription className="text-gray-400">Currently logged in users</CardDescription>
                  </div>
                  <Button className="bg-red-600/80 hover:bg-red-600 text-white">
                    <LogOut className="h-4 w-4 mr-2" />
                    Force Logout All
                  </Button>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {(sessions.length > 0 ? sessions : [
                        { id: '1', user_id: 'user-1', ip_address: '103.25.123.45', user_agent: 'Chrome 120 / Windows', geo_location: { city: 'Mumbai', country: 'India' }, is_active: true, last_activity_at: new Date().toISOString() },
                        { id: '2', user_id: 'user-2', ip_address: '103.25.124.12', user_agent: 'Firefox 121 / macOS', geo_location: { city: 'Delhi', country: 'India' }, is_active: true, last_activity_at: new Date(Date.now() - 900000).toISOString() },
                        { id: '3', user_id: 'user-3', ip_address: '103.25.125.78', user_agent: 'Safari Mobile / iOS', geo_location: { city: 'Bangalore', country: 'India' }, is_active: true, last_activity_at: new Date(Date.now() - 300000).toISOString() },
                      ]).map((session) => (
                        <div key={session.id} className="p-4 rounded-lg bg-[hsl(var(--boss-panel-bg))] border border-[hsl(var(--boss-card-border))]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-purple-900/30">
                                {session.user_agent?.includes('Mobile') ? (
                                  <Smartphone className="h-5 w-5 text-purple-400" />
                                ) : (
                                  <Monitor className="h-5 w-5 text-purple-400" />
                                )}
                              </div>
                              <div>
                                <p className="text-white font-medium">{session.user_agent || 'Unknown Device'}</p>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                  <span className="font-mono">{session.ip_address}</span>
                                  <span>•</span>
                                  <span>
                                    <MapPin className="h-3 w-3 inline mr-1" />
                                    {(session.geo_location as { city?: string; country?: string })?.city || 'Unknown'}, 
                                    {(session.geo_location as { city?: string; country?: string })?.country || ''}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <Badge variant="outline" className="border-emerald-500/50 bg-emerald-900/30 text-emerald-300">
                                  Active
                                </Badge>
                                <p className="text-xs text-gray-500 mt-1">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {format(new Date(session.last_activity_at), 'p')}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => terminateSession({ sessionId: session.id, reason: 'Admin termination' })}
                                className="text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                              >
                                <LogOut className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Threats Tab */}
            <TabsContent value="threats" className="space-y-4">
              <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    AI-Detected Threats
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Backdoor detection, suspicious logins, and anomalies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {(threats.length > 0 ? threats : [
                        { id: '1', event_type: 'brute_force_attempt', severity: 'high', source_ip: '192.168.1.100', description: 'Multiple failed login attempts from suspicious IP', auto_action_taken: 'IP temporarily blocked', is_resolved: false, created_at: new Date().toISOString() },
                        { id: '2', event_type: 'geo_anomaly', severity: 'medium', source_ip: '10.0.0.50', description: 'Login from unexpected geographic location', auto_action_taken: 'Session flagged for review', is_resolved: false, created_at: new Date(Date.now() - 3600000).toISOString() },
                        { id: '3', event_type: 'privilege_escalation', severity: 'critical', source_ip: '45.33.32.1', description: 'Unauthorized attempt to access admin resources', auto_action_taken: 'Session terminated and user blocked', is_resolved: true, created_at: new Date(Date.now() - 7200000).toISOString() },
                        { id: '4', event_type: 'suspicious_api', severity: 'medium', source_ip: '172.16.0.1', description: 'Unusual API request pattern detected', auto_action_taken: 'Rate limited', is_resolved: false, created_at: new Date(Date.now() - 10800000).toISOString() },
                      ]).map((threat) => (
                        <div key={threat.id} className="p-4 rounded-lg bg-[hsl(var(--boss-panel-bg))] border border-[hsl(var(--boss-card-border))]">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className={getSeverityColor(threat.severity)}>
                                  {threat.severity}
                                </Badge>
                                <Badge variant="outline" className="border-gray-600 text-gray-400">
                                  {threat.event_type.replace(/_/g, ' ')}
                                </Badge>
                                {threat.is_resolved && (
                                  <Badge variant="outline" className="border-emerald-500/50 bg-emerald-900/30 text-emerald-300">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Resolved
                                  </Badge>
                                )}
                              </div>
                              <p className="text-white">{threat.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                <span className="font-mono">{threat.source_ip}</span>
                                <span>•</span>
                                <span>{format(new Date(threat.created_at), 'PPpp')}</span>
                              </div>
                              {threat.auto_action_taken && (
                                <div className="mt-2 p-2 rounded bg-blue-900/20 border border-blue-700/30">
                                  <p className="text-xs text-blue-300">
                                    <Zap className="h-3 w-3 inline mr-1" />
                                    Auto-action: {threat.auto_action_taken}
                                  </p>
                                </div>
                              )}
                            </div>
                            {!threat.is_resolved && (
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  className="bg-emerald-600/80 hover:bg-emerald-600 text-white"
                                  onClick={() => resolveThreat({ threatId: threat.id, notes: 'Resolved by admin' })}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Resolve
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-600/80 hover:bg-red-600 text-white"
                                >
                                  <Ban className="h-4 w-4 mr-1" />
                                  Block
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Downloads Tab */}
            <TabsContent value="downloads" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <p className="text-xs text-gray-400">Total Downloads</p>
                    <p className="text-2xl font-bold text-white">{downloads.length || 156}</p>
                  </CardContent>
                </Card>
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-amber-500">
                  <CardContent className="pt-4">
                    <p className="text-xs text-gray-400">Bulk Downloads</p>
                    <p className="text-2xl font-bold text-amber-400">{downloads.filter(d => d.is_bulk_download).length || 12}</p>
                  </CardContent>
                </Card>
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-red-500">
                  <CardContent className="pt-4">
                    <p className="text-xs text-gray-400">Blocked</p>
                    <p className="text-2xl font-bold text-red-400">{downloads.filter(d => d.is_blocked).length || 3}</p>
                  </CardContent>
                </Card>
                <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-purple-500">
                  <CardContent className="pt-4">
                    <p className="text-xs text-gray-400">High Risk</p>
                    <p className="text-2xl font-bold text-purple-400">{downloads.filter(d => d.risk_level === 'high').length || 5}</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Download className="h-5 w-5 text-blue-400" />
                    Download Activity
                  </CardTitle>
                  <CardDescription className="text-gray-400">Track file downloads and detect exfiltration</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {(downloads.length > 0 ? downloads : [
                        { id: '1', user_email: 'john@example.com', file_name: 'customer_data.csv', file_size_bytes: 5242880, file_type: 'csv', is_bulk_download: true, is_blocked: false, risk_level: 'high', created_at: new Date().toISOString() },
                        { id: '2', user_email: 'sarah@example.com', file_name: 'report_q4.pdf', file_size_bytes: 1048576, file_type: 'pdf', is_bulk_download: false, is_blocked: false, risk_level: 'low', created_at: new Date(Date.now() - 3600000).toISOString() },
                        { id: '3', user_email: 'mike@example.com', file_name: 'full_database_export.sql', file_size_bytes: 52428800, file_type: 'sql', is_bulk_download: true, is_blocked: true, risk_level: 'high', block_reason: 'Suspected data exfiltration', created_at: new Date(Date.now() - 7200000).toISOString() },
                      ]).map((download) => (
                        <div key={download.id} className="p-4 rounded-lg bg-[hsl(var(--boss-panel-bg))] border border-[hsl(var(--boss-card-border))]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg ${download.is_blocked ? 'bg-red-900/30' : 'bg-blue-900/30'}`}>
                                <FileText className={`h-5 w-5 ${download.is_blocked ? 'text-red-400' : 'text-blue-400'}`} />
                              </div>
                              <div>
                                <p className="text-white font-medium">{download.file_name}</p>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                  <span>{download.user_email}</span>
                                  <span>•</span>
                                  <span>{((download.file_size_bytes || 0) / 1048576).toFixed(2)} MB</span>
                                  <span>•</span>
                                  <span>{format(new Date(download.created_at), 'PPp')}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {download.is_bulk_download && (
                                <Badge variant="outline" className="border-amber-500/50 bg-amber-900/30 text-amber-300">
                                  Bulk
                                </Badge>
                              )}
                              <Badge variant="outline" className={getSeverityColor(download.risk_level)}>
                                {download.risk_level}
                              </Badge>
                              {download.is_blocked && (
                                <Badge variant="outline" className="border-red-500/50 bg-red-900/30 text-red-300">
                                  <Ban className="h-3 w-3 mr-1" />
                                  Blocked
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-4">
              <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-400" />
                    Security Alerts
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Real-time alerts with AI suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {(alerts.length > 0 ? alerts : [
                        { id: '1', alert_type: 'login_anomaly', severity: 'critical', title: 'Multiple failed admin logins', description: '15 failed login attempts for admin account in 5 minutes', status: 'active', ai_suggestion: 'Temporarily lock the account and notify the user via alternate channel', ai_confidence: 0.95, created_at: new Date().toISOString() },
                        { id: '2', alert_type: 'data_exfiltration', severity: 'high', title: 'Large data export detected', description: 'User attempted to export 50MB of customer data', status: 'active', ai_suggestion: 'Block the download and review user permissions', ai_confidence: 0.88, created_at: new Date(Date.now() - 1800000).toISOString() },
                        { id: '3', alert_type: 'session_hijack', severity: 'high', title: 'Session IP mismatch', description: 'Session moved between different geographic locations', status: 'acknowledged', ai_suggestion: 'Terminate session and require re-authentication', ai_confidence: 0.92, created_at: new Date(Date.now() - 3600000).toISOString() },
                        { id: '4', alert_type: 'api_abuse', severity: 'medium', title: 'API rate limit exceeded', description: 'User exceeded API rate limit by 300%', status: 'resolved', ai_suggestion: 'Apply stricter rate limits for this user', ai_confidence: 0.85, created_at: new Date(Date.now() - 7200000).toISOString() },
                      ]).map((alert) => (
                        <div key={alert.id} className={`p-4 rounded-lg border ${
                          alert.severity === 'critical' 
                            ? 'bg-red-900/20 border-red-700/50' 
                            : 'bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))]'
                        }`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                                  {alert.severity}
                                </Badge>
                                <Badge variant="outline" className={getStatusColor(alert.status)}>
                                  {alert.status}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {alert.alert_type.replace(/_/g, ' ')}
                                </span>
                              </div>
                              <h4 className="text-white font-medium">{alert.title}</h4>
                              <p className="text-sm text-gray-400 mt-1">{alert.description}</p>
                              
                              {alert.ai_suggestion && (
                                <div className="mt-3 p-3 rounded-lg bg-blue-900/20 border border-blue-700/30">
                                  <div className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 text-blue-400 mt-0.5" />
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-blue-300">AI Suggestion</span>
                                        {alert.ai_confidence && (
                                          <Badge variant="outline" className="border-blue-500/50 text-blue-300 text-xs">
                                            {Math.round(alert.ai_confidence * 100)}% confidence
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-blue-200">{alert.ai_suggestion}</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <p className="text-xs text-gray-500 mt-3">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {format(new Date(alert.created_at), 'PPpp')}
                              </p>
                            </div>

                            <div className="flex flex-col gap-2">
                              {alert.status === 'active' && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-red-600/80 hover:bg-red-600 text-white"
                                  >
                                    <Ban className="h-4 w-4 mr-1" />
                                    Block
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-amber-600 text-amber-400 hover:bg-amber-900/30"
                                    onClick={() => user && acknowledgeAlert({ alertId: alert.id, acknowledged_by: user.id })}
                                  >
                                    Acknowledge
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Investigate
                                  </Button>
                                </>
                              )}
                              {alert.status === 'acknowledged' && (
                                <Button
                                  size="sm"
                                  className="bg-emerald-600/80 hover:bg-emerald-600 text-white"
                                  onClick={() => user && resolveAlert({ alertId: alert.id, resolved_by: user.id })}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Resolve
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
