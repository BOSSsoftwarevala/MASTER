import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { ServerWizardData, SERVER_TYPES, PURPOSES } from '../ServerWizardTypes';
import { cn } from '@/lib/utils';

interface Step1Props {
  data: ServerWizardData;
  updateData: (updates: Partial<ServerWizardData>) => void;
}

export function Step1ServerType({ data, updateData }: Step1Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Server Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SERVER_TYPES.map((type) => (
            <Card
              key={type.value}
              className={cn(
                'cursor-pointer transition-all hover:border-primary/50',
                data.serverType === type.value && 'border-primary ring-2 ring-primary/20'
              )}
              onClick={() => updateData({ serverType: type.value as ServerWizardData['serverType'] })}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <p className="font-medium">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="serverName">Server Name *</Label>
        <Input
          id="serverName"
          placeholder="e.g., PROD-WEB-01, CLIENT-DB-MAIN"
          value={data.serverName}
          onChange={(e) => updateData({ serverName: e.target.value })}
          className="max-w-md"
        />
        <p className="text-xs text-muted-foreground">Use a descriptive name following your naming convention</p>
      </div>

      <div>
        <Label className="mb-3 block">Server Purpose *</Label>
        <RadioGroup
          value={data.purpose}
          onValueChange={(value) => updateData({ purpose: value as ServerWizardData['purpose'] })}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {PURPOSES.map((purpose) => (
            <div key={purpose.value}>
              <RadioGroupItem
                value={purpose.value}
                id={`purpose-${purpose.value}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`purpose-${purpose.value}`}
                className={cn(
                  'flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all',
                  data.purpose === purpose.value && 'border-primary bg-primary/5'
                )}
              >
                <span className="font-medium">{purpose.label}</span>
                <span className="text-xs text-muted-foreground text-center">{purpose.description}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
