import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Shield, Plus, Edit, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { 
  useSecurityRules, 
  useCreateSecurityRule, 
  useUpdateSecurityRule, 
  useDeleteSecurityRule,
  useServers,
  useIPBlocklist,
  useCreateIPBlock,
  useRemoveIPBlock,
  useServerRealtime,
  type SecurityRule 
} from '@/hooks/useServerData';
import { toast } from 'sonner';

export default function SecurityRulesPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  
  useServerRealtime();
  
  const { data: rules, isLoading: rulesLoading } = useSecurityRules();
  const { data: servers } = useServers();
  const { data: blocklist, isLoading: blocklistLoading } = useIPBlocklist();
  const createRule = useCreateSecurityRule();
  const updateRule = useUpdateSecurityRule();
  const deleteRule = useDeleteSecurityRule();
  const createBlock = useCreateIPBlock();
  const removeBlock = useRemoveIPBlock();
  
  const [ruleDialog, setRuleDialog] = useState<{open: boolean; rule: SecurityRule | null}>({ open: false, rule: null });
  const [blockDialog, setBlockDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean; id: string | null}>({ open: false, id: null });
  
  const [ruleForm, setRuleForm] = useState({
    rule_name: '',
    rule_type: 'firewall',
    server_id: '',
    source_ip: '',
    destination_port: '',
    protocol: 'tcp',
    action: 'allow',
    priority: '100',
    description: '',
  });
  
  const [blockForm, setBlockForm] = useState({
    ip_address: '',
    reason: '',
    severity: 'medium',
    is_permanent: false,
  });
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const openAddRule = () => {
    setRuleForm({
      rule_name: '',
      rule_type: 'firewall',
      server_id: '',
      source_ip: '',
      destination_port: '',
      protocol: 'tcp',
      action: 'allow',
      priority: '100',
      description: '',
    });
    setRuleDialog({ open: true, rule: null });
  };

  const openEditRule = (rule: SecurityRule) => {
    setRuleForm({
      rule_name: rule.rule_name,
      rule_type: rule.rule_type,
      server_id: rule.server_id || '',
      source_ip: rule.source_ip || '',
      destination_port: rule.destination_port?.toString() || '',
      protocol: rule.protocol || 'tcp',
      action: rule.action,
      priority: rule.priority?.toString() || '100',
      description: rule.description || '',
    });
    setRuleDialog({ open: true, rule });
  };

  const handleSaveRule = async () => {
    if (!ruleForm.rule_name || !ruleForm.action) {
      toast.error('Rule name and action are required');
      return;
    }
    
    const data = {
      rule_name: ruleForm.rule_name,
      rule_type: ruleForm.rule_type,
      server_id: ruleForm.server_id || null,
      source_ip: ruleForm.source_ip || null,
      destination_port: ruleForm.destination_port ? parseInt(ruleForm.destination_port) : null,
      protocol: ruleForm.protocol,
      action: ruleForm.action,
      priority: parseInt(ruleForm.priority) || 100,
      description: ruleForm.description || null,
    };
    
    if (ruleDialog.rule) {
      await updateRule.mutateAsync({ id: ruleDialog.rule.id, ...data });
    } else {
      await createRule.mutateAsync(data);
    }
    
    setRuleDialog({ open: false, rule: null });
  };

  const handleDeleteRule = async () => {
    if (deleteDialog.id) {
      await deleteRule.mutateAsync(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
    }
  };

  const handleBlockIP = async () => {
    if (!blockForm.ip_address || !blockForm.reason) {
      toast.error('IP address and reason are required');
      return;
    }
    
    await createBlock.mutateAsync({
      ip_address: blockForm.ip_address,
      reason: blockForm.reason,
      severity: blockForm.severity,
      is_permanent: blockForm.is_permanent,
    });
    
    setBlockDialog(false);
    setBlockForm({ ip_address: '', reason: '', severity: 'medium', is_permanent: false });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Security Rules Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage firewall rules, access control, and IP blocking
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setBlockDialog(true)}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Block IP
            </Button>
            <Button onClick={openAddRule}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </div>

        {/* Security Rules Table */}
        <Card>
          <CardHeader>
            <CardTitle>Firewall Rules</CardTitle>
            <CardDescription>Active security rules for all servers</CardDescription>
          </CardHeader>
          <CardContent>
            {rulesLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : rules && rules.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Server</TableHead>
                    <TableHead>Source IP</TableHead>
                    <TableHead>Port</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-mono">{rule.priority}</TableCell>
                      <TableCell className="font-medium">{rule.rule_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.rule_type}</Badge>
                      </TableCell>
                      <TableCell>{rule.servers?.name || 'All'}</TableCell>
                      <TableCell className="font-mono">{rule.source_ip || '*'}</TableCell>
                      <TableCell>{rule.destination_port || '*'}/{rule.protocol}</TableCell>
                      <TableCell>
                        <Badge variant={rule.action === 'allow' ? 'default' : 'destructive'}>
                          {rule.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {rule.is_enabled ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openEditRule(rule)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive"
                          onClick={() => setDeleteDialog({ open: true, id: rule.id })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No security rules configured</p>
                <Button className="mt-4" onClick={openAddRule}>Add First Rule</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* IP Blocklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              IP Blocklist
            </CardTitle>
            <CardDescription>Blocked IP addresses</CardDescription>
          </CardHeader>
          <CardContent>
            {blocklistLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : blocklist && blocklist.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Blocked At</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blocklist.map((block) => (
                    <TableRow key={block.id}>
                      <TableCell className="font-mono">{block.ip_address}</TableCell>
                      <TableCell>{block.reason}</TableCell>
                      <TableCell>
                        <Badge variant={block.severity === 'high' ? 'destructive' : 'secondary'}>
                          {block.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(block.blocked_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {block.is_permanent ? 'Permanent' : block.expires_at ? new Date(block.expires_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeBlock.mutate(block.id)}
                        >
                          Unblock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Check className="h-12 w-12 mx-auto text-green-500 mb-2" />
                <p className="text-muted-foreground">No blocked IPs</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Rule Dialog */}
        <Dialog open={ruleDialog.open} onOpenChange={(open) => setRuleDialog({ open, rule: null })}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{ruleDialog.rule ? 'Edit Rule' : 'Add Security Rule'}</DialogTitle>
              <DialogDescription>Configure firewall or access control rule</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rule Name *</Label>
                  <Input
                    value={ruleForm.rule_name}
                    onChange={(e) => setRuleForm({ ...ruleForm, rule_name: e.target.value })}
                    placeholder="e.g., Block SSH"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rule Type</Label>
                  <Select value={ruleForm.rule_type} onValueChange={(v) => setRuleForm({ ...ruleForm, rule_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="firewall">Firewall</SelectItem>
                      <SelectItem value="access_control">Access Control</SelectItem>
                      <SelectItem value="rate_limit">Rate Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Server (Optional)</Label>
                  <Select value={ruleForm.server_id} onValueChange={(v) => setRuleForm({ ...ruleForm, server_id: v })}>
                    <SelectTrigger><SelectValue placeholder="All servers" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Servers</SelectItem>
                      {servers?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Input
                    type="number"
                    value={ruleForm.priority}
                    onChange={(e) => setRuleForm({ ...ruleForm, priority: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Source IP</Label>
                  <Input
                    value={ruleForm.source_ip}
                    onChange={(e) => setRuleForm({ ...ruleForm, source_ip: e.target.value })}
                    placeholder="0.0.0.0/0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Port</Label>
                  <Input
                    type="number"
                    value={ruleForm.destination_port}
                    onChange={(e) => setRuleForm({ ...ruleForm, destination_port: e.target.value })}
                    placeholder="22"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Protocol</Label>
                  <Select value={ruleForm.protocol} onValueChange={(v) => setRuleForm({ ...ruleForm, protocol: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tcp">TCP</SelectItem>
                      <SelectItem value="udp">UDP</SelectItem>
                      <SelectItem value="icmp">ICMP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Action *</Label>
                <Select value={ruleForm.action} onValueChange={(v) => setRuleForm({ ...ruleForm, action: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="deny">Deny</SelectItem>
                    <SelectItem value="drop">Drop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={ruleForm.description}
                  onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRuleDialog({ open: false, rule: null })}>Cancel</Button>
              <Button onClick={handleSaveRule}>
                {ruleDialog.rule ? 'Save Changes' : 'Add Rule'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Block IP Dialog */}
        <Dialog open={blockDialog} onOpenChange={setBlockDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Block IP Address</DialogTitle>
              <DialogDescription>Add an IP to the blocklist</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>IP Address *</Label>
                <Input
                  value={blockForm.ip_address}
                  onChange={(e) => setBlockForm({ ...blockForm, ip_address: e.target.value })}
                  placeholder="e.g., 192.168.1.100"
                />
              </div>
              <div className="space-y-2">
                <Label>Reason *</Label>
                <Input
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                  placeholder="e.g., Brute force attack"
                />
              </div>
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select value={blockForm.severity} onValueChange={(v) => setBlockForm({ ...blockForm, severity: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={blockForm.is_permanent}
                  onCheckedChange={(checked) => setBlockForm({ ...blockForm, is_permanent: checked })}
                />
                <Label>Permanent block</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBlockDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleBlockIP}>Block IP</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Security Rule</DialogTitle>
              <DialogDescription>Are you sure you want to delete this rule? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteRule}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}