import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  ArrowLeft, 
  MessageCircle, 
  RefreshCw, 
  Search, 
  AlertTriangle, 
  Shield, 
  Zap,
  FileQuestion,
  Loader2,
  Bug
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type FallbackType = 'not-found' | 'no-data' | 'loading' | 'error' | 'permission' | 'api-timeout';

interface SmartFallbackProps {
  type?: FallbackType;
  title?: string;
  subtitle?: string;
  dashboardPath?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  showSupport?: boolean;
  className?: string;
}

const fallbackConfig: Record<FallbackType, { icon: typeof Home; defaultTitle: string; defaultSubtitle: string }> = {
  'not-found': {
    icon: FileQuestion,
    defaultTitle: 'Finding Your Way',
    defaultSubtitle: 'This page is unavailable, moved, or awaiting data. You can safely continue using the system.',
  },
  'no-data': {
    icon: Search,
    defaultTitle: 'No Data Available',
    defaultSubtitle: 'There is no data to display at the moment. Check back later or try refreshing.',
  },
  'loading': {
    icon: Loader2,
    defaultTitle: 'Loading...',
    defaultSubtitle: 'Please wait while we prepare your content. This should only take a moment.',
  },
  'error': {
    icon: AlertTriangle,
    defaultTitle: 'Something Went Wrong',
    defaultSubtitle: 'We encountered an issue. Our system is already working on it. Please try again.',
  },
  'permission': {
    icon: Shield,
    defaultTitle: 'Access Restricted',
    defaultSubtitle: 'You don\'t have permission to view this page. Contact your administrator if needed.',
  },
  'api-timeout': {
    icon: Zap,
    defaultTitle: 'Connection Timeout',
    defaultSubtitle: 'The server is taking longer than expected. Please retry or check your connection.',
  },
};

export function SmartFallback({
  type = 'not-found',
  title,
  subtitle,
  dashboardPath = '/dashboard/boss',
  showRetry = true,
  onRetry,
  showSupport = true,
  className,
}: SmartFallbackProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const config = fallbackConfig[type];
  const IconComponent = config.icon;
  const displayTitle = title || config.defaultTitle;
  const displaySubtitle = subtitle || config.defaultSubtitle;

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(dashboardPath);
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleSupport = () => {
    // Open VALA AI Support Bot - could be integrated with a chat system
    console.log('Support requested for:', location.pathname);
    // For now, navigate to support or show a toast
    navigate('/dashboard/boss/support');
  };

  const handleReportIssue = () => {
    // Auto-attach logs and report
    const issueData = {
      path: location.pathname,
      timestamp: new Date().toISOString(),
      type,
      userAgent: navigator.userAgent,
    };
    console.log('Issue reported:', issueData);
    // Could integrate with a bug reporting system
  };

  return (
    <div className={cn('flex items-center justify-center min-h-[60vh] p-6', className)}>
      <Card className="w-full max-w-lg bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-border))] shadow-[0_18px_60px_-24px_hsl(0_0%_0%/0.55)]">
        <CardContent className="pt-8 pb-8 px-8 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center',
              'bg-gradient-to-br from-[hsl(var(--luxury-active-bg))] to-[hsl(var(--luxury-card-bg))]',
              'border border-[hsl(var(--luxury-border))]',
              type === 'loading' && 'animate-pulse'
            )}>
              <IconComponent 
                className={cn(
                  'w-10 h-10 text-[hsl(var(--luxury-icon-active))]',
                  type === 'loading' && 'animate-spin'
                )} 
              />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {displayTitle}
          </h2>

          {/* Subtitle */}
          <p className="text-[hsl(var(--luxury-muted-text))] text-base leading-relaxed max-w-md mx-auto">
            {displaySubtitle}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            {/* Go to Dashboard - Primary */}
            <Button
              onClick={() => navigate(dashboardPath)}
              className="bg-[hsl(var(--luxury-icon-active))] hover:bg-[hsl(var(--luxury-icon-active))]/90 text-black font-medium px-6"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>

            {/* Go Back - Secondary */}
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="border-[hsl(var(--luxury-border))] text-foreground hover:bg-[hsl(var(--luxury-active-bg))]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Smart Context Actions */}
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {/* Retry Load */}
            {showRetry && (type === 'error' || type === 'api-timeout' || type === 'no-data') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetry}
                className="text-[hsl(var(--luxury-muted-text))] hover:text-foreground hover:bg-[hsl(var(--luxury-active-bg))]"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Retry
              </Button>
            )}

            {/* Report Issue */}
            {(type === 'error' || type === 'not-found') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReportIssue}
                className="text-[hsl(var(--luxury-muted-text))] hover:text-foreground hover:bg-[hsl(var(--luxury-active-bg))]"
              >
                <Bug className="w-3.5 h-3.5 mr-1.5" />
                Report Issue
              </Button>
            )}

            {/* Support */}
            {showSupport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSupport}
                className="text-[hsl(var(--luxury-muted-text))] hover:text-foreground hover:bg-[hsl(var(--luxury-active-bg))]"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                Support
              </Button>
            )}
          </div>

          {/* Security Note - Hidden from users */}
          {/* Logs are stored internally, no technical errors exposed */}
        </CardContent>
      </Card>
    </div>
  );
}

export default SmartFallback;
