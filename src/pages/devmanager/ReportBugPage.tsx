import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateBug, useActiveProjects, useActiveDevelopers } from '@/hooks/useDevelopmentManagerData';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ReportBugPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createBug = useCreateBug();
  const { data: projects } = useActiveProjects();
  const { data: developers } = useActiveDevelopers();

  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    description: '',
    steps_to_reproduce: '',
    expected_behavior: '',
    actual_behavior: '',
    severity: 'medium' as const,
    status: 'open' as const,
    assigned_to: '',
    environment: '',
    browser: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createBug.mutateAsync({
      project_id: formData.project_id,
      task_id: null,
      title: formData.title,
      description: formData.description || null,
      steps_to_reproduce: formData.steps_to_reproduce || null,
      expected_behavior: formData.expected_behavior || null,
      actual_behavior: formData.actual_behavior || null,
      severity: formData.severity,
      status: formData.status,
      assigned_to: formData.assigned_to || null,
      environment: formData.environment || null,
      browser: formData.browser || null,
      reported_by: user?.id || null,
      reporter_name: user?.email || null,
      attachments: [],
    });

    navigate('/dashboard/devmanager/bugs');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Report Bug</h1>
            <p className="text-muted-foreground">Submit a new bug report</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bug Details</CardTitle>
            <CardDescription>Provide detailed information about the bug</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Bug Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Button not working on checkout page"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project">Project *</Label>
                  <Select
                    value={formData.project_id}
                    onValueChange={(value) => setFormData({ ...formData, project_id: value })}
                    required
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
                  <Label htmlFor="severity">Severity *</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value: typeof formData.severity) => setFormData({ ...formData, severity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="blocker">Blocker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the bug in detail..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="steps">Steps to Reproduce</Label>
                  <Textarea
                    id="steps"
                    value={formData.steps_to_reproduce}
                    onChange={(e) => setFormData({ ...formData, steps_to_reproduce: e.target.value })}
                    placeholder="1. Go to checkout page&#10;2. Click submit button&#10;3. ..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expected">Expected Behavior</Label>
                  <Textarea
                    id="expected"
                    value={formData.expected_behavior}
                    onChange={(e) => setFormData({ ...formData, expected_behavior: e.target.value })}
                    placeholder="What should happen?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actual">Actual Behavior</Label>
                  <Textarea
                    id="actual"
                    value={formData.actual_behavior}
                    onChange={(e) => setFormData({ ...formData, actual_behavior: e.target.value })}
                    placeholder="What actually happens?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assigned_to">Assign To</Label>
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
                    placeholder="Chrome 120, Safari 17, etc."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" disabled={createBug.isPending || !formData.project_id}>
                  <Save className="mr-2 h-4 w-4" />
                  {createBug.isPending ? 'Submitting...' : 'Report Bug'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
