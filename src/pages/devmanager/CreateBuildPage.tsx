import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateBuildRequest } from '@/hooks/useDevelopmentData';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Hammer, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateBuildPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createBuild = useCreateBuildRequest();

  const [formData, setFormData] = useState({
    repo_name: '',
    branch: 'main',
    build_type: 'development' as 'development' | 'staging' | 'production',
    commit_hash: '',
    commit_message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createBuild.mutateAsync({
      repo_name: formData.repo_name,
      branch: formData.branch,
      build_type: formData.build_type,
      commit_hash: formData.commit_hash || undefined,
    });
    navigate('/dashboard/devmanager/builds');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Build Request</h1>
            <p className="text-muted-foreground">Request a new build for a repository</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hammer className="h-5 w-5" />
                Build Configuration
              </CardTitle>
              <CardDescription>
                Configure the build parameters. Production builds require approval.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="repo_name">Repository Name *</Label>
                  <Input
                    id="repo_name"
                    value={formData.repo_name}
                    onChange={(e) => setFormData({ ...formData, repo_name: e.target.value })}
                    placeholder="e.g., frontend-app, api-server"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch *</Label>
                  <Input
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="main, develop, feature/..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="build_type">Environment *</Label>
                <Select
                  value={formData.build_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, build_type: value as typeof formData.build_type })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production (Requires Approval)</SelectItem>
                  </SelectContent>
                </Select>
                {formData.build_type === 'production' && (
                  <p className="text-sm text-amber-600">
                    ⚠️ Production builds require boss approval before execution
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commit_hash">Commit Hash (optional)</Label>
                  <Input
                    id="commit_hash"
                    value={formData.commit_hash}
                    onChange={(e) => setFormData({ ...formData, commit_hash: e.target.value })}
                    placeholder="e.g., abc1234"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commit_message">Commit Message / Notes</Label>
                <Textarea
                  id="commit_message"
                  value={formData.commit_message}
                  onChange={(e) => setFormData({ ...formData, commit_message: e.target.value })}
                  placeholder="Describe the changes included in this build"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createBuild.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {createBuild.isPending ? 'Creating...' : 'Create Build Request'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
