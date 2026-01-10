import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSupportData } from '@/hooks/useSupportData';
import { useNavigate } from 'react-router-dom';
import { Plus, Headphones, Play, Pause, Square, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  active: 'bg-green-500/10 text-green-500',
  paused: 'bg-blue-500/10 text-blue-500',
  ended: 'bg-muted text-muted-foreground',
};

export default function AssistSessionsPage() {
  const navigate = useNavigate();
  const { assistSessions, loading, updateAssistSession, endAssistSession } = useSupportData();

  const handleEndSession = async (id: string) => {
    await endAssistSession(id, 'Manually ended by agent');
  };

  const handlePauseSession = async (id: string) => {
    await updateAssistSession(id, { 
      status: 'paused',
      paused_at: new Date().toISOString(),
    });
  };

  const handleResumeSession = async (id: string) => {
    await updateAssistSession(id, { 
      status: 'active',
      paused_at: null,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assist Sessions</h1>
            <p className="text-muted-foreground mt-1">Ultra-secure remote assistance sessions</p>
          </div>
          <Button onClick={() => navigate('/dashboard/support/assist/create')} className="gap-2">
            <Plus className="h-4 w-4" />
            New Session
          </Button>
        </div>

        {/* Security Notice */}
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 py-4">
            <Shield className="h-5 w-5 text-amber-500" />
            <p className="text-sm text-muted-foreground">
              <strong>Security:</strong> All assist sessions require explicit client consent. Sessions are logged and can be recorded for quality assurance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              All Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : assistSessions.length === 0 ? (
              <div className="text-center py-12">
                <Headphones className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No assist sessions found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session Code</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Consent</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assistSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-mono">{session.session_code}</TableCell>
                      <TableCell>{session.client_name}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[session.status || 'pending']}>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={session.client_consent_given ? 'default' : 'secondary'}>
                          {session.client_consent_given ? 'Given' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {session.started_at ? format(new Date(session.started_at), 'MMM d, HH:mm') : 'Not started'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {session.status === 'active' && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handlePauseSession(session.id)}>
                                <Pause className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">
                                    <Square className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>End Session?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will immediately disconnect the session. The client will be notified.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleEndSession(session.id)}>End Session</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                          {session.status === 'paused' && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleResumeSession(session.id)}>
                                <Play className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">
                                    <Square className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>End Session?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will immediately disconnect the session.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleEndSession(session.id)}>End Session</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
