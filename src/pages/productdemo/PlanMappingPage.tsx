import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { usePlanMappings, useProducts, useFinancePlans, useCreatePlanMapping, useUpdatePlanMapping, useDeletePlanMapping } from '@/hooks/useProductDemoData';

export default function PlanMappingPage() {
  const { data: mappings, isLoading } = usePlanMappings();
  const { data: products } = useProducts();
  const { data: plans } = useFinancePlans();
  const createMapping = useCreatePlanMapping();
  const updateMapping = useUpdatePlanMapping();
  const deleteMapping = useDeletePlanMapping();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    plan_id: '',
    is_visible: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMapping.mutateAsync(formData);
    setFormData({ product_id: '', plan_id: '', is_visible: true });
    setOpen(false);
  };

  const handleToggleVisibility = async (id: string, currentValue: boolean) => {
    await updateMapping.mutateAsync({ id, is_visible: !currentValue });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this mapping?')) {
      await deleteMapping.mutateAsync(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">Plan Mapping</h1>
            <p className="text-muted-foreground">Map products to pricing plans</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Mapping
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Plan Mapping</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Product *</Label>
                  <Select
                    value={formData.product_id}
                    onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Plan *</Label>
                  <Select
                    value={formData.plan_id}
                    onValueChange={(value) => setFormData({ ...formData, plan_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans?.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name} - ${p.price}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_visible"
                    checked={formData.is_visible}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                  />
                  <Label htmlFor="is_visible">Visible to customers</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={createMapping.isPending || !formData.product_id || !formData.plan_id}>
                    {createMapping.isPending ? 'Adding...' : 'Add Mapping'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Product → Plan Mappings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading mappings...</p>
            ) : mappings?.length === 0 ? (
              <p className="text-muted-foreground">No plan mappings found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings?.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell className="font-medium">
                        {(mapping.products as { name: string } | null)?.name || '-'}
                      </TableCell>
                      <TableCell>
                        {(mapping.finance_plans as { name: string } | null)?.name || '-'}
                      </TableCell>
                      <TableCell>
                        ${(mapping.finance_plans as { price: number } | null)?.price || 0}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={mapping.is_visible || false}
                          onCheckedChange={() => handleToggleVisibility(mapping.id, mapping.is_visible || false)}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge className={mapping.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                          {mapping.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(mapping.id)}>
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
