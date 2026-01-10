import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Code2, 
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Eye,
  GitBranch,
  RotateCcw
} from 'lucide-react';

const recentDeploys = [
  {
    id: 1,
    version: 'v2.4.1',
    environment: 'Production',
    status: 'success',
    deployedBy: 'CI/CD Pipeline',
    deployedAt: '2024-01-15 14:30',
    duration: '4m 23s',
  },
  {
    id: 2,
    version: 'v2.4.0',
    environment: 'Production',
    status: 'success',
    deployedBy: 'John Developer',
    deployedAt: '2024-01-14 09:15',
    duration: '3m 45s',
  },
  {
    id: 3,
    version: 'v2.3.9-hotfix',
    environment: 'Production',
    status: 'success',
    deployedBy: 'CI/CD Pipeline',
    deployedAt: '2024-01-12 22:00',
    duration: '2m 10s',
  },
];

const failedBuilds = [
  {
    id: 1,
    branch: 'feature/payment-gateway',
    error: 'Build failed: TypeScript compilation error',
    failedAt: '2024-01-15 10:20',
    developer: 'Sarah Developer',
  },
];

const rollbackHistory = [
  {
    id: 1,
    from: 'v2.3.8',
    to: 'v2.3.7',
    reason: 'Critical bug in payment processing',
    rolledBackAt: '2024-01-10 15:45',
    rolledBackBy: 'Boss Admin',
  },
];

export default function DeploymentSnapshotPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Deployment Status Snapshot</h1>
          <p className="text-gray-400 mt-1">Read-only overview of deployment pipeline</p>
          <Badge variant="outline" className="mt-2 border-gray-600 text-gray-400">
            <Eye className="h-3 w-3 mr-1" />
            View Only — Redirect to Development module for actions
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Last Deploy</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">v2.4.1</div>
              <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Success Rate</CardTitle>
              <Code2 className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">98.5%</div>
              <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Failed Builds</CardTitle>
              <XCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{failedBuilds.length}</div>
              <p className="text-xs text-gray-500 mt-1">Pending resolution</p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))] border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Rollback Flags</CardTitle>
              <RotateCcw className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{rollbackHistory.length}</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Deployments */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <GitBranch className="h-5 w-5 text-gray-400" />
              Recent Deployments
            </CardTitle>
            <CardDescription className="text-gray-400">Latest production deployments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeploys.map((deploy) => (
                <div key={deploy.id} className="flex items-center justify-between p-4 rounded-lg border border-[hsl(var(--boss-card-border))] bg-[hsl(var(--boss-panel-bg))]">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      deploy.status === 'success' ? 'bg-emerald-900/50' : 'bg-red-900/50'
                    }`}>
                      {deploy.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{deploy.version}</span>
                        <Badge variant="outline" className="border-gray-600 text-gray-400">{deploy.environment}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        By {deploy.deployedBy} • {deploy.deployedAt}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline"
                      className={deploy.status === 'success' 
                        ? 'border-emerald-500/50 bg-emerald-900/30 text-emerald-300' 
                        : 'border-red-500/50 bg-red-900/30 text-red-300'
                      }
                    >
                      {deploy.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{deploy.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Failed Builds */}
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <XCircle className="h-5 w-5 text-red-400" />
                Failed Builds
              </CardTitle>
              <CardDescription className="text-gray-400">Builds requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              {failedBuilds.length > 0 ? (
                <div className="space-y-3">
                  {failedBuilds.map((build) => (
                    <div key={build.id} className="p-3 rounded-lg border border-red-700/50 bg-red-950/30">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-red-400" />
                        <span className="font-medium text-white">{build.branch}</span>
                      </div>
                      <p className="text-sm text-red-300 mt-2">{build.error}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>{build.developer}</span>
                        <span>{build.failedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-emerald-400" />
                  <p className="text-gray-400">No failed builds</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rollback History */}
          <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <RotateCcw className="h-5 w-5 text-amber-400" />
                Rollback History
              </CardTitle>
              <CardDescription className="text-gray-400">Recent rollback actions</CardDescription>
            </CardHeader>
            <CardContent>
              {rollbackHistory.length > 0 ? (
                <div className="space-y-3">
                  {rollbackHistory.map((rollback) => (
                    <div key={rollback.id} className="p-3 rounded-lg border border-amber-700/50 bg-amber-950/30">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{rollback.from}</span>
                        <ArrowRight className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-white">{rollback.to}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{rollback.reason}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>By {rollback.rolledBackBy}</span>
                        <span>{rollback.rolledBackAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-emerald-400" />
                  <p className="text-gray-400">No rollbacks this month</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Redirect Note */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowRight className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-white">Need to take action?</p>
                  <p className="text-sm text-gray-400">Go to Development Control module for full management</p>
                </div>
              </div>
              <Button variant="outline" className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white">
                Open Development Module
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}