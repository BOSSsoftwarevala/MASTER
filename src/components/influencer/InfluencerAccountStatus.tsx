import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ShieldCheck, 
  AlertTriangle,
  Ban,
  FileText,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface AccountStatusProps {
  status?: 'active' | 'warning' | 'suspended';
  warnings?: { id: string; reason: string; date: string }[];
}

export function InfluencerAccountStatus({ 
  status = 'active',
  warnings = []
}: AccountStatusProps) {
  const [appealOpen, setAppealOpen] = useState(false);

  const handleSubmitAppeal = () => {
    toast.success('Appeal submitted successfully. We will review within 48 hours.');
    setAppealOpen(false);
  };

  const statusConfig = {
    active: {
      icon: ShieldCheck,
      color: 'emerald',
      label: 'Good Standing',
      description: 'Your account is in good standing with no violations.'
    },
    warning: {
      icon: AlertTriangle,
      color: 'amber',
      label: 'Warning Issued',
      description: 'Your account has received warnings. Please review and take action.'
    },
    suspended: {
      icon: Ban,
      color: 'red',
      label: 'Suspended',
      description: 'Your account is suspended due to policy violations. Payouts are on hold.'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-5 w-5 text-${config.color}-500`} />
          Account Status
        </CardTitle>
        <CardDescription>Your account compliance status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-4 rounded-lg border bg-${config.color}-500/10 border-${config.color}-500/30`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-lg bg-${config.color}-500/20 flex items-center justify-center`}>
                <Icon className={`h-6 w-6 text-${config.color}-500`} />
              </div>
              <div>
                <p className="font-semibold">{config.label}</p>
                <p className="text-sm text-muted-foreground">{config.description}</p>
              </div>
            </div>
            <Badge variant="outline" className={`bg-${config.color}-500/20 text-${config.color}-400 border-${config.color}-500/30`}>
              {status}
            </Badge>
          </div>
        </div>

        {warnings.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Warning History</p>
            {warnings.map((warning) => (
              <div key={warning.id} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">{warning.reason}</p>
                  <p className="text-xs text-muted-foreground mt-1">{warning.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {status === 'suspended' && (
          <Dialog open={appealOpen} onOpenChange={setAppealOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Submit Appeal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Appeal</DialogTitle>
                <DialogDescription>
                  Explain why you believe the suspension should be lifted
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-sm text-amber-400">
                    Appeals are reviewed within 48 hours. Provide clear evidence and explanation.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Reason for Appeal</Label>
                  <Textarea 
                    placeholder="Explain your situation and provide any evidence or context..." 
                    rows={5}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAppealOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmitAppeal}>Submit Appeal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Compliance Checklist */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Compliance Checklist</p>
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Profile verified</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Contract accepted</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Tax information provided</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-amber-500" />
              <span>Traffic quality verification pending</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
