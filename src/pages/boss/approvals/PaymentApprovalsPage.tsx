import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserRoles } from '@/hooks/useUserRoles';
import { usePendingApprovals, useUpdateApproval, usePendingPayouts } from '@/hooks/useBossData';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  RefreshCw,
  FileText,
  Clock,
  Pause,
  Eye
} from 'lucide-react';

export default function PaymentApprovalsPage() {
  const { isSuperAdmin } = useUserRoles();
  const navigate = useNavigate();
  
  const { data: pendingApprovals = [], isLoading: approvalsLoading } = usePendingApprovals();
  const { data: payoutsData, isLoading: payoutsLoading } = usePendingPayouts();
  const pendingPayouts = payoutsData?.payouts || [];
  const updateApproval = useUpdateApproval();

  if (!isSuperAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Only Super Admin can access this page.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const isLoading = approvalsLoading || payoutsLoading;

  // Filter payment-related approvals
  const paymentApprovals = pendingApprovals.filter(a => a.type === 'payment');

  // Combine with pending payouts
  const allPaymentItems = [
    ...paymentApprovals.map(a => ({
      id: a.id,
      type: 'approval' as const,
      category: 'Payment Request',
      title: a.title,
      description: a.description,
      amount: a.amount || 0,
      requester: a.requester,
      created_at: a.created_at,
      priority: a.priority,
    })),
    ...pendingPayouts.map(p => ({
      id: p.id,
      type: 'payout' as const,
      category: 'Commission Payout',
      title: `Commission Payout - ${p.payout_method || 'Bank Transfer'}`,
      description: p.notes || 'Commission payout request',
      amount: p.amount,
      requester: p.user_id,
      created_at: p.created_at || new Date().toISOString(),
      priority: p.amount > 50000 ? 'high' : 'medium',
    })),
  ];

  // Calculate totals
  const totalPending = allPaymentItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const highValueCount = allPaymentItems.filter(item => item.amount > 50000).length;

  const handleApprove = (id: string, type: string) => {
    if (type === 'approval') {
      updateApproval.mutate({ id, status: 'approved' });
    }
    // For payouts, you'd handle differently
  };

  const handleHold = (id: string, type: string) => {
    // Implement hold functionality
    console.log('Hold payment:', id, type);
  };

  const handleReject = (id: string, type: string) => {
    if (type === 'approval') {
      updateApproval.mutate({ id, status: 'rejected', rejection_reason: 'Payment rejected by admin' });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Commission Payout': return <RefreshCw className="h-5 w-5" />;
      case 'Refund': return <RefreshCw className="h-5 w-5" />;
      case 'Invoice': return <FileText className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-green-500" />
              Payment Approvals
            </h1>
            <p className="text-muted-foreground mt-1">Review payout requests, refunds, and high-value invoices</p>
          </div>
          <Badge className="bg-green-500/20 text-green-600 text-lg px-4 py-2">
            <DollarSign className="h-4 w-4 mr-2" />
            ₹{totalPending.toLocaleString()} Pending
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{allPaymentItems.length}</p>
                  <p className="text-xs text-muted-foreground">Total Pending</p>
                </div>
                <CreditCard className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{payoutsData?.count || 0}</p>
                  <p className="text-xs text-muted-foreground">Payouts</p>
                </div>
                <RefreshCw className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{paymentApprovals.length}</p>
                  <p className="text-xs text-muted-foreground">Other Payments</p>
                </div>
                <FileText className="h-6 w-6 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{highValueCount}</p>
                  <p className="text-xs text-muted-foreground">High Value (₹50K+)</p>
                </div>
                <DollarSign className="h-6 w-6 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment List */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Queue</CardTitle>
            <CardDescription>All pending payment approvals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-64" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-24" />
                  </div>
                ))}
              </div>
            ) : allPaymentItems.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <p className="text-lg font-medium text-foreground">No Pending Payments</p>
                <p className="text-muted-foreground">All payment requests have been processed.</p>
              </div>
            ) : (
              allPaymentItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors ${
                    item.amount > 100000 ? 'border-destructive/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      item.amount > 100000 ? 'bg-destructive/20 text-destructive' : 'bg-green-500/20 text-green-600'
                    }`}>
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{item.title}</p>
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        {item.amount > 100000 && (
                          <Badge className="bg-destructive/20 text-destructive">High Value</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>By: {item.requester}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-lg font-bold ${item.amount > 100000 ? 'text-destructive' : 'text-green-600'}`}>
                        ₹{item.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/dashboard/boss/approvals/detail/${item.id}?source=${item.type}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleHold(item.id, item.type)}
                      >
                        <Pause className="h-4 w-4 mr-1" /> Hold
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(item.id, item.type)}
                        disabled={updateApproval.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
