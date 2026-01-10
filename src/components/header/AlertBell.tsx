import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Check, AlertTriangle, Info, User, Clock, CreditCard, 
  MessageSquare, AlertCircle, Server, Shield, Briefcase, 
  Code, Bug, Zap, TrendingUp, FileText, RefreshCw, Volume2,
  VolumeX, CheckCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function AlertBell() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isShaking, setIsShaking] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const prevUnreadRef = useRef(0);
  
  const { 
    notifications, 
    loading, 
    unreadCount,
    hasNewNotification,
    clearNewNotificationFlag,
    markAsRead, 
    markAllAsRead,
    refetch
  } = useNotifications();

  // Trigger bell shake animation on new notification
  useEffect(() => {
    if (hasNewNotification && unreadCount > prevUnreadRef.current) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
    prevUnreadRef.current = unreadCount;
  }, [hasNewNotification, unreadCount]);

  // Clear new notification flag when popover opens
  useEffect(() => {
    if (isOpen && hasNewNotification) {
      const timer = setTimeout(() => {
        clearNewNotificationFlag();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasNewNotification, clearNewNotificationFlag]);

  // Auto-refresh notifications every 30 seconds as fallback
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen) refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [isOpen, refetch]);

  const getTypeIcon = (type: string) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case 'lead':
      case 'sales':
        return <User className={iconClass} />;
      case 'sla':
      case 'deadline':
        return <Clock className={iconClass} />;
      case 'issue':
      case 'incident':
        return <AlertTriangle className={iconClass} />;
      case 'payment':
      case 'finance':
        return <CreditCard className={iconClass} />;
      case 'demo':
      case 'license':
        return <AlertCircle className={iconClass} />;
      case 'support':
      case 'ticket':
        return <MessageSquare className={iconClass} />;
      case 'system':
      case 'server':
        return <Server className={iconClass} />;
      case 'security':
        return <Shield className={iconClass} />;
      case 'hr':
      case 'job':
      case 'application':
        return <Briefcase className={iconClass} />;
      case 'task':
      case 'code_review':
        return <Code className={iconClass} />;
      case 'bug':
        return <Bug className={iconClass} />;
      case 'build':
      case 'deploy':
        return <Zap className={iconClass} />;
      case 'campaign':
      case 'content':
        return <FileText className={iconClass} />;
      case 'performance':
      case 'conversion':
        return <TrendingUp className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          icon: 'text-destructive',
          badge: 'bg-destructive/10 text-destructive border-destructive/20',
        };
      case 'medium':
        return {
          icon: 'text-warning',
          badge: 'bg-warning/10 text-warning border-warning/20',
        };
      default:
        return {
          icon: 'text-muted-foreground',
          badge: 'bg-muted text-muted-foreground',
        };
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = async (notification: typeof notifications[0]) => {
    await markAsRead(notification.id);
    
    // Navigate to target URL if available
    if (notification.target_url) {
      setIsOpen(false);
      navigate(notification.target_url);
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.is_read);
  const highPriorityUnread = unreadNotifications.filter(n => n.priority === 'high');

  const NotificationItem = ({ notification, index }: { notification: typeof notifications[0]; index: number }) => {
    const priorityStyles = getPriorityStyles(notification.priority);
    
    return (
      <div
        className={cn(
          "p-3 border-b border-border hover:bg-muted/50 cursor-pointer transition-all duration-150 notification-item-animate",
          !notification.is_read && "bg-primary/5 border-l-2 border-l-primary",
          notification.priority === 'high' && !notification.is_read && "bg-destructive/5 border-l-destructive"
        )}
        style={{ animationDelay: `${index * 30}ms` }}
        onClick={() => handleNotificationClick(notification)}
      >
        <div className="flex gap-3">
          <div className={cn(
            "mt-0.5 shrink-0 p-1.5 rounded-md",
            priorityStyles.icon,
            notification.priority === 'high' ? 'bg-destructive/10' : 'bg-muted'
          )}>
            {getTypeIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className={cn(
                "font-medium text-sm truncate",
                !notification.is_read && "font-semibold"
              )}>
                {notification.title}
              </p>
              <div className="flex items-center gap-1.5 shrink-0">
                {notification.priority === 'high' && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[10px] px-1.5 py-0 font-semibold",
                      priorityStyles.badge,
                      !notification.is_read && "urgent-badge"
                    )}
                  >
                    Urgent
                  </Badge>
                )}
                {!notification.is_read && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {notification.message}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize font-normal">
                {notification.type.replace('_', ' ')}
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                {formatTime(notification.created_at)}
              </span>
              {notification.delivery_status === 'delivered' && (
                <CheckCheck className="h-3 w-3 text-muted-foreground/50" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          ref={bellRef}
          variant="ghost" 
          size="icon" 
          className="relative group"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className={cn(
            "h-5 w-5 transition-all duration-200",
            isShaking && "bell-animate",
            !isShaking && "group-hover:scale-110"
          )} />
          {unreadCount > 0 && (
            <span className={cn(
              "absolute -top-1 -right-1 h-5 w-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-all",
              highPriorityUnread.length > 0 
                ? "bg-destructive text-destructive-foreground animate-[notification-pulse_2s_ease-in-out_infinite]" 
                : "bg-primary text-primary-foreground"
            )}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          {hasNewNotification && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive animate-[notification-pulse-once_0.3s_ease-out]" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 notification-panel-animate" align="end" sideOffset={8}>
        <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm">Notifications</h4>
            {highPriorityUnread.length > 0 && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 urgent-badge">
                {highPriorityUnread.length} urgent
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? (
                    <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {soundEnabled ? 'Mute sounds' : 'Enable sounds'}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => refetch()}
                >
                  <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Refresh</TooltipContent>
            </Tooltip>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border h-9 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-9 text-xs"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-9 text-xs"
            >
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger
              value="urgent"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-9 text-xs"
            >
              Urgent ({highPriorityUnread.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[350px]">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-4 w-4 rounded shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground text-sm">No notifications yet</p>
                  <p className="text-muted-foreground/70 text-xs mt-1">
                    You'll see updates here when something happens
                  </p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <NotificationItem key={notification.id} notification={notification} index={index} />
                ))
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="m-0">
            <ScrollArea className="h-[350px]">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-7 w-7 rounded-md shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : unreadNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-foreground font-medium text-sm">All caught up!</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    No unread notifications
                  </p>
                </div>
              ) : (
                unreadNotifications.map((notification, index) => (
                  <NotificationItem key={notification.id} notification={notification} index={index} />
                ))
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="urgent" className="m-0">
            <ScrollArea className="h-[350px]">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-7 w-7 rounded-md shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : highPriorityUnread.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="h-12 w-12 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-3">
                    <Shield className="h-6 w-6 text-success" />
                  </div>
                  <p className="text-foreground font-medium text-sm">No urgent alerts</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Critical notifications will appear here
                  </p>
                </div>
              ) : (
                highPriorityUnread.map((notification, index) => (
                  <NotificationItem key={notification.id} notification={notification} index={index} />
                ))
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        {/* Footer with connection status */}
        <div className="p-2 border-t border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] text-muted-foreground">Live updates active</span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {notifications.length} total
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
