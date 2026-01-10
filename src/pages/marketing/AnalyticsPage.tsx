import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useCampaigns, useMarketingStats } from '@/hooks/useMarketingManagerData';
import { 
  BarChart3, 
  TrendingUp,
  DollarSign,
  Users,
  MousePointer,
  Eye,
  AlertCircle,
  Target
} from 'lucide-react';

export default function AnalyticsPage() {
  const { isManager, isAdmin } = useUserRoles();
  const { data: stats, isLoading: statsLoading } = useMarketingStats();
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();

  if (!isManager() && !isAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Access Denied</span>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const isLoading = statsLoading || campaignsLoading;

  // Calculate aggregate metrics
  const totalImpressions = campaigns?.reduce((sum, c) => sum + (c.impressions || 0), 0) || 0;
  const totalClicks = campaigns?.reduce((sum, c) => sum + (c.clicks || 0), 0) || 0;
  const totalConversions = campaigns?.reduce((sum, c) => sum + (c.conversions || 0), 0) || 0;
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0';
  const avgCostPerLead = stats?.totalLeads && stats.totalLeads > 0 
    ? (stats.totalSpent / stats.totalLeads).toFixed(2) 
    : '0';

  const metricCards = [
    {
      title: 'Total Budget',
      value: `$${(stats?.totalBudget || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-emerald-500 to-green-500',
      subtitle: `$${(stats?.totalSpent || 0).toLocaleString()} spent`,
    },
    {
      title: 'Total Impressions',
      value: totalImpressions.toLocaleString(),
      icon: Eye,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Total Clicks',
      value: totalClicks.toLocaleString(),
      icon: MousePointer,
      color: 'from-purple-500 to-violet-500',
      subtitle: `${ctr}% CTR`,
    },
    {
      title: 'Total Conversions',
      value: totalConversions.toLocaleString(),
      icon: Target,
      color: 'from-orange-500 to-amber-500',
      subtitle: `${conversionRate}% conversion rate`,
    },
    {
      title: 'Leads Generated',
      value: (stats?.totalLeads || 0).toLocaleString(),
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      subtitle: `$${avgCostPerLead} avg CPL`,
    },
    {
      title: 'Active Campaigns',
      value: stats?.activeCampaigns || 0,
      icon: TrendingUp,
      color: 'from-indigo-500 to-blue-500',
      subtitle: `${stats?.totalCampaigns || 0} total`,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">View marketing performance metrics and insights</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metricCards.map((card) => (
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
                <p className="text-3xl font-bold">
                  {isLoading ? (
                    <span className="animate-pulse bg-muted rounded h-8 w-20 inline-block" />
                  ) : (
                    card.value
                  )}
                </p>
                {card.subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">{card.subtitle}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Campaign Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Campaign Performance
            </CardTitle>
            <CardDescription>Performance breakdown by campaign</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : !campaigns || campaigns.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No campaign data available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Campaign</th>
                      <th className="text-right py-3 px-4 font-medium">Status</th>
                      <th className="text-right py-3 px-4 font-medium">Budget</th>
                      <th className="text-right py-3 px-4 font-medium">Spent</th>
                      <th className="text-right py-3 px-4 font-medium">Impressions</th>
                      <th className="text-right py-3 px-4 font-medium">Clicks</th>
                      <th className="text-right py-3 px-4 font-medium">CTR</th>
                      <th className="text-right py-3 px-4 font-medium">Leads</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => {
                      const campaignCtr = campaign.impressions && campaign.impressions > 0
                        ? ((campaign.clicks || 0) / campaign.impressions * 100).toFixed(2)
                        : '0';
                      return (
                        <tr key={campaign.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{campaign.name}</p>
                              <p className="text-xs text-muted-foreground">{campaign.campaign_type}</p>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                              campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="text-right py-3 px-4">${Number(campaign.budget).toLocaleString()}</td>
                          <td className="text-right py-3 px-4">${Number(campaign.spent).toLocaleString()}</td>
                          <td className="text-right py-3 px-4">{(campaign.impressions || 0).toLocaleString()}</td>
                          <td className="text-right py-3 px-4">{(campaign.clicks || 0).toLocaleString()}</td>
                          <td className="text-right py-3 px-4">{campaignCtr}%</td>
                          <td className="text-right py-3 px-4">{campaign.leads_generated || 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
