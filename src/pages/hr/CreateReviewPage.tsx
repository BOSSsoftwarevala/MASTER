import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useEmployees, useCreatePerformanceReview } from '@/hooks/useHRData';

export default function CreateReviewPage() {
  const navigate = useNavigate();
  const { data: employees } = useEmployees('active');
  const createReview = useCreatePerformanceReview();
  
  const [formData, setFormData] = useState({
    employee_id: '',
    review_period_start: '',
    review_period_end: '',
    goals_achieved: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReview.mutateAsync({
      ...formData,
      status: 'pending',
    });
    navigate('/dashboard/hr/reviews');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Start Performance Review</h1>
            <p className="text-muted-foreground">Create a new performance review</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Review Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee_id">Employee *</Label>
                  <Select
                    value={formData.employee_id}
                    onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees?.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.first_name} {emp.last_name} ({emp.employee_code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div />
                <div className="space-y-2">
                  <Label htmlFor="review_period_start">Review Period Start *</Label>
                  <Input
                    id="review_period_start"
                    type="date"
                    value={formData.review_period_start}
                    onChange={(e) => setFormData({ ...formData, review_period_start: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review_period_end">Review Period End *</Label>
                  <Input
                    id="review_period_end"
                    type="date"
                    value={formData.review_period_end}
                    onChange={(e) => setFormData({ ...formData, review_period_end: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals_achieved">Goals to Review</Label>
                <Textarea
                  id="goals_achieved"
                  value={formData.goals_achieved}
                  onChange={(e) => setFormData({ ...formData, goals_achieved: e.target.value })}
                  placeholder="List the goals and objectives to be reviewed..."
                  rows={5}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createReview.isPending || !formData.employee_id}>
                  <Save className="h-4 w-4 mr-2" />
                  {createReview.isPending ? 'Creating...' : 'Start Review'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
