import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ShieldCheck, 
  Shield,
  AlertTriangle,
  Ban,
  Globe,
  Activity,
  Snowflake,
  ArrowUpCircle
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ServerSecurityPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  
  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const securityStatus = {
    firewallActive: true,
    blockedIPs: 147,
    failedAttempts: 23,
    anomalies: 2
  };

  const recentAttempts = [
    { id: 1, ip: '192.168.1.45', type: 'SSH Brute Force', server: 'PROD-WEB-01', time: '5 min ago', status: 'blocked' },
    { id: 2, ip: '10.0.0.123', type: 'Port Scan', server: 'PROD-API-01', time: '15 min ago', status: 'blocked' },
    { id: 3, ip: '172.16.0.89', type: 'SQL Injection', server: 'PROD-DB-01', time: '1 hour ago', status: 'blocked' },
    { id: 4, ip: '192.168.2.101', type: 'DDoS Attempt', server: 'PROD-WEB-01', time: '2 hours ago', status: 'mitigated' },
  ];

  const anomalies = [
    { id: 1, type: 'Unusual Traffic Pattern', server: 'PROD-API-01', description: '3x normal traffic from single IP range', severity: 'medium' },
    { id: 2, type: 'Credential Stuffing', server: 'PROD-WEB-01', description: 'Multiple failed logins from rotating IPs', severity: 'high' },
  ];

  const ipBlocks = [
    { ip: '192.168.1.0/24', reason: 'Repeated brute force', blocked: '2 days ago', expires: 'Permanent' },
    { ip: '10.0.0.0/16', reason: 'Port scanning', blocked: '1 day ago', expires: '7 days' },
    { ip: '172.16.0.89', reason: 'SQL injection', blocked: '1 hour ago', expires: '30 days' },
  ];

  const handleEscalate = (item: any) => {
    toast.success('Escalated to Boss for review');
  };

  const handleFreeze = (item: any) => {
    toast.success('Freeze request submitted');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-primary" />
              Server Security
            </h1>
            <p className="text-muted-foreground mt-1">
              Firewall status, access attempts & anomaly detection
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Firewall</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-500" />
                <span className="text-2xl font-bold text-green-600">Active</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Blocked IPs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{securityStatus.blockedIPs}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Failed Attempts (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{securityStatus.failedAttempts}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Active Anomalies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{securityStatus.anomalies}</div>
            </CardContent>
          </Card>
        </div>

        {/* Anomaly Alerts */}
        {anomalies.length > 0 && (
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Active Anomalies
              </CardTitle>
              <CardDescription>Unusual patterns requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {anomalies.map((anomaly) => (
                <div key={anomaly.id} className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium">{anomaly.type}</p>
                      <p className="text-sm text-muted-foreground">{anomaly.server} • {anomaly.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={anomaly.severity === 'high' ? 'destructive' : 'secondary'}>
                      {anomaly.severity}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEscalate(anomaly)}>
                      <ArrowUpCircle className="h-4 w-4 mr-1" />
                      Escalate
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleFreeze(anomaly)}>
                      <Snowflake className="h-4 w-4 mr-1" />
                      Freeze
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Access Attempts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-orange-500" />
                Recent Access Attempts
              </CardTitle>
              <CardDescription>Blocked and mitigated threats</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Server</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAttempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell className="font-mono text-sm">{attempt.ip}</TableCell>
                      <TableCell>{attempt.type}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{attempt.server}</TableCell>
                      <TableCell>
                        <Badge variant={attempt.status === 'blocked' ? 'destructive' : 'secondary'}>
                          {attempt.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* IP Blocklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-destructive" />
                IP Blocklist
              </CardTitle>
              <CardDescription>Currently blocked IP ranges</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP/Range</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Expires</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ipBlocks.map((block, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm">{block.ip}</TableCell>
                      <TableCell className="text-sm">{block.reason}</TableCell>
                      <TableCell>
                        <Badge variant={block.expires === 'Permanent' ? 'destructive' : 'outline'}>
                          {block.expires}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
