import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
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
  User, 
  Mail, 
  Phone, 
  MapPin,
  Award,
  Calendar,
  Shield,
  Edit,
  Building,
  CreditCard,
  Key,
  Lock,
  Smartphone,
  Monitor,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const profileData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 98765 43210',
  address: 'Mumbai, Maharashtra, India',
  joinDate: 'Oct 15, 2024',
  tier: 'Gold',
  referralCode: 'RSL-JD2024',
  franchiseOwner: 'Mumbai Central Franchise',
  bankAccount: '**** **** 4521',
  kycStatus: 'verified',
};

const activeSessions = [
  { id: 1, device: 'Chrome on Windows', location: 'Mumbai, IN', lastActive: 'Now', current: true },
  { id: 2, device: 'Safari on iPhone', location: 'Mumbai, IN', lastActive: '2 hours ago', current: false },
  { id: 3, device: 'Firefox on MacOS', location: 'Delhi, IN', lastActive: 'Yesterday', current: false },
];

export default function ResellerProfilePage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState(profileData.email);

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    // API call would go here
    toast.success('Password changed successfully');
    setChangePasswordOpen(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleForgotPassword = () => {
    if (!resetEmail) {
      toast.error('Email is required');
      return;
    }
    // API call would go here
    toast.success('Password reset link sent to your email');
    setForgotPasswordOpen(false);
  };

  const handle2FAToggle = (enabled: boolean) => {
    setIs2FAEnabled(enabled);
    if (enabled) {
      toast.success('Two-Factor Authentication enabled');
    } else {
      toast.info('Two-Factor Authentication disabled');
    }
  };

  const handleLogoutSession = (sessionId: number) => {
    toast.success('Session terminated successfully');
  };

  const handleLogoutAllSessions = () => {
    toast.success('All other sessions terminated');
  };

  return (
    <RoleLayout role="reseller">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">Manage your reseller profile and settings</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={profileData.name} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input value={profileData.email} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input value={profileData.phone} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input value={profileData.address} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm text-muted-foreground">Current Tier</p>
                  <Badge variant="outline" className="mt-1 bg-amber-500/20 text-amber-400 border-amber-500/30">
                    {profileData.tier}
                  </Badge>
                </div>
                <Award className="h-8 w-8 text-amber-500" />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Referral Code</Label>
                <Input value={profileData.referralCode} disabled />
              </div>
              <div className="space-y-2">
                <Label>Franchise Owner</Label>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <Input value={profileData.franchiseOwner} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Member Since</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input value={profileData.joinDate} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
              <CardDescription>Your linked bank account for payouts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Bank Account</p>
                    <p className="text-sm text-muted-foreground">{profileData.bankAccount}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  Verified
                </Badge>
              </div>
              <Button variant="outline" className="w-full">
                Update Payment Details
              </Button>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Account Security
              </CardTitle>
              <CardDescription>Manage your password and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Change Password */}
              <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
                <DialogTrigger asChild>
                  <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Key className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Change</Button>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and choose a new one
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword">Current Password</Label>
                      <Input 
                        id="oldPassword" 
                        type="password" 
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                      <p className="text-xs text-muted-foreground">
                        Minimum 8 characters, include uppercase, number & symbol
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setChangePasswordOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleChangePassword}>
                      Update Password
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Forgot Password */}
              <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                <DialogTrigger asChild>
                  <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">Forgot Password</p>
                        <p className="text-sm text-muted-foreground">Reset via email verification</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Reset</Button>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                      We'll send a password reset link to your email
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="resetEmail">Email Address</Label>
                      <Input 
                        id="resetEmail" 
                        type="email" 
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        All active sessions will be invalidated after password reset
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setForgotPasswordOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleForgotPassword}>
                      Send Reset Link
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    is2FAEnabled ? 'bg-emerald-500/10' : 'bg-muted'
                  }`}>
                    <Shield className={`h-5 w-5 ${is2FAEnabled ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      {is2FAEnabled ? 'Your account is protected' : 'Secure your account with 2FA'}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={is2FAEnabled} 
                  onCheckedChange={handle2FAToggle}
                />
              </div>

              {is2FAEnabled && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Verification Methods</p>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Email OTP</span>
                      </div>
                      <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">SMS OTP</span>
                      </div>
                      <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Authenticator App</span>
                      </div>
                      <Button variant="ghost" size="sm">Setup</Button>
                    </div>
                  </div>
                </>
              )}

              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    New device logins will require verification when 2FA is enabled
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Active Sessions
                  </CardTitle>
                  <CardDescription>Manage your logged in devices</CardDescription>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleLogoutAllSessions}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout All Other Devices
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeSessions.map((session) => (
                  <div 
                    key={session.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      session.current ? 'border-emerald-500/30 bg-emerald-500/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        session.current ? 'bg-emerald-500/10' : 'bg-muted'
                      }`}>
                        <Monitor className={`h-5 w-5 ${
                          session.current ? 'text-emerald-500' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{session.device}</p>
                          {session.current && (
                            <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{session.location}</span>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>{session.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    {!session.current && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleLogoutSession(session.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div className="text-sm text-amber-600 dark:text-amber-400">
                    <p className="font-medium">Security Notice</p>
                    <p>Sessions are automatically terminated on suspicious activity. All password and 2FA changes are logged for security audit.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleLayout>
  );
}
