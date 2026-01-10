import { Badge } from '@/components/ui/badge';
import { Activity, Brain, Shield, Clock } from 'lucide-react';

interface ValaStatusRowProps {
  aiState?: 'active' | 'monitoring' | 'idle';
  mode?: 'auto' | 'manual' | 'hybrid';
  uptime?: string;
  lastAction?: string;
}

export function ValaStatusRow({
  aiState = 'active',
  mode = 'auto',
  uptime = '99.9%',
  lastAction = 'Just now'
}: ValaStatusRowProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30">
      {/* AI State */}
      <div className="flex items-center gap-2">
        <Activity className={`h-4 w-4 ${aiState === 'active' ? 'text-emerald-400 animate-pulse' : 'text-muted-foreground'}`} />
        <span className="text-sm font-medium text-foreground">
          AI State: <span className="text-emerald-400 uppercase">{aiState}</span>
        </span>
      </div>

      {/* Mode */}
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-blue-400" />
        <span className="text-sm text-muted-foreground">
          Mode: <span className="text-foreground uppercase">{mode}</span>
        </span>
      </div>

      {/* Uptime */}
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-emerald-400" />
        <span className="text-sm text-muted-foreground">
          Uptime: <span className="text-emerald-400">{uptime}</span>
        </span>
      </div>

      {/* Last Action */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Last Action: <span className="text-foreground">{lastAction}</span>
        </span>
      </div>
    </div>
  );
}
