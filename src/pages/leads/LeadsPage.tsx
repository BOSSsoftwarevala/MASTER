import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Target, Flame, ThermometerSun, Snowflake, Phone, Mail, Building2, User, Calendar, DollarSign, GripVertical } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Lead = Database['public']['Tables']['leads']['Row'];
type LeadStatus = Database['public']['Enums']['lead_status'];
type LeadTemperature = Database['public']['Enums']['lead_temperature'];
type LeadSource = Database['public']['Enums']['lead_source'];

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bgColor: string }> = {
  new: { label: 'New', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
  contacted: { label: 'Contacted', color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200' },
  qualified: { label: 'Qualified', color: 'text-violet-700', bgColor: 'bg-violet-50 border-violet-200' },
  demo_scheduled: { label: 'Demo Scheduled', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200' },
  demo_done: { label: 'Demo Done', color: 'text-fuchsia-700', bgColor: 'bg-fuchsia-50 border-fuchsia-200' },
  proposal_sent: { label: 'Proposal Sent', color: 'text-pink-700', bgColor: 'bg-pink-50 border-pink-200' },
  negotiation: { label: 'Negotiation', color: 'text-orange-700', bgColor: 'bg-orange-50 border-orange-200' },
  won: { label: 'Won 🎉', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
  lost: { label: 'Lost', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' },
  on_hold: { label: 'On Hold', color: 'text-gray-700', bgColor: 'bg-gray-50 border-gray-200' },
};

const TEMPERATURE_CONFIG: Record<LeadTemperature, { label: string; icon: typeof Flame; color: string; bgColor: string }> = {
  hot: { label: 'Hot', icon: Flame, color: 'text-red-600', bgColor: 'bg-red-100' },
  warm: { label: 'Warm', icon: ThermometerSun, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  cold: { label: 'Cold', icon: Snowflake, color: 'text-blue-600', bgColor: 'bg-blue-100' },
};

const KANBAN_STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'demo_scheduled', 'demo_done', 'proposal_sent', 'negotiation', 'won', 'lost'];

const SOURCE_OPTIONS: LeadSource[] = ['website', 'referral', 'google_ads', 'facebook_ads', 'linkedin', 'cold_call', 'email_campaign', 'trade_show', 'partner', 'other'];

export default function LeadsPage() {
  const { isManager, loading: rolesLoading } = useUserRoles();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  
  // Form state for new lead
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    company_name: '',
    designation: '',
    source: 'website' as LeadSource,
    temperature: 'cold' as LeadTemperature,
    budget_range: '',
    notes: '',
  });

  useEffect(() => {
    if (!rolesLoading) {
      fetchLeads();
    }
  }, [rolesLoading]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to load leads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: LeadStatus) => {
    e.preventDefault();
    if (!draggedLead || draggedLead.status === newStatus) {
      setDraggedLead(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', draggedLead.id);

      if (error) throw error;

      setLeads(prev => prev.map(l => 
        l.id === draggedLead.id ? { ...l, status: newStatus } : l
      ));

      toast({
        title: 'Lead Updated',
        description: `Moved to ${STATUS_CONFIG[newStatus].label}`,
      });
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lead status',
        variant: 'destructive',
      });
    } finally {
      setDraggedLead(null);
    }
  };

  const handleCreateLead = async () => {
    if (!formData.email.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Email is required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          first_name: formData.first_name.trim() || null,
          last_name: formData.last_name.trim() || null,
          email: formData.email.trim(),
          mobile: formData.mobile.trim() || null,
          company_name: formData.company_name.trim() || null,
          designation: formData.designation.trim() || null,
          source: formData.source,
          temperature: formData.temperature,
          budget_range: formData.budget_range.trim() || null,
          status: 'new',
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Lead created successfully',
      });

      setDialogOpen(false);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        company_name: '',
        designation: '',
        source: 'website',
        temperature: 'cold',
        budget_range: '',
        notes: '',
      });
      fetchLeads();
    } catch (error) {
      console.error('Error creating lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to create lead',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getLeadsByStatus = (status: LeadStatus) => {
    return leads.filter(lead => {
      const matchesStatus = lead.status === status;
      if (!searchQuery) return matchesStatus;
      
      const searchLower = searchQuery.toLowerCase();
      const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.toLowerCase();
      const matchesSearch = fullName.includes(searchLower) || 
        lead.email.toLowerCase().includes(searchLower) ||
        (lead.company_name?.toLowerCase().includes(searchLower) ?? false);
      
      return matchesStatus && matchesSearch;
    });
  };

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isManager()) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Target className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">Only Managers can access leads.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Lead Management
            </h1>
            <p className="text-muted-foreground mt-1">Track and manage your sales pipeline</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setDialogOpen(true)} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <p className="text-blue-100 text-sm">Total Leads</p>
              <p className="text-2xl font-bold">{leads.length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-red-500 to-orange-500 text-white">
            <CardContent className="p-4">
              <p className="text-red-100 text-sm">Hot Leads</p>
              <p className="text-2xl font-bold">{leads.filter(l => l.temperature === 'hot').length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-500 to-green-500 text-white">
            <CardContent className="p-4">
              <p className="text-emerald-100 text-sm">Won</p>
              <p className="text-2xl font-bold">{leads.filter(l => l.status === 'won').length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-violet-500 text-white">
            <CardContent className="p-4">
              <p className="text-purple-100 text-sm">In Pipeline</p>
              <p className="text-2xl font-bold">{leads.filter(l => !['won', 'lost', 'on_hold'].includes(l.status || '')).length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {KANBAN_STATUSES.map(status => {
                const statusLeads = getLeadsByStatus(status);
                const config = STATUS_CONFIG[status];
                
                return (
                  <div
                    key={status}
                    className={`w-72 flex-shrink-0 rounded-xl border ${config.bgColor} p-3`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-semibold ${config.color}`}>{config.label}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {statusLeads.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 min-h-[200px]">
                      {statusLeads.map(lead => (
                        <LeadCard 
                          key={lead.id} 
                          lead={lead} 
                          onDragStart={handleDragStart}
                        />
                      ))}
                      {statusLeads.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          No leads
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Add New Lead
            </DialogTitle>
            <DialogDescription>
              Enter the lead details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@company.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                placeholder="+91 98765 43210"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="Acme Inc"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                  placeholder="CEO"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source</Label>
                <Select value={formData.source} onValueChange={(v: LeadSource) => setFormData(prev => ({ ...prev, source: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCE_OPTIONS.map(src => (
                      <SelectItem key={src} value={src}>
                        {src.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Temperature</Label>
                <Select value={formData.temperature} onValueChange={(v: LeadTemperature) => setFormData(prev => ({ ...prev, temperature: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cold">❄️ Cold</SelectItem>
                    <SelectItem value="warm">🌡️ Warm</SelectItem>
                    <SelectItem value="hot">🔥 Hot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget_range">Budget Range</Label>
              <Input
                id="budget_range"
                value={formData.budget_range}
                onChange={(e) => setFormData(prev => ({ ...prev, budget_range: e.target.value }))}
                placeholder="₹50,000 - ₹1,00,000"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLead} disabled={saving}>
              {saving ? 'Creating...' : 'Create Lead'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

// Lead Card Component
function LeadCard({ lead, onDragStart }: { lead: Lead; onDragStart: (e: React.DragEvent, lead: Lead) => void }) {
  const tempConfig = TEMPERATURE_CONFIG[lead.temperature || 'cold'];
  const TempIcon = tempConfig.icon;
  
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead)}
      className="bg-white rounded-lg p-3 shadow-sm border border-border/50 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">
            {lead.first_name || lead.last_name 
              ? `${lead.first_name || ''} ${lead.last_name || ''}`.trim()
              : 'No Name'}
          </p>
          {lead.company_name && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Building2 className="h-3 w-3" />
              {lead.company_name}
            </p>
          )}
        </div>
        <div className={`p-1 rounded ${tempConfig.bgColor}`}>
          <TempIcon className={`h-3.5 w-3.5 ${tempConfig.color}`} />
        </div>
      </div>
      
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Mail className="h-3 w-3" />
          <span className="truncate">{lead.email}</span>
        </div>
        {lead.mobile && (
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3" />
            <span>{lead.mobile}</span>
          </div>
        )}
      </div>
      
      {lead.budget_range && (
        <div className="mt-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            <span>{lead.budget_range}</span>
          </div>
        </div>
      )}
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
