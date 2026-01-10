import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useUserRoles } from '@/hooks/useUserRoles';
import { 
  useLeadSources, 
  useCreateLeadSource,
  useUpdateLeadSource,
  useToggleLeadSource,
  useDeleteLeadSource 
} from '@/hooks/useMarketingManagerData';
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  AlertCircle,
  Filter,
  MapPin,
  TrendingUp,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LeadSourcesPage() {
  const { isManager, isAdmin } = useUserRoles();
  const { data: sources, isLoading } = useLeadSources();
  const createSource = useCreateLeadSource();
  const updateSource = useUpdateLeadSource();
  const toggleSource = useToggleLeadSource();
  const deleteSource = useDeleteLeadSource();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    source_type: 'ads',
    priority: '5',
    daily_cap: '',
    monthly_cap: '',
    duplicate_filter_enabled: true,
  });

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

  const handleAdd = () => {
    createSource.mutate({
      name: formData.name,
      source_type: formData.source_type,
      priority: parseInt(formData.priority) || 5,
      daily_cap: parseInt(formData.daily_cap) || null,
      monthly_cap: parseInt(formData.monthly_cap) || null,
      duplicate_filter_enabled: formData.duplicate_filter_enabled,
    }, {
      onSuccess: () => {
        setAddDialogOpen(false);
        setFormData({
          name: '',
          source_type: 'ads',
          priority: '5',
          daily_cap: '',
          monthly_cap: '',
          duplicate_filter_enabled: true,
        });
      },
    });
  };

  const handleEdit = (source: any) => {
    setSelectedSource(source);
    setFormData({
      name: source.name,
      source_type: source.source_type,
      priority: source.priority?.toString() || '5',
      daily_cap: source.daily_cap?.toString() || '',
      monthly_cap: source.monthly_cap?.toString() || '',
      duplicate_filter_enabled: source.duplicate_filter_enabled,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (selectedSource) {
      updateSource.mutate({
        id: selectedSource.id,
        name: formData.name,
        source_type: formData.source_type,
        priority: parseInt(formData.priority) || 5,
        daily_cap: parseInt(formData.daily_cap) || null,
        monthly_cap: parseInt(formData.monthly_cap) || null,
        duplicate_filter_enabled: formData.duplicate_filter_enabled,
      }, {
        onSuccess: () => {
          setEditDialogOpen(false);
          setSelectedSource(null);
        },
      });
    }
  };

  const handleDelete = (source: any) => {
    setSelectedSource(source);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSource) {
      deleteSource.mutate(selectedSource.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedSource(null);
        },
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Lead Sources</h1>
            <p className="text-muted-foreground mt-1">Configure lead sources, routing, and duplicate filters</p>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead Source
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500">
                  <Filter className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duplicate Filter</p>
                  <p className="font-medium">Auto-enabled on all sources</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Geo Targeting</p>
                  <p className="font-medium">Region-based routing</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lead Scoring</p>
                  <p className="font-medium">AI-powered prioritization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sources List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            </Card>
          ) : sources?.length === 0 ? (
            <Card className="p-8 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No lead sources configured</p>
              <Button className="mt-4" onClick={() => setAddDialogOpen(true)}>
                Add your first lead source
              </Button>
            </Card>
          ) : (
            sources?.map((source) => (
              <Card key={source.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{source.name}</h3>
                        <Badge variant={source.is_enabled ? 'default' : 'secondary'}>
                          {source.is_enabled ? 'Active' : 'Disabled'}
                        </Badge>
                        <Badge variant="outline">{source.source_type}</Badge>
                        <Badge variant="outline">Priority: {source.priority}</Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Today: {source.leads_today || 0} leads</span>
                        <span>This Month: {source.leads_this_month || 0} leads</span>
                        {source.daily_cap && <span>Daily Cap: {source.daily_cap}</span>}
                        {source.monthly_cap && <span>Monthly Cap: {source.monthly_cap}</span>}
                        {source.conversion_rate && (
                          <span>Conversion: {Number(source.conversion_rate).toFixed(1)}%</span>
                        )}
                        {source.duplicate_filter_enabled && (
                          <Badge variant="outline" className="text-xs">
                            <Filter className="h-3 w-3 mr-1" />
                            Duplicate Filter
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={source.is_enabled}
                        onCheckedChange={(checked) => toggleSource.mutate({ id: source.id, enabled: checked })}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(source)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Source
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={() => handleDelete(source)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Source
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Lead Source</DialogTitle>
            <DialogDescription>Configure a new lead source</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Source Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Google Ads Campaign"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source Type</Label>
                <Select
                  value={formData.source_type}
                  onValueChange={(value) => setFormData({ ...formData, source_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ads">Paid Ads</SelectItem>
                    <SelectItem value="organic">Organic</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Daily Cap</Label>
                <Input
                  type="number"
                  value={formData.daily_cap}
                  onChange={(e) => setFormData({ ...formData, daily_cap: e.target.value })}
                  placeholder="No limit"
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Cap</Label>
                <Input
                  type="number"
                  value={formData.monthly_cap}
                  onChange={(e) => setFormData({ ...formData, monthly_cap: e.target.value })}
                  placeholder="No limit"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Enable Duplicate Filter</Label>
              <Switch
                checked={formData.duplicate_filter_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, duplicate_filter_enabled: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!formData.name || createSource.isPending}>
              Add Source
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lead Source</DialogTitle>
            <DialogDescription>Update lead source configuration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Source Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source Type</Label>
                <Select
                  value={formData.source_type}
                  onValueChange={(value) => setFormData({ ...formData, source_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ads">Paid Ads</SelectItem>
                    <SelectItem value="organic">Organic</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Daily Cap</Label>
                <Input
                  type="number"
                  value={formData.daily_cap}
                  onChange={(e) => setFormData({ ...formData, daily_cap: e.target.value })}
                  placeholder="No limit"
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Cap</Label>
                <Input
                  type="number"
                  value={formData.monthly_cap}
                  onChange={(e) => setFormData({ ...formData, monthly_cap: e.target.value })}
                  placeholder="No limit"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Enable Duplicate Filter</Label>
              <Switch
                checked={formData.duplicate_filter_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, duplicate_filter_enabled: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={!formData.name || updateSource.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lead Source</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedSource?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteSource.isPending}>
              Delete Source
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
