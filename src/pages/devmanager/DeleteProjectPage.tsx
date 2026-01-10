import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useProjects, useDeleteProject } from '@/hooks/useDevelopmentManagerData';
import { ArrowLeft, AlertTriangle, Trash2, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function DeleteProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: projects } = useProjects();
  const deleteProject = useDeleteProject();
  const [reason, setReason] = useState('');

  const project = projects?.find((p) => p.id === id);

  const handleDelete = async () => {
    if (!id || !reason.trim()) return;

    await deleteProject.mutateAsync(id);
    navigate('/dashboard/devmanager/projects');
  };

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-8 text-muted-foreground">Project not found</div>
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
            <h1 className="text-3xl font-bold tracking-tight">Archive Project</h1>
            <p className="text-muted-foreground">Confirm project archival</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Confirm Archival
            </CardTitle>
            <CardDescription>
              This action will archive the project. It can be restored later if needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                You are about to archive <strong>{project.name}</strong>. This will:
              </AlertDescription>
            </Alert>

            <div className="rounded-lg border p-4 space-y-2">
              <h3 className="font-medium">Impact Preview</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Project will be hidden from active project lists</li>
                <li>• All associated tasks will be marked as archived</li>
                <li>• Build history will be preserved for audit</li>
                <li>• Team members will lose active access</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for archival *</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for archiving this project..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={!reason.trim() || deleteProject.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteProject.isPending ? 'Archiving...' : 'Confirm Archive'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
