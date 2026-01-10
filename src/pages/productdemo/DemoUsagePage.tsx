import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDemoUsage } from '@/hooks/useProductDemoData';
import { format } from 'date-fns';

export default function DemoUsagePage() {
  const { data: usage, isLoading } = useDemoUsage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">Demo Usage</h1>
          <p className="text-muted-foreground">Track how demos are being used</p>
        </div>

        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading usage data...</p>
            ) : usage?.length === 0 ? (
              <p className="text-muted-foreground">No usage data found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Page Views</TableHead>
                    <TableHead>API Calls</TableHead>
                    <TableHead>Storage (MB)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usage?.map((record) => {
                    const demos = record.demos as { user_email: string; products: { name: string } | null } | null;
                    return (
                      <TableRow key={record.id}>
                        <TableCell>{demos?.user_email || '-'}</TableCell>
                        <TableCell>{demos?.products?.name || '-'}</TableCell>
                        <TableCell>{format(new Date(record.session_date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{record.session_count || 0}</TableCell>
                        <TableCell>{record.page_views || 0}</TableCell>
                        <TableCell>{record.api_calls || 0}</TableCell>
                        <TableCell>{record.storage_used_mb || 0}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
