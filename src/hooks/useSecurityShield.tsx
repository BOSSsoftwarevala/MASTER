import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SecurityConfig {
  disableDevTools: boolean;
  disableRightClick: boolean;
  disableTextSelection: boolean;
  disableKeyboardShortcuts: boolean;
  detectDevTools: boolean;
  autoLogoutOnTamper: boolean;
  blurOnDevTools: boolean;
}

const DEFAULT_CONFIG: SecurityConfig = {
  disableDevTools: true,
  disableRightClick: true,
  disableTextSelection: true,
  disableKeyboardShortcuts: true,
  detectDevTools: true,
  autoLogoutOnTamper: true,
  blurOnDevTools: true,
};

// Public routes where security shield should be disabled
const PUBLIC_ROUTES = [
  '/auth',
  '/',
  '/marketplace',
];

// Check if current path is a public route
const isPublicRoutePath = (pathname: string) => {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith('/marketplace'));
};

// DevTools detection methods - made less aggressive to avoid false positives
function detectDevToolsOpen(): boolean {
  // Only check in production mode to avoid false positives in development/preview
  if (import.meta.env.DEV) return false;
  
  const threshold = 200; // Increased threshold to reduce false positives
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;
  
  // Check for Firebug
  // @ts-ignore
  if (window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) {
    return true;
  }
  
  return widthThreshold || heightThreshold;
}

