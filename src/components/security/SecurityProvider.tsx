import { ReactNode, createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SecurityContextType {
  isSecured: boolean;
  sessionValid: boolean;
  lastActivity: Date;
  updateActivity: () => void;
}

const SecurityContext = createContext<SecurityContextType>({
  isSecured: false,
  sessionValid: false,
  lastActivity: new Date(),
  updateActivity: () => {},
});

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000;

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/marketplace',
  '/marketplace/category',
  '/marketplace/software',
  '/marketplace/demo',
  '/marketplace/pricing',
  '/marketplace/cart',
];

interface SecurityProviderProps {
  children: ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [lastActivity, setLastActivity] = useState(new Date());
  const [sessionValid, setSessionValid] = useState(true);

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    location.pathname === route || 
    location.pathname.startsWith('/marketplace/')
  );

  // Update last activity
  const updateActivity = useCallback(() => {
    setLastActivity(new Date());
  }, []);

  // Log security events - memoized to avoid recreating
  const logSecurityEvent = useCallback(async (eventType: string, details: string) => {
    if (!user) return;
    try {
      await supabase.from('audit_logs').insert({
        action: eventType,
        details,
        module: 'security_provider',
        severity: 'medium',
        user_email: user.email || 'anonymous',
        user_id: user.id,
        user_role: 'user',
      });
    } catch {
      // Silent fail - don't block user experience
    }
  }, [user]);

  // Activity listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      updateActivity();
    };
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [updateActivity]);

  // Session timeout check - only runs after auth is loaded
  useEffect(() => {
    // Don't check session if still loading or no user or public route
    if (loading || !user || isPublicRoute) return;
    
    const checkSession = () => {
      const now = new Date();
      const timeSinceActivity = now.getTime() - lastActivity.getTime();
      
      if (timeSinceActivity > SESSION_TIMEOUT) {
        setSessionValid(false);
        // Use setTimeout to avoid async in effect
        setTimeout(() => {
          logSecurityEvent('SESSION_TIMEOUT', 'User session expired due to inactivity');
        }, 0);
        // Navigate after a small delay to avoid race conditions
        navigate('/auth', { replace: true });
      }
    };
    
    const interval = setInterval(checkSession, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [user, loading, lastActivity, isPublicRoute, navigate, logSecurityEvent]);

  // Route protection - CRITICAL: Wait for auth loading to complete
  useEffect(() => {
    // Don't do anything while auth is loading
    if (loading) return;
    
    // Only redirect if auth is done loading AND no user AND not on public route
    if (!isPublicRoute && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, loading, isPublicRoute, navigate, location.pathname]);

  // Visibility change detection (tab switching) - debounced
  useEffect(() => {
    if (!user) return;
    
    let timeout: NodeJS.Timeout;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Debounce to avoid excessive logging
        timeout = setTimeout(() => {
          logSecurityEvent('TAB_HIDDEN', 'User switched away from application');
        }, 1000);
      } else {
        clearTimeout(timeout);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(timeout);
    };
  }, [user, logSecurityEvent]);

  return (
    <SecurityContext.Provider value={{
      isSecured: true,
      sessionValid,
      lastActivity,
      updateActivity,
    }}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  return useContext(SecurityContext);
}
