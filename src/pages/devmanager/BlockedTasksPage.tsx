import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTasks, useProjects, useDevelopers, useUpdateTask, useDevelopmentRealtime } from '@/hooks/useDevelopmentManagerData';
import { Search, Ban, PlayCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function BlockedTasksPage() {
  const navigate = useNavigate();
  const { data: tasks, isLoading } = useTasks();
  const { data: projects } = useProjects();
  const { data: developers } = useDevelopers();
  const updateTask = useUpdateTask();
  const [search, setSearch] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  useDevelopmentRealtime();

  // Filter tasks that have blocked_reason or are in a blocked-like state
  const blockedTasks = tasks?.filter((task) => task.blocked_reason || task.status === 'review');
  
  const filteredTasks = blockedTasks?.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.blocked_reason?.toLowerCase().includes(search.toLowerCase())
  );

  const getProjectName = (projectId: string) => projects?.find(p => p.id === projectId)?.name || 'Unknown';
  const getDeveloperName = (devId: string | null) => devId ? developers?.find(d => d.id === devId)?.name || 'Unassigned' : 'Unassigned';

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: 'bg-gray-500/20 text-gray-600',
      medium: 'bg-blue-500/20 text-blue-600',
      high: 'bg-amber-500/20 text-amber-600',
      critical: 'bg-red-500/20 text-red-600',
    };
    return <Badge className={styles[priority] || ''}>{priority}</Badge>;
  };

  const handleBlock = async () => {
    if (!selectedTaskId || !blockReason) return;
    await updateTask.mutateAsync({
      id: selectedTaskId,
      blocked_reason: blockReason,
    });
    setSelectedTaskId(null);
    setBlockReason('');
  };

  const handleUnblock = async (id: string) => {
    await updateTask.mutateAsync({
      id,
      blocked_reason: null,
      status: 'in_progress',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blocked Tasks</h1>
            <p className="text-muted-foreground">Tasks that are blocked and need attention</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Ban className="h-4 w-4 text-red-500" />
                Blocked Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {tasks?.filter(t => t.blocked_reason).length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                In Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {tasks?.filter(t => t.status === 'review').length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search blocked tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading tasks...</div>
            ) : filteredTasks?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No blocked tasks found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Block Reason</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks?.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Ban className="h-4 w-4 text-red-500" />
                          <span 
                            className="font-medium cursor-pointer hover:underline"
                            onClick={() => navigate(`/dashboard/devmanager/tasks/edit/${task.id}`)}
                          >
                            {task.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getProjectName(task.project_id)}</TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell>{getDeveloperName(task.assigned_to)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {task.blocked_reason || 'In review'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {task.blocked_reason ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnblock(task.id)}
                            >
                              <PlayCircle className="mr-1 h-4 w-4" />
                              Unblock
                            </Button>
                          ) : (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedTaskId(task.id)}
                                >
                                  <Ban className="mr-1 h-4 w-4" />
                                  Block
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Block Task: {task.title}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                  <div>
                                    <Label>Block Reason</Label>
                                    <Textarea
                                      value={blockReason}
                                      onChange={(e) => setBlockReason(e.target.value)}
                                      placeholder="Why is this task blocked?"
                                    />
                                  </div>
                                  <Button
                                    onClick={handleBlock}
                                    disabled={updateTask.isPending}
                                    className="w-full"
                                  >
                                    Block Task
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
