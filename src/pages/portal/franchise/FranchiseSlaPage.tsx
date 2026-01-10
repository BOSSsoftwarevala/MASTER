import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Calendar
} from 'lucide-react';

const slaItems = [
  { 
    id: 1, 
    promise: 'Lead Response Time', 
    target: '24 hours', 
    current: '18 hours', 
    progress: 75, 
    status: 'on_track',
    dueDate: 'Ongoing'
  },
  { 
    id: 2, 
    promise: 'Monthly Conversions', 
    target: '50', 
    current: '42', 
    progress: 84, 
    status: 'on_track',
    dueDate: 'Jan 31'
  },
  { 
    id: 3, 
    promise: 'Customer Satisfaction', 
    target: '4.5 stars', 
    current: '4.2 stars', 
    progress: 93, 
    status: 'at_risk',
    dueDate: 'Ongoing'
  },
  { 
    id: 4, 
    promise: 'Reseller Onboarding', 
    target: '10 per quarter', 
    current: '8', 
    progress: 80, 
    status: 'on_track',
    dueDate: 'Mar 31'
  },
  { 
    id: 5, 
    promise: 'Revenue Target', 
    target: '$100,000', 
    current: '$84,500', 
    progress: 84.5, 
    status: 'on_track',
    dueDate: 'Jan 31'
  },
];

const promiseHistory = [
  { date: 'Dec 2024', promises: 5, met: 5, status: 'all_met' },
  { date: 'Nov 2024', promises: 5, met: 4, status: 'partial' },
  { date: 'Oct 2024', promises: 5, met: 5, status: 'all_met' },
  { date: 'Sep 2024', promises: 4, met: 4, status: 'all_met' },
];

export default function FranchiseSlaPage() {
  return (
    <RoleLayout role="franchise">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SLA & Promise Tracker</h1>
            <p className="text-muted-foreground">Monitor your service level agreements and commitments</p>
          </div>
          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <TrendingUp className="h-3 w-3 mr-1" />
            85% Overall Compliance
          </Badge>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">On Track</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">At Risk</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active SLAs</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Quarter</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SLA Items */}
        <Card>
          <CardHeader>
            <CardTitle>Current SLA Commitments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {slaItems.map((item) => (
                <div key={item.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.status === 'on_track' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      )}
                      <div>
                        <p className="font-medium">{item.promise}</p>
                        <p className="text-sm text-muted-foreground">
                          Target: {item.target} | Current: {item.current}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={
                        item.status === 'on_track' 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }>
                        {item.status === 'on_track' ? 'On Track' : 'At Risk'}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.dueDate}
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={item.progress} 
                    className={`h-2 ${item.status === 'at_risk' ? '[&>div]:bg-amber-500' : ''}`} 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle>Promise History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {promiseHistory.map((month, idx) => (
                <div key={idx} className={`p-4 rounded-lg border ${
                  month.status === 'all_met' ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-amber-500/30 bg-amber-500/10'
                }`}>
                  <p className="font-medium mb-2">{month.date}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Promises</span>
                    <span>{month.met}/{month.promises}</span>
                  </div>
                  <Badge variant="outline" className={`mt-2 ${
                    month.status === 'all_met' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {month.status === 'all_met' ? 'All Met' : 'Partial'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline">Download Report</Button>
          <Button>View Detailed Analytics</Button>
        </div>
      </div>
    </RoleLayout>
  );
}
