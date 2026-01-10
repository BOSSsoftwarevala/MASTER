import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  History,
  Search,
  Filter,
  User,
  ShoppingCart,
  CreditCard,
  Brain,
  Zap,
  AlertTriangle,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type EventType = 'user_action' | 'order' | 'payment' | 'ai_suggestion' | 'ai_execution' | 'failure' | 'security';

interface TimelineEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  user?: string;
  metadata?: Record<string, unknown>;
}

const eventConfig: Record<EventType, { icon: typeof User; color: string; label: string }> = {
  user_action: { icon: User, color: 'text-blue-500 bg-blue-500/10', label: 'User Action' },
  order: { icon: ShoppingCart, color: 'text-green-500 bg-green-500/10', label: 'Order' },
  payment: { icon: CreditCard, color: 'text-emerald-500 bg-emerald-500/10', label: 'Payment' },
  ai_suggestion: { icon: Brain, color: 'text-violet-500 bg-violet-500/10', label: 'AI Suggestion' },
  ai_execution: { icon: Zap, color: 'text-amber-500 bg-amber-500/10', label: 'AI Execution' },
  failure: { icon: AlertTriangle, color: 'text-red-500 bg-red-500/10', label: 'Failure' },
  security: { icon: Shield, color: 'text-orange-500 bg-orange-500/10', label: 'Security' },
};

const severityColors = {
  info: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  warning: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  error: 'bg-red-500/10 text-red-500 border-red-500/30',
  critical: 'bg-red-600/20 text-red-600 border-red-600/50 animate-pulse',
};

export function GlobalEventTimeline() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all');

  const { data: events, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['global-event-timeline'],
    queryFn: async () => {
      // Fetch from multiple sources
      const [auditLogs, aiDecisions, aiExecutions] = await Promise.all([
        supabase
          .from('audit_logs')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50),
        supabase
          .from('ai_decisions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(30),
        supabase
          .from('ai_execution_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(30),
      ]);

      const timeline: TimelineEvent[] = [];

      // Map audit logs
      auditLogs.data?.forEach(log => {
        let type: EventType = 'user_action';
        if (log.module?.includes('security') || log.action?.includes('login')) type = 'security';
        if (log.module?.includes('payment') || log.action?.includes('payment')) type = 'payment';
        if (log.module?.includes('order')) type = 'order';

        timeline.push({
          id: log.id,
          type,
          title: log.action,
          description: log.details || `${log.module} - ${log.action}`,
          timestamp: log.timestamp,
          severity: log.severity === 'critical' ? 'critical' : log.severity === 'error' ? 'error' : log.severity === 'warning' ? 'warning' : 'info',
          user: log.user_email,
        });
      });

      // Map AI decisions
      aiDecisions.data?.forEach(d => {
        timeline.push({
          id: d.id,
          type: d.was_approved ? 'ai_execution' : 'ai_suggestion',
          title: d.action_taken,
          description: d.user_message || d.internal_details || '',
          timestamp: d.created_at || new Date().toISOString(),
          severity: d.severity === 'critical' ? 'critical' : d.severity === 'warning' ? 'warning' : 'info',
          user: d.approved_by || 'AI Engine',
          metadata: { engine: d.ai_engine, approved: d.was_approved },
        });
      });

      // Map AI executions
      aiExecutions.data?.forEach(e => {
        const isFailure = e.status === 'failed' || e.status === 'error';
        timeline.push({
          id: e.id,
          type: isFailure ? 'failure' : 'ai_execution',
          title: e.execution_type,
          description: e.error_message || e.output_summary || 'AI task completed',
          timestamp: e.created_at,
          severity: isFailure ? 'error' : 'info',
          metadata: { cost: e.cost, duration: e.duration_ms },
        });
      });

      // Sort by timestamp
      timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return timeline;
    },
    refetchInterval: 30000,
  });

  const filteredEvents = events?.filter(e => {
    const matchesSearch = search === '' || 
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || e.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-violet-500" />
            Global Event Timeline
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <div className="flex gap-2 mt-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as EventType | 'all')}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="user_action">User Actions</SelectItem>
              <SelectItem value="order">Orders</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="ai_suggestion">AI Suggestions</SelectItem>
              <SelectItem value="ai_execution">AI Executions</SelectItem>
              <SelectItem value="failure">Failures</SelectItem>
              <SelectItem value="security">Security</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : filteredEvents?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No events found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents?.map((event) => {
                const config = eventConfig[event.type];
                const Icon = config.icon;
                
                return (
                  <div 
                    key={event.id} 
                    className={`flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${
                      event.severity === 'critical' ? 'border-red-500/50' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${config.color} shrink-0`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{event.title}</span>
                        <Badge className={severityColors[event.severity || 'info']} variant="outline">
                          {event.severity || 'info'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{event.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(event.timestamp)}
                        </span>
                        {event.user && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {event.user}
                          </span>
                        )}
                        <Badge variant="outline" className={`text-[10px] h-4 ${config.color}`}>
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                    {event.metadata?.approved !== undefined && (
                      <div className="shrink-0">
                        {event.metadata.approved ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    )}
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
