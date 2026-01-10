import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useCampaigns, useDeleteCampaign, usePauseCampaign, useResumeCampaign } from '@/hooks/useMarketingManagerData';
import { useNavigate } from 'react-router-dom';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Pause, 
  Play,
  DollarSign,
  Users,
  MousePointer,
  Eye,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const statusColors: Record<string, string> = {
  draft: 'bg-slate-500',
  pending_approval: 'bg-yellow-500',
  active: 'bg-green-500',
  paused: 'bg-orange-500',
  completed: 'bg-blue-500',
  cancelled: 'bg-red-500',
};

const typeLabels: Record<string, string> = {
  google_ads: 'Google Ads',
  meta_ads: 'Meta Ads',
  linkedin_ads: 'LinkedIn Ads',
  email: 'Email',
  sms: 'SMS',
  whatsapp: 'WhatsApp',
  organic: 'Organic',
};

export default function CampaignsPage() {
  const { isManager, isAdmin } = useUserRoles();
  const navigate = useNavigate();
  const { data: campaigns, isLoading } = useCampaigns();
  const deleteCampaign = useDeleteCampaign();
  const pauseCampaign = usePauseCampaign();
  const resumeCampaign = useResumeCampaign();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [pauseReason, setPauseReason] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const filteredCampaigns = campaigns?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.campaign_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePause = (id: string) => {
    setSelectedCampaign(id);
    setPauseDialogOpen(true);
  };

  const confirmPause = () => {
    if (selectedCampaign && pauseReason) {
      pauseCampaign.mutate({ id: selectedCampaign, reason: pauseReason });
      setPauseDialogOpen(false);
      setPauseReason('');
      setSelectedCampaign(null);
    }
  };

  const handleResume = (id: string) => {
    resumeCampaign.mutate(id);
  };

  const handleDelete = (id: string) => {
    setSelectedCampaign(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCampaign) {
      deleteCampaign.mutate(selectedCampaign);
      setDeleteDialogOpen(false);
      setSelectedCampaign(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Campaigns</h1>
            <p className="text-muted-foreground mt-1">Manage marketing campaigns across all channels</p>
          </div>
          <Button onClick={() => navigate('/dashboard/marketing/campaigns/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            </Card>
          ) : filteredCampaigns?.length === 0 ? (
            <Card className="p-8 text-center">
              <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No campaigns found</p>
              <Button className="mt-4" onClick={() => navigate('/dashboard/marketing/campaigns/create')}>
                Create your first campaign
              </Button>
            </Card>
          ) : (
            filteredCampaigns?.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        <Badge className={statusColors[campaign.status]}>
                          {campaign.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">{typeLabels[campaign.campaign_type]}</Badge>
                      </div>
                      {campaign.description && (
                        <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>Budget: ${Number(campaign.budget).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span>Spent: ${Number(campaign.spent).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>{campaign.impressions?.toLocaleString() || 0} impressions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MousePointer className="h-4 w-4 text-muted-foreground" />
                          <span>{campaign.clicks?.toLocaleString() || 0} clicks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{campaign.leads_generated || 0} leads</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/marketing/campaigns/edit/${campaign.id}`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {campaign.status === 'active' ? (
                          <DropdownMenuItem onClick={() => handlePause(campaign.id)}>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </DropdownMenuItem>
                        ) : campaign.status === 'paused' && (
                          <DropdownMenuItem onClick={() => handleResume(campaign.id)}>
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/marketing/campaigns/${campaign.id}/budget-history`)}>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Budget History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(campaign.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Pause Dialog */}
      <Dialog open={pauseDialogOpen} onOpenChange={setPauseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pause Campaign</DialogTitle>
            <DialogDescription>
              Pausing will immediately stop all spend on this campaign. Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for pausing..."
            value={pauseReason}
            onChange={(e) => setPauseReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setPauseDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmPause} disabled={!pauseReason || pauseCampaign.isPending}>
              Confirm Pause
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteCampaign.isPending}>
              Delete Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
