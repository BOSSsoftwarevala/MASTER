import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Crown, RotateCcw, Shield, History, CheckCircle, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const BossOverridePage = () => {
  const { toast } = useToast();

  const { data: overrideLogs, isLoading, refetch } = useQuery({
    queryKey: ['boss-override-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('boss_override_logs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const handleRollback = async (id: string) => {
    const { error } = await supabase
      .from('boss_override_logs')
      .update({ rolled_back_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      toast({ title: "Error", description: "Failed to rollback", variant: "destructive" });
    } else {
      toast({ title: "Rolled Back", description: "Override has been rolled back" });
      refetch();
    }
  };

  const activeOverrides = overrideLogs?.filter(o => !o.rolled_back_at && o.rollback_available) || [];
  const recentOverrides = overrideLogs?.slice(0, 20) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Boss Override Control</h1>
            <p className="text-muted-foreground">Final authority - silent override and rollback</p>
          </div>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <Crown className="h-3 w-3 mr-1" />
            Owner Authority
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Crown className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overrideLogs?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Overrides</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <RotateCcw className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeOverrides.length}</p>
                  <p className="text-sm text-muted-foreground">Rollback Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Shield className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-sm text-muted-foreground">Authority Level</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <History className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overrideLogs?.filter(o => o.rolled_back_at).length || 0}</p>
                  <p className="text-sm text-muted-foreground">Rolled Back</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Override Guarantee Card */}
        <Card className="bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Crown className="h-8 w-8 text-amber-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Final Override Guarantee</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>• <strong>Silent Override:</strong> Modify any system state without role notification</li>
                  <li>• <strong>Full Rollback:</strong> Revert any action to previous state</li>
                  <li>• <strong>History View:</strong> Complete audit trail of all overrides</li>
                  <li>• <strong>No Dependency:</strong> System operates without relying on any role</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rollback Available */}
        {activeOverrides.length > 0 && (
          <Card className="bg-card border-border border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-blue-500" />
                Overrides Available for Rollback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeOverrides.map((override) => (
                    <TableRow key={override.id}>
                      <TableCell className="capitalize">{override.override_type.replace('_', ' ')}</TableCell>
                      <TableCell className="capitalize">{override.target_entity_type || '-'}</TableCell>
                      <TableCell>{override.action_taken}</TableCell>
                      <TableCell className="max-w-xs truncate">{override.reason || '-'}</TableCell>
                      <TableCell>{format(new Date(override.created_at), 'MMM d, HH:mm')}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-amber-500 border-amber-500/20"
                          onClick={() => handleRollback(override.id)}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Rollback
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Override History */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              Override History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : recentOverrides.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No override actions recorded</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Override actions from System Freeze, Access Override, and other Boss controls will appear here
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOverrides.map((override) => (
                    <TableRow key={override.id}>
                      <TableCell className="capitalize">{override.override_type.replace('_', ' ')}</TableCell>
                      <TableCell className="capitalize">{override.target_entity_type || '-'}</TableCell>
                      <TableCell>{override.action_taken}</TableCell>
                      <TableCell>{format(new Date(override.created_at), 'MMM d, HH:mm')}</TableCell>
                      <TableCell>
                        {override.rolled_back_at ? (
                          <Badge className="bg-amber-500/10 text-amber-500">Rolled Back</Badge>
                        ) : override.rollback_available ? (
                          <Badge className="bg-blue-500/10 text-blue-500">Active</Badge>
                        ) : (
                          <Badge variant="outline">Permanent</Badge>
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

export default BossOverridePage;
