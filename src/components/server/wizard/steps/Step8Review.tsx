import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ServerWizardData, SERVER_TYPES, PROVIDERS, SECURITY_LEVELS, ENVIRONMENTS } from '../ServerWizardTypes';
import { Server, Cloud, Cpu, Shield, Activity, TrendingUp, Tag, AlertTriangle } from 'lucide-react';

interface Step8Props {
  data: ServerWizardData;
  updateData: (updates: Partial<ServerWizardData>) => void;
}

export function Step8Review({ data, updateData }: Step8Props) {
  const serverType = SERVER_TYPES.find((t) => t.value === data.serverType);
  const provider = PROVIDERS.find((p) => p.value === data.provider);
  const securityLevel = SECURITY_LEVELS.find((s) => s.value === data.securityLevel);
  const environment = ENVIRONMENTS.find((e) => e.value === data.environment);

  const estimatedCost = () => {
    const cpuCost = data.cpuCores * 500;
    const ramCost = data.ramGB * 200;
    const diskMultiplier = data.diskType === 'nvme' ? 3 : data.diskType === 'ssd' ? 2 : 1;
    const diskCost = data.diskGB * diskMultiplier;
    return cpuCost + ramCost + diskCost;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Review & Confirm</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Server Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Server className="h-4 w-4" />
              Server Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{data.serverName}</p>
            <p className="text-sm text-muted-foreground">{serverType?.label}</p>
            <Badge variant="outline" className="mt-2">{data.purpose}</Badge>
          </CardContent>
        </Card>

        {/* Provider */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Provider & Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">
              {provider?.icon} {data.provider === 'other' ? data.providerOther : provider?.label}
            </p>
            <p className="text-sm text-muted-foreground">{data.region}</p>
            <Badge variant="outline" className="mt-2">{data.ipType} IP</Badge>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">CPU:</span> {data.cpuCores} vCPU</p>
              <p><span className="text-muted-foreground">RAM:</span> {data.ramGB} GB</p>
              <p><span className="text-muted-foreground">Disk:</span> {data.diskGB} GB {data.diskType.toUpperCase()}</p>
              <p><span className="text-muted-foreground">Bandwidth:</span> {data.bandwidthLimit} Mbps</p>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`font-semibold ${securityLevel?.color}`}>{securityLevel?.label} Security</p>
            <p className="text-sm text-muted-foreground">Firewall: {data.firewallPreset}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant={data.sshAccess ? 'default' : 'secondary'}>
                SSH {data.sshAccess ? 'ON' : 'OFF'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Monitoring */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold capitalize">{data.monitoringLevel} Monitoring</p>
            <p className="text-sm text-muted-foreground">Interval: {data.metricInterval}s</p>
            <Badge variant={data.backupEnabled ? 'default' : 'secondary'} className="mt-2">
              Backup: {data.backupEnabled ? data.backupFrequency : 'Disabled'}
            </Badge>
          </CardContent>
        </Card>

        {/* Scaling */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Scaling
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.autoScaling ? (
              <>
                <p className="font-semibold text-emerald-500">Auto-Scaling ON</p>
                <p className="text-sm text-muted-foreground">
                  {data.minNodes} - {data.maxNodes} nodes
                </p>
                <p className="text-xs text-muted-foreground">
                  CPU: {data.cpuTrigger}%, RAM: {data.ramTrigger}%
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">Auto-Scaling Disabled</p>
            )}
            <Badge variant={data.autoHealing ? 'default' : 'secondary'} className="mt-2">
              Healing: {data.autoHealing ? 'ON' : 'OFF'}
            </Badge>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags & Group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              {environment && (
                <div className={`w-3 h-3 rounded-full ${environment.color}`} />
              )}
              <span className="font-semibold">{environment?.label}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{data.serverGroup}</p>
            <div className="flex flex-wrap gap-1">
              {data.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cost */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Estimated Monthly Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">₹{estimatedCost().toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Approximate based on resources</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Security Impact Warning */}
      {data.securityLevel === 'high' && (
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-600">High Security Server</p>
              <p className="text-sm text-muted-foreground">
                This server will have enhanced security measures. Access will be restricted and all actions will be logged.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation */}
      <Card className="border-2">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="confirmCreate"
              checked={data.confirmCreate}
              onCheckedChange={(checked) => updateData({ confirmCreate: checked as boolean })}
            />
            <Label htmlFor="confirmCreate" className="leading-tight cursor-pointer">
              I confirm that all the information above is correct and I want to create this server.
              I understand that this action will be logged for audit purposes.
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creationReason">Reason for Creation *</Label>
            <Input
              id="creationReason"
              placeholder="e.g., New client onboarding, Production scaling, Development environment"
              value={data.creationReason}
              onChange={(e) => updateData({ creationReason: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">This reason will be recorded in the audit log</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
