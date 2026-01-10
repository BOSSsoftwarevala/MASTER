import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTasks, useProjects, useDevelopers, useUpdateTask, useDevelopmentRealtime } from '@/hooks/useDevelopmentManagerData';
import { Plus, Search, ListTodo, MoveRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusColumns = [
  { key: 'backlog', label: 'Backlog', color: 'bg-gray-500' },
  { key: 'todo', label: 'To Do', color: 'bg-blue-500' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-amber-500' },
  { key: 'review', label: 'Review', color: 'bg-purple-500' },
  { key: 'completed', label: 'Completed', color: 'bg-green-500' },
];

export default function TasksPage() {
  const navigate = useNavigate();
  const { data: tasks, isLoading } = useTasks();
  const { data: projects } = useProjects();
  const { data: developers } = useDevelopers();
  const updateTask = useUpdateTask();
  const [search, setSearch] = useState('');
  useDevelopmentRealtime();

  const filteredTasks = tasks?.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.description?.toLowerCase().includes(search.toLowerCase())
  );

  const getProjectName = (projectId: string) => {
    return projects?.find(p => p.id === projectId)?.name || 'Unknown';
  };

  const getDeveloperName = (devId: string | null) => {
    if (!devId) return 'Unassigned';
    return developers?.find(d => d.id === devId)?.name || 'Unknown';
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-500/20 text-gray-600',
      medium: 'bg-blue-500/20 text-blue-600',
      high: 'bg-amber-500/20 text-amber-600',
      critical: 'bg-red-500/20 text-red-600',
    };
    return <Badge className={colors[priority] || ''}>{priority}</Badge>;
  };

  const moveTask = async (taskId: string, newStatus: string) => {
    await updateTask.mutateAsync({
      id: taskId,
      status: newStatus as any,
      completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Board</h1>
            <p className="text-muted-foreground">Manage and track task progress</p>
          </div>
          <Button onClick={() => navigate('/dashboard/devmanager/tasks/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading tasks...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-5 overflow-x-auto">
            {statusColumns.map((column) => {
              const columnTasks = filteredTasks?.filter(t => t.status === column.key) || [];
              return (
                <Card key={column.key}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${column.color}`} />
                      {column.label}
                      <Badge variant="secondary" className="ml-auto">
                        {columnTasks.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 min-h-[300px]">
                    {columnTasks.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No tasks</p>
                    ) : (
                      columnTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow cursor-pointer"
                          onClick={() => navigate(`/dashboard/devmanager/tasks/edit/${task.id}`)}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-sm font-medium line-clamp-2">{task.title}</h4>
                            {getPriorityBadge(task.priority)}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                            {getProjectName(task.project_id)}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {getDeveloperName(task.assigned_to)}
                            </span>
                            {column.key !== 'completed' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextStatus = statusColumns[statusColumns.findIndex(c => c.key === column.key) + 1]?.key;
                                  if (nextStatus) moveTask(task.id, nextStatus);
                                }}
                              >
                                <MoveRight className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
