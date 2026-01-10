import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { useProductFeatures, useProducts, useCreateProductFeature, useDeleteProductFeature } from '@/hooks/useProductDemoData';

export default function FeaturesPage() {
  const { data: features, isLoading } = useProductFeatures();
  const { data: products } = useProducts();
  const createFeature = useCreateProductFeature();
  const deleteFeature = useDeleteProductFeature();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    feature_name: '',
    feature_description: '',
    is_highlighted: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFeature.mutateAsync(formData);
    setFormData({ product_id: '', feature_name: '', feature_description: '', is_highlighted: false });
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this feature?')) {
      await deleteFeature.mutateAsync(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">Product Features</h1>
            <p className="text-muted-foreground">Manage features for products</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Feature</DialogTitle>
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
                  <Label>Feature Name *</Label>
                  <Input
                    value={formData.feature_name}
                    onChange={(e) => setFormData({ ...formData, feature_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={formData.feature_description}
                    onChange={(e) => setFormData({ ...formData, feature_description: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={createFeature.isPending}>
                    {createFeature.isPending ? 'Adding...' : 'Add Feature'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>All Features</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading features...</p>
            ) : features?.length === 0 ? (
              <p className="text-muted-foreground">No features found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Highlighted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features?.map((feature) => (
                    <TableRow key={feature.id}>
                      <TableCell className="font-medium">{feature.feature_name}</TableCell>
                      <TableCell>{(feature.products as { name: string } | null)?.name || '-'}</TableCell>
                      <TableCell>{feature.feature_description || '-'}</TableCell>
                      <TableCell>
                        {feature.is_highlighted ? (
                          <Badge className="bg-yellow-500">Yes</Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(feature.id)}>
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
