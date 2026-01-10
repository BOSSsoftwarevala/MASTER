import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDevelopers, useDevelopmentRealtime } from '@/hooks/useDevelopmentManagerData';
import { Plus, Search, Users, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function DevelopersPage() {
  const navigate = useNavigate();
  const { data: developers, isLoading } = useDevelopers();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  useDevelopmentRealtime();

  const filteredDevelopers = developers?.filter((dev) => {
    const matchesSearch = dev.name.toLowerCase().includes(search.toLowerCase()) ||
                          dev.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dev.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      junior: 'bg-blue-500/20 text-blue-600',
      mid: 'bg-purple-500/20 text-purple-600',
      senior: 'bg-amber-500/20 text-amber-600',
      lead: 'bg-emerald-500/20 text-emerald-600',
      principal: 'bg-red-500/20 text-red-600',
    };
    return <Badge className={colors[level] || ''}>{level}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Developers</h1>
            <p className="text-muted-foreground">Manage your development team</p>
          </div>
          <Button onClick={() => navigate('/dashboard/devmanager/developers/add')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Developer
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Developer List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search developers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'active', 'inactive', 'suspended'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading developers...</div>
            ) : filteredDevelopers?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No developers found</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevelopers?.map((dev) => (
                      <TableRow key={dev.id}>
                        <TableCell className="font-medium">{dev.name}</TableCell>
                        <TableCell>{dev.email}</TableCell>
                        <TableCell>{getLevelBadge(dev.level)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap max-w-[200px]">
                            {dev.skill_set?.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {(dev.skill_set?.length || 0) > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{(dev.skill_set?.length || 0) - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(dev.status)}</TableCell>
                        <TableCell>
                          {dev.joined_at ? format(new Date(dev.joined_at), 'MMM d, yyyy') : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/dashboard/devmanager/developers/edit/${dev.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/dashboard/devmanager/developers/delete/${dev.id}`)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
