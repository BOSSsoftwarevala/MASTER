import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useUserRoles } from '@/hooks/useUserRoles';
import { usePendingApprovals, useUpdateApproval } from '@/hooks/useBossData';
import { useState } from 'react';
import { 
  Shield, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  KeyRound,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Eye
} from 'lucide-react';

export default function AccessApprovalsPage() {
  const { isSuperAdmin } = useUserRoles();
  const [selectedExpiry, setSelectedExpiry] = useState<Record<string, string>>({});
  
  const { data: pendingApprovals = [], isLoading } = usePendingApprovals();
  const updateApproval = useUpdateApproval();

  if (!isSuperAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Only Super Admin can access this page.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Filter access-related approvals
  const accessApprovals = pendingApprovals.filter(a => a.type === 'access');

  // Mock additional access requests for demonstration
  const mockAccessRequests = [
    {
      id: 'access-1',
      title: 'Temporary Admin Access',
      description: 'Developer requesting admin access for debugging production issue',
      requester: 'dev@company.com',
      requestType: 'temporary',
      roleRequested: 'admin',
      reason: 'Need to debug critical production bug',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      priority: 'high',
    },
    {
      id: 'access-2',
      title: 'Role Elevation Request',
      description: 'Manager requesting project manager role for new project',
      requester: 'manager@company.com',
      requestType: 'permanent',
      roleRequested: 'project_manager',
      reason: 'Assigned to lead new project team',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
    },
    {
      id: 'access-3',
      title: 'Emergency Database Access',
      description: 'DBA requesting emergency access for data recovery',
      requester: 'dba@company.com',
      requestType: 'emergency',
      roleRequested: 'super_admin',
      reason: 'Critical data recovery operation needed',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      priority: 'high',
    },
  ];

  const allAccessItems = [
    ...accessApprovals.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description || '',
      requester: a.requester,
      requestType: 'access',
      roleRequested: 'unknown',
      reason: a.description || '',
      created_at: a.created_at,
      priority: a.priority,
      isReal: true,
    })),
    ...mockAccessRequests.map(r => ({ ...r, isReal: false })),
  ];

  const handleApprove = (id: string, isReal: boolean) => {
    if (isReal) {
      updateApproval.mutate({ id, status: 'approved' });
    }
  };

  const handleReject = (id: string, isReal: boolean) => {
    if (isReal) {
      updateApproval.mutate({ id, status: 'rejected', rejection_reason: 'Access request denied' });
    }
  };

  const getRequestTypeBadge = (type: string) => {
    switch (type) {
      case 'emergency': 
        return <Badge className="bg-destructive/20 text-destructive">Emergency</Badge>;
      case 'temporary': 
        return <Badge className="bg-amber-500/20 text-amber-600">Temporary</Badge>;
      case 'permanent': 
        return <Badge className="bg-blue-500/20 text-blue-600">Permanent</Badge>;
      default: 
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin': 
        return <Badge className="bg-destructive/20 text-destructive">Super Admin</Badge>;
      case 'admin': 
        return <Badge className="bg-purple-500/20 text-purple-500">Admin</Badge>;
      case 'project_manager': 
        return <Badge className="bg-blue-500/20 text-blue-600">Project Manager</Badge>;
      default: 
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-amber-500" />
              Access Approvals
            </h1>
            <p className="text-muted-foreground mt-1">Review temporary access, role elevations, and emergency requests</p>
          </div>
          <Badge className="bg-amber-500/20 text-amber-600 text-lg px-4 py-2">
            <KeyRound className="h-4 w-4 mr-2" />
            {allAccessItems.length} Requests
          </Badge>
        </div>

        {/* Warning Banner */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <div>
                <p className="font-medium text-foreground">Access Control Warning</p>
                <p className="text-sm text-muted-foreground">
                  Granting elevated access can expose sensitive data and operations. 
                  Always set appropriate expiry times for temporary access.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {allAccessItems.filter(a => a.requestType === 'emergency').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Emergency Requests</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {allAccessItems.filter(a => a.requestType === 'temporary').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Temporary Access</p>
                </div>
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {allAccessItems.filter(a => a.requestType === 'permanent').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Role Elevations</p>
                </div>
                <UserPlus className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Access Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Access Request Queue</CardTitle>
            <CardDescription>Review and approve access control changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 rounded-lg border">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                ))}
              </div>
            ) : allAccessItems.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <p className="text-lg font-medium text-foreground">No Pending Requests</p>
                <p className="text-muted-foreground">All access requests have been processed.</p>
              </div>
            ) : (
              allAccessItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors ${
                    item.requestType === 'emergency' ? 'border-destructive/30' : ''
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground">{item.title}</p>
                        {getRequestTypeBadge(item.requestType)}
                        {getRoleBadge(item.roleRequested)}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.requester}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                      </div>

                      {item.reason && (
                        <div className="p-2 bg-muted rounded text-sm">
                          <span className="text-muted-foreground">Reason: </span>
                          <span className="text-foreground">{item.reason}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      {item.requestType === 'temporary' && (
                        <div className="flex items-center gap-2">
                          <Label className="text-xs whitespace-nowrap">Expiry:</Label>
                          <Select 
                            value={selectedExpiry[item.id] || '24h'}
                            onValueChange={(val) => setSelectedExpiry({...selectedExpiry, [item.id]: val})}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1h">1 hour</SelectItem>
                              <SelectItem value="4h">4 hours</SelectItem>
                              <SelectItem value="24h">24 hours</SelectItem>
                              <SelectItem value="7d">7 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleReject(item.id, item.isReal)}
                          disabled={updateApproval.isPending || !item.isReal}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-amber-600 hover:bg-amber-700"
                          onClick={() => handleApprove(item.id, item.isReal)}
                          disabled={updateApproval.isPending || !item.isReal}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
