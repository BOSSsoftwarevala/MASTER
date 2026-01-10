import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Target, Search, Phone, Mail, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

// Mock data
const leads = [
  { id: 1, name: 'Alex Thompson', company: 'TechStart Inc', status: 'hot', value: 8500, nextFollowup: 'Today 3:00 PM', assignedDate: 'Jan 2' },
  { id: 2, name: 'Maria Garcia', company: 'Digital Wave', status: 'warm', value: 5200, nextFollowup: 'Tomorrow 10:00 AM', assignedDate: 'Jan 1' },
  { id: 3, name: 'James Wilson', company: 'Cloud Nine LLC', status: 'warm', value: 12000, nextFollowup: 'Wed 2:00 PM', assignedDate: 'Dec 30' },
  { id: 4, name: 'Lisa Chen', company: 'Smart Solutions', status: 'cold', value: 3500, nextFollowup: 'Fri 11:00 AM', assignedDate: 'Dec 28' },
  { id: 5, name: 'Robert Kim', company: 'Future Tech', status: 'hot', value: 9800, nextFollowup: 'Today 5:00 PM', assignedDate: 'Jan 3' },
];

export default function ResellerLeadsPage() {
  const [search, setSearch] = useState('');

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(search.toLowerCase()) ||
    lead.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RoleLayout role="reseller">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assigned Leads</h1>
            <p className="text-muted-foreground">Your leads to convert</p>
          </div>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Target className="h-3 w-3 mr-1" />
            {leads.length} Assigned
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search leads..." 
              className="pl-9" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline">Filter by Status</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Next Follow-up</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        lead.status === 'hot' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        lead.status === 'warm' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${lead.value.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {lead.nextFollowup}
                      </div>
                    </TableCell>
                    <TableCell>{lead.assignedDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="ghost">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Calendar className="h-4 w-4" />
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
