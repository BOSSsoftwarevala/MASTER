import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Activity, 
  Clock, 
  Globe, 
  Monitor, 
  Smartphone,
  RefreshCw,
  Search,
  Filter,
  Download,
  Eye,
  LogIn,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

interface UserActivity {
  id: string;
  user_email: string;
  action: string;
  ip_address: string;
  country: string;
  device: string;
  browser: string;
  timestamp: string;
  risk_level: 'low' | 'medium' | 'high';
}

const mockActivities: UserActivity[] = [
  { id: '1', user_email: 'admin@softwarevala.com', action: 'Login', ip_address: '192.168.1.100', country: 'India', device: 'Desktop', browser: 'Chrome', timestamp: new Date().toISOString(), risk_level: 'low' },
  { id: '2', user_email: 'user@example.com', action: 'Password Change', ip_address: '10.0.0.50', country: 'USA', device: 'Mobile', browser: 'Safari', timestamp: new Date(Date.now() - 3600000).toISOString(), risk_level: 'medium' },
  { id: '3', user_email: 'dev@team.com', action: 'File Download', ip_address: '172.16.0.25', country: 'Germany', device: 'Desktop', browser: 'Firefox', timestamp: new Date(Date.now() - 7200000).toISOString(), risk_level: 'low' },
  { id: '4', user_email: 'unknown@suspicious.com', action: 'Failed Login', ip_address: '45.33.32.156', country: 'Unknown', device: 'Unknown', browser: 'Unknown', timestamp: new Date(Date.now() - 10800000).toISOString(), risk_level: 'high' },
];

export default function UserActivityPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activities] = useState<UserActivity[]>(mockActivities);

  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1500));
    setRefreshing(false);
  };

  const filteredActivities = activities.filter(a => 
    a.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayLogins = activities.filter(a => a.action === 'Login').length;
  const highRiskEvents = activities.filter(a => a.risk_level === 'high').length;
  const uniqueCountries = [...new Set(activities.map(a => a.country))].length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-[hsl(var(--boss-text))]">
              <Users className="h-8 w-8 text-[hsl(var(--boss-accent))]" />
              User Activity
            </h1>
            <p className="text-[hsl(var(--boss-text-muted))] mt-1">
              Real-time user activity monitoring and analytics
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
            { label: 'Total Activities', value: activities.length, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Logins Today', value: todayLogins, icon: LogIn, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'High Risk Events', value: highRiskEvents, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Countries', value: uniqueCountries, icon: Globe, color: 'text-amber-400', bg: 'bg-amber-500/10' },
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

        {/* Search & Filter */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--boss-text-muted))]" />
                <Input 
                  placeholder="Search by email or action..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]"
                />
              </div>
              <Button variant="outline" className="gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity List */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--boss-text))]">Recent Activity</CardTitle>
            <CardDescription className="text-[hsl(var(--boss-text-muted))]">
              Live feed of user actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    activity.risk_level === 'high' 
                      ? 'bg-red-500/5 border-red-500/20' 
                      : 'bg-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      activity.action === 'Login' ? 'bg-emerald-500/10' :
                      activity.action === 'Logout' ? 'bg-blue-500/10' :
                      activity.action === 'Failed Login' ? 'bg-red-500/10' :
                      'bg-amber-500/10'
                    }`}>
                      {activity.action === 'Login' && <LogIn className="h-5 w-5 text-emerald-400" />}
                      {activity.action === 'Logout' && <LogOut className="h-5 w-5 text-blue-400" />}
                      {activity.action === 'Failed Login' && <AlertTriangle className="h-5 w-5 text-red-400" />}
                      {!['Login', 'Logout', 'Failed Login'].includes(activity.action) && <Activity className="h-5 w-5 text-amber-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(var(--boss-text))]">{activity.user_email}</p>
                      <div className="flex items-center gap-2 text-xs text-[hsl(var(--boss-text-muted))]">
                        <span>{activity.action}</span>
                        <span>•</span>
                        <span>{activity.ip_address}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {activity.country}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--boss-text-muted))]">
                      {activity.device === 'Desktop' ? (
                        <Monitor className="h-4 w-4" />
                      ) : (
                        <Smartphone className="h-4 w-4" />
                      )}
                      <span>{activity.browser}</span>
                    </div>
                    <Badge variant={
                      activity.risk_level === 'high' ? 'destructive' :
                      activity.risk_level === 'medium' ? 'secondary' :
                      'outline'
                    }>
                      {activity.risk_level}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-[hsl(var(--boss-text-muted))]">
                      <Clock className="h-3 w-3" />
                      {format(new Date(activity.timestamp), 'HH:mm')}
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
