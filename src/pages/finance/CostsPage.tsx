import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCostLogs, useCostLimits, useCreateCostLog, useUpdateCostLimit, useCreateCostLimit, CostLog, CostLimit } from '@/hooks/useFinanceData';
import { useUserRoles } from '@/hooks/useUserRoles';
import { format, subDays } from 'date-fns';
import {
  PieChart,
  Plus,
  Edit,
  Bot,
  Code,
  Server,
  Database,
  Wifi,
  MoreHorizontal,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

export default function CostsPage() {
  const { isAdmin } = useUserRoles();
  const { data: costLogs, isLoading: logsLoading } = useCostLogs();
  const { data: costLimits, isLoading: limitsLoading } = useCostLimits();
  const createCostLog = useCreateCostLog();
  const updateCostLimit = useUpdateCostLimit();
  const createCostLimit = useCreateCostLimit();

  const [addCostDialogOpen, setAddCostDialogOpen] = useState(false);
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CostLimit | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState<string | null>(null);
  const [newCost, setNewCost] = useState({
    category: '' as 'ai' | 'api' | 'server' | 'storage' | 'bandwidth' | 'other',
    description: '',
    amount: 0,
  });
  const [limitData, setLimitData] = useState({
    daily_limit: 0,
    monthly_limit: 0,
    alert_threshold_percent: 80,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai': return <Bot className="h-5 w-5" />;
      case 'api': return <Code className="h-5 w-5" />;
      case 'server': return <Server className="h-5 w-5" />;
      case 'storage': return <Database className="h-5 w-5" />;
      case 'bandwidth': return <Wifi className="h-5 w-5" />;
      default: return <MoreHorizontal className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai': return 'bg-purple-500';
      case 'api': return 'bg-blue-500';
      case 'server': return 'bg-green-500';
      case 'storage': return 'bg-orange-500';
      case 'bandwidth': return 'bg-cyan-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAddCost = async () => {
    await createCostLog.mutateAsync({
      ...newCost,
      currency: 'INR',
      usage_date: new Date().toISOString().split('T')[0],
      metadata: {},
    });
    setAddCostDialogOpen(false);
    setNewCost({ category: '' as any, description: '', amount: 0 });
  };

  const handleSaveLimit = async () => {
    if (selectedCategory) {
      await updateCostLimit.mutateAsync({
        id: selectedCategory.id,
        ...limitData,
      });
    } else if (editingCategoryName) {
      // Create new limit for category
      await createCostLimit.mutateAsync({
        category: editingCategoryName as 'ai' | 'api' | 'server' | 'storage' | 'bandwidth' | 'other',
        ...limitData,
        is_active: true,
      });
    }
    setLimitDialogOpen(false);
    setEditingCategoryName(null);
  };

  if (!isAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Card className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access Cost Management.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate costs by category
  const costsByCategory = {
    ai: costLogs?.filter(c => c.category === 'ai').reduce((sum, c) => sum + c.amount, 0) || 0,
    api: costLogs?.filter(c => c.category === 'api').reduce((sum, c) => sum + c.amount, 0) || 0,
    server: costLogs?.filter(c => c.category === 'server').reduce((sum, c) => sum + c.amount, 0) || 0,
    storage: costLogs?.filter(c => c.category === 'storage').reduce((sum, c) => sum + c.amount, 0) || 0,
    bandwidth: costLogs?.filter(c => c.category === 'bandwidth').reduce((sum, c) => sum + c.amount, 0) || 0,
    other: costLogs?.filter(c => c.category === 'other').reduce((sum, c) => sum + c.amount, 0) || 0,
  };

  const totalCost = Object.values(costsByCategory).reduce((sum, c) => sum + c, 0);

  // Get limits for each category
  const getLimitForCategory = (category: string) => {
    return costLimits?.find(l => l.category === category);
  };

  const categories = ['ai', 'api', 'server', 'storage', 'bandwidth', 'other'] as const;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Cost & Burn</h1>
            <p className="text-muted-foreground mt-1">Monitor and control AI, API, and infrastructure costs</p>
          </div>
          <Button onClick={() => setAddCostDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Cost Log
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Bot className="h-4 w-4" />
                AI Costs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(costsByCategory.ai)}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Code className="h-4 w-4" />
                API Costs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(costsByCategory.api)}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Server className="h-4 w-4" />
                Server Costs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(costsByCategory.server)}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total Burn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalCost)}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="logs">Cost Logs</TabsTrigger>
            <TabsTrigger value="limits">Limits & Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const limit = getLimitForCategory(category);
                const cost = costsByCategory[category];
                const monthlyLimit = limit?.monthly_limit || 0;
                const percentage = monthlyLimit > 0 ? (cost / monthlyLimit) * 100 : 0;
                const isOverThreshold = limit && percentage >= (limit.alert_threshold_percent || 80);

                return (
                  <Card key={category} className={isOverThreshold ? 'border-red-500' : ''}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2 capitalize">
                          <div className={`p-2 rounded-lg ${getCategoryColor(category)}`}>
                            {getCategoryIcon(category)}
                          </div>
                          {category} Cost
                        </span>
                        {isOverThreshold && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Alert
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-2xl font-bold">{formatCurrency(cost)}</span>
                          {monthlyLimit > 0 && (
                            <span className="text-sm text-muted-foreground">
                              of {formatCurrency(monthlyLimit)}
                            </span>
                          )}
                        </div>
                        {monthlyLimit > 0 && (
                          <Progress 
                            value={Math.min(percentage, 100)} 
                            className={isOverThreshold ? '[&>div]:bg-red-500' : ''}
                          />
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setSelectedCategory(limit || null);
                          setEditingCategoryName(limit ? null : category);
                          setLimitData({
                            daily_limit: limit?.daily_limit || 0,
                            monthly_limit: limit?.monthly_limit || 0,
                            alert_threshold_percent: limit?.alert_threshold_percent || 80,
                          });
                          setLimitDialogOpen(true);
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Set Limit
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Recent Cost Logs</CardTitle>
                <CardDescription>All recorded cost entries</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logsLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          {Array(4).fill(0).map((_, j) => (
                            <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : costLogs && costLogs.length > 0 ? (
                      costLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{format(new Date(log.usage_date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {getCategoryIcon(log.category)}
                              <span className="ml-1">{log.category}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{log.description || '-'}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(log.amount)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No cost logs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits">
            <Card>
              <CardHeader>
                <CardTitle>Cost Limits & Alerts</CardTitle>
                <CardDescription>Configure spending limits and alert thresholds</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Daily Limit</TableHead>
                      <TableHead>Monthly Limit</TableHead>
                      <TableHead>Alert Threshold</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {limitsLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          {Array(6).fill(0).map((_, j) => (
                            <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : categories.map((category) => {
                      const limit = getLimitForCategory(category);
                      return (
                        <TableRow key={category}>
                          <TableCell>
                            <div className="flex items-center gap-2 capitalize">
                              {getCategoryIcon(category)}
                              {category}
                            </div>
                          </TableCell>
                          <TableCell>{limit?.daily_limit ? formatCurrency(limit.daily_limit) : '-'}</TableCell>
                          <TableCell>{limit?.monthly_limit ? formatCurrency(limit.monthly_limit) : '-'}</TableCell>
                          <TableCell>{limit?.alert_threshold_percent || 80}%</TableCell>
                          <TableCell>
                            <Badge variant={limit?.is_active ? 'default' : 'secondary'}>
                              {limit?.is_active ? 'Active' : 'Not Set'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedCategory(limit || null);
                                setEditingCategoryName(limit ? null : category);
                                setLimitData({
                                  daily_limit: limit?.daily_limit || 0,
                                  monthly_limit: limit?.monthly_limit || 0,
                                  alert_threshold_percent: limit?.alert_threshold_percent || 80,
                                });
                                setLimitDialogOpen(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Cost Dialog */}
        <Dialog open={addCostDialogOpen} onOpenChange={setAddCostDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Cost Log</DialogTitle>
              <DialogDescription>Record a new cost entry</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select value={newCost.category} onValueChange={(v: any) => setNewCost({...newCost, category: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                    <SelectItem value="bandwidth">Bandwidth</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount (INR)</Label>
                <Input
                  type="number"
                  min="0"
                  value={newCost.amount}
                  onChange={(e) => setNewCost({...newCost, amount: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  placeholder="Cost description"
                  value={newCost.description}
                  onChange={(e) => setNewCost({...newCost, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddCostDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAddCost} 
                disabled={createCostLog.isPending || !newCost.category || newCost.amount <= 0}
              >
                Add Cost
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Limit Dialog */}
        <Dialog open={limitDialogOpen} onOpenChange={setLimitDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Cost Limit</DialogTitle>
              <DialogDescription>Configure spending limits and alerts</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Daily Limit (INR)</Label>
                <Input
                  type="number"
                  min="0"
                  value={limitData.daily_limit}
                  onChange={(e) => setLimitData({...limitData, daily_limit: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label>Monthly Limit (INR)</Label>
                <Input
                  type="number"
                  min="0"
                  value={limitData.monthly_limit}
                  onChange={(e) => setLimitData({...limitData, monthly_limit: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label>Alert Threshold (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={limitData.alert_threshold_percent}
                  onChange={(e) => setLimitData({...limitData, alert_threshold_percent: parseInt(e.target.value) || 80})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLimitDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleSaveLimit} 
                disabled={updateCostLimit.isPending || createCostLimit.isPending}
              >
                Save Limit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
