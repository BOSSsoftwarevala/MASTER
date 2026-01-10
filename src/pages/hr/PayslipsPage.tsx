import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Search, Download, FileText, Calendar } from 'lucide-react';
import { useEmployees } from '@/hooks/useHRData';
import { toast } from 'sonner';

export default function PayslipsPage() {
  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState<string>(
    new Date().toISOString().slice(0, 7) // Current month YYYY-MM
  );
  const { data: employees, isLoading } = useEmployees('active');

  const filteredEmployees = employees?.filter(emp => {
    if (!search) return true;
    return `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(search.toLowerCase());
  });

  // Generate last 12 months for dropdown
  const getLastMonths = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        value: date.toISOString().slice(0, 7),
        label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      });
    }
    return months;
  };

  const handleDownload = (empName: string, month: string) => {
    // Simulate download - in production this would generate/fetch the actual payslip
    toast.success(`Downloading payslip for ${empName} - ${month}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payslips</h1>
          <p className="text-muted-foreground">View and download employee payslips (Read-Only)</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Employee Payslips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-[200px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {getLastMonths().map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading payslip data...</div>
            ) : filteredEmployees?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No employees found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees?.map((emp) => {
                    const gross = emp.salary || 0;
                    const deductions = Math.round(gross * 0.15); // Simulated 15% deduction
                    const net = gross - deductions;
                    
                    return (
                      <TableRow key={emp.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{emp.first_name} {emp.last_name}</p>
                            <p className="text-xs text-muted-foreground">{emp.employee_code}</p>
                          </div>
                        </TableCell>
                        <TableCell>{emp.department || '-'}</TableCell>
                        <TableCell>{emp.designation || '-'}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(gross)}</TableCell>
                        <TableCell className="text-destructive">{formatCurrency(deductions)}</TableCell>
                        <TableCell className="font-bold text-green-600">{formatCurrency(net)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(
                              `${emp.first_name} ${emp.last_name}`,
                              monthFilter
                            )}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>This is a read-only view. Payroll processing requires Finance Manager access.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
