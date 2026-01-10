import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useResellers, useResellerPlans } from "@/hooks/useResellerManagerData";
import { useAuth } from "@/hooks/useAuth";
import { UserPlus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddResellerPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createReseller } = useResellers();
  const { plans } = useResellerPlans();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    legal_name: "",
    business_name: "",
    contact_email: "",
    contact_phone: "",
    plan_id: "",
    referral_code: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const result = await createReseller({
      ...formData,
      user_id: user.id,
      plan_id: formData.plan_id || null,
      referral_code: formData.referral_code || `RSL-${Date.now().toString(36).toUpperCase()}`,
    });

    setLoading(false);
    if (result) {
      navigate('/dashboard/reseller/list');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add Reseller</h1>
            <p className="text-muted-foreground">Create a new reseller account</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Reseller Information
            </CardTitle>
            <CardDescription>
              Fill in the details for the new reseller account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="legal_name">Legal Name *</Label>
                  <Input
                    id="legal_name"
                    placeholder="Full legal name"
                    value={formData.legal_name}
                    onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    placeholder="Trading name (optional)"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Phone</Label>
                  <Input
                    id="contact_phone"
                    placeholder="+91 9876543210"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan_id">Plan</Label>
                  <Select
                    value={formData.plan_id}
                    onValueChange={(value) => setFormData({ ...formData, plan_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - ₹{plan.monthly_fee}/mo ({plan.commission_rate}% commission)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referral_code">Referral Code</Label>
                  <Input
                    id="referral_code"
                    placeholder="Auto-generated if empty"
                    value={formData.referral_code}
                    onChange={(e) => setFormData({ ...formData, referral_code: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Reseller"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
