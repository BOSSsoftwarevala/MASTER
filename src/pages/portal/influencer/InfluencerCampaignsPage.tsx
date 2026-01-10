import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Megaphone, Search, Calendar, ExternalLink } from 'lucide-react';
import { useState } from 'react';

// Mock data
const campaigns = [
  { id: 1, name: 'Summer Product Launch', platform: 'YouTube', type: 'video', status: 'in_progress', deadline: 'Jan 15', reach: 125000, target: 150000, commission: 1500 },
  { id: 2, name: 'Tech Tutorial Series', platform: 'Instagram', type: 'reel', status: 'completed', deadline: 'Jan 5', reach: 98000, target: 80000, commission: 2100 },
  { id: 3, name: 'New Year Promo', platform: 'TikTok', type: 'video', status: 'assigned', deadline: 'Jan 20', reach: 0, target: 200000, commission: 2500 },
  { id: 4, name: 'Product Review', platform: 'Blog', type: 'blog', status: 'submitted', deadline: 'Jan 8', reach: 15000, target: 20000, commission: 500 },
  { id: 5, name: 'Feature Showcase', platform: 'YouTube', type: 'video', status: 'approved', deadline: 'Jan 12', reach: 45000, target: 50000, commission: 800 },
];

export default function InfluencerCampaignsPage() {
  const [search, setSearch] = useState('');

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(search.toLowerCase()) ||
    campaign.platform.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RoleLayout role="influencer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assigned Campaigns</h1>
            <p className="text-muted-foreground">Your active promotion campaigns</p>
          </div>
          <Badge variant="outline" className="bg-violet-500/20 text-violet-400 border-violet-500/30">
            <Megaphone className="h-3 w-3 mr-1" />
            {campaigns.filter(c => c.status !== 'completed').length} Active
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search campaigns..." 
              className="pl-9" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{campaign.platform}</span>
                      <span>•</span>
                      <span className="capitalize">{campaign.type}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    campaign.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    campaign.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                    campaign.status === 'submitted' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    campaign.status === 'approved' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                    'bg-slate-500/20 text-slate-400 border-slate-500/30'
                  }>
                    {campaign.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Reach Progress</span>
                      <span className="text-sm font-medium">
                        {(campaign.reach / 1000).toFixed(0)}K / {(campaign.target / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <Progress value={(campaign.reach / campaign.target) * 100} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Due {campaign.deadline}
                    </div>
                    <div className="text-sm font-medium text-emerald-500">
                      ${campaign.commission} commission
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Brief
                    </Button>
                    <Button size="sm" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Submit Content
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </RoleLayout>
  );
}
