import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Eye, Edit, Check, Archive } from 'lucide-react';
import { useExitRequests, useUpdateExitRequest, ExitRequest } from '@/hooks/useHRData';

export default function ExitsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editExit, setEditExit] = useState<ExitRequest | null>(null);
  const [exitData, setExitData] = useState({
    status: '',
    exit_interview_done: false,
    exit_interview_notes: '',
    clearance_hr: false,
    clearance_it: false,
    clearance_finance: false,
    clearance_admin: false,
  });
  
  const { data: exits, isLoading } = useExitRequests(statusFilter || undefined);
  const updateExit = useUpdateExitRequest();

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      initiated: 'bg-blue-500/10 text-blue-500',
      in_progress: 'bg-purple-500/10 text-purple-500',
      clearance_pending: 'bg-amber-500/10 text-amber-500',
      completed: 'bg-green-500/10 text-green-500',
      cancelled: 'bg-gray-500/10 text-gray-500',
    };
    return (
      <Badge className={colors[status] || 'bg-gray-500/10 text-gray-500'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getExitTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      resignation: 'bg-blue-500/10 text-blue-500',
      termination: 'bg-red-500/10 text-red-500',
      retirement: 'bg-green-500/10 text-green-500',
      end_of_contract: 'bg-amber-500/10 text-amber-500',
    };
    return (
      <Badge className={colors[type] || 'bg-gray-500/10 text-gray-500'}>
        {type.replace('_', ' ')}
      </Badge>
    );
  };

  const openEditDialog = (exit: ExitRequest) => {
    setEditExit(exit);
    setExitData({
      status: exit.status,
      exit_interview_done: exit.exit_interview_done,
      exit_interview_notes: exit.exit_interview_notes || '',
      clearance_hr: exit.clearance_hr,
      clearance_it: exit.clearance_it,
      clearance_finance: exit.clearance_finance,
      clearance_admin: exit.clearance_admin,
    });
  };

  const handleUpdateExit = async () => {
    if (editExit) {
      await updateExit.mutateAsync({
        id: editExit.id,
        ...exitData,
      } as any);
      setEditExit(null);
    }
  };

  const allClearancesComplete = () => {
    return exitData.clearance_hr && 
           exitData.clearance_it && 
           exitData.clearance_finance && 
           exitData.clearance_admin;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Exits & Compliance</h1>
          <p className="text-muted-foreground">Manage resignations, clearances, and documentation</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Exit Requests</CardTitle>
              <div className="flex gap-2">
                {['', 'initiated', 'in_progress', 'clearance_pending', 'completed'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status ? status.replace('_', ' ') : 'All'}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading exit requests...</div>
            ) : exits?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No exit requests found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Notice Date</TableHead>
                    <TableHead>Last Working Day</TableHead>
                    <TableHead>Clearances</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exits?.map((exit) => (
                    <TableRow key={exit.id}>
                      <TableCell className="font-medium">
                        {(exit.employees as any)?.first_name} {(exit.employees as any)?.last_name}
                        <span className="text-xs text-muted-foreground block">
                          {(exit.employees as any)?.employee_code}
                        </span>
                      </TableCell>
                      <TableCell>{getExitTypeBadge(exit.exit_type)}</TableCell>
                      <TableCell>{new Date(exit.notice_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {exit.last_working_date 
                          ? new Date(exit.last_working_date).toLocaleDateString() 
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge variant={exit.clearance_hr ? 'default' : 'outline'} className="text-xs">
                            HR
                          </Badge>
                          <Badge variant={exit.clearance_it ? 'default' : 'outline'} className="text-xs">
                            IT
                          </Badge>
                          <Badge variant={exit.clearance_finance ? 'default' : 'outline'} className="text-xs">
                            Finance
                          </Badge>
                          <Badge variant={exit.clearance_admin ? 'default' : 'outline'} className="text-xs">
                            Admin
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(exit.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(exit)}
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
      </div>

      <Dialog open={!!editExit} onOpenChange={() => setEditExit(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Exit Request</DialogTitle>
          </DialogHeader>
          {editExit && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">
                  {(editExit.employees as any)?.first_name} {(editExit.employees as any)?.last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {editExit.exit_type.replace('_', ' ')} - Notice: {new Date(editExit.notice_date).toLocaleDateString()}
                </p>
                {editExit.reason && (
                  <p className="text-sm mt-2">{editExit.reason}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={exitData.status}
                  onValueChange={(value) => setExitData({ ...exitData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initiated">Initiated</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="clearance_pending">Clearance Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Clearances</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="clearance_hr"
                      checked={exitData.clearance_hr}
                      onCheckedChange={(checked) => 
                        setExitData({ ...exitData, clearance_hr: !!checked })
                      }
                    />
                    <Label htmlFor="clearance_hr">HR Clearance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="clearance_it"
                      checked={exitData.clearance_it}
                      onCheckedChange={(checked) => 
                        setExitData({ ...exitData, clearance_it: !!checked })
                      }
                    />
                    <Label htmlFor="clearance_it">IT Clearance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="clearance_finance"
                      checked={exitData.clearance_finance}
                      onCheckedChange={(checked) => 
                        setExitData({ ...exitData, clearance_finance: !!checked })
                      }
                    />
                    <Label htmlFor="clearance_finance">Finance Clearance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="clearance_admin"
                      checked={exitData.clearance_admin}
                      onCheckedChange={(checked) => 
                        setExitData({ ...exitData, clearance_admin: !!checked })
                      }
                    />
                    <Label htmlFor="clearance_admin">Admin Clearance</Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exit_interview"
                  checked={exitData.exit_interview_done}
                  onCheckedChange={(checked) => 
                    setExitData({ ...exitData, exit_interview_done: !!checked })
                  }
                />
                <Label htmlFor="exit_interview">Exit Interview Completed</Label>
              </div>

              {exitData.exit_interview_done && (
                <div className="space-y-2">
                  <Label>Exit Interview Notes</Label>
                  <Textarea
                    value={exitData.exit_interview_notes}
                    onChange={(e) => setExitData({ ...exitData, exit_interview_notes: e.target.value })}
                    placeholder="Notes from exit interview..."
                    rows={4}
                  />
                </div>
              )}

              {allClearancesComplete() && exitData.status !== 'completed' && (
                <div className="p-3 bg-green-500/10 text-green-600 rounded-md text-sm flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  All clearances complete. You can mark this exit as completed.
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditExit(null)}>Cancel</Button>
            <Button onClick={handleUpdateExit} disabled={updateExit.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
