import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, TrendingUp, Globe, Zap, BarChart3, Activity, AlertCircle } from 'lucide-react';

export default function SeoManagerPortal() {
  const navigate = useNavigate();

  const widgets = [
    { title: 'Total Keywords', value: 156, icon: Search, color: 'text-green-500', change: '+12 this week' },
    { title: 'Pages Optimized', value: 34, icon: FileText, color: 'text-green-600', change: '89% score avg' },
    { title: 'Avg. Ranking', value: '#8.4', icon: TrendingUp, color: 'text-green-400', change: '+2.3 positions' },
    { title: 'Monthly Traffic', value: '45.2K', icon: BarChart3, color: 'text-green-700', change: '+18% growth' },
  ];

  return (
    <ManagerLayout role="seo">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-green-900 dark:text-green-100">SEO Manager</h1>
          <p className="text-muted-foreground">Optimize visibility, track rankings, and generate AI content</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {widgets.map((widget) => (
            <Card key={widget.title} className="border-green-200 dark:border-green-800">
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
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button 
              onClick={() => navigate('/manager/seo/content')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Generate AI Content
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/seo/pages')}
              className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900"
            >
              <FileText className="h-4 w-4 mr-2" />
              Optimize Pages
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/seo/keywords')}
              className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900"
            >
              <Search className="h-4 w-4 mr-2" />
              Track Keywords
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/seo/regions')}
              className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900"
            >
              <Globe className="h-4 w-4 mr-2" />
              Country SEO
            </Button>
          </CardContent>
        </Card>

        {/* SEO Alerts */}
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              SEO Alerts & Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">"cloud software" jumped to #3 ranking</span>
                </div>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">5 pages have low meta descriptions</span>
                </div>
                <span className="text-xs text-muted-foreground">Action needed</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span className="text-sm">AI generated 3 new blog articles</span>
                </div>
                <span className="text-xs text-muted-foreground">Yesterday</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerLayout>
  );
}