export function useSecurityShield(config: Partial<SecurityConfig> = {}) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const devToolsDetectedRef = useRef(false);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const originalBodyStylesRef = useRef<{ filter: string; pointerEvents: string } | null>(null);

  // Check if on public route
  const isPublicRoute = isPublicRoutePath(location.pathname);

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Log security event to database
  const logSecurityEvent = useCallback(async (eventType: string, details: string) => {
    if (isPublicRoute) return; // Don't log on public routes
    try {
      await supabase.from('audit_logs').insert({
        action: eventType,
        details,
        module: 'security_shield',
        severity: 'high',
        user_email: user?.email || 'unknown',
        user_id: user?.id,
        user_role: 'user',
      });
    } catch (error) {
      // Silent fail - don't expose security logging
    }
  }, [user, isPublicRoute]);

  // Handle security breach
  const handleSecurityBreach = useCallback(async (reason: string) => {
    if (isPublicRoute) return; // Don't trigger on public routes
    if (devToolsDetectedRef.current) return;
    devToolsDetectedRef.current = true;

    await logSecurityEvent('SECURITY_BREACH', reason);

    if (finalConfig.blurOnDevTools) {
      if (!originalBodyStylesRef.current) {
        originalBodyStylesRef.current = {
          filter: document.body.style.filter,
          pointerEvents: document.body.style.pointerEvents,
        };
      }
      document.body.style.filter = 'blur(20px)';
      document.body.style.pointerEvents = 'none';
    }

    if (finalConfig.autoLogoutOnTamper && user) {
      await signOut();
      navigate('/auth');
    }
  }, [finalConfig, logSecurityEvent, signOut, navigate, user, isPublicRoute]);

  // Clear any blur effect when on public routes
  useEffect(() => {
    if (!isPublicRoute) return;

    if (originalBodyStylesRef.current) {
      document.body.style.filter = originalBodyStylesRef.current.filter;
      document.body.style.pointerEvents = originalBodyStylesRef.current.pointerEvents;
      originalBodyStylesRef.current = null;
    } else {
      document.body.style.filter = '';
      document.body.style.pointerEvents = '';
    }

    devToolsDetectedRef.current = false;
  }, [isPublicRoute]);

  // Always restore body styles when this hook unmounts (prevents blurred /auth after redirects)
  useEffect(() => {
    return () => {
      if (originalBodyStylesRef.current) {
        document.body.style.filter = originalBodyStylesRef.current.filter;
        document.body.style.pointerEvents = originalBodyStylesRef.current.pointerEvents;
        originalBodyStylesRef.current = null;
      } else {
        document.body.style.filter = '';
        document.body.style.pointerEvents = '';
      }

      devToolsDetectedRef.current = false;
    };
  }, []);


  // Disable right-click (only on protected routes)
  useEffect(() => {
    if (isPublicRoute || !finalConfig.disableRightClick) return;
    
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logSecurityEvent('RIGHT_CLICK_BLOCKED', 'User attempted right-click');
      return false;
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [finalConfig.disableRightClick, logSecurityEvent, isPublicRoute]);

  // Disable keyboard shortcuts (DevTools, View Source, etc.) - only on protected routes
  useEffect(() => {
    if (isPublicRoute || !finalConfig.disableKeyboardShortcuts) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        logSecurityEvent('DEVTOOLS_SHORTCUT_BLOCKED', 'F12 key blocked');
        return false;
      }
      
      // Ctrl+Shift+I/J/C (DevTools)
      if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault();
        logSecurityEvent('DEVTOOLS_SHORTCUT_BLOCKED', `Ctrl+Shift+${e.key} blocked`);
        return false;
      }
      
      // Cmd+Option+I/J/C (Mac DevTools)
      if (e.metaKey && e.altKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault();
        logSecurityEvent('DEVTOOLS_SHORTCUT_BLOCKED', `Cmd+Option+${e.key} blocked`);
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && ['U', 'u'].includes(e.key)) {
        e.preventDefault();
        logSecurityEvent('VIEW_SOURCE_BLOCKED', 'Ctrl+U blocked');
        return false;
      }
      
      // Ctrl+S (Save Page)
      if (e.ctrlKey && ['S', 's'].includes(e.key)) {
        e.preventDefault();
        logSecurityEvent('SAVE_PAGE_BLOCKED', 'Ctrl+S blocked');
        return false;
      }
      
      // Ctrl+P (Print)
      if (e.ctrlKey && ['P', 'p'].includes(e.key)) {
        e.preventDefault();
        logSecurityEvent('PRINT_BLOCKED', 'Ctrl+P blocked');
        return false;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [finalConfig.disableKeyboardShortcuts, logSecurityEvent, isPublicRoute]);

  // Disable text selection and drag (only on protected routes)
  useEffect(() => {
    if (isPublicRoute || !finalConfig.disableTextSelection) return;
    
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };
    
    const handleDragStart = (e: Event) => {
      e.preventDefault();
      return false;
    };
    
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logSecurityEvent('COPY_BLOCKED', 'Copy attempt blocked');
      return false;
    };
    
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);
    
    // Add CSS to prevent selection
    const style = document.createElement('style');
    style.id = 'security-shield-styles';
    style.textContent = `
      body {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      const existingStyle = document.getElementById('security-shield-styles');
      if (existingStyle) existingStyle.remove();
    };
  }, [finalConfig.disableTextSelection, logSecurityEvent, isPublicRoute]);

  // DevTools detection with console trap (only on protected routes)
  useEffect(() => {
    if (isPublicRoute || !finalConfig.detectDevTools) return;
    
    // Console detection trap
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: function() {
        handleSecurityBreach('DevTools console detected via image trap');
        return 'devtools-trap';
      }
    });
    
    // Periodic size check
    checkIntervalRef.current = setInterval(() => {
      if (detectDevToolsOpen() && !devToolsDetectedRef.current) {
        handleSecurityBreach('DevTools detected via window size');
      }
    }, 1000);
    
    // Debug detection
    const debuggerCheck = () => {
      const start = performance.now();
      // debugger; // Uncomment in production to detect debugger
      const end = performance.now();
      if (end - start > 100 && !devToolsDetectedRef.current) {
        handleSecurityBreach('Debugger detected via timing');
      }
    };
    
    const debugInterval = setInterval(debuggerCheck, 2000);
    
    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      clearInterval(debugInterval);
    };
  }, [finalConfig.detectDevTools, handleSecurityBreach, isPublicRoute]);

  // Disable console methods in production (only on protected routes)
  useEffect(() => {
    if (isPublicRoute || !finalConfig.disableDevTools) return;
    
    const noop = () => {};
    const consoleBackup = { ...console };
    
    // Override console methods
    if (import.meta.env.PROD) {
      console.log = noop;
      console.warn = noop;
      console.error = noop;
      console.info = noop;
      console.debug = noop;
      console.trace = noop;
      console.dir = noop;
      console.table = noop;
    }
    
    return () => {
      Object.assign(console, consoleBackup);
    };
  }, [finalConfig.disableDevTools, isPublicRoute]);

  return {
    isSecured: !isPublicRoute,
    devToolsDetected: devToolsDetectedRef.current,
  };
}
