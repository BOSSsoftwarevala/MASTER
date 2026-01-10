import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ServerWizardData } from '../ServerWizardTypes';
import { Cpu, MemoryStick, HardDrive, Wifi } from 'lucide-react';

interface Step3Props {
  data: ServerWizardData;
  updateData: (updates: Partial<ServerWizardData>) => void;
}

const estimateCost = (cpu: number, ram: number, disk: number, diskType: string) => {
  const cpuCost = cpu * 500;
  const ramCost = ram * 200;
  const diskMultiplier = diskType === 'nvme' ? 3 : diskType === 'ssd' ? 2 : 1;
  const diskCost = disk * diskMultiplier;
  return cpuCost + ramCost + diskCost;
};

export function Step3Resources({ data, updateData }: Step3Props) {
  const estimatedCost = estimateCost(data.cpuCores, data.ramGB, data.diskGB, data.diskType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Resource Configuration</h3>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3">
            <p className="text-sm text-muted-foreground">Estimated Monthly Cost</p>
            <p className="text-2xl font-bold text-primary">₹{estimatedCost.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {/* CPU Cores */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              <Label>CPU Cores</Label>
            </div>
            <span className="text-lg font-semibold">{data.cpuCores} vCPU</span>
          </div>
          <Slider
            value={[data.cpuCores]}
            onValueChange={([value]) => updateData({ cpuCores: value })}
            min={1}
            max={64}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 vCPU</span>
            <span>64 vCPU</span>
          </div>
        </div>

        {/* RAM */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MemoryStick className="h-5 w-5 text-blue-500" />
              <Label>RAM (Memory)</Label>
            </div>
            <span className="text-lg font-semibold">{data.ramGB} GB</span>
          </div>
          <Slider
            value={[data.ramGB]}
            onValueChange={([value]) => updateData({ ramGB: value })}
            min={1}
            max={256}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 GB</span>
            <span>256 GB</span>
          </div>
        </div>

        {/* Disk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-emerald-500" />
                <Label>Storage</Label>
              </div>
              <span className="text-lg font-semibold">{data.diskGB} GB</span>
            </div>
            <Slider
              value={[data.diskGB]}
              onValueChange={([value]) => updateData({ diskGB: value })}
              min={20}
              max={2000}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>20 GB</span>
              <span>2 TB</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Disk Type</Label>
            <Select
              value={data.diskType}
              onValueChange={(value) => updateData({ diskType: value as ServerWizardData['diskType'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hdd">HDD (Standard)</SelectItem>
                <SelectItem value="ssd">SSD (Fast)</SelectItem>
                <SelectItem value="nvme">NVMe (Ultra Fast)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bandwidth */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-orange-500" />
              <Label>Bandwidth Limit</Label>
            </div>
            <span className="text-lg font-semibold">{data.bandwidthLimit} Mbps</span>
          </div>
          <Slider
            value={[data.bandwidthLimit]}
            onValueChange={([value]) => updateData({ bandwidthLimit: value })}
            min={100}
            max={10000}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>100 Mbps</span>
            <span>10 Gbps</span>
          </div>
        </div>
      </div>
    </div>
  );
}
