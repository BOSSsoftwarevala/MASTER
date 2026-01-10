import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Clock, 
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus
} from 'lucide-react';

const followups = [
  { 
    id: 1, 
    leadName: 'Alex Thompson',
    company: 'TechStart Inc',
    scheduledAt: 'Today 3:00 PM',
    status: 'pending',
    type: 'call',
    notes: 'Discuss pricing options',
    value: 8500
  },
  { 
    id: 2, 
    leadName: 'Maria Garcia',
    company: 'Digital Wave',
    scheduledAt: 'Today 5:00 PM',
    status: 'pending',
    type: 'email',
    notes: 'Send proposal document',
    value: 5200
  },
  { 
    id: 3, 
    leadName: 'James Wilson',
    company: 'Cloud Nine LLC',
    scheduledAt: 'Tomorrow 10:00 AM',
    status: 'pending',
    type: 'call',
    notes: 'Follow up on demo',
    value: 12000
  },
  { 
    id: 4, 
    leadName: 'Lisa Chen',
    company: 'Smart Solutions',
    scheduledAt: 'Yesterday 2:00 PM',
    status: 'completed',
    type: 'call',
    notes: 'Interested, needs approval',
    outcome: 'positive',
    value: 3500
  },
  { 
    id: 5, 
    leadName: 'Tom Brown',
    company: 'Quick Services',
    scheduledAt: 'Yesterday 11:00 AM',
    status: 'missed',
    type: 'call',
    notes: 'No answer',
    value: 4200
  },
];

export default function ResellerFollowupsPage() {
  return (
    <RoleLayout role="reseller">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Follow-up Scheduler</h1>
            <p className="text-muted-foreground">Manage your lead follow-ups and calls</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Follow-up
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Missed</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Follow-up List */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Follow-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {followups.map((followup) => (
                <div key={followup.id} className={`flex items-center justify-between p-4 rounded-lg ${
                  followup.status === 'missed' ? 'bg-red-500/10 border border-red-500/30' :
                  followup.status === 'completed' ? 'bg-emerald-500/10 border border-emerald-500/30' :
                  'bg-muted/50'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      followup.type === 'call' ? 'bg-blue-500/20' :
                      followup.type === 'email' ? 'bg-violet-500/20' :
                      'bg-emerald-500/20'
                    }`}>
                      {followup.type === 'call' ? (
                        <Phone className="h-5 w-5 text-blue-500" />
                      ) : followup.type === 'email' ? (
                        <Mail className="h-5 w-5 text-violet-500" />
                      ) : (
                        <MessageSquare className="h-5 w-5 text-emerald-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{followup.leadName}</p>
                      <p className="text-sm text-muted-foreground">{followup.company}</p>
                      <p className="text-xs text-muted-foreground mt-1">{followup.notes}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{followup.scheduledAt}</span>
                      </div>
                      <Badge variant="outline" className={
                        followup.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        followup.status === 'missed' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }>
                        {followup.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1">${followup.value.toLocaleString()}</p>
                    </div>
                    {followup.status === 'pending' && (
                      <div className="flex flex-col gap-2">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Reschedule
                        </Button>
                      </div>
                    )}
                    {followup.status === 'missed' && (
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reschedule
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Reminder */}
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-sm text-blue-400">
            <strong>AI Tip:</strong> Leads contacted within 4 hours of assignment have 40% higher conversion rates. 
            You have 2 new leads waiting for initial contact.
          </p>
        </div>
      </div>
    </RoleLayout>
  );
}
