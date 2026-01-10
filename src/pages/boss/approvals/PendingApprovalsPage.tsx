import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserRoles } from '@/hooks/useUserRoles';
import { usePendingApprovals, useUpdateApproval } from '@/hooks/useBossData';
import { usePendingDeployRequests, useUpdateDeployRequest } from '@/hooks/useDevelopmentData';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Shield, 
  Clock, 
  Settings, 
  CreditCard, 
  AlertTriangle, 
  Sparkles, 
  UserPlus,
  Rocket,
  RotateCcw,
  Search,
  Eye,
  Filter
} from 'lucide-react';

export default function PendingApprovalsPage() {
  const { isSuperAdmin } = useUserRoles();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState(initialType);
  const [filterPriority, setFilterPriority] = useState('all');
  
  const { data: pendingApprovals = [], isLoading: approvalsLoading } = usePendingApprovals();
  const { data: pendingDeploys = [], isLoading: deploysLoading } = usePendingDeployRequests();

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

  const isLoading = approvalsLoading || deploysLoading;

  // Combine all pending items
  const allItems = [
    ...pendingApprovals.map(a => ({ ...a, source: 'approval' as const })),
    ...pendingDeploys.map(d => ({
      id: d.id,
      type: 'deployment' as const,
      title: `Deploy ${d.version}`,
      description: d.release_notes || `Deploy to ${d.environment}`,
      requester: d.requested_by,
      priority: d.risk_level || 'medium',
      amount: null,
      created_at: d.created_at,
      source: 'deploy' as const,
    })),
  ];

  // Apply filters
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Settings className="h-5 w-5" />;
      case 'payment': return <CreditCard className="h-5 w-5" />;
      case 'risk': return <AlertTriangle className="h-5 w-5" />;
      case 'ai': return <Sparkles className="h-5 w-5" />;
      case 'access': return <UserPlus className="h-5 w-5" />;
      case 'deployment': return <Rocket className="h-5 w-5" />;
      case 'rollback': return <RotateCcw className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'bg-primary/20 text-primary';
      case 'payment': return 'bg-green-500/20 text-green-600';
      case 'risk': return 'bg-destructive/20 text-destructive';
      case 'ai': return 'bg-purple-500/20 text-purple-500';
      case 'access': return 'bg-amber-500/20 text-amber-600';
      case 'deployment': return 'bg-blue-500/20 text-blue-600';
      case 'rollback': return 'bg-orange-500/20 text-orange-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-destructive/20 text-destructive border-destructive/30">High</Badge>;
      case 'medium': return <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">Medium</Badge>;
      case 'low': return <Badge className="bg-muted text-muted-foreground">Low</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getTimePending = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Pending Approvals</h1>
            <p className="text-muted-foreground mt-1">Review and process all pending requests</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Clock className="h-4 w-4 mr-2" />
            {filteredItems.length} Items
          </Badge>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="deployment">Deployment</SelectItem>
                  <SelectItem value="access">Access</SelectItem>
                  <SelectItem value="ai">AI Suggestions</SelectItem>
                  <SelectItem value="risk">Risk</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Queue List */}
        <Card>
          <CardHeader>
            <CardTitle>Request Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-64" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-24" />
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <p className="text-lg font-medium text-foreground">No pending requests</p>
                <p className="text-muted-foreground">All caught up! No items match your filters.</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{item.title}</p>
                        {getPriorityBadge(item.priority)}
                        <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>By: {item.requester}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getTimePending(item.created_at)}
                        </span>
                        {item.amount && <span className="font-medium text-foreground">₹{item.amount.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate(`/dashboard/boss/approvals/detail/${item.id}?source=${item.source}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> Open
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
