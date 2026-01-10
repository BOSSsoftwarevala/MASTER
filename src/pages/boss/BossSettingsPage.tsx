import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useUserRoles } from '@/hooks/useUserRoles';
import { 
  Settings, 
  Shield,
  Bell,
  Lock,
  Gauge,
  AlertTriangle,
  Save,
  Eye
} from 'lucide-react';

interface SettingItem {
  id: string;
  name: string;
  description: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'toggle';
  category: 'limits' | 'approvals' | 'alerts';
  readOnly: boolean;
}

const mockSettings: SettingItem[] = [
  { id: '1', name: 'Max Daily Transactions', description: 'Maximum transactions per day before approval required', value: 100, type: 'number', category: 'limits', readOnly: false },
  { id: '2', name: 'High Value Threshold', description: 'Amount above which approval is required', value: 50000, type: 'number', category: 'approvals', readOnly: false },
  { id: '3', name: 'Auto Payout Limit', description: 'Maximum auto-payout without approval', value: 10000, type: 'number', category: 'approvals', readOnly: false },
  { id: '4', name: 'Email Alerts', description: 'Send email for critical events', value: true, type: 'toggle', category: 'alerts', readOnly: false },
  { id: '5', name: 'SMS Alerts', description: 'Send SMS for high-priority alerts', value: true, type: 'toggle', category: 'alerts', readOnly: false },
  { id: '6', name: 'Breach Notification', description: 'Notify on SLA breach', value: true, type: 'toggle', category: 'alerts', readOnly: false },
  { id: '7', name: 'System Version', description: 'Current system version', value: 'v2.4.1', type: 'text', category: 'limits', readOnly: true },
  { id: '8', name: 'License Type', description: 'Current license tier', value: 'Enterprise', type: 'text', category: 'limits', readOnly: true },
];

export default function BossSettingsPage() {
  const { isSuperAdmin } = useUserRoles();
  const [settings, setSettings] = useState<SettingItem[]>(mockSettings);

  if (!isSuperAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Only Super Admin can access Settings.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const limitSettings = settings.filter(s => s.category === 'limits');
  const approvalSettings = settings.filter(s => s.category === 'approvals');
  const alertSettings = settings.filter(s => s.category === 'alerts');

  const handleToggle = (id: string) => {
    setSettings(prev => prev.map(s => 
      s.id === id && s.type === 'toggle' && !s.readOnly
        ? { ...s, value: !s.value }
        : s
    ));
  };

  const handleNumberChange = (id: string, value: number) => {
    setSettings(prev => prev.map(s => 
      s.id === id && s.type === 'number' && !s.readOnly
        ? { ...s, value }
        : s
    ));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Boss Settings</h1>
            <p className="text-muted-foreground mt-1">Global limits, approval thresholds, and alert rules</p>
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Read-Only Notice */}
        <Card className="bg-muted/50 border-muted">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Some settings are read-only and managed by the system. Editable settings require confirmation before saving.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Global Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                Global Limits
              </CardTitle>
              <CardDescription>System-wide operational limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {limitSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label className="font-medium">{setting.name}</Label>
                      {setting.readOnly && (
                        <Badge variant="outline" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" /> Read Only
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                  {setting.type === 'number' ? (
                    <Input
                      type="number"
                      value={setting.value as number}
                      onChange={(e) => handleNumberChange(setting.id, parseInt(e.target.value))}
                      disabled={setting.readOnly}
                      className="w-32 text-right"
                    />
                  ) : (
                    <span className="font-medium text-foreground">{setting.value as string}</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Approval Thresholds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Approval Thresholds
              </CardTitle>
              <CardDescription>Configure when approvals are required</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {approvalSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex-1">
                    <Label className="font-medium">{setting.name}</Label>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">₹</span>
                    <Input
                      type="number"
                      value={setting.value as number}
                      onChange={(e) => handleNumberChange(setting.id, parseInt(e.target.value))}
                      disabled={setting.readOnly}
                      className="w-32 text-right"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Alert Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Alert Rules
            </CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alertSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <Label className="font-medium">{setting.name}</Label>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch
                    checked={setting.value as boolean}
                    onCheckedChange={() => handleToggle(setting.id)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions - use with extreme caution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <div>
                <p className="font-bold text-destructive">Reset All Settings</p>
                <p className="text-sm text-muted-foreground">Reset all settings to default values. This cannot be undone.</p>
              </div>
              <Button variant="destructive">
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
