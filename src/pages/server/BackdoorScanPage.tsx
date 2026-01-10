import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bug, 
  Shield, 
  Scan, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  RefreshCw,
  Play,
  Clock,
  FileSearch,
  Lock,
  Unlock,
  Zap,
  Eye
} from 'lucide-react';

interface ScanResult {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  location: string;
  status: 'detected' | 'fixed' | 'investigating';
  detectedAt: string;
}

const mockScanResults: ScanResult[] = [
  { id: '1', type: 'Suspicious Process', severity: 'high', description: 'Unknown process listening on port 4444', location: '/tmp/.hidden/', status: 'investigating', detectedAt: '2 hours ago' },
  { id: '2', type: 'Unauthorized SSH Key', severity: 'critical', description: 'New SSH key added without approval', location: '/root/.ssh/authorized_keys', status: 'detected', detectedAt: '30 minutes ago' },
  { id: '3', type: 'Modified Binary', severity: 'medium', description: 'System binary has been modified', location: '/usr/bin/wget', status: 'fixed', detectedAt: '1 day ago' },
];

export default function BackdoorScanPage() {
  const { isSuperAdmin, isAdmin } = useUserRoles();
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [lastScan, setLastScan] = useState('2 hours ago');
  const [results] = useState<ScanResult[]>(mockScanResults);

  if (!isSuperAdmin() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleStartScan = async () => {
    setScanning(true);
    setScanProgress(0);
    
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 200));
      setScanProgress(i);
    }
    
    setScanning(false);
    setLastScan('Just now');
  };

  const criticalCount = results.filter(r => r.severity === 'critical').length;
  const highCount = results.filter(r => r.severity === 'high').length;
  const detectedCount = results.filter(r => r.status === 'detected').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-[hsl(var(--boss-text))]">
              <Bug className="h-8 w-8 text-[hsl(var(--boss-accent))]" />
              Backdoor Scan
            </h1>
            <p className="text-[hsl(var(--boss-text-muted))] mt-1">
              AI-powered backdoor and malware detection
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-[hsl(var(--boss-text-muted))] flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last scan: {lastScan}
            </div>
            <Button 
              onClick={handleStartScan}
              className="gap-2 bg-[hsl(var(--boss-accent))] hover:bg-[hsl(var(--boss-accent))]/90"
              disabled={scanning}
            >
              {scanning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {scanning ? 'Scanning...' : 'Start Full Scan'}
            </Button>
          </div>
        </div>

        {/* Scan Progress */}
        {scanning && (
          <Card className="bg-gradient-to-br from-[hsl(var(--boss-card))] to-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-accent))]/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Scan className="h-8 w-8 text-[hsl(var(--boss-accent))] animate-pulse" />
                <div className="flex-1">
                  <p className="font-medium text-[hsl(var(--boss-text))]">AI Scan in Progress...</p>
                  <p className="text-sm text-[hsl(var(--boss-text-muted))]">
                    Checking system files, processes, network connections, and hidden directories
                  </p>
                </div>
                <span className="text-2xl font-bold text-[hsl(var(--boss-accent))]">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Threats', value: results.length, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Critical', value: criticalCount, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'High Priority', value: highCount, icon: Zap, color: 'text-orange-400', bg: 'bg-orange-500/10' },
            { label: 'Needs Action', value: detectedCount, icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[hsl(var(--boss-text-muted))]">{stat.label}</p>
                    <p className="text-2xl font-bold text-[hsl(var(--boss-text))]">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Scan Areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: FileSearch, label: 'File System Scan', desc: 'Check for modified or suspicious files', status: 'passed' },
            { icon: Lock, label: 'SSH Key Audit', desc: 'Verify authorized SSH keys', status: 'warning' },
            { icon: Shield, label: 'Process Monitor', desc: 'Detect hidden or suspicious processes', status: 'passed' },
          ].map((area) => (
            <Card 
              key={area.label}
              className={`bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] ${
                area.status === 'warning' ? 'border-amber-500/30' : ''
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    area.status === 'passed' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                  }`}>
                    <area.icon className={`h-6 w-6 ${
                      area.status === 'passed' ? 'text-emerald-400' : 'text-amber-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-[hsl(var(--boss-text))]">{area.label}</p>
                      {area.status === 'passed' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                      )}
                    </div>
                    <p className="text-sm text-[hsl(var(--boss-text-muted))] mt-1">{area.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detected Threats */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--boss-text))]">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Detected Threats
            </CardTitle>
            <CardDescription className="text-[hsl(var(--boss-text-muted))]">
              AI-identified security issues requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => (
                  <div 
                    key={result.id}
                    className={`p-4 rounded-lg border ${
                      result.severity === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                      result.severity === 'high' ? 'bg-orange-500/5 border-orange-500/20' :
                      result.severity === 'medium' ? 'bg-amber-500/5 border-amber-500/20' :
                      'bg-[hsl(var(--boss-card-elevated))] border-[hsl(var(--boss-border))]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          result.severity === 'critical' ? 'bg-red-500/20' :
                          result.severity === 'high' ? 'bg-orange-500/20' :
                          result.severity === 'medium' ? 'bg-amber-500/20' :
                          'bg-blue-500/20'
                        }`}>
                          <Bug className={`h-5 w-5 ${
                            result.severity === 'critical' ? 'text-red-400' :
                            result.severity === 'high' ? 'text-orange-400' :
                            result.severity === 'medium' ? 'text-amber-400' :
                            'text-blue-400'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-[hsl(var(--boss-text))]">{result.type}</p>
                            <Badge variant={
                              result.severity === 'critical' ? 'destructive' :
                              result.severity === 'high' ? 'secondary' :
                              'outline'
                            }>
                              {result.severity}
                            </Badge>
                            <Badge variant={
                              result.status === 'fixed' ? 'secondary' :
                              result.status === 'investigating' ? 'outline' :
                              'destructive'
                            } className={
                              result.status === 'fixed' ? 'bg-emerald-500/20 text-emerald-400' : ''
                            }>
                              {result.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-[hsl(var(--boss-text-muted))] mt-1">{result.description}</p>
                          <p className="text-xs text-[hsl(var(--boss-text-muted))] mt-2 font-mono">{result.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[hsl(var(--boss-text-muted))]">{result.detectedAt}</span>
                        {result.status !== 'fixed' && (
                          <Button size="sm" variant="outline" className="gap-1 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))]">
                            <Shield className="h-3 w-3" />
                            Fix
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="h-16 w-16 text-emerald-400 mb-4" />
                <p className="text-xl font-medium text-[hsl(var(--boss-text))]">All Clear!</p>
                <p className="text-sm text-[hsl(var(--boss-text-muted))]">No backdoors or threats detected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
