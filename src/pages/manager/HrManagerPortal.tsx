import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, UserPlus, Calendar, ClipboardCheck, Activity, CheckCircle } from 'lucide-react';

export default function HrManagerPortal() {
  const navigate = useNavigate();

  const widgets = [
    { title: 'Total Employees', value: 127, icon: Users, color: 'text-[hsl(var(--boss-accent-blue))]', change: '12 on notice' },
    { title: 'Open Positions', value: 8, icon: Briefcase, color: 'text-amber-400', change: '3 urgent' },
    { title: 'Applications', value: 45, icon: UserPlus, color: 'text-emerald-400', change: '+15 today' },
    { title: 'Interviews', value: 12, icon: Calendar, color: 'text-violet-400', change: '5 this week' },
  ];

  return (
    <ManagerLayout role="hr">
      <div className="space-y-6">
        {/* Header with Dark Luxury Theme */}
        <div className="relative rounded-[18px] overflow-hidden p-6 bg-gradient-to-r from-[hsl(var(--boss-sidebar))] via-[hsl(var(--boss-card))] to-[hsl(var(--boss-card-hover))] border border-[hsl(var(--boss-border))] shadow-[0_8px_32px_hsl(0_0%_0%/0.4)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(45_100%_50%/0.08),transparent_50%)]" />
          <div className="relative">
            <h1 className="text-3xl font-bold text-[hsl(var(--boss-text-primary))]">HR Manager</h1>
            <p className="text-[hsl(var(--boss-text-muted))]">Manage employees, hiring, and company policies</p>
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
              onClick={() => navigate('/manager/hr/jobs')}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/hr/applications')}
              className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-secondary))] hover:bg-[hsl(var(--boss-card-hover))] hover:text-[hsl(var(--boss-text-primary))]"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Review Applications
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/hr/employees')}
              className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-secondary))] hover:bg-[hsl(var(--boss-card-hover))] hover:text-[hsl(var(--boss-text-primary))]"
            >
              <Users className="h-4 w-4 mr-2" />
              View Employees
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/manager/hr/attendance')}
              className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-secondary))] hover:bg-[hsl(var(--boss-card-hover))] hover:text-[hsl(var(--boss-text-primary))]"
            >
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Check Attendance
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
                  <span className="text-sm text-[hsl(var(--boss-text-primary))]">John Smith hired as Senior Developer</span>
                </div>
                <span className="text-xs text-[hsl(var(--boss-text-muted))]">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[hsl(var(--boss-border))]">
                <div className="flex items-center gap-3">
                  <UserPlus className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-[hsl(var(--boss-text-primary))]">8 new applications for Marketing role</span>
                </div>
                <span className="text-xs text-[hsl(var(--boss-text-muted))]">5 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-violet-400" />
                  <span className="text-sm text-[hsl(var(--boss-text-primary))]">Interview scheduled with Jane Doe</span>
                </div>
                <span className="text-xs text-[hsl(var(--boss-text-muted))]">Tomorrow 10 AM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerLayout>
  );
}
