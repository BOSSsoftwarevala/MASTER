import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useDevelopers, useUpdateDeveloper, useDevelopmentRealtime } from '@/hooks/useDevelopmentManagerData';
import { Search, Clock, AlertTriangle, User, Calendar } from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AccessExpiryPage() {
  const { data: developers, isLoading } = useDevelopers();
  const updateDeveloper = useUpdateDeveloper();
  const [search, setSearch] = useState('');
  const [selectedDev, setSelectedDev] = useState<string | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState('');
  useDevelopmentRealtime();

  const filteredDevelopers = developers?.filter((dev) =>
    dev.name.toLowerCase().includes(search.toLowerCase()) ||
    dev.email.toLowerCase().includes(search.toLowerCase())
  );

  const getExpiryStatus = (expiresAt: string | null) => {
    if (!expiresAt) return { status: 'no_expiry', label: 'No Expiry', style: 'bg-gray-500/20 text-gray-600' };
    
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const warningDate = addDays(now, 7);
    
    if (isBefore(expiryDate, now)) {
      return { status: 'expired', label: 'Expired', style: 'bg-red-500/20 text-red-600' };
    }
    if (isBefore(expiryDate, warningDate)) {
      return { status: 'expiring_soon', label: 'Expiring Soon', style: 'bg-amber-500/20 text-amber-600' };
    }
    return { status: 'active', label: 'Active', style: 'bg-green-500/20 text-green-600' };
  };

  const handleSetExpiry = async () => {
    if (!selectedDev || !newExpiryDate) return;
    await updateDeveloper.mutateAsync({
      id: selectedDev,
      access_expires_at: new Date(newExpiryDate).toISOString(),
    });
    setSelectedDev(null);
    setNewExpiryDate('');
  };

  const handleRemoveExpiry = async (id: string) => {
    await updateDeveloper.mutateAsync({ id, access_expires_at: null });
  };

  const expiredCount = developers?.filter(d => {
    if (!d.access_expires_at) return false;
    return isBefore(new Date(d.access_expires_at), new Date());
  }).length || 0;

  const expiringSoonCount = developers?.filter(d => {
    if (!d.access_expires_at) return false;
    const expiryDate = new Date(d.access_expires_at);
    const now = new Date();
    return isAfter(expiryDate, now) && isBefore(expiryDate, addDays(now, 7));
  }).length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Access Expiry</h1>
            <p className="text-muted-foreground">Manage developer access expiration dates</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Expired
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{expiredCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                Expiring Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{expiringSoonCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Total Developers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{developers?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search developers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading developers...</div>
            ) : filteredDevelopers?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No developers found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Developer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Access Expiry</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevelopers?.map((dev) => {
                    const expiry = getExpiryStatus(dev.access_expires_at);
                    return (
                      <TableRow key={dev.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-cyan-500" />
                            <span className="font-medium">{dev.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{dev.email}</TableCell>
                        <TableCell>
                          <Badge className={expiry.style}>{expiry.label}</Badge>
                        </TableCell>
                        <TableCell>
                          {dev.access_expires_at ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(dev.access_expires_at), 'MMM d, yyyy')}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedDev(dev.id);
                                    setNewExpiryDate(dev.access_expires_at ? dev.access_expires_at.split('T')[0] : '');
                                  }}
                                >
                                  Set Expiry
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Set Access Expiry for {dev.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                  <div>
                                    <Label>Expiry Date</Label>
                                    <Input
                                      type="date"
                                      value={newExpiryDate}
                                      onChange={(e) => setNewExpiryDate(e.target.value)}
                                    />
                                  </div>
                                  <Button
                                    onClick={handleSetExpiry}
                                    disabled={updateDeveloper.isPending}
                                    className="w-full"
                                  >
                                    Save Expiry Date
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            {dev.access_expires_at && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveExpiry(dev.id)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
