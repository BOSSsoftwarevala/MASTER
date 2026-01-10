import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  UserPlus, 
  Shield, 
  Ban, 
  Eye, 
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  email_masked: string;
  mobile: string | null;
  mobile_masked: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  company_name: string | null;
  account_status: string;
  kyc_status: string;
  created_at: string;
}

interface UserRole {
  role: string;
}

interface UserWithRoles extends UserProfile {
  roles: string[];
}

export default function UsersPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles for all users
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles = (profiles || []).map((profile) => ({
        ...profile,
        roles: (roles || [])
          .filter((r) => r.user_id === profile.id)
          .map((r) => r.role)
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/20 text-success border-success/30"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'suspended':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30"><XCircle className="h-3 w-3 mr-1" />Suspended</Badge>;
      case 'pending_verification':
        return <Badge className="bg-warning/20 text-warning border-warning/30"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getKycBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">Verified</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatRoleName = (role: string) => {
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === 'super_admin') return 'bg-destructive text-destructive-foreground';
    if (role === 'admin') return 'bg-primary text-primary-foreground';
    if (role.includes('manager')) return 'bg-secondary text-secondary-foreground';
    if (role.includes('franchise')) return 'bg-accent text-accent-foreground';
    if (role.includes('reseller')) return 'bg-info text-info-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.email_masked?.toLowerCase().includes(searchLower) ||
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.company_name?.toLowerCase().includes(searchLower)
    );
  });

  const getInitials = (user: UserProfile) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  const getDisplayEmail = (user: UserProfile) => {
    // Super Admin can see full email
    if (isSuperAdmin()) return user.email;
    return user.email_masked;
  };

  const getDisplayMobile = (user: UserProfile) => {
    if (!user.mobile) return '—';
    // Super Admin can see full mobile
    if (isSuperAdmin()) return user.mobile;
    return user.mobile_masked;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Users</h1>
            <p className="text-muted-foreground mt-1">Manage users, roles, and permissions</p>
          </div>
          <Button className="gradient-primary">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or company..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">All Status</Button>
                <Button variant="outline">All Roles</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              {isSuperAdmin() && <span className="text-destructive ml-2">(Super Admin View - Full Data Visible)</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>KYC</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback className="gradient-primary text-primary-foreground">
                              {getInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}`
                                : 'No Name'}
                            </p>
                            {user.company_name && (
                              <p className="text-sm text-muted-foreground">{user.company_name}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {getDisplayEmail(user)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {getDisplayMobile(user)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {user.roles.length > 0 ? (
                            user.roles.slice(0, 2).map((role) => (
                              <Badge key={role} className={`text-xs ${getRoleBadgeColor(role)}`}>
                                {formatRoleName(role)}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="secondary" className="text-xs">No Roles</Badge>
                          )}
                          {user.roles.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{user.roles.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.account_status)}</TableCell>
                      <TableCell>{getKycBadge(user.kyc_status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="h-4 w-4 mr-2" />
                              Manage Roles
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-warning">
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                            {isSuperAdmin() && (
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {!loading && filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No users found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}