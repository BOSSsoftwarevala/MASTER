import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Clock, Database, Brain, Server, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RealTimeRefreshProps {
  lastUpdate: Date;
  onRefresh: () => void;
  isRefreshing?: boolean;
  dataSource?: 'AI' | 'API' | 'System' | 'Human' | 'Database';
  staleThresholdSeconds?: number;
}

const sourceConfig = {
  AI: { icon: Brain, color: 'text-violet-500 bg-violet-500/10' },
  API: { icon: Server, color: 'text-blue-500 bg-blue-500/10' },
  System: { icon: Database, color: 'text-emerald-500 bg-emerald-500/10' },
  Human: { icon: User, color: 'text-amber-500 bg-amber-500/10' },
  Database: { icon: Database, color: 'text-cyan-500 bg-cyan-500/10' },
};

export function RealTimeRefresh({ 
  lastUpdate, 
  onRefresh, 
  isRefreshing = false,
  dataSource = 'System',
  staleThresholdSeconds = 60
}: RealTimeRefreshProps) {
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    const updateSeconds = () => {
      const diff = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
      setSecondsAgo(diff);
      setIsStale(diff > staleThresholdSeconds);
    };

    updateSeconds();
    const interval = setInterval(updateSeconds, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate, staleThresholdSeconds]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const SourceIcon = sourceConfig[dataSource].icon;

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={`gap-1.5 ${sourceConfig[dataSource].color} ${isStale ? 'border-amber-500 animate-pulse' : ''}`}
            >
              <SourceIcon className="h-3 w-3" />
              {dataSource}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Data source: {dataSource}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-1 text-xs ${isStale ? 'text-amber-500' : 'text-muted-foreground'}`}>
              <Clock className="h-3 w-3" />
              <span>{formatTime(secondsAgo)}</span>
              {isStale && <span className="text-amber-500">(Stale)</span>}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Last update: {lastUpdate.toLocaleTimeString()}</p>
            {isStale && <p className="text-amber-500">Data may be outdated. Click refresh.</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onRefresh}
        disabled={isRefreshing}
        className="h-7 px-2"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span className="ml-1.5 text-xs">Refresh</span>
      </Button>
    </div>
  );
}

// Compact version for cards
export function DataSourceBadge({ 
  source 
}: { 
  source: 'AI' | 'API' | 'System' | 'Human' | 'Database' 
}) {
  const SourceIcon = sourceConfig[source].icon;
  
  return (
    <Badge variant="outline" className={`text-[10px] h-5 gap-1 ${sourceConfig[source].color}`}>
      <SourceIcon className="h-2.5 w-2.5" />
      {source}
    </Badge>
  );
}
