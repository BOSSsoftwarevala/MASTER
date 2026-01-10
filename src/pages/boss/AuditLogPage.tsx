import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuditLogs } from '@/hooks/useBossData';
import { 
  ScrollText, 
  Search,
  Eye,
  User,
  Calendar,
  Lock
} from 'lucide-react';

const modules = [
  'All Modules',
  'System Control',
  'Access Override',
  'Approval Center',
  'Auth',
  'Security',
  'Finance',
  'Server',
  'Development',
];

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('All Modules');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  
  const { data: auditLogs = [], isLoading } = useAuditLogs(100);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.user_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = selectedModule === 'All Modules' || log.module === selectedModule;
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    return matchesSearch && matchesModule && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Audit & Log Viewer</h1>
          <p className="text-gray-400 mt-1">Immutable timeline of all system actions</p>
          <Badge variant="outline" className="mt-2 border-gray-600 text-gray-400">
            <Eye className="h-3 w-3 mr-1" />
            View Only — Logs are immutable and cannot be modified
          </Badge>
        </div>

        {/* Immutability Notice */}
        <Card className="bg-emerald-900/20 border-emerald-700/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-emerald-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">Immutable Audit Trail</h3>
                <p className="text-sm text-gray-400 mt-1">
                  All logs are cryptographically secured and cannot be deleted, modified, or tampered with.
                  This ensures complete accountability and compliance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white"
                />
              </div>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger className="w-full md:w-[180px] bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white">
                  <SelectValue placeholder="Filter by module" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  {modules.map((module) => (
                    <SelectItem key={module} value={module} className="text-gray-200 focus:bg-gray-700">{module}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-full md:w-[150px] bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                  <SelectItem value="all" className="text-gray-200 focus:bg-gray-700">All Severity</SelectItem>
                  <SelectItem value="info" className="text-gray-200 focus:bg-gray-700">Info</SelectItem>
                  <SelectItem value="warning" className="text-gray-200 focus:bg-gray-700">Warning</SelectItem>
                  <SelectItem value="critical" className="text-gray-200 focus:bg-gray-700">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Timeline */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ScrollText className="h-5 w-5 text-gray-400" />
              Action Timeline
            </CardTitle>
            <CardDescription className="text-gray-400">
              {filteredLogs.length} entries found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="relative pl-10">
                    <Skeleton className="absolute left-2.5 top-1 h-3 w-3 rounded-full bg-gray-700" />
                    <div className="p-4 rounded-lg border border-[hsl(var(--boss-card-border))]">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-48 bg-gray-700" />
                          <Skeleton className="h-3 w-64 bg-gray-700" />
                        </div>
                        <Skeleton className="h-5 w-20 bg-gray-700" />
                      </div>
                      <div className="flex gap-6 mt-4">
                        <Skeleton className="h-3 w-32 bg-gray-700" />
                        <Skeleton className="h-3 w-40 bg-gray-700" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <ScrollText className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <p className="text-lg font-medium text-white">No logs found</p>
                <p className="text-gray-400">Try adjusting your search filters.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-[hsl(var(--boss-card-border))]" />

                <div className="space-y-6">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="relative pl-10">
                      {/* Timeline dot */}
                      <div className={`absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-[hsl(var(--boss-card-bg))] ${getSeverityColor(log.severity)}`} />

                      <div className="p-4 rounded-lg border border-[hsl(var(--boss-card-border))] bg-[hsl(var(--boss-panel-bg))]">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{log.action}</span>
                              <Badge 
                                variant="outline"
                                className={
                                  log.severity === 'critical' ? 'border-red-500/50 bg-red-900/30 text-red-300' :
                                  log.severity === 'warning' ? 'border-amber-500/50 bg-amber-900/30 text-amber-300' : 
                                  'border-gray-600 text-gray-400'
                                }
                              >
                                {log.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{log.details}</p>
                          </div>
                          <Badge variant="outline" className="border-gray-600 text-gray-400">{log.module}</Badge>
                        </div>

                        <div className="flex items-center gap-6 mt-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {log.user_email}
                          </div>
                          {log.ip_address && <span>IP: {log.ip_address}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}