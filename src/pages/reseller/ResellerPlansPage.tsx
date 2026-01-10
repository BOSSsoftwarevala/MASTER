import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useResellerPlans } from "@/hooks/useResellerManagerData";
import { CreditCard, ArrowLeft, Check, Star, MapPin, Headphones, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ResellerPlansPage() {
  const navigate = useNavigate();
  const { plans, loading } = useResellerPlans();

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'silver': return 'bg-slate-200 text-slate-800 border-slate-400';
      case 'gold': return 'bg-amber-100 text-amber-800 border-amber-400';
      case 'platinum': return 'bg-violet-100 text-violet-800 border-violet-400';
      default: return 'bg-muted';
    }
  };

  const getTierBorderColor = (tier: string) => {
    switch (tier) {
      case 'silver': return 'border-slate-300';
      case 'gold': return 'border-amber-400 shadow-amber-100';
      case 'platinum': return 'border-violet-400';
      default: return '';
    }
  };

  const getGeoLabel = (geoLevel?: string | null) => {
    switch (geoLevel) {
      case 'city': return 'City-level';
      case 'district': return 'District-level';
      case 'state': return 'State-level';
      default: return 'Standard';
    }
  };

  const getSupportLabel = (supportLevel?: string | null) => {
    switch (supportLevel) {
      case 'standard': return 'Standard Support';
      case 'priority': return 'Priority Support';
      case 'dedicated': return '24/7 Dedicated Support';
      default: return 'Standard Support';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/reseller')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reseller Plans</h1>
            <p className="text-muted-foreground">View available reseller partnership plans with pricing</p>
          </div>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[500px] w-full" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No plans available
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => {
              const benefits = Array.isArray(plan.benefits) ? plan.benefits : [];
              const isPopular = plan.tier === 'gold';
              const setupFee = (plan as any).setup_fee || 0;
              const geoLevel = (plan as any).geo_level;
              const supportLevel = (plan as any).support_level;
              
              return (
                <Card key={plan.id} className={`relative ${isPopular ? 'border-2 border-primary shadow-lg scale-105' : getTierBorderColor(plan.tier)}`}>
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="mr-1 h-3 w-3 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <Badge className={`mx-auto mb-2 ${getTierColor(plan.tier)}`}>
                      {plan.tier.toUpperCase()}
                    </Badge>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Setup/Joining Fee */}
                    <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">One-time Joining Fee</p>
                      <p className="text-2xl font-bold text-primary">${setupFee.toLocaleString()}</p>
                    </div>

                    {/* Monthly Pricing */}
                    <div className="text-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold">${plan.monthly_fee.toLocaleString()}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      {plan.commission_rate > 0 && (
                        <Badge variant="secondary" className="mt-2">
                          {plan.commission_rate}% commission on sales
                        </Badge>
                      )}
                    </div>

                    <Separator />

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Lead Cap:</span>
                        <span className="font-semibold ml-auto">
                          {plan.lead_cap >= 999999 ? 'Unlimited' : `${plan.lead_cap}/month`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Geo Scope:</span>
                        <span className="font-semibold ml-auto">{getGeoLabel(geoLevel)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Headphones className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Support:</span>
                        <span className="font-semibold ml-auto">{getSupportLabel(supportLevel)}</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Benefits */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Included Benefits</p>
                      {benefits.map((benefit: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pricing & Billing Information
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Joining Fee</h4>
                <ul className="space-y-1 text-muted-foreground text-sm list-disc list-inside">
                  <li>One-time payment upon onboarding</li>
                  <li>Non-refundable after activation</li>
                  <li>Covers setup and training</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Monthly Fee</h4>
                <ul className="space-y-1 text-muted-foreground text-sm list-disc list-inside">
                  <li>Billed at the start of each month</li>
                  <li>Auto-pause on zero wallet balance</li>
                  <li>Lead caps reset monthly</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Commission</h4>
                <ul className="space-y-1 text-muted-foreground text-sm list-disc list-inside">
                  <li>Applied to all successful conversions</li>
                  <li>Credited to wallet after validation</li>
                  <li>Settlement available on request</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Plan Changes</h4>
                <ul className="space-y-1 text-muted-foreground text-sm list-disc list-inside">
                  <li>Upgrades effective immediately</li>
                  <li>Downgrades at next billing cycle</li>
                  <li>Contact admin for custom plans</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
