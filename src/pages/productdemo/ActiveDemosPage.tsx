import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, RefreshCw } from 'lucide-react';
import { useDemos, useExtendDemo } from '@/hooks/useProductDemoData';
import { format, addDays, differenceInDays } from 'date-fns';

export default function ActiveDemosPage() {
  const navigate = useNavigate();
  const { data: demos, isLoading } = useDemos('active');
  const extendDemo = useExtendDemo();

  const handleExtend = async (id: string) => {
    const newExpiry = addDays(new Date(), 7).toISOString();
    await extendDemo.mutateAsync({ id, newExpiresAt: newExpiry });
  };

  const getDaysRemaining = (expiresAt: string) => {
    const days = differenceInDays(new Date(expiresAt), new Date());
    if (days < 0) return <Badge variant="destructive">Expired</Badge>;
    if (days === 0) return <Badge className="bg-orange-500">Expires Today</Badge>;
    if (days <= 3) return <Badge className="bg-yellow-500">{days} days</Badge>;
    return <Badge className="bg-green-500">{days} days</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">Active Demos</h1>
            <p className="text-muted-foreground">Currently active demo accounts</p>
          </div>
          <Button onClick={() => navigate('/dashboard/demo/demos/new')} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Demo
          </Button>
        </div>

        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle>Active Demos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading demos...</p>
            ) : demos?.length === 0 ? (
              <p className="text-muted-foreground">No active demos found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Time Left</TableHead>
                    <TableHead>Extensions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell>{getDaysRemaining(demo.expires_at)}</TableCell>
                      <TableCell>{demo.extended_count}/{demo.max_extensions}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleExtend(demo.id)}
                          disabled={(demo.extended_count || 0) >= (demo.max_extensions || 1) || extendDemo.isPending}
                          className="border-purple-300 text-purple-700"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Extend
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => navigate(`/dashboard/demo/demos/${demo.id}`)}>
                          <Clock className="h-4 w-4" />
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
