import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupportData } from '@/hooks/useSupportData';
import { useNavigate } from 'react-router-dom';
import { Ticket, Headphones, Clock, AlertTriangle, Star, Plus, CheckCircle, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SupportDashboard() {
  const navigate = useNavigate();
  const { loading, getStats } = useSupportData();
  const stats = getStats();

  const statCards = [
    { title: 'Open Tickets', value: stats.openTickets, icon: Ticket, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'In Progress', value: stats.inProgressTickets, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'Active Assist Sessions', value: stats.activeSessions, icon: Headphones, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Pending Promises', value: stats.pendingPromises, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Overdue Promises', value: stats.overduePromises, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
    { title: 'Avg. Rating', value: stats.avgRating.toFixed(1), icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  const quickActions = [
    { title: 'New Ticket', icon: Plus, onClick: () => navigate('/dashboard/support/tickets/create'), variant: 'default' as const },
    { title: 'Start Assist', icon: Headphones, onClick: () => navigate('/dashboard/support/assist/create'), variant: 'outline' as const },
    { title: 'Create Promise', icon: CheckCircle, onClick: () => navigate('/dashboard/support/promises'), variant: 'outline' as const },
    { title: 'View SLA Breaches', icon: AlertTriangle, onClick: () => navigate('/dashboard/support/sla'), variant: 'outline' as const },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Support & Assist Manager</h1>
            <p className="text-muted-foreground mt-1">Manage tickets, assist sessions, and client promises</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Button key={action.title} variant={action.variant} onClick={action.onClick} className="gap-2">
              <action.icon className="h-4 w-4" />
              {action.title}
            </Button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stat.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate('/dashboard/support/tickets')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-blue-500" />
                Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View and manage all support tickets</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate('/dashboard/support/assist')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-green-500" />
                Assist Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Ultra-secure remote assistance</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate('/dashboard/support/promises')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-500" />
                Promise Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Track client commitments and SLAs</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate('/dashboard/support/feedback')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View client ratings and comments</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
