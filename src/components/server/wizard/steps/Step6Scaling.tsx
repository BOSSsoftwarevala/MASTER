import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { ServerWizardData } from '../ServerWizardTypes';
import { TrendingUp, Heart, Cpu, MemoryStick, AlertTriangle } from 'lucide-react';

interface Step6Props {
  data: ServerWizardData;
  updateData: (updates: Partial<ServerWizardData>) => void;
}

export function Step6Scaling({ data, updateData }: Step6Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Auto-Scaling & Self-Healing</h3>

      {/* Auto Scaling Toggle */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            <div>
              <p className="font-medium">Auto-Scaling</p>
              <p className="text-xs text-muted-foreground">Automatically scale based on load</p>
            </div>
          </div>
          <Switch
            checked={data.autoScaling}
            onCheckedChange={(checked) => updateData({ autoScaling: checked })}
          />
        </div>
      </Card>

      {data.autoScaling && (
        <div className="space-y-6 pl-4 border-l-2 border-primary/30">
          {/* Min/Max Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Minimum Nodes</Label>
                <span className="text-lg font-semibold">{data.minNodes}</span>
              </div>
              <Slider
                value={[data.minNodes]}
                onValueChange={([value]) => updateData({ minNodes: value })}
                min={1}
                max={10}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Maximum Nodes</Label>
                <span className="text-lg font-semibold">{data.maxNodes}</span>
              </div>
              <Slider
                value={[data.maxNodes]}
                onValueChange={([value]) => updateData({ maxNodes: Math.max(value, data.minNodes) })}
                min={1}
                max={20}
                step={1}
              />
            </div>
          </div>

          {data.maxNodes < data.minNodes && (
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="p-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <p className="text-sm text-yellow-600">Max nodes must be greater than or equal to min nodes</p>
              </CardContent>
            </Card>
          )}

          {/* CPU Trigger */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-orange-500" />
                <Label>CPU Scale Trigger</Label>
              </div>
              <span className="text-lg font-semibold">{data.cpuTrigger}%</span>
            </div>
            <Slider
              value={[data.cpuTrigger]}
              onValueChange={([value]) => updateData({ cpuTrigger: value })}
              min={50}
              max={95}
              step={5}
            />
            <p className="text-xs text-muted-foreground">
              Scale up when CPU usage exceeds this threshold
            </p>
          </div>

          {/* RAM Trigger */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MemoryStick className="h-5 w-5 text-blue-500" />
                <Label>RAM Scale Trigger</Label>
              </div>
              <span className="text-lg font-semibold">{data.ramTrigger}%</span>
            </div>
            <Slider
              value={[data.ramTrigger]}
              onValueChange={([value]) => updateData({ ramTrigger: value })}
              min={50}
              max={95}
              step={5}
            />
            <p className="text-xs text-muted-foreground">
              Scale up when RAM usage exceeds this threshold
            </p>
          </div>
        </div>
      )}

      {/* Auto Healing Toggle */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-500" />
            <div>
              <p className="font-medium">Auto-Healing</p>
              <p className="text-xs text-muted-foreground">Automatically restart failed services</p>
            </div>
          </div>
          <Switch
            checked={data.autoHealing}
            onCheckedChange={(checked) => updateData({ autoHealing: checked })}
          />
        </div>
      </Card>

      {data.autoHealing && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-red-600">Auto-Healing Enabled</p>
                <p className="text-sm text-muted-foreground">
                  Failed services will be automatically restarted. Health checks will run every 30 seconds.
                  If a service fails 3 times, an alert will be triggered for manual intervention.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
