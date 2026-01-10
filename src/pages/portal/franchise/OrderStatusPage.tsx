import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Code, 
  Cpu, 
  TestTube, 
  Rocket,
  AlertTriangle,
  Key,
  User,
  Lock,
  Globe,
  Download,
  Copy,
  Shield,
  Timer
} from 'lucide-react';
import { toast } from 'sonner';

interface ProjectCredentials {
  loginId: string;
  password: string;
  licenseKey: string;
  domain: string;
}

const progressStages = [
  { percent: 0, label: 'Project Created', icon: Package, description: 'Your order has been accepted' },
  { percent: 20, label: 'Core Setup Started', icon: Code, description: 'Setting up base architecture' },
  { percent: 40, label: 'Features Implemented', icon: Cpu, description: 'Building requested features' },
  { percent: 60, label: 'AI / API Integration', icon: Cpu, description: 'Integrating AI and APIs' },
  { percent: 80, label: 'Testing & Fixes', icon: TestTube, description: 'Quality assurance in progress' },
  { percent: 100, label: 'Project Delivered', icon: Rocket, description: 'Ready for deployment!' },
];

export default function OrderStatusPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const orderId = searchParams.get('orderId') || 'ORD-2024-0001';
  const projectId = searchParams.get('projectId') || 'PRJ-10001';
  const productName = searchParams.get('product') || 'School Management Pro';
  const planType = searchParams.get('plan') || 'monthly';
  const amount = parseInt(searchParams.get('amount') || '2999');

  // Simulate payment status - in real app this would come from backend
  const [paymentStatus, setPaymentStatus] = useState<'full' | 'partial' | 'pending'>('full');
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [credentials, setCredentials] = useState<ProjectCredentials | null>(null);
  const [paymentDeadline, setPaymentDeadline] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [showPaymentWarning, setShowPaymentWarning] = useState(false);

  // Simulate progress updates
  useEffect(() => {
    if (paymentStatus === 'full') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [paymentStatus]);

  // Update current stage based on progress
  useEffect(() => {
    const stage = progressStages.findIndex((s, i) => {
      const nextStage = progressStages[i + 1];
      return progress >= s.percent && (!nextStage || progress < nextStage.percent);
    });
    setCurrentStage(Math.max(0, stage));
  }, [progress]);

  // Generate credentials when project is complete
  useEffect(() => {
    if (progress === 100 && paymentStatus === 'full' && !credentials) {
      // Auto-generate credentials
      setCredentials({
        loginId: `admin@${productName.toLowerCase().replace(/\s+/g, '')}.com`,
        password: `SV${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        licenseKey: `LIC-${orderId}-${Date.now().toString(36).toUpperCase()}`,
        domain: `${productName.toLowerCase().replace(/\s+/g, '-')}.softwarevala.com`,
      });
      toast.success('🎉 Project delivered! Your credentials are ready.');
    }
  }, [progress, paymentStatus, credentials, orderId, productName]);

  // Payment deadline countdown for partial payments
  useEffect(() => {
    if (paymentStatus === 'partial' && !paymentDeadline) {
      const deadline = new Date();
      deadline.setHours(deadline.getHours() + 72);
      setPaymentDeadline(deadline);
      setShowPaymentWarning(true);
    }
  }, [paymentStatus, paymentDeadline]);

  // Update countdown timer
  useEffect(() => {
    if (paymentDeadline) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = paymentDeadline.getTime() - now.getTime();
        
        if (diff <= 0) {
          setTimeRemaining('EXPIRED');
          setPaymentStatus('pending');
          clearInterval(interval);
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [paymentDeadline]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const CurrentStageIcon = progressStages[currentStage]?.icon || Package;

  return (
    <RoleLayout role="franchise">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Payment Warning Banner - Non-dismissible for partial payments */}
        {paymentStatus === 'partial' && showPaymentWarning && (
          <Alert variant="destructive" className="border-red-500 bg-red-500/10">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-lg font-bold">Payment Incomplete!</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Complete your payment within the deadline to receive full access.</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-2xl font-mono font-bold text-red-500">
                  <Timer className="h-6 w-6" />
                  {timeRemaining}
                </div>
                <Button variant="destructive" size="sm" onClick={() => navigate('/marketplace/cart')}>
                  Complete Payment Now
                </Button>
              </div>
              <p className="text-xs mt-2">⚠️ Project will be frozen after deadline. No download or domain binding allowed.</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Frozen Project Warning */}
        {paymentStatus === 'pending' && (
          <Alert variant="destructive" className="border-red-600 bg-red-600/20">
            <Lock className="h-5 w-5" />
            <AlertTitle className="text-lg font-bold">PROJECT FROZEN - PAYMENT DEFAULTED</AlertTitle>
            <AlertDescription>
              <p>Your project access has been revoked due to payment default.</p>
              <p className="mt-2">Contact support to restore access.</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Header */}
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-emerald-500">Your Order is Accepted!</h1>
                <p className="text-muted-foreground mt-1">Developer assigned to your project</p>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Order ID: </span>
                  <span className="font-mono font-medium">{orderId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Project ID: </span>
                  <span className="font-mono font-medium">{projectId}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <Package className="h-6 w-6 text-blue-500 mb-2" />
              <p className="text-sm text-muted-foreground">Product</p>
              <p className="font-semibold">{productName}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Clock className="h-6 w-6 text-purple-500 mb-2" />
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="font-semibold capitalize">{planType}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Shield className="h-6 w-6 text-emerald-500 mb-2" />
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <Badge className={
                paymentStatus === 'full' ? 'bg-emerald-500' :
                paymentStatus === 'partial' ? 'bg-amber-500' : 'bg-red-500'
              }>
                {paymentStatus === 'full' ? 'Paid' : paymentStatus === 'partial' ? 'Partial' : 'Defaulted'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Progress Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CurrentStageIcon className="h-5 w-5 text-blue-500" />
              Live Project Progress
            </CardTitle>
            <CardDescription>Real-time status updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{progressStages[currentStage]?.description}</span>
                <span className="font-bold text-blue-500">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Stage Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {progressStages.map((stage, index) => {
                const StageIcon = stage.icon;
                const isComplete = progress >= stage.percent;
                const isCurrent = currentStage === index;
                
                return (
                  <div
                    key={stage.percent}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isComplete 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : isCurrent 
                          ? 'border-blue-500 bg-blue-500/10 animate-pulse'
                          : 'border-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <StageIcon className={`h-4 w-4 ${isComplete ? 'text-emerald-500' : isCurrent ? 'text-blue-500' : 'text-muted-foreground'}`} />
                      <span className={`text-sm font-medium ${isComplete ? 'text-emerald-500' : ''}`}>
                        {stage.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stage.percent}%</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Credentials Card - Only shown when complete and fully paid */}
        {credentials && paymentStatus === 'full' && (
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-blue-500" />
                Your Access Credentials
              </CardTitle>
              <CardDescription>Auto-generated upon project completion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" /> Login ID
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-background/50 px-3 py-2 rounded font-mono text-sm">
                      {credentials.loginId}
                    </code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(credentials.loginId, 'Login ID')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Password
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-background/50 px-3 py-2 rounded font-mono text-sm">
                      {credentials.password}
                    </code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(credentials.password, 'Password')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Key className="h-4 w-4" /> License Key
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-background/50 px-3 py-2 rounded font-mono text-sm truncate">
                      {credentials.licenseKey}
                    </code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(credentials.licenseKey, 'License Key')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Domain
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-background/50 px-3 py-2 rounded font-mono text-sm">
                      {credentials.domain}
                    </code>
                    <Button variant="ghost" size="sm" onClick={() => window.open(`https://${credentials.domain}`, '_blank')}>
                      <Rocket className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-muted">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  Domain-locked • Secure License • Auto-activated
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 gap-2">
                  <Download className="h-4 w-4" />
                  Download Package
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View-only notice for partial payments */}
        {paymentStatus === 'partial' && progress === 100 && (
          <Alert className="border-amber-500 bg-amber-500/10">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertTitle>Limited Access Mode</AlertTitle>
            <AlertDescription>
              Your project is complete but you have view-only access until full payment is received.
              No download or domain binding is available.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </RoleLayout>
  );
}
