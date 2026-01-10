import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useRiskIndicators } from '@/hooks/useAiCeoData';
import {
  AlertTriangle,
  Shield,
  DollarSign,
  Settings,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  Activity,
} from 'lucide-react';

export default function AiCeoRiskDetection() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { data: risks, isLoading: risksLoading } = useRiskIndicators();

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
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

  const activeRisks = risks?.filter(r => !r.resolved) || [];
  const resolvedRisks = risks?.filter(r => r.resolved) || [];

  const securityRisks = activeRisks.filter(r => r.type === 'security');
  const financialRisks = activeRisks.filter(r => r.type === 'financial');
  const operationalRisks = activeRisks.filter(r => r.type === 'operational');
  const complianceRisks = activeRisks.filter(r => r.type === 'compliance');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="h-5 w-5" />;
      case 'financial': return <DollarSign className="h-5 w-5" />;
      case 'operational': return <Settings className="h-5 w-5" />;
      case 'compliance': return <FileText className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    }
  };

  const getBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Risk & Anomaly Detection
          </h1>
          <p className="text-muted-foreground">AI-detected threats, anomalies, and security signals</p>
        </div>

        {/* Risk Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className={securityRisks.length > 0 ? 'border-red-500/50' : ''}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${securityRisks.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {securityRisks.length}
              </div>
              <p className="text-xs text-muted-foreground">Active threats</p>
            </CardContent>
          </Card>

          <Card className={financialRisks.length > 0 ? 'border-amber-500/50' : ''}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financial Risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${financialRisks.length > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                {financialRisks.length}
              </div>
              <p className="text-xs text-muted-foreground">Cost anomalies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Operational Risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${operationalRisks.length > 0 ? 'text-blue-500' : 'text-green-500'}`}>
                {operationalRisks.length}
              </div>
              <p className="text-xs text-muted-foreground">System issues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Compliance Risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${complianceRisks.length > 0 ? 'text-violet-500' : 'text-green-500'}`}>
                {complianceRisks.length}
              </div>
              <p className="text-xs text-muted-foreground">Policy violations</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Risks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Active Risk Alerts
            </CardTitle>
            <CardDescription>{activeRisks.length} unresolved risks requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            {risksLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
              </div>
            ) : activeRisks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Active Risks</h3>
                <p className="text-muted-foreground">All systems operating within normal parameters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeRisks.map(risk => (
                  <div 
                    key={risk.id} 
                    className={`p-4 rounded-lg border ${getSeverityColor(risk.severity)}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-background/50">
                        {getTypeIcon(risk.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{risk.title}</h4>
                          <Badge variant={getBadgeVariant(risk.severity)} className="capitalize">
                            {risk.severity}
                          </Badge>
                          <Badge variant="outline" className="capitalize">{risk.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{risk.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Detected {new Date(risk.detected_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Investigate
                        </Button>
                        <Button size="sm">
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Anomaly Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Anomaly Patterns Detected
            </CardTitle>
            <CardDescription>Unusual behaviors and patterns identified by AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Admin Behavior</Badge>
                </div>
                <h4 className="font-medium">Unusual admin login times</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  3 admin logins detected outside normal business hours in the last 7 days
                </p>
                <div className="mt-2 text-xs text-amber-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Low severity - monitoring
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Traffic Pattern</Badge>
                </div>
                <h4 className="font-medium">Traffic spike from new region</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  45% increase in traffic from Southeast Asia region
                </p>
                <div className="mt-2 text-xs text-blue-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Positive trend - reviewing
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Cost Pattern</Badge>
                </div>
                <h4 className="font-medium">AI API usage spike</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  SEO content generation 35% higher than baseline
                </p>
                <div className="mt-2 text-xs text-amber-500 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Cost impact: ~$120 extra
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Security Pattern</Badge>
                </div>
                <h4 className="font-medium">Multiple password resets</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  12 password reset requests from same IP range
                </p>
                <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Potential brute force - blocked
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recently Resolved */}
        {resolvedRisks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Recently Resolved
              </CardTitle>
              <CardDescription>Risks that have been addressed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resolvedRisks.slice(0, 5).map(risk => (
                  <div key={risk.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">{risk.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{risk.type} • {risk.severity}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-500">Resolved</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
