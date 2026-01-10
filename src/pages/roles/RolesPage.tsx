import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles, AppRole } from '@/hooks/useUserRoles';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Shield, UserPlus, Crown, Users, Briefcase, Star, Target, Code, TrendingUp, Building2, MapPin, Globe, Sparkles } from 'lucide-react';

interface UserWithRoles {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  roles: AppRole[];
}

const ROLE_CONFIG: Record<AppRole, { label: string; icon: typeof Shield; color: string; description: string }> = {
  super_admin: { label: 'Super Admin', icon: Crown, color: 'bg-gradient-to-r from-amber-500 to-orange-500', description: 'Full system access, can delete data' },
  admin: { label: 'Admin', icon: Shield, color: 'bg-gradient-to-r from-red-500 to-pink-500', description: 'Manage users, products, and settings' },
  vala_ai: { label: 'VALA AI', icon: Crown, color: 'bg-gradient-to-r from-blue-600 to-indigo-700', description: 'System AI - Non-editable, non-deletable' },
  lead_manager: { label: 'Lead Manager', icon: Target, color: 'bg-gradient-to-r from-violet-500 to-purple-500', description: 'Manage leads and sales pipeline' },
  project_manager: { label: 'Project Manager', icon: Briefcase, color: 'bg-gradient-to-r from-blue-500 to-cyan-500', description: 'Manage projects and deliverables' },
  code_manager: { label: 'Code Manager', icon: Code, color: 'bg-gradient-to-r from-emerald-500 to-green-500', description: 'Manage code and deployments' },
  seo_manager: { label: 'SEO Manager', icon: TrendingUp, color: 'bg-gradient-to-r from-teal-500 to-cyan-500', description: 'Manage SEO and content' },
  influencer: { label: 'Influencer', icon: Star, color: 'bg-gradient-to-r from-pink-500 to-rose-500', description: 'Referral commissions for promotions' },
  reseller_basic: { label: 'Reseller Basic', icon: Users, color: 'bg-gradient-to-r from-indigo-400 to-blue-400', description: 'Basic reseller access' },
  reseller_pro: { label: 'Reseller Pro', icon: Users, color: 'bg-gradient-to-r from-indigo-600 to-blue-600', description: 'Pro reseller with higher commissions' },
  franchise_city: { label: 'Franchise City', icon: MapPin, color: 'bg-gradient-to-r from-orange-400 to-amber-400', description: 'City-level franchise partner' },
  franchise_state: { label: 'Franchise State', icon: Building2, color: 'bg-gradient-to-r from-orange-500 to-amber-500', description: 'State-level franchise partner' },
  franchise_country: { label: 'Franchise Country', icon: Globe, color: 'bg-gradient-to-r from-orange-600 to-amber-600', description: 'Country-level franchise partner' },
  user_basic: { label: 'User Basic', icon: Users, color: 'bg-gradient-to-r from-slate-400 to-gray-400', description: 'Basic user access' },
  user_pro: { label: 'User Pro', icon: Sparkles, color: 'bg-gradient-to-r from-slate-600 to-gray-600', description: 'Pro user with premium features' },
};

const ROLE_ORDER: AppRole[] = [
  'super_admin', 'admin', 'vala_ai', 'lead_manager', 'project_manager', 'code_manager', 'seo_manager',
  'influencer', 'reseller_pro', 'reseller_basic', 'franchise_country', 'franchise_state', 'franchise_city',
  'user_pro', 'user_basic'
];

export default function RolesPage() {
  const { isSuperAdmin, loading: rolesLoading } = useUserRoles();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<AppRole[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!rolesLoading && isSuperAdmin()) {
      fetchUsersWithRoles();
    }
  }, [rolesLoading]);

  const fetchUsersWithRoles = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => ({
        ...profile,
        roles: (roles || [])
          .filter(r => r.user_id === profile.id)
          .map(r => r.role as AppRole)
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoles = (user: UserWithRoles) => {
    setSelectedUser(user);
    setSelectedRoles([...user.roles]);
    setDialogOpen(true);
  };

  const handleRoleToggle = (role: AppRole) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSaveRoles = async () => {
    if (!selectedUser) return;
    
    setSaving(true);
    try {
      // Get current roles
      const currentRoles = selectedUser.roles;
      const rolesToAdd = selectedRoles.filter(r => !currentRoles.includes(r));
      const rolesToRemove = currentRoles.filter(r => !selectedRoles.includes(r));

      // Remove roles
      for (const role of rolesToRemove) {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', selectedUser.id)
          .eq('role', role);
        
        if (error) throw error;
      }

      // Add roles
      for (const role of rolesToAdd) {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: selectedUser.id, role });
        
        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'User roles updated successfully',
      });

      setDialogOpen(false);
      fetchUsersWithRoles();
    } catch (error) {
      console.error('Error updating roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to update roles',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    return fullName.includes(searchLower) || user.email.toLowerCase().includes(searchLower);
  });

  if (rolesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isSuperAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Shield className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">Only Super Admins can manage roles.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Role Management
            </h1>
            <p className="text-muted-foreground mt-1">Assign and manage user roles</p>
          </div>
        </div>

        {/* Role Legend */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Available Roles</CardTitle>
            <CardDescription>Role hierarchy and permissions overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {ROLE_ORDER.map(role => {
                const config = ROLE_CONFIG[role];
                const Icon = config.icon;
                return (
                  <div key={role} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className={`p-2 rounded-lg ${config.color} text-white shadow-sm`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{config.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{config.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Users & Roles</CardTitle>
                <CardDescription>Click on a user to edit their roles</CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>User</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <TableRow key={user.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {user.first_name || user.last_name 
                                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                : 'No Name'}
                            </p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles.length === 0 ? (
                              <span className="text-muted-foreground text-sm">No roles assigned</span>
                            ) : (
                              user.roles.sort((a, b) => ROLE_ORDER.indexOf(a) - ROLE_ORDER.indexOf(b)).map(role => {
                                const config = ROLE_CONFIG[role];
                                return (
                                  <Badge 
                                    key={role} 
                                    className={`${config.color} text-white border-0 text-xs`}
                                  >
                                    {config.label}
                                  </Badge>
                                );
                              })
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRoles(user)}
                            className="gap-2"
                          >
                            <UserPlus className="h-4 w-4" />
                            Edit Roles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Roles Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Edit Roles for {selectedUser?.first_name || selectedUser?.email}
            </DialogTitle>
            <DialogDescription>
              Select the roles to assign to this user. Changes are saved immediately.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-4">
            {ROLE_ORDER.map(role => {
              const config = ROLE_CONFIG[role];
              const Icon = config.icon;
              const isSelected = selectedRoles.includes(role);
              
              return (
                <div
                  key={role}
                  onClick={() => handleRoleToggle(role)}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                    ${isSelected 
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                  `}
                >
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => handleRoleToggle(role)}
                    className="pointer-events-none"
                  />
                  <div className={`p-2 rounded-lg ${config.color} text-white shadow-sm`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{config.label}</p>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRoles} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
