import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, RefreshCw, Home, Headphones } from 'lucide-react';
import { logErrorInternally, getPositiveResponse, getSeverityColor } from '@/lib/smartResponseEngine';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  module?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class PositiveErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log internally for Boss/Developer access
    logErrorInternally(error, {
      module: this.props.module || 'unknown',
      message: error.message,
    });
    
    // Additional internal logging
    console.group('🔒 Error Boundary Caught (Internal)');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.groupEnd();
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  private handleSupport = () => {
    // Could open support chat or navigate to support page
    window.location.href = '/dashboard/support/tickets';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const response = getPositiveResponse({
        message: this.state.error?.message,
        module: this.props.module,
      });
      const colors = getSeverityColor(response.severity);

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Card className={cn(
            "max-w-md w-full rounded-2xl border-2 shadow-lg",
            colors.bg,
            colors.border
          )}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-md">
                <Sparkles className={cn("h-10 w-10", colors.icon)} />
              </div>
              <CardTitle className="text-2xl font-semibold">
                We're On It
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground text-base leading-relaxed">
                Something unexpected happened, but don't worry – our team has been 
                automatically notified. You can try again or continue to another section.
              </p>
              <div className="mt-4 p-3 rounded-lg bg-background/50 text-sm text-muted-foreground">
                <p>Assistance is already working on this.</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button 
                onClick={this.handleRetry}
                className="w-full rounded-full gap-2"
                size="lg"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <div className="flex gap-3 w-full">
                <Button 
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex-1 rounded-full gap-2"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={this.handleSupport}
                  className="flex-1 rounded-full gap-2"
                >
                  <Headphones className="h-4 w-4" />
                  Support
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
