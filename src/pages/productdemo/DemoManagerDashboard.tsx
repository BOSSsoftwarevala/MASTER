import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Users, TrendingUp, Plus, Eye, Sparkles, Zap } from 'lucide-react';
import { useDemos, useDemoRequests, useProductDemoStats } from '@/hooks/useProductDemoData';

export default function DemoManagerDashboard() {
  const navigate = useNavigate();
  const { data: activeDemos } = useDemos('active');
  const { data: expiredDemos } = useDemos('expired');
  const { data: demoRequests } = useDemoRequests();
  const { data: stats } = useProductDemoStats();

  const widgets = [
    { title: 'Active Demos', value: activeDemos?.length || 0, icon: Play, color: 'text-purple-500' },
    { title: 'Expired Demos', value: expiredDemos?.length || 0, icon: Clock, color: 'text-purple-600' },
    { title: 'Demo Requests', value: demoRequests?.filter(r => r.status === 'pending')?.length || 0, icon: Users, color: 'text-purple-400' },
    { title: 'Conversion Rate', value: stats?.conversionRate || '0%', icon: TrendingUp, color: 'text-purple-700' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">Demo Manager</h1>
            <p className="text-muted-foreground">Manage demos, requests, and track conversion analytics</p>
          </div>
          {/* VALA AI Entry Point */}
          <Button 
            onClick={() => navigate('/dashboard/boss/vala')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
          >
            <Zap className="h-4 w-4 mr-2" />
            AI Demo Builder
          </Button>
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
              onClick={() => navigate('/dashboard/demo/demos/new')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Demo
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/demo/demos/active')}
              className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Active Demos
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/demo/analytics/funnel')}
              className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Conversions
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
