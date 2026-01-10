import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateQATest, useActiveProjects } from '@/hooks/useDevelopmentManagerData';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, TestTube, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateQATestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: projects } = useActiveProjects();
  const createTest = useCreateQATest();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project_id: '',
    test_type: 'unit' as 'unit' | 'integration' | 'e2e' | 'performance' | 'security',
    status: 'pending' as 'pending' | 'passed' | 'failed' | 'skipped',
    test_suite: '',
    expected_result: '',
    actual_result: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createTest.mutateAsync({
      name: formData.name,
      description: formData.description || null,
      project_id: formData.project_id,
      test_type: formData.test_type,
      status: formData.status,
      expected_result: formData.expected_result || null,
      actual_result: formData.actual_result || null,
      build_request_id: null,
      executed_by: user?.id || null,
      executed_at: null,
      notes: null,
    });
    navigate('/dashboard/devmanager/qa');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create QA Test</h1>
            <p className="text-muted-foreground">Add a new test case to the QA suite</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Test Case Details
              </CardTitle>
              <CardDescription>Define the test case parameters and expected outcomes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Test Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., User Login Flow Test"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test_suite">Test Suite</Label>
                  <Input
                    id="test_suite"
                    value={formData.test_suite}
                    onChange={(e) => setFormData({ ...formData, test_suite: e.target.value })}
                    placeholder="e.g., Authentication, Payments"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this test validates"
                  rows={3}
                />
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
                  <Label htmlFor="test_type">Test Type *</Label>
                  <Select
                    value={formData.test_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, test_type: value as typeof formData.test_type })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unit">Unit Test</SelectItem>
                      <SelectItem value="integration">Integration Test</SelectItem>
                      <SelectItem value="e2e">End-to-End Test</SelectItem>
                      <SelectItem value="performance">Performance Test</SelectItem>
                      <SelectItem value="security">Security Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Initial Status</Label>
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="skipped">Skipped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expected_result">Expected Result</Label>
                  <Textarea
                    id="expected_result"
                    value={formData.expected_result}
                    onChange={(e) => setFormData({ ...formData, expected_result: e.target.value })}
                    placeholder="What should happen when test passes"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actual_result">Actual Result (if known)</Label>
                  <Textarea
                    id="actual_result"
                    value={formData.actual_result}
                    onChange={(e) => setFormData({ ...formData, actual_result: e.target.value })}
                    placeholder="What actually happened"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!formData.project_id || createTest.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {createTest.isPending ? 'Creating...' : 'Create Test Case'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
