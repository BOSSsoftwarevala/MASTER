import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserRoles } from '@/hooks/useUserRoles';
import { 
  useAiSuggestions, 
  useAcceptAiSuggestion,
  useRejectAiSuggestion 
} from '@/hooks/useMarketingManagerData';
import { 
  Sparkles, 
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Clock,
  ShieldOff,
  Info
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

const impactColors: Record<string, string> = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  accepted: 'bg-green-500',
  rejected: 'bg-red-500',
  expired: 'bg-gray-500',
};

export default function AiToolsPage() {
  const { isManager, isAdmin } = useUserRoles();
  const { data: suggestions, isLoading } = useAiSuggestions();
  const acceptSuggestion = useAcceptAiSuggestion();
  const rejectSuggestion = useRejectAiSuggestion();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  if (!isManager() && !isAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Access Denied</span>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const pendingSuggestions = suggestions?.filter(s => s.status === 'pending') || [];
  const processedSuggestions = suggestions?.filter(s => s.status !== 'pending') || [];

  const handleAccept = (id: string) => {
    setSelectedSuggestion(id);
    setConfirmDialogOpen(true);
  };

  const confirmAccept = () => {
    if (selectedSuggestion) {
      acceptSuggestion.mutate(selectedSuggestion);
      setConfirmDialogOpen(false);
      setSelectedSuggestion(null);
    }
  };

  const handleReject = (id: string) => {
    setSelectedSuggestion(id);
    setRejectDialogOpen(true);
  };

  const confirmReject = () => {
    if (selectedSuggestion && rejectReason) {
      rejectSuggestion.mutate({ id: selectedSuggestion, reason: rejectReason });
      setRejectDialogOpen(false);
      setRejectReason('');
      setSelectedSuggestion(null);
    }
  };

  const renderSuggestionCard = (suggestion: any, showActions: boolean = true) => (
    <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{suggestion.title}</h3>
              <Badge className={statusColors[suggestion.status]}>
                {suggestion.status}
              </Badge>
              <Badge className={impactColors[suggestion.impact_level || 'medium']}>
                {suggestion.impact_level || 'medium'} impact
              </Badge>
              <Badge variant="outline">{suggestion.suggestion_type}</Badge>
            </div>
            {suggestion.description && (
              <p className="text-sm text-muted-foreground mb-4">{suggestion.description}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {suggestion.confidence_score && (
                <div>
                  <span className="text-muted-foreground">Confidence</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={Number(suggestion.confidence_score)} className="h-2 w-20" />
                    <span>{Number(suggestion.confidence_score).toFixed(0)}%</span>
                  </div>
                </div>
              )}
              {suggestion.estimated_cost && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Cost: ${Number(suggestion.estimated_cost).toLocaleString()}</span>
                </div>
              )}
              {suggestion.estimated_benefit && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Benefit: ${Number(suggestion.estimated_benefit).toLocaleString()}</span>
                </div>
              )}
              {suggestion.expires_at && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Expires: {format(new Date(suggestion.expires_at), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
            {suggestion.auto_apply_blocked && (
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <ShieldOff className="h-4 w-4" />
                <span>Auto-apply disabled - Manual approval required</span>
              </div>
            )}
            {suggestion.rejection_reason && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <p className="text-sm"><strong>Rejection reason:</strong> {suggestion.rejection_reason}</p>
              </div>
            )}
          </div>
          {showActions && suggestion.status === 'pending' && (
            <div className="flex gap-2 ml-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-green-600"
                onClick={() => handleAccept(suggestion.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600"
                onClick={() => handleReject(suggestion.id)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">AI Tools</h1>
          <p className="text-muted-foreground mt-1">Review AI suggestions and manage automation settings</p>
        </div>

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Manual Override Enabled</p>
                <p className="text-sm text-muted-foreground">
                  AI cannot auto-apply changes. All suggestions require manual approval.
                  Every acceptance and rejection is logged for audit purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingSuggestions.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              History ({processedSuggestions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {isLoading ? (
              <Card className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              </Card>
            ) : pendingSuggestions.length === 0 ? (
              <Card className="p-8 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending AI suggestions</p>
              </Card>
            ) : (
              pendingSuggestions.map((suggestion) => renderSuggestionCard(suggestion, true))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {isLoading ? (
              <Card className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              </Card>
            ) : processedSuggestions.length === 0 ? (
              <Card className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No processed suggestions yet</p>
              </Card>
            ) : (
              processedSuggestions.map((suggestion) => renderSuggestionCard(suggestion, false))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Accept Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Acceptance</DialogTitle>
            <DialogDescription>
              Are you sure you want to accept this AI suggestion? This action will be logged.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmAccept} disabled={acceptSuggestion.isPending}>
              Confirm Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Suggestion</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this suggestion. This will be logged.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={confirmReject} 
              disabled={!rejectReason || rejectSuggestion.isPending}
            >
              Reject Suggestion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
