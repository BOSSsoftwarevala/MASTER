import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useIPBlocklist, useBlockIP, useUnblockIP } from '@/hooks/useSecurityData';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAuth } from '@/hooks/useAuth';
import { 
  Shield,
  Ban,
  Plus,
  XCircle,
  Clock,
  AlertTriangle,
  Globe,
  CheckCircle
} from 'lucide-react';

export default function IPBlocklistPage() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { user } = useAuth();
  const { data: blocklist = [], isLoading } = useIPBlocklist();
  const { mutate: blockIP, isPending: isBlocking } = useBlockIP();
  const { mutate: unblockIP, isPending: isUnblocking } = useUnblockIP();

  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [newBlock, setNewBlock] = useState({
    ip_address: '',
    reason: '',
    severity: 'medium',
    is_permanent: false,
  });

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-4">
          <Skeleton className="h-8 w-64 bg-gray-700" />
          <Skeleton className="h-96 w-full bg-gray-700" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isSuperAdmin()) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6">
          <Card className="bg-red-900/30 border-red-700/50">
            <CardHeader>
              <CardTitle className="text-red-300">Access Denied</CardTitle>
              <CardDescription className="text-red-400">Super Admin access required for IP blocklist management.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const mockBlocklist = [
    {
      id: 'mock-1',
      ip_address: '192.168.1.100',
      ip_range: null,
      reason: 'Brute force attack',
      severity: 'high',
      is_permanent: false,
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      blocked_by: 'admin',
      blocked_at: new Date(Date.now() - 3600000).toISOString(),
      unblocked_at: null,
      unblocked_by: null,
      is_active: true,
    },
    {
      id: 'mock-2',
      ip_address: '10.0.0.50',
      ip_range: null,
      reason: 'API abuse',
      severity: 'medium',
      is_permanent: false,
      expires_at: new Date(Date.now() + 172800000).toISOString(),
      blocked_by: 'admin',
      blocked_at: new Date(Date.now() - 7200000).toISOString(),
      unblocked_at: null,
      unblocked_by: null,
      is_active: true,
    },
    {
      id: 'mock-3',
      ip_address: '45.33.32.0/24',
      ip_range: '45.33.32.0/24',
      reason: 'Known malicious network',
      severity: 'high',
      is_permanent: true,
      expires_at: null,
      blocked_by: 'admin',
      blocked_at: new Date(Date.now() - 86400000).toISOString(),
      unblocked_at: null,
      unblocked_by: null,
      is_active: true,
    },
  ];

  const displayBlocklist = blocklist.length > 0 ? blocklist : mockBlocklist;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="outline" className="border-red-500/50 bg-red-900/30 text-red-300">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-amber-500/50 bg-amber-900/30 text-amber-300">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-gray-600 bg-gray-800/50 text-gray-400">Low</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-600 text-gray-400">{severity}</Badge>;
    }
  };

  const handleBlockIP = () => {
    if (newBlock.ip_address && newBlock.reason && user) {
      blockIP({
        ip_address: newBlock.ip_address,
        reason: newBlock.reason,
        severity: newBlock.severity,
        blocked_by: user.id,
        is_permanent: newBlock.is_permanent,
      });
      setShowBlockDialog(false);
      setNewBlock({ ip_address: '', reason: '', severity: 'medium', is_permanent: false });
    }
  };

  const handleUnblock = (blockId: string) => {
    if (user) {
      unblockIP({ blockId, unblocked_by: user.id });
    }
  };

  const stats = {
    total: displayBlocklist.length,
    permanent: displayBlocklist.filter(b => b.is_permanent).length,
    temporary: displayBlocklist.filter(b => !b.is_permanent).length,
    highSeverity: displayBlocklist.filter(b => b.severity === 'high').length,
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">IP Blocklist</h1>
            <p className="text-gray-400 mt-1">Manage blocked IP addresses and ranges</p>
          </div>
          <Button onClick={() => setShowBlockDialog(true)} className="bg-red-600/80 hover:bg-red-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Block IP
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Blocked</CardTitle>
              <Ban className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Permanent</CardTitle>
              <Shield className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.permanent}</div>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Temporary</CardTitle>
              <Clock className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.temporary}</div>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-red-600">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">High Severity</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{stats.highSeverity}</div>
            </CardContent>
          </Card>
        </div>

        {/* Blocklist Table */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-emerald-400" />
              Blocked IPs
            </CardTitle>
            <CardDescription className="text-gray-400">Active IP blocks protecting the system</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full bg-gray-700" />
                ))}
              </div>
            ) : displayBlocklist.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto text-emerald-400 mb-4" />
                <p className="text-lg font-medium text-white">No blocked IPs</p>
                <p className="text-gray-400">All traffic is currently allowed</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-[hsl(var(--boss-card-border))]">
                    <TableHead className="text-gray-400">IP Address</TableHead>
                    <TableHead className="text-gray-400">Reason</TableHead>
                    <TableHead className="text-gray-400">Severity</TableHead>
                    <TableHead className="text-gray-400">Type</TableHead>
                    <TableHead className="text-gray-400">Blocked At</TableHead>
                    <TableHead className="text-gray-400">Expires</TableHead>
                    <TableHead className="text-right text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayBlocklist.map((block) => (
                    <TableRow key={block.id} className="border-[hsl(var(--boss-card-border))]">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span className="font-mono text-gray-300">{block.ip_address}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{block.reason}</TableCell>
                      <TableCell>{getSeverityBadge(block.severity)}</TableCell>
                      <TableCell>
                        {block.is_permanent ? (
                          <Badge variant="outline" className="border-red-500/50 bg-red-900/30 text-red-300">Permanent</Badge>
                        ) : (
                          <Badge variant="outline" className="border-gray-600 text-gray-400">Temporary</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(block.blocked_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {block.is_permanent ? (
                          <span className="text-red-400">Never</span>
                        ) : block.expires_at ? (
                          new Date(block.expires_at).toLocaleDateString()
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnblock(block.id)}
                          disabled={isUnblocking}
                          className="text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Unblock
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

      {/* Block IP Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <DialogHeader>
            <DialogTitle className="text-white">Block IP Address</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add an IP address or range to the blocklist.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">IP Address or CIDR Range</Label>
              <Input
                placeholder="e.g., 192.168.1.100 or 10.0.0.0/24"
                value={newBlock.ip_address}
                onChange={(e) => setNewBlock({ ...newBlock, ip_address: e.target.value })}
                className="bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Reason</Label>
              <Input
                placeholder="Reason for blocking..."
                value={newBlock.reason}
                onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
                className="bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Severity</Label>
              <Select
                value={newBlock.severity}
                onValueChange={(value) => setNewBlock({ ...newBlock, severity: value })}
              >
                <SelectTrigger className="bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <SelectItem value="low" className="text-gray-200 focus:bg-gray-700">Low</SelectItem>
                  <SelectItem value="medium" className="text-gray-200 focus:bg-gray-700">Medium</SelectItem>
                  <SelectItem value="high" className="text-gray-200 focus:bg-gray-700">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="permanent"
                checked={newBlock.is_permanent}
                onChange={(e) => setNewBlock({ ...newBlock, is_permanent: e.target.checked })}
                className="rounded bg-gray-800 border-gray-600"
              />
              <Label htmlFor="permanent" className="text-gray-300">Permanent block (no expiry)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockDialog(false)} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
            <Button 
              onClick={handleBlockIP}
              disabled={!newBlock.ip_address || !newBlock.reason || isBlocking}
              className="bg-red-600/80 hover:bg-red-600 text-white"
            >
              <Ban className="h-4 w-4 mr-2" />
              Block IP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}