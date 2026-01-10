import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Shield, TrendingDown, Eye, EyeOff, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const ReputationProtectionPage = () => {
  const { data: reputationScores, isLoading } = useQuery({
    queryKey: ['reputation-scores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_reputation_scores')
        .select('*')
        .order('reputation_score', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const { data: reputationActions } = useQuery({
    queryKey: ['reputation-actions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reputation_actions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    }
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const throttledRoles = reputationScores?.filter(r => r.throttle_percentage > 0) || [];
  const atRiskRoles = reputationScores?.filter(r => r.reputation_score < 70) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reputation Protection</h1>
            <p className="text-muted-foreground">Silent throttling and quality management</p>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            <Shield className="h-3 w-3 mr-1" />
            Brand Protected
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Star className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{reputationScores?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Tracked Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <EyeOff className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{throttledRoles.length}</p>
                  <p className="text-sm text-muted-foreground">Silent Throttled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{atRiskRoles.length}</p>
                  <p className="text-sm text-muted-foreground">At Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Eye className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{reputationActions?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Recent Actions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reputation Scores Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Role Reputation Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reputation</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Response</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Throttle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reputationScores?.map((score) => (
                    <TableRow key={score.id}>
                      <TableCell className="font-medium">{score.role_name || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{score.role_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getScoreColor(Number(score.reputation_score))}`}>
                            {score.reputation_score}%
                          </span>
                          <div className="w-16">
                            <Progress 
                              value={Number(score.reputation_score)} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={getScoreColor(Number(score.quality_score))}>
                        {score.quality_score}%
                      </TableCell>
                      <TableCell className={getScoreColor(Number(score.response_time_score))}>
                        {score.response_time_score}%
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={score.visibility_level === 'full' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : 'bg-amber-500/10 text-amber-500'
                          }
                        >
                          {score.visibility_level === 'full' ? (
                            <><Eye className="h-3 w-3 mr-1" />Full</>
                          ) : (
                            <><EyeOff className="h-3 w-3 mr-1" />Limited</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {score.throttle_percentage > 0 ? (
                          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                            -{score.throttle_percentage}%
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Reputation Actions Log */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Silent Actions Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reputationActions?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No reputation actions recorded</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Type</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Score Change</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Silent</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reputationActions?.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell className="capitalize">{action.role_type}</TableCell>
                      <TableCell className="capitalize">{action.action_type.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <span className={Number(action.new_score) < Number(action.previous_score) ? 'text-red-500' : 'text-emerald-500'}>
                          {action.previous_score}% → {action.new_score}%
                        </span>
                      </TableCell>
                      <TableCell>{action.reason || 'Auto-triggered'}</TableCell>
                      <TableCell>
                        {action.is_silent ? (
                          <Badge className="bg-blue-500/10 text-blue-500">Silent</Badge>
                        ) : (
                          <Badge variant="outline">Visible</Badge>
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(action.created_at), 'MMM d, HH:mm')}</TableCell>
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

export default ReputationProtectionPage;
