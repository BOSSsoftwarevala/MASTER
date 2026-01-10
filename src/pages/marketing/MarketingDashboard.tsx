import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useMarketingStats } from '@/hooks/useMarketingManagerData';
import { useNavigate } from 'react-router-dom';
import { 
  Megaphone, 
  Search, 
  FileText, 
  Target, 
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  Plus,
  BarChart3,
  AlertCircle
} from 'lucide-react';

export default function MarketingDashboard() {
  const { isManager, isAdmin } = useUserRoles();
  const navigate = useNavigate();
  const { data: stats, isLoading } = useMarketingStats();

  if (!isManager() && !isAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Access Denied. Marketing Manager role required.</span>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      title: 'Active Campaigns',
      value: stats?.activeCampaigns || 0,
      total: stats?.totalCampaigns || 0,
      icon: Megaphone,
      color: 'from-violet-500 to-purple-500',
    },
    {
      title: 'Total Budget',
      value: `$${(stats?.totalBudget || 0).toLocaleString()}`,
      subtitle: `$${(stats?.totalSpent || 0).toLocaleString()} spent`,
      icon: DollarSign,
      color: 'from-emerald-500 to-green-500',
    },
    {
      title: 'Leads Generated',
      value: stats?.totalLeads || 0,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'SEO Keywords',
      value: stats?.totalKeywords || 0,
      icon: Search,
      color: 'from-orange-500 to-amber-500',
    },
    {
      title: 'Content Items',
      value: stats?.totalContent || 0,
      icon: FileText,
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: 'AI Suggestions',
      value: stats?.pendingSuggestions || 0,
      subtitle: 'pending review',
      icon: Sparkles,
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  const quickActions = [
    { label: 'Create Campaign', icon: Megaphone, path: '/dashboard/marketing/campaigns/create', color: 'bg-violet-500' },
    { label: 'Manage SEO', icon: Search, path: '/dashboard/marketing/seo', color: 'bg-orange-500' },
    { label: 'Create Content', icon: FileText, path: '/dashboard/marketing/content/create', color: 'bg-pink-500' },
    { label: 'View Analytics', icon: BarChart3, path: '/dashboard/marketing/analytics', color: 'bg-blue-500' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Marketing Manager</h1>
            <p className="text-muted-foreground mt-1">Manage campaigns, SEO, content, and lead sources</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statCards.map((card, index) => (
            <Card key={card.title} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-sm font-medium">{card.title}</CardDescription>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color}`}>
                    <card.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {isLoading ? <span className="animate-pulse bg-muted rounded h-6 w-12 inline-block" /> : card.value}
                </p>
                {card.subtitle && <p className="text-xs text-muted-foreground">{card.subtitle}</p>}
                {card.total !== undefined && (
                  <p className="text-xs text-muted-foreground">of {card.total} total</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 hover:border-primary"
                  onClick={() => navigate(action.path)}
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Module Navigation */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate('/dashboard/marketing/campaigns')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                <Megaphone className="h-5 w-5" />
                Campaigns
              </CardTitle>
              <CardDescription>
                Create, manage, and track marketing campaigns across all channels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate('/dashboard/marketing/seo')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                <Search className="h-5 w-5" />
                SEO Management
              </CardTitle>
              <CardDescription>
                Track keywords, manage pages, and resolve SEO issues
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate('/dashboard/marketing/content')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                <FileText className="h-5 w-5" />
                Content
              </CardTitle>
              <CardDescription>
                Create, schedule, and publish content across platforms
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate('/dashboard/marketing/lead-sources')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                <Target className="h-5 w-5" />
                Lead Sources
              </CardTitle>
              <CardDescription>
                Configure lead sources, routing rules, and duplicate filters
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate('/dashboard/marketing/ai-tools')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                <Sparkles className="h-5 w-5" />
                AI Tools
              </CardTitle>
              <CardDescription>
                Review AI suggestions and manage automation settings
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate('/dashboard/marketing/analytics')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                <TrendingUp className="h-5 w-5" />
                Analytics
              </CardTitle>
              <CardDescription>
                View performance metrics and campaign insights
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
