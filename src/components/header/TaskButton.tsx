import { useState } from 'react';
import { ClipboardList, Clock, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';

type RoleType = 'franchise' | 'reseller' | 'developer' | 'influencer' | 'support';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'overdue' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  type: string;
}

interface TaskButtonProps {
  role: RoleType;
}

const mockTasks: Record<RoleType, Task[]> = {
  developer: [
    { id: '1', title: 'Fix login bug', description: 'Auth token not refreshing properly', status: 'in_progress', priority: 'high', dueDate: '2026-01-06', type: 'Bug' },
    { id: '2', title: 'Review PR #234', description: 'Code review for payment module', status: 'pending', priority: 'medium', dueDate: '2026-01-07', type: 'Review' },
    { id: '3', title: 'Deploy staging', description: 'Push latest changes to staging', status: 'overdue', priority: 'urgent', dueDate: '2026-01-05', type: 'Deploy' },
  ],
  reseller: [
    { id: '1', title: 'Follow up: Acme Corp', description: 'Demo scheduled for next week', status: 'pending', priority: 'high', dueDate: '2026-01-07', type: 'Lead' },
    { id: '2', title: 'Close deal: TechStart', description: 'Pending contract signature', status: 'in_progress', priority: 'urgent', dueDate: '2026-01-06', type: 'Lead' },
    { id: '3', title: 'Daily target: 5 calls', description: '3/5 completed', status: 'in_progress', priority: 'medium', dueDate: '2026-01-06', type: 'Target' },
  ],
  franchise: [
    { id: '1', title: 'Approve reseller', description: 'New reseller application pending', status: 'pending', priority: 'high', dueDate: '2026-01-06', type: 'Approval' },
    { id: '2', title: 'Territory report', description: 'Monthly performance review', status: 'pending', priority: 'medium', dueDate: '2026-01-10', type: 'Report' },
  ],
  influencer: [
    { id: '1', title: 'Post campaign content', description: 'Instagram story for Product X', status: 'pending', priority: 'high', dueDate: '2026-01-07', type: 'Content' },
    { id: '2', title: 'Submit proof', description: 'Upload screenshot for Campaign #12', status: 'overdue', priority: 'urgent', dueDate: '2026-01-05', type: 'Proof' },
  ],
  support: [
    { id: '1', title: 'Ticket #4521', description: 'Customer unable to login', status: 'in_progress', priority: 'high', dueDate: '2026-01-06', type: 'Ticket' },
    { id: '2', title: 'Ticket #4519', description: 'Billing inquiry - refund request', status: 'pending', priority: 'medium', dueDate: '2026-01-07', type: 'Ticket' },
    { id: '3', title: 'Escalation #89', description: 'Critical system issue reported', status: 'overdue', priority: 'urgent', dueDate: '2026-01-05', type: 'Escalation' },
  ],
};

const roleLabels: Record<RoleType, string> = {
  developer: 'Development Tasks',
  reseller: 'Leads & Follow-ups',
  franchise: 'Approvals & Reports',
  influencer: 'Campaigns & Content',
  support: 'Tickets & Escalations',
};

export function TaskButton({ role }: TaskButtonProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const tasks = mockTasks[role] || [];

  const pendingCount = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
  const overdueCount = tasks.filter(t => t.status === 'overdue').length;

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    const styles = {
      urgent: 'bg-destructive/20 text-destructive border-destructive/30',
      high: 'bg-warning/20 text-warning border-warning/30',
      medium: 'bg-info/20 text-info border-info/30',
      low: 'bg-muted text-muted-foreground border-border',
    };
    return <Badge variant="outline" className={`text-[10px] ${styles[priority]}`}>{priority}</Badge>;
  };

  const filterTasks = (filter: 'all' | 'pending' | 'overdue') => {
    if (filter === 'pending') return tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
    if (filter === 'overdue') return tasks.filter(t => t.status === 'overdue');
    return tasks;
  };

  const TaskItem = ({ task }: { task: Task }) => (
    <div className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {getStatusIcon(task.status)}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm truncate">{task.title}</h4>
              <Badge variant="secondary" className="text-[10px] shrink-0">{task.type}</Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{task.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Due: {task.dueDate}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {getPriorityBadge(task.priority)}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="relative gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden lg:inline text-sm">Tasks</span>
              {(pendingCount > 0 || overdueCount > 0) && (
                <Badge 
                  variant="destructive" 
                  className={`absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center text-[10px] p-0 ${
                    overdueCount > 0 ? 'animate-pulse' : ''
                  }`}
                >
                  {pendingCount + overdueCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {roleLabels[role]} ({pendingCount} pending{overdueCount > 0 ? `, ${overdueCount} overdue` : ''})
        </TooltipContent>
      </Tooltip>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            {roleLabels[role]}
          </SheetTitle>
          <SheetDescription>
            {pendingCount} pending • {overdueCount} overdue
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All ({tasks.length})</TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">Pending ({pendingCount})</TabsTrigger>
            <TabsTrigger value="overdue" className="flex-1">
              Overdue ({overdueCount})
              {overdueCount > 0 && <span className="ml-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />}
            </TabsTrigger>
          </TabsList>

          {['all', 'pending', 'overdue'].map((filter) => (
            <TabsContent key={filter} value={filter} className="mt-4">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-2 pr-4">
                  {filterTasks(filter as 'all' | 'pending' | 'overdue').length > 0 ? (
                    filterTasks(filter as 'all' | 'pending' | 'overdue').map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tasks in this category</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
