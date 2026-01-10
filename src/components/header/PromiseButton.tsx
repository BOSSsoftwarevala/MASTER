import { useState } from 'react';
import { Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Promise {
  id: string;
  title: string;
  description: string;
  status: 'on_track' | 'at_risk' | 'completed';
  deadline: string;
  slaHours: number;
}

const mockPromises: Promise[] = [
  {
    id: '1',
    title: '24-Hour Response Guarantee',
    description: 'All support tickets receive initial response within 24 hours',
    status: 'on_track',
    deadline: '2026-01-06',
    slaHours: 24,
  },
  {
    id: '2',
    title: '99.9% Uptime Commitment',
    description: 'System availability maintained at enterprise-grade levels',
    status: 'completed',
    deadline: '2026-01-31',
    slaHours: 720,
  },
  {
    id: '3',
    title: 'Data Security Promise',
    description: 'All data encrypted at rest and in transit with zero breaches',
    status: 'at_risk',
    deadline: '2026-01-10',
    slaHours: 168,
  },
];

export function PromiseButton() {
  const [open, setOpen] = useState(false);

  const getStatusIcon = (status: Promise['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'at_risk':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-info" />;
    }
  };

  const getStatusBadge = (status: Promise['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success/20 text-success border-success/30">Completed</Badge>;
      case 'at_risk':
        return <Badge className="bg-warning/20 text-warning border-warning/30">At Risk</Badge>;
      default:
        return <Badge className="bg-info/20 text-info border-info/30">On Track</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Shield className="h-4 w-4 text-success" />
          <span className="hidden md:inline text-sm font-medium">Our Promise</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-success" />
            Our Commitments
          </SheetTitle>
          <SheetDescription>
            Track our active promises and SLA commitments to you
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-12rem)] mt-6">
          <div className="space-y-4 pr-4">
            {mockPromises.map((promise) => (
              <div
                key={promise.id}
                className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(promise.status)}
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">{promise.title}</h4>
                      <p className="text-xs text-muted-foreground">{promise.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          SLA: {promise.slaHours}h | Due: {promise.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(promise.status)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
