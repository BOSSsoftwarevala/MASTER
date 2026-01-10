import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useResellerScopes, useResellers, useResellerRealtime } from "@/hooks/useResellerManagerData";
import { Target, Plus, Trash2, MapPin, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ResellerScopesPage() {
  const navigate = useNavigate();
  const { scopes, loading: scopesLoading, fetchScopes, createScope, deleteScope } = useResellerScopes();
  const { resellers } = useResellers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    reseller_id: "",
    scope_type: "geo",
    country: "India",
    state: "",
    city: "",
    priority: "1",
    lead_cap: "50",
  });

  useResellerRealtime(() => {
    fetchScopes();
  });

  const handleCreate = async () => {
    if (!formData.reseller_id) return;

    setCreating(true);
    await createScope({
      reseller_id: formData.reseller_id,
      scope_type: formData.scope_type,
      country: formData.country,
      state: formData.state || null,
      city: formData.city || null,
      priority: parseInt(formData.priority),
      lead_cap: parseInt(formData.lead_cap),
    });
    setCreating(false);
    setDialogOpen(false);
    setFormData({
      reseller_id: "",
      scope_type: "geo",
      country: "India",
      state: "",
      city: "",
      priority: "1",
      lead_cap: "50",
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this scope?")) {
      await deleteScope(id);
    }
  };

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
              <h1 className="text-3xl font-bold tracking-tight">Lead Scopes</h1>
              <p className="text-muted-foreground">Assign geographic and lead distribution scopes to resellers</p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Assign Scope
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign New Scope</DialogTitle>
                <DialogDescription>
                  Define a geographic or product scope for a reseller
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
                      {resellers.filter(r => r.status === 'active').map((reseller) => (
                        <SelectItem key={reseller.id} value={reseller.id}>
                          {reseller.business_name || reseller.legal_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Scope Type</Label>
                  <Select
                    value={formData.scope_type}
                    onValueChange={(value) => setFormData({ ...formData, scope_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="geo">Geographic</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="industry">Industry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="All states"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="All cities"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lead Cap</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.lead_cap}
                      onChange={(e) => setFormData({ ...formData, lead_cap: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={creating || !formData.reseller_id}>
                    {creating ? "Assigning..." : "Assign Scope"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Scopes Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Assigned Scopes ({scopes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scopesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : scopes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No scopes assigned yet. Click "Assign Scope" to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reseller</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Lead Cap</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scopes.map((scope) => (
                    <TableRow key={scope.id}>
                      <TableCell>
                        <span className="font-medium">
                          {(scope as any).resellers?.business_name || (scope as any).resellers?.legal_name || 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{scope.scope_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {[scope.city, scope.state, scope.country].filter(Boolean).join(', ') || 'Global'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{scope.priority}</TableCell>
                      <TableCell>{scope.lead_cap}</TableCell>
                      <TableCell>
                        <Badge variant={scope.is_active ? 'default' : 'secondary'}>
                          {scope.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(scope.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
