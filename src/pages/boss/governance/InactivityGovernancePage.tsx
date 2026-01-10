import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Clock, RotateCcw, UserX, CheckCircle, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const InactivityGovernancePage = () => {
  const { toast } = useToast();

  const { data: inactivityFlags, isLoading } = useQuery({
    queryKey: ['inactivity-flags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_inactivity_flags')
        .select('*')
        .order('flagged_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: rerouteLogs } = useQuery({
    queryKey: ['reroute-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_auto_reroute_logs')
        .select('*')
        .order('rerouted_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    }
  });

  const handleResolve = async (id: string) => {
    const { error } = await supabase
      .from('role_inactivity_flags')
      .update({ resolved_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      toast({ title: "Error", description: "Failed to resolve flag", variant: "destructive" });
    } else {
      toast({ title: "Resolved", description: "Inactivity flag resolved" });
    }
  };

  const activeFlags = inactivityFlags?.filter(f => !f.resolved_at) || [];
  const resolvedFlags = inactivityFlags?.filter(f => f.resolved_at) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inactivity Governance</h1>
            <p className="text-muted-foreground">Auto-manage inactive roles and reroute work</p>
          </div>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <Clock className="h-3 w-3 mr-1" />
            {activeFlags.length} Active Flags
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <UserX className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeFlags.length}</p>
                  <p className="text-sm text-muted-foreground">Inactive Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <RotateCcw className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeFlags.filter(f => f.auto_rerouted).length}</p>
                  <p className="text-sm text-muted-foreground">Auto Rerouted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <AlertTriangle className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeFlags.filter(f => f.earnings_paused).length}</p>
                  <p className="text-sm text-muted-foreground">Earnings Paused</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{resolvedFlags.length}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Inactivity Flags */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-red-500" />
              Active Inactivity Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : activeFlags.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No active inactivity flags</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>SLA (hrs)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeFlags.map((flag) => (
                    <TableRow key={flag.id}>
                      <TableCell className="font-medium">{flag.role_name || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{flag.role_type}</Badge>
                      </TableCell>
                      <TableCell>
                        {flag.last_activity_at ? format(new Date(flag.last_activity_at), 'MMM d, HH:mm') : 'Never'}
                      </TableCell>
                      <TableCell>{flag.sla_threshold_hours}h</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {flag.auto_rerouted && (
                            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Rerouted</Badge>
                          )}
                          {flag.earnings_paused && (
                            <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Paused</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => handleResolve(flag.id)}>
                          <Play className="h-3 w-3 mr-1" />
                          Resolve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Reroute Logs */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-amber-500" />
              Auto-Reroute History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rerouteLogs?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No reroute events</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Original Role</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Rerouted At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rerouteLogs?.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="capitalize">{log.original_role_type}</TableCell>
                      <TableCell className="capitalize">{log.entity_type}</TableCell>
                      <TableCell>{log.reason || 'Auto-triggered'}</TableCell>
                      <TableCell>{format(new Date(log.rerouted_at), 'MMM d, HH:mm')}</TableCell>
                      <TableCell>
                        {log.restored_at ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500">Restored</Badge>
                        ) : log.rerouted_to_pool ? (
                          <Badge className="bg-blue-500/10 text-blue-500">Pool Assigned</Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-500">Active</Badge>
                        )}
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
};

export default InactivityGovernancePage;
