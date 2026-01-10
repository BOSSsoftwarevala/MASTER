import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building, Users, Target, TrendingUp, Globe } from 'lucide-react';

export default function FranchiseTerritoryPage() {
  const territory = {
    name: 'Mumbai Central',
    type: 'City',
    state: 'Maharashtra',
    country: 'India',
    assignedDate: '2024-01-15',
    status: 'active',
    stats: {
      totalLeads: 245,
      activeResellers: 5,
      monthlyTarget: 50,
      achieved: 38,
    },
    boundaries: [
      'Parel',
      'Dadar',
      'Matunga',
      'Mahim',
      'Sion',
      'Wadala',
    ],
  };

  return (
    <RoleLayout role="franchise">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Territory
            </h1>
            <p className="text-muted-foreground mt-1">Your assigned franchise territory</p>
          </div>
          <Badge variant="default" className="gap-1 bg-emerald-500">
            <MapPin className="h-3 w-3" />
            {territory.type} Level
          </Badge>
        </div>

        {/* Territory Info Card */}
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-emerald-500" />
              {territory.name}
            </CardTitle>
            <CardDescription>Assigned since {territory.assignedDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">State</p>
                <p className="text-lg font-semibold">{territory.state}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="text-lg font-semibold">{territory.country}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Territory Type</p>
                <Badge variant="outline" className="text-emerald-500 border-emerald-500">
                  {territory.type}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                Total Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{territory.stats.totalLeads}</div>
              <p className="text-xs text-muted-foreground">In your territory</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-violet-500" />
                Active Resellers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet-500">{territory.stats.activeResellers}</div>
              <p className="text-xs text-muted-foreground">Working under you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                Monthly Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{territory.stats.monthlyTarget}</div>
              <p className="text-xs text-muted-foreground">Conversions needed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Building className="h-4 w-4 text-emerald-500" />
                Achieved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">{territory.stats.achieved}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Territory Boundaries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-500" />
              Territory Coverage
            </CardTitle>
            <CardDescription>Areas included in your territory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {territory.boundaries.map((area, index) => (
                <Badge key={index} variant="outline" className="text-sm py-2 px-4">
                  <MapPin className="h-3 w-3 mr-1" />
                  {area}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              All leads and sales within these areas are attributed to your franchise. 
              Contact support to request territory expansion.
            </p>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
}
