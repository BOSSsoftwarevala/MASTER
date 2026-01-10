import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ListTodo, 
  Bug, 
  Hammer,
  Rocket,
  Clock,
  AlertTriangle,
  CheckCircle,
  GitPullRequest,
  Code2,
  Activity
} from 'lucide-react';

// Mock data for developer dashboard
const devStats = {
  activeTasks: 5,
  completedThisWeek: 8,
  pendingReviews: 3,
  bugs: 2,
  buildsPending: 1,
  buildsCompleted: 12,
  upcomingDeadlines: 2,
  hoursLogged: 36,
};

const activeTasks = [
  { id: 1, title: 'Implement user authentication flow', project: 'Main Platform', priority: 'high', deadline: 'Jan 6', progress: 75 },
  { id: 2, title: 'Fix payment gateway integration', project: 'E-commerce Module', priority: 'critical', deadline: 'Jan 5', progress: 40 },
  { id: 3, title: 'Add export functionality', project: 'Reports Dashboard', priority: 'medium', deadline: 'Jan 8', progress: 20 },
  { id: 4, title: 'Optimize database queries', project: 'API Server', priority: 'medium', deadline: 'Jan 10', progress: 0 },
];

const recentBuilds = [
  { id: 1, branch: 'feature/auth-flow', status: 'success', duration: '2m 34s', time: '1 hour ago' },
  { id: 2, branch: 'fix/payment-bug', status: 'running', duration: '1m 20s', time: 'Just now' },
  { id: 3, branch: 'main', status: 'success', duration: '3m 12s', time: '3 hours ago' },
  { id: 4, branch: 'hotfix/login-issue', status: 'failed', duration: '45s', time: 'Yesterday' },
];

const pendingReviews = [
  { id: 1, title: 'Add user profile page', author: 'Sarah K.', files: 12, comments: 3 },
  { id: 2, title: 'Refactor API handlers', author: 'Mike J.', files: 8, comments: 0 },
  { id: 3, title: 'Update dependencies', author: 'Auto', files: 2, comments: 1 },
];

export default function DeveloperDashboard() {
  return (
    <RoleLayout role="developer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Developer Dashboard</h1>
            <p className="text-muted-foreground">Your tasks, builds, and code reviews at a glance.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <Code2 className="h-3 w-3 mr-1" />
              Full Stack
            </Badge>
            <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Activity className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{devStats.activeTasks}</div>
              <p className="text-xs text-muted-foreground">
                {devStats.completedThisWeek} completed this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <GitPullRequest className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{devStats.pendingReviews}</div>
              <p className="text-xs text-muted-foreground">
                Pull requests awaiting your review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bugs</CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{devStats.bugs}</div>
              <p className="text-xs text-muted-foreground">
                Assigned to you
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{devStats.hoursLogged}h</div>
              <p className="text-xs text-muted-foreground">
                This week (target: 40h)
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Active Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                Active Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeTasks.map((task) => (
                  <div key={task.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.project}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={
                          task.priority === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          task.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }>
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{task.deadline}</span>
                      </div>
                    </div>
                    <Progress value={task.progress} className="h-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Builds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hammer className="h-5 w-5" />
                Recent Builds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBuilds.map((build) => (
                  <div key={build.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {build.status === 'success' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                      {build.status === 'running' && <Activity className="h-4 w-4 text-blue-500 animate-pulse" />}
                      {build.status === 'failed' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      <div>
                        <p className="font-mono text-sm">{build.branch}</p>
                        <p className="text-xs text-muted-foreground">{build.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={
                        build.status === 'success' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        build.status === 'running' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }>
                        {build.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{build.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Code Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitPullRequest className="h-5 w-5" />
              Pending Code Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {pendingReviews.map((pr) => (
                <div key={pr.id} className="p-4 rounded-lg border bg-card">
                  <p className="font-medium mb-2">{pr.title}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>by {pr.author}</span>
                    <span>{pr.files} files</span>
                  </div>
                  {pr.comments > 0 && (
                    <Badge variant="secondary" className="mt-2">
                      {pr.comments} comments
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
}
