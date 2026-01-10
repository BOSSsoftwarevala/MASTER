import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQAApprovals, useProjects, useDevelopers, useCreateQAApproval, useUpdateQAApproval, useDevelopmentRealtime } from '@/hooks/useDevelopmentManagerData';
import { Plus, Search, ShieldCheck, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function QAApprovalsPage() {
  const { data: approvals, isLoading } = useQAApprovals();
  const { data: projects } = useProjects();
  const { data: developers } = useDevelopers();
  const createApproval = useCreateQAApproval();
  const updateApproval = useUpdateQAApproval();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    notes: '',
  });
  useDevelopmentRealtime();

  const filteredApprovals = approvals?.filter((a) => {
    const project = projects?.find(p => p.id === a.project_id);
    const matchesSearch = project?.name.toLowerCase().includes(search.toLowerCase()) ||
                          a.notes?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getProjectName = (projectId: string | null) => projectId ? projects?.find(p => p.id === projectId)?.name || 'Unknown' : '-';
  const getApproverName = (devId: string | null, name: string | null) => name || (devId ? developers?.find(d => d.id === devId)?.name : 'Unknown');

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-500/20 text-amber-600',
      approved: 'bg-green-500/20 text-green-600',
      rejected: 'bg-red-500/20 text-red-600',
    };
    return <Badge className={styles[status] || ''}>{status}</Badge>;
  };

  const handleCreate = async () => {
    if (!formData.project_id) return;
    await createApproval.mutateAsync({
      project_id: formData.project_id,
      notes: formData.notes || null,
      status: 'pending',
      build_request_id: null,
      approved_by: null,
      approver_name: null,
      approved_at: null,
    });
    setFormData({ project_id: '', notes: '' });
    setIsCreateOpen(false);
  };

  const handleApprove = async (id: string) => {
    await updateApproval.mutateAsync({ id, status: 'approved', approved_at: new Date().toISOString() });
  };

  const handleReject = async (id: string) => {
    await updateApproval.mutateAsync({ id, status: 'rejected' });
  };

  const pendingCount = approvals?.filter(a => a.status === 'pending').length || 0;
  const approvedCount = approvals?.filter(a => a.status === 'approved').length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">QA Approvals</h1>
            <p className="text-muted-foreground">Quality assurance sign-off for builds</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Request QA Approval
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request QA Approval</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
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
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Describe what needs to be approved..."
                  />
                </div>
                <Button onClick={handleCreate} disabled={createApproval.isPending} className="w-full">
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvals?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search approvals..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
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
              <div className="text-center py-8 text-muted-foreground">Loading approvals...</div>
            ) : filteredApprovals?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No QA approvals found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Approver</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovals?.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-cyan-500" />
                          <span className="font-medium">{getProjectName(approval.project_id)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(approval.status)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {approval.notes || '-'}
                        </span>
                      </TableCell>
                      <TableCell>{getApproverName(approval.approved_by, approval.approver_name) || '-'}</TableCell>
                      <TableCell>{format(new Date(approval.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        {approval.status === 'pending' && (
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleApprove(approval.id)} title="Approve">
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleReject(approval.id)} title="Reject">
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
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
}
