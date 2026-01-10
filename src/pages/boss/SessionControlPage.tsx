import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  UserCircle, 
  Monitor,
  Smartphone,
  MapPin,
  Clock,
  LogOut,
  Shield,
  Key,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface Session {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: string;
  ipAddress: string;
  startedAt: string;
  lastActivity: string;
  status: 'active' | 'idle';
}

const activeSessions: Session[] = [
  {
    id: '1',
    userId: 'user-001',
    userName: 'Boss Admin',
    userEmail: 'boss@softwarevala.com',
    role: 'super_admin',
    device: 'desktop',
    browser: 'Chrome 120',
    location: 'Mumbai, India',
    ipAddress: '103.25.123.45',
    startedAt: '2024-01-15 09:00',
    lastActivity: '2 min ago',
    status: 'active',
  },
  {
    id: '2',
    userId: 'user-002',
    userName: 'John Manager',
    userEmail: 'john@softwarevala.com',
    role: 'admin',
    device: 'desktop',
    browser: 'Firefox 121',
    location: 'Delhi, India',
    ipAddress: '103.25.124.12',
    startedAt: '2024-01-15 10:30',
    lastActivity: '15 min ago',
    status: 'idle',
  },
  {
    id: '3',
    userId: 'user-003',
    userName: 'Sarah Developer',
    userEmail: 'sarah@softwarevala.com',
    role: 'code_manager',
    device: 'mobile',
    browser: 'Safari Mobile',
    location: 'Bangalore, India',
    ipAddress: '103.25.125.78',
    startedAt: '2024-01-15 11:00',
    lastActivity: '5 min ago',
    status: 'active',
  },
];

const passwordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireNumbers: true,
  requireSymbols: true,
  expiryDays: 90,
  historyCount: 5,
};

export default function SessionControlPage() {
  const [sessions, setSessions] = useState<Session[]>(activeSessions);

  const handleForceLogout = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    toast.success('Session terminated');
  };

  const handleForceLogoutAll = () => {
    setSessions(prev => prev.filter(s => s.userId === 'user-001'));
    toast.success('All other sessions terminated');
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return Smartphone;
      case 'tablet': return Smartphone;
      default: return Monitor;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Session & Auth Control</h1>
            <p className="text-gray-400 mt-1">Active sessions and authentication management</p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-red-600/80 hover:bg-red-600 text-white">
                <LogOut className="h-4 w-4 mr-2" />
                Force Logout All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Force Logout All Users?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This will immediately terminate all active sessions except your own. 
                  All users will need to log in again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-800">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleForceLogoutAll} className="bg-red-600 hover:bg-red-700 text-white">
                  Force Logout All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Session Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Sessions</CardTitle>
              <UserCircle className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{sessions.length}</div>
              <p className="text-xs text-gray-500 mt-1">Currently online</p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Idle Sessions</CardTitle>
              <Clock className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {sessions.filter(s => s.status === 'idle').length}
              </div>
              <p className="text-xs text-gray-500 mt-1">15+ min inactive</p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Admin Sessions</CardTitle>
              <Shield className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {sessions.filter(s => s.role.includes('admin')).length}
              </div>
              <p className="text-xs text-gray-500 mt-1">High privilege users</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Sessions Table */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Monitor className="h-5 w-5 text-gray-400" />
              Active Sessions
            </CardTitle>
            <CardDescription className="text-gray-400">All currently active user sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-[hsl(var(--boss-card-border))]">
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">Device</TableHead>
                  <TableHead className="text-gray-400">Location</TableHead>
                  <TableHead className="text-gray-400">Last Activity</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => {
                  const DeviceIcon = getDeviceIcon(session.device);
                  return (
                    <TableRow key={session.id} className="border-[hsl(var(--boss-card-border))]">
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{session.userName}</div>
                          <div className="text-xs text-gray-500">{session.userEmail}</div>
                          <Badge variant="outline" className="mt-1 text-xs border-gray-600 text-gray-400">{session.role}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DeviceIcon className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="text-sm text-white capitalize">{session.device}</div>
                            <div className="text-xs text-gray-500">{session.browser}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span className="text-sm text-gray-300">{session.location}</span>
                        </div>
                        <div className="text-xs text-gray-500">{session.ipAddress}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-300">{session.lastActivity}</span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={session.status === 'active' 
                            ? 'border-emerald-500/50 bg-emerald-900/30 text-emerald-300' 
                            : 'border-gray-600 bg-gray-800/50 text-gray-400'
                          }
                        >
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {session.userId !== 'user-001' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleForceLogout(session.id)}
                            className="text-gray-400 hover:text-white hover:bg-gray-800"
                          >
                            <LogOut className="h-4 w-4 mr-1" />
                            End
                          </Button>
                        )}
                        {session.userId === 'user-001' && (
                          <Badge variant="outline" className="border-emerald-500/50 text-emerald-300">Current</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Password Policy Overview */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Key className="h-5 w-5 text-gray-400" />
              Password Policy Overview
            </CardTitle>
            <CardDescription className="text-gray-400">Current authentication security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg border border-[hsl(var(--boss-card-border))] bg-[hsl(var(--boss-panel-bg))]">
                <div className="text-sm text-gray-400">Minimum Length</div>
                <div className="text-lg font-bold text-white">{passwordPolicy.minLength} characters</div>
              </div>
              <div className="p-3 rounded-lg border border-[hsl(var(--boss-card-border))] bg-[hsl(var(--boss-panel-bg))]">
                <div className="text-sm text-gray-400">Password Expiry</div>
                <div className="text-lg font-bold text-white">{passwordPolicy.expiryDays} days</div>
              </div>
              <div className="p-3 rounded-lg border border-[hsl(var(--boss-card-border))] bg-[hsl(var(--boss-panel-bg))]">
                <div className="text-sm text-gray-400">History Check</div>
                <div className="text-lg font-bold text-white">Last {passwordPolicy.historyCount}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline" className="border-gray-600 bg-gray-800/50 text-gray-300">Uppercase Required</Badge>
              <Badge variant="outline" className="border-gray-600 bg-gray-800/50 text-gray-300">Numbers Required</Badge>
              <Badge variant="outline" className="border-gray-600 bg-gray-800/50 text-gray-300">Symbols Required</Badge>
              <Badge variant="outline" className="border-emerald-500/50 bg-emerald-900/30 text-emerald-300">MFA Enabled for Admins</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Sessions
              </Button>
              <Button variant="outline" className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white">
                <Key className="h-4 w-4 mr-2" />
                Force Password Reset (All)
              </Button>
              <Button variant="outline" className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white">
                <Shield className="h-4 w-4 mr-2" />
                Review Device Tracking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}