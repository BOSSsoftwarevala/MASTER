import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useApprovals } from '@/hooks/useBossData';
import { 
  Shield, 
  History, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  User,
  Calendar
} from 'lucide-react';

export default function ApprovalHistoryPage() {
  const { isSuperAdmin } = useUserRoles();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  
  const { data: allApprovals = [], isLoading } = useApprovals();

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

  // Filter processed approvals (not pending)
  const processedApprovals = allApprovals.filter(a => a.status !== 'pending');

  // Apply filters
  const filteredApprovals = processedApprovals.filter(approval => {
    const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.requester.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || approval.status === filterStatus;
    const matchesType = filterType === 'all' || approval.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Stats
  const approvedCount = processedApprovals.filter(a => a.status === 'approved').length;
  const rejectedCount = processedApprovals.filter(a => a.status === 'rejected').length;
  const approvalRate = processedApprovals.length > 0 
    ? Math.round((approvedCount / processedApprovals.length) * 100) 
    : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': 
        return (
          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" /> Approved
          </Badge>
        );
      case 'rejected': 
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      default: 
        return (
          <Badge className="bg-amber-500/20 text-amber-600">
            <Clock className="h-3 w-3 mr-1" /> {status}
          </Badge>
        );
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      system: 'bg-primary/20 text-primary',
      payment: 'bg-green-500/20 text-green-600',
      risk: 'bg-destructive/20 text-destructive',
      ai: 'bg-purple-500/20 text-purple-500',
      access: 'bg-amber-500/20 text-amber-600',
      deployment: 'bg-blue-500/20 text-blue-600',
      rollback: 'bg-orange-500/20 text-orange-600',
    };
    return <Badge className={colors[type] || 'bg-muted text-muted-foreground'}>{type}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <History className="h-8 w-8 text-muted-foreground" />
              Approval History
            </h1>
            <p className="text-muted-foreground mt-1">Complete audit trail of all approval decisions</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {processedApprovals.length} Records
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-muted">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{processedApprovals.length}</p>
                  <p className="text-xs text-muted-foreground">Total Decisions</p>
                </div>
                <History className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{rejectedCount}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{approvalRate}%</p>
                  <p className="text-xs text-muted-foreground">Approval Rate</p>
                </div>
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or requester..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="deployment">Deployment</SelectItem>
                  <SelectItem value="access">Access</SelectItem>
                  <SelectItem value="ai">AI</SelectItem>
                  <SelectItem value="risk">Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Decision History</CardTitle>
            <CardDescription>Read-only audit trail of all past approvals</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-8 w-8 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredApprovals.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground">No History Found</p>
                <p className="text-muted-foreground">No records match your search criteria.</p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Decision</TableHead>
                      <TableHead>Decision Date</TableHead>
                      <TableHead>Decision By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApprovals.map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{approval.title}</p>
                            {approval.rejection_reason && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Reason: {approval.rejection_reason}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(approval.type)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-foreground">{approval.requester}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(approval.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {approval.approved_at 
                              ? new Date(approval.approved_at).toLocaleString()
                              : approval.rejected_at 
                                ? new Date(approval.rejected_at).toLocaleString()
                                : '-'
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-foreground">
                            {approval.approved_by || approval.rejected_by || 'System'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
