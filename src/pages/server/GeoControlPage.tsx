import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Globe, 
  Ban, 
  CheckCircle, 
  Shield, 
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Clock,
  AlertTriangle,
  MapPin
} from 'lucide-react';
import { useSecurityCommandCenter } from '@/hooks/useSecurityCommandCenter';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
];

export default function GeoControlPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    blockedCountries, 
    isLoading,
    blockCountry,
    unblockCountry
  } = useSecurityCommandCenter();

  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1500));
    setRefreshing(false);
  };

  const handleBlockCountry = async (countryCode: string) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    blockCountry.mutate({
      country_code: countryCode,
      country_name: country?.name || countryCode,
      reason: 'Manual block by admin',
      blocked_by: 'admin'
    });
  };

  const handleUnblockCountry = async (blockId: string) => {
    unblockCountry.mutate({ blockId, unblocked_by: 'admin' });
  };

  const blockedCodes = blockedCountries?.map(c => c.country_code) || [];
  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-[hsl(var(--boss-text))]">
              <Globe className="h-8 w-8 text-[hsl(var(--boss-accent))]" />
              Geo Control
            </h1>
            <p className="text-[hsl(var(--boss-text-muted))] mt-1">
              Country-based access control and blocking
            </p>
          </div>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            className="gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--boss-text-muted))]">Allowed Countries</p>
                  <p className="text-2xl font-bold text-emerald-400">{COUNTRIES.length - blockedCodes.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--boss-text-muted))]">Blocked Countries</p>
                  <p className="text-2xl font-bold text-red-400">{blockedCodes.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Ban className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--boss-text-muted))]">Protection Level</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {blockedCodes.length > 3 ? 'High' : blockedCodes.length > 0 ? 'Medium' : 'Low'}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blocked Countries */}
        {blockedCodes.length > 0 && (
          <Card className="bg-[hsl(var(--boss-card))] border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Ban className="h-5 w-5" />
                Blocked Countries
              </CardTitle>
              <CardDescription className="text-[hsl(var(--boss-text-muted))]">
                These countries are currently blocked from accessing the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-32 bg-[hsl(var(--boss-card-elevated))]" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {blockedCountries?.map((country) => {
                    const countryInfo = COUNTRIES.find(c => c.code === country.country_code);
                    return (
                      <div 
                        key={country.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20"
                      >
                        <span className="text-lg">{countryInfo?.flag || '🏳️'}</span>
                        <span className="font-medium text-[hsl(var(--boss-text))]">
                          {countryInfo?.name || country.country_code}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                          onClick={() => handleUnblockCountry(country.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Country List */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text))]">
                  <MapPin className="h-5 w-5 text-[hsl(var(--boss-accent))]" />
                  All Countries
                </CardTitle>
                <CardDescription className="text-[hsl(var(--boss-text-muted))]">
                  Toggle access for each country
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--boss-text-muted))]" />
                <Input 
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCountries.map((country) => {
                const isBlocked = blockedCodes.includes(country.code);
                return (
                  <div 
                    key={country.code}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      isBlocked 
                        ? 'bg-red-500/5 border-red-500/20' 
                        : 'bg-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))] hover:border-[hsl(var(--boss-accent))]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <p className="font-medium text-[hsl(var(--boss-text))]">{country.name}</p>
                        <p className="text-xs text-[hsl(var(--boss-text-muted))]">{country.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={isBlocked ? 'destructive' : 'secondary'}>
                        {isBlocked ? 'Blocked' : 'Allowed'}
                      </Badge>
                      <Switch
                        checked={!isBlocked}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            const block = blockedCountries?.find(c => c.country_code === country.code);
                            if (block) handleUnblockCountry(block.id);
                          } else {
                            handleBlockCountry(country.code);
                          }
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Block */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text))]">
              <Clock className="h-5 w-5 text-amber-400" />
              Temporary Block
            </CardTitle>
            <CardDescription className="text-[hsl(var(--boss-text-muted))]">
              Block a country for a specific duration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input 
                placeholder="Country code (e.g. CN)"
                className="max-w-xs bg-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]"
              />
              <Button variant="outline" className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]">
                1 Hour
              </Button>
              <Button variant="outline" className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]">
                24 Hours
              </Button>
              <Button variant="outline" className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]">
                7 Days
              </Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white gap-2">
                <Ban className="h-4 w-4" />
                Block
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
