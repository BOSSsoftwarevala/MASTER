import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, MapPin, Target, DollarSign, Eye, Ban } from 'lucide-react';

const resellers = [
  { id: 1, name: 'Rajesh Kumar', territory: 'Mumbai Central', status: 'active', leads: 45, revenue: 125000, share: '15%' },
  { id: 2, name: 'Priya Sharma', territory: 'Andheri West', status: 'active', leads: 38, revenue: 98000, share: '15%' },
  { id: 3, name: 'Amit Patel', territory: 'Bandra East', status: 'suspended', leads: 12, revenue: 35000, share: '12%' },
  { id: 4, name: 'Sneha Reddy', territory: 'Powai', status: 'active', leads: 52, revenue: 145000, share: '18%' },
  { id: 5, name: 'Vikram Singh', territory: 'Thane', status: 'active', leads: 29, revenue: 78000, share: '15%' },
];

export default function FranchiseResellersPage() {
  return (
    <RoleLayout role="franchise">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Local Resellers
            </h1>
            <p className="text-muted-foreground mt-1">Manage resellers in your territory</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-emerald-500 border-emerald-500">
              <Users className="h-3 w-3 mr-1" />
              {resellers.filter(r => r.status === 'active').length} Active
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Resellers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">{resellers.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Leads Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {resellers.reduce((acc, r) => acc + r.leads, 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Combined Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet-500">
                ₹{resellers.reduce((acc, r) => acc + r.revenue, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Avg Revenue Share</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">15%</div>
            </CardContent>
          </Card>
        </div>

        {/* Resellers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Reseller List</CardTitle>
            <CardDescription>View and manage your local resellers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reseller Name</TableHead>
                  <TableHead>Territory</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Leads Assigned</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-center">Share</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resellers.map((reseller) => (
                  <TableRow key={reseller.id}>
                    <TableCell className="font-medium">{reseller.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {reseller.territory}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={reseller.status === 'active' ? 'default' : 'destructive'}>
                        {reseller.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Target className="h-3 w-3 text-blue-500" />
                        {reseller.leads}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <DollarSign className="h-3 w-3 text-emerald-500" />
                        ₹{reseller.revenue.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{reseller.share}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
}
