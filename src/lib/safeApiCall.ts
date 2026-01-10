import { getPositiveResponse, logErrorInternally } from '@/lib/smartResponseEngine';
import { toast } from '@/hooks/use-toast';

interface SafeCallOptions {
  module?: string;
  showToast?: boolean;
  fallbackValue?: unknown;
}

/**
 * Wraps an async function with positive error handling.
 * Shows friendly messages to users while logging real errors internally.
 */
export async function safeApiCall<T>(
  fn: () => Promise<T>,
  options: SafeCallOptions = {}
): Promise<T | null> {
  const { module = 'api', showToast = true, fallbackValue = null } = options;
  
  try {
    return await fn();
  } catch (error) {
    // Log internally for Boss/Developer
    logErrorInternally(error, {
      module,
      message: error instanceof Error ? error.message : String(error),
    });

    // Get positive response
    const response = getPositiveResponse({
      message: error instanceof Error ? error.message : String(error),
      module,
    });

    // Show friendly toast to user
    if (showToast) {
      toast({
        title: response.title,
        description: response.message,
        variant: 'default', // Never destructive!
      });
    }

    return fallbackValue as T;
  }
}

/**
 * Wraps a sync function with positive error handling.
 */
export function safeSyncCall<T>(
  fn: () => T,
  options: SafeCallOptions = {}
): T | null {
  const { module = 'sync', showToast = true, fallbackValue = null } = options;
  
  try {
    return fn();
  } catch (error) {
    // Log internally for Boss/Developer
    logErrorInternally(error, {
      module,
      message: error instanceof Error ? error.message : String(error),
    });

    // Get positive response
    const response = getPositiveResponse({
      message: error instanceof Error ? error.message : String(error),
      module,
    });

    // Show friendly toast to user
    if (showToast) {
      toast({
        title: response.title,
        description: response.message,
        variant: 'default',
      });
    }

    return fallbackValue as T;
  }
}

/**
 * Converts any error to a positive user-friendly message.
 * Use this when you need to display an error message in the UI.
 */
export function getPositiveMessage(error: unknown, module?: string): string {
  const message = error instanceof Error ? error.message : String(error);
  const response = getPositiveResponse({ message, module });
  return response.message;
}

/**
 * Creates a wrapped version of an async function that handles errors positively.
 */
export function withPositiveErrors<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: SafeCallOptions = {}
): (...args: TArgs) => Promise<TReturn | null> {
  return async (...args: TArgs) => {
    return safeApiCall(() => fn(...args), options);
  };
}
