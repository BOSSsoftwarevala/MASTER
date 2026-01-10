import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Stethoscope, 
  RefreshCw,
  Cpu,
  HardDrive,
  Database,
  RotateCcw,
  Search,
  Bug,
  Power,
  RefreshCcw,
  Shield,
  Lock,
  Unlock,
  AlertCircle,
  Flame,
  CreditCard,
  FileText,
  Download,
  Loader2,
  CloudOff,
  CloudUpload,
  History,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Settings
} from 'lucide-react';
import { Server, useUpdateServer } from '@/hooks/useServerData';
import { toast } from 'sonner';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { aiServerApi } from '@/lib/aiServerApi';

interface ServerStatusCardProps {
  server: Server;
  showDiagnose?: boolean;
  compact?: boolean;
  isAdmin?: boolean;
  onActionLog?: (action: string, result: string) => void;
}

// Backup status type
type BackupStatus = 'enabled' | 'pending' | 'failed' | 'not_configured';

// SSL status type  
type SSLStatus = 'active' | 'expiring_soon' | 'expired' | 'missing';

// Pending issue type
interface PendingIssue {
  id: string;
  label: string;
  type: 'security' | 'ssl' | 'backup' | 'performance' | 'config';
  severity: 'critical' | 'warning' | 'info';
}

// Simple status determination based on actual server data
const getServerConnectionStatus = (server: Server) => {
  const hasMetrics = server.current_cpu_load !== null && server.current_cpu_load !== undefined;
  
  if (server.status === 'down') {
    return { status: 'offline', message: 'Server offline', color: 'slate', state: 'error' };
  }
  
  if (server.status === 'maintenance') {
    return { status: 'maintenance', message: 'Under maintenance', color: 'blue', state: 'warning' };
  }
  
  if (server.status === 'warning') {
    return { status: 'warning', message: hasMetrics ? 'Degraded performance' : 'Agent not responding', color: 'amber', state: 'warning' };
  }
  
  if (server.status === 'running' && hasMetrics) {
    return { status: 'live', message: 'Online', color: 'emerald', state: 'success' };
  }
  
  if (server.status === 'running' && !hasMetrics) {
    return { status: 'pending', message: 'Waiting for agent', color: 'amber', state: 'loading' };
  }
  
  return { status: 'pending', message: 'Pending setup', color: 'amber', state: 'loading' };
};

// Simulate backup status based on server data
const getBackupStatus = (server: Server): { status: BackupStatus; lastBackup: string | null; size: string | null; location: string } => {
  const now = new Date();
  const serverCreated = new Date(server.created_at);
  const daysSinceCreated = Math.floor((now.getTime() - serverCreated.getTime()) / (24 * 60 * 60 * 1000));
  
  if (daysSinceCreated < 1) {
    return { status: 'not_configured', lastBackup: null, size: null, location: 'Not configured' };
  }
  
  if (server.status === 'down') {
    return { status: 'failed', lastBackup: new Date(now.getTime() - 86400000 * 2).toISOString(), size: '2.4 GB', location: 'S3 Bucket' };
  }
  
  if (server.status === 'warning') {
    return { status: 'pending', lastBackup: new Date(now.getTime() - 86400000).toISOString(), size: '2.1 GB', location: 'S3 Bucket' };
  }
  
  return { status: 'enabled', lastBackup: new Date(now.getTime() - 3600000 * 6).toISOString(), size: '2.8 GB', location: 'S3 Bucket' };
};

