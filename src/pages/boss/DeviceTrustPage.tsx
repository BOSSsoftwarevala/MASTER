import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useDeviceTrust, useBlockDevice } from '@/hooks/useSecurityData';
import { useUserRoles } from '@/hooks/useUserRoles';
import { 
  Smartphone,
  Monitor,
  Tablet,
  Shield,
  ShieldCheck,
  ShieldX,
  Search,
  Ban,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function DeviceTrustPage() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { data: devices = [], isLoading } = useDeviceTrust();
  const { mutate: blockDevice, isPending: isBlocking } = useBlockDevice();

  const [searchQuery, setSearchQuery] = useState('');
  const [blockDialog, setBlockDialog] = useState<string | null>(null);
  const [blockReason, setBlockReason] = useState('');

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
              <CardDescription className="text-red-400">Super Admin access required for device trust management.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const mockDevices = [
    {
      id: 'mock-1',
      user_id: 'user-1',
      device_fingerprint: 'fp-abc123',
      device_name: 'MacBook Pro',
      device_type: 'desktop',
      browser: 'Chrome 120',
      os: 'macOS Sonoma',
      is_trusted: true,
      trust_level: 'high',
      first_seen_at: new Date(Date.now() - 2592000000).toISOString(),
      last_seen_at: new Date(Date.now() - 3600000).toISOString(),
      approved_at: new Date(Date.now() - 2500000000).toISOString(),
      approved_by: 'admin',
      blocked_at: null,
      blocked_by: null,
      block_reason: null,
      is_deleted: false,
    },
    {
      id: 'mock-2',
      user_id: 'user-2',
      device_fingerprint: 'fp-xyz789',
      device_name: 'iPhone 15',
      device_type: 'mobile',
      browser: 'Safari 17',
      os: 'iOS 17.2',
      is_trusted: true,
      trust_level: 'medium',
      first_seen_at: new Date(Date.now() - 604800000).toISOString(),
      last_seen_at: new Date(Date.now() - 7200000).toISOString(),
      approved_at: new Date(Date.now() - 500000000).toISOString(),
      approved_by: 'admin',
      blocked_at: null,
      blocked_by: null,
      block_reason: null,
      is_deleted: false,
    },
    {
      id: 'mock-3',
      user_id: 'user-3',
      device_fingerprint: 'fp-def456',
      device_name: 'Unknown Device',
      device_type: 'unknown',
      browser: 'Unknown',
      os: 'Linux',
      is_trusted: false,
      trust_level: 'low',
      first_seen_at: new Date(Date.now() - 86400000).toISOString(),
      last_seen_at: new Date(Date.now() - 43200000).toISOString(),
      approved_at: null,
      approved_by: null,
      blocked_at: null,
      blocked_by: null,
      block_reason: null,
      is_deleted: false,
    },
  ];

  const displayDevices = devices.length > 0 ? devices : mockDevices;

  const filteredDevices = displayDevices.filter(device => 
    device.device_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.browser?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.os?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.device_fingerprint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="h-5 w-5 text-blue-400" />;
      case 'tablet':
        return <Tablet className="h-5 w-5 text-purple-400" />;
      case 'desktop':
        return <Monitor className="h-5 w-5 text-emerald-400" />;
      default:
        return <Monitor className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrustBadge = (device: typeof mockDevices[0]) => {
    if (device.blocked_at) {
      return <Badge variant="outline" className="border-red-500/50 bg-red-900/30 text-red-300"><ShieldX className="h-3 w-3 mr-1" /> Blocked</Badge>;
    }
    if (device.is_trusted) {
      return <Badge variant="outline" className="border-emerald-500/50 bg-emerald-900/30 text-emerald-300"><ShieldCheck className="h-3 w-3 mr-1" /> Trusted</Badge>;
    }
    return <Badge variant="outline" className="border-amber-500/50 bg-amber-900/30 text-amber-300"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
  };

  const getTrustLevelBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge variant="outline" className="border-emerald-500/50 bg-emerald-900/30 text-emerald-300">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-amber-500/50 bg-amber-900/30 text-amber-300">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-gray-600 bg-gray-800/50 text-gray-400">Low</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-600 text-gray-400">{level}</Badge>;
    }
  };

  const handleBlock = () => {
    if (blockDialog && blockReason.trim()) {
      blockDevice({ deviceId: blockDialog, reason: blockReason });
      setBlockDialog(null);
      setBlockReason('');
    }
  };

  const stats = {
    total: displayDevices.length,
    trusted: displayDevices.filter(d => d.is_trusted).length,
    pending: displayDevices.filter(d => !d.is_trusted && !d.blocked_at).length,
    blocked: displayDevices.filter(d => d.blocked_at).length,
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Device Trust</h1>
          <p className="text-gray-400 mt-1">Manage trusted devices and access patterns</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Devices</CardTitle>
              <Monitor className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Trusted</CardTitle>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{stats.trusted}</div>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pending</CardTitle>
              <Clock className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Blocked</CardTitle>
              <ShieldX className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{stats.blocked}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search devices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Devices Table */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-emerald-400" />
              Known Devices
            </CardTitle>
            <CardDescription className="text-gray-400">{filteredDevices.length} devices found</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full bg-gray-700" />
                ))}
              </div>
            ) : filteredDevices.length === 0 ? (
              <div className="text-center py-12">
                <Monitor className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <p className="text-lg font-medium text-white">No devices found</p>
                <p className="text-gray-400">No devices match your search criteria</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-[hsl(var(--boss-card-border))]">
                    <TableHead className="text-gray-400">Device</TableHead>
                    <TableHead className="text-gray-400">Browser / OS</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Trust Level</TableHead>
                    <TableHead className="text-gray-400">Last Seen</TableHead>
                    <TableHead className="text-right text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.map((device) => (
                    <TableRow key={device.id} className="border-[hsl(var(--boss-card-border))]">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getDeviceIcon(device.device_type || 'unknown')}
                          <div>
                            <p className="font-medium text-white">{device.device_name || 'Unknown Device'}</p>
                            <p className="text-xs text-gray-500 font-mono">
                              {device.device_fingerprint.substring(0, 12)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-gray-300">{device.browser || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{device.os || 'Unknown OS'}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getTrustBadge(device)}</TableCell>
                      <TableCell>{getTrustLevelBadge(device.trust_level)}</TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(device.last_seen_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {!device.blocked_at && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setBlockDialog(device.id)}
                            className="text-gray-400 hover:text-white hover:bg-gray-800"
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Block
                          </Button>
                        )}
                        {device.is_trusted && !device.blocked_at && (
                          <Badge variant="outline" className="ml-2 border-emerald-500/50 text-emerald-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
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

      {/* Block Dialog */}
      <Dialog open={!!blockDialog} onOpenChange={() => setBlockDialog(null)}>
        <DialogContent className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <DialogHeader>
            <DialogTitle className="text-white">Block Device</DialogTitle>
            <DialogDescription className="text-gray-400">
              Provide a reason for blocking this device. This action can be reversed.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter reason for blocking..."
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            className="min-h-[100px] bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialog(null)} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
            <Button 
              onClick={handleBlock}
              disabled={!blockReason.trim() || isBlocking}
              className="bg-red-600/80 hover:bg-red-600 text-white"
            >
              <Ban className="h-4 w-4 mr-2" />
              Block Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}