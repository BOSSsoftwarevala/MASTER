import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Users, CheckCircle, Eye, EyeOff, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ZeroBlameIncidentsPage = () => {
  const { toast } = useToast();

  const { data: incidents, isLoading, refetch } = useQuery({
    queryKey: ['zero-blame-incidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('zero_blame_incidents')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const handleResolve = async (id: string) => {
    const { error } = await supabase
      .from('zero_blame_incidents')
      .update({ resolved: true, resolved_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      toast({ title: "Error", description: "Failed to resolve incident", variant: "destructive" });
    } else {
      toast({ title: "Resolved", description: "Incident marked as resolved" });
      refetch();
    }
  };

  const activeIncidents = incidents?.filter(i => !i.resolved) || [];
  const resolvedIncidents = incidents?.filter(i => i.resolved) || [];
  const totalAffectedUsers = incidents?.reduce((sum, i) => sum + (i.affected_users || 0), 0) || 0;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return <Badge className="bg-red-500/10 text-red-500">High</Badge>;
      case 'medium': return <Badge className="bg-amber-500/10 text-amber-500">Medium</Badge>;
      default: return <Badge className="bg-blue-500/10 text-blue-500">Low</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Zero-Blame Incidents</h1>
            <p className="text-muted-foreground">Neutral messaging - no role exposed to users</p>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            <Shield className="h-3 w-3 mr-1" />
            Trust Protected
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <MessageSquare className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeIncidents.length}</p>
                  <p className="text-sm text-muted-foreground">Active Incidents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalAffectedUsers}</p>
                  <p className="text-sm text-muted-foreground">Users Affected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <EyeOff className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-sm text-muted-foreground">Blame Hidden</p>
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
                  <p className="text-2xl font-bold">{resolvedIncidents.length}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Principle Card */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <EyeOff className="h-8 w-8 text-purple-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Zero-Blame Philosophy</h3>
                <p className="text-muted-foreground">
                  No role ever sees "error caused by X". Users only receive neutral system messages like 
                  "We are working on improving your experience". Real causes are logged internally for Boss review only. 
                  This protects trust and prevents internal conflict.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Incidents */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-500" />
              Active Incidents (Boss View Only)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : activeIncidents.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
                <p className="text-muted-foreground">No active incidents</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Actual Cause (Hidden)</TableHead>
                    <TableHead>User Message (Shown)</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Affected</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="capitalize">{incident.incident_type.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="text-red-400">{incident.actual_cause}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                          <span className="text-emerald-500">"{incident.user_facing_message}"</span>
                        </div>
                      </TableCell>
                      <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                      <TableCell>{incident.affected_users} users</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => handleResolve(incident.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" />
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

        {/* Incident History */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Incident History</CardTitle>
          </CardHeader>
          <CardContent>
            {resolvedIncidents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No resolved incidents</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Actual Cause</TableHead>
                    <TableHead>Affected</TableHead>
                    <TableHead>Resolved</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resolvedIncidents.slice(0, 10).map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="capitalize">{incident.incident_type.replace('_', ' ')}</TableCell>
                      <TableCell className="max-w-xs truncate">{incident.actual_cause}</TableCell>
                      <TableCell>{incident.affected_users} users</TableCell>
                      <TableCell>
                        {incident.resolved_at ? format(new Date(incident.resolved_at), 'MMM d, HH:mm') : '-'}
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

export default ZeroBlameIncidentsPage;
