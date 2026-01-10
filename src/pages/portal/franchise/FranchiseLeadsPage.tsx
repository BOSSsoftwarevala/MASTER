import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Target, Search, Phone, Mail, Calendar } from 'lucide-react';
import { useState } from 'react';

// Mock data
const leads = [
  { id: 1, name: 'Tech Solutions Inc', contact: 'John Smith', email: 'john@techsolutions.com', phone: '+1 555-0101', status: 'hot', value: 15000, source: 'Local Ad', lastContact: '2 hours ago' },
  { id: 2, name: 'Digital Services LLC', contact: 'Sarah Johnson', email: 'sarah@digitalservices.com', phone: '+1 555-0102', status: 'warm', value: 8500, source: 'Referral', lastContact: '5 hours ago' },
  { id: 3, name: 'Cloud Enterprise', contact: 'Mike Chen', email: 'mike@cloudenterprise.com', phone: '+1 555-0103', status: 'hot', value: 22000, source: 'Website', lastContact: 'Yesterday' },
  { id: 4, name: 'Smart Retail Co', contact: 'Lisa Wang', email: 'lisa@smartretail.com', phone: '+1 555-0104', status: 'cold', value: 5000, source: 'Local Ad', lastContact: 'Yesterday' },
  { id: 5, name: 'Innovation Hub', contact: 'David Brown', email: 'david@innovationhub.com', phone: '+1 555-0105', status: 'warm', value: 12000, source: 'Trade Show', lastContact: '2 days ago' },
];

export default function FranchiseLeadsPage() {
  const [search, setSearch] = useState('');

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(search.toLowerCase()) ||
    lead.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RoleLayout role="franchise">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Incoming Leads</h1>
            <p className="text-muted-foreground">Manage leads in your territory</p>
          </div>
          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <Target className="h-3 w-3 mr-1" />
            {leads.length} Active Leads
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
          <Button variant="outline">Filter</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{lead.contact}</p>
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                      </div>
                    </TableCell>
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
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>{lead.lastContact}</TableCell>
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
