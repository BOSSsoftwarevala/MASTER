import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Server, 
  Activity,
  AlertTriangle,
  Clock,
  ArrowRight,
  Eye,
  Cpu,
  HardDrive
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useServers, useActiveIncidents, useServerSummary, useServerRealtime } from '@/hooks/useServerData';

export default function ServerSnapshotPage() {
  const navigate = useNavigate();
  
  useServerRealtime();
  
  const { data: servers, isLoading: serversLoading } = useServers();
  const { data: incidents, isLoading: incidentsLoading } = useActiveIncidents();
  const { data: summary, isLoading: summaryLoading } = useServerSummary();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-600';
    }
  };

  const getProgressColor = (value: number) => {
    if (value > 80) return 'bg-red-500';
    if (value > 60) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const expiringServers = servers?.filter(s => s.expires_at).slice(0, 3) || [];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Server Status Snapshot</h1>
          <p className="text-gray-400 mt-1">Read-only overview of all server health and status</p>
          <Badge variant="outline" className="mt-2 border-gray-600 text-gray-400">
            <Eye className="h-3 w-3 mr-1" />
            View Only — Redirect to Server module for actions
          </Badge>
        </div>

        {/* Overall Status */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Servers</CardTitle>
              <Server className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-8 w-12 bg-gray-700" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-white">{summary?.total || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {summary?.own || 0} own • {summary?.client || 0} client
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Healthy</CardTitle>
              <Activity className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-8 w-12 bg-gray-700" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-emerald-400">{summary?.running || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">Operating normally</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Warnings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-8 w-12 bg-gray-700" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-amber-400">{summary?.warning || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">Needs attention</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Incidents</CardTitle>
              <Clock className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              {incidentsLoading ? (
                <Skeleton className="h-8 w-12 bg-gray-700" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-white">{incidents?.length || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">Pending review</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Server List */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Server className="h-5 w-5 text-gray-400" />
              Server Status
            </CardTitle>
            <CardDescription className="text-gray-400">Current health of all servers</CardDescription>
          </CardHeader>
          <CardContent>
            {serversLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full bg-gray-700" />
                ))}
              </div>
            ) : servers?.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No servers configured</p>
            ) : (
              <div className="space-y-4">
                {servers?.slice(0, 6).map((server) => (
                  <div key={server.id} className="p-4 rounded-lg border border-[hsl(var(--boss-card-border))] bg-[hsl(var(--boss-panel-bg))]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${getStatusColor(server.status)}`} />
                        <span className="font-medium text-white">{server.name}</span>
                        <Badge variant="outline" className="capitalize text-xs border-gray-600 text-gray-400">{server.owner_type}</Badge>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          server.status === 'running' ? 'border-emerald-500/50 bg-emerald-900/30 text-emerald-300' :
                          server.status === 'warning' ? 'border-amber-500/50 bg-amber-900/30 text-amber-300' :
                          'border-red-500/50 bg-red-900/30 text-red-300'
                        }
                      >
                        {server.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                          <Cpu className="h-3 w-3" />
                          CPU: {server.current_cpu_load || 0}%
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(server.current_cpu_load || 0)}`}
                            style={{ width: `${server.current_cpu_load || 0}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                          <Activity className="h-3 w-3" />
                          Memory: {server.current_ram_load || 0}%
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(server.current_ram_load || 0)}`}
                            style={{ width: `${server.current_ram_load || 0}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                          <HardDrive className="h-3 w-3" />
                          Disk: {server.current_disk_usage || 0}%
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(server.current_disk_usage || 0)}`}
                            style={{ width: `${server.current_disk_usage || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Provider: {server.provider} • Region: {server.region || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Active Incidents */}
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                Active Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {incidentsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full bg-gray-700" />
                  ))}
                </div>
              ) : incidents?.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No active incidents</p>
              ) : (
                <div className="space-y-3">
                  {incidents?.slice(0, 5).map((incident) => (
                    <div key={incident.id} className="p-3 rounded-lg border border-[hsl(var(--boss-card-border))] bg-[hsl(var(--boss-panel-bg))]">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-gray-600 text-gray-400">{incident.servers?.name || 'Unknown'}</Badge>
                        <Badge 
                          variant="outline"
                          className={incident.severity === 'critical' 
                            ? 'border-red-500/50 bg-red-900/30 text-red-300' 
                            : 'border-gray-600 bg-gray-800/50 text-gray-400'
                          }
                        >
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-sm mt-2 text-gray-300">{incident.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Server Cost Overview */}
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-5 w-5 text-blue-400" />
                Monthly Cost Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-24 w-full bg-gray-700" />
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-[hsl(var(--boss-panel-bg))] border border-[hsl(var(--boss-card-border))]">
                    <p className="text-sm text-gray-400">Total Monthly Cost</p>
                    <p className="text-3xl font-bold text-white">₹{(summary?.monthlyCost || 0).toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-[hsl(var(--boss-panel-bg))] border border-[hsl(var(--boss-card-border))]">
                      <p className="text-xs text-gray-500">Own Servers</p>
                      <p className="text-lg font-semibold text-white">{summary?.own || 0}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[hsl(var(--boss-panel-bg))] border border-[hsl(var(--boss-card-border))]">
                      <p className="text-xs text-gray-500">Client Servers</p>
                      <p className="text-lg font-semibold text-white">{summary?.client || 0}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Redirect Note */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowRight className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-white">Need to take action?</p>
                  <p className="text-sm text-gray-400">Go to Server Control module for full management</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard/boss/server')}
                className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Open Server Module
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}