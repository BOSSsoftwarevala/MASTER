import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCategories } from '@/hooks/useProductDemoData';
import { format } from 'date-fns';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">Product Categories</h1>
          <p className="text-muted-foreground">View product categories</p>
        </div>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading categories...</p>
            ) : categories?.length === 0 ? (
              <p className="text-muted-foreground">No categories found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories?.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>{category.description || '-'}</TableCell>
                      <TableCell>
                        <Badge className={category.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{category.created_at ? format(new Date(category.created_at), 'MMM dd, yyyy') : '-'}</TableCell>
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
