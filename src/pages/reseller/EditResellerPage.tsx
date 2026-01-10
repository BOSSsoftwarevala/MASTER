import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useResellers, useResellerPlans } from "@/hooks/useResellerManagerData";
import { Edit, ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditResellerPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { resellers, loading: resellersLoading, updateReseller } = useResellers();
  const { plans } = useResellerPlans();
  const [saving, setSaving] = useState(false);

  const reseller = resellers.find((r) => r.id === id);

  const [formData, setFormData] = useState({
    legal_name: "",
    business_name: "",
    contact_email: "",
    contact_phone: "",
    plan_id: "",
    status: "",
    kyc_status: "",
  });

  useEffect(() => {
    if (reseller) {
      setFormData({
        legal_name: reseller.legal_name,
        business_name: reseller.business_name || "",
        contact_email: reseller.contact_email,
        contact_phone: reseller.contact_phone || "",
        plan_id: reseller.plan_id || "",
        status: reseller.status,
        kyc_status: reseller.kyc_status || "pending",
      });
    }
  }, [reseller]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    const result = await updateReseller(id, {
      legal_name: formData.legal_name,
      business_name: formData.business_name || null,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone || null,
      plan_id: formData.plan_id || null,
      status: formData.status as any,
      kyc_status: formData.kyc_status as any,
    });

    setSaving(false);
    if (result) {
      navigate('/dashboard/reseller/list');
    }
  };

  if (resellersLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-2xl mx-auto">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!reseller) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Reseller not found</p>
          <Button className="mt-4" onClick={() => navigate('/dashboard/reseller/list')}>
            Back to List
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Reseller</h1>
            <p className="text-muted-foreground">Update reseller information</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Reseller Details
            </CardTitle>
            <CardDescription>
              Modify the reseller account details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="legal_name">Legal Name *</Label>
                  <Input
                    id="legal_name"
                    value={formData.legal_name}
                    onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Phone</Label>
                  <Input
                    id="contact_phone"
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
                          {plan.name} - ₹{plan.monthly_fee}/mo
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kyc_status">KYC Status</Label>
                  <Select
                    value={formData.kyc_status}
                    onValueChange={(value) => setFormData({ ...formData, kyc_status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
