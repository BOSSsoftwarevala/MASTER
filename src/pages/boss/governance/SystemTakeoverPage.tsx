import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, Pause, CheckCircle, ArrowRight, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const SystemTakeoverPage = () => {
  const { toast } = useToast();

  const { data: takeovers, isLoading, refetch } = useQuery({
    queryKey: ['system-takeovers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_takeovers')
        .select('*')
        .order('started_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const handleEndTakeover = async (id: string) => {
    const { error } = await supabase
      .from('system_takeovers')
      .update({ 
        status: 'ended',
        ended_at: new Date().toISOString(),
        recovery_notes: 'Manually ended by Boss'
      })
      .eq('id', id);
    
    if (error) {
      toast({ title: "Error", description: "Failed to end takeover", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Takeover ended, role restored" });
      refetch();
    }
  };

  const activeTakeovers = takeovers?.filter(t => t.status === 'active') || [];
  const endedTakeovers = takeovers?.filter(t => t.status !== 'active') || [];

  const totalLeadsReassigned = takeovers?.reduce((sum, t) => sum + (t.leads_reassigned || 0), 0) || 0;
  const totalCampaignsPaused = takeovers?.reduce((sum, t) => sum + (t.campaigns_paused || 0), 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">System Takeover Control</h1>
            <p className="text-muted-foreground">Automatic role takeover when humans fail</p>
          </div>
          {activeTakeovers.length > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {activeTakeovers.length} Active Takeover{activeTakeovers.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Shield className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeTakeovers.length}</p>
                  <p className="text-sm text-muted-foreground">Active Takeovers</p>
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
                  <p className="text-2xl font-bold">{activeTakeovers.filter(t => t.backup_pool_assigned).length}</p>
                  <p className="text-sm text-muted-foreground">Pool Assigned</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <ArrowRight className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalLeadsReassigned}</p>
                  <p className="text-sm text-muted-foreground">Leads Reassigned</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Pause className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCampaignsPaused}</p>
                  <p className="text-sm text-muted-foreground">Campaigns Paused</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Takeovers */}
        <Card className="bg-card border-border border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <Shield className="h-5 w-5" />
              Active System Takeovers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : activeTakeovers.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
                <p className="text-muted-foreground">No active takeovers - all roles operational</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Campaigns</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTakeovers.map((takeover) => (
                    <TableRow key={takeover.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{takeover.role_name || 'Unknown'}</p>
                          <Badge variant="outline" className="capitalize text-xs">{takeover.role_type}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{takeover.takeover_reason}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500/10 text-blue-500">{takeover.leads_reassigned} reassigned</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-amber-500/10 text-amber-500">{takeover.campaigns_paused} paused</Badge>
                      </TableCell>
                      <TableCell>{format(new Date(takeover.started_at), 'MMM d, HH:mm')}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-emerald-500 border-emerald-500/20"
                          onClick={() => handleEndTakeover(takeover.id)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          End & Restore
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Takeover History */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Takeover History</CardTitle>
          </CardHeader>
          <CardContent>
            {endedTakeovers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No takeover history</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Recovery Notes</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {endedTakeovers.map((takeover) => (
                    <TableRow key={takeover.id}>
                      <TableCell>
                        <span className="capitalize">{takeover.role_type}</span> - {takeover.role_name}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{takeover.takeover_reason}</TableCell>
                      <TableCell>
                        {takeover.ended_at 
                          ? `${Math.round((new Date(takeover.ended_at).getTime() - new Date(takeover.started_at).getTime()) / (1000 * 60 * 60))}h`
                          : 'Ongoing'
                        }
                      </TableCell>
                      <TableCell>{takeover.recovery_notes || '-'}</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-500/10 text-emerald-500">Recovered</Badge>
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

export default SystemTakeoverPage;
