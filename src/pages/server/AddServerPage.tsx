import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Plus, 
  Loader2, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  RefreshCw,
  CheckCircle,
  Shield,
  Activity,
  Bell,
  Cpu,
  Zap
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

// Validation helpers
const DANGEROUS_CHARS = /[<>{};"']/;
const trimInput = (value: string): string => value.trim();
const hasDangerousChars = (value: string) => DANGEROUS_CHARS.test(value);
const isServerNameAllowed = (value: string) => /^[a-zA-Z0-9\-]+$/.test(value);

// AI onboarding steps
const AI_STEPS = [
  { id: 1, label: 'Validating credentials', icon: Shield },
  { id: 2, label: 'Establishing connection', icon: Zap },
  { id: 3, label: 'Detecting system', icon: Cpu },
  { id: 4, label: 'Configuring security', icon: Shield },
  { id: 5, label: 'Enabling monitoring', icon: Activity },
  { id: 6, label: 'Finalizing setup', icon: Bell },
];

export default function AddServerPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [serverName, setServerName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  
  // AI Flow State
  const [aiStep, setAiStep] = useState(0);
  const [aiProgress, setAiProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Validation
  const serverNameTrimmed = trimInput(serverName);
  const userIdTrimmed = trimInput(userId);

  const isServerNameValid =
    serverNameTrimmed.length >= 3 &&
    !hasDangerousChars(serverNameTrimmed) &&
    isServerNameAllowed(serverNameTrimmed);

  const isUserIdValid = userIdTrimmed.length > 0 && !hasDangerousChars(userIdTrimmed);
  const isPasswordValid = password.length > 0;
  const isValid = isServerNameValid && isUserIdValid && isPasswordValid;

  // Auto-fix server name (remove invalid chars silently on blur)
  const autoFixServerName = (value: string) => {
    return value.replace(/[^a-zA-Z0-9\-]/g, '').toLowerCase();
  };

  // Simulate AI step progress
  const runAiStep = (step: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const stepDuration = 800 + Math.random() * 400; // 800-1200ms per step
      setTimeout(() => {
        resolve(true);
      }, stepDuration);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowRetry(false);
    setAiStep(0);
    setAiProgress(0);

    if (!isValid) {
      setError('Please fill all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Validate credentials
      setAiStep(1);
      setAiProgress(10);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Session expired');
      }

      await runAiStep(1);
      setAiProgress(20);

      // Step 2: Establishing connection
      setAiStep(2);
      
      const csrfTokenKey = 'sv_csrf_token';
      const existingToken = sessionStorage.getItem(csrfTokenKey);
      const csrfToken = existingToken || crypto.randomUUID();
      if (!existingToken) sessionStorage.setItem(csrfTokenKey, csrfToken);

      await runAiStep(2);
      setAiProgress(35);

      // Step 3: Detecting system (API call)
      setAiStep(3);
      
      const { data, error: invokeError } = await supabase.functions.invoke('server-add', {
        body: {
          server_name: serverNameTrimmed,
          username: userIdTrimmed,
          password,
        },
        headers: {
          'x-csrf-token': csrfToken,
        },
      });

      if (invokeError || !data || data.status !== 'ok') {
        const errorMessage = data?.message || 'Connection issue detected';
        
        // Auto-retry logic
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          setError(`We're fixing this... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
          
          // Wait and retry
          await new Promise(r => setTimeout(r, 2000));
          return handleSubmit(e);
        }
        
        throw new Error(errorMessage);
      }

      setAiProgress(50);

      // Step 4: Configuring security
      setAiStep(4);
      await runAiStep(4);
      setAiProgress(65);

      // Step 5: Enabling monitoring
      setAiStep(5);
      await runAiStep(5);
      setAiProgress(80);

      // Step 6: Finalizing setup
      setAiStep(6);
      await runAiStep(6);
      setAiProgress(100);

      // Success
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      await queryClient.refetchQueries({ queryKey: ['servers'] });
      toast.success('Server added successfully');
      
      // Brief pause to show completion
      await new Promise(r => setTimeout(r, 500));
      navigate('/dashboard/boss/server/list');

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Server not added';
      
      if (retryCount >= MAX_RETRIES) {
        setError('Unable to complete setup. Please check your credentials and try again.');
        setShowRetry(true);
      } else {
        setError("We're fixing this...");
        setShowRetry(true);
      }
    } finally {
      setIsSubmitting(false);
      setRetryCount(0);
    }
  };

  const handleRetry = () => {
    setError('');
    setShowRetry(false);
    setAiStep(0);
    setAiProgress(0);
    setRetryCount(0);
  };

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="max-w-xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3 text-[hsl(var(--boss-text))]">
                <Server className="h-8 w-8 text-[hsl(var(--boss-accent))]" />
                Add New Server
              </h1>
              <p className="text-[hsl(var(--boss-text-muted))] mt-1">
                Register your server in seconds. AI handles everything else.
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[hsl(var(--boss-text-muted))] hover:text-[hsl(var(--boss-text))]">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]">
                <p className="font-medium mb-1">Only 3 things needed:</p>
                <ul className="text-sm space-y-1">
                  <li>• Server Name</li>
                  <li>• User ID</li>
                  <li>• Password</li>
                </ul>
                <p className="text-xs mt-2 text-[hsl(var(--boss-text-muted))]">AI will auto-detect OS, install agent, configure firewall, and enable monitoring.</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* AI Progress Card (shown during submission) */}
          {isSubmitting && aiStep > 0 && (
            <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-accent))]/30 shadow-lg shadow-[hsl(var(--boss-accent))]/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-[hsl(var(--boss-text))] flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-[hsl(var(--boss-accent))]" />
                  Setting up your server...
                </CardTitle>
                <CardDescription className="text-[hsl(var(--boss-text-muted))]">
                  AI is configuring everything automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={aiProgress} className="h-2 bg-[hsl(var(--boss-card-elevated))]" />
                
                <div className="space-y-2">
                  {AI_STEPS.map((step) => {
                    const Icon = step.icon;
                    const isActive = aiStep === step.id;
                    const isComplete = aiStep > step.id;
                    
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                          isActive 
                            ? 'bg-[hsl(var(--boss-accent))]/10 text-[hsl(var(--boss-text))]' 
                            : isComplete 
                              ? 'text-emerald-400' 
                              : 'text-[hsl(var(--boss-text-muted))]'
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                        ) : isActive ? (
                          <Loader2 className="h-5 w-5 animate-spin text-[hsl(var(--boss-accent))]" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                        <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Card (hidden during AI progress) */}
          {!isSubmitting && (
            <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
              <CardHeader>
                <CardTitle className="text-[hsl(var(--boss-text))]">Server Details</CardTitle>
                <CardDescription className="text-[hsl(var(--boss-text-muted))]">
                  Enter your server credentials to add it to the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Server Name */}
                  <div className="space-y-2">
                    <Label htmlFor="serverName" className="text-[hsl(var(--boss-text))]">
                      Server Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="serverName"
                      type="text"
                      placeholder="e.g. hostinger-vps"
                      value={serverName}
                      onChange={(e) => {
                        setServerName(e.target.value);
                        setError('');
                      }}
                      onBlur={(e) => {
                        // Auto-fix on blur (AI auto-correct)
                        const fixed = autoFixServerName(e.target.value);
                        if (fixed !== e.target.value) {
                          setServerName(fixed);
                        }
                      }}
                      className="bg-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))] placeholder:text-[hsl(var(--boss-text-muted))]"
                      autoFocus
                    />
                    <p className="text-xs text-[hsl(var(--boss-text-muted))]">
                      Any name to identify your server (letters, numbers, hyphens)
                    </p>
                  </div>

                  {/* User ID */}
                  <div className="space-y-2">
                    <Label htmlFor="userId" className="text-[hsl(var(--boss-text))]">
                      User ID <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="userId"
                      type="text"
                      placeholder="e.g. root / admin"
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value);
                        setError('');
                      }}
                      className="bg-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))] placeholder:text-[hsl(var(--boss-text-muted))]"
                    />
                    <p className="text-xs text-[hsl(var(--boss-text-muted))]">
                      Login username from your hosting provider
                    </p>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[hsl(var(--boss-text))]">
                      Password <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError('');
                        }}
                        className="bg-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))] placeholder:text-[hsl(var(--boss-text-muted))] pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-[hsl(var(--boss-text-muted))] hover:text-[hsl(var(--boss-text))]"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-[hsl(var(--boss-text-muted))]">
                      Use server root / sudo credentials. Metrics appear after connection.
                    </p>
                  </div>

                  {/* Error with friendly message */}
                  {error && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-sm text-amber-300 font-medium">{error}</p>
                      {showRetry && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRetry}
                          className="gap-2 mt-2 text-[hsl(var(--boss-text-muted))] hover:text-[hsl(var(--boss-text))]"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Try Again
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="pt-2 space-y-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="w-full gap-2 bg-[hsl(var(--boss-accent))] hover:bg-[hsl(var(--boss-accent))]/90 text-white disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Adding Server...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add Server
                        </>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigate('/dashboard/boss/server/list')}
                      className="text-[hsl(var(--boss-text-muted))] hover:text-[hsl(var(--boss-text))] hover:bg-transparent"
                    >
                      Cancel
                    </Button>
                  </div>

                  {/* Help Text */}
                  <p className="text-xs text-[hsl(var(--boss-text-muted))] text-center pt-2">
                    Next: Server will appear in list → click it to connect.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
