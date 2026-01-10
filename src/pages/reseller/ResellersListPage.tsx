import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useResellers, useResellerRealtime } from "@/hooks/useResellerManagerData";
import { Users, UserPlus, Search, MoreVertical, Edit, Trash2, Eye, Pause, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ResellersListPage() {
  const navigate = useNavigate();
  const { resellers, loading, fetchResellers, updateReseller } = useResellers();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useResellerRealtime(() => {
    fetchResellers();
  });

  const filteredResellers = resellers.filter((reseller) => {
    const matchesSearch =
      reseller.legal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reseller.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reseller.contact_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || reseller.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    await updateReseller(id, { status: newStatus as any });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resellers</h1>
            <p className="text-muted-foreground">Manage all reseller accounts</p>
          </div>
          <Button onClick={() => navigate('/dashboard/reseller/add')}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Reseller
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Resellers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Reseller List ({filteredResellers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredResellers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "No resellers match your filters"
                  : "No resellers found. Add your first reseller to get started."}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reseller</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResellers.map((reseller) => (
                    <TableRow key={reseller.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reseller.business_name || reseller.legal_name}</p>
                          <p className="text-sm text-muted-foreground">{reseller.legal_name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{reseller.contact_email}</p>
                          {reseller.contact_phone && (
                            <p className="text-sm text-muted-foreground">{reseller.contact_phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {(reseller as any).reseller_plans?.name || 'No Plan'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            reseller.kyc_status === 'verified' ? 'default' :
                            reseller.kyc_status === 'pending' ? 'outline' : 'destructive'
                          }
                        >
                          {reseller.kyc_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            reseller.status === 'active' ? 'default' :
                            reseller.status === 'paused' ? 'secondary' :
                            reseller.status === 'pending' ? 'outline' : 'destructive'
                          }
                        >
                          {reseller.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {reseller.joined_at
                          ? new Date(reseller.joined_at).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/reseller/edit/${reseller.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusToggle(reseller.id, reseller.status)}>
                              {reseller.status === 'active' ? (
                                <>
                                  <Pause className="mr-2 h-4 w-4" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => navigate(`/dashboard/reseller/delete/${reseller.id}`)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
