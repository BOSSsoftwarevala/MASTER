import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Target, TrendingUp, Handshake, DollarSign, Award, Calendar, Activity, CheckCircle, Phone } from 'lucide-react';

export default function SalesManagerPortal() {
  const navigate = useNavigate();

  const widgets = [
    { title: 'Total Leads', value: 234, icon: Target, color: 'text-rose-400', change: '+28 this week' },
    { title: 'Active Pipeline', value: '$1.2M', icon: TrendingUp, color: 'text-[hsl(var(--boss-accent-blue))]', change: '45 deals' },
    { title: 'Closed Deals', value: 18, icon: Handshake, color: 'text-emerald-400', change: '$420K value' },
    { title: 'Monthly Target', value: '78%', icon: Award, color: 'text-amber-400', change: 'On track' },
  ];

  return (
    <ManagerLayout role="sales">
      <div className="space-y-6">
        {/* Header with Dark Luxury Theme */}
        <div className="relative rounded-[18px] overflow-hidden p-6 bg-gradient-to-r from-[hsl(var(--boss-sidebar))] via-[hsl(var(--boss-card))] to-[hsl(var(--boss-card-hover))] border border-[hsl(var(--boss-border))] shadow-[0_8px_32px_hsl(0_0%_0%/0.4)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(350_100%_50%/0.08),transparent_50%)]" />
          <div className="relative">
            <h1 className="text-3xl font-bold text-[hsl(var(--boss-text-primary))]">Sales Manager</h1>
            <p className="text-[hsl(var(--boss-text-muted))]">Track leads, manage pipeline, and close deals</p>
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
              onClick={() => navigate('/manager/sales/leads')}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              <Target className="h-4 w-4 mr-2" />
              View Leads
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/sales/pipeline')}
              className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-secondary))] hover:bg-[hsl(var(--boss-card-hover))] hover:text-[hsl(var(--boss-text-primary))]"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Manage Pipeline
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/sales/followups')}
              className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-secondary))] hover:bg-[hsl(var(--boss-card-hover))] hover:text-[hsl(var(--boss-text-primary))]"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Follow-ups
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/sales/targets')}
              className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-secondary))] hover:bg-[hsl(var(--boss-card-hover))] hover:text-[hsl(var(--boss-text-primary))]"
            >
              <Award className="h-4 w-4 mr-2" />
              View Targets
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
                  <span className="text-sm text-[hsl(var(--boss-text-primary))]">Deal closed with Acme Corp - $85,000</span>
                </div>
                <span className="text-xs text-[hsl(var(--boss-text-muted))]">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[hsl(var(--boss-border))]">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-rose-400" />
                  <span className="text-sm text-[hsl(var(--boss-text-primary))]">Demo scheduled with TechStart Inc</span>
                </div>
                <span className="text-xs text-[hsl(var(--boss-text-muted))]">3 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Target className="h-4 w-4 text-[hsl(var(--boss-accent-blue))]" />
                  <span className="text-sm text-[hsl(var(--boss-text-primary))]">15 new leads assigned</span>
                </div>
                <span className="text-xs text-[hsl(var(--boss-text-muted))]">Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerLayout>
  );
}
