import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAiServices, useUpdateAiService, AiService } from '@/hooks/useAiApiManagerData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Brain,
  Code2,
  Search,
  Target,
  MessageSquare,
  Eye,
  Settings,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  DollarSign,
} from 'lucide-react';

const categoryIcons: Record<string, typeof Brain> = {
  development: Code2,
  seo: Search,
  lead: Target,
  chatbot: MessageSquare,
  supervisor: Eye,
};

const categoryColors: Record<string, string> = {
  development: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
  seo: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
  lead: 'text-green-500 bg-green-500/10 border-green-500/30',
  chatbot: 'text-teal-500 bg-teal-500/10 border-teal-500/30',
  supervisor: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
};

const categoryDescriptions: Record<string, string> = {
  development: 'Code generation, bug fixing, feature development',
  seo: 'Keyword generation, SEO content, meta & schema',
  lead: 'Lead scoring, spam detection, campaign optimization',
  chatbot: 'Client support, requirement clarification, translations',
  supervisor: 'System monitoring, risk detection, recommendations',
};

export default function AiServicesPage() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { data: services, isLoading } = useAiServices();
  const updateService = useUpdateAiService();
  const [selectedService, setSelectedService] = useState<AiService | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isSuperAdmin()) {
    return <Navigate to="/dashboard/boss" replace />;
  }

  const handleToggleService = (service: AiService) => {
    updateService.mutate({
      id: service.id,
      updates: { is_enabled: !service.is_enabled, status: !service.is_enabled ? 'on' : 'off' },
    });
  };

  const handleStatusChange = (service: AiService, status: string) => {
    updateService.mutate({
      id: service.id,
      updates: { status: status as AiService['status'] },
    });
  };

  const handleSaveConfig = () => {
    if (!selectedService) return;
    
    updateService.mutate({
      id: selectedService.id,
      updates: {
        monthly_limit: selectedService.monthly_limit,
        requires_approval: selectedService.requires_approval,
      },
    });
    setConfigDialogOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
              <Brain className="h-8 w-8 text-violet-500" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">AI Services</h1>
              <p className="text-muted-foreground mt-1">Enable, disable, and configure AI capabilities</p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className="bg-muted/30 border-muted">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">AI Requires API Key</p>
                <p className="text-sm text-muted-foreground">
                  To activate AI services, you need to connect an API provider first. The system will ask when required.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))
          ) : (
            services?.map((service) => {
              const Icon = categoryIcons[service.category] || Brain;
              const colorClass = categoryColors[service.category] || 'text-muted-foreground bg-muted';
              const usagePercent = service.monthly_limit > 0 
                ? (service.current_usage / service.monthly_limit) * 100 
                : 0;

              return (
                <Card key={service.id} className={`${colorClass} transition-all`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${colorClass}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-foreground">{service.name}</CardTitle>
                          <CardDescription>{categoryDescriptions[service.category]}</CardDescription>
                        </div>
                      </div>
                      <Switch
                        checked={service.is_enabled}
                        onCheckedChange={() => handleToggleService(service)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-medium text-foreground">
                        {service.model_provider}/{service.model_name || 'Not set'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Select
                        value={service.status}
                        onValueChange={(val) => handleStatusChange(service, val)}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="off">Off</SelectItem>
                          <SelectItem value="on">On</SelectItem>
                          <SelectItem value="limited">Limited</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {service.monthly_limit > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Usage</span>
                          <span className="font-medium text-foreground">
                            {formatCurrency(service.current_usage)} / {formatCurrency(service.monthly_limit)}
                          </span>
                        </div>
                        <Progress value={usagePercent} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        {service.requires_approval && (
                          <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                            Approval Required
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedService(service);
                          setConfigDialogOpen(true);
                        }}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Config Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {selectedService?.name}</DialogTitle>
            <DialogDescription>
              Set limits and approval requirements for this AI service
            </DialogDescription>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Monthly Cost Limit ($)</Label>
                <Input
                  type="number"
                  value={selectedService.monthly_limit}
                  onChange={(e) => setSelectedService({
                    ...selectedService,
                    monthly_limit: Number(e.target.value),
                  })}
                  placeholder="0 = unlimited"
                />
                <p className="text-xs text-muted-foreground">
                  Set to 0 for unlimited. Service will pause when limit is reached.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-foreground">Require Approval</p>
                  <p className="text-sm text-muted-foreground">
                    AI actions need manual approval before execution
                  </p>
                </div>
                <Switch
                  checked={selectedService.requires_approval}
                  onCheckedChange={(checked) => setSelectedService({
                    ...selectedService,
                    requires_approval: checked,
                  })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfig} disabled={updateService.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
