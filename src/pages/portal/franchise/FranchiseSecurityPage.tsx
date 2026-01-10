import { useState } from 'react';
import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Key, Smartphone, Monitor, LogOut, Lock, Unlock, Eye, EyeOff, Mail } from 'lucide-react';
import { toast } from 'sonner';

const activeSessions = [
  { id: 1, device: 'Chrome on Windows', location: 'Mumbai, India', lastActive: '2 mins ago', current: true },
  { id: 2, device: 'Safari on iPhone', location: 'Mumbai, India', lastActive: '1 hour ago', current: false },
  { id: 3, device: 'Firefox on MacOS', location: 'Pune, India', lastActive: '2 days ago', current: false },
];

export default function FranchiseSecurityPage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChangePassword = () => {
    toast.success('Password changed successfully');
  };

  const handleForgotPassword = () => {
    toast.success('Password reset link sent to your email');
  };

  const handleToggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
    toast.success(is2FAEnabled ? '2FA disabled' : '2FA enabled successfully');
  };

  const handleLogoutAll = () => {
    toast.success('Logged out from all devices');
  };

  const handleLogoutSession = (id: number) => {
    toast.success('Session terminated');
  };

  return (
    <RoleLayout role="franchise">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Security
            </h1>
            <p className="text-muted-foreground mt-1">Manage your account security settings</p>
          </div>
          <Badge variant="default" className="gap-1 bg-emerald-500">
            <Shield className="h-3 w-3" />
            Secure
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-emerald-500" />
                Change Password
              </CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input 
                    id="currentPassword" 
                    type={showCurrentPassword ? 'text' : 'password'} 
                    placeholder="Enter current password" 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input 
                    id="newPassword" 
                    type={showNewPassword ? 'text' : 'password'} 
                    placeholder="Enter new password" 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
              </div>
              <div className="flex gap-2">
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleChangePassword}>
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" onClick={handleForgotPassword}>
                  <Mail className="h-4 w-4 mr-2" />
                  Forgot Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-emerald-500" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="space-y-1">
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    Required for wallet access
                  </p>
                </div>
                <Switch checked={is2FAEnabled} onCheckedChange={handleToggle2FA} />
              </div>
              
              {is2FAEnabled && (
                <div className="space-y-4">
                  <Separator />
                  <div className="text-center p-4 rounded-lg border border-dashed">
                    <Smartphone className="h-12 w-12 mx-auto mb-2 text-emerald-500" />
                    <p className="text-sm font-medium">Authenticator App Connected</p>
                    <p className="text-xs text-muted-foreground">Google Authenticator</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Reconfigure 2FA
                  </Button>
                </div>
              )}

              {!is2FAEnabled && (
                <div className="text-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-sm text-amber-600">
                    2FA is required to access wallet and make withdrawals
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-emerald-500" />
                Active Sessions
              </CardTitle>
              <CardDescription>Manage your logged-in devices</CardDescription>
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogoutAll}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout All Devices
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                        {session.device}
                        {session.current && (
                          <Badge variant="default" className="bg-emerald-500 text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{session.location}</TableCell>
                    <TableCell>{session.lastActive}</TableCell>
                    <TableCell className="text-right">
                      {!session.current && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleLogoutSession(session.id)}
                        >
                          <LogOut className="h-4 w-4" />
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
    </RoleLayout>
  );
}
