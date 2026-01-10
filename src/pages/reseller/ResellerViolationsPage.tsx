import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useResellerViolations, useResellers, useResellerRealtime } from "@/hooks/useResellerManagerData";
import { AlertTriangle, Plus, ArrowLeft, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ResellerViolationsPage() {
  const navigate = useNavigate();
  const { violations, loading, fetchViolations, createViolation, issueWarning, closeViolation } = useResellerViolations();
  const { resellers } = useResellers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<any>(null);
  const [closeNotes, setCloseNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    reseller_id: "",
    violation_type: "",
    severity: "medium",
    title: "",
    description: "",
  });

  useResellerRealtime(() => {
    fetchViolations();
  });

  const handleCreate = async () => {
    if (!formData.reseller_id || !formData.title) return;

    setProcessing(true);
    await createViolation({
      reseller_id: formData.reseller_id,
      violation_type: formData.violation_type,
      severity: formData.severity as any,
      title: formData.title,
      description: formData.description,
    });
    setProcessing(false);
    setDialogOpen(false);
    setFormData({
      reseller_id: "",
      violation_type: "",
      severity: "medium",
      title: "",
      description: "",
    });
  };

  const handleIssueWarning = async (id: string) => {
    if (confirm("Are you sure you want to issue a warning for this violation?")) {
      await issueWarning(id);
    }
  };

  const handleCloseViolation = async () => {
    if (!selectedViolation || !closeNotes.trim()) return;

    setProcessing(true);
    await closeViolation(selectedViolation.id, closeNotes);
    setProcessing(false);
    setCloseDialogOpen(false);
    setCloseNotes("");
    setSelectedViolation(null);
  };

  const openCloseDialog = (violation: any) => {
    setSelectedViolation(violation);
    setCloseDialogOpen(true);
  };

  const openViolations = violations.filter(v => v.status === 'open');
  const warningIssued = violations.filter(v => v.status === 'warning_issued');
  const closedViolations = violations.filter(v => v.status === 'closed');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/reseller')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Violations & Compliance</h1>
              <p className="text-muted-foreground">Track and manage reseller violations</p>
            </div>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Report Violation
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-destructive/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Violations</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{openViolations.length}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warnings Issued</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{warningIssued.length}</div>
              <p className="text-xs text-muted-foreground">Under monitoring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{closedViolations.length}</div>
              <p className="text-xs text-muted-foreground">Resolved cases</p>
            </CardContent>
          </Card>
        </div>

        {/* Violations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              All Violations ({violations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : violations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No violations reported
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reseller</TableHead>
                    <TableHead>Violation</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {violations.map((violation) => {
                    const reseller = resellers.find(r => r.id === violation.reseller_id);
                    return (
                      <TableRow key={violation.id}>
                        <TableCell className="font-medium">
                          {reseller?.business_name || reseller?.legal_name || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{violation.title}</p>
                            {violation.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {violation.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{violation.violation_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              violation.severity === 'critical' ? 'destructive' :
                              violation.severity === 'high' ? 'destructive' :
                              violation.severity === 'medium' ? 'secondary' : 'outline'
                            }
                          >
                            {violation.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              violation.status === 'open' ? 'destructive' :
                              violation.status === 'warning_issued' ? 'secondary' :
                              violation.status === 'suspended' ? 'destructive' : 'default'
                            }
                          >
                            {violation.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(violation.reported_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {violation.status === 'open' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleIssueWarning(violation.id)}
                              >
                                Issue Warning
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openCloseDialog(violation)}
                              >
                                Close
                              </Button>
                            </div>
                          )}
                          {violation.status === 'warning_issued' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openCloseDialog(violation)}
                            >
                              Close Case
                            </Button>
                          )}
                          {violation.status === 'closed' && (
                            <span className="text-sm text-muted-foreground">Resolved</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Report Violation Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Violation</DialogTitle>
              <DialogDescription>
                Document a violation for a reseller
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Reseller *</Label>
                <Select
                  value={formData.reseller_id}
                  onValueChange={(value) => setFormData({ ...formData, reseller_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reseller" />
                  </SelectTrigger>
                  <SelectContent>
                    {resellers.map((reseller) => (
                      <SelectItem key={reseller.id} value={reseller.id}>
                        {reseller.business_name || reseller.legal_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief violation title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={formData.violation_type}
                    onValueChange={(value) => setFormData({ ...formData, violation_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="policy_breach">Policy Breach</SelectItem>
                      <SelectItem value="fraud">Fraud</SelectItem>
                      <SelectItem value="spam">Spam/Abuse</SelectItem>
                      <SelectItem value="payment">Payment Issue</SelectItem>
                      <SelectItem value="quality">Quality Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) => setFormData({ ...formData, severity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the violation..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={processing || !formData.reseller_id || !formData.title}>
                  {processing ? "Reporting..." : "Report Violation"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Close Violation Dialog */}
        <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Close Violation</DialogTitle>
              <DialogDescription>
                Provide resolution notes to close this violation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Resolution Notes *</Label>
                <Textarea
                  value={closeNotes}
                  onChange={(e) => setCloseNotes(e.target.value)}
                  placeholder="Explain how this violation was resolved..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setCloseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCloseViolation} disabled={processing || !closeNotes.trim()}>
                  {processing ? "Closing..." : "Close Violation"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
