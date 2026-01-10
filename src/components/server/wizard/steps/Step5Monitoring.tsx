import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { ServerWizardData } from '../ServerWizardTypes';
import { cn } from '@/lib/utils';
import { Activity, Database, Clock, RefreshCw } from 'lucide-react';

interface Step5Props {
  data: ServerWizardData;
  updateData: (updates: Partial<ServerWizardData>) => void;
}

export function Step5Monitoring({ data, updateData }: Step5Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Monitoring & Backup Configuration</h3>

      {/* Monitoring Level */}
      <div>
        <Label className="mb-3 block">Monitoring Level</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className={cn(
              'cursor-pointer transition-all hover:border-primary/50',
              data.monitoringLevel === 'basic' && 'border-primary ring-2 ring-primary/20'
            )}
            onClick={() => updateData({ monitoringLevel: 'basic' })}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-semibold">Basic</p>
                  <p className="text-xs text-muted-foreground">CPU, RAM, Disk, Network</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              'cursor-pointer transition-all hover:border-primary/50',
              data.monitoringLevel === 'advanced' && 'border-primary ring-2 ring-primary/20'
            )}
            onClick={() => updateData({ monitoringLevel: 'advanced' })}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-emerald-500" />
                <div>
                  <p className="font-semibold">Advanced</p>
                  <p className="text-xs text-muted-foreground">+ Process, Logs, Custom Metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Metric Interval */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <Label>Metric Collection Interval</Label>
          </div>
          <span className="text-lg font-semibold">{data.metricInterval}s</span>
        </div>
        <Slider
          value={[data.metricInterval]}
          onValueChange={([value]) => updateData({ metricInterval: value })}
          min={10}
          max={300}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>10 seconds</span>
          <span>5 minutes</span>
        </div>
      </div>

      {/* Backup Settings */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Automatic Backups</p>
              <p className="text-xs text-muted-foreground">Enable scheduled backups</p>
            </div>
          </div>
          <Switch
            checked={data.backupEnabled}
            onCheckedChange={(checked) => updateData({ backupEnabled: checked })}
          />
        </div>

        {data.backupEnabled && (
          <div className="space-y-2 pt-4 border-t">
            <Label>Backup Frequency</Label>
            <Select
              value={data.backupFrequency}
              onValueChange={(value) => updateData({ backupFrequency: value as ServerWizardData['backupFrequency'] })}
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>Hourly</span>
                  </div>
                </SelectItem>
                <SelectItem value="daily">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>Daily</span>
                  </div>
                </SelectItem>
                <SelectItem value="weekly">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>Weekly</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </Card>

      {data.monitoringLevel === 'advanced' && (
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Activity className="h-5 w-5 text-emerald-500 mt-0.5" />
              <div>
                <p className="font-medium text-emerald-600">Advanced Monitoring Enabled</p>
                <p className="text-sm text-muted-foreground">
                  Process monitoring, log aggregation, and custom metric collection will be enabled.
                  SLA tracking and incident prediction will be active.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
