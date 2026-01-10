import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Key, Calendar, CheckCircle, AlertTriangle, RefreshCw, Shield } from 'lucide-react';
import { toast } from 'sonner';

const franchiseKeys = [
  { 
    id: 'FK-2024-001', 
    plan: 'Gold Franchise', 
    activatedOn: '2024-01-15', 
    expiresOn: '2025-01-15', 
    status: 'active',
    daysRemaining: 285
  },
  { 
    id: 'FK-2023-045', 
    plan: 'Silver Franchise', 
    activatedOn: '2023-06-01', 
    expiresOn: '2024-06-01', 
    status: 'expired',
    daysRemaining: 0
  },
];

export default function FranchiseKeysPage() {
  const activeKey = franchiseKeys.find(k => k.status === 'active');

  const handleRenewalRequest = () => {
    toast.success('Renewal request submitted. Our team will contact you shortly.');
  };

  return (
    <RoleLayout role="franchise">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Franchise Key
            </h1>
            <p className="text-muted-foreground mt-1">Your active franchise license information</p>
          </div>
          <Badge variant="default" className="gap-1 bg-emerald-500">
            <Key className="h-3 w-3" />
            Licensed
          </Badge>
        </div>

        {/* Active Key Card */}
        {activeKey && (
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                Active Franchise License
              </CardTitle>
              <CardDescription>Your current active franchise key</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Key ID</p>
                  <p className="text-lg font-mono font-bold text-emerald-500">{activeKey.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Plan Type</p>
                  <p className="text-lg font-semibold">{activeKey.plan}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Expires On</p>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {activeKey.expiresOn}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-lg font-semibold text-emerald-500">Active</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-background/50 flex items-center justify-between">
                <div>
                  <p className="font-medium">{activeKey.daysRemaining} days remaining</p>
                  <p className="text-sm text-muted-foreground">Renew before expiry to avoid service interruption</p>
                </div>
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleRenewalRequest}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Request Renewal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Keys History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-emerald-500" />
              License History
            </CardTitle>
            <CardDescription>All your franchise licenses</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key ID</TableHead>
                  <TableHead>Plan Type</TableHead>
                  <TableHead>Activated On</TableHead>
                  <TableHead>Expires On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {franchiseKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-mono font-medium">{key.id}</TableCell>
                    <TableCell>{key.plan}</TableCell>
                    <TableCell>{key.activatedOn}</TableCell>
                    <TableCell>{key.expiresOn}</TableCell>
                    <TableCell>
                      <Badge variant={key.status === 'active' ? 'default' : 'secondary'} 
                        className={key.status === 'active' ? 'bg-emerald-500' : ''}>
                        {key.status === 'active' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {key.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {key.status === 'active' && (
                        <Button variant="outline" size="sm" onClick={handleRenewalRequest}>
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Renew
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Key className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-500">About Franchise Keys</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your franchise key is a unique license that grants you access to the franchise portal and all its features. 
                  Keys are domain-locked and cannot be transferred. Renewal requests are processed within 24-48 hours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
}
