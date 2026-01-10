import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useSecurityShield } from '@/hooks/useSecurityShield';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  requireSuperAdmin?: boolean;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [],
  requireSuperAdmin = false,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { roles, loading: rolesLoading, isAdmin, isSuperAdmin } = useUserRoles();
  const location = useLocation();
  const [accessDenied, setAccessDenied] = useState(false);
  
  // Enable security shield on protected routes
  useSecurityShield();

  // Log access attempt
  const logAccessAttempt = async (allowed: boolean, reason: string) => {
    try {
      await supabase.from('audit_logs').insert({
        action: allowed ? 'ACCESS_GRANTED' : 'ACCESS_DENIED',
        details: `${reason} - Route: ${location.pathname}`,
        module: 'route_protection',
        severity: allowed ? 'info' : 'high',
        user_email: user?.email || 'anonymous',
        user_id: user?.id,
        user_role: roles[0] || 'none',
      });
    } catch (error) {
      // Silent fail
    }
  };

  useEffect(() => {
    if (authLoading || rolesLoading) return;

    // Check access permissions
    const checkAccess = async () => {
      if (!user) {
        await logAccessAttempt(false, 'No authenticated user');
        return;
      }

      if (requireSuperAdmin && !isSuperAdmin()) {
        await logAccessAttempt(false, 'Super admin required');
        setAccessDenied(true);
        return;
      }

      if (requireAdmin && !isAdmin()) {
        await logAccessAttempt(false, 'Admin required');
        setAccessDenied(true);
        return;
      }

      if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role => roles.includes(role as any));
        if (!hasRequiredRole) {
          await logAccessAttempt(false, `Required roles: ${requiredRoles.join(', ')}`);
          setAccessDenied(true);
          return;
        }
      }

      await logAccessAttempt(true, 'Access granted');
    };

    checkAccess();
  }, [user, roles, authLoading, rolesLoading, requireSuperAdmin, requireAdmin, requiredRoles]);

  // Loading state with secure loading screen
  if (authLoading || rolesLoading) {
    return (
      <div className="dark min-h-screen flex items-center justify-center bg-[hsl(var(--luxury-canvas-bg))]">
        <div className="p-8 rounded-[18px] bg-[hsl(var(--luxury-card-bg))] shadow-xl">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 animate-pulse" />
            <span className="text-[hsl(var(--luxury-icon-active))] text-lg font-medium">
              Verifying access...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Access denied - show fake 404 (security through obscurity)
  if (accessDenied) {
    return (
      <div className="dark min-h-screen flex items-center justify-center bg-[hsl(var(--luxury-canvas-bg))]">
        <div className="text-center p-8">
          <h1 className="text-6xl font-bold text-gray-600 mb-4">404</h1>
          <p className="text-gray-400 text-lg mb-6">Page not found</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
