import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Server, ArrowLeft, Trash2, AlertTriangle, X } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useServers, useDeleteServer } from '@/hooks/useServerData';
import { toast } from 'sonner';

export default function DeleteServerPage() {
  const { isSuperAdmin } = useUserRoles();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: servers, isLoading } = useServers();
  const deleteServer = useDeleteServer();
  
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  
  const server = servers?.find(s => s.id === id);
  
  // Only Super Admin can delete
  if (!isSuperAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!server) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Server not found</p>
          <Button onClick={() => navigate('/dashboard/boss/server/servers/company')} className="mt-4">
            Back to Servers
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const canDelete = reason.trim().length >= 10 && confirmText === server.name;

  const handleDelete = async () => {
    if (!canDelete) {
      toast.error('Please provide a reason and confirm deletion');
      return;
    }
    
    try {
      await deleteServer.mutateAsync({ id: server.id, reason });
      navigate('/dashboard/boss/server/servers/company');
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-destructive">
              <Trash2 className="h-8 w-8" />
              Delete Server
            </h1>
            <p className="text-muted-foreground mt-1">Permanently remove server from system</p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning: This action is irreversible</AlertTitle>
          <AlertDescription>
            Deleting this server will remove all associated data, logs, and configurations.
            This action cannot be undone.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Server to Delete</CardTitle>
            <CardDescription>Review the server details before deletion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Server Info */}
            <div className="p-4 rounded-lg bg-muted/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold text-lg">{server.name}</h3>
                    <p className="text-sm text-muted-foreground">{server.provider} • {server.region}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="capitalize">{server.owner_type}</Badge>
                  <p className="text-sm text-muted-foreground mt-1">{server.server_type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">CPU</p>
                  <p className="font-medium">{server.cpu_spec || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RAM</p>
                  <p className="font-medium">{server.ram_spec || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Disk</p>
                  <p className="font-medium">{server.disk_spec || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Impact Preview */}
            <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <h4 className="font-semibold text-destructive mb-2">Impact Preview</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• All server monitoring data will be removed</li>
                <li>• Associated scaling policies will be deleted</li>
                <li>• Security rules linked to this server will be removed</li>
                <li>• Incident history will be archived</li>
                {server.owner_type === 'client' && (
                  <li>• Client billing reference will need manual cleanup</li>
                )}
              </ul>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Deletion *</Label>
              <Textarea
                id="reason"
                placeholder="Provide a detailed reason for deleting this server (minimum 10 characters)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {reason.length}/10 characters minimum
              </p>
            </div>

            {/* Confirmation */}
            <div className="space-y-2">
              <Label htmlFor="confirm">Type "{server.name}" to confirm</Label>
              <input
                id="confirm"
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={server.name}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={!canDelete || deleteServer.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleteServer.isPending ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}