import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Briefcase, FileText, Calendar, 
  Star, LogOut, Plus, Eye, UserPlus, ClipboardList
} from 'lucide-react';
import { useHRDashboardStats } from '@/hooks/useHRData';

export default function HRDashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useHRDashboardStats();

  const statCards = [
    { 
      title: 'Total Employees', 
      value: stats?.totalEmployees || 0, 
      subtitle: `${stats?.onNotice || 0} on notice`,
      icon: Users, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      title: 'Open Positions', 
      value: stats?.openPositions || 0, 
      icon: Briefcase, 
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    { 
      title: 'Applications Today', 
      value: stats?.applicationsToday || 0, 
      icon: FileText, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    { 
      title: 'Pending Leaves', 
      value: stats?.pendingLeaves || 0, 
      icon: Calendar, 
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    { 
      title: 'Reviews Due', 
      value: stats?.reviewsDue || 0, 
      icon: Star, 
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    { 
      title: 'Exit Requests', 
      value: stats?.exitRequests || 0, 
      icon: LogOut, 
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
  ];

  const quickActions = [
    { label: 'Add Employee', icon: UserPlus, path: '/dashboard/hr/employees/add' },
    { label: 'Post Job', icon: Plus, path: '/dashboard/hr/jobs/create' },
    { label: 'View Applications', icon: Eye, path: '/dashboard/hr/applications' },
    { label: 'Start Review', icon: ClipboardList, path: '/dashboard/hr/reviews/create' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">HR Manager Dashboard</h1>
          <p className="text-muted-foreground">Manage employees, hiring, attendance, and performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((card) => (
            <Card key={card.title} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold">
                      {isLoading ? '...' : card.value}
                    </p>
                    {card.subtitle && (
                      <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={() => navigate(action.path)}
                >
                  <action.icon className="h-6 w-6" />
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Module Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/dashboard/hr/employees')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage employee profiles, documents, and status
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/dashboard/hr/jobs')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-500" />
                Hiring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Job openings, applications, and recruitment
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/dashboard/hr/attendance')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                Attendance & Leave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track attendance, manage leave requests
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/dashboard/hr/salary')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-500" />
                Payroll (View Only)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View salary summaries and payslips
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/dashboard/hr/reviews')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-orange-500" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Reviews, goals, and feedback management
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/dashboard/hr/exits')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5 text-red-500" />
                Exits & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Resignations, clearances, and documentation
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
