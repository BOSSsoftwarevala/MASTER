import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Headphones, 
  Shield, 
  Video, 
  Clock, 
  Eye,
  EyeOff,
  Monitor,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useUserRoles } from '@/hooks/useUserRoles';

type SessionStatus = 'idle' | 'requesting' | 'pending' | 'active' | 'ended';

export function AssistButton() {
  const { isAdmin, isManager } = useUserRoles();
  const [open, setOpen] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({
    sessionId: '',
    startTime: '',
    duration: 0,
  });

  const isEmployee = isAdmin() || isManager();

  const handleRequestAssist = async () => {
    if (!agreedToTerms) return;
    
    setSessionStatus('requesting');
    
    // Simulate approval process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSessionStatus('pending');
    
    // Simulate agent joining
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setSessionInfo({
      sessionId: `ASSIST-${Date.now().toString(36).toUpperCase()}`,
      startTime: new Date().toLocaleTimeString(),
      duration: 0,
    });
    setSessionStatus('active');
    
    // Start duration counter
    const interval = setInterval(() => {
      setSessionInfo(prev => ({ ...prev, duration: prev.duration + 1 }));
    }, 1000);
    
    // Store interval for cleanup
    (window as any).assistInterval = interval;
  };

  const handleEndSession = () => {
    setShowEndConfirm(true);
  };

  const confirmEndSession = () => {
    clearInterval((window as any).assistInterval);
    setSessionStatus('ended');
    setShowEndConfirm(false);
  };

  const resetSession = () => {
    setSessionStatus('idle');
    setAgreedToTerms(false);
    setSessionInfo({ sessionId: '', startTime: '', duration: 0 });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (!o && sessionStatus === 'ended') resetSession(); }}>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Headphones className="h-4 w-4" />
                {sessionStatus === 'active' && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                )}
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>Remote Assist</TooltipContent>
        </Tooltip>

        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-primary" />
              Remote Assist
            </SheetTitle>
            <SheetDescription>
              Secure screen sharing with our support team
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Idle State - Request Assist */}
            {sessionStatus === 'idle' && (
              <>
                {/* Security Features */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Security Features
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>Sensitive data is automatically masked</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span>Session is recorded for audit</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Time-limited access only</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                      <span>No persistent access granted</span>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-3 p-4 rounded-lg border bg-muted/50">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I understand that this session will be recorded and my screen will be shared 
                    with a support agent. Sensitive information will be masked automatically.
                  </Label>
                </div>

                {/* Request Button */}
                <Button 
                  className="w-full" 
                  onClick={handleRequestAssist}
                  disabled={!agreedToTerms}
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  Request Assist Session
                </Button>
              </>
            )}

            {/* Requesting State */}
            {sessionStatus === 'requesting' && (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                <h3 className="font-semibold mt-4">Requesting Approval</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Your request is being processed...
                </p>
              </div>
            )}

            {/* Pending State - Waiting for Agent */}
            {sessionStatus === 'pending' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Headphones className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="font-semibold mt-4">Waiting for Agent</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  An agent will join your session shortly...
                </p>
                <Badge variant="outline" className="mt-4">
                  Estimated wait: 1-2 minutes
                </Badge>
              </div>
            )}

            {/* Active Session */}
            {sessionStatus === 'active' && (
              <>
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="font-semibold text-emerald-500">Session Active</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Session ID:</span>
                      <span className="font-mono">{sessionInfo.sessionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Started:</span>
                      <span>{sessionInfo.startTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-mono">{formatDuration(sessionInfo.duration)}</span>
                    </div>
                  </div>
                </div>

                {/* Screen Preview */}
                <div className="p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="h-4 w-4" />
                    <span className="font-medium">Screen Sharing Active</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The agent can see your screen. Passwords and sensitive data are masked.
                  </p>
                </div>

                {/* End Session Button */}
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleEndSession}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  End Session
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Manual disconnect is disabled during active sessions for security
                </p>
              </>
            )}

            {/* Session Ended */}
            {sessionStatus === 'ended' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mt-4">Session Completed</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Thank you for using Remote Assist. A recording has been saved for audit purposes.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
                  <div className="flex justify-between">
                    <span>Total Duration:</span>
                    <span className="font-mono">{formatDuration(sessionInfo.duration)}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => { setOpen(false); resetSession(); }}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* End Session Confirmation */}
      <AlertDialog open={showEndConfirm} onOpenChange={setShowEndConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              End Assist Session?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end this remote assist session? 
              The agent will be disconnected and a session log will be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Session</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEndSession}>
              End Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
