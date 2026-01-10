import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Server, ArrowLeft, Save, X } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useServers, useUpdateServer } from '@/hooks/useServerData';
import { toast } from 'sonner';

export default function EditServerPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: servers, isLoading } = useServers();
  const updateServer = useUpdateServer();
  
  const [formData, setFormData] = useState({
    name: '',
    owner_type: 'own' as 'own' | 'client',
    server_type: 'cloud' as 'cloud' | 'vps' | 'dedicated',
    provider: '',
    cpu_spec: '',
    ram_spec: '',
    disk_spec: '',
    ip_address: '',
    region: '',
    monthly_cost: '',
    auto_scale_enabled: false,
    client_name: '',
    client_sla: '',
    status: 'running' as 'running' | 'warning' | 'down' | 'maintenance',
  });
  
  const server = servers?.find(s => s.id === id);
  
  useEffect(() => {
    if (server) {
      setFormData({
        name: server.name || '',
        owner_type: server.owner_type || 'own',
        server_type: server.server_type || 'cloud',
        provider: server.provider || '',
        cpu_spec: server.cpu_spec || '',
        ram_spec: server.ram_spec || '',
        disk_spec: server.disk_spec || '',
        ip_address: server.ip_address || '',
        region: server.region || '',
        monthly_cost: server.monthly_cost?.toString() || '',
        auto_scale_enabled: server.auto_scale_enabled || false,
        client_name: server.client_name || '',
        client_sla: server.client_sla || '',
        status: server.status || 'running',
      });
    }
  }, [server]);
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!server) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Server not found</p>
          <Button onClick={() => navigate('/dashboard/boss/server/servers/company')} className="mt-4">
            Back to Servers
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateServer.mutateAsync({
        id: server.id,
        name: formData.name,
        provider: formData.provider,
        server_type: formData.server_type,
        cpu_spec: formData.cpu_spec || null,
        ram_spec: formData.ram_spec || null,
        disk_spec: formData.disk_spec || null,
        ip_address: formData.ip_address || null,
        region: formData.region || null,
        monthly_cost: formData.monthly_cost ? parseFloat(formData.monthly_cost) : null,
        auto_scale_enabled: formData.auto_scale_enabled,
        client_name: formData.owner_type === 'client' ? formData.client_name : null,
        client_sla: formData.owner_type === 'client' ? formData.client_sla : null,
        status: formData.status,
      });
      
      navigate(-1);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Server className="h-8 w-8 text-primary" />
              Edit Server
            </h1>
            <p className="text-muted-foreground mt-1">Update server configuration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Server Details</CardTitle>
              <CardDescription>Modify the server configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Server Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'running' | 'warning' | 'down' | 'maintenance') => 
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="down">Down</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="server_type">Server Type</Label>
                  <Select
                    value={formData.server_type}
                    onValueChange={(value: 'cloud' | 'vps' | 'dedicated') => 
                      setFormData({ ...formData, server_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cloud">Cloud</SelectItem>
                      <SelectItem value="vps">VPS</SelectItem>
                      <SelectItem value="dedicated">Dedicated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Input
                    id="provider"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpu_spec">CPU Spec</Label>
                  <Input
                    id="cpu_spec"
                    value={formData.cpu_spec}
                    onChange={(e) => setFormData({ ...formData, cpu_spec: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ram_spec">RAM Spec</Label>
                  <Input
                    id="ram_spec"
                    value={formData.ram_spec}
                    onChange={(e) => setFormData({ ...formData, ram_spec: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="disk_spec">Disk Spec</Label>
                  <Input
                    id="disk_spec"
                    value={formData.disk_spec}
                    onChange={(e) => setFormData({ ...formData, disk_spec: e.target.value })}
                  />
                </div>
              </div>

              {/* Network */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ip_address">IP Address</Label>
                  <Input
                    id="ip_address"
                    value={formData.ip_address}
                    onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  />
                </div>
              </div>

              {/* Cost & Scaling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly_cost">Monthly Cost (₹)</Label>
                  <Input
                    id="monthly_cost"
                    type="number"
                    value={formData.monthly_cost}
                    onChange={(e) => setFormData({ ...formData, monthly_cost: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label htmlFor="auto_scale">Auto-Scaling</Label>
                    <p className="text-sm text-muted-foreground">Enable automatic scaling</p>
                  </div>
                  <Switch
                    id="auto_scale"
                    checked={formData.auto_scale_enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, auto_scale_enabled: checked })}
                  />
                </div>
              </div>

              {/* Client Info (conditional) */}
              {formData.owner_type === 'client' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border border-dashed">
                  <div className="space-y-2">
                    <Label htmlFor="client_name">Client Name</Label>
                    <Input
                      id="client_name"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="client_sla">SLA Plan</Label>
                    <Select
                      value={formData.client_sla}
                      onValueChange={(value) => setFormData({ ...formData, client_sla: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SLA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic (99% Uptime)</SelectItem>
                        <SelectItem value="standard">Standard (99.5% Uptime)</SelectItem>
                        <SelectItem value="premium">Premium (99.9% Uptime)</SelectItem>
                        <SelectItem value="enterprise">Enterprise (99.99% Uptime)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={updateServer.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateServer.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}