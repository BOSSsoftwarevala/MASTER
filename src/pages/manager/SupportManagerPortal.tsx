import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Ticket, Clock, Headphones, AlertTriangle, Star, Activity, CheckCircle } from 'lucide-react';

export default function SupportManagerPortal() {
  const navigate = useNavigate();

  const widgets = [
    { title: 'Open Tickets', value: 42, icon: Ticket, color: 'text-[hsl(var(--boss-accent-blue))]', change: '12 high priority' },
    { title: 'SLA Breaches', value: 3, icon: AlertTriangle, color: 'text-red-400', change: 'Needs attention' },
    { title: 'Active Assists', value: 5, icon: Headphones, color: 'text-[hsl(var(--boss-accent-neon))]', change: '2 in queue' },
    { title: 'Avg. Rating', value: '4.7', icon: Star, color: 'text-amber-400', change: '+0.2 this week' },
  ];

  return (
    <ManagerLayout role="support">
      <div className="space-y-6">
        {/* Header with Dark Luxury Theme */}
        <div className="relative rounded-[18px] overflow-hidden p-6 bg-gradient-to-r from-[hsl(var(--boss-sidebar))] via-[hsl(var(--boss-card))] to-[hsl(var(--boss-card-hover))] border border-[hsl(var(--boss-border))] shadow-[0_8px_32px_hsl(0_0%_0%/0.4)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(190_100%_50%/0.08),transparent_50%)]" />
          <div className="relative">
            <h1 className="text-3xl font-bold text-[hsl(var(--boss-text-primary))]">Support Manager</h1>
            <p className="text-[hsl(var(--boss-text-muted))]">Manage tickets, SLA, and assist sessions</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {widgets.map((widget) => (
            <Card key={widget.title} className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] hover:bg-[hsl(var(--boss-card-hover))] transition-colors rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[hsl(var(--boss-text-secondary))]">{widget.title}</CardTitle>
                <widget.icon className={`h-4 w-4 ${widget.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[hsl(var(--boss-text-primary))]">{widget.value}</div>
                <p className="text-xs text-[hsl(var(--boss-text-muted))]">{widget.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--boss-text-primary))]">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button 
              onClick={() => navigate('/manager/support/tickets')}
              className="bg-[hsl(var(--boss-accent-blue))] hover:bg-[hsl(var(--boss-accent-blue))]/80 text-white"
            >
              <Ticket className="h-4 w-4 mr-2" />
              Open Tickets
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/support/priority')}
              className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-secondary))] hover:bg-[hsl(var(--boss-card-hover))] hover:text-[hsl(var(--boss-text-primary))]"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Priority Queue
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/support/assist')}
              className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-secondary))] hover:bg-[hsl(var(--boss-card-hover))] hover:text-[hsl(var(--boss-text-primary))]"
            >
              <Headphones className="h-4 w-4 mr-2" />
              Assist Sessions
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/support/sla')}
              className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-secondary))] hover:bg-[hsl(var(--boss-card-hover))] hover:text-[hsl(var(--boss-text-primary))]"
            >
              <Clock className="h-4 w-4 mr-2" />
              SLA Timers
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] rounded-[18px] shadow-[0_4px_20px_hsl(0_0%_0%/0.3)]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--boss-text-primary))] flex items-center gap-2">
              <Activity className="h-5 w-5 text-[hsl(var(--boss-accent-blue))]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-[hsl(var(--boss-border))]">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-[hsl(var(--boss-text-primary))]">Ticket #4521 resolved - Billing issue</span>
                </div>
                <span className="text-xs text-[hsl(var(--boss-text-muted))]">15 min ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[hsl(var(--boss-border))]">
                <div className="flex items-center gap-3">
                  <Headphones className="h-4 w-4 text-[hsl(var(--boss-accent-neon))]" />
                  <span className="text-sm text-[hsl(var(--boss-text-primary))]">Assist session started with Client #892</span>
                </div>
                <span className="text-xs text-emerald-400">Active now</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-[hsl(var(--boss-text-primary))]">SLA warning: Ticket #4518 approaching deadline</span>
                </div>
                <span className="text-xs text-amber-400">30 min left</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerLayout>
  );
}
