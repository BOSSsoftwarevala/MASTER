import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Eye, 
  Ban, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Activity,
  Users,
  Globe,
  Fingerprint,
  Key,
  ShieldAlert,
  Scan,
  HelpCircle
} from 'lucide-react';
import { useSecurityCommandCenter } from '@/hooks/useSecurityCommandCenter';

export default function ServerSecurityCenterPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    logins, 
    blockedCountries, 
    alerts,
    isLoading,
    unblockCountry,
    criticalAlerts: criticalCount,
    highAlerts: highCount,
    blockedCountriesCount
  } = useSecurityCommandCenter();

  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(r => setTimeout(r, 1500));
    setRefreshing(false);
  };

  const securityScore = Math.max(0, 100 - (criticalCount * 20) - (highCount * 10));

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3 text-[hsl(var(--boss-text))]">
                <Shield className="h-8 w-8 text-[hsl(var(--boss-accent))]" />
                Security Center
              </h1>
              <p className="text-[hsl(var(--boss-text-muted))] mt-1">
                AI-driven security monitoring and threat detection
              </p>
            </div>
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Security Score Card */}
          <Card className="bg-gradient-to-br from-[hsl(var(--boss-card))] to-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={`h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold ${
                    securityScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                    securityScore >= 50 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {securityScore}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[hsl(var(--boss-text))]">Security Score</h2>
                    <p className="text-[hsl(var(--boss-text-muted))]">
                      {securityScore >= 80 ? 'Your system is well protected' :
                       securityScore >= 50 ? 'Some threats require attention' :
                       'Critical issues need immediate action'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
                    <div className="text-xs text-[hsl(var(--boss-text-muted))]">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-400">{highCount}</div>
                    <div className="text-xs text-[hsl(var(--boss-text-muted))]">High</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{blockedCountriesCount}</div>
                    <div className="text-xs text-[hsl(var(--boss-text-muted))]">Blocked</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: Scan, label: 'Run Full Scan', color: 'text-blue-400', bg: 'bg-blue-500/10', action: 'scan' },
              { icon: ShieldAlert, label: 'Block Threats', color: 'text-red-400', bg: 'bg-red-500/10', action: 'block' },
              { icon: Key, label: 'Rotate Keys', color: 'text-amber-400', bg: 'bg-amber-500/10', action: 'rotate' },
              { icon: Lock, label: 'Lock Sessions', color: 'text-emerald-400', bg: 'bg-emerald-500/10', action: 'lock' },
            ].map((item) => (
              <Card 
                key={item.label}
                className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] hover:border-[hsl(var(--boss-accent))]/50 transition-all cursor-pointer group"
              >
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <span className="font-medium text-[hsl(var(--boss-text))]">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Security Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Threats */}
            <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text))]">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    Active Threats
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-[hsl(var(--boss-text-muted))]" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Real-time threats detected by AI</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <CardDescription className="text-[hsl(var(--boss-text-muted))]">
                  AI-detected security issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full bg-[hsl(var(--boss-card-elevated))]" />
                    ))}
                  </div>
                ) : alerts && alerts.length > 0 ? (
                  <div className="space-y-3">
                    {alerts.slice(0, 5).map((alert) => (
                      <div 
                        key={alert.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--boss-card-elevated))] border border-[hsl(var(--boss-border))]"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${
                            alert.severity === 'critical' ? 'bg-red-500 animate-pulse' :
                            alert.severity === 'high' ? 'bg-amber-500' :
                            'bg-blue-500'
                          }`} />
                          <div>
                            <p className="font-medium text-[hsl(var(--boss-text))]">{alert.alert_type}</p>
                            <p className="text-xs text-[hsl(var(--boss-text-muted))]">{alert.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {alert.severity}
                          </Badge>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Ban className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle className="h-12 w-12 text-emerald-400 mb-3" />
                    <p className="text-[hsl(var(--boss-text))]">No active threats</p>
                    <p className="text-sm text-[hsl(var(--boss-text-muted))]">Your system is secure</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Login Analytics */}
            <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text))]">
                    <Users className="h-5 w-5 text-blue-400" />
                    Login Analytics
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-[hsl(var(--boss-text-muted))]" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>User login patterns and locations</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <CardDescription className="text-[hsl(var(--boss-text-muted))]">
                  Recent login activity by location
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full bg-[hsl(var(--boss-card-elevated))]" />
                    ))}
                  </div>
                ) : logins && logins.length > 0 ? (
                  <div className="space-y-3">
                    {logins.slice(0, 5).map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--boss-card-elevated))]"
                      >
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-[hsl(var(--boss-text-muted))]" />
                          <div>
                            <p className="font-medium text-[hsl(var(--boss-text))]">{item.country_code || 'Unknown'}</p>
                            <p className="text-xs text-[hsl(var(--boss-text-muted))]">{item.city || 'Unknown City'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[hsl(var(--boss-text))]">{item.login_status}</p>
                          <p className="text-xs text-[hsl(var(--boss-text-muted))]">login</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Activity className="h-12 w-12 text-[hsl(var(--boss-text-muted))] mb-3" />
                    <p className="text-[hsl(var(--boss-text))]">No login data yet</p>
                    <p className="text-sm text-[hsl(var(--boss-text-muted))]">Data will appear as users log in</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Blocked Countries */}
            <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text))]">
                    <Ban className="h-5 w-5 text-amber-400" />
                    Geo Blocking
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-[hsl(var(--boss-text-muted))]" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Block access from specific countries</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <CardDescription className="text-[hsl(var(--boss-text-muted))]">
                  Countries with blocked access
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full bg-[hsl(var(--boss-card-elevated))]" />
                    ))}
                  </div>
                ) : blockedCountries && blockedCountries.length > 0 ? (
                  <div className="space-y-3">
                    {blockedCountries.slice(0, 5).map((country) => (
                      <div 
                        key={country.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                            <XCircle className="h-4 w-4 text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium text-[hsl(var(--boss-text))]">{country.country_code}</p>
                            <p className="text-xs text-[hsl(var(--boss-text-muted))]">{country.reason}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-emerald-400 hover:text-emerald-300"
                          onClick={() => unblockCountry.mutate({ blockId: country.id, unblocked_by: 'admin' })}
                        >
                          <Unlock className="h-4 w-4 mr-1" />
                          Unblock
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle className="h-12 w-12 text-emerald-400 mb-3" />
                    <p className="text-[hsl(var(--boss-text))]">No blocked countries</p>
                    <p className="text-sm text-[hsl(var(--boss-text-muted))]">All regions have access</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Session Control */}
            <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text))]">
                    <Fingerprint className="h-5 w-5 text-emerald-400" />
                    Active Sessions
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-[hsl(var(--boss-text-muted))]" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Currently active user sessions</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <CardDescription className="text-[hsl(var(--boss-text-muted))]">
                  Monitor and control active sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { user: 'admin@softwarevala.com', device: 'Chrome / Windows', ip: '192.168.1.x', status: 'active' },
                    { user: 'user@example.com', device: 'Safari / macOS', ip: '10.0.0.x', status: 'active' },
                    { user: 'dev@team.com', device: 'Firefox / Linux', ip: '172.16.0.x', status: 'idle' },
                  ].map((session, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--boss-card-elevated))]"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${session.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <div>
                          <p className="font-medium text-[hsl(var(--boss-text))]">{session.user}</p>
                          <p className="text-xs text-[hsl(var(--boss-text-muted))]">{session.device} • {session.ip}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                        <XCircle className="h-4 w-4 mr-1" />
                        Kill
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
