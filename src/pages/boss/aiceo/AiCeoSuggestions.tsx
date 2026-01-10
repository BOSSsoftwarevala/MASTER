import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAiSuggestions, useUpdateSuggestionStatus, AiSuggestion } from '@/hooks/useAiCeoData';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Lightbulb,
  Scaling,
  DollarSign,
  Shield,
  Settings,
  CheckCircle,
  XCircle,
  Pause,
  Clock,
  Brain,
  AlertTriangle,
} from 'lucide-react';

export default function AiCeoSuggestions() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { data: allSuggestions, isLoading } = useAiSuggestions();
  const { updateStatus } = useUpdateSuggestionStatus();
  const queryClient = useQueryClient();

  const [selectedSuggestion, setSelectedSuggestion] = useState<AiSuggestion | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'hold' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isSuperAdmin) {
    return (
      <DashboardLayout>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>This page is restricted to Super Admins only.</CardDescription>
          </CardHeader>
        </Card>
      </DashboardLayout>
    );
  }

  const pendingSuggestions = allSuggestions?.filter(s => s.status === 'pending') || [];
  const approvedSuggestions = allSuggestions?.filter(s => s.status === 'approved') || [];
  const rejectedSuggestions = allSuggestions?.filter(s => s.status === 'rejected') || [];
  const onHoldSuggestions = allSuggestions?.filter(s => s.status === 'on_hold') || [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'scaling': return <Scaling className="h-5 w-5" />;
      case 'budget': return <DollarSign className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      case 'optimization': return <Settings className="h-5 w-5" />;
      default: return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    }
  };

  const handleAction = async () => {
    if (!selectedSuggestion || !actionType) return;

    setProcessing(true);
    try {
      const status = actionType === 'approve' ? 'approved' : actionType === 'reject' ? 'rejected' : 'on_hold';
      await updateStatus(selectedSuggestion.id, status, rejectionReason || undefined);
      
      toast.success(`Suggestion ${actionType === 'approve' ? 'approved' : actionType === 'reject' ? 'rejected' : 'put on hold'}`);
      queryClient.invalidateQueries({ queryKey: ['ai-ceo', 'suggestions'] });
    } catch (error) {
      toast.error('Failed to update suggestion');
    } finally {
      setProcessing(false);
      setSelectedSuggestion(null);
      setActionType(null);
      setRejectionReason('');
    }
  };

  const openActionDialog = (suggestion: AiSuggestion, action: 'approve' | 'reject' | 'hold') => {
    setSelectedSuggestion(suggestion);
    setActionType(action);
  };

  const renderSuggestionCard = (suggestion: AiSuggestion, showActions: boolean = true) => (
    <div 
      key={suggestion.id}
      className={`p-4 rounded-lg border ${getImpactColor(suggestion.impact_level)}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-background/50">
          {getTypeIcon(suggestion.suggestion_type)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold">{suggestion.title}</h4>
            <Badge variant="outline" className="capitalize">{suggestion.suggestion_type}</Badge>
            <Badge variant="secondary" className="capitalize">{suggestion.impact_level} impact</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              {Math.round(suggestion.confidence_score * 100)}% confidence
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(suggestion.created_at).toLocaleString()}
            </span>
          </div>
        </div>
        {showActions && suggestion.status === 'pending' && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => openActionDialog(suggestion, 'hold')}
            >
              <Pause className="h-4 w-4 mr-1" />
              Hold
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="text-red-500 hover:text-red-600"
              onClick={() => openActionDialog(suggestion, 'reject')}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button 
              size="sm"
              className="bg-green-500 hover:bg-green-600"
              onClick={() => openActionDialog(suggestion, 'approve')}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
          </div>
        )}
        {suggestion.status === 'approved' && (
          <Badge className="bg-green-500">Approved</Badge>
        )}
        {suggestion.status === 'rejected' && (
          <Badge variant="destructive">Rejected</Badge>
        )}
        {suggestion.status === 'on_hold' && (
          <Badge variant="secondary">On Hold</Badge>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-amber-500" />
            AI Suggestions
          </h1>
          <p className="text-muted-foreground">Review and approve AI recommendations</p>
        </div>

        {/* Warning Banner */}
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="py-3 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-sm">
              <strong>All suggestions require your explicit approval.</strong> AI cannot execute any action automatically.
            </p>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <div className="text-2xl font-bold mt-1">{pendingSuggestions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">Approved</span>
              </div>
              <div className="text-2xl font-bold mt-1">{approvedSuggestions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-muted-foreground">Rejected</span>
              </div>
              <div className="text-2xl font-bold mt-1">{rejectedSuggestions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Pause className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-muted-foreground">On Hold</span>
              </div>
              <div className="text-2xl font-bold mt-1">{onHoldSuggestions.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingSuggestions.length})
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="hold">On Hold</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {isLoading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)
            ) : pendingSuggestions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">All Caught Up!</h3>
                  <p className="text-muted-foreground">No pending suggestions to review</p>
                </CardContent>
              </Card>
            ) : (
              pendingSuggestions.map(s => renderSuggestionCard(s))
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {approvedSuggestions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No approved suggestions yet</p>
                </CardContent>
              </Card>
            ) : (
              approvedSuggestions.map(s => renderSuggestionCard(s, false))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedSuggestions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No rejected suggestions</p>
                </CardContent>
              </Card>
            ) : (
              rejectedSuggestions.map(s => renderSuggestionCard(s, false))
            )}
          </TabsContent>

          <TabsContent value="hold" className="space-y-4">
            {onHoldSuggestions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No suggestions on hold</p>
                </CardContent>
              </Card>
            ) : (
              onHoldSuggestions.map(s => renderSuggestionCard(s))
            )}
          </TabsContent>
        </Tabs>

        {/* Action Dialog */}
        <Dialog open={!!selectedSuggestion && !!actionType} onOpenChange={() => {
          setSelectedSuggestion(null);
          setActionType(null);
          setRejectionReason('');
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'approve' && 'Approve Suggestion'}
                {actionType === 'reject' && 'Reject Suggestion'}
                {actionType === 'hold' && 'Put On Hold'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'approve' && 'This will mark the suggestion as approved. The AI will not execute any action automatically.'}
                {actionType === 'reject' && 'Please provide a reason for rejecting this suggestion.'}
                {actionType === 'hold' && 'This suggestion will be put on hold for later review.'}
              </DialogDescription>
            </DialogHeader>

            {selectedSuggestion && (
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-medium">{selectedSuggestion.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{selectedSuggestion.description}</p>
              </div>
            )}

            {actionType === 'reject' && (
              <Textarea
                placeholder="Reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            )}

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedSuggestion(null);
                  setActionType(null);
                  setRejectionReason('');
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAction}
                disabled={processing || (actionType === 'reject' && !rejectionReason)}
                className={
                  actionType === 'approve' ? 'bg-green-500 hover:bg-green-600' :
                  actionType === 'reject' ? 'bg-red-500 hover:bg-red-600' : ''
                }
              >
                {processing ? 'Processing...' : 
                  actionType === 'approve' ? 'Approve' :
                  actionType === 'reject' ? 'Reject' : 'Put On Hold'
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
