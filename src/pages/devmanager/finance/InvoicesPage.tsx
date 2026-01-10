import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInvoices, useUpdateInvoice, Invoice } from '@/hooks/useFinanceData';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  FileText,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';

export default function InvoicesPage() {
  const navigate = useNavigate();
  const { isAdmin } = useUserRoles();
  const { data: invoices, isLoading } = useInvoices();
  const updateInvoice = useUpdateInvoice();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Overdue</Badge>;
      case 'cancelled':
        return <Badge variant="outline"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleMarkPaid = async (invoice: Invoice) => {
    await updateInvoice.mutateAsync({
      id: invoice.id,
      status: 'paid',
      paid_at: new Date().toISOString(),
    });
  };

  const handleCancel = async (invoice: Invoice) => {
    await updateInvoice.mutateAsync({
      id: invoice.id,
      status: 'cancelled',
    });
  };

  if (!isAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Card className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access Invoices.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const invoicesByStatus = {
    all: invoices || [],
    draft: invoices?.filter(i => i.status === 'draft') || [],
    pending: invoices?.filter(i => i.status === 'pending') || [],
    paid: invoices?.filter(i => i.status === 'paid') || [],
    overdue: invoices?.filter(i => i.status === 'overdue') || [],
    cancelled: invoices?.filter(i => i.status === 'cancelled') || [],
  };

  const totalAmount = invoices?.reduce((sum, i) => sum + (i.total_amount || 0), 0) || 0;
  const paidAmount = invoicesByStatus.paid.reduce((sum, i) => sum + (i.total_amount || 0), 0);
  const pendingAmount = invoicesByStatus.pending.reduce((sum, i) => sum + (i.total_amount || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Invoices</h1>
            <p className="text-muted-foreground mt-1">Manage billing and invoice generation</p>
          </div>
          <Button onClick={() => navigate('/finance/invoices/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoiced</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
              <p className="text-xs text-muted-foreground">{invoices?.length || 0} invoices</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
              <p className="text-xs text-muted-foreground">{invoicesByStatus.paid.length} invoices</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</div>
              <p className="text-xs text-muted-foreground">{invoicesByStatus.pending.length} invoices</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{invoicesByStatus.overdue.length}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({invoicesByStatus.all.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({invoicesByStatus.pending.length})</TabsTrigger>
            <TabsTrigger value="paid">Paid ({invoicesByStatus.paid.length})</TabsTrigger>
            <TabsTrigger value="overdue">Overdue ({invoicesByStatus.overdue.length})</TabsTrigger>
          </TabsList>

          {['all', 'pending', 'paid', 'overdue'].map((status) => (
            <TabsContent key={status} value={status}>
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(5).fill(0).map((_, i) => (
                          <TableRow key={i}>
                            {Array(7).fill(0).map((_, j) => (
                              <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : invoicesByStatus[status as keyof typeof invoicesByStatus].length > 0 ? (
                        invoicesByStatus[status as keyof typeof invoicesByStatus].map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{invoice.customer_name}</p>
                                <p className="text-sm text-muted-foreground">{invoice.customer_email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{formatCurrency(invoice.total_amount)}</TableCell>
                            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                            <TableCell>
                              {invoice.due_date ? format(new Date(invoice.due_date), 'MMM dd, yyyy') : '-'}
                            </TableCell>
                            <TableCell>{format(new Date(invoice.created_at), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => navigate(`/finance/invoices/${invoice.id}`)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                {invoice.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="default"
                                      onClick={() => handleMarkPaid(invoice)}
                                      disabled={updateInvoice.isPending}
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive"
                                      onClick={() => handleCancel(invoice)}
                                      disabled={updateInvoice.isPending}
                                    >
                                      <XCircle className="h-3 w-3" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No invoices found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
