import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useResellers } from "@/hooks/useResellerManagerData";
import { Trash2, ArrowLeft, AlertTriangle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DeleteResellerPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { resellers, loading, deleteReseller } = useResellers();
  const [reason, setReason] = useState("");
  const [deleting, setDeleting] = useState(false);

  const reseller = resellers.find((r) => r.id === id);

  const handleDelete = async () => {
    if (!id || !reason.trim()) return;

    setDeleting(true);
    const result = await deleteReseller(id, reason);
    setDeleting(false);

    if (result) {
      navigate('/dashboard/reseller/list');
    }
  };

  if (loading) {
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
            <h1 className="text-3xl font-bold tracking-tight text-destructive">Delete Reseller</h1>
            <p className="text-muted-foreground">Remove reseller from the system</p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            This action will soft-delete the reseller. All associated data will be marked as deleted
            but can be recovered by a Super Admin if needed.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Confirm Deletion
            </CardTitle>
            <CardDescription>
              Review the reseller details and provide a reason for deletion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Reseller Info */}
            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="grid gap-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Legal Name</span>
                  <span className="font-medium">{reseller.legal_name}</span>
                </div>
                {reseller.business_name && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Business Name</span>
                    <span className="font-medium">{reseller.business_name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{reseller.contact_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={reseller.status === 'active' ? 'default' : 'secondary'}>
                    {reseller.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Referral Code</span>
                  <span className="font-mono">{reseller.referral_code || '-'}</span>
                </div>
              </div>
            </div>

            {/* Impact Preview */}
            <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <h4 className="font-medium mb-2">Impact Preview</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Reseller will no longer appear in active listings</li>
                <li>• All lead assignments will be removed</li>
                <li>• Wallet balance will be frozen</li>
                <li>• Referral code will be deactivated</li>
                <li>• Pending commissions will be reviewed</li>
              </ul>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Deletion *</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a detailed reason for deleting this reseller..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting || !reason.trim()}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
