import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, Building, Calendar, DollarSign, User } from 'lucide-react';
import { useEmployee, useEmployeeGoals, useEmployeeDocuments } from '@/hooks/useHRData';
import { format } from 'date-fns';

export default function EmployeeViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: employee, isLoading } = useEmployee(id || '');
  const { data: goals } = useEmployeeGoals(id);
  const { data: documents } = useEmployeeDocuments(id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading employee details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Employee not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      on_notice: 'secondary',
      inactive: 'outline',
      terminated: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{employee.first_name} {employee.last_name}</h1>
              <p className="text-muted-foreground">{employee.employee_code}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {getStatusBadge(employee.status || 'active')}
            <Button onClick={() => navigate(`/dashboard/hr/employees/edit/${employee.id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Employee Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {employee.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {employee.phone || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {employee.department || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Designation</p>
                  <p className="font-medium">{employee.designation || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employment Type</p>
                  <Badge variant="outline">{employee.employment_type.replace('_', ' ')}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joining Date</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {employee.joining_date ? format(new Date(employee.joining_date), 'MMM dd, yyyy') : '-'}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Compensation</h3>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Salary</p>
                    <p className="text-2xl font-bold">{formatCurrency(employee.salary || 0)}</p>
                  </div>
                </div>
              </div>

              {employee.status === 'on_notice' && employee.notice_date && (
                <>
                  <Separator />
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Notice Period</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Notice Date: {format(new Date(employee.notice_date), 'MMM dd, yyyy')}
                    </p>
                    {employee.exit_date && (
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Last Working Day: {format(new Date(employee.exit_date), 'MMM dd, yyyy')}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Goals & Documents */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Goals</CardTitle>
              </CardHeader>
              <CardContent>
                {goals?.filter(g => g.status === 'active').length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active goals</p>
                ) : (
                  <div className="space-y-3">
                    {goals?.filter(g => g.status === 'active').slice(0, 3).map((goal) => (
                      <div key={goal.id} className="p-3 border rounded-lg">
                        <p className="font-medium text-sm">{goal.title}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2" 
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{goal.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {documents?.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No documents uploaded</p>
                ) : (
                  <div className="space-y-2">
                    {documents?.slice(0, 5).map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="text-sm font-medium">{doc.document_name}</p>
                          <p className="text-xs text-muted-foreground">{doc.document_type}</p>
                        </div>
                        {doc.verified_at ? (
                          <Badge variant="default" className="text-xs">Verified</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Pending</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
