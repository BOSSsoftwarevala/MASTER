import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useMilestones, useProjects, useCreateMilestone, useUpdateMilestone, useDevelopmentRealtime } from '@/hooks/useDevelopmentManagerData';
import { Plus, Search, Target, Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MilestonesPage() {
  const { data: milestones, isLoading } = useMilestones();
  const { data: projects } = useProjects();
  const createMilestone = useCreateMilestone();
  const updateMilestone = useUpdateMilestone();
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project_id: '',
    start_date: '',
    due_date: '',
  });
  useDevelopmentRealtime();

  const filteredMilestones = milestones?.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const getProjectName = (projectId: string) => {
    return projects?.find(p => p.id === projectId)?.name || 'Unknown';
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-blue-500/20 text-blue-600',
      completed: 'bg-green-500/20 text-green-600',
      cancelled: 'bg-gray-500/20 text-gray-600',
    };
    return <Badge className={styles[status] || ''}>{status}</Badge>;
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.project_id) return;
    await createMilestone.mutateAsync({
      name: formData.name,
      description: formData.description || null,
      project_id: formData.project_id,
      start_date: formData.start_date || null,
      due_date: formData.due_date || null,
      status: 'active',
      progress: 0,
      created_by: null,
    });
    setFormData({ name: '', description: '', project_id: '', start_date: '', due_date: '' });
    setIsCreateOpen(false);
  };

  const handleComplete = async (id: string) => {
    await updateMilestone.mutateAsync({
      id,
      status: 'completed',
      completed_at: new Date().toISOString(),
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Milestones</h1>
            <p className="text-muted-foreground">Manage project sprints and milestones</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Milestone
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Milestone</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Sprint 1"
                  />
                </div>
                <div>
                  <Label>Project</Label>
                  <Select value={formData.project_id} onValueChange={(v) => setFormData({ ...formData, project_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects?.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleCreate} disabled={createMilestone.isPending} className="w-full">
                  Create Milestone
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search milestones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading milestones...</div>
        ) : filteredMilestones?.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No milestones found
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMilestones?.map((milestone) => (
              <Card key={milestone.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-cyan-500" />
                      <CardTitle className="text-lg">{milestone.name}</CardTitle>
                    </div>
                    {getStatusBadge(milestone.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{getProjectName(milestone.project_id)}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {milestone.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{milestone.description}</p>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.progress} className="h-2" />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {milestone.start_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Start: {format(new Date(milestone.start_date), 'MMM d')}
                      </div>
                    )}
                    {milestone.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {format(new Date(milestone.due_date), 'MMM d')}
                      </div>
                    )}
                  </div>
                  {milestone.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleComplete(milestone.id)}
                      className="w-full"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark Complete
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
