import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Users, TrendingUp, Plus, Eye, Activity, Shield } from 'lucide-react';

export default function DemoManagerPortal() {
  const navigate = useNavigate();

  const widgets = [
    { title: 'Active Demos', value: 18, icon: Play, color: 'text-purple-500', change: '+5 this week' },
    { title: 'Expired Demos', value: 7, icon: Clock, color: 'text-purple-600', change: 'Needs cleanup' },
    { title: 'Demo Requests', value: 12, icon: Users, color: 'text-purple-400', change: '4 pending' },
    { title: 'Conversion Rate', value: '32%', icon: TrendingUp, color: 'text-purple-700', change: '+8% this month' },
  ];

  return (
    <ManagerLayout role="demo">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">Demo Manager</h1>
          <p className="text-muted-foreground">Control demos, access rules, and track conversions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {widgets.map((widget) => (
            <Card key={widget.title} className="border-purple-200 dark:border-purple-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
                <widget.icon className={`h-4 w-4 ${widget.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{widget.value}</div>
                <p className="text-xs text-muted-foreground">{widget.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-900 dark:text-purple-100">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button 
              onClick={() => navigate('/manager/demo/demos')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Demo
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/demo/access')}
              className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
            >
              <Shield className="h-4 w-4 mr-2" />
              Access Rules
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/demo/conversion')}
              className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Conversions
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/demo/expiry')}
              className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
            >
              <Clock className="h-4 w-4 mr-2" />
              Expiry Control
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Play className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Demo "CRM Pro" accessed by TechCorp</span>
                </div>
                <span className="text-xs text-muted-foreground">30 minutes ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Demo converted to paid subscription</span>
                </div>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">3 demos expiring tomorrow</span>
                </div>
                <span className="text-xs text-muted-foreground">Alert</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerLayout>
  );
}
