// Smart Response Engine - Converts technical errors to positive, user-friendly messages

export type ErrorCategory = 
  | 'api_fail'
  | 'permission'
  | 'server_load'
  | 'invalid_input'
  | 'session_expired'
  | 'ai_limit'
  | 'network'
  | 'not_found'
  | 'timeout'
  | 'validation'
  | 'unknown';

export type UserRole = 'boss' | 'manager' | 'developer' | 'support' | 'user';

export type ActionType = 'retry' | 'continue' | 'support' | 'wait' | 'refresh' | 'login';

interface SmartResponse {
  title: string;
  message: string;
  action: ActionType;
  actionLabel: string;
  icon: 'info' | 'shield' | 'clock' | 'check' | 'sparkles' | 'heart';
  severity: 'low' | 'medium' | 'high';
}

interface ErrorInput {
  code?: string | number;
  message?: string;
  module?: string;
  userRole?: UserRole;
}

// Internal error log structure (for background logging)
interface InternalErrorLog {
  timestamp: string;
  errorCode: string;
  originalMessage: string;
  stackTrace?: string;
  module: string;
  userRole: string;
  userAction?: string;
  apiResponse?: unknown;
}

// Categorize error based on code or message
function categorizeError(input: ErrorInput): ErrorCategory {
  const { code, message = '' } = input;
  const lowerMessage = message.toLowerCase();
  
  // Check by error code
  if (code) {
    const numCode = typeof code === 'string' ? parseInt(code) : code;
    if (numCode === 401 || numCode === 403) return 'permission';
    if (numCode === 404) return 'not_found';
    if (numCode === 408 || numCode === 504) return 'timeout';
    if (numCode === 422 || numCode === 400) return 'validation';
    if (numCode === 429) return 'ai_limit';
    if (numCode >= 500) return 'server_load';
  }
  
  // Check by message content
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('connection')) {
    return 'network';
  }
  if (lowerMessage.includes('permission') || lowerMessage.includes('unauthorized') || lowerMessage.includes('forbidden')) {
    return 'permission';
  }
  if (lowerMessage.includes('session') || lowerMessage.includes('token') || lowerMessage.includes('expired')) {
    return 'session_expired';
  }
  if (lowerMessage.includes('timeout')) {
    return 'timeout';
  }
  if (lowerMessage.includes('validation') || lowerMessage.includes('invalid') || lowerMessage.includes('required')) {
    return 'invalid_input';
  }
  if (lowerMessage.includes('rate') || lowerMessage.includes('limit') || lowerMessage.includes('quota')) {
    return 'ai_limit';
  }
  if (lowerMessage.includes('not found') || lowerMessage.includes('404')) {
    return 'not_found';
  }
  if (lowerMessage.includes('server') || lowerMessage.includes('500') || lowerMessage.includes('internal')) {
    return 'server_load';
  }
  
  return 'api_fail';
}

// Response mapping for each error category
const responseMap: Record<ErrorCategory, SmartResponse> = {
  api_fail: {
    title: "Just a moment",
    message: "Temporary pause detected. We're reconnecting automatically. Please wait a moment.",
    action: 'retry',
    actionLabel: 'Try Again',
    icon: 'clock',
    severity: 'low'
  },
  permission: {
    title: "Access Required",
    message: "This action needs approval. We've notified the admin for quick access.",
    action: 'continue',
    actionLabel: 'Continue',
    icon: 'shield',
    severity: 'medium'
  },
  server_load: {
    title: "Optimizing",
    message: "System is optimizing performance for you. Please retry in a few seconds.",
    action: 'retry',
    actionLabel: 'Retry',
    icon: 'sparkles',
    severity: 'low'
  },
  invalid_input: {
    title: "Quick Adjustment",
    message: "Let's adjust this slightly for best results. Please check highlighted fields.",
    action: 'continue',
    actionLabel: 'Got It',
    icon: 'info',
    severity: 'low'
  },
  session_expired: {
    title: "Session Refreshed",
    message: "For your security, we refreshed your session. Please continue.",
    action: 'login',
    actionLabel: 'Continue',
    icon: 'shield',
    severity: 'medium'
  },
  ai_limit: {
    title: "Processing Queued",
    message: "Smart processing is queued. You'll be notified once it's ready.",
    action: 'wait',
    actionLabel: 'Okay',
    icon: 'sparkles',
    severity: 'low'
  },
  network: {
    title: "Reconnecting",
    message: "We're restoring your connection. This usually takes just a moment.",
    action: 'retry',
    actionLabel: 'Reconnect',
    icon: 'clock',
    severity: 'medium'
  },
  not_found: {
    title: "Finding Your Content",
    message: "We're locating the requested information. It may have been moved or updated.",
    action: 'continue',
    actionLabel: 'Go Back',
    icon: 'info',
    severity: 'low'
  },
  timeout: {
    title: "Taking a Bit Longer",
    message: "This is taking longer than expected. We're working on it.",
    action: 'retry',
    actionLabel: 'Try Again',
    icon: 'clock',
    severity: 'low'
  },
  validation: {
    title: "Almost There",
    message: "A few details need attention. Please review the highlighted items.",
    action: 'continue',
    actionLabel: 'Review',
    icon: 'check',
    severity: 'low'
  },
  unknown: {
    title: "We're On It",
    message: "Something unexpected happened. Our team has been notified automatically.",
    action: 'support',
    actionLabel: 'Contact Support',
    icon: 'heart',
    severity: 'medium'
  }
};

// Main function to get positive response
export function getPositiveResponse(input: ErrorInput): SmartResponse {
  const category = categorizeError(input);
  return responseMap[category];
}

// Log error internally (for Boss/Developer access only)
export function logErrorInternally(
  error: Error | unknown,
  input: ErrorInput
): InternalErrorLog {
  const errorLog: InternalErrorLog = {
    timestamp: new Date().toISOString(),
    errorCode: String(input.code || 'UNKNOWN'),
    originalMessage: error instanceof Error ? error.message : String(error),
    stackTrace: error instanceof Error ? error.stack : undefined,
    module: input.module || 'unknown',
    userRole: input.userRole || 'user',
    userAction: undefined,
    apiResponse: undefined
  };
  
  // Log to console in development (Boss/Developer access)
  if (process.env.NODE_ENV === 'development') {
    console.group('🔒 Internal Error Log (Boss/Dev Only)');
    console.log('Timestamp:', errorLog.timestamp);
    console.log('Module:', errorLog.module);
    console.log('Original Error:', errorLog.originalMessage);
    if (errorLog.stackTrace) {
      console.log('Stack:', errorLog.stackTrace);
    }
    console.groupEnd();
  }
  
  return errorLog;
}

// Get icon component name for the response
export function getResponseIcon(icon: SmartResponse['icon']): string {
  const iconMap: Record<SmartResponse['icon'], string> = {
    info: 'Info',
    shield: 'Shield',
    clock: 'Clock',
    check: 'CheckCircle',
    sparkles: 'Sparkles',
    heart: 'Heart'
  };
  return iconMap[icon];
}

// Get soft color class for severity (no red!)
export function getSeverityColor(severity: SmartResponse['severity']): {
  bg: string;
  border: string;
  icon: string;
} {
  const colorMap: Record<SmartResponse['severity'], { bg: string; border: string; icon: string }> = {
    low: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-500'
    },
    medium: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800',
      icon: 'text-amber-500'
    },
    high: {
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'text-purple-500'
    }
  };
  return colorMap[severity];
}
