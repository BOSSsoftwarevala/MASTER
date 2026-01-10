import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Brain, AlertTriangle, CheckCircle, Shield, Zap, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const AiFailsafePage = () => {
  const { toast } = useToast();

  const { data: failsafeEvents, isLoading, refetch } = useQuery({
    queryKey: ['ai-failsafe-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_failsafe_events')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const handleResolve = async (id: string) => {
    const { error } = await supabase
      .from('ai_failsafe_events')
      .update({ resolved: true, resolved_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      toast({ title: "Error", description: "Failed to resolve event", variant: "destructive" });
    } else {
      toast({ title: "Resolved", description: "Failsafe event marked as resolved" });
      refetch();
    }
  };

  const activeEvents = failsafeEvents?.filter(e => !e.resolved) || [];
  const resolvedEvents = failsafeEvents?.filter(e => e.resolved) || [];

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'api_timeout': return <Zap className="h-4 w-4 text-amber-500" />;
      case 'cost_spike': return <DollarSign className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Fail-Safe Control</h1>
            <p className="text-muted-foreground">Auto-recovery when AI systems fail</p>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            <Shield className="h-3 w-3 mr-1" />
            Fail-Safe Active
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeEvents.length}</p>
                  <p className="text-sm text-muted-foreground">Active Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Zap className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {failsafeEvents?.filter(e => e.trigger_type === 'api_timeout').length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">API Timeouts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {failsafeEvents?.filter(e => e.trigger_type === 'cost_spike').length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Cost Spikes</p>
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
                  <p className="text-2xl font-bold">{resolvedEvents.length}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Principle Card */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Brain className="h-8 w-8 text-emerald-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Zero User Impact Guarantee</h3>
                <p className="text-muted-foreground">
                  When AI fails, the system automatically switches to safe static logic. Users never see errors - 
                  only friendly messages like "{failsafeEvents?.[0]?.user_friendly_message || 'System optimizing performance'}". 
                  All failures are logged internally for review.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Events */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Active Failsafe Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : activeEvents.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
                <p className="text-muted-foreground">All AI systems operating normally</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Action Taken</TableHead>
                    <TableHead>Fallback Mode</TableHead>
                    <TableHead>User Message</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTriggerIcon(event.trigger_type)}
                          <span className="capitalize">{event.trigger_type.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>{event.action_taken}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {event.fallback_mode?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-emerald-500">
                        "{event.user_friendly_message}"
                      </TableCell>
                      <TableCell>{format(new Date(event.created_at), 'MMM d, HH:mm')}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => handleResolve(event.id)}>
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

        {/* Event History */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Failsafe Event History</CardTitle>
          </CardHeader>
          <CardContent>
            {resolvedEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No resolved events</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Error Details</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resolved At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resolvedEvents.slice(0, 10).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="capitalize">{event.trigger_type.replace('_', ' ')}</TableCell>
                      <TableCell className="max-w-xs truncate">{event.error_details}</TableCell>
                      <TableCell>{event.action_taken}</TableCell>
                      <TableCell>
                        {event.resolved_at ? format(new Date(event.resolved_at), 'MMM d, HH:mm') : '-'}
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

export default AiFailsafePage;
