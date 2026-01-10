import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useBuildRequests } from '@/hooks/useDevelopmentData';
import { Plus, Search, Hammer, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function BuildsPage() {
  const navigate = useNavigate();
  const { data: builds, isLoading } = useBuildRequests();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBuilds = builds?.filter((build) => {
    const matchesSearch = build.repo_name.toLowerCase().includes(search.toLowerCase()) ||
                          build.branch.toLowerCase().includes(search.toLowerCase()) ||
                          build.commit_message?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || build.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-600"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'building':
        return <Badge className="bg-blue-500/20 text-blue-600"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Building</Badge>;
      case 'success':
        return <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Success</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-600"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEnvBadge = (env: string) => {
    const colors: Record<string, string> = {
      development: 'bg-gray-500/20 text-gray-600',
      staging: 'bg-blue-500/20 text-blue-600',
      production: 'bg-red-500/20 text-red-600',
    };
    return <Badge className={colors[env] || ''}>{env}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Build Requests</h1>
            <p className="text-muted-foreground">Manage build pipeline and requests</p>
          </div>
          <Button onClick={() => navigate('/dashboard/devmanager/builds/create')}>
            <Plus className="mr-2 h-4 w-4" />
            New Build Request
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hammer className="h-5 w-5" />
              Build History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search builds..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'pending', 'building', 'success', 'failed'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading builds...</div>
            ) : filteredBuilds?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No builds found</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Repository</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Environment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Requested</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBuilds?.map((build) => (
                      <TableRow key={build.id}>
                        <TableCell className="font-medium">{build.repo_name}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{build.branch}</code>
                        </TableCell>
                        <TableCell>{getEnvBadge(build.build_type)}</TableCell>
                        <TableCell>{getStatusBadge(build.status)}</TableCell>
                        <TableCell>
                          {build.build_duration_seconds 
                            ? `${Math.floor(build.build_duration_seconds / 60)}m ${build.build_duration_seconds % 60}s`
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          {format(new Date(build.created_at), 'MMM d, HH:mm')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
