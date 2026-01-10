import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Network, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Search,
  Plus,
  Ban,
  Lock,
  Unlock,
  Activity,
  Zap,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

interface PortInfo {
  port: number;
  protocol: string;
  service: string;
  status: 'open' | 'closed' | 'filtered';
  traffic: 'high' | 'medium' | 'low' | 'none';
  risk: 'safe' | 'warning' | 'danger';
  connections: number;
}

const mockPorts: PortInfo[] = [
  { port: 22, protocol: 'TCP', service: 'SSH', status: 'open', traffic: 'medium', risk: 'safe', connections: 3 },
  { port: 80, protocol: 'TCP', service: 'HTTP', status: 'open', traffic: 'high', risk: 'safe', connections: 150 },
  { port: 443, protocol: 'TCP', service: 'HTTPS', status: 'open', traffic: 'high', risk: 'safe', connections: 423 },
  { port: 3306, protocol: 'TCP', service: 'MySQL', status: 'open', traffic: 'medium', risk: 'warning', connections: 12 },
  { port: 5432, protocol: 'TCP', service: 'PostgreSQL', status: 'open', traffic: 'low', risk: 'safe', connections: 5 },
  { port: 6379, protocol: 'TCP', service: 'Redis', status: 'open', traffic: 'medium', risk: 'safe', connections: 8 },
  { port: 4444, protocol: 'TCP', service: 'Unknown', status: 'open', traffic: 'low', risk: 'danger', connections: 1 },
  { port: 8080, protocol: 'TCP', service: 'HTTP-Alt', status: 'closed', traffic: 'none', risk: 'safe', connections: 0 },
];

export default function PortControlPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [ports, setPorts] = useState<PortInfo[]>(mockPorts);

  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1500));
    setRefreshing(false);
    toast.success('Port scan complete');
  };

  const handleClosePort = (port: number) => {
    setPorts(prev => prev.map(p => 
      p.port === port ? { ...p, status: 'closed' as const, traffic: 'none' as const, connections: 0 } : p
    ));
    toast.success(`Port ${port} has been closed`);
  };

  const handleOpenPort = (port: number) => {
    setPorts(prev => prev.map(p => 
      p.port === port ? { ...p, status: 'open' as const } : p
    ));
    toast.success(`Port ${port} has been opened`);
  };

  const openPorts = ports.filter(p => p.status === 'open').length;
  const riskyPorts = ports.filter(p => p.risk === 'danger').length;
  const totalConnections = ports.reduce((acc, p) => acc + p.connections, 0);

  const filteredPorts = ports.filter(p => 
    p.port.toString().includes(searchQuery) ||
    p.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-[hsl(var(--boss-text))]">
              <Network className="h-8 w-8 text-[hsl(var(--boss-accent))]" />
              Port Control
            </h1>
            <p className="text-[hsl(var(--boss-text-muted))] mt-1">
              Real-time port monitoring and management
            </p>
          </div>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            className="gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Scan Ports
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Open Ports', value: openPorts, icon: Unlock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Risky Ports', value: riskyPorts, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Active Connections', value: totalConnections, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Total Ports', value: ports.length, icon: Network, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[hsl(var(--boss-text-muted))]">{stat.label}</p>
                    <p className="text-2xl font-bold text-[hsl(var(--boss-text))]">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Shield, label: 'Block Risky Ports', desc: 'Auto-close all dangerous ports', color: 'text-red-400', bg: 'bg-red-500/10' },
            { icon: RotateCcw, label: 'Rotate Port', desc: 'Move service to new port', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: Lock, label: 'Lock All', desc: 'Close all non-essential ports', color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((action) => (
            <Card 
              key={action.label}
              className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] hover:border-[hsl(var(--boss-accent))]/50 transition-all cursor-pointer group"
            >
              <CardContent className="pt-6 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <div>
                  <p className="font-medium text-[hsl(var(--boss-text))]">{action.label}</p>
                  <p className="text-sm text-[hsl(var(--boss-text-muted))]">{action.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--boss-text-muted))]" />
              <Input 
                placeholder="Search by port number or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Port List */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--boss-text))]">Port Status</CardTitle>
            <CardDescription className="text-[hsl(var(--boss-text-muted))]">
              All monitored ports and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPorts.map((port) => (
                <div 
                  key={port.port}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    port.risk === 'danger' ? 'bg-red-500/5 border-red-500/20' :
                    port.risk === 'warning' ? 'bg-amber-500/5 border-amber-500/20' :
                    'bg-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center font-mono font-bold ${
                      port.status === 'open' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {port.port}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[hsl(var(--boss-text))]">{port.service}</p>
                        <Badge variant="outline" className="text-xs">
                          {port.protocol}
                        </Badge>
                        <Badge variant={
                          port.status === 'open' ? 'secondary' : 'outline'
                        } className={port.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' : ''}>
                          {port.status}
                        </Badge>
                        {port.risk === 'danger' && (
                          <Badge variant="destructive">RISKY</Badge>
                        )}
                        {port.risk === 'warning' && (
                          <Badge className="bg-amber-500/20 text-amber-400">CAUTION</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-[hsl(var(--boss-text-muted))]">
                        <span className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          Traffic: {port.traffic}
                        </span>
                        <span>{port.connections} connections</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {port.status === 'open' ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleClosePort(port.port)}
                      >
                        <Lock className="h-3 w-3" />
                        Close
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => handleOpenPort(port.port)}
                      >
                        <Unlock className="h-3 w-3" />
                        Open
                      </Button>
                    )}
                    <Switch
                      checked={port.status === 'open'}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleOpenPort(port.port);
                        } else {
                          handleClosePort(port.port);
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Custom Port */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text))]">
              <Plus className="h-5 w-5 text-[hsl(var(--boss-accent))]" />
              Add Port to Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input 
                type="number"
                placeholder="Port number"
                className="max-w-[150px] bg-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]"
              />
              <Input 
                placeholder="Service name"
                className="max-w-xs bg-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]"
              />
              <Button className="gap-2 bg-[hsl(var(--boss-accent))] hover:bg-[hsl(var(--boss-accent))]/90">
                <Plus className="h-4 w-4" />
                Add Port
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
