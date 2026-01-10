import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDevelopmentStats, useDevelopmentRealtime } from '@/hooks/useDevelopmentManagerData';
import { useBuildRequests } from '@/hooks/useDevelopmentData';
import { 
  Users, 
  FolderGit2, 
  ListTodo, 
  Bug, 
  CheckCircle, 
  Activity,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DevManagerDashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDevelopmentStats();
  const { data: buildRequests } = useBuildRequests();
  useDevelopmentRealtime();

  const pendingBuilds = buildRequests?.filter(b => b.status === 'pending').length || 0;
  const successBuilds = buildRequests?.filter(b => b.status === 'success').length || 0;
  const failedBuilds = buildRequests?.filter(b => b.status === 'failed').length || 0;

  const statCards = [
    {
      title: 'Total Developers',
      value: stats?.totalDevelopers || 0,
      subtitle: `${stats?.activeDevelopers || 0} active`,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Projects',
      value: stats?.activeProjects || 0,
      subtitle: `${stats?.totalProjects || 0} total`,
      icon: FolderGit2,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Open Tasks',
      value: stats?.openTasks || 0,
      subtitle: `${stats?.totalTasks || 0} total`,
      icon: ListTodo,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Bugs Pending',
      value: stats?.openBugs || 0,
      subtitle: `${stats?.totalBugs || 0} total reported`,
      icon: Bug,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Build Status',
      value: pendingBuilds,
      subtitle: `${successBuilds} passed, ${failedBuilds} failed`,
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'QA Pass Rate',
      value: `${stats?.qaPassRate || 0}%`,
      subtitle: `${stats?.totalTests || 0} tests run`,
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Development Manager</h1>
            <p className="text-muted-foreground">
              Manage developers, projects, tasks, and quality assurance
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/dashboard/devmanager/developers/add')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Developer
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard/devmanager/projects/create')}>
              <FolderGit2 className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsLoading ? '...' : stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate('/dashboard/devmanager/developers')}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>Developers</span>
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
              <CardDescription>Manage team members</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate('/dashboard/devmanager/projects')}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>Projects</span>
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
              <CardDescription>View all projects</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate('/dashboard/devmanager/tasks')}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>Task Board</span>
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
              <CardDescription>Manage task workflow</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate('/dashboard/devmanager/bugs')}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>Bug Tracking</span>
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
              <CardDescription>Track and fix bugs</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity & Alerts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Developers</span>
                  <Badge variant="secondary">{stats?.activeDevelopers || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">In Progress Tasks</span>
                  <Badge variant="secondary">{stats?.openTasks || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Open Bugs</span>
                  <Badge variant="destructive">{stats?.openBugs || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending Builds</span>
                  <Badge variant="outline">{pendingBuilds}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Attention Needed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(stats?.openBugs || 0) > 0 && (
                  <div className="flex items-center justify-between p-2 rounded bg-destructive/10">
                    <span className="text-sm">{stats?.openBugs} bugs need attention</span>
                    <Button size="sm" variant="ghost" onClick={() => navigate('/dashboard/devmanager/bugs')}>
                      View
                    </Button>
                  </div>
                )}
                {failedBuilds > 0 && (
                  <div className="flex items-center justify-between p-2 rounded bg-amber-500/10">
                    <span className="text-sm">{failedBuilds} failed builds</span>
                    <Button size="sm" variant="ghost" onClick={() => navigate('/dashboard/devmanager/builds')}>
                      View
                    </Button>
                  </div>
                )}
                {(stats?.qaPassRate || 0) < 80 && (
                  <div className="flex items-center justify-between p-2 rounded bg-amber-500/10">
                    <span className="text-sm">QA pass rate below 80%</span>
                    <Button size="sm" variant="ghost" onClick={() => navigate('/dashboard/devmanager/qa')}>
                      View
                    </Button>
                  </div>
                )}
                {(stats?.openBugs || 0) === 0 && failedBuilds === 0 && (stats?.qaPassRate || 100) >= 80 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    All systems operational
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
