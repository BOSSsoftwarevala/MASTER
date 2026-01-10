import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAiDecisions } from '@/hooks/useAiCeoData';
import {
  ScrollText,
  CheckCircle,
  XCircle,
  Brain,
  Clock,
  User,
  Sparkles,
} from 'lucide-react';

export default function AiCeoDecisionLog() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { data: decisions, isLoading } = useAiDecisions(50);

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24" />)}
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

  const approvedDecisions = decisions?.filter(d => d.was_approved) || [];
  const rejectedDecisions = decisions?.filter(d => !d.was_approved) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ScrollText className="h-6 w-6 text-violet-500" />
            Decision Log
          </h1>
          <p className="text-muted-foreground">Historical record of AI suggestions and your decisions</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                <span className="text-sm text-muted-foreground">Total Suggestions</span>
              </div>
              <div className="text-2xl font-bold mt-1">{decisions?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">Approved</span>
              </div>
              <div className="text-2xl font-bold mt-1 text-green-500">{approvedDecisions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-muted-foreground">Rejected/Pending</span>
              </div>
              <div className="text-2xl font-bold mt-1 text-red-500">{rejectedDecisions.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Decision Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Decision Timeline</CardTitle>
            <CardDescription>What AI suggested and what was decided</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24" />)}
              </div>
            ) : decisions?.length === 0 ? (
              <div className="text-center py-12">
                <ScrollText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Decisions Yet</h3>
                <p className="text-muted-foreground">Decision history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {decisions?.map((decision, index) => (
                  <div 
                    key={decision.id}
                    className={`relative pl-6 pb-4 ${index < (decisions.length - 1) ? 'border-l-2 border-muted' : ''}`}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full ${
                      decision.was_approved ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {decision.was_approved ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <XCircle className="h-4 w-4 text-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="ml-4 p-4 rounded-lg border bg-card">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{decision.action_taken}</h4>
                            <Badge variant={decision.was_approved ? 'default' : 'destructive'} 
                              className={decision.was_approved ? 'bg-green-500' : ''}>
                              {decision.was_approved ? 'Approved' : 'Not Approved'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {decision.user_message}
                          </p>
                        </div>
                      </div>

                      {/* AI Engine */}
                      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                        <Brain className="h-3 w-3" />
                        <span>{decision.ai_engine}</span>
                      </div>

                      {/* Internal Details (collapsed by default in production) */}
                      {decision.internal_details && (
                        <div className="mt-2 p-2 rounded bg-muted text-xs text-muted-foreground">
                          <strong>Internal:</strong> {decision.internal_details}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(decision.created_at).toLocaleString()}
                        </span>
                        {decision.approved_by && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Approved by {decision.approved_by}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Impact Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Impact Summary</CardTitle>
            <CardDescription>Results of approved AI decisions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="text-sm text-muted-foreground mb-1">Cost Savings</div>
                <div className="text-2xl font-bold text-green-500">$4,200</div>
                <p className="text-xs text-muted-foreground mt-1">From approved optimizations</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="text-sm text-muted-foreground mb-1">Incidents Prevented</div>
                <div className="text-2xl font-bold text-blue-500">12</div>
                <p className="text-xs text-muted-foreground mt-1">Via predictive actions</p>
              </div>
              <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
                <div className="text-sm text-muted-foreground mb-1">Performance Gain</div>
                <div className="text-2xl font-bold text-violet-500">+18%</div>
                <p className="text-xs text-muted-foreground mt-1">Average improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
