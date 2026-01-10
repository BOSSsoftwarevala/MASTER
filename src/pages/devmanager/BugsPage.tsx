import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useBugs, useProjects, useDevelopers, useDevelopmentRealtime } from '@/hooks/useDevelopmentManagerData';
import { Plus, Search, Bug, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function BugsPage() {
  const navigate = useNavigate();
  const { data: bugs, isLoading } = useBugs();
  const { data: projects } = useProjects();
  const { data: developers } = useDevelopers();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  useDevelopmentRealtime();

  const filteredBugs = bugs?.filter((bug) => {
    const matchesSearch = bug.title.toLowerCase().includes(search.toLowerCase()) ||
                          bug.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bug.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getProjectName = (projectId: string) => {
    return projects?.find(p => p.id === projectId)?.name || 'Unknown';
  };

  const getDeveloperName = (devId: string | null) => {
    if (!devId) return 'Unassigned';
    return developers?.find(d => d.id === devId)?.name || 'Unknown';
  };

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-500/20 text-gray-600',
      medium: 'bg-blue-500/20 text-blue-600',
      high: 'bg-amber-500/20 text-amber-600',
      critical: 'bg-red-500/20 text-red-600',
      blocker: 'bg-red-600/30 text-red-700',
    };
    return <Badge className={colors[severity] || ''}>{severity}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-red-500/20 text-red-600',
      in_progress: 'bg-amber-500/20 text-amber-600',
      resolved: 'bg-green-500/20 text-green-600',
      closed: 'bg-gray-500/20 text-gray-600',
      wont_fix: 'bg-gray-500/20 text-gray-600',
    };
    return <Badge className={colors[status] || ''}>{status.replace('_', ' ')}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bug Tracking</h1>
            <p className="text-muted-foreground">Track and manage bugs</p>
          </div>
          <Button onClick={() => navigate('/dashboard/devmanager/bugs/report')}>
            <Plus className="mr-2 h-4 w-4" />
            Report Bug
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              All Bugs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search bugs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === 'all' ? 'All' : status.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading bugs...</div>
            ) : filteredBugs?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No bugs found</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Reported</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBugs?.map((bug) => (
                      <TableRow key={bug.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {bug.title}
                        </TableCell>
                        <TableCell>{getProjectName(bug.project_id)}</TableCell>
                        <TableCell>{getSeverityBadge(bug.severity)}</TableCell>
                        <TableCell>{getStatusBadge(bug.status)}</TableCell>
                        <TableCell>{getDeveloperName(bug.assigned_to)}</TableCell>
                        <TableCell>
                          {format(new Date(bug.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/dashboard/devmanager/bugs/edit/${bug.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
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
