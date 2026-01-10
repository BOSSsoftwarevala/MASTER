import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';
import { useDemoRequests, useUpdateDemoRequest } from '@/hooks/useProductDemoData';
import { format } from 'date-fns';

export default function DemoRequestsPage() {
  const { data: requests, isLoading } = useDemoRequests();
  const updateRequest = useUpdateDemoRequest();

  const handleApprove = async (id: string) => {
    await updateRequest.mutateAsync({ 
      id, 
      status: 'approved',
      approved_at: new Date().toISOString(),
    });
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Reason for rejection:');
    if (reason) {
      await updateRequest.mutateAsync({ 
        id, 
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejection_reason: reason,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'converted':
        return <Badge className="bg-blue-500">Converted</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">Demo Requests</h1>
          <p className="text-muted-foreground">Review and process demo requests</p>
        </div>

        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle>All Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading requests...</p>
            ) : requests?.length === 0 ? (
              <p className="text-muted-foreground">No demo requests found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requester</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Use Case</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests?.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.requester_name}</p>
                          <p className="text-sm text-muted-foreground">{request.requester_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{request.company_name || '-'}</TableCell>
                      <TableCell>{(request.products as { name: string } | null)?.name || '-'}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.use_case || '-'}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{format(new Date(request.created_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {request.status === 'pending' && (
                          <>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="text-green-600"
                              onClick={() => handleApprove(request.id)}
                              disabled={updateRequest.isPending}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="text-red-600"
                              onClick={() => handleReject(request.id)}
                              disabled={updateRequest.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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
