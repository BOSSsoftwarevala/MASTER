import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useConversions, useProductDemoStats } from '@/hooks/useProductDemoData';
import { format } from 'date-fns';
import { TrendingUp, Users, DollarSign } from 'lucide-react';

export default function ConversionFunnelPage() {
  const { data: conversions, isLoading } = useConversions();
  const { data: stats } = useProductDemoStats();

  const totalValue = conversions?.reduce((acc, c) => acc + (Number(c.conversion_value) || 0), 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">Conversion Funnel</h1>
          <p className="text-muted-foreground">Track demo to paid conversions</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.conversionRate || '0%'}</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalConversions || 0}</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle>Recent Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading conversions...</p>
            ) : conversions?.length === 0 ? (
              <p className="text-muted-foreground">No conversions recorded yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Converted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversions?.map((conversion) => (
                    <TableRow key={conversion.id}>
                      <TableCell>
                        {conversion.user_email || (conversion.demos as { user_email: string } | null)?.user_email || '-'}
                      </TableCell>
                      <TableCell>{(conversion.products as { name: string } | null)?.name || '-'}</TableCell>
                      <TableCell>
                        {(conversion.finance_plans as { name: string } | null)?.name || (
                          <Badge variant="outline">N/A</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {conversion.conversion_value ? `$${conversion.conversion_value}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{conversion.attribution_source || 'Direct'}</Badge>
                      </TableCell>
                      <TableCell>{format(new Date(conversion.converted_at), 'MMM dd, yyyy')}</TableCell>
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
