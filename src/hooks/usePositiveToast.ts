import { useToast } from '@/hooks/use-toast';
import { getPositiveResponse, logErrorInternally } from '@/lib/smartResponseEngine';

interface PositiveToastOptions {
  errorCode?: string | number;
  errorMessage?: string;
  module?: string;
  error?: Error | unknown;
}

export function usePositiveToast() {
  const { toast } = useToast();

  const showPositiveError = (options: PositiveToastOptions) => {
    const response = getPositiveResponse({
      code: options.errorCode,
      message: options.errorMessage,
      module: options.module,
    });

    // Log internally for Boss/Developer
    if (options.error) {
      logErrorInternally(options.error, {
        code: options.errorCode,
        message: options.errorMessage,
        module: options.module,
      });
    }

    // Show friendly toast to user
    toast({
      title: response.title,
      description: response.message,
      variant: 'default', // Never use 'destructive' - always positive!
    });

    return response;
  };

  const showSuccess = (title: string, message?: string) => {
    toast({
      title,
      description: message,
      variant: 'default',
    });
  };

  const showInfo = (title: string, message?: string) => {
    toast({
      title,
      description: message,
      variant: 'default',
    });
  };

  return {
    showPositiveError,
    showSuccess,
    showInfo,
  };
}
