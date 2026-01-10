import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useFinancePlans } from '@/hooks/useFinanceData';
import { format, addMonths, addYears } from 'date-fns';
import { toast } from 'sonner';
import {
  CreditCard,
  Plus,
  AlertTriangle,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';

interface Subscription {
  id: string;
  user_id: string;
  user_name: string;
  plan_id: string;
  status: string;
  starts_at: string;
  expires_at: string | null;
  auto_renew: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  finance_plans?: {
    name: string;
    price: number;
    plan_type: string;
  };
}

export default function SubscriptionsPage() {
  const { isAdmin } = useUserRoles();
  const queryClient = useQueryClient();
  const { data: plans } = useFinancePlans();
  
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['finance_subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('finance_subscriptions')
        .select('*, finance_plans(name, price, plan_type)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Subscription[];
    },
  });

  const createSubscription = useMutation({
    mutationFn: async (sub: {
      user_id: string;
      user_name: string;
      plan_id: string;
      status: string;
      starts_at: string;
      expires_at: string;
      auto_renew: boolean;
    }) => {
      const { data, error } = await supabase
        .from('finance_subscriptions')
        .insert(sub)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_subscriptions'] });
      toast.success('Subscription created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create subscription: ' + error.message);
    },
  });

  const updateSubscription = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Subscription> & { id: string }) => {
      const { data, error } = await supabase
        .from('finance_subscriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance_subscriptions'] });
      toast.success('Subscription updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update subscription: ' + error.message);
    },
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSub, setNewSub] = useState({
    user_id: '',
    user_name: '',
    plan_id: '',
    auto_renew: true,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'expired':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Expired</Badge>;
      case 'cancelled':
        return <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCreate = async () => {
    if (!newSub.user_name || !newSub.plan_id) return;
    
    const selectedPlan = plans?.find(p => p.id === newSub.plan_id);
    const expiresAt = selectedPlan?.billing_cycle === 'yearly' 
      ? addYears(new Date(), 1) 
      : addMonths(new Date(), 1);
    
    await createSubscription.mutateAsync({
      user_id: newSub.user_id || crypto.randomUUID(),
      user_name: newSub.user_name,
      plan_id: newSub.plan_id,
      status: 'active',
      starts_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      auto_renew: newSub.auto_renew,
    });
    
    setCreateDialogOpen(false);
    setNewSub({ user_id: '', user_name: '', plan_id: '', auto_renew: true });
  };

  const handleToggleAutoRenew = async (sub: Subscription) => {
    await updateSubscription.mutateAsync({
      id: sub.id,
      auto_renew: !sub.auto_renew,
    });
  };

  const handleCancel = async (sub: Subscription) => {
    await updateSubscription.mutateAsync({
      id: sub.id,
      status: 'cancelled',
    });
  };

  if (!isAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Card className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access Subscriptions.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const activeSubscriptions = subscriptions?.filter(s => s.status === 'active') || [];
  const expiredSubscriptions = subscriptions?.filter(s => s.status === 'expired') || [];
  const cancelledSubscriptions = subscriptions?.filter(s => s.status === 'cancelled') || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Subscriptions</h1>
            <p className="text-muted-foreground mt-1">Manage user and partner subscriptions</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Subscription
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSubscriptions.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expired</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expiredSubscriptions.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-gray-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cancelledSubscriptions.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions Table */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active ({activeSubscriptions.length})</TabsTrigger>
            <TabsTrigger value="expired">Expired ({expiredSubscriptions.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledSubscriptions.length})</TabsTrigger>
            <TabsTrigger value="all">All ({subscriptions?.length || 0})</TabsTrigger>
          </TabsList>

          {['active', 'expired', 'cancelled', 'all'].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} Subscriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Auto-Renew</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(5).fill(0).map((_, i) => (
                          <TableRow key={i}>
                            {Array(7).fill(0).map((_, j) => (
                              <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        (tab === 'all' ? subscriptions : 
                          tab === 'active' ? activeSubscriptions :
                          tab === 'expired' ? expiredSubscriptions : 
                          cancelledSubscriptions
                        )?.map((sub) => (
                          <TableRow key={sub.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {sub.user_name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{sub.finance_plans?.name || 'Unknown Plan'}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatCurrency(sub.finance_plans?.price || 0)}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(sub.status)}</TableCell>
                            <TableCell>{format(new Date(sub.starts_at), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>
                              {sub.expires_at ? format(new Date(sub.expires_at), 'MMM dd, yyyy') : '-'}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleAutoRenew(sub)}
                                disabled={sub.status !== 'active'}
                              >
                                <RefreshCw className={`h-4 w-4 ${sub.auto_renew ? 'text-green-500' : 'text-muted-foreground'}`} />
                                {sub.auto_renew ? 'On' : 'Off'}
                              </Button>
                            </TableCell>
                            <TableCell>
                              {sub.status === 'active' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCancel(sub)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  Cancel
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                      {!isLoading && (!subscriptions || subscriptions.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No subscriptions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Subscription</DialogTitle>
              <DialogDescription>Create a new subscription for a user</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>User Name</Label>
                <Input
                  placeholder="Enter user name"
                  value={newSub.user_name}
                  onChange={(e) => setNewSub({...newSub, user_name: e.target.value})}
                />
              </div>
              <div>
                <Label>Plan</Label>
                <Select value={newSub.plan_id} onValueChange={(v) => setNewSub({...newSub, plan_id: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans?.filter(p => p.is_active).map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - {formatCurrency(plan.price)}/{plan.billing_cycle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto_renew"
                  checked={newSub.auto_renew}
                  onChange={(e) => setNewSub({...newSub, auto_renew: e.target.checked})}
                  className="rounded border-input"
                />
                <Label htmlFor="auto_renew">Auto-renew subscription</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createSubscription.isPending}>
                Create Subscription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
