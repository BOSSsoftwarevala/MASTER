import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBugs, useUpdateBug, useActiveProjects, useActiveDevelopers } from '@/hooks/useDevelopmentManagerData';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditBugPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: bugs } = useBugs();
  const { data: projects } = useActiveProjects();
  const { data: developers } = useActiveDevelopers();
  const updateBug = useUpdateBug();

  const bug = bugs?.find((b) => b.id === id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical' | 'blocker',
    status: 'open' as 'open' | 'in_progress' | 'resolved' | 'closed' | 'wont_fix',
    assigned_to: '',
    steps_to_reproduce: '',
    expected_behavior: '',
    actual_behavior: '',
    environment: '',
    browser: '',
  });

  useEffect(() => {
    if (bug) {
      setFormData({
        title: bug.title || '',
        description: bug.description || '',
        project_id: bug.project_id || '',
        severity: bug.severity,
        status: bug.status,
        assigned_to: bug.assigned_to || '',
        steps_to_reproduce: bug.steps_to_reproduce || '',
        expected_behavior: bug.expected_behavior || '',
        actual_behavior: bug.actual_behavior || '',
        environment: bug.environment || '',
        browser: bug.browser || '',
      });
    }
  }, [bug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    await updateBug.mutateAsync({
      id,
      ...formData,
    });
    navigate('/dashboard/devmanager/bugs');
  };

  if (!bug) {
    return (
      <DashboardLayout>
        <div className="text-center py-8 text-muted-foreground">Bug not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Bug</h1>
            <p className="text-muted-foreground">Update bug details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Bug Details</CardTitle>
              <CardDescription>Modify the bug report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Bug Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief description of the bug"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the bug"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="steps_to_reproduce">Steps to Reproduce</Label>
                <Textarea
                  id="steps_to_reproduce"
                  value={formData.steps_to_reproduce}
                  onChange={(e) => setFormData({ ...formData, steps_to_reproduce: e.target.value })}
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expected_behavior">Expected Behavior</Label>
                  <Textarea
                    id="expected_behavior"
                    value={formData.expected_behavior}
                    onChange={(e) => setFormData({ ...formData, expected_behavior: e.target.value })}
                    placeholder="What should happen"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actual_behavior">Actual Behavior</Label>
                  <Textarea
                    id="actual_behavior"
                    value={formData.actual_behavior}
                    onChange={(e) => setFormData({ ...formData, actual_behavior: e.target.value })}
                    placeholder="What actually happens"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project_id">Project *</Label>
                  <Select
                    value={formData.project_id}
                    onValueChange={(value) => setFormData({ ...formData, project_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects?.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) =>
                      setFormData({ ...formData, severity: value as typeof formData.severity })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value as typeof formData.status })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="wont_fix">Won't Fix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assigned_to">Assigned To</Label>
                  <Select
                    value={formData.assigned_to}
                    onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select developer" />
                    </SelectTrigger>
                    <SelectContent>
                      {developers?.map((dev) => (
                        <SelectItem key={dev.id} value={dev.id}>
                          {dev.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Input
                    id="environment"
                    value={formData.environment}
                    onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                    placeholder="Production, Staging, Dev"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="browser">Browser</Label>
                  <Input
                    id="browser"
                    value={formData.browser}
                    onChange={(e) => setFormData({ ...formData, browser: e.target.value })}
                    placeholder="Chrome 120, Firefox 121"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateBug.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {updateBug.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
