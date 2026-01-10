import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useApiUsageLogs, useAiExecutionLogs } from '@/hooks/useAiApiManagerData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import {
  Activity,
  Brain,
  Plug,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Zap,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-500',
  running: 'bg-blue-500/10 text-blue-500',
  completed: 'bg-success/10 text-success',
  failed: 'bg-destructive/10 text-destructive',
  cancelled: 'bg-muted text-muted-foreground',
};

export default function AiApiLogsPage() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { data: usageLogs, isLoading: loadingUsage } = useApiUsageLogs(200);
  const { data: executionLogs, isLoading: loadingExecution } = useAiExecutionLogs(200);

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isSuperAdmin()) {
    return <Navigate to="/dashboard/boss" replace />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
            <Activity className="h-8 w-8 text-green-500" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">AI / API Logs</h1>
            <p className="text-muted-foreground mt-1">Monitor all AI executions and API calls</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Plug className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usageLogs?.length || 0}</p>
                <p className="text-sm text-muted-foreground">API Calls</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <Brain className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{executionLogs?.length || 0}</p>
                <p className="text-sm text-muted-foreground">AI Executions</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    (usageLogs?.reduce((sum, log) => sum + (log.cost || 0), 0) || 0) +
                    (executionLogs?.reduce((sum, log) => sum + (log.cost || 0), 0) || 0)
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Total Cost</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {executionLogs?.filter(l => l.status === 'completed').length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Successful</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logs Tabs */}
        <Tabs defaultValue="api" className="space-y-4">
          <TabsList>
            <TabsTrigger value="api" className="gap-2">
              <Plug className="h-4 w-4" />
              API Usage Logs
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Brain className="h-4 w-4" />
              AI Execution Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Usage Logs</CardTitle>
                <CardDescription>Recent API calls to external providers</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsage ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : !usageLogs?.length ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Plug className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No API usage logs yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Response Time</TableHead>
                        <TableHead>Tokens</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usageLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(log.created_at), 'MMM dd, HH:mm:ss')}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{log.endpoint || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.method || 'GET'}</Badge>
                          </TableCell>
                          <TableCell>
                            {log.status_code ? (
                              <Badge className={log.status_code < 400 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}>
                                {log.status_code}
                              </Badge>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.response_time_ms ? `${log.response_time_ms}ms` : '-'}
                          </TableCell>
                          <TableCell className="text-sm">{log.tokens_used || '-'}</TableCell>
                          <TableCell className="text-right font-medium">
                            {log.cost ? formatCurrency(log.cost) : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>AI Execution Logs</CardTitle>
                <CardDescription>AI service execution history</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingExecution ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : !executionLogs?.length ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No AI execution logs yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Input</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Tokens (In/Out)</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {executionLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(log.created_at), 'MMM dd, HH:mm:ss')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.execution_type}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-sm">
                            {log.input_summary || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[log.status]}>
                              {log.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.duration_ms ? `${log.duration_ms}ms` : '-'}
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.tokens_input || 0} / {log.tokens_output || 0}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {log.cost ? formatCurrency(log.cost) : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
