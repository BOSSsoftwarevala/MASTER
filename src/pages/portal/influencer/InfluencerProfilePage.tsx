import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { 
  UserCircle, 
  Mail,
  Phone,
  MapPin,
  Star,
  Shield,
  Key,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Globe,
  Youtube,
  Instagram
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { InfluencerContractModal } from '@/components/influencer/InfluencerContractModal';
import { InfluencerSupportSection } from '@/components/influencer/InfluencerSupportSection';
import { InfluencerAccountStatus } from '@/components/influencer/InfluencerAccountStatus';
import { InfluencerFraudAlert } from '@/components/influencer/InfluencerFraudAlert';

const influencerProfile = {
  name: 'Alex Creator',
  email: 'alex.creator@example.com',
  phone: '+1 (555) 123-4567',
  location: 'Los Angeles, CA',
  tier: 'Platinum',
  joinedAt: 'March 2024',
  totalEarnings: 45000,
  totalReach: 2500000,
  socials: {
    youtube: { handle: '@alexcreator', followers: '245K' },
    instagram: { handle: '@alex.creator', followers: '180K' },
    tiktok: { handle: '@alexcreator', followers: '320K' },
  }
};

const sessions = [
  { id: 1, device: 'MacBook Pro - Chrome', location: 'Los Angeles, CA', lastActive: 'Now', current: true },
  { id: 2, device: 'iPhone 15 - Safari', location: 'Los Angeles, CA', lastActive: '2 hours ago', current: false },
  { id: 3, device: 'iPad Pro - Safari', location: 'New York, NY', lastActive: '2 days ago', current: false },
];

export default function InfluencerProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleChangePassword = () => {
    toast.success('Password changed successfully!');
    setChangePasswordOpen(false);
  };

  const handleForgotPassword = () => {
    toast.success('Password reset link sent to your email!');
    setForgotPasswordOpen(false);
  };

  const handleLogoutSession = (sessionId: number) => {
    toast.success('Session terminated');
  };

  const handleLogoutAll = () => {
    toast.success('All other sessions logged out');
  };

  return (
    <RoleLayout role="influencer">
      <InfluencerContractModal />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
          <Badge variant="outline" className="bg-violet-500/20 text-violet-400 border-violet-500/30">
            <Star className="h-3 w-3 mr-1" />
            {influencerProfile.tier} Creator
          </Badge>
        </div>

        {/* Profile Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <UserCircle className="h-10 w-10 text-violet-500" />
                </div>
                <div>
                  <p className="text-xl font-bold">{influencerProfile.name}</p>
                  <p className="text-sm text-muted-foreground">Member since {influencerProfile.joinedAt}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{influencerProfile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{influencerProfile.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{influencerProfile.location}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">Edit Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Connected Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Youtube className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">{influencerProfile.socials.youtube.handle}</p>
                    <p className="text-xs text-muted-foreground">{influencerProfile.socials.youtube.followers} followers</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Instagram className="h-5 w-5 text-pink-500" />
                  <div>
                    <p className="font-medium">{influencerProfile.socials.instagram.handle}</p>
                    <p className="text-xs text-muted-foreground">{influencerProfile.socials.instagram.followers} followers</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded bg-black flex items-center justify-center">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                  <div>
                    <p className="font-medium">{influencerProfile.socials.tiktok.handle}</p>
                    <p className="text-xs text-muted-foreground">{influencerProfile.socials.tiktok.followers} followers</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>

              <Button variant="outline" className="w-full">Connect More Accounts</Button>
            </CardContent>
          </Card>
        </div>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Security
            </CardTitle>
            <CardDescription>Manage your password and authentication settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Change Password */}
              <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
                <DialogTrigger asChild>
                  <div className="p-4 rounded-lg border bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Key className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>Enter your current password and choose a new one</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <div className="relative">
                        <Input type={showPassword ? 'text' : 'password'} placeholder="Enter current password" />
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" placeholder="Confirm new password" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setChangePasswordOpen(false)}>Cancel</Button>
                    <Button onClick={handleChangePassword}>Update Password</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Forgot Password */}
              <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                <DialogTrigger asChild>
                  <div className="p-4 rounded-lg border bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">Forgot Password</p>
                        <p className="text-sm text-muted-foreground">Reset password via email</p>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>We'll send a reset link to your registered email</DialogDescription>
                  </DialogHeader>
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <p className="text-sm text-amber-400">
                        This will invalidate your current session and you'll need to log in again with the new password.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Registered Email</Label>
                    <Input type="email" value={influencerProfile.email} disabled />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setForgotPasswordOpen(false)}>Cancel</Button>
                    <Button onClick={handleForgotPassword}>Send Reset Link</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Separator />

            {/* Two-Factor Authentication */}
            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      {twoFactorEnabled ? 'Enabled via Email OTP' : 'Not enabled'}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={twoFactorEnabled} 
                  onCheckedChange={(checked) => {
                    setTwoFactorEnabled(checked);
                    toast.success(checked ? '2FA enabled' : '2FA disabled');
                  }} 
                />
              </div>
              {twoFactorEnabled && (
                <div className="mt-4 grid gap-2 md:grid-cols-3">
                  <div className="p-3 rounded-lg bg-background border">
                    <p className="text-sm font-medium">Email OTP</p>
                    <Badge variant="outline" className="mt-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-background border opacity-60">
                    <p className="text-sm font-medium">SMS OTP</p>
                    <Badge variant="outline" className="mt-1">Not Set</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-background border opacity-60">
                    <p className="text-sm font-medium">Authenticator App</p>
                    <Badge variant="outline" className="mt-1">Not Set</Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>Devices where you're currently logged in</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogoutAll}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout All Others
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className={`flex items-center justify-between p-4 rounded-lg ${
                  session.current ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-muted/50'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      session.current ? 'bg-emerald-500/20' : 'bg-muted'
                    }`}>
                      <Smartphone className={`h-5 w-5 ${session.current ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{session.device}</p>
                        {session.current && (
                          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            This Device
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.location} • {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="outline" size="sm" onClick={() => handleLogoutSession(session.id)}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic & Fraud Monitoring */}
        <InfluencerFraudAlert />

        {/* Account Status */}
        <InfluencerAccountStatus status="active" />

        {/* Support & Disputes */}
        <InfluencerSupportSection />

        {/* Security Notice */}
        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <p className="text-sm text-cyan-400">
            <strong>Security Audit:</strong> All password changes and 2FA modifications are logged. 
            If you notice any suspicious activity, contact support immediately.
          </p>
        </div>
      </div>
    </RoleLayout>
  );
}
