import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, Shield, Check, Star } from 'lucide-react';
import { useFranchisePlans } from '@/hooks/useFranchiseData';
import { useUserRoles } from '@/hooks/useUserRoles';

export default function FranchisePlansPage() {
  const { data: plans, isLoading } = useFranchisePlans();
  const { isAdmin } = useUserRoles();

  const getPlanColor = (tier: string) => {
    const colors: Record<string, { bg: string; border: string; accent: string }> = {
      silver: { bg: 'bg-slate-500/10', border: 'border-slate-500/30', accent: 'text-slate-400' },
      gold: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', accent: 'text-amber-400' },
      platinum: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', accent: 'text-violet-400' },
    };
    return colors[tier] || colors.silver;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <Shield className="h-12 w-12 mx-auto text-destructive mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">You don't have permission to view this page.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Franchise Plans & Pricing</h1>
            <p className="text-muted-foreground">View available franchise partnership tiers</p>
          </div>
          <Badge variant="outline" className="gap-1">
            <CreditCard className="h-3 w-3" />
            {plans?.length || 0} Plans
          </Badge>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        ) : plans && plans.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => {
              const colors = getPlanColor(plan.tier);
              const benefits = Array.isArray(plan.benefits) ? plan.benefits : [];
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative overflow-hidden ${colors.bg} ${colors.border} border-2`}
                >
                  {plan.tier === 'platinum' && (
                    <div className="absolute top-4 right-4">
                      <Star className={`h-6 w-6 ${colors.accent} fill-current`} />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge className={`${colors.accent} bg-transparent border-current`}>
                        {plan.tier.toUpperCase()}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-muted-foreground">Setup Fee</span>
                        <span className="text-2xl font-bold">{formatCurrency(Number(plan.setup_fee))}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-muted-foreground">Monthly Fee</span>
                        <span className="text-lg font-semibold">{formatCurrency(Number(plan.monthly_fee))}/mo</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-muted-foreground">Commission Rate</span>
                        <span className={`text-lg font-semibold ${colors.accent}`}>{plan.commission_rate}%</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="text-sm font-medium mb-3">Benefits</p>
                      <ul className="space-y-2">
                        {benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className={`h-4 w-4 mt-0.5 ${colors.accent}`} />
                            <span>{String(benefit)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Plans Available</h3>
              <p className="text-muted-foreground">No franchise plans have been configured yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
