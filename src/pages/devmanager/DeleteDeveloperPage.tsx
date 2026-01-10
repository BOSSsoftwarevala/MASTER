import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDevelopers, useDeleteDeveloper } from '@/hooks/useDevelopmentManagerData';
import { ArrowLeft, AlertTriangle, Trash2, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function DeleteDeveloperPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: developers } = useDevelopers();
  const deleteDeveloper = useDeleteDeveloper();
  const [reason, setReason] = useState('');

  const developer = developers?.find((d) => d.id === id);

  const handleDelete = async () => {
    if (!id || !reason.trim()) return;

    await deleteDeveloper.mutateAsync(id);
    navigate('/dashboard/devmanager/developers');
  };

  if (!developer) {
    return (
      <DashboardLayout>
        <div className="text-center py-8 text-muted-foreground">Developer not found</div>
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
            <h1 className="text-3xl font-bold tracking-tight">Remove Developer</h1>
            <p className="text-muted-foreground">Confirm developer removal</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Confirm Removal
            </CardTitle>
            <CardDescription>
              This action will remove the developer from the system. This is a soft delete and can be recovered.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                You are about to remove <strong>{developer.name}</strong> ({developer.email}) from the system.
              </AlertDescription>
            </Alert>

            <div className="rounded-lg border p-4 space-y-2">
              <h3 className="font-medium">Impact Preview</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Developer will be removed from all projects</li>
                <li>• Assigned tasks will need reassignment</li>
                <li>• Historical data will be preserved for audit</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for removal *</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for removing this developer..."
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
                disabled={!reason.trim() || deleteDeveloper.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteDeveloper.isPending ? 'Removing...' : 'Confirm Delete'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
