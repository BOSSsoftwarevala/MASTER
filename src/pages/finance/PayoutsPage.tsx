import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFinancePayouts, useUpdateFinancePayout, FinancePayout } from '@/hooks/useFinanceData';
import { useUserRoles } from '@/hooks/useUserRoles';
import { format } from 'date-fns';
import {
  Banknote,
  CheckCircle,
  XCircle,
  Clock,
  Pause,
  AlertTriangle,
  Eye,
  Play,
} from 'lucide-react';

export default function PayoutsPage() {
  const { isAdmin } = useUserRoles();
  const { data: payouts, isLoading } = useFinancePayouts();
  const updatePayout = useUpdateFinancePayout();

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [holdDialogOpen, setHoldDialogOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<FinancePayout | null>(null);
  const [holdReason, setHoldReason] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-blue-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'processing':
        return <Badge className="bg-purple-500"><Clock className="h-3 w-3 mr-1" />Processing</Badge>;
      case 'held':
        return <Badge variant="destructive"><Pause className="h-3 w-3 mr-1" />Held</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = async (payout: FinancePayout) => {
    await updatePayout.mutateAsync({
      id: payout.id,
      status: 'approved',
      approved_at: new Date().toISOString(),
    });
  };

  const handleRelease = async (payout: FinancePayout) => {
    await updatePayout.mutateAsync({
      id: payout.id,
      status: 'completed',
      processed_at: new Date().toISOString(),
    });
  };

  const handleHold = async () => {
    if (!selectedPayout) return;
    await updatePayout.mutateAsync({
      id: selectedPayout.id,
      status: 'held',
      held_reason: holdReason,
    });
    setHoldDialogOpen(false);
    setHoldReason('');
  };

  if (!isAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Card className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access Payouts.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const payoutsByStatus = {
    all: payouts || [],
    pending: payouts?.filter(p => p.status === 'pending') || [],
    approved: payouts?.filter(p => p.status === 'approved') || [],
    processing: payouts?.filter(p => p.status === 'processing') || [],
    completed: payouts?.filter(p => p.status === 'completed') || [],
    held: payouts?.filter(p => p.status === 'held') || [],
  };

  const totalPending = payoutsByStatus.pending.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalCompleted = payoutsByStatus.completed.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Payouts & Settlements</h1>
          <p className="text-muted-foreground mt-1">Process and track all payout requests</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPending)}</div>
              <p className="text-xs text-muted-foreground">{payoutsByStatus.pending.length} requests</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payoutsByStatus.approved.length}</div>
              <p className="text-xs text-muted-foreground">Ready to process</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCompleted)}</div>
              <p className="text-xs text-muted-foreground">{payoutsByStatus.completed.length} settled</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">On Hold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{payoutsByStatus.held.length}</div>
              <p className="text-xs text-muted-foreground">Requires review</p>
            </CardContent>
          </Card>
        </div>

        {/* Payouts Table */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending ({payoutsByStatus.pending.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({payoutsByStatus.approved.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({payoutsByStatus.completed.length})</TabsTrigger>
            <TabsTrigger value="held">On Hold ({payoutsByStatus.held.length})</TabsTrigger>
            <TabsTrigger value="all">All ({payoutsByStatus.all.length})</TabsTrigger>
          </TabsList>

          {['pending', 'approved', 'completed', 'held', 'all'].map((status) => (
            <TabsContent key={status} value={status}>
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Beneficiary</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
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
                      ) : payoutsByStatus[status as keyof typeof payoutsByStatus].length > 0 ? (
                        payoutsByStatus[status as keyof typeof payoutsByStatus].map((payout) => (
                          <TableRow key={payout.id}>
                            <TableCell className="font-medium">{payout.beneficiary_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">{payout.beneficiary_type}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{formatCurrency(payout.amount)}</TableCell>
                            <TableCell>{payout.payout_method || 'Bank Transfer'}</TableCell>
                            <TableCell>{getStatusBadge(payout.status)}</TableCell>
                            <TableCell>{format(new Date(payout.created_at), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedPayout(payout);
                                    setDetailDialogOpen(true);
                                  }}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                {payout.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="default"
                                      onClick={() => handleApprove(payout)}
                                      disabled={updatePayout.isPending}
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive"
                                      onClick={() => {
                                        setSelectedPayout(payout);
                                        setHoldDialogOpen(true);
                                      }}
                                    >
                                      <Pause className="h-3 w-3" />
                                    </Button>
                                  </>
                                )}
                                {payout.status === 'approved' && (
                                  <Button 
                                    size="sm" 
                                    variant="default"
                                    onClick={() => handleRelease(payout)}
                                    disabled={updatePayout.isPending}
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    Release
                                  </Button>
                                )}
                                {payout.status === 'held' && (
                                  <Button 
                                    size="sm" 
                                    variant="default"
                                    onClick={() => handleApprove(payout)}
                                    disabled={updatePayout.isPending}
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    Resume
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No payouts found
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

        {/* Detail Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payout Details</DialogTitle>
            </DialogHeader>
            {selectedPayout && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Beneficiary</Label>
                    <p className="font-medium">{selectedPayout.beneficiary_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <p className="font-medium capitalize">{selectedPayout.beneficiary_type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Amount</Label>
                    <p className="font-medium text-lg">{formatCurrency(selectedPayout.amount)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedPayout.status)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Method</Label>
                    <p className="font-medium">{selectedPayout.payout_method || 'Bank Transfer'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Created</Label>
                    <p className="font-medium">{format(new Date(selectedPayout.created_at), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>
                {selectedPayout.notes && (
                  <div>
                    <Label className="text-muted-foreground">Notes</Label>
                    <p>{selectedPayout.notes}</p>
                  </div>
                )}
                {selectedPayout.held_reason && (
                  <div>
                    <Label className="text-muted-foreground">Hold Reason</Label>
                    <p className="text-red-600">{selectedPayout.held_reason}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Hold Dialog */}
        <Dialog open={holdDialogOpen} onOpenChange={setHoldDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hold Payout</DialogTitle>
              <DialogDescription>
                Provide a reason for holding this payout
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label>Reason</Label>
              <Textarea
                placeholder="Enter reason for holding..."
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setHoldDialogOpen(false)}>Cancel</Button>
              <Button 
                variant="destructive"
                onClick={handleHold} 
                disabled={updatePayout.isPending || !holdReason}
              >
                Hold Payout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
