import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useFailedBuilds, useDevelopmentRealtime } from '@/hooks/useDevelopmentManagerData';
import { Search, XCircle, RefreshCw, AlertTriangle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function FailedBuildsPage() {
  const navigate = useNavigate();
  const { data: failedBuilds, isLoading } = useFailedBuilds();
  const [search, setSearch] = useState('');
  const [selectedBuild, setSelectedBuild] = useState<any>(null);
  useDevelopmentRealtime();

  const filteredBuilds = failedBuilds?.filter((build) =>
    build.repo_name.toLowerCase().includes(search.toLowerCase()) ||
    build.branch.toLowerCase().includes(search.toLowerCase()) ||
    build.error_message?.toLowerCase().includes(search.toLowerCase())
  );

  const getBuildTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      development: 'bg-blue-500/20 text-blue-600',
      staging: 'bg-amber-500/20 text-amber-600',
      production: 'bg-green-500/20 text-green-600',
    };
    return <Badge className={styles[type] || ''}>{type}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Failed Builds</h1>
            <p className="text-muted-foreground">Track and diagnose build failures</p>
          </div>
          <Button onClick={() => navigate('/dashboard/devmanager/builds/create')}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Build
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Failed Builds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{failedBuilds?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                With Error Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {failedBuilds?.filter(b => b.error_message).length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                With Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {failedBuilds?.filter(b => b.build_logs).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search failed builds..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading failed builds...</div>
            ) : filteredBuilds?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No failed builds found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repository</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Error</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBuilds?.map((build) => (
                    <TableRow key={build.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="font-medium">{build.repo_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{build.branch}</span>
                      </TableCell>
                      <TableCell>{getBuildTypeBadge(build.build_type)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-red-500 line-clamp-1">
                          {build.error_message || 'No error details'}
                        </span>
                      </TableCell>
                      <TableCell>{build.requested_by}</TableCell>
                      <TableCell>{format(new Date(build.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedBuild(build)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Build Failure Details</DialogTitle>
                            </DialogHeader>
                            {selectedBuild && (
                              <div className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Repository:</span>
                                    <p className="font-medium">{selectedBuild.repo_name}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Branch:</span>
                                    <p className="font-mono">{selectedBuild.branch}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Commit:</span>
                                    <p className="font-mono text-xs">{selectedBuild.commit_hash || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Duration:</span>
                                    <p>{selectedBuild.build_duration_seconds ? `${selectedBuild.build_duration_seconds}s` : 'N/A'}</p>
                                  </div>
                                </div>
                                
                                {selectedBuild.error_message && (
                                  <div>
                                    <span className="text-muted-foreground text-sm">Error Message:</span>
                                    <pre className="mt-1 p-3 bg-red-500/10 text-red-600 rounded-lg text-xs overflow-x-auto">
                                      {selectedBuild.error_message}
                                    </pre>
                                  </div>
                                )}
                                
                                {selectedBuild.failure_reason && (
                                  <div>
                                    <span className="text-muted-foreground text-sm">Failure Reason:</span>
                                    <p className="mt-1 text-sm">{selectedBuild.failure_reason}</p>
                                  </div>
                                )}
                                
                                {selectedBuild.build_logs && (
                                  <div>
                                    <span className="text-muted-foreground text-sm">Build Logs:</span>
                                    <pre className="mt-1 p-3 bg-muted rounded-lg text-xs overflow-x-auto max-h-60">
                                      {selectedBuild.build_logs}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
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
