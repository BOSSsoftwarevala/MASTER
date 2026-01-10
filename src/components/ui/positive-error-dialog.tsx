import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  Shield, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  Heart,
  RefreshCw,
  ArrowRight,
  Headphones,
  Hourglass,
  LogIn
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getPositiveResponse, 
  getSeverityColor,
  type ErrorCategory,
  type ActionType
} from '@/lib/smartResponseEngine';

interface PositiveErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorCode?: string | number;
  errorMessage?: string;
  module?: string;
  onAction?: (action: ActionType) => void;
}

const iconComponents = {
  info: Info,
  shield: Shield,
  clock: Clock,
  check: CheckCircle,
  sparkles: Sparkles,
  heart: Heart,
};

const actionIcons = {
  retry: RefreshCw,
  continue: ArrowRight,
  support: Headphones,
  wait: Hourglass,
  refresh: RefreshCw,
  login: LogIn,
};

export function PositiveErrorDialog({
  open,
  onOpenChange,
  errorCode,
  errorMessage,
  module,
  onAction,
}: PositiveErrorDialogProps) {
  const response = getPositiveResponse({
    code: errorCode,
    message: errorMessage,
    module,
  });

  const colors = getSeverityColor(response.severity);
  const IconComponent = iconComponents[response.icon];
  const ActionIcon = actionIcons[response.action];

  const handleAction = () => {
    if (onAction) {
      onAction(response.action);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-md rounded-2xl border-2",
        colors.bg,
        colors.border
      )}>
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm">
            <IconComponent className={cn("h-8 w-8", colors.icon)} />
          </div>
          <DialogTitle className="text-xl font-semibold">
            {response.title}
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed pt-2">
            {response.message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center pt-4">
          <Button 
            onClick={handleAction}
            className="min-w-[140px] rounded-full gap-2"
            size="lg"
          >
            {response.actionLabel}
            <ActionIcon className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook for using the positive error dialog
export function usePositiveError() {
  const [state, setState] = React.useState<{
    open: boolean;
    errorCode?: string | number;
    errorMessage?: string;
    module?: string;
    onAction?: (action: ActionType) => void;
  }>({
    open: false,
  });

  const showError = React.useCallback((options: {
    errorCode?: string | number;
    errorMessage?: string;
    module?: string;
    onAction?: (action: ActionType) => void;
  }) => {
    setState({
      open: true,
      ...options,
    });
  }, []);

  const hideError = React.useCallback(() => {
    setState(prev => ({ ...prev, open: false }));
  }, []);

  const PositiveErrorDialogComponent = React.useCallback(() => (
    <PositiveErrorDialog
      open={state.open}
      onOpenChange={(open) => setState(prev => ({ ...prev, open }))}
      errorCode={state.errorCode}
      errorMessage={state.errorMessage}
      module={state.module}
      onAction={state.onAction}
    />
  ), [state]);

  return {
    showError,
    hideError,
    PositiveErrorDialog: PositiveErrorDialogComponent,
  };
}
