import { Activity, Shield, Clock, Cpu } from 'lucide-react';

interface ValaFooterProps {
  systemHealth?: number;
  lastActionTime?: string;
  cpuUsage?: number;
  memoryUsage?: number;
}

export function ValaFooter({
  systemHealth = 98,
  lastActionTime = 'Just now',
  cpuUsage = 42,
  memoryUsage = 67
}: ValaFooterProps) {
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      {/* System Health */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
          <span>System Health: <span className="text-emerald-400 font-medium">{systemHealth}%</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" />
          <span>Last Action: {lastActionTime}</span>
        </div>
      </div>

      {/* Resource Usage */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-3.5 w-3.5" />
          <span>CPU: {cpuUsage}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5" />
          <span>Memory: {memoryUsage}%</span>
        </div>
      </div>

      {/* Security Indicator */}
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Secure Connection</span>
      </div>
    </div>
  );
}
