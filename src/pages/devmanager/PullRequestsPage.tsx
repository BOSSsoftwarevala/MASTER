import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { usePullRequests, useProjects, useDevelopers, useCreatePullRequest, useUpdatePullRequest, useDevelopmentRealtime } from '@/hooks/useDevelopmentManagerData';
import { Plus, Search, GitPullRequest, ExternalLink, Check, X, GitMerge } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function PullRequestsPage() {
  const { data: pullRequests, isLoading } = usePullRequests();
  const { data: projects } = useProjects();
  const { data: developers } = useDevelopers();
  const createPR = useCreatePullRequest();
  const updatePR = useUpdatePullRequest();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: '',
    source_branch: '',
    target_branch: 'main',
    author_id: '',
    reviewer_id: '',
    pr_url: '',
  });
  useDevelopmentRealtime();

  const filteredPRs = pullRequests?.filter((pr) => {
    const matchesSearch = pr.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getProjectName = (projectId: string) => projects?.find(p => p.id === projectId)?.name || 'Unknown';
  const getDeveloperName = (devId: string | null) => devId ? developers?.find(d => d.id === devId)?.name || 'Unknown' : 'Unassigned';

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      open: 'bg-blue-500/20 text-blue-600',
      approved: 'bg-green-500/20 text-green-600',
      merged: 'bg-purple-500/20 text-purple-600',
      rejected: 'bg-red-500/20 text-red-600',
      closed: 'bg-gray-500/20 text-gray-600',
    };
    return <Badge className={styles[status] || ''}>{status}</Badge>;
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.project_id || !formData.source_branch) return;
    await createPR.mutateAsync({
      title: formData.title,
      description: formData.description || null,
      project_id: formData.project_id,
      source_branch: formData.source_branch,
      target_branch: formData.target_branch,
      author_id: formData.author_id || null,
      reviewer_id: formData.reviewer_id || null,
      pr_url: formData.pr_url || null,
      status: 'open',
      task_id: null,
      merge_commit_hash: null,
      merged_at: null,
      merged_by: null,
    });
    setFormData({ title: '', description: '', project_id: '', source_branch: '', target_branch: 'main', author_id: '', reviewer_id: '', pr_url: '' });
    setIsCreateOpen(false);
  };

  const handleApprove = async (id: string) => {
    await updatePR.mutateAsync({ id, status: 'approved' });
  };

  const handleMerge = async (id: string) => {
    await updatePR.mutateAsync({ id, status: 'merged', merged_at: new Date().toISOString() });
  };

  const handleReject = async (id: string) => {
    await updatePR.mutateAsync({ id, status: 'rejected' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pull Requests</h1>
            <p className="text-muted-foreground">Track code changes and merge approvals</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create PR
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Pull Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Feature: Add user authentication"
                  />
                </div>
                <div>
                  <Label>Project</Label>
                  <Select value={formData.project_id} onValueChange={(v) => setFormData({ ...formData, project_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects?.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Source Branch</Label>
                    <Input
                      value={formData.source_branch}
                      onChange={(e) => setFormData({ ...formData, source_branch: e.target.value })}
                      placeholder="feature/auth"
                    />
                  </div>
                  <div>
                    <Label>Target Branch</Label>
                    <Input
                      value={formData.target_branch}
                      onChange={(e) => setFormData({ ...formData, target_branch: e.target.value })}
                      placeholder="main"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Author</Label>
                    <Select value={formData.author_id} onValueChange={(v) => setFormData({ ...formData, author_id: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select author" />
                      </SelectTrigger>
                      <SelectContent>
                        {developers?.map((d) => (
                          <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Reviewer</Label>
                    <Select value={formData.reviewer_id} onValueChange={(v) => setFormData({ ...formData, reviewer_id: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        {developers?.map((d) => (
                          <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>PR URL</Label>
                  <Input
                    value={formData.pr_url}
                    onChange={(e) => setFormData({ ...formData, pr_url: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreate} disabled={createPR.isPending} className="w-full">
                  Create Pull Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search pull requests..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'open', 'approved', 'merged', 'rejected'].map((status) => (
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
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading pull requests...</div>
            ) : filteredPRs?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No pull requests found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPRs?.map((pr) => (
                    <TableRow key={pr.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GitPullRequest className="h-4 w-4 text-cyan-500" />
                          <span className="font-medium">{pr.title}</span>
                          {pr.pr_url && (
                            <a href={pr.pr_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getProjectName(pr.project_id)}</TableCell>
                      <TableCell>
                        <span className="text-xs font-mono">{pr.source_branch} → {pr.target_branch}</span>
                      </TableCell>
                      <TableCell>{getDeveloperName(pr.author_id)}</TableCell>
                      <TableCell>{getStatusBadge(pr.status)}</TableCell>
                      <TableCell>{format(new Date(pr.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {pr.status === 'open' && (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => handleApprove(pr.id)} title="Approve">
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleReject(pr.id)} title="Reject">
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                          {pr.status === 'approved' && (
                            <Button size="sm" variant="ghost" onClick={() => handleMerge(pr.id)} title="Merge">
                              <GitMerge className="h-4 w-4 text-purple-500" />
                            </Button>
                          )}
                        </div>
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
