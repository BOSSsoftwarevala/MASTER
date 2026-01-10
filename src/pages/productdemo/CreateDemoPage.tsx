import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useCreateDemo, useProducts } from '@/hooks/useProductDemoData';
import { addDays, format } from 'date-fns';

export default function CreateDemoPage() {
  const navigate = useNavigate();
  const { data: products } = useProducts('active');
  const createDemo = useCreateDemo();

  const defaultExpiry = format(addDays(new Date(), 14), 'yyyy-MM-dd');

  const [formData, setFormData] = useState({
    product_id: '',
    user_name: '',
    user_email: '',
    expires_at: defaultExpiry,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDemo.mutateAsync({
      ...formData,
      expires_at: new Date(formData.expires_at).toISOString(),
    });
    navigate('/dashboard/demo/demos/active');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">Create Demo</h1>
            <p className="text-muted-foreground">Set up a new demo account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle>Demo Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_id">Product *</Label>
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
                  <Label htmlFor="expires_at">Expires At *</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user_name">User Name</Label>
                  <Input
                    id="user_name"
                    value={formData.user_name}
                    onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                    placeholder="Demo user name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user_email">User Email</Label>
                  <Input
                    id="user_email"
                    type="email"
                    value={formData.user_email}
                    onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                    placeholder="demo@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createDemo.isPending || !formData.product_id} className="bg-purple-600 hover:bg-purple-700">
                  {createDemo.isPending ? 'Creating...' : 'Create Demo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
