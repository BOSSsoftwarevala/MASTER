import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDemos } from '@/hooks/useProductDemoData';
import { format } from 'date-fns';

export default function ExpiredDemosPage() {
  const { data: demos, isLoading } = useDemos('expired');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">Expired Demos</h1>
          <p className="text-muted-foreground">Demo accounts that have expired</p>
        </div>

        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle>Expired Demos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading demos...</p>
            ) : demos?.length === 0 ? (
              <p className="text-muted-foreground">No expired demos found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Expired</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Extensions Used</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demos?.map((demo) => (
                    <TableRow key={demo.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{demo.user_name || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{demo.user_email || '-'}</p>
                        </div>
                      </TableCell>
                      <TableCell>{(demo.products as { name: string } | null)?.name || '-'}</TableCell>
                      <TableCell>{format(new Date(demo.starts_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{format(new Date(demo.expires_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Expired</Badge>
                      </TableCell>
                      <TableCell>{demo.extended_count}/{demo.max_extensions}</TableCell>
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
