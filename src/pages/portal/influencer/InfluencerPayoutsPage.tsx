import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  Wallet, 
  DollarSign,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Download,
  Calendar,
  CreditCard,
  FileText,
  Lock,
  AlertCircle
} from 'lucide-react';

const payouts = [
  { 
    id: 1,
    amount: 2100,
    campaign: 'Tech Tutorial Series',
    type: 'Campaign Completion',
    status: 'completed',
    requestedAt: 'Dec 25, 2025',
    paidAt: 'Dec 28, 2025',
    method: 'Bank Transfer'
  },
  { 
    id: 2,
    amount: 1500,
    campaign: 'Holiday Campaign',
    type: 'Performance Bonus',
    status: 'completed',
    requestedAt: 'Dec 18, 2025',
    paidAt: 'Dec 20, 2025',
    method: 'PayPal'
  },
  { 
    id: 3,
    amount: 850,
    campaign: 'Product Unboxing',
    type: 'Campaign Completion',
    status: 'completed',
    requestedAt: 'Dec 12, 2025',
    paidAt: 'Dec 15, 2025',
    method: 'Bank Transfer'
  },
  { 
    id: 4,
    amount: 3500,
    campaign: 'Summer Product Launch',
    type: 'Campaign + Bonus',
    status: 'pending',
    requestedAt: 'Jan 3, 2026',
    method: 'Bank Transfer'
  },
];

const walletSummary = {
  available: 3500,
  pending: 1750,
  totalEarned: 12000,
  thisMonth: 4250,
};

const taxInfo = {
  country: 'United States',
  taxId: '***-**-1234',
  taxRate: 10,
  verified: true,
};

const payoutRules = {
  minThreshold: 50,
  processingDay: 'Friday',
  paymentMethodLocked: true,
};

export default function InfluencerPayoutsPage() {
  const [taxDialogOpen, setTaxDialogOpen] = useState(false);

  const handleUpdateTax = () => {
    toast.success('Tax information updated');
    setTaxDialogOpen(false);
  };
  return (
    <RoleLayout role="influencer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payouts & Wallet</h1>
            <p className="text-muted-foreground">Manage your earnings and withdrawals</p>
          </div>
          <Button>
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
        </div>

        {/* Wallet Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-3xl font-bold text-emerald-500">${walletSummary.available.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold">${walletSummary.pending.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-violet-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="text-3xl font-bold">${walletSummary.totalEarned.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-3xl font-bold">${walletSummary.thisMonth.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tax & Payout Rules */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Tax Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Tax Information
              </CardTitle>
              <CardDescription>Your tax details for payouts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border bg-muted/50">
                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Country</span>
                    <span className="text-sm font-medium">{taxInfo.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tax ID / GST</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{taxInfo.taxId}</span>
                      {taxInfo.verified && (
                        <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Withholding Rate</span>
                    <span className="text-sm font-medium">{taxInfo.taxRate}%</span>
                  </div>
                </div>
              </div>
              <Dialog open={taxDialogOpen} onOpenChange={setTaxDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">Update Tax Info</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Tax Information</DialogTitle>
                    <DialogDescription>Provide your tax details for accurate withholding</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Select defaultValue="us">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tax ID / GST Number</Label>
                      <Input placeholder="Enter your tax identification number" />
                    </div>
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <p className="text-xs text-amber-400">
                        Tax rates are applied automatically based on your country. Consult a tax professional for advice.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setTaxDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateTax}>Save Tax Info</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Payout Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Payout Rules
              </CardTitle>
              <CardDescription>Important payout policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm">Minimum Threshold</span>
                  </div>
                  <span className="font-medium">${payoutRules.minThreshold}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Processing Day</span>
                  </div>
                  <span className="font-medium">{payoutRules.processingDay}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Payment Method</span>
                  </div>
                  <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    Locked
                  </Badge>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <p className="text-xs text-cyan-400">
                  <strong>Note:</strong> Payment method changes require admin approval after initial setup.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg border bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-muted-foreground">****4521 - Primary</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      Default
                    </Badge>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-violet-500" />
                    </div>
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">creator@email.com</p>
                    </div>
                  </div>
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Payout History</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div key={payout.id} className={`flex items-center justify-between p-4 rounded-lg ${
                  payout.status === 'pending' ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-muted/50'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      payout.status === 'completed' ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                    }`}>
                      {payout.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{payout.campaign}</p>
                      <p className="text-sm text-muted-foreground">{payout.type}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{payout.method}</span>
                        <span>•</span>
                        <span>Requested: {payout.requestedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-500">${payout.amount.toLocaleString()}</p>
                    <Badge variant="outline" className={
                      payout.status === 'completed' 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }>
                      {payout.status}
                    </Badge>
                    {payout.paidAt && (
                      <p className="text-xs text-muted-foreground mt-1">Paid: {payout.paidAt}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payout Info */}
        <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
          <p className="text-sm text-violet-400">
            <strong>Payout Schedule:</strong> Payouts are processed every Friday. 
            Minimum withdrawal amount is $50. Funds typically arrive within 3-5 business days.
          </p>
        </div>
      </div>
    </RoleLayout>
  );
}
