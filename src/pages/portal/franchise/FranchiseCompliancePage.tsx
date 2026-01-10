import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, Lock, FileText } from 'lucide-react';

const violations = [
  { id: 1, type: 'SLA Breach', description: 'Delayed response to client ticket #1234', date: '2024-01-15', severity: 'warning' },
  { id: 2, type: 'Territory Violation', description: 'Lead assigned outside territory', date: '2024-01-10', severity: 'minor' },
  { id: 3, type: 'Payment Delay', description: 'Commission payout delayed by 5 days', date: '2024-01-05', severity: 'warning' },
];

export default function FranchiseCompliancePage() {
  const agreementAccepted = true;
  const warningCount = 2;
  const isLocked = false;

  return (
    <RoleLayout role="franchise">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Compliance
            </h1>
            <p className="text-muted-foreground mt-1">Your compliance status and violation history</p>
          </div>
          <Badge variant={isLocked ? 'destructive' : 'default'} className="gap-1">
            {isLocked ? <Lock className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
            {isLocked ? 'Account Locked' : 'Compliant'}
          </Badge>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Agreement Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {agreementAccepted ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-lg font-semibold text-emerald-500">Accepted</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-destructive" />
                    <span className="text-lg font-semibold text-destructive">Not Accepted</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Warning Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{warningCount}</div>
              <p className="text-xs text-muted-foreground">Max 5 before suspension</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Violation History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{violations.length}</div>
              <p className="text-xs text-muted-foreground">Total recorded</p>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${isLocked ? 'from-red-500/10 to-rose-500/10 border-red-500/20' : 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Lock Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-lg font-semibold ${isLocked ? 'text-destructive' : 'text-emerald-500'}`}>
                {isLocked ? 'Locked' : 'Active'}
              </div>
              <p className="text-xs text-muted-foreground">Read-only</p>
            </CardContent>
          </Card>
        </div>

        {/* Violation History */}
        <Card>
          <CardHeader>
            <CardTitle>Violation History</CardTitle>
            <CardDescription>Record of compliance violations (read-only)</CardDescription>
          </CardHeader>
          <CardContent>
            {violations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShieldCheck className="h-12 w-12 mx-auto mb-2 text-emerald-500" />
                <p>No violations recorded. Keep up the good work!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {violations.map((violation) => (
                    <TableRow key={violation.id}>
                      <TableCell className="font-medium">{violation.type}</TableCell>
                      <TableCell className="text-muted-foreground">{violation.description}</TableCell>
                      <TableCell>{violation.date}</TableCell>
                      <TableCell>
                        <Badge variant={violation.severity === 'warning' ? 'secondary' : 'outline'}>
                          {violation.severity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
}
