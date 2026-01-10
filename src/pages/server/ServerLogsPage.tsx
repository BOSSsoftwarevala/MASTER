import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Search, 
  Download,
  RefreshCw,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  User,
  Shield,
  Server,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  category: string;
  message: string;
  source: string;
  user?: string;
}

const mockLogs: LogEntry[] = [
  { id: '1', timestamp: new Date().toISOString(), level: 'info', category: 'auth', message: 'User admin@softwarevala.com logged in successfully', source: 'auth-service', user: 'admin@softwarevala.com' },
  { id: '2', timestamp: new Date(Date.now() - 60000).toISOString(), level: 'warning', category: 'security', message: 'Failed login attempt from IP 45.33.32.156', source: 'auth-service' },
  { id: '3', timestamp: new Date(Date.now() - 120000).toISOString(), level: 'info', category: 'server', message: 'Server health check passed', source: 'monitoring' },
  { id: '4', timestamp: new Date(Date.now() - 180000).toISOString(), level: 'error', category: 'database', message: 'Connection pool exhausted, scaling up', source: 'db-service' },
  { id: '5', timestamp: new Date(Date.now() - 240000).toISOString(), level: 'info', category: 'api', message: 'Rate limit triggered for endpoint /api/data', source: 'api-gateway' },
  { id: '6', timestamp: new Date(Date.now() - 300000).toISOString(), level: 'debug', category: 'cache', message: 'Cache invalidation triggered', source: 'redis' },
  { id: '7', timestamp: new Date(Date.now() - 360000).toISOString(), level: 'info', category: 'security', message: 'Country CN blocked by geo-control', source: 'firewall' },
  { id: '8', timestamp: new Date(Date.now() - 420000).toISOString(), level: 'warning', category: 'server', message: 'CPU usage exceeded 80% threshold', source: 'monitoring' },
];

export default function ServerLogsPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [logs] = useState<LogEntry[]>(mockLogs);

  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1500));
    setRefreshing(false);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || log.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-400" />;
      case 'debug': return <Activity className="h-4 w-4 text-slate-400" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth': return <User className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'server': return <Server className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const errorCount = logs.filter(l => l.level === 'error').length;
  const warningCount = logs.filter(l => l.level === 'warning').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-[hsl(var(--boss-text))]">
              <FileText className="h-8 w-8 text-[hsl(var(--boss-accent))]" />
              Logs & Forensics
            </h1>
            <p className="text-[hsl(var(--boss-text-muted))] mt-1">
              Complete audit trail and system logs
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Logs', value: logs.length, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Errors', value: errorCount, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Warnings', value: warningCount, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Last Updated', value: 'Now', icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
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

        {/* Search & Tabs */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--boss-text-muted))]" />
                <Input 
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" className="gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]">
                  <Calendar className="h-4 w-4" />
                  Date Range
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-[hsl(var(--boss-card-elevated))]">
                <TabsTrigger value="all">All Logs</TabsTrigger>
                <TabsTrigger value="auth">Auth</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="server">Server</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <div 
                    key={log.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all hover:bg-[hsl(var(--boss-card-elevated))]/50 ${
                      log.level === 'error' ? 'bg-red-500/5 border-red-500/20' :
                      log.level === 'warning' ? 'bg-amber-500/5 border-amber-500/20' :
                      'bg-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-[140px] text-[hsl(var(--boss-text-muted))]">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">
                        {format(new Date(log.timestamp), 'HH:mm:ss')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getLevelIcon(log.level)}
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs min-w-[80px] justify-center gap-1"
                    >
                      {getCategoryIcon(log.category)}
                      {log.category}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-[hsl(var(--boss-text))]">{log.message}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-[hsl(var(--boss-text-muted))]">
                        <span>Source: {log.source}</span>
                        {log.user && <span>User: {log.user}</span>}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-[hsl(var(--boss-text-muted))] mb-4" />
                  <p className="text-[hsl(var(--boss-text))]">No logs found</p>
                  <p className="text-sm text-[hsl(var(--boss-text-muted))]">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
