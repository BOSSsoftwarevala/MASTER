import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  XCircle, 
  Clock,
  Shield,
  FileText,
  CheckCircle
} from 'lucide-react';

const penalties = [
  { 
    id: 1,
    type: 'Missed Follow-up',
    reason: 'Failed to contact lead #4521 within 24 hours',
    severity: 'warning',
    status: 'active',
    issuedAt: 'Jan 3, 2026',
    amount: null
  },
  { 
    id: 2,
    type: 'Lead Rejection',
    reason: 'Rejected lead without valid reason',
    severity: 'warning',
    status: 'resolved',
    issuedAt: 'Dec 28, 2025',
    resolvedAt: 'Dec 30, 2025',
    amount: null
  },
  { 
    id: 3,
    type: 'SLA Breach',
    reason: 'Response time exceeded 48 hours for 3 leads',
    severity: 'penalty',
    status: 'active',
    issuedAt: 'Dec 20, 2025',
    amount: 50
  },
];

const warnings = [
  { 
    title: 'Low Follow-up Rate',
    description: 'Your follow-up rate is 78%, below the required 90%',
    action: 'Improve to avoid penalties'
  },
  { 
    title: 'Lead Response Time',
    description: 'Average response time is 18 hours, target is 12 hours',
    action: 'Respond faster to new leads'
  },
];

export default function ResellerPenaltiesPage() {
  return (
    <RoleLayout role="reseller">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Penalty & Warning Screen</h1>
            <p className="text-muted-foreground">View and resolve any penalties or warnings</p>
          </div>
          <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            <AlertTriangle className="h-3 w-3 mr-1" />
            2 Active Issues
          </Badge>
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Warnings</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Penalties</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <p className="text-2xl font-bold text-emerald-500">Good</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pre-emptive Warnings */}
        {warnings.length > 0 && (
          <Card className="border-amber-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="h-5 w-5" />
                Pre-emptive Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {warnings.map((warning, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="font-medium">{warning.title}</p>
                    <p className="text-sm text-muted-foreground">{warning.description}</p>
                    <p className="text-sm text-amber-400 mt-2">→ {warning.action}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Penalty History */}
        <Card>
          <CardHeader>
            <CardTitle>Penalty & Warning History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {penalties.map((penalty) => (
                <div key={penalty.id} className={`flex items-start justify-between p-4 rounded-lg ${
                  penalty.status === 'resolved' 
                    ? 'bg-muted/50' 
                    : penalty.severity === 'penalty' 
                      ? 'bg-red-500/10 border border-red-500/30'
                      : 'bg-amber-500/10 border border-amber-500/30'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      penalty.status === 'resolved' ? 'bg-emerald-500/20' :
                      penalty.severity === 'penalty' ? 'bg-red-500/20' : 'bg-amber-500/20'
                    }`}>
                      {penalty.status === 'resolved' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : penalty.severity === 'penalty' ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{penalty.type}</p>
                      <p className="text-sm text-muted-foreground">{penalty.reason}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Issued: {penalty.issuedAt}</span>
                        {penalty.resolvedAt && (
                          <>
                            <span>•</span>
                            <span>Resolved: {penalty.resolvedAt}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={
                      penalty.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      penalty.severity === 'penalty' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }>
                      {penalty.status === 'resolved' ? 'Resolved' : penalty.severity}
                    </Badge>
                    {penalty.amount && (
                      <p className="text-sm font-medium text-red-400 mt-1">-${penalty.amount}</p>
                    )}
                    {penalty.status !== 'resolved' && (
                      <Button size="sm" variant="outline" className="mt-2">
                        <FileText className="h-3 w-3 mr-1" />
                        Appeal
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-sm text-blue-400">
            <strong>Note:</strong> Accumulating 3+ active penalties may result in temporary account suspension. 
            Resolve issues promptly to maintain good standing.
          </p>
        </div>
      </div>
    </RoleLayout>
  );
}
