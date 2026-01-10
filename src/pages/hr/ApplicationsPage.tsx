import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Search, Eye, Check, X, Calendar, Star } from 'lucide-react';
import { useJobApplications, useUpdateJobApplication, JobApplication } from '@/hooks/useHRData';

export default function ApplicationsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: '',
    interview_notes: '',
    rating: 0,
  });
  
  const { data: applications, isLoading } = useJobApplications(statusFilter || undefined);
  const updateApplication = useUpdateJobApplication();

  const filteredApplications = applications?.filter(app => 
    app.candidate_name.toLowerCase().includes(search.toLowerCase()) ||
    app.candidate_email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      applied: 'bg-blue-500/10 text-blue-500',
      screening: 'bg-purple-500/10 text-purple-500',
      shortlisted: 'bg-green-500/10 text-green-500',
      interview: 'bg-amber-500/10 text-amber-500',
      offered: 'bg-emerald-500/10 text-emerald-500',
      hired: 'bg-green-600/10 text-green-600',
      rejected: 'bg-red-500/10 text-red-500',
    };
    return (
      <Badge className={colors[status] || 'bg-gray-500/10 text-gray-500'}>
        {status}
      </Badge>
    );
  };

  const openReviewDialog = (app: JobApplication) => {
    setSelectedApp(app);
    setReviewData({
      status: app.status,
      interview_notes: app.interview_notes || '',
      rating: app.rating || 0,
    });
    setReviewDialogOpen(true);
  };

  const handleReview = async () => {
    if (selectedApp) {
      await updateApplication.mutateAsync({
        id: selectedApp.id,
        ...reviewData,
        reviewed_at: new Date().toISOString(),
      } as any);
      setReviewDialogOpen(false);
      setSelectedApp(null);
    }
  };

  const quickAction = async (id: string, status: string) => {
    await updateApplication.mutateAsync({ id, status: status as any, reviewed_at: new Date().toISOString() });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Job Applications</h1>
          <p className="text-muted-foreground">Review and manage candidate applications</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by candidate name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {['', 'applied', 'screening', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status || 'All'}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading applications...</div>
            ) : filteredApplications?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No applications found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications?.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.candidate_name}</TableCell>
                      <TableCell>{app.candidate_email}</TableCell>
                      <TableCell>{(app.job_openings as any)?.title || '-'}</TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell>
                        {app.rating ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            {app.rating}/5
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(app.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openReviewDialog(app)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {app.status === 'applied' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => quickAction(app.id, 'shortlisted')}
                              >
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => quickAction(app.id, 'rejected')}
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
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

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">{selectedApp.candidate_name}</p>
                <p className="text-sm text-muted-foreground">{selectedApp.candidate_email}</p>
                {selectedApp.candidate_phone && (
                  <p className="text-sm text-muted-foreground">{selectedApp.candidate_phone}</p>
                )}
              </div>

              {selectedApp.cover_letter && (
                <div>
                  <Label>Cover Letter</Label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-md">{selectedApp.cover_letter}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={reviewData.status}
                  onValueChange={(value) => setReviewData({ ...reviewData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offered">Offered</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rating (1-5)</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      type="button"
                      variant={reviewData.rating === rating ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setReviewData({ ...reviewData, rating })}
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={reviewData.interview_notes}
                  onChange={(e) => setReviewData({ ...reviewData, interview_notes: e.target.value })}
                  placeholder="Add interview notes or feedback..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReview} disabled={updateApplication.isPending}>
              Save Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
