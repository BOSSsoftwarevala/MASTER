import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserRoles } from '@/hooks/useUserRoles';
import { usePendingApprovals, useUpdateApproval } from '@/hooks/useBossData';
import { 
  Shield, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Brain,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function AIApprovalsPage() {
  const { isSuperAdmin } = useUserRoles();
  
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

  // Filter AI suggestions
  const aiApprovals = pendingApprovals.filter(a => a.type === 'ai');

  // Mock AI suggestions for demonstration
  const mockAISuggestions = [
    {
      id: 'ai-1',
      title: 'Optimize Database Queries',
      description: 'AI detected slow queries in the leads module. Recommended index additions could improve performance by 40%.',
      confidence: 92,
      impact: 'Medium',
      costImplication: '₹0',
      category: 'Performance',
    },
    {
      id: 'ai-2',
      title: 'Auto-Scale Server Resources',
      description: 'Traffic patterns suggest scaling up between 10 AM - 2 PM IST. Estimated cost increase: ₹2,500/month.',
      confidence: 87,
      impact: 'Low',
      costImplication: '₹2,500/mo',
      category: 'Infrastructure',
    },
    {
      id: 'ai-3',
      title: 'Security Patch Recommendation',
      description: 'Critical security update available for authentication module. Immediate deployment recommended.',
      confidence: 98,
      impact: 'High',
      costImplication: '₹0',
      category: 'Security',
    },
  ];

  const handleApprove = (id: string) => {
    // For real AI approvals from DB
    const approval = aiApprovals.find(a => a.id === id);
    if (approval) {
      updateApproval.mutate({ id, status: 'approved' });
    }
  };

  const handleReject = (id: string) => {
    const approval = aiApprovals.find(a => a.id === id);
    if (approval) {
      updateApproval.mutate({ id, status: 'rejected', rejection_reason: 'AI suggestion rejected by admin' });
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-500';
    if (confidence >= 70) return 'text-amber-500';
    return 'text-destructive';
  };

  const getImpactBadge = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return <Badge className="bg-destructive/20 text-destructive">High Impact</Badge>;
      case 'medium': return <Badge className="bg-amber-500/20 text-amber-600">Medium Impact</Badge>;
      case 'low': return <Badge className="bg-green-500/20 text-green-600">Low Impact</Badge>;
      default: return <Badge variant="outline">{impact}</Badge>;
    }
  };

  const allSuggestions = [
    ...aiApprovals.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description || '',
      confidence: 85,
      impact: a.priority === 'high' ? 'High' : a.priority === 'medium' ? 'Medium' : 'Low',
      costImplication: a.amount ? `₹${a.amount.toLocaleString()}` : '₹0',
      category: 'AI Suggestion',
      isReal: true,
    })),
    ...mockAISuggestions.map(s => ({ ...s, isReal: false })),
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-500" />
              AI Suggestions
            </h1>
            <p className="text-muted-foreground mt-1">Review and approve AI-generated recommendations</p>
          </div>
          <Badge className="bg-purple-500/20 text-purple-500 text-lg px-4 py-2">
            <Brain className="h-4 w-4 mr-2" />
            {allSuggestions.length} Suggestions
          </Badge>
        </div>

        {/* AI Capabilities Notice */}
        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Brain className="h-6 w-6 text-purple-500 mt-1" />
              <div>
                <p className="font-medium text-foreground">AI Can Only Suggest</p>
                <p className="text-sm text-muted-foreground">
                  AI analyzes patterns and generates recommendations. All suggestions require human approval. 
                  AI cannot execute actions directly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{allSuggestions.length}</p>
                  <p className="text-xs text-muted-foreground">Pending Suggestions</p>
                </div>
                <Sparkles className="h-6 w-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">89%</p>
                  <p className="text-xs text-muted-foreground">Avg Confidence</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">₹2.5K</p>
                  <p className="text-xs text-muted-foreground">Est. Cost Impact</p>
                </div>
                <DollarSign className="h-6 w-6 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions List */}
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Suggestions based on system analysis and pattern detection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 rounded-lg border">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-2 w-32" />
                  </div>
                ))}
              </div>
            ) : allSuggestions.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <p className="text-lg font-medium text-foreground">No AI Suggestions</p>
                <p className="text-muted-foreground">AI has no new recommendations at this time.</p>
              </div>
            ) : (
              allSuggestions.map((suggestion) => (
                <div 
                  key={suggestion.id} 
                  className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{suggestion.title}</p>
                        {getImpactBadge(suggestion.impact)}
                        <Badge variant="outline" className="text-xs">{suggestion.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Confidence:</span>
                          <div className="w-24">
                            <Progress value={suggestion.confidence} className="h-2" />
                          </div>
                          <span className={`text-sm font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                            {suggestion.confidence}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{suggestion.costImplication}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => suggestion.isReal && handleReject(suggestion.id)}
                        disabled={updateApproval.isPending || !suggestion.isReal}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => suggestion.isReal && handleApprove(suggestion.id)}
                        disabled={updateApproval.isPending || !suggestion.isReal}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
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
