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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Star, Target, Check } from 'lucide-react';
import { 
  usePerformanceReviews, useUpdatePerformanceReview,
  useEmployeeGoals, useUpdateEmployeeGoal,
  PerformanceReview, EmployeeGoal 
} from '@/hooks/useHRData';

export default function ReviewsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editReview, setEditReview] = useState<PerformanceReview | null>(null);
  const [reviewData, setReviewData] = useState({
    status: '',
    overall_rating: 0,
    strengths: '',
    improvements: '',
    reviewer_comments: '',
  });
  
  const { data: reviews, isLoading: loadingReviews } = usePerformanceReviews(statusFilter || undefined);
  const { data: goals, isLoading: loadingGoals } = useEmployeeGoals();
  const updateReview = useUpdatePerformanceReview();
  const updateGoal = useUpdateEmployeeGoal();

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-gray-500/10 text-gray-500',
      in_progress: 'bg-blue-500/10 text-blue-500',
      submitted: 'bg-purple-500/10 text-purple-500',
      acknowledged: 'bg-green-500/10 text-green-500',
      closed: 'bg-muted text-muted-foreground',
    };
    return (
      <Badge className={colors[status] || 'bg-gray-500/10 text-gray-500'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getGoalStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'secondary',
      completed: 'default',
      cancelled: 'outline',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const openEditDialog = (review: PerformanceReview) => {
    setEditReview(review);
    setReviewData({
      status: review.status,
      overall_rating: review.overall_rating || 0,
      strengths: review.strengths || '',
      improvements: review.improvements || '',
      reviewer_comments: review.reviewer_comments || '',
    });
  };

  const handleUpdateReview = async () => {
    if (editReview) {
      const updates: any = {
        id: editReview.id,
        ...reviewData,
      };
      
      if (reviewData.status === 'submitted' && editReview.status !== 'submitted') {
        updates.submitted_at = new Date().toISOString();
      }
      if (reviewData.status === 'closed' && editReview.status !== 'closed') {
        updates.closed_at = new Date().toISOString();
      }
      
      await updateReview.mutateAsync(updates);
      setEditReview(null);
    }
  };

  const markGoalComplete = async (id: string) => {
    await updateGoal.mutateAsync({
      id,
      status: 'completed',
      progress: 100,
      completed_at: new Date().toISOString(),
    } as any);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Performance</h1>
            <p className="text-muted-foreground">Manage reviews, goals, and feedback</p>
          </div>
          <Button onClick={() => navigate('/dashboard/hr/reviews/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Start Review
          </Button>
        </div>

        <Tabs defaultValue="reviews">
          <TabsList>
            <TabsTrigger value="reviews">
              <Star className="h-4 w-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="goals">
              <Target className="h-4 w-4 mr-2" />
              Goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reviews..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex gap-2">
                    {['', 'pending', 'in_progress', 'submitted', 'closed'].map((status) => (
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
                {loadingReviews ? (
                  <div className="text-center py-8">Loading reviews...</div>
                ) : reviews?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No reviews found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews?.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell className="font-medium">
                            {(review.employees as any)?.first_name} {(review.employees as any)?.last_name}
                          </TableCell>
                          <TableCell>
                            {new Date(review.review_period_start).toLocaleDateString()} - {new Date(review.review_period_end).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{getStatusBadge(review.status)}</TableCell>
                          <TableCell>
                            {review.overall_rating ? (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                {review.overall_rating}/5
                              </div>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            {review.submitted_at 
                              ? new Date(review.submitted_at).toLocaleDateString() 
                              : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(review)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Employee Goals</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingGoals ? (
                  <div className="text-center py-8">Loading goals...</div>
                ) : goals?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No goals found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Goal</TableHead>
                        <TableHead>Target Date</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {goals?.map((goal) => (
                        <TableRow key={goal.id}>
                          <TableCell className="font-medium">
                            {(goal.employees as any)?.first_name} {(goal.employees as any)?.last_name}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{goal.title}</div>
                            {goal.description && (
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {goal.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {goal.target_date 
                              ? new Date(goal.target_date).toLocaleDateString() 
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary"
                                  style={{ width: `${goal.progress}%` }}
                                />
                              </div>
                              <span className="text-sm">{goal.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{getGoalStatusBadge(goal.status)}</TableCell>
                          <TableCell className="text-right">
                            {goal.status === 'active' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => markGoalComplete(goal.id)}
                              >
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!editReview} onOpenChange={() => setEditReview(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Performance Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Overall Rating (1-5)</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    type="button"
                    variant={reviewData.overall_rating === rating ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setReviewData({ ...reviewData, overall_rating: rating })}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Strengths</Label>
              <Textarea
                value={reviewData.strengths}
                onChange={(e) => setReviewData({ ...reviewData, strengths: e.target.value })}
                placeholder="Key strengths observed..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Areas for Improvement</Label>
              <Textarea
                value={reviewData.improvements}
                onChange={(e) => setReviewData({ ...reviewData, improvements: e.target.value })}
                placeholder="Areas that need improvement..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Reviewer Comments</Label>
              <Textarea
                value={reviewData.reviewer_comments}
                onChange={(e) => setReviewData({ ...reviewData, reviewer_comments: e.target.value })}
                placeholder="Additional comments..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditReview(null)}>Cancel</Button>
            <Button onClick={handleUpdateReview} disabled={updateReview.isPending}>
              Save Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