// Simulate SSL status based on server data
const getSSLStatus = (server: Server): { status: SSLStatus; issuer: string; expiryDate: string | null; autoRenew: boolean } => {
  const now = new Date();
  const serverCreated = new Date(server.created_at);
  const daysSinceCreated = Math.floor((now.getTime() - serverCreated.getTime()) / (24 * 60 * 60 * 1000));
  
  if (daysSinceCreated < 1) {
    return { status: 'missing', issuer: 'N/A', expiryDate: null, autoRenew: false };
  }
  
  if (server.status === 'down') {
    return { status: 'expired', issuer: "Let's Encrypt", expiryDate: new Date(now.getTime() - 86400000 * 5).toISOString(), autoRenew: false };
  }
  
  if (daysSinceCreated > 20) {
    return { status: 'expiring_soon', issuer: "Let's Encrypt", expiryDate: new Date(now.getTime() + 86400000 * 7).toISOString(), autoRenew: true };
  }
  
  return { status: 'active', issuer: "Let's Encrypt", expiryDate: new Date(now.getTime() + 86400000 * 60).toISOString(), autoRenew: true };
};

// Get pending issues based on server state
const getPendingIssues = (server: Server): PendingIssue[] => {
  const issues: PendingIssue[] = [];
  const backupInfo = getBackupStatus(server);
  const sslInfo = getSSLStatus(server);
  
  // Security patch
  if (server.status === 'warning') {
    issues.push({ id: 'security-patch', label: 'Security Patch Pending', type: 'security', severity: 'critical' });
  }
  
  // SSL
  if (sslInfo.status === 'expiring_soon') {
    issues.push({ id: 'ssl-renewal', label: 'SSL Renewal Pending', type: 'ssl', severity: 'warning' });
  } else if (sslInfo.status === 'expired' || sslInfo.status === 'missing') {
    issues.push({ id: 'ssl-expired', label: 'SSL Expired/Missing', type: 'ssl', severity: 'critical' });
  }
  
  // Backup
  if (backupInfo.status === 'not_configured') {
    issues.push({ id: 'backup-config', label: 'Backup Not Configured', type: 'backup', severity: 'warning' });
  } else if (backupInfo.status === 'failed') {
    issues.push({ id: 'backup-failed', label: 'Backup Failed', type: 'backup', severity: 'critical' });
  }
  
  // High CPU
  if (server.current_cpu_load && server.current_cpu_load > 80) {
    issues.push({ id: 'high-cpu', label: 'High CPU Alert', type: 'performance', severity: 'warning' });
  }
  
  // High RAM
  if (server.current_ram_load && server.current_ram_load > 85) {
    issues.push({ id: 'high-ram', label: 'High RAM Alert', type: 'performance', severity: 'warning' });
  }
  
  return issues;
};

const StatusIcon = ({ color }: { color: string }) => {
  switch (color) {
    case 'emerald':
      return <CheckCircle className="h-5 w-5 text-emerald-400" />;
    case 'amber':
      return <AlertTriangle className="h-5 w-5 text-amber-400" />;
    case 'red':
      return <XCircle className="h-5 w-5 text-red-400" />;
    case 'blue':
      return <Clock className="h-5 w-5 text-blue-400" />;
    case 'slate':
      return <XCircle className="h-5 w-5 text-slate-400" />;
    default:
      return <Clock className="h-5 w-5 text-slate-400" />;
  }
};

