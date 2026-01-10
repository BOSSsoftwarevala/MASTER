import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Bell,
  BellOff,
  AlertTriangle,
  XCircle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Volume2,
  VolumeX,
  ChevronUp,
} from 'lucide-react';

type AlertSeverity = 'critical' | 'high' | 'medium' | 'info';
type AlertStatus = 'unacknowledged' | 'acknowledged' | 'escalated' | 'resolved';

interface PriorityAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  created_at: string;
  acknowledged_at?: string;
  escalated_at?: string;
  source: string;
}

const severityConfig: Record<AlertSeverity, { 
  icon: typeof AlertTriangle; 
  color: string; 
  bgColor: string;
  sound: boolean;
  emoji: string;
}> = {
  critical: { 
    icon: XCircle, 
    color: 'text-red-600', 
    bgColor: 'bg-red-500/20 border-red-500/50',
    sound: true,
    emoji: '🔴',
  },
  high: { 
    icon: AlertTriangle, 
    color: 'text-orange-500', 
    bgColor: 'bg-orange-500/20 border-orange-500/50',
    sound: true,
    emoji: '🟠',
  },
  medium: { 
    icon: AlertCircle, 
    color: 'text-amber-500', 
    bgColor: 'bg-amber-500/20 border-amber-500/50',
    sound: false,
    emoji: '🟡',
  },
  info: { 
    icon: Info, 
    color: 'text-blue-500', 
    bgColor: 'bg-blue-500/20 border-blue-500/50',
    sound: false,
    emoji: '🟢',
  },
};

const statusColors: Record<AlertStatus, string> = {
  unacknowledged: 'bg-red-500/20 text-red-500',
  acknowledged: 'bg-amber-500/20 text-amber-500',
  escalated: 'bg-purple-500/20 text-purple-500',
  resolved: 'bg-green-500/20 text-green-500',
};

export function AlertPrioritySystem() {
  const [silentMode, setSilentMode] = useState(() => {
    return localStorage.getItem('alertSilentMode') === 'true';
  });
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['priority-alerts'],
    queryFn: async () => {
      const { data: apiAlerts } = await supabase
        .from('api_alerts')
        .select('*')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false })
        .limit(50);

      const priorityAlerts: PriorityAlert[] = (apiAlerts || []).map(a => ({
        id: a.id,
        title: a.title,
        message: a.message || '',
        severity: (a.severity as AlertSeverity) || 'medium',
        status: a.is_read ? 'acknowledged' : 'unacknowledged',
        created_at: a.created_at,
        source: a.alert_type,
      }));

      // Sort by severity then by date
      const severityOrder = { critical: 0, high: 1, medium: 2, info: 3 };
      priorityAlerts.sort((a, b) => {
        const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
        if (severityDiff !== 0) return severityDiff;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      return priorityAlerts;
    },
    refetchInterval: 15000,
  });

  const acknowledgeAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('api_alerts')
        .update({ is_read: true })
        .eq('id', alertId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priority-alerts'] });
      toast.success('Alert acknowledged');
    },
  });

  const resolveAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('api_alerts')
        .update({ is_resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', alertId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priority-alerts'] });
      toast.success('Alert resolved');
    },
  });

  const escalateAlert = useCallback((alert: PriorityAlert) => {
    toast.error(`🚨 ESCALATED: ${alert.title}`, {
      description: 'Alert escalated to Super Admin',
      duration: 10000,
    });
  }, []);

  // Sound effect for critical/high alerts
  useEffect(() => {
    if (silentMode) return;
    
    const criticalAlerts = alerts?.filter(
      a => (a.severity === 'critical' || a.severity === 'high') && a.status === 'unacknowledged'
    );
    
    if (criticalAlerts && criticalAlerts.length > 0) {
      // Create oscillator for buzzer sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 200);
    }
  }, [alerts, silentMode]);

  // Auto-escalation timer
  useEffect(() => {
    const unacknowledged = alerts?.filter(
      a => a.status === 'unacknowledged' && (a.severity === 'critical' || a.severity === 'high')
    );

    unacknowledged?.forEach(alert => {
      const age = Date.now() - new Date(alert.created_at).getTime();
      // Escalate if not acknowledged within 5 minutes
      if (age > 5 * 60 * 1000) {
        escalateAlert(alert);
      }
    });
  }, [alerts, escalateAlert]);

  const toggleSilentMode = () => {
    const newValue = !silentMode;
    setSilentMode(newValue);
    localStorage.setItem('alertSilentMode', String(newValue));
    toast.info(newValue ? 'Silent mode enabled (visual only)' : 'Buzzer enabled');
  };

  const formatTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  const criticalCount = alerts?.filter(a => a.severity === 'critical' && a.status === 'unacknowledged').length || 0;
  const highCount = alerts?.filter(a => a.severity === 'high' && a.status === 'unacknowledged').length || 0;

  return (
    <Card className={criticalCount > 0 ? 'border-red-500/50' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className={`h-5 w-5 ${criticalCount > 0 ? 'text-red-500 animate-bounce' : 'text-amber-500'}`} />
            Alert Priority Queue
            {(criticalCount > 0 || highCount > 0) && (
              <Badge variant="destructive" className="ml-2">
                {criticalCount + highCount} urgent
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {silentMode ? (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Volume2 className="h-4 w-4 text-amber-500" />
              )}
              <Switch checked={!silentMode} onCheckedChange={() => toggleSilentMode()} />
              <span className="text-xs text-muted-foreground">
                {silentMode ? 'Silent' : 'Active'}
              </span>
            </div>
          </div>
        </div>
        {/* Severity Legend */}
        <div className="flex gap-2 mt-2">
          {Object.entries(severityConfig).map(([key, config]) => (
            <Badge key={key} variant="outline" className={`text-[10px] ${config.bgColor}`}>
              {config.emoji} {key} {config.sound && !silentMode && '🔊'}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20" />)}
            </div>
          ) : alerts?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p>No active alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts?.map((alert) => {
                const config = severityConfig[alert.severity];
                const Icon = config.icon;
                
                return (
                  <div 
                    key={alert.id} 
                    className={`p-3 rounded-lg border ${config.bgColor} ${
                      alert.severity === 'critical' && alert.status === 'unacknowledged' 
                        ? 'animate-pulse' 
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <Icon className={`h-5 w-5 ${config.color} shrink-0 mt-0.5`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{alert.title}</span>
                            <Badge className={statusColors[alert.status]} variant="outline">
                              {alert.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(alert.created_at)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Source: {alert.source}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {alert.status === 'unacknowledged' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => acknowledgeAlert.mutate(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => resolveAlert.mutate(alert.id)}
                        >
                          Resolve
                        </Button>
                        {(alert.severity === 'critical' || alert.severity === 'high') && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-purple-500"
                            onClick={() => escalateAlert(alert)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
