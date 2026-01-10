import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallets, useWalletTransaction, useWalletLedger, useUpdateWallet, useCreateWallet, Wallet } from '@/hooks/useFinanceData';
import { useUserRoles } from '@/hooks/useUserRoles';
import { format } from 'date-fns';
import {
  Wallet as WalletIcon,
  Plus,
  Minus,
  Lock,
  Unlock,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Building,
  Users,
  Store,
  User,
  AlertTriangle,
} from 'lucide-react';

export default function WalletsPage() {
  const { isAdmin } = useUserRoles();
  const { data: wallets, isLoading } = useWallets();
  const { data: ledger, isLoading: ledgerLoading } = useWalletLedger();
  const walletTransaction = useWalletTransaction();
  const updateWallet = useUpdateWallet();
  const createWallet = useCreateWallet();

  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [transactionType, setTransactionType] = useState<'credit' | 'debit'>('credit');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [lockReason, setLockReason] = useState('');
  const [newWallet, setNewWallet] = useState({
    wallet_type: '' as 'company' | 'franchise' | 'reseller' | 'user',
    owner_id: '',
    owner_name: '',
    balance: 0,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'company': return <Building className="h-5 w-5" />;
      case 'franchise': return <Store className="h-5 w-5" />;
      case 'reseller': return <Users className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const handleTransaction = async () => {
    if (!selectedWallet || !transactionAmount) return;
    
    await walletTransaction.mutateAsync({
      walletId: selectedWallet.id,
      type: transactionType,
      amount: parseFloat(transactionAmount),
      description: transactionDescription,
    });
    
    setTransactionDialogOpen(false);
    setTransactionAmount('');
    setTransactionDescription('');
  };

  const handleLockToggle = async () => {
    if (!selectedWallet) return;
    
    if (selectedWallet.is_locked) {
      await updateWallet.mutateAsync({
        id: selectedWallet.id,
        is_locked: false,
        lock_reason: null,
        locked_at: null,
      });
    } else {
      await updateWallet.mutateAsync({
        id: selectedWallet.id,
        is_locked: true,
        lock_reason: lockReason,
        locked_at: new Date().toISOString(),
      });
    }
    
    setLockDialogOpen(false);
    setLockReason('');
  };

  const handleCreateWallet = async () => {
    if (!newWallet.wallet_type || !newWallet.owner_name) return;
    
    await createWallet.mutateAsync({
      ...newWallet,
      owner_id: newWallet.owner_id || crypto.randomUUID(),
      currency: 'INR',
      hold_amount: 0,
      is_locked: false,
    });
    
    setCreateDialogOpen(false);
    setNewWallet({ wallet_type: '' as any, owner_id: '', owner_name: '', balance: 0 });
  };

  if (!isAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Card className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access Wallets.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const walletsByType = {
    company: wallets?.filter(w => w.wallet_type === 'company') || [],
    franchise: wallets?.filter(w => w.wallet_type === 'franchise') || [],
    reseller: wallets?.filter(w => w.wallet_type === 'reseller') || [],
    user: wallets?.filter(w => w.wallet_type === 'user') || [],
  };

  const totalBalance = wallets?.reduce((sum, w) => sum + (w.balance || 0), 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Wallets</h1>
            <p className="text-muted-foreground mt-1">Manage all wallet balances and transactions</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Wallet
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Company Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{walletsByType.company.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Franchise Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{walletsByType.franchise.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reseller Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{walletsByType.reseller.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Wallets Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Wallets</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="franchise">Franchise</TabsTrigger>
            <TabsTrigger value="reseller">Reseller</TabsTrigger>
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="ledger">Transaction Ledger</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <WalletTable 
              wallets={wallets || []} 
              isLoading={isLoading}
              onTransaction={(wallet, type) => {
                setSelectedWallet(wallet);
                setTransactionType(type);
                setTransactionDialogOpen(true);
              }}
              onLock={(wallet) => {
                setSelectedWallet(wallet);
                setLockDialogOpen(true);
              }}
              formatCurrency={formatCurrency}
              getWalletIcon={getWalletIcon}
            />
          </TabsContent>

          {['company', 'franchise', 'reseller', 'user'].map((type) => (
            <TabsContent key={type} value={type}>
              <WalletTable 
                wallets={walletsByType[type as keyof typeof walletsByType]} 
                isLoading={isLoading}
                onTransaction={(wallet, txType) => {
                  setSelectedWallet(wallet);
                  setTransactionType(txType);
                  setTransactionDialogOpen(true);
                }}
                onLock={(wallet) => {
                  setSelectedWallet(wallet);
                  setLockDialogOpen(true);
                }}
                formatCurrency={formatCurrency}
                getWalletIcon={getWalletIcon}
              />
            </TabsContent>
          ))}

          <TabsContent value="ledger">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Transaction Ledger
                </CardTitle>
                <CardDescription>Recent wallet transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Before</TableHead>
                      <TableHead>After</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ledgerLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          {Array(6).fill(0).map((_, j) => (
                            <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : ledger && ledger.length > 0 ? (
                      ledger.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{format(new Date(entry.created_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                          <TableCell>
                            <Badge variant={entry.transaction_type === 'credit' ? 'default' : 'secondary'}>
                              {entry.transaction_type === 'credit' ? (
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 mr-1" />
                              )}
                              {entry.transaction_type}
                            </Badge>
                          </TableCell>
                          <TableCell className={entry.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                            {entry.transaction_type === 'credit' ? '+' : '-'}{formatCurrency(entry.amount)}
                          </TableCell>
                          <TableCell>{formatCurrency(entry.balance_before)}</TableCell>
                          <TableCell>{formatCurrency(entry.balance_after)}</TableCell>
                          <TableCell className="text-muted-foreground">{entry.description || '-'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No transactions yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Transaction Dialog */}
        <Dialog open={transactionDialogOpen} onOpenChange={setTransactionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{transactionType === 'credit' ? 'Add Credit' : 'Debit'} Wallet</DialogTitle>
              <DialogDescription>
                {selectedWallet?.owner_name} - Current Balance: {formatCurrency(selectedWallet?.balance || 0)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Amount (INR)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Transaction description"
                  value={transactionDescription}
                  onChange={(e) => setTransactionDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setTransactionDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleTransaction} 
                disabled={walletTransaction.isPending}
                variant={transactionType === 'credit' ? 'default' : 'destructive'}
              >
                {transactionType === 'credit' ? 'Add Credit' : 'Debit Amount'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lock Dialog */}
        <Dialog open={lockDialogOpen} onOpenChange={setLockDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedWallet?.is_locked ? 'Unlock' : 'Lock'} Wallet</DialogTitle>
              <DialogDescription>
                {selectedWallet?.owner_name}
              </DialogDescription>
            </DialogHeader>
            {!selectedWallet?.is_locked && (
              <div>
                <Label>Lock Reason</Label>
                <Textarea
                  placeholder="Reason for locking this wallet"
                  value={lockReason}
                  onChange={(e) => setLockReason(e.target.value)}
                />
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setLockDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleLockToggle} 
                disabled={updateWallet.isPending}
                variant={selectedWallet?.is_locked ? 'default' : 'destructive'}
              >
                {selectedWallet?.is_locked ? 'Unlock Wallet' : 'Lock Wallet'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Wallet Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Wallet</DialogTitle>
              <DialogDescription>Create a new wallet for a user, franchise, or reseller</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Wallet Type</Label>
                <Select value={newWallet.wallet_type} onValueChange={(v: any) => setNewWallet({...newWallet, wallet_type: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="franchise">Franchise</SelectItem>
                    <SelectItem value="reseller">Reseller</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Owner Name</Label>
                <Input
                  placeholder="Enter owner name"
                  value={newWallet.owner_name}
                  onChange={(e) => setNewWallet({...newWallet, owner_name: e.target.value})}
                />
              </div>
              <div>
                <Label>Initial Balance (INR)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newWallet.balance}
                  onChange={(e) => setNewWallet({...newWallet, balance: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateWallet} disabled={createWallet.isPending}>
                Create Wallet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

// Wallet Table Component
function WalletTable({ 
  wallets, 
  isLoading, 
  onTransaction, 
  onLock,
  formatCurrency,
  getWalletIcon,
}: {
  wallets: Wallet[];
  isLoading: boolean;
  onTransaction: (wallet: Wallet, type: 'credit' | 'debit') => void;
  onLock: (wallet: Wallet) => void;
  formatCurrency: (amount: number) => string;
  getWalletIcon: (type: string) => React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Owner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Hold Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  {Array(6).fill(0).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : wallets.length > 0 ? (
              wallets.map((wallet) => (
                <TableRow key={wallet.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getWalletIcon(wallet.wallet_type)}
                      {wallet.owner_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{wallet.wallet_type}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(wallet.balance)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatCurrency(wallet.hold_amount)}</TableCell>
                  <TableCell>
                    {wallet.is_locked ? (
                      <Badge variant="destructive">
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onTransaction(wallet, 'credit')}
                        disabled={wallet.is_locked}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onTransaction(wallet, 'debit')}
                        disabled={wallet.is_locked}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant={wallet.is_locked ? 'default' : 'destructive'}
                        onClick={() => onLock(wallet)}
                      >
                        {wallet.is_locked ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No wallets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
