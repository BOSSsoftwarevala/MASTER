import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePlanMappings, useUpdatePlanMapping } from '@/hooks/useProductDemoData';

export default function VisibilityRulesPage() {
  const { data: mappings, isLoading } = usePlanMappings();
  const updateMapping = useUpdatePlanMapping();

  const handleToggle = async (id: string, field: 'is_visible' | 'is_active', currentValue: boolean) => {
    await updateMapping.mutateAsync({ id, [field]: !currentValue });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">Visibility Rules</h1>
          <p className="text-muted-foreground">Control which plans are visible to customers</p>
        </div>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Plan Visibility Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading rules...</p>
            ) : mappings?.length === 0 ? (
              <p className="text-muted-foreground">No plan mappings found. Create mappings first.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Regions</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead>Active</TableHead>
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
                        {mapping.visibility_regions?.length ? (
                          <div className="flex gap-1 flex-wrap">
                            {mapping.visibility_regions.map((region) => (
                              <Badge key={region} variant="outline">{region}</Badge>
                            ))}
                          </div>
                        ) : (
                          <Badge variant="secondary">All Regions</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={mapping.is_visible || false}
                          onCheckedChange={() => handleToggle(mapping.id, 'is_visible', mapping.is_visible || false)}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={mapping.is_active || false}
                          onCheckedChange={() => handleToggle(mapping.id, 'is_active', mapping.is_active || false)}
                        />
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
