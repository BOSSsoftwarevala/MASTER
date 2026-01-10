import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ServerWizardData, PROVIDERS } from '../ServerWizardTypes';
import { cn } from '@/lib/utils';

interface Step2Props {
  data: ServerWizardData;
  updateData: (updates: Partial<ServerWizardData>) => void;
}

const REGIONS = {
  aws: ['af-south-1 (Cape Town) 🇿🇦', 'ap-south-1 (Mumbai)', 'eu-west-1 (Ireland)', 'us-east-1', 'me-south-1 (Bahrain)'],
  gcp: ['europe-west1', 'asia-south1 (Mumbai)', 'me-west1 (Tel Aviv)', 'us-central1'],
  azure: ['southafricanorth (Johannesburg) 🇿🇦', 'centralindia (Pune)', 'uaenorth (Dubai)', 'westeurope'],
  cloudflare: ['Global Edge (Auto)', 'Africa Edge 🌍', 'Mumbai Edge', 'Dubai Edge', 'EU Edge'],
  hetzner: ['Johannesburg (South Africa) 🇿🇦', 'Falkenstein (Germany)', 'Nuremberg (Germany)', 'Helsinki (Finland)', 'Ashburn (US)'],
  vultr: ['Johannesburg 🇿🇦', 'Mumbai', 'Singapore', 'Frankfurt', 'New Jersey', 'Sydney'],
  digitalocean: ['Amsterdam (Near Africa)', 'Bangalore', 'Frankfurt', 'New York', 'Singapore', 'London'],
  contabo: ['Johannesburg (South Africa) 🇿🇦', 'Germany (Nuremberg)', 'US (St. Louis)', 'Singapore', 'Australia'],
  linode: ['Johannesburg 🇿🇦', 'Mumbai', 'Singapore', 'Frankfurt', 'Newark', 'London'],
  other: ['Custom Region'],
};

export function Step2Provider({ data, updateData }: Step2Props) {
  const availableRegions = data.provider ? REGIONS[data.provider as keyof typeof REGIONS] || [] : [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Cloud Provider</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {PROVIDERS.map((provider) => (
            <Card
              key={provider.value}
              className={cn(
                'cursor-pointer transition-all hover:border-primary/50',
                data.provider === provider.value && 'border-primary ring-2 ring-primary/20'
              )}
              onClick={() => updateData({ provider: provider.value as ServerWizardData['provider'], region: '' })}
            >
              <CardContent className="p-3 text-center">
                <span className="text-2xl block mb-1">{provider.icon}</span>
                <p className="font-medium text-xs">{provider.label}</p>
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{provider.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {data.provider === 'other' && (
        <div className="space-y-2">
          <Label htmlFor="providerOther">Provider Name *</Label>
          <Input
            id="providerOther"
            placeholder="e.g., DigitalOcean, Linode, Hetzner"
            value={data.providerOther}
            onChange={(e) => updateData({ providerOther: e.target.value })}
            className="max-w-md"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data Center Region *</Label>
          <Select
            value={data.region}
            onValueChange={(value) => updateData({ region: value })}
            disabled={!data.provider}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {availableRegions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="availabilityZone">Availability Zone</Label>
          <Input
            id="availabilityZone"
            placeholder="e.g., us-east-1a"
            value={data.availabilityZone}
            onChange={(e) => updateData({ availabilityZone: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>IP Address Type *</Label>
        <div className="flex gap-4">
          {(['public', 'private', 'both'] as const).map((type) => (
            <label
              key={type}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all',
                data.ipType === type && 'border-primary bg-primary/5'
              )}
            >
              <input
                type="radio"
                name="ipType"
                value={type}
                checked={data.ipType === type}
                onChange={() => updateData({ ipType: type })}
                className="sr-only"
              />
              <span className="capitalize font-medium">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
