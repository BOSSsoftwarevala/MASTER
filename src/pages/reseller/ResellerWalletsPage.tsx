import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useResellerWallets, useResellers, useResellerRealtime } from "@/hooks/useResellerManagerData";
import { Wallet, Plus, Lock, Unlock, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ResellerWalletsPage() {
  const navigate = useNavigate();
  const { wallets, loading, fetchWallets, addTransaction, lockWallet, unlockWallet } = useResellerWallets();
  const { resellers } = useResellers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const [transactionData, setTransactionData] = useState({
    wallet_id: "",
    reseller_id: "",
    transaction_type: "credit",
    amount: "",
    description: "",
  });

  const [lockReason, setLockReason] = useState("");

  useResellerRealtime(() => {
    fetchWallets();
  });

  const handleAddTransaction = async () => {
    if (!transactionData.wallet_id || !transactionData.amount) return;

    setProcessing(true);
    await addTransaction({
      wallet_id: transactionData.wallet_id,
      reseller_id: transactionData.reseller_id,
      transaction_type: transactionData.transaction_type as any,
      amount: parseFloat(transactionData.amount),
      description: transactionData.description,
    });
    setProcessing(false);
    setDialogOpen(false);
    setTransactionData({
      wallet_id: "",
      reseller_id: "",
      transaction_type: "credit",
      amount: "",
      description: "",
    });
  };

  const handleLockWallet = async () => {
    if (!selectedWallet || !lockReason) return;

    setProcessing(true);
    await lockWallet(selectedWallet.id, lockReason);
    setProcessing(false);
    setLockDialogOpen(false);
    setLockReason("");
    setSelectedWallet(null);
  };

  const handleUnlockWallet = async (walletId: string) => {
    await unlockWallet(walletId);
  };

  const openTransactionDialog = (wallet: any) => {
    setTransactionData({
      wallet_id: wallet.id,
      reseller_id: wallet.reseller_id,
      transaction_type: "credit",
      amount: "",
      description: "",
    });
    setDialogOpen(true);
  };

  const openLockDialog = (wallet: any) => {
    setSelectedWallet(wallet);
    setLockDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/reseller')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reseller Wallets</h1>
            <p className="text-muted-foreground">Manage credits, debits, and settlements</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{wallets.reduce((sum, w) => sum + Number(w.balance), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₹{wallets.reduce((sum, w) => sum + Number(w.pending_credits || 0), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Locked Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {wallets.filter(w => w.is_locked).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wallets Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              All Wallets ({wallets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : wallets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No wallets found. Wallets are created automatically when resellers are added.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reseller</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Total Earned</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Settlement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell>
                        <span className="font-medium">
                          {(wallet as any).resellers?.business_name || (wallet as any).resellers?.legal_name || 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold">₹{Number(wallet.balance).toLocaleString()}</span>
                      </TableCell>
                      <TableCell>₹{Number(wallet.total_earned || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <TrendingUp className="h-3 w-3" />
                            ₹{Number(wallet.pending_credits || 0).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1 text-red-600 text-sm">
                            <TrendingDown className="h-3 w-3" />
                            ₹{Number(wallet.pending_debits || 0).toLocaleString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {wallet.is_locked ? (
                          <Badge variant="destructive">
                            <Lock className="mr-1 h-3 w-3" />
                            Locked
                          </Badge>
                        ) : (
                          <Badge variant="default">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {wallet.last_settlement_at
                          ? new Date(wallet.last_settlement_at).toLocaleDateString()
                          : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openTransactionDialog(wallet)}
                            disabled={wallet.is_locked}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Transaction
                          </Button>
                          {wallet.is_locked ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnlockWallet(wallet.id)}
                            >
                              <Unlock className="mr-1 h-3 w-3" />
                              Unlock
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openLockDialog(wallet)}
                            >
                              <Lock className="mr-1 h-3 w-3" />
                              Lock
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add Transaction Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>
                Add a credit or debit to the reseller's wallet
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <Select
                  value={transactionData.transaction_type}
                  onValueChange={(value) => setTransactionData({ ...transactionData, transaction_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Credit (+)</SelectItem>
                    <SelectItem value="debit">Debit (-)</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={transactionData.amount}
                  onChange={(e) => setTransactionData({ ...transactionData, amount: e.target.value })}
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={transactionData.description}
                  onChange={(e) => setTransactionData({ ...transactionData, description: e.target.value })}
                  placeholder="Reason for this transaction..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTransaction} disabled={processing || !transactionData.amount}>
                  {processing ? "Processing..." : "Add Transaction"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Lock Wallet Dialog */}
        <Dialog open={lockDialogOpen} onOpenChange={setLockDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lock Wallet</DialogTitle>
              <DialogDescription>
                Locking a wallet prevents all transactions until unlocked
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Reason for locking *</Label>
                <Textarea
                  value={lockReason}
                  onChange={(e) => setLockReason(e.target.value)}
                  placeholder="Explain why this wallet is being locked..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setLockDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleLockWallet}
                  disabled={processing || !lockReason.trim()}
                >
                  {processing ? "Locking..." : "Lock Wallet"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
