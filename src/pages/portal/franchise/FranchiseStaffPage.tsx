import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Search,
  Eye,
  Mail,
  Phone,
  Shield,
  UserPlus
} from 'lucide-react';

const staffMembers = [
  { 
    id: 1, 
    name: 'John Martinez', 
    email: 'j.martinez@franchise.com',
    role: 'Sales Manager',
    accessLevel: 'read_write',
    isActive: true,
    lastActive: '2 hours ago'
  },
  { 
    id: 2, 
    name: 'Sarah Chen', 
    email: 's.chen@franchise.com',
    role: 'Lead Coordinator',
    accessLevel: 'read_only',
    isActive: true,
    lastActive: '15 mins ago'
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    email: 'm.johnson@franchise.com',
    role: 'Support Agent',
    accessLevel: 'read_only',
    isActive: true,
    lastActive: '1 hour ago'
  },
  { 
    id: 4, 
    name: 'Emily Brown', 
    email: 'e.brown@franchise.com',
    role: 'Marketing',
    accessLevel: 'read_only',
    isActive: false,
    lastActive: '3 days ago'
  },
];

export default function FranchiseStaffPage() {
  return (
    <RoleLayout role="franchise">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Access</h1>
            <p className="text-muted-foreground">Manage your team members and their access levels</p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Read-Only</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Now</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search staff members..." className="pl-9" />
          </div>
        </div>

        {/* Staff List */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {staffMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/20">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.name}</p>
                        {member.isActive ? (
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge variant="outline" className={
                        member.accessLevel === 'read_write' 
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                      }>
                        {member.accessLevel === 'read_write' ? 'Read & Write' : 'Read Only'}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last active: {member.lastActive}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Note */}
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-sm text-blue-400">
            <strong>Note:</strong> Staff members have read-only access to franchise data. 
            Only the franchise owner can modify critical settings and financial data.
          </p>
        </div>
      </div>
    </RoleLayout>
  );
}
