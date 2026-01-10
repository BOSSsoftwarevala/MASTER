import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCampaign, useBudgetHistory } from '@/hooks/useMarketingManagerData';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, DollarSign, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function BudgetHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: campaign, isLoading: campaignLoading } = useCampaign(id!);
  const { data: history, isLoading: historyLoading } = useBudgetHistory(id!);

  const isLoading = campaignLoading || historyLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/marketing/campaigns')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold">Budget History</h1>
            <p className="text-muted-foreground mt-1">{campaign?.name}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Current Budget
            </CardTitle>
            <CardDescription>Current campaign budget allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              ${Number(campaign?.budget || 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              ${Number(campaign?.spent || 0).toLocaleString()} spent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Change History
            </CardTitle>
            <CardDescription>All budget changes are logged here (read-only)</CardDescription>
          </CardHeader>
          <CardContent>
            {!history || history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No budget changes recorded yet
              </p>
            ) : (
              <div className="space-y-4">
                {history.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-muted">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">
                          ${Number(entry.old_budget).toLocaleString()} → ${Number(entry.new_budget).toLocaleString()}
                        </p>
                        {entry.change_reason && (
                          <p className="text-sm text-muted-foreground">{entry.change_reason}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(entry.created_at), 'MMM d, yyyy HH:mm')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
