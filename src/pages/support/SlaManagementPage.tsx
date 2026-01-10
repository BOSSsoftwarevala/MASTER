import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useSupportData } from '@/hooks/useSupportData';
import { Plus, Clock, Trash2, Edit, Save, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function SlaManagementPage() {
  const { slaRules, loading, createSlaRule, updateSlaRule, deleteSlaRule } = useSupportData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    response_time_minutes: 60,
    resolution_time_minutes: 1440,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      priority: 'medium',
      response_time_minutes: 60,
      resolution_time_minutes: 1440,
      is_active: true,
    });
  };

  const handleCreate = async () => {
    await createSlaRule(formData);
    resetForm();
    setShowAddDialog(false);
  };

  const handleUpdate = async (id: string) => {
    await updateSlaRule(id, formData);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await deleteSlaRule(id);
  };

  const startEdit = (rule: typeof slaRules[0]) => {
    setEditingId(rule.id);
    setFormData({
      name: rule.name,
      priority: rule.priority as 'low' | 'medium' | 'high' | 'critical',
      response_time_minutes: rule.response_time_minutes || 60,
      resolution_time_minutes: rule.resolution_time_minutes || 1440,
      is_active: rule.is_active ?? true,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">SLA Management</h1>
            <p className="text-muted-foreground mt-1">Configure response and resolution time rules</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add SLA Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add SLA Rule</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Rule Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Critical Priority SLA"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => 
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Response Time (min)</Label>
                    <Input
                      type="number"
                      value={formData.response_time_minutes}
                      onChange={(e) => setFormData({ ...formData, response_time_minutes: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Resolution Time (min)</Label>
                    <Input
                      type="number"
                      value={formData.resolution_time_minutes}
                      onChange={(e) => setFormData({ ...formData, resolution_time_minutes: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Enabled</Label>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                  <Button onClick={handleCreate}>Create Rule</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              SLA Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : slaRules.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No SLA rules configured</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Resolution Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slaRules.map((rule) => (
                    <TableRow key={rule.id}>
                      {editingId === rule.id ? (
                        <>
                          <TableCell>
                            <Input
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={formData.priority}
                              onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => 
                                setFormData({ ...formData, priority: value })
                              }
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={formData.response_time_minutes}
                              onChange={(e) => setFormData({ ...formData, response_time_minutes: parseInt(e.target.value) })}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={formData.resolution_time_minutes}
                              onChange={(e) => setFormData({ ...formData, resolution_time_minutes: parseInt(e.target.value) })}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={formData.is_active}
                              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" onClick={() => handleUpdate(rule.id)}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="font-medium">{rule.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{rule.priority}</Badge>
                          </TableCell>
                          <TableCell>{rule.response_time_minutes} min</TableCell>
                          <TableCell>{rule.resolution_time_minutes} min</TableCell>
                          <TableCell>
                            <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                              {rule.is_active ? 'Active' : 'Disabled'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => startEdit(rule)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="ghost" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete SLA Rule?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will remove the SLA rule. Tickets using this rule will be unaffected.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(rule.id)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </>
                      )}
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
