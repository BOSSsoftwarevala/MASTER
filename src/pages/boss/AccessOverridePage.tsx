import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  KeyRound, 
  Clock, 
  Shield,
  UserCheck,
  AlertTriangle,
  Plus,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface ActiveOverride {
  id: string;
  userId: string;
  userName: string;
  accessLevel: string;
  reason: string;
  grantedBy: string;
  grantedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
}

const activeOverrides: ActiveOverride[] = [
  {
    id: '1',
    userId: 'user-001',
    userName: 'John Developer',
    accessLevel: 'Server Admin',
    reason: 'Emergency deployment fix',
    grantedBy: 'Boss Admin',
    grantedAt: '2024-01-15 10:00',
    expiresAt: '2024-01-15 14:00',
    status: 'active',
  },
  {
    id: '2',
    userId: 'user-002',
    userName: 'Sarah Support',
    accessLevel: 'Database Read',
    reason: 'Customer data investigation',
    grantedBy: 'Boss Admin',
    grantedAt: '2024-01-14 09:00',
    expiresAt: '2024-01-14 11:00',
    status: 'expired',
  },
];

const accessLevels = [
  { value: 'server_admin', label: 'Server Admin' },
  { value: 'database_read', label: 'Database Read' },
  { value: 'database_write', label: 'Database Write' },
  { value: 'finance_view', label: 'Finance View' },
  { value: 'full_admin', label: 'Full Admin (Temporary)' },
];

const durationOptions = [
  { value: '1', label: '1 Hour' },
  { value: '2', label: '2 Hours' },
  { value: '4', label: '4 Hours' },
  { value: '8', label: '8 Hours' },
  { value: '24', label: '24 Hours' },
];

export default function AccessOverridePage() {
  const [overrides, setOverrides] = useState<ActiveOverride[]>(activeOverrides);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    accessLevel: '',
    duration: '',
    reason: '',
  });

  const handleGrantAccess = () => {
    if (!formData.userId || !formData.accessLevel || !formData.duration || !formData.reason) {
      toast.error('All fields are required');
      return;
    }

    const newOverride: ActiveOverride = {
      id: Date.now().toString(),
      userId: formData.userId,
      userName: 'User Name',
      accessLevel: accessLevels.find(a => a.value === formData.accessLevel)?.label || '',
      reason: formData.reason,
      grantedBy: 'Boss Admin',
      grantedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + parseInt(formData.duration) * 60 * 60 * 1000).toISOString(),
      status: 'active',
    };

    setOverrides(prev => [newOverride, ...prev]);
    toast.success('Emergency access granted');
    setDialogOpen(false);
    setFormData({ userId: '', accessLevel: '', duration: '', reason: '' });
  };

  const handleRevokeAccess = (id: string) => {
    setOverrides(prev => prev.map(o => 
      o.id === id ? { ...o, status: 'revoked' as const } : o
    ));
    toast.success('Access revoked');
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Access Override</h1>
            <p className="text-gray-400 mt-1">Emergency access grants with time-bound expiry</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Grant Emergency Access
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
              <DialogHeader>
                <DialogTitle className="text-white">Grant Emergency Access</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Grant temporary elevated access. All grants are logged in Black Box.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-3 bg-amber-900/30 border border-amber-700/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5" />
                    <p className="text-sm text-amber-300">
                      Emergency access is time-bound and will auto-expire. Reason is mandatory.
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="userId" className="text-gray-300">User ID or Email</Label>
                  <Input
                    id="userId"
                    placeholder="Enter user ID or email"
                    value={formData.userId}
                    onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                    className="mt-1 bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="accessLevel" className="text-gray-300">Access Level</Label>
                  <Select
                    value={formData.accessLevel}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, accessLevel: value }))}
                  >
                    <SelectTrigger className="mt-1 bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white">
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                      {accessLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value} className="text-gray-200 focus:bg-gray-700">
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration" className="text-gray-300">Duration</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger className="mt-1 bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-gray-200 focus:bg-gray-700">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reason" className="text-gray-300">Reason (Mandatory)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Explain why this access is needed..."
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    className="mt-1 bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  Cancel
                </Button>
                <Button onClick={handleGrantAccess} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <KeyRound className="h-4 w-4 mr-2" />
                  Grant Access
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Rules Card */}
        <Card className="bg-blue-900/20 border-blue-700/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">Access Override Rules</h3>
                <ul className="text-sm text-gray-400 mt-2 space-y-1">
                  <li>• All access grants are time-bound with auto-expiry</li>
                  <li>• Reason is mandatory for every grant</li>
                  <li>• All actions are logged in Black Box (immutable)</li>
                  <li>• Access can be revoked immediately by Boss</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Overrides */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <UserCheck className="h-5 w-5 text-emerald-400" />
              Active & Recent Overrides
            </CardTitle>
            <CardDescription className="text-gray-400">Current emergency access grants</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-[hsl(var(--boss-card-border))]">
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">Access Level</TableHead>
                  <TableHead className="text-gray-400">Reason</TableHead>
                  <TableHead className="text-gray-400">Duration</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overrides.map((override) => (
                  <TableRow key={override.id} className="border-[hsl(var(--boss-card-border))]">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{override.userName}</div>
                        <div className="text-xs text-gray-500">{override.userId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">{override.accessLevel}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-gray-300">{override.reason}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{override.expiresAt}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          override.status === 'active' ? 'border-emerald-500/50 bg-emerald-900/30 text-emerald-300' :
                          override.status === 'expired' ? 'border-gray-600 bg-gray-800/50 text-gray-400' : 
                          'border-red-500/50 bg-red-900/30 text-red-300'
                        }
                      >
                        {override.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {override.status === 'active' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRevokeAccess(override.id)}
                          className="text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Revoke
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}