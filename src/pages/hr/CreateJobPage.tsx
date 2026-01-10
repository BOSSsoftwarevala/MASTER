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
import { ArrowLeft, Save, Send } from 'lucide-react';
import { useCreateJobOpening } from '@/hooks/useHRData';

export default function CreateJobPage() {
  const navigate = useNavigate();
  const createJob = useCreateJobOpening();
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    location: '',
    employment_type: 'full_time',
    salary_range_min: 0,
    salary_range_max: 0,
    positions_count: 1,
    status: 'draft' as 'draft' | 'open',
    closes_at: '',
  });

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    const data = {
      ...formData,
      status: publish ? 'open' as const : 'draft' as const,
      posted_at: publish ? new Date().toISOString() : undefined,
    };
    await createJob.mutateAsync(data);
    navigate('/dashboard/hr/jobs');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Post New Job</h1>
            <p className="text-muted-foreground">Create a new job opening</p>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)}>
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Software Engineer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Engineering"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Remote, New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employment_type">Employment Type</Label>
                  <Select
                    value={formData.employment_type}
                    onValueChange={(value) => setFormData({ ...formData, employment_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="intern">Intern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="positions_count">Number of Positions</Label>
                  <Input
                    id="positions_count"
                    type="number"
                    min={1}
                    value={formData.positions_count}
                    onChange={(e) => setFormData({ ...formData, positions_count: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closes_at">Application Deadline</Label>
                  <Input
                    id="closes_at"
                    type="date"
                    value={formData.closes_at}
                    onChange={(e) => setFormData({ ...formData, closes_at: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary_range_min">Salary Range (Min)</Label>
                  <Input
                    id="salary_range_min"
                    type="number"
                    value={formData.salary_range_min}
                    onChange={(e) => setFormData({ ...formData, salary_range_min: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary_range_max">Salary Range (Max)</Label>
                  <Input
                    id="salary_range_max"
                    type="number"
                    value={formData.salary_range_max}
                    onChange={(e) => setFormData({ ...formData, salary_range_max: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="List the required skills, qualifications, and experience..."
                  rows={5}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" variant="secondary" disabled={createJob.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button 
                  type="button" 
                  onClick={(e) => handleSubmit(e, true)} 
                  disabled={createJob.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Publish Job
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
