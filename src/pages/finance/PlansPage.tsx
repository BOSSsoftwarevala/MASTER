import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFinancePlans, useCreateFinancePlan, useUpdateFinancePlan, FinancePlan } from '@/hooks/useFinanceData';
import { useUserRoles } from '@/hooks/useUserRoles';
import {
  CreditCard,
  Plus,
  Edit,
  Star,
  Users,
  Store,
  Code,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

export default function PlansPage() {
  const { isAdmin } = useUserRoles();
  const { data: plans, isLoading } = useFinancePlans();
  const createPlan = useCreateFinancePlan();
  const updatePlan = useUpdateFinancePlan();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<FinancePlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    plan_type: '' as 'prime_user' | 'franchise' | 'reseller' | 'api',
    description: '',
    price: 0,
    billing_cycle: 'monthly',
    is_active: true,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'prime_user': return <Star className="h-5 w-5" />;
      case 'franchise': return <Store className="h-5 w-5" />;
      case 'reseller': return <Users className="h-5 w-5" />;
      case 'api': return <Code className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const openCreateDialog = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      plan_type: '' as any,
      description: '',
      price: 0,
      billing_cycle: 'monthly',
      is_active: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (plan: FinancePlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      plan_type: plan.plan_type,
      description: plan.description || '',
      price: plan.price,
      billing_cycle: plan.billing_cycle,
      is_active: plan.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (editingPlan) {
      await updatePlan.mutateAsync({
        id: editingPlan.id,
        ...formData,
      });
    } else {
      await createPlan.mutateAsync({
        ...formData,
        features: [],
        limits: {},
      });
    }
    setDialogOpen(false);
  };

  const handleToggleActive = async (plan: FinancePlan) => {
    await updatePlan.mutateAsync({
      id: plan.id,
      is_active: !plan.is_active,
    });
  };

  if (!isAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Card className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access Plans.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const plansByType = {
    prime_user: plans?.filter(p => p.plan_type === 'prime_user') || [],
    franchise: plans?.filter(p => p.plan_type === 'franchise') || [],
    reseller: plans?.filter(p => p.plan_type === 'reseller') || [],
    api: plans?.filter(p => p.plan_type === 'api') || [],
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Subscriptions & Plans</h1>
            <p className="text-muted-foreground mt-1">Manage pricing plans for all user types</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </div>

        {/* Plan Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Plans</TabsTrigger>
            <TabsTrigger value="prime_user">Prime Users</TabsTrigger>
            <TabsTrigger value="franchise">Franchise</TabsTrigger>
            <TabsTrigger value="reseller">Reseller</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <PlanGrid
              plans={plans || []}
              isLoading={isLoading}
              onEdit={openEditDialog}
              onToggle={handleToggleActive}
              formatCurrency={formatCurrency}
              getPlanIcon={getPlanIcon}
            />
          </TabsContent>

          {['prime_user', 'franchise', 'reseller', 'api'].map((type) => (
            <TabsContent key={type} value={type}>
              <PlanGrid
                plans={plansByType[type as keyof typeof plansByType]}
                isLoading={isLoading}
                onEdit={openEditDialog}
                onToggle={handleToggleActive}
                formatCurrency={formatCurrency}
                getPlanIcon={getPlanIcon}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPlan ? 'Edit Plan' : 'Create Plan'}</DialogTitle>
              <DialogDescription>
                {editingPlan ? 'Update plan details' : 'Create a new subscription plan'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Plan Name *</Label>
                <Input
                  placeholder="e.g., Premium Monthly"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Plan Type *</Label>
                <Select 
                  value={formData.plan_type} 
                  onValueChange={(v: any) => setFormData({...formData, plan_type: v})}
                  disabled={!!editingPlan}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prime_user">Prime User</SelectItem>
                    <SelectItem value="franchise">Franchise</SelectItem>
                    <SelectItem value="reseller">Reseller</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <Label>Price (INR) *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label>Billing Cycle</Label>
                  <Select value={formData.billing_cycle} onValueChange={(v) => setFormData({...formData, billing_cycle: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="one_time">One Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Plan description..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label>Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleSubmit} 
                disabled={createPlan.isPending || updatePlan.isPending || !formData.name || !formData.plan_type}
              >
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function PlanGrid({
  plans,
  isLoading,
  onEdit,
  onToggle,
  formatCurrency,
  getPlanIcon,
}: {
  plans: FinancePlan[];
  isLoading: boolean;
  onEdit: (plan: FinancePlan) => void;
  onToggle: (plan: FinancePlan) => void;
  formatCurrency: (amount: number) => string;
  getPlanIcon: (type: string) => React.ReactNode;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No plans found. Create your first plan.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.id} className={`relative ${!plan.is_active ? 'opacity-60' : ''}`}>
          {!plan.is_active && (
            <Badge variant="secondary" className="absolute top-4 right-4">Inactive</Badge>
          )}
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getPlanIcon(plan.plan_type)}
              {plan.name}
            </CardTitle>
            <CardDescription className="capitalize">{plan.plan_type.replace('_', ' ')} Plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
              <span className="text-muted-foreground">/{plan.billing_cycle}</span>
            </div>
            {plan.description && (
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button 
                variant={plan.is_active ? 'secondary' : 'default'} 
                size="sm" 
                onClick={() => onToggle(plan)}
              >
                {plan.is_active ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
