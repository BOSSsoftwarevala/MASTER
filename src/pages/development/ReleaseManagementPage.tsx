import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Calendar, GitCommit, Rocket, User, FileText, Loader2 } from "lucide-react";
import { useDeployRequests } from "@/hooks/useDevelopmentData";

const ReleaseManagementPage = () => {
  const { data: deployRequests, isLoading } = useDeployRequests();

  // Filter only successful deployments for release history
  const releases = deployRequests?.filter(d => d.status === 'success') || [];

  const getVersionType = (version: string) => {
    if (version.includes('.0.0')) return 'major';
    if (version.endsWith('.0')) return 'minor';
    return 'patch';
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "latest":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Latest</Badge>;
      case "major":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Major</Badge>;
      case "minor":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Minor</Badge>;
      case "patch":
        return <Badge variant="secondary">Patch</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const versionTags = releases.slice(0, 5).map((release, index) => ({
    version: release.version,
    type: index === 0 ? 'latest' : getVersionType(release.version),
    date: new Date(release.deployed_at || release.created_at).toLocaleDateString()
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Release Management</h1>
          <p className="text-muted-foreground">View release notes, version tags, and deployment history (Read Only)</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : releases.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="py-12 text-center">
              <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No successful deployments yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Version Tags */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Version Tags
                </CardTitle>
                <CardDescription>All production version tags</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {versionTags.map((tag) => (
                    <div key={tag.version} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-3">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono font-medium">{tag.version}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeBadge(tag.type)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Deployment History */}
            <div className="lg:col-span-2">
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Deployment History
                  </CardTitle>
                  <CardDescription>Complete history of all releases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {releases.map((release, index) => (
                      <div key={release.id} className="relative pl-6 pb-6 last:pb-0">
                        {/* Timeline line */}
                        {index < releases.length - 1 && (
                          <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-border/50" />
                        )}
                        
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1 w-[18px] h-[18px] rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>

                        <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono font-bold text-primary">{release.version}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(release.deployed_at || release.created_at).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {release.requested_by.substring(0, 8)}...
                                </span>
                              </div>
                            </div>
                            <Badge variant="secondary">{release.environment}</Badge>
                          </div>
                          {release.release_notes && (
                            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-border/30">
                              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <p className="text-sm text-muted-foreground">{release.release_notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReleaseManagementPage;
