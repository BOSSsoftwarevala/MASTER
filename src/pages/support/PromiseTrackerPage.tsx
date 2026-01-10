import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useSupportData } from '@/hooks/useSupportData';
import { Plus, CheckCircle, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, isPast, isToday } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const statusColors: Record<string, string> = {
  pending: 'bg-blue-500/10 text-blue-500',
  in_progress: 'bg-amber-500/10 text-amber-500',
  completed: 'bg-green-500/10 text-green-500',
  breached: 'bg-destructive/10 text-destructive',
};

export default function PromiseTrackerPage() {
  const { promises, loading, createPromise, completePromise, deletePromise } = useSupportData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    promise_description: '',
    client_name: '',
    due_date: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
  });

  const resetForm = () => {
    setFormData({ promise_description: '', client_name: '', due_date: '', priority: 'medium' });
  };

  const handleCreate = async () => {
    await createPromise({ ...formData, status: 'pending' });
    resetForm();
    setShowAddDialog(false);
  };

  const pendingPromises = promises.filter(p => p.status === 'pending');
  const completedPromises = promises.filter(p => p.status === 'completed');
  const overduePromises = pendingPromises.filter(p => isPast(new Date(p.due_date)));
  const dueTodayPromises = pendingPromises.filter(p => isToday(new Date(p.due_date)));

  const renderPromiseTable = (items: typeof promises) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((promise) => {
          const isOverdue = isPast(new Date(promise.due_date)) && promise.status === 'pending';
          return (
            <TableRow key={promise.id} className={isOverdue ? 'bg-destructive/5' : ''}>
              <TableCell className="font-medium max-w-xs truncate">{promise.promise_description}</TableCell>
              <TableCell>{promise.client_name || 'Unknown'}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {isOverdue && <AlertTriangle className="h-4 w-4 text-destructive" />}
                  {format(new Date(promise.due_date), 'MMM d, yyyy')}
                </div>
              </TableCell>
              <TableCell><Badge variant="outline">{promise.priority}</Badge></TableCell>
              <TableCell><Badge className={statusColors[promise.status || 'pending']}>{promise.status}</Badge></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {promise.status === 'pending' && (
                    <Button size="sm" variant="outline" onClick={() => completePromise(promise.id)} title="Mark Complete">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Promise?</AlertDialogTitle>
                        <AlertDialogDescription>This will remove the promise from tracking.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deletePromise(promise.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Promise Tracker</h1>
            <p className="text-muted-foreground mt-1">Track client commitments and deadlines</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />Add Promise</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Promise</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={formData.promise_description} onChange={(e) => setFormData({ ...formData, promise_description: e.target.value })} placeholder="What was promised..." />
                </div>
                <div className="space-y-2">
                  <Label>Client Name *</Label>
                  <Input value={formData.client_name} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} placeholder="Client name" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Due Date *</Label>
                    <Input type="datetime-local" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                  <Button onClick={handleCreate}>Create Promise</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><Clock className="h-8 w-8 text-blue-500" /><div><p className="text-2xl font-bold">{pendingPromises.length}</p><p className="text-sm text-muted-foreground">Pending</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><AlertTriangle className="h-8 w-8 text-amber-500" /><div><p className="text-2xl font-bold">{dueTodayPromises.length}</p><p className="text-sm text-muted-foreground">Due Today</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><AlertTriangle className="h-8 w-8 text-destructive" /><div><p className="text-2xl font-bold">{overduePromises.length}</p><p className="text-sm text-muted-foreground">Overdue</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><CheckCircle className="h-8 w-8 text-green-500" /><div><p className="text-2xl font-bold">{completedPromises.length}</p><p className="text-sm text-muted-foreground">Completed</p></div></div></CardContent></Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
            ) : (
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All ({promises.length})</TabsTrigger>
                  <TabsTrigger value="overdue" className="text-destructive">Overdue ({overduePromises.length})</TabsTrigger>
                  <TabsTrigger value="completed">Completed ({completedPromises.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">{promises.length === 0 ? <div className="text-center py-12"><CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No promises tracked</p></div> : renderPromiseTable(promises)}</TabsContent>
                <TabsContent value="overdue" className="mt-4">{overduePromises.length === 0 ? <div className="text-center py-12"><CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" /><p className="text-muted-foreground">No overdue promises!</p></div> : renderPromiseTable(overduePromises)}</TabsContent>
                <TabsContent value="completed" className="mt-4">{completedPromises.length === 0 ? <div className="text-center py-12"><Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No completed promises yet</p></div> : renderPromiseTable(completedPromises)}</TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
