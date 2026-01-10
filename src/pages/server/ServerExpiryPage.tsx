import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  CalendarClock, 
  Server,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Pause
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ServerExpiryPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const [actionDialog, setActionDialog] = useState<{open: boolean; action: string; server: any}>({
    open: false, action: '', server: null
  });
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const servers = [
    { 
      id: 1, 
      name: 'PROD-WEB-01', 
      provider: 'AWS',
      expiryDate: '2025-02-15',
      daysLeft: 42,
      renewalCost: 25000,
      autoRenew: true,
      risk: 'low'
    },
    { 
      id: 2, 
      name: 'PROD-DB-01', 
      provider: 'Hetzner',
      expiryDate: '2025-01-20',
      daysLeft: 16,
      renewalCost: 45000,
      autoRenew: false,
      risk: 'medium'
    },
    { 
      id: 3, 
      name: 'CLIENT-XYZ-01', 
      provider: 'DigitalOcean',
      expiryDate: '2025-01-10',
      daysLeft: 6,
      renewalCost: 8000,
      autoRenew: false,
      risk: 'high'
    },
    { 
      id: 4, 
      name: 'STAGING-01', 
      provider: 'AWS',
      expiryDate: '2025-03-01',
      daysLeft: 56,
      renewalCost: 5000,
      autoRenew: true,
      risk: 'low'
    },
  ];

  const handleAction = (action: string, server: any) => {
    setActionDialog({ open: true, action, server });
  };

  const confirmAction = () => {
    toast.success(`${actionDialog.action} request for ${actionDialog.server?.name} submitted for approval`);
    setActionDialog({ open: false, action: '', server: null });
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />High Risk</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-500 text-black"><AlertTriangle className="h-3 w-3 mr-1" />Medium</Badge>;
      default:
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Low</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <CalendarClock className="h-8 w-8 text-primary" />
              Server Expiry & Renewal
            </h1>
            <p className="text-muted-foreground mt-1">
              Track server expirations and manage renewals
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {servers.filter(s => s.daysLeft <= 7).length}
              </div>
              <p className="text-sm text-muted-foreground">Within 7 days</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Needs Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {servers.filter(s => s.daysLeft <= 30 && s.daysLeft > 7).length}
              </div>
              <p className="text-sm text-muted-foreground">Within 30 days</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Auto-Renew</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {servers.filter(s => s.autoRenew).length}
              </div>
              <p className="text-sm text-muted-foreground">Enabled</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Renewal Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ₹{servers.reduce((acc, s) => acc + s.renewalCost, 0).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Next cycle</p>
            </CardContent>
          </Card>
        </div>

        {/* Expiry Table */}
        <Card>
          <CardHeader>
            <CardTitle>Server Expiry Schedule</CardTitle>
            <CardDescription>Upcoming renewals and expirations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Server</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Renewal Cost</TableHead>
                  <TableHead>Auto-Renew</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servers.sort((a, b) => a.daysLeft - b.daysLeft).map((server) => (
                  <TableRow key={server.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-muted-foreground" />
                        {server.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{server.provider}</Badge>
                    </TableCell>
                    <TableCell>{server.expiryDate}</TableCell>
                    <TableCell>
                      <span className={`font-bold ${
                        server.daysLeft <= 7 ? 'text-destructive' :
                        server.daysLeft <= 30 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {server.daysLeft} days
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        ₹{server.renewalCost.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={server.autoRenew ? 'default' : 'outline'}>
                        {server.autoRenew ? 'On' : 'Off'}
                      </Badge>
                    </TableCell>
                    <TableCell>{getRiskBadge(server.risk)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAction('Approve Renewal', server)}
                          className="text-green-600"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAction('Pause Server', server)}
                          className="text-orange-600"
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action Dialog */}
        <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{actionDialog.action}</DialogTitle>
              <DialogDescription>
                This action requires approval
              </DialogDescription>
            </DialogHeader>
            {actionDialog.server && (
              <div className="space-y-4 py-4">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Server</p>
                  <p className="font-medium">{actionDialog.server.name}</p>
                </div>
                {actionDialog.action === 'Approve Renewal' && (
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Renewal Cost</p>
                    <p className="font-medium text-lg">₹{actionDialog.server.renewalCost.toLocaleString()}</p>
                  </div>
                )}
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    ⚠️ This request will be sent to Boss for final approval.
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog({ open: false, action: '', server: null })}>
                Cancel
              </Button>
              <Button onClick={confirmAction}>
                Submit for Approval
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
