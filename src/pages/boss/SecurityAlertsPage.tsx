import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle,
  AlertOctagon,
  TrendingUp,
  Fingerprint,
  Ban,
  Bell,
  Snowflake,
  ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';

interface SecurityAlert {
  id: string;
  type: 'security' | 'tamper' | 'cost' | 'abuse';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  timestamp: string;
  status: 'active' | 'escalated' | 'frozen' | 'resolved';
}

const alerts: SecurityAlert[] = [
  {
    id: '1',
    type: 'security',
    severity: 'high',
    title: 'Multiple failed login attempts detected',
    description: 'IP 192.168.1.45 has attempted 50+ failed logins in the last hour',
    source: 'Auth System',
    timestamp: '15 minutes ago',
    status: 'active',
  },
  {
    id: '2',
    type: 'tamper',
    severity: 'medium',
    title: 'Unusual API access pattern',
    description: 'User ID 12345 accessing admin endpoints without proper role',
    source: 'API Gateway',
    timestamp: '30 minutes ago',
    status: 'active',
  },
  {
    id: '3',
    type: 'cost',
    severity: 'high',
    title: 'AI API cost spike detected',
    description: 'AI API usage exceeded 200% of daily budget',
    source: 'Billing Monitor',
    timestamp: '1 hour ago',
    status: 'escalated',
  },
  {
    id: '4',
    type: 'abuse',
    severity: 'medium',
    title: 'Potential referral fraud detected',
    description: 'Unusual signup pattern from same IP range',
    source: 'Fraud Detection',
    timestamp: '2 hours ago',
    status: 'active',
  },
];

const incidentStats = {
  today: 4,
  thisWeek: 12,
  resolved: 8,
  escalated: 2,
};

export default function SecurityAlertsPage() {
  const [alertList, setAlertList] = useState<SecurityAlert[]>(alerts);

  const handleFreeze = (alertId: string) => {
    setAlertList(prev => prev.map(a => 
      a.id === alertId ? { ...a, status: 'frozen' as const } : a
    ));
    toast.success('Source frozen successfully');
  };

  const handleEscalate = (alertId: string) => {
    setAlertList(prev => prev.map(a => 
      a.id === alertId ? { ...a, status: 'escalated' as const } : a
    ));
    toast.success('Alert escalated');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-muted';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return Shield;
      case 'tamper': return Fingerprint;
      case 'cost': return TrendingUp;
      case 'abuse': return Ban;
      default: return AlertTriangle;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Security & Incident Alerts</h1>
          <p className="text-gray-400 mt-1">Security alerts, tamper attempts, cost spikes, and abuse flags</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Today's Alerts</CardTitle>
              <AlertOctagon className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{incidentStats.today}</div>
              <p className="text-xs text-gray-500 mt-1">Active incidents</p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">This Week</CardTitle>
              <Bell className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{incidentStats.thisWeek}</div>
              <p className="text-xs text-gray-500 mt-1">Total alerts</p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Resolved</CardTitle>
              <Shield className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{incidentStats.resolved}</div>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Escalated</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{incidentStats.escalated}</div>
              <p className="text-xs text-gray-500 mt-1">Pending review</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert List */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Active Alerts
            </CardTitle>
            <CardDescription className="text-gray-400">Security incidents requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertList.map((alert) => {
                const TypeIcon = getTypeIcon(alert.type);
                return (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg border ${
                      alert.status === 'frozen' ? 'border-blue-600/50 bg-blue-950/30' :
                      alert.status === 'escalated' ? 'border-purple-600/50 bg-purple-950/30' :
                      'border-[hsl(var(--boss-card-border))] bg-[hsl(var(--boss-panel-bg))]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          alert.severity === 'high' ? 'bg-red-900/50' :
                          alert.severity === 'medium' ? 'bg-amber-900/50' :
                          'bg-blue-900/50'
                        }`}>
                          <TypeIcon className={`h-5 w-5 ${
                            alert.severity === 'high' ? 'text-red-400' :
                            alert.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{alert.title}</span>
                            <div className={`h-2 w-2 rounded-full ${getSeverityColor(alert.severity)}`} />
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{alert.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Source: {alert.source}</span>
                            <span>{alert.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className={
                            alert.status === 'frozen' ? 'border-blue-500/50 bg-blue-900/30 text-blue-300' :
                            alert.status === 'escalated' ? 'border-purple-500/50 bg-purple-900/30 text-purple-300' :
                            'border-gray-600 bg-gray-800/50 text-gray-300'
                          }
                        >
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                    {alert.status === 'active' && (
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[hsl(var(--boss-card-border))]">
                        <Button 
                          size="sm"
                          onClick={() => handleFreeze(alert.id)}
                          className="bg-red-600/80 hover:bg-red-600 text-white border-0"
                        >
                          <Snowflake className="h-4 w-4 mr-1" />
                          Freeze Source
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEscalate(alert.id)}
                          className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          Escalate
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Alert Types Legend */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardContent className="pt-6">
            <h3 className="font-medium text-white mb-4">Alert Type Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-400" />
                <span className="text-sm text-gray-400">Security Threats</span>
              </div>
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-gray-400">Tamper Attempts</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">Cost Spikes</span>
              </div>
              <div className="flex items-center gap-2">
                <Ban className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-gray-400">Abuse Flags</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
