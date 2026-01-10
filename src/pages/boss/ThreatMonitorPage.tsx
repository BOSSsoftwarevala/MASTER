import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useThreatEvents, useResolveThreat, useSecurityStats } from '@/hooks/useSecurityData';
import { useUserRoles } from '@/hooks/useUserRoles';
import { 
  Shield, 
  AlertTriangle,
  AlertOctagon,
  Search,
  CheckCircle,
  Clock,
  Globe,
  User,
  Activity
} from 'lucide-react';

export default function ThreatMonitorPage() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { data: threats = [], isLoading } = useThreatEvents();
  const { mutate: resolveThreat, isPending: isResolving } = useResolveThreat();
  const stats = useSecurityStats();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [resolveDialog, setResolveDialog] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-4">
          <Skeleton className="h-8 w-64 bg-gray-700" />
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
              <CardTitle className="text-red-300">Access Denied</CardTitle>
              <CardDescription className="text-red-400">Super Admin access required for threat monitoring.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const mockThreats = [
    {
      id: 'mock-1',
      event_type: 'brute_force_attempt',
      severity: 'high',
      source_ip: '192.168.1.100',
      target_user_id: null,
      target_resource: 'Auth System',
      description: 'Multiple failed login attempts detected from suspicious IP',
      metadata: { attempts: 15, timeframe: '5 minutes' },
      is_resolved: false,
      resolved_at: null,
      resolved_by: null,
      resolution_notes: null,
      auto_action_taken: 'IP temporarily blocked',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'mock-2',
      event_type: 'suspicious_api_usage',
      severity: 'medium',
      source_ip: '10.0.0.50',
      target_user_id: null,
      target_resource: '/api/users',
      description: 'Unusual API request pattern detected',
      metadata: { requests: 500, endpoint: '/api/users' },
      is_resolved: false,
      resolved_at: null,
      resolved_by: null,
      resolution_notes: null,
      auto_action_taken: 'Rate limited',
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'mock-3',
      event_type: 'geo_anomaly',
      severity: 'low',
      source_ip: '45.33.32.156',
      target_user_id: 'user-123',
      target_resource: 'Login',
      description: 'Login from unexpected geographic location',
      metadata: { country: 'Unknown', previous: 'India' },
      is_resolved: true,
      resolved_at: new Date(Date.now() - 86400000).toISOString(),
      resolved_by: 'admin',
      resolution_notes: 'User confirmed VPN usage',
      auto_action_taken: null,
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  const displayThreats = threats.length > 0 ? threats : mockThreats;

  const filteredThreats = displayThreats.filter(threat => {
    const matchesSearch = 
      threat.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.source_ip?.includes(searchQuery);
    const matchesSeverity = severityFilter === 'all' || threat.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'resolved' ? threat.is_resolved : !threat.is_resolved);
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="outline" className="border-red-500/50 bg-red-900/30 text-red-300">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-amber-500/50 bg-amber-900/30 text-amber-300">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-gray-600 bg-gray-800/50 text-gray-400">Low</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-600 text-gray-400">{severity}</Badge>;
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'brute_force_attempt':
        return <AlertOctagon className="h-5 w-5 text-red-400" />;
      case 'suspicious_api_usage':
        return <Activity className="h-5 w-5 text-amber-400" />;
      case 'geo_anomaly':
        return <Globe className="h-5 w-5 text-blue-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleResolve = () => {
    if (resolveDialog && resolutionNotes.trim()) {
      resolveThreat({ threatId: resolveDialog, notes: resolutionNotes });
      setResolveDialog(null);
      setResolutionNotes('');
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Threat Monitor</h1>
          <p className="text-gray-400 mt-1">Real-time threat detection and response</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">High Severity</CardTitle>
              <AlertOctagon className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{stats.highSeverityThreats}</div>
              <p className="text-xs text-gray-500 mt-1">Requires immediate action</p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Unresolved</CardTitle>
              <Clock className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">{stats.unresolvedThreats}</div>
              <p className="text-xs text-gray-500 mt-1">Pending review</p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Blocked IPs</CardTitle>
              <Shield className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{stats.blockedIPCount}</div>
              <p className="text-xs text-gray-500 mt-1">Active blocks</p>
            </CardContent>
          </Card>

          <Card className={`bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 ${stats.isSystemFrozen ? 'border-l-purple-500' : 'border-l-emerald-500'}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">System Status</CardTitle>
              <Activity className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.isSystemFrozen ? 'text-purple-400' : 'text-emerald-400'}`}>
                {stats.isSystemFrozen ? 'FROZEN' : 'ACTIVE'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.isSystemFrozen ? 'Emergency mode' : 'Normal operation'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search threats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full md:w-[150px] bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <SelectItem value="all" className="text-gray-200 focus:bg-gray-700">All Severity</SelectItem>
                  <SelectItem value="high" className="text-gray-200 focus:bg-gray-700">High</SelectItem>
                  <SelectItem value="medium" className="text-gray-200 focus:bg-gray-700">Medium</SelectItem>
                  <SelectItem value="low" className="text-gray-200 focus:bg-gray-700">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[150px] bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <SelectItem value="all" className="text-gray-200 focus:bg-gray-700">All Status</SelectItem>
                  <SelectItem value="unresolved" className="text-gray-200 focus:bg-gray-700">Unresolved</SelectItem>
                  <SelectItem value="resolved" className="text-gray-200 focus:bg-gray-700">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Threats List */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-emerald-400" />
              Threat Events
            </CardTitle>
            <CardDescription className="text-gray-400">{filteredThreats.length} events found</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-32 w-full bg-gray-700" />
                ))}
              </div>
            ) : filteredThreats.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 mx-auto text-emerald-400 mb-4" />
                <p className="text-lg font-medium text-white">No threats detected</p>
                <p className="text-gray-400">Your system is secure</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredThreats.map((threat) => (
                  <div
                    key={threat.id}
                    className={`p-4 rounded-lg border ${
                      threat.is_resolved
                        ? 'border-emerald-600/50 bg-emerald-950/30'
                        : threat.severity === 'high'
                        ? 'border-red-600/50 bg-red-950/30'
                        : 'border-[hsl(var(--boss-card-border))] bg-[hsl(var(--boss-panel-bg))]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getEventIcon(threat.event_type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white capitalize">
                              {threat.event_type.replace(/_/g, ' ')}
                            </span>
                            {getSeverityBadge(threat.severity)}
                            {threat.is_resolved ? (
                              <Badge variant="outline" className="border-emerald-500/50 bg-emerald-900/30 text-emerald-300">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Resolved
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-amber-500/50 bg-amber-900/30 text-amber-300">
                                <Clock className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{threat.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            {threat.source_ip && (
                              <span className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                {threat.source_ip}
                              </span>
                            )}
                            {threat.target_resource && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {threat.target_resource}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(threat.created_at).toLocaleString()}
                            </span>
                          </div>
                          {threat.auto_action_taken && (
                            <p className="text-xs text-blue-400 mt-2">
                              Auto action: {threat.auto_action_taken}
                            </p>
                          )}
                          {threat.resolution_notes && (
                            <p className="text-xs text-emerald-400 mt-2">
                              Resolution: {threat.resolution_notes}
                            </p>
                          )}
                        </div>
                      </div>
                      {!threat.is_resolved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setResolveDialog(threat.id)}
                          className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resolve Dialog */}
      <Dialog open={!!resolveDialog} onOpenChange={() => setResolveDialog(null)}>
        <DialogContent className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <DialogHeader>
            <DialogTitle className="text-white">Resolve Threat</DialogTitle>
            <DialogDescription className="text-gray-400">
              Provide resolution notes for this threat event.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter resolution notes..."
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            className="min-h-[100px] bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialog(null)} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
            <Button 
              onClick={handleResolve} 
              disabled={!resolutionNotes.trim() || isResolving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}