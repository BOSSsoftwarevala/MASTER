import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ServerWizardData, SECURITY_LEVELS } from '../ServerWizardTypes';
import { cn } from '@/lib/utils';
import { Shield, ShieldAlert, ShieldCheck, Lock, Wifi } from 'lucide-react';

interface Step4Props {
  data: ServerWizardData;
  updateData: (updates: Partial<ServerWizardData>) => void;
}

const FIREWALL_PRESETS = [
  { value: 'basic', label: 'Basic', description: 'HTTP/HTTPS only' },
  { value: 'standard', label: 'Standard', description: 'HTTP/HTTPS + SSH (restricted)' },
  { value: 'strict', label: 'Strict', description: 'All ports blocked except whitelist' },
  { value: 'custom', label: 'Custom', description: 'Configure manually' },
];

export function Step4Security({ data, updateData }: Step4Props) {
  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'low': return <Shield className="h-6 w-6" />;
      case 'medium': return <ShieldCheck className="h-6 w-6" />;
      case 'high': return <ShieldAlert className="h-6 w-6" />;
      default: return <Shield className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Security Configuration</h3>

      <div>
        <Label className="mb-3 block">Security Level *</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SECURITY_LEVELS.map((level) => (
            <Card
              key={level.value}
              className={cn(
                'cursor-pointer transition-all hover:border-primary/50',
                data.securityLevel === level.value && 'border-primary ring-2 ring-primary/20'
              )}
              onClick={() => updateData({ securityLevel: level.value as ServerWizardData['securityLevel'] })}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={level.color}>
                    {getSecurityIcon(level.value)}
                  </div>
                  <div>
                    <p className="font-semibold">{level.label}</p>
                    <p className="text-xs text-muted-foreground">{level.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Firewall Preset</Label>
        <Select
          value={data.firewallPreset}
          onValueChange={(value) => updateData({ firewallPreset: value as ServerWizardData['firewallPreset'] })}
        >
          <SelectTrigger className="max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FIREWALL_PRESETS.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                <div className="flex flex-col">
                  <span>{preset.label}</span>
                  <span className="text-xs text-muted-foreground">{preset.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">SSH Access</p>
                <p className="text-xs text-muted-foreground">Allow SSH connections</p>
              </div>
            </div>
            <Switch
              checked={data.sshAccess}
              onCheckedChange={(checked) => updateData({ sshAccess: checked })}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Wifi className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <p className="font-medium">IP Allowlist</p>
              <Input
                placeholder="e.g., 192.168.1.0/24, 10.0.0.1"
                value={data.ipAllowlist}
                onChange={(e) => updateData({ ipAllowlist: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        </Card>
      </div>

      {data.securityLevel === 'high' && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-red-600">High Security Mode</p>
                <p className="text-sm text-muted-foreground">
                  This server will have strict firewall rules, mandatory 2FA for access,
                  and all connections will be logged and monitored.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