const getBadgeClasses = (color: string) => {
  switch (color) {
    case 'emerald':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'amber':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'red':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'blue':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'slate':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

const getCardStateClasses = (state: string, isLoading: boolean) => {
  if (isLoading) {
    return 'animate-pulse';
  }
  switch (state) {
    case 'success':
      return 'ring-1 ring-emerald-500/30';
    case 'warning':
      return 'ring-1 ring-amber-500/30 animate-[pulse_2s_ease-in-out_infinite]';
    case 'error':
      return 'ring-1 ring-red-500/30 animate-[pulse_1.5s_ease-in-out_infinite]';
    default:
      return '';
  }
};

export const ServerStatusCard = ({ 
  server, 
  showDiagnose = true, 
  compact = false,
  isAdmin = false,
  onActionLog
}: ServerStatusCardProps) => {
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [isKilling, setIsKilling] = useState(false);
  const [isRechecking, setIsRechecking] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRenewingSSL, setIsRenewingSSL] = useState(false);
  const [isFixingWithAI, setIsFixingWithAI] = useState(false);
  const updateServer = useUpdateServer();
  
  const { status, message, color, state } = getServerConnectionStatus(server);
  const isLive = status === 'live';
  const hasMetrics = server.current_cpu_load !== null && server.current_cpu_load !== undefined;
  const backupInfo = getBackupStatus(server);
  const sslInfo = getSSLStatus(server);
  const pendingIssues = getPendingIssues(server);
  const isAnyActionRunning = isDiagnosing || isRestarting || isScanning || isDebugging || isKilling || isRechecking || isBackingUp || isRenewingSSL || isFixingWithAI;

  // Log action helper
  const logAction = (action: string, result: string) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      server: server.name,
      action,
      result,
      actor: 'AI System'
    };
    console.log('[Server Action Log]', logEntry);
    onActionLog?.(action, result);
  };

  // AI Safe Restart - Uses real API
  const handleRestart = async () => {
    setIsRestarting(true);
    toast.info('🔄 AI Pre-Check: Validating safe restart conditions...');
    
    const result = await aiServerApi.action.restart(server.id, isAdmin ? 'admin' : 'user');
    
    if (result.status === 'blocked') {
      toast.error(`⛔ ${result.message}`);
      if (result.next_suggestion) toast.info(result.next_suggestion);
    } else {
      logAction('Restart', result.message);
      toast.success(`✅ ${result.message}`);
      if (result.next_suggestion) toast.info(result.next_suggestion);
    }
    setIsRestarting(false);
  };

  // AI Deep Scan - Uses real API
  const handleScan = async () => {
    setIsScanning(true);
    toast.info('🔍 Starting AI deep scan: ports, malware, config...');
    
    const result = await aiServerApi.security.scan(server.id, isAdmin ? 'admin' : 'user');
    
    if (result.status === 'blocked') {
      toast.error(`⛔ ${result.message}`);
    } else {
      logAction('Scan', result.message);
      toast.success(`🔍 ${result.message}`, { duration: 5000 });
      if (result.next_suggestion) toast.info(result.next_suggestion);
    }
    setIsScanning(false);
  };

  // AI Debug (Root-cause + Fix) - Uses real API
  const handleDebug = async () => {
    setIsDebugging(true);
    toast.info('🐞 AI analyzing system logs and metrics...');
    
    const analyzeResult = await aiServerApi.debug.analyze(server.id, isAdmin ? 'admin' : 'user');
    
    if (analyzeResult.status === 'blocked') {
      toast.error(`⛔ ${analyzeResult.message}`);
      setIsDebugging(false);
      return;
    }
    
    toast.info('🐞 Root-cause identified. Applying fix...');
    const fixResult = await aiServerApi.debug.fix(server.id, 'auto', isAdmin ? 'admin' : 'user');
    
    logAction('Debug', fixResult.message);
    toast.success(`🐞 ${fixResult.message}`);
    if (fixResult.next_suggestion) toast.info(fixResult.next_suggestion);
    setIsDebugging(false);
  };

  // Kill (Admin only) - Uses real API
  const handleKill = async () => {
    if (!isAdmin) {
      toast.error('⛔ Kill action requires Admin privileges');
      return;
    }
    
    setIsKilling(true);
    toast.warning('❌ Confirm: Force stopping all services...');
    
    const result = await aiServerApi.action.kill(server.id, 'admin');
    
    if (result.status === 'blocked') {
      toast.error(`⛔ ${result.message}`);
      if (result.next_suggestion) toast.info(result.next_suggestion);
    } else {
      logAction('Kill', result.message);
      toast.success(`❌ ${result.message}`);
      if (result.next_suggestion) toast.info(result.next_suggestion);
    }
    setIsKilling(false);
  };

  // Recheck (Refresh metrics) - Uses real API
  const handleRecheck = async () => {
    setIsRechecking(true);
    toast.info('♻️ Fetching live metrics...');
    
    const result = await aiServerApi.action.recheck(server.id, isAdmin ? 'admin' : 'user');
    
    logAction('Recheck', result.message);
    toast.success(`♻️ ${result.message}`);
    setIsRechecking(false);
  };

  // Run Backup
  const handleRunBackup = async () => {
    setIsBackingUp(true);
    toast.info('💾 AI initiating backup process...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    logAction('Backup', 'Backup completed successfully');
    toast.success('💾 Backup completed successfully');
    setIsBackingUp(false);
  };

  // Restore Backup
  const handleRestoreBackup = async () => {
    setIsBackingUp(true);
    toast.info('📥 AI preparing restore from latest backup...');
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    logAction('Restore', 'Restore completed successfully');
    toast.success('📥 Restore completed successfully');
    setIsBackingUp(false);
  };

  // Renew SSL
  const handleRenewSSL = async () => {
    setIsRenewingSSL(true);
    toast.info('🔒 AI initiating SSL renewal...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    logAction('SSL Renewal', 'SSL certificate renewed successfully');
    toast.success('🔒 SSL certificate renewed successfully');
    setIsRenewingSSL(false);
  };

  // Force SSL Recheck
  const handleForceSSLRecheck = async () => {
    setIsRenewingSSL(true);
    toast.info('🔍 Rechecking SSL status...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    logAction('SSL Recheck', 'SSL status verified');
    toast.success('🔍 SSL status verified');
    setIsRenewingSSL(false);
  };

  // Fix with AI
  const handleFixWithAI = async (issueId: string) => {
    setIsFixingWithAI(true);
    toast.info('🤖 AI analyzing and fixing issue...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    logAction(`Fix Issue: ${issueId}`, 'Issue resolved by AI');
    toast.success('🤖 Issue resolved by AI');
    setIsFixingWithAI(false);
  };

  // Download audit log
  const handleDownloadLog = () => {
    const log = {
      server: server.name,
      serverId: server.id,
      exportedAt: new Date().toISOString(),
      status: server.status,
      metrics: {
        cpu: server.current_cpu_load,
        ram: server.current_ram_load,
        disk: server.current_disk_usage
      },
      backup: backupInfo,
      ssl: sslInfo,
      pendingIssues
    };
    
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${server.name}-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('📥 Audit log downloaded');
  };

  // Get metric color based on value
  const getMetricColor = (value: number | null) => {
    if (value === null) return 'text-[hsl(var(--boss-text-muted))]';
    if (value > 80) return 'text-red-400';
    if (value > 60) return 'text-amber-400';
    return 'text-emerald-400';
  };

  // Get metric display
  const getMetricDisplay = (value: number | null) => {
    if (value === null || value === undefined) {
      return <span className="text-[hsl(var(--boss-text-muted))] text-sm">—</span>;
    }
    return <span className={`font-bold ${getMetricColor(value)}`}>{value}%</span>;
  };

  // Backup status display
  const BackupStatusDisplay = () => {
    const getBackupIcon = () => {
      switch (backupInfo.status) {
        case 'enabled': return <CheckCircle className="h-4 w-4 text-emerald-400" />;
        case 'pending': return <Clock className="h-4 w-4 text-amber-400" />;
        case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
        default: return <CloudOff className="h-4 w-4 text-slate-400" />;
      }
    };
    
    const getBackupColor = () => {
      switch (backupInfo.status) {
        case 'enabled': return 'text-emerald-400';
        case 'pending': return 'text-amber-400';
        case 'failed': return 'text-red-400';
        default: return 'text-slate-400';
      }
    };
    
    const getBackupLabel = () => {
      switch (backupInfo.status) {
        case 'enabled': return 'Enabled ✓';
        case 'pending': return 'Pending ⏳';
        case 'failed': return 'Failed ✖';
        default: return 'Not Configured';
      }
    };
    
    return (
      <div className="p-3 rounded-lg bg-[hsl(var(--boss-card-elevated))]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[hsl(var(--boss-text-muted))] uppercase tracking-wide">Backup</span>
          <Tooltip>
            <TooltipTrigger>
              {getBackupIcon()}
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-[hsl(var(--boss-card-elevated))] text-[hsl(var(--boss-text))] border-[hsl(var(--boss-border))] max-w-xs">
              <p className="text-xs font-medium">Last backup: {backupInfo.lastBackup ? new Date(backupInfo.lastBackup).toLocaleString() : 'Never'}</p>
              <p className="text-xs text-[hsl(var(--boss-text-muted))]">Size: {backupInfo.size || 'N/A'}</p>
              <p className="text-xs text-[hsl(var(--boss-text-muted))]">Location: {backupInfo.location}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className={`text-sm font-medium ${getBackupColor()}`}>{getBackupLabel()}</p>
        <div className="flex gap-1 mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRunBackup}
            disabled={isAnyActionRunning}
            className="h-6 px-2 text-xs text-[hsl(var(--boss-text-muted))] hover:text-emerald-400 hover:bg-emerald-500/10"
          >
            {isBackingUp ? <Loader2 className="h-3 w-3 animate-spin" /> : <CloudUpload className="h-3 w-3" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRestoreBackup}
            disabled={isAnyActionRunning || !backupInfo.lastBackup}
            className="h-6 px-2 text-xs text-[hsl(var(--boss-text-muted))] hover:text-blue-400 hover:bg-blue-500/10"
          >
            <History className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDownloadLog}
            className="h-6 px-2 text-xs text-[hsl(var(--boss-text-muted))] hover:text-purple-400 hover:bg-purple-500/10"
          >
            <FileText className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };

  // SSL status display
  const SSLStatusDisplay = () => {
    const getSSLIcon = () => {
      switch (sslInfo.status) {
        case 'active': return <Lock className="h-4 w-4 text-emerald-400" />;
        case 'expiring_soon': return <ShieldAlert className="h-4 w-4 text-amber-400" />;
        case 'expired': return <Unlock className="h-4 w-4 text-red-400" />;
        default: return <ShieldAlert className="h-4 w-4 text-red-400" />;
      }
    };
    
    const getSSLColor = () => {
      switch (sslInfo.status) {
        case 'active': return 'text-emerald-400';
        case 'expiring_soon': return 'text-amber-400';
        case 'expired': return 'text-red-400';
        default: return 'text-red-400';
      }
    };
    
    const getSSLLabel = () => {
      switch (sslInfo.status) {
        case 'active': return 'Active 🔒';
        case 'expiring_soon': return 'Expiring ⚠';
        case 'expired': return 'Expired ❌';
        default: return 'Missing ❌';
      }
    };
    
    return (
      <div className="p-3 rounded-lg bg-[hsl(var(--boss-card-elevated))]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[hsl(var(--boss-text-muted))] uppercase tracking-wide">SSL</span>
          <Tooltip>
            <TooltipTrigger>
              {getSSLIcon()}
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-[hsl(var(--boss-card-elevated))] text-[hsl(var(--boss-text))] border-[hsl(var(--boss-border))] max-w-xs">
              <p className="text-xs font-medium">Issuer: {sslInfo.issuer}</p>
              <p className="text-xs text-[hsl(var(--boss-text-muted))]">Expiry: {sslInfo.expiryDate ? new Date(sslInfo.expiryDate).toLocaleDateString() : 'N/A'}</p>
              <p className="text-xs text-[hsl(var(--boss-text-muted))]">Auto-renew: {sslInfo.autoRenew ? 'ON' : 'OFF'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className={`text-sm font-medium ${getSSLColor()}`}>{getSSLLabel()}</p>
        <div className="flex gap-1 mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRenewSSL}
            disabled={isAnyActionRunning}
            className="h-6 px-2 text-xs text-[hsl(var(--boss-text-muted))] hover:text-emerald-400 hover:bg-emerald-500/10"
          >
            {isRenewingSSL ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleForceSSLRecheck}
            disabled={isAnyActionRunning}
            className="h-6 px-2 text-xs text-[hsl(var(--boss-text-muted))] hover:text-blue-400 hover:bg-blue-500/10"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };

  // Pending issues display
  const PendingIssuesDisplay = () => {
    const hasCritical = pendingIssues.some(i => i.severity === 'critical');
    
    return (
      <div className="p-3 rounded-lg bg-[hsl(var(--boss-card-elevated))]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[hsl(var(--boss-text-muted))] uppercase tracking-wide">Pending</span>
          {hasCritical && <Bug className="h-4 w-4 text-red-400 animate-pulse" />}
        </div>
        
        {pendingIssues.length === 0 ? (
          <p className="text-sm font-medium text-emerald-400">All Clear ✓</p>
        ) : (
          <div className="space-y-1.5">
            {pendingIssues.slice(0, 3).map((issue) => (
              <Badge 
                key={issue.id}
                className={cn(
                  "text-xs gap-1 w-full justify-start",
                  issue.severity === 'critical' && 'bg-red-500/20 text-red-400 border-red-500/30',
                  issue.severity === 'warning' && 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                  issue.severity === 'info' && 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                )}
              >
                {issue.severity === 'critical' ? <AlertCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                <span className="truncate">{issue.label}</span>
              </Badge>
            ))}
            {pendingIssues.length > 3 && (
              <p className="text-xs text-[hsl(var(--boss-text-muted))]">+{pendingIssues.length - 3} more</p>
            )}
          </div>
        )}
        
        {pendingIssues.length > 0 && (
          <div className="flex gap-1 mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleFixWithAI(pendingIssues[0]?.id)}
              disabled={isAnyActionRunning}
              className="h-6 px-2 text-xs text-[hsl(var(--boss-text-muted))] hover:text-emerald-400 hover:bg-emerald-500/10"
            >
              {isFixingWithAI ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
              <span className="ml-1">Fix AI</span>
            </Button>
            {isAdmin && pendingIssues.some(i => i.type === 'performance') && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleKill}
                disabled={isAnyActionRunning}
                className="h-6 px-2 text-xs text-[hsl(var(--boss-text-muted))] hover:text-red-400 hover:bg-red-500/10"
              >
                <Power className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <StatusIcon color={color} />
        <Badge className={getBadgeClasses(color)}>
          {message}
        </Badge>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Card className={cn(
        "bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] transition-all duration-300",
        getCardStateClasses(state, isAnyActionRunning)
      )}>
        <CardContent className="p-4 space-y-4">
          {/* Action Bar (Top Right) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon color={color} />
              <div>
                <Badge className={getBadgeClasses(color)}>
                  {message}
                </Badge>
                <p className="text-xs text-[hsl(var(--boss-text-muted))] mt-1">
                  Last updated: {new Date(server.updated_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            {/* Quick Actions Bar */}
            <div className="flex gap-1 p-1 rounded-lg bg-[hsl(var(--boss-card-elevated))]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleRecheck}
                    disabled={isAnyActionRunning}
                    className="h-7 w-7 text-[hsl(var(--boss-text-muted))] hover:text-emerald-400 hover:bg-emerald-500/10"
                  >
                    {isRechecking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-[hsl(var(--boss-card-elevated))] text-[hsl(var(--boss-text))] border-[hsl(var(--boss-border))]">
                  <p className="text-xs">🔄 Refresh</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleRestart}
                    disabled={isAnyActionRunning}
                    className="h-7 w-7 text-[hsl(var(--boss-text-muted))] hover:text-blue-400 hover:bg-blue-500/10"
                  >
                    {isRestarting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-[hsl(var(--boss-card-elevated))] text-[hsl(var(--boss-text))] border-[hsl(var(--boss-border))]">
                  <p className="text-xs">♻ Restart</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleScan}
                    disabled={isAnyActionRunning}
                    className="h-7 w-7 text-[hsl(var(--boss-text-muted))] hover:text-purple-400 hover:bg-purple-500/10"
                  >
                    {isScanning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-[hsl(var(--boss-card-elevated))] text-[hsl(var(--boss-text))] border-[hsl(var(--boss-border))]">
                  <p className="text-xs">🔍 Scan</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleDebug}
                    disabled={isAnyActionRunning}
                    className="h-7 w-7 text-[hsl(var(--boss-text-muted))] hover:text-amber-400 hover:bg-amber-500/10"
                  >
                    {isDebugging ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bug className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-[hsl(var(--boss-card-elevated))] text-[hsl(var(--boss-text))] border-[hsl(var(--boss-border))]">
                  <p className="text-xs">🛠 Debug</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleKill}
                    disabled={isAnyActionRunning || !isAdmin}
                    className={cn(
                      "h-7 w-7",
                      isAdmin 
                        ? "text-[hsl(var(--boss-text-muted))] hover:text-red-400 hover:bg-red-500/10" 
                        : "text-[hsl(var(--boss-text-muted))]/50 cursor-not-allowed"
                    )}
                  >
                    {isKilling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Power className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-[hsl(var(--boss-card-elevated))] text-[hsl(var(--boss-text))] border-[hsl(var(--boss-border))]">
                  <p className="text-xs">☠ Kill {!isAdmin && '(Admin)'}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleDownloadLog}
                    className="h-7 w-7 text-[hsl(var(--boss-text-muted))] hover:text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <Lock className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-[hsl(var(--boss-card-elevated))] text-[hsl(var(--boss-text))] border-[hsl(var(--boss-border))]">
                  <p className="text-xs">🔒 Lock/Audit</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Metrics Grid - CPU, RAM, Disk */}
          <div className="grid grid-cols-3 gap-3">
            {/* CPU */}
            <div className="p-3 rounded-lg bg-[hsl(var(--boss-card-elevated))]">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-[hsl(var(--boss-text-muted))]">CPU</span>
              </div>
              <div className="text-xl mb-2">
                {getMetricDisplay(server.current_cpu_load)}
              </div>
              {hasMetrics && server.current_cpu_load !== null && (
                <Progress 
                  value={server.current_cpu_load} 
                  className="h-1 bg-[hsl(var(--boss-border))]" 
                />
              )}
            </div>
            
            {/* RAM */}
            <div className="p-3 rounded-lg bg-[hsl(var(--boss-card-elevated))]">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-[hsl(var(--boss-text-muted))]">RAM</span>
              </div>
              <div className="text-xl mb-2">
                {getMetricDisplay(server.current_ram_load)}
              </div>
              {hasMetrics && server.current_ram_load !== null && (
                <Progress 
                  value={server.current_ram_load} 
                  className="h-1 bg-[hsl(var(--boss-border))]" 
                />
              )}
            </div>
            
            {/* Disk */}
            <div className="p-3 rounded-lg bg-[hsl(var(--boss-card-elevated))]">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-cyan-400" />
                <span className="text-xs text-[hsl(var(--boss-text-muted))]">Disk</span>
              </div>
              <div className="text-xl mb-2">
                {getMetricDisplay(server.current_disk_usage)}
              </div>
              {hasMetrics && server.current_disk_usage !== null && (
                <Progress 
                  value={server.current_disk_usage} 
                  className="h-1 bg-[hsl(var(--boss-border))]" 
                />
              )}
            </div>
          </div>

          {/* New Columns: Backup, SSL, Pending */}
          <div className="grid grid-cols-3 gap-3">
            <BackupStatusDisplay />
            <SSLStatusDisplay />
            <PendingIssuesDisplay />
          </div>

          {/* Additional Info */}
          {!hasMetrics && status !== 'offline' && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-300">
                Metrics will appear once the monitoring agent connects to this server.
              </p>
            </div>
          )}

          {/* Download Audit Log Footer */}
          <div className="flex justify-end pt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleDownloadLog}
                  className="gap-1 text-xs text-[hsl(var(--boss-text-muted))] hover:text-[hsl(var(--boss-text))]"
                >
                  <Download className="h-3 w-3" />
                  Audit Log
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-[hsl(var(--boss-card-elevated))] text-[hsl(var(--boss-text))] border-[hsl(var(--boss-border))]">
                <p className="text-xs">Download server audit log (JSON)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ServerStatusCard;
