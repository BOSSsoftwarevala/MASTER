import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  AlertCircle, 
  FileWarning,
  Plus,
  Clock,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const supportTickets = [
  { id: 'TKT-001', subject: 'Campaign deadline extension', type: 'campaign', status: 'open', createdAt: 'Jan 3, 2026' },
  { id: 'TKT-002', subject: 'Payout not received', type: 'payout', status: 'resolved', createdAt: 'Dec 28, 2025' },
];

export function InfluencerSupportSection() {
  const [newTicketOpen, setNewTicketOpen] = useState(false);

  const handleSubmitTicket = () => {
    toast.success('Support ticket created successfully');
    setNewTicketOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Support & Disputes
          </CardTitle>
          <CardDescription>Get help or report issues</CardDescription>
        </div>
        <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>Describe your issue and we'll get back to you</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Issue Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payout">Payout Dispute</SelectItem>
                    <SelectItem value="campaign">Campaign Issue</SelectItem>
                    <SelectItem value="technical">Technical Problem</SelectItem>
                    <SelectItem value="account">Account Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input placeholder="Brief description of your issue" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Provide details about your issue..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Related Campaign/Payout ID (optional)</Label>
                <Input placeholder="e.g., CAMP-001 or PAY-001" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewTicketOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitTicket}>Submit Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="p-4 rounded-lg border bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="font-medium">Internal Chat</p>
                <p className="text-xs text-muted-foreground">Quick support</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <FileWarning className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="font-medium">Payout Dispute</p>
                <p className="text-xs text-muted-foreground">Challenge a decision</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="font-medium">Campaign Issue</p>
                <p className="text-xs text-muted-foreground">Report problem</p>
              </div>
            </div>
          </div>
        </div>

        {supportTickets.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Recent Tickets</p>
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  {ticket.status === 'open' ? (
                    <Clock className="h-4 w-4 text-amber-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground">{ticket.id} • {ticket.createdAt}</p>
                  </div>
                </div>
                <Badge variant="outline" className={
                  ticket.status === 'open' 
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }>
                  {ticket.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
