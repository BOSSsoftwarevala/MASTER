import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCodeReviews, usePullRequests, useDevelopers, useUpdateCodeReview, useDevelopmentRealtime } from '@/hooks/useDevelopmentManagerData';
import { Search, FileCode, Check, X, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CodeReviewsPage() {
  const { data: reviews, isLoading } = useCodeReviews();
  const { data: pullRequests } = usePullRequests();
  const { data: developers } = useDevelopers();
  const updateReview = useUpdateCodeReview();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  useDevelopmentRealtime();

  const filteredReviews = reviews?.filter((review) => {
    const pr = pullRequests?.find(p => p.id === review.pull_request_id);
    const matchesSearch = pr?.title.toLowerCase().includes(search.toLowerCase()) || 
                          review.comments?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPRTitle = (prId: string) => pullRequests?.find(p => p.id === prId)?.title || 'Unknown PR';
  const getReviewerName = (devId: string | null, reviewerName: string | null) => devId ? developers?.find(d => d.id === devId)?.name || reviewerName : 'Unknown';

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-500/20 text-amber-600',
      approved: 'bg-green-500/20 text-green-600',
      changes_requested: 'bg-orange-500/20 text-orange-600',
      rejected: 'bg-red-500/20 text-red-600',
    };
    const labels: Record<string, string> = {
      pending: 'Pending',
      approved: 'Approved',
      changes_requested: 'Changes Requested',
      rejected: 'Rejected',
    };
    return <Badge className={styles[status] || ''}>{labels[status] || status}</Badge>;
  };

  const handleApprove = async (id: string) => {
    await updateReview.mutateAsync({ id, status: 'approved', reviewed_at: new Date().toISOString() });
  };

  const handleRequestChanges = async (id: string) => {
    await updateReview.mutateAsync({ id, status: 'changes_requested', reviewed_at: new Date().toISOString() });
  };

  const handleReject = async (id: string) => {
    await updateReview.mutateAsync({ id, status: 'rejected', reviewed_at: new Date().toISOString() });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Code Reviews</h1>
            <p className="text-muted-foreground">Track and manage code review feedback</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'pending', 'approved', 'changes_requested', 'rejected'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === 'changes_requested' ? 'Changes' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
            ) : filteredReviews?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No code reviews found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pull Request</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Reviewed At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews?.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileCode className="h-4 w-4 text-cyan-500" />
                          <span className="font-medium">{getPRTitle(review.pull_request_id)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{review.reviewer_name || getReviewerName(review.reviewer_id, review.reviewer_name)}</TableCell>
                      <TableCell>{getStatusBadge(review.status)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {review.comments || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {review.reviewed_at ? format(new Date(review.reviewed_at), 'MMM d, yyyy') : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {review.status === 'pending' && (
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleApprove(review.id)} title="Approve">
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleRequestChanges(review.id)} title="Request Changes">
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleReject(review.id)} title="Reject">
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
