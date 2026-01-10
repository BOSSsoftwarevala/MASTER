import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Edit, Check, X, Clock } from 'lucide-react';
import { 
  useAttendanceLogs, useUpdateAttendance, 
  useLeaveRequests, useUpdateLeaveRequest,
  AttendanceLog, LeaveRequest 
} from '@/hooks/useHRData';
import { format } from 'date-fns';

export default function AttendancePage() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(today);
  const [leaveFilter, setLeaveFilter] = useState<string>('pending');
  const [editAttendance, setEditAttendance] = useState<AttendanceLog | null>(null);
  const [attendanceData, setAttendanceData] = useState({
    status: '',
    notes: '',
  });
  
  const { data: attendance, isLoading: loadingAttendance } = useAttendanceLogs(selectedDate);
  const { data: leaves, isLoading: loadingLeaves } = useLeaveRequests(leaveFilter || undefined);
  const updateAttendance = useUpdateAttendance();
  const updateLeave = useUpdateLeaveRequest();

  const getAttendanceStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      present: 'bg-green-500/10 text-green-500',
      absent: 'bg-red-500/10 text-red-500',
      half_day: 'bg-amber-500/10 text-amber-500',
      work_from_home: 'bg-blue-500/10 text-blue-500',
      on_leave: 'bg-purple-500/10 text-purple-500',
    };
    return (
      <Badge className={colors[status] || 'bg-gray-500/10 text-gray-500'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getLeaveStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      cancelled: 'outline',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const openEditDialog = (record: AttendanceLog) => {
    setEditAttendance(record);
    setAttendanceData({
      status: record.status,
      notes: record.notes || '',
    });
  };

  const handleUpdateAttendance = async () => {
    if (editAttendance) {
      await updateAttendance.mutateAsync({
        id: editAttendance.id,
        ...attendanceData,
      } as any);
      setEditAttendance(null);
    }
  };

  const handleLeaveAction = async (id: string, status: 'approved' | 'rejected') => {
    await updateLeave.mutateAsync({
      id,
      status,
      approved_at: status === 'approved' ? new Date().toISOString() : undefined,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Attendance & Leave</h1>
          <p className="text-muted-foreground">Track attendance and manage leave requests</p>
        </div>

        <Tabs defaultValue="attendance">
          <TabsList>
            <TabsTrigger value="attendance">Daily Attendance</TabsTrigger>
            <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Attendance Log
                  </CardTitle>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-40"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {loadingAttendance ? (
                  <div className="text-center py-8">Loading attendance...</div>
                ) : attendance?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No attendance records for {selectedDate}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendance?.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {(record.employees as any)?.first_name} {(record.employees as any)?.last_name}
                            <span className="text-xs text-muted-foreground block">
                              {(record.employees as any)?.employee_code}
                            </span>
                          </TableCell>
                          <TableCell>{(record.employees as any)?.department || '-'}</TableCell>
                          <TableCell>
                            {record.check_in 
                              ? format(new Date(record.check_in), 'HH:mm')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {record.check_out 
                              ? format(new Date(record.check_out), 'HH:mm')
                              : '-'}
                          </TableCell>
                          <TableCell>{getAttendanceStatusBadge(record.status)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {record.notes || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(record)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaves" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Leave Requests</CardTitle>
                  <div className="flex gap-2">
                    {['pending', 'approved', 'rejected', ''].map((status) => (
                      <Button
                        key={status}
                        variant={leaveFilter === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLeaveFilter(status)}
                      >
                        {status || 'All'}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingLeaves ? (
                  <div className="text-center py-8">Loading leave requests...</div>
                ) : leaves?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No leave requests found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaves?.map((leave) => (
                        <TableRow key={leave.id}>
                          <TableCell className="font-medium">
                            {(leave.employees as any)?.first_name} {(leave.employees as any)?.last_name}
                          </TableCell>
                          <TableCell className="capitalize">{leave.leave_type}</TableCell>
                          <TableCell>{new Date(leave.start_date).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(leave.end_date).toLocaleDateString()}</TableCell>
                          <TableCell>{leave.days_count}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {leave.reason || '-'}
                          </TableCell>
                          <TableCell>{getLeaveStatusBadge(leave.status)}</TableCell>
                          <TableCell className="text-right">
                            {leave.status === 'pending' && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleLeaveAction(leave.id, 'approved')}
                                >
                                  <Check className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleLeaveAction(leave.id, 'rejected')}
                                >
                                  <X className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!editAttendance} onOpenChange={() => setEditAttendance(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={attendanceData.status}
                onValueChange={(value) => setAttendanceData({ ...attendanceData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="half_day">Half Day</SelectItem>
                  <SelectItem value="work_from_home">Work From Home</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={attendanceData.notes}
                onChange={(e) => setAttendanceData({ ...attendanceData, notes: e.target.value })}
                placeholder="Reason for adjustment..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAttendance(null)}>Cancel</Button>
            <Button onClick={handleUpdateAttendance} disabled={updateAttendance.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
