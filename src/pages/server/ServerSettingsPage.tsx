import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Info } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function ServerSettingsPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-[hsl(var(--boss-text))]">
            <Settings className="h-8 w-8 text-[hsl(var(--boss-accent))]" />
            Server Settings
          </h1>
          <p className="text-[hsl(var(--boss-text-muted))] mt-1">
            Configure server management preferences
          </p>
        </div>

        {/* Settings Card */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--boss-text))]">General Settings</CardTitle>
            <CardDescription className="text-[hsl(var(--boss-text-muted))]">
              Server management configuration options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-[hsl(var(--boss-card-elevated))]">
              <Info className="h-5 w-5 text-[hsl(var(--boss-accent))]" />
              <p className="text-[hsl(var(--boss-text-muted))]">
                Settings configuration is read-only. Contact system administrator for changes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
