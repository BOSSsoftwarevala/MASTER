import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useForecasts } from '@/hooks/useAiCeoData';
import {
  TrendingUp,
  DollarSign,
  Server,
  Users,
  AlertTriangle,
  Brain,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function AiCeoPredictions() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { data: forecasts, isLoading } = useForecasts();

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isSuperAdmin) {
    return (
      <DashboardLayout>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>This page is restricted to Super Admins only.</CardDescription>
          </CardHeader>
        </Card>
      </DashboardLayout>
    );
  }

  const getForecastIcon = (type: string) => {
    switch (type) {
      case 'revenue': return <DollarSign className="h-6 w-6" />;
      case 'load': return <Server className="h-6 w-6" />;
      case 'leads': return <Users className="h-6 w-6" />;
      case 'risk': return <AlertTriangle className="h-6 w-6" />;
      default: return <TrendingUp className="h-6 w-6" />;
    }
  };

  const getForecastColor = (type: string) => {
    switch (type) {
      case 'revenue': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'load': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'leads': return 'text-violet-500 bg-violet-500/10 border-violet-500/30';
      case 'risk': return 'text-red-500 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const formatValue = (type: string, value: number) => {
    switch (type) {
      case 'revenue': return `$${(value / 1000).toFixed(0)}K`;
      case 'load': return `${value}%`;
      case 'leads': return value.toString();
      case 'risk': return `${value}%`;
      default: return value.toString();
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.85) return <Badge className="bg-green-500">High Confidence</Badge>;
    if (confidence >= 0.70) return <Badge variant="secondary">Medium Confidence</Badge>;
    return <Badge variant="outline">Low Confidence</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            Prediction & Forecast
          </h1>
          <p className="text-muted-foreground">AI-powered forecasts for revenue, load, leads, and risk</p>
        </div>

        {/* AI Disclaimer */}
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="py-3 flex items-center gap-3">
            <Brain className="h-5 w-5 text-blue-500" />
            <p className="text-sm">
              Predictions are based on historical patterns and current trends. Confidence scores indicate reliability.
            </p>
          </CardContent>
        </Card>

        {/* Forecast Cards */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48" />)}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {forecasts?.map(forecast => (
              <Card key={forecast.id} className={getForecastColor(forecast.forecast_type)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getForecastIcon(forecast.forecast_type)}
                      <CardTitle className="text-lg capitalize">
                        {forecast.forecast_type} Forecast
                      </CardTitle>
                    </div>
                    {getConfidenceBadge(forecast.confidence)}
                  </div>
                  <CardDescription>{forecast.period}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-4">
                    <div className="text-4xl font-bold">
                      {formatValue(forecast.forecast_type, forecast.predicted_value)}
                    </div>
                    {forecast.forecast_type !== 'risk' && (
                      <div className="text-sm text-green-500 flex items-center gap-1 mb-1">
                        <ArrowUpRight className="h-4 w-4" />
                        +8% vs baseline
                      </div>
                    )}
                    {forecast.forecast_type === 'risk' && forecast.predicted_value < 20 && (
                      <div className="text-sm text-green-500 flex items-center gap-1 mb-1">
                        <ArrowDownRight className="h-4 w-4" />
                        Low risk
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Confidence</span>
                      <span>{Math.round(forecast.confidence * 100)}%</span>
                    </div>
                    <Progress value={forecast.confidence * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detailed Projections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Projection Details
            </CardTitle>
            <CardDescription>Monthly breakdown with confidence intervals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['January', 'February', 'March'].map((month, idx) => (
                <div key={month} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium">{month}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold">${130 + idx * 15}K</span>
                      <span className="text-xs text-muted-foreground">
                        (Range: ${125 + idx * 15}K - ${140 + idx * 15}K)
                      </span>
                    </div>
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full bg-green-500/30 rounded-full"
                        style={{ left: '10%', width: '80%' }}
                      />
                      <div 
                        className="absolute h-full bg-green-500 rounded-full"
                        style={{ left: '35%', width: '30%' }}
                      />
                    </div>
                  </div>
                  <Badge variant="outline">{85 + idx * 3}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Server Load Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Server Load Forecast (24h)
            </CardTitle>
            <CardDescription>Predicted peak times and resource needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border text-center">
                <div className="text-sm text-muted-foreground mb-1">Peak Time</div>
                <div className="text-2xl font-bold text-blue-500">2:00 PM</div>
                <div className="text-xs text-muted-foreground">EST</div>
              </div>
              <div className="p-4 rounded-lg border text-center">
                <div className="text-sm text-muted-foreground mb-1">Expected Load</div>
                <div className="text-2xl font-bold text-amber-500">78%</div>
                <div className="text-xs text-muted-foreground">CPU utilization</div>
              </div>
              <div className="p-4 rounded-lg border text-center">
                <div className="text-sm text-muted-foreground mb-1">Recommendation</div>
                <div className="text-lg font-bold text-green-500">No scaling needed</div>
                <div className="text-xs text-muted-foreground">Capacity sufficient</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead Volume Prediction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lead Volume Prediction
            </CardTitle>
            <CardDescription>Expected lead quality and volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                <div className="text-sm text-muted-foreground mb-1">Hot Leads</div>
                <div className="text-2xl font-bold text-green-500">45</div>
                <div className="text-xs text-green-600">+12% expected</div>
              </div>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
                <div className="text-sm text-muted-foreground mb-1">Warm Leads</div>
                <div className="text-2xl font-bold text-amber-500">128</div>
                <div className="text-xs text-amber-600">+8% expected</div>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
                <div className="text-sm text-muted-foreground mb-1">Cold Leads</div>
                <div className="text-2xl font-bold text-blue-500">167</div>
                <div className="text-xs text-blue-600">-3% expected</div>
              </div>
              <div className="p-4 rounded-lg border text-center">
                <div className="text-sm text-muted-foreground mb-1">Conversion Rate</div>
                <div className="text-2xl font-bold text-violet-500">22%</div>
                <div className="text-xs text-violet-600">+2% expected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Probability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Probability (48h)
            </CardTitle>
            <CardDescription>Likelihood of various risk events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Security Incident</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={8} className="w-32 h-2" />
                  <span className="text-sm font-medium">8%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Server Outage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={3} className="w-32 h-2" />
                  <span className="text-sm font-medium">3%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>API Rate Limit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={25} className="w-32 h-2" />
                  <span className="text-sm font-medium">25%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Budget Overrun</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={12} className="w-32 h-2" />
                  <span className="text-sm font-medium">12%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
