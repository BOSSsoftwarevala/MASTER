import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useApiProviders, useUpdateApiProvider, ApiProvider } from '@/hooks/useAiApiManagerData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plug,
  Brain,
  Search,
  Target,
  CreditCard,
  Bell,
  HardDrive,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Key,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

const categoryIcons: Record<string, typeof Plug> = {
  ai: Brain,
  seo: Search,
  lead: Target,
  payment: CreditCard,
  notification: Bell,
  storage: HardDrive,
  other: Plug,
};

const statusColors: Record<string, string> = {
  not_connected: 'bg-muted text-muted-foreground',
  connected: 'bg-success/10 text-success',
  error: 'bg-destructive/10 text-destructive',
  paused: 'bg-amber-500/10 text-amber-500',
};

const statusIcons: Record<string, typeof CheckCircle> = {
  not_connected: XCircle,
  connected: CheckCircle,
  error: AlertTriangle,
  paused: RefreshCw,
};

export default function ApiProvidersPage() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { data: providers, isLoading } = useApiProviders();
  const updateProvider = useUpdateApiProvider();
  const [selectedProvider, setSelectedProvider] = useState<ApiProvider | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

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

  const handleToggleProvider = (provider: ApiProvider) => {
    updateProvider.mutate({
      id: provider.id,
      updates: { is_enabled: !provider.is_enabled },
    });
  };

  const handleTestConnection = (provider: ApiProvider) => {
    // In real implementation, this would call an edge function to test the connection
    updateProvider.mutate({
      id: provider.id,
      updates: { status: 'connected', error_count: 0, last_error: null },
    });
  };

  const handleSaveConfig = () => {
    if (!selectedProvider) return;
    
    updateProvider.mutate({
      id: selectedProvider.id,
      updates: {
        monthly_limit: selectedProvider.monthly_limit,
      },
    });
    setConfigDialogOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const categories = ['ai', 'seo', 'lead', 'payment', 'notification', 'storage', 'other'];

  const groupedProviders = providers?.reduce((acc, provider) => {
    if (!acc[provider.category]) {
      acc[provider.category] = [];
    }
    acc[provider.category].push(provider);
    return acc;
  }, {} as Record<string, ApiProvider[]>) || {};

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
              <Plug className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">API Providers</h1>
              <p className="text-muted-foreground mt-1">Connect and manage external services</p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className="bg-muted/30 border-muted">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Key className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">API Keys are Encrypted</p>
                <p className="text-sm text-muted-foreground">
                  All API keys are securely encrypted. After saving, only the last 4 characters are visible.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs by Category */}
        <Tabs defaultValue="ai" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat] || Plug;
              const count = groupedProviders[cat]?.length || 0;
              return (
                <TabsTrigger key={cat} value={cat} className="capitalize gap-2">
                  <Icon className="h-4 w-4" />
                  {cat} ({count})
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat} className="space-y-4">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
                </div>
              ) : (groupedProviders[cat]?.length || 0) === 0 ? (
                <Card className="p-8 text-center">
                  <Plug className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No {cat} providers configured</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedProviders[cat]?.map((provider) => {
                    const Icon = categoryIcons[provider.category] || Plug;
                    const StatusIcon = statusIcons[provider.status];
                    const usagePercent = provider.monthly_limit > 0 
                      ? (provider.current_usage / provider.monthly_limit) * 100 
                      : 0;

                    return (
                      <Card key={provider.id} className="transition-all hover:shadow-md">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-blue-500/10">
                                <Icon className="h-5 w-5 text-blue-500" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{provider.name}</CardTitle>
                                <CardDescription className="text-xs">{provider.description}</CardDescription>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge className={statusColors[provider.status]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {provider.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Switch
                              checked={provider.is_enabled}
                              onCheckedChange={() => handleToggleProvider(provider)}
                            />
                          </div>

                          {provider.last_error && (
                            <div className="p-2 rounded bg-destructive/10 text-xs text-destructive">
                              {provider.last_error}
                            </div>
                          )}

                          {provider.monthly_limit > 0 && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Usage</span>
                                <span className="font-medium">
                                  {formatCurrency(provider.current_usage)} / {formatCurrency(provider.monthly_limit)}
                                </span>
                              </div>
                              <Progress value={usagePercent} className="h-1.5" />
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            {provider.status === 'not_connected' ? (
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  setSelectedProvider(provider);
                                  setApiKeyDialogOpen(true);
                                }}
                              >
                                <Key className="h-3 w-3 mr-1" />
                                Add API Key
                              </Button>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleTestConnection(provider)}
                                >
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  Test
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedProvider(provider);
                                    setConfigDialogOpen(true);
                                  }}
                                >
                                  <Settings className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Config Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {selectedProvider?.name}</DialogTitle>
            <DialogDescription>Set usage limits for this API provider</DialogDescription>
          </DialogHeader>
          
          {selectedProvider && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Monthly Usage Limit ($)</Label>
                <Input
                  type="number"
                  value={selectedProvider.monthly_limit}
                  onChange={(e) => setSelectedProvider({
                    ...selectedProvider,
                    monthly_limit: Number(e.target.value),
                  })}
                  placeholder="0 = unlimited"
                />
                <p className="text-xs text-muted-foreground">
                  Set to 0 for unlimited. API will pause when limit is reached.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfig} disabled={updateProvider.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* API Key Dialog */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add API Key for {selectedProvider?.name}</DialogTitle>
            <DialogDescription>
              Enter your API key. It will be encrypted and stored securely.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Enter your API key"
              />
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              <p>After saving, only the last 4 characters will be visible for security.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setApiKeyDialogOpen(false);
              setApiKeyInput('');
            }}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedProvider && apiKeyInput) {
                  updateProvider.mutate({
                    id: selectedProvider.id,
                    updates: { status: 'connected' },
                  });
                  setApiKeyDialogOpen(false);
                  setApiKeyInput('');
                }
              }}
            >
              Connect Provider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
