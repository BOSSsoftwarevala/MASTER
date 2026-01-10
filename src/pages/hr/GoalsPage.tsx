import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Target, Plus, Edit, Eye } from 'lucide-react';
import { useEmployeeGoals, useCreateEmployeeGoal, useUpdateEmployeeGoal, useEmployees } from '@/hooks/useHRData';
import { format } from 'date-fns';

export default function GoalsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{ open: boolean; goal: any }>({ open: false, goal: null });
  const [formData, setFormData] = useState({
    employee_id: '',
    title: '',
    description: '',
    target_date: '',
    status: 'active',
    progress: 0,
  });

  const { data: goals, isLoading } = useEmployeeGoals();
  const { data: employees } = useEmployees('active');
  const createGoal = useCreateEmployeeGoal();
  const updateGoal = useUpdateEmployeeGoal();

  const filteredGoals = goals?.filter(g => {
    const matchesSearch = !search || 
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      `${g.employees?.first_name || ''} ${g.employees?.last_name || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'secondary',
      completed: 'default',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const handleCreate = async () => {
    await createGoal.mutateAsync(formData as any);
    setCreateDialog(false);
    setFormData({
      employee_id: '',
      title: '',
      description: '',
      target_date: '',
      status: 'active',
      progress: 0,
    });
  };

  const handleUpdate = async () => {
    if (!editDialog.goal) return;
    await updateGoal.mutateAsync({
      id: editDialog.goal.id,
      employee_id: formData.employee_id,
      title: formData.title,
      description: formData.description || undefined,
      target_date: formData.target_date || undefined,
      status: formData.status as 'active' | 'completed' | 'cancelled',
      progress: formData.progress,
      completed_at: formData.status === 'completed' ? new Date().toISOString() : undefined,
    });
    setEditDialog({ open: false, goal: null });
  };

  const openEditDialog = (goal: any) => {
    setFormData({
      employee_id: goal.employee_id,
      title: goal.title,
      description: goal.description || '',
      target_date: goal.target_date || '',
      status: goal.status,
      progress: goal.progress,
    });
    setEditDialog({ open: true, goal });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Employee Goals</h1>
            <p className="text-muted-foreground">Track and manage employee goals and objectives</p>
          </div>
          <Button onClick={() => setCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goals Tracker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by goal or employee..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'active', 'completed', 'cancelled'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading goals...</div>
            ) : filteredGoals?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No goals found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Goal</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGoals?.map((goal) => (
                    <TableRow key={goal.id}>
                      <TableCell>
                        <p className="font-medium">
                          {goal.employees?.first_name} {goal.employees?.last_name}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{goal.title}</p>
                          {goal.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{goal.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {goal.target_date ? format(new Date(goal.target_date), 'MMM dd, yyyy') : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="w-32 space-y-1">
                          <Progress value={goal.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground text-center">{goal.progress}%</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(goal.status)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(goal)}>
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

      {/* Create Goal Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Employee *</Label>
              <Select
                value={formData.employee_id}
                onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees?.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name} ({emp.employee_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Goal Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Complete certification..."
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Goal details..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Target Date</Label>
              <Input
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!formData.employee_id || !formData.title || createGoal.isPending}>
              Create Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, goal: open ? editDialog.goal : null })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Goal Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Date</Label>
                <Input
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Progress: {formData.progress}%</Label>
              <Input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false, goal: null })}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={!formData.title || updateGoal.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
