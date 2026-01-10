import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useUserRoles } from './useUserRoles';
import type { Json } from '@/integrations/supabase/types';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  is_read: boolean;
  metadata: Json;
  created_at: string;
  read_at: string | null;
  target_url: string | null;
  target_roles: string[];
  delivery_status: string;
}

// Role-based notification type mapping
const ROLE_NOTIFICATION_TYPES: Record<string, string[]> = {
  super_admin: ['system', 'payment', 'security', 'incident', 'finance', 'hr', 'lead', 'support', 'demo', 'license'],
  boss: ['system', 'payment', 'security', 'incident', 'finance', 'hr', 'lead', 'support', 'demo', 'license'],
  admin: ['system', 'payment', 'security', 'incident', 'finance', 'lead', 'support', 'demo'],
  hr_manager: ['hr', 'job', 'application', 'interview'],
  lead_manager: ['lead', 'sales', 'conversion'],
  project_manager: ['task', 'build', 'deploy', 'bug'],
  code_manager: ['task', 'build', 'deploy', 'bug', 'code_review'],
  support_manager: ['support', 'ticket', 'assist', 'sla'],
  franchise: ['franchise', 'payment', 'lead', 'performance'],
  reseller: ['reseller', 'payment', 'lead', 'commission'],
  developer: ['task', 'build', 'deploy', 'bug', 'code_review'],
  influencer: ['campaign', 'content', 'bonus'],
  user_basic: ['payment', 'demo', 'license', 'support'],
};

export function useNotifications() {
  const { user } = useAuth();
  const { roles } = useUserRoles();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get allowed notification types based on user roles
  const getAllowedTypes = useCallback(() => {
    if (!roles || roles.length === 0) return ROLE_NOTIFICATION_TYPES['user_basic'];
    
    const allowedTypes = new Set<string>();
    roles.forEach(role => {
      const types = ROLE_NOTIFICATION_TYPES[role] || ROLE_NOTIFICATION_TYPES['user_basic'];
      types.forEach(type => allowedTypes.add(type));
    });
    return Array.from(allowedTypes);
  }, [roles]);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      const allowedTypes = getAllowedTypes();
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .in('type', allowedTypes)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const mapped: Notification[] = (data || []).map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        priority: n.priority,
        is_read: n.is_read,
        metadata: n.metadata,
        created_at: n.created_at,
        read_at: n.read_at,
        target_url: n.target_url,
        target_roles: n.target_roles || [],
        delivery_status: n.delivery_status || 'delivered',
      }));

      setNotifications(mapped);
      setUnreadCount(mapped.filter((n) => !n.is_read).length);
      
      // Mark as delivered
      const pendingIds = mapped
        .filter(n => n.delivery_status === 'pending')
        .map(n => n.id);
      
      if (pendingIds.length > 0) {
        await supabase
          .from('notifications')
          .update({ 
            delivery_status: 'delivered',
            delivered_at: new Date().toISOString()
          })
          .in('id', pendingIds);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user, getAllowedTypes]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time updates with role filtering
  useEffect(() => {
    if (!user) return;

    const allowedTypes = getAllowedTypes();
    
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as any;
          
          // Check if notification type is allowed for user's roles
          if (!allowedTypes.includes(newNotification.type)) return;
          
          const notification: Notification = {
            id: newNotification.id,
            title: newNotification.title,
            message: newNotification.message,
            type: newNotification.type,
            priority: newNotification.priority,
            is_read: newNotification.is_read,
            metadata: newNotification.metadata,
            created_at: newNotification.created_at,
            read_at: newNotification.read_at,
            target_url: newNotification.target_url,
            target_roles: newNotification.target_roles || [],
            delivery_status: 'delivered',
          };
          
          setNotifications((prev) => [notification, ...prev.slice(0, 49)]);
          setUnreadCount((prev) => prev + 1);
          setHasNewNotification(true);
          
          // Play notification sound for high priority
          if (newNotification.priority === 'high') {
            playNotificationSound();
          }
          
          // Mark as delivered
          supabase
            .from('notifications')
            .update({ 
              delivery_status: 'delivered',
              delivered_at: new Date().toISOString()
            })
            .eq('id', newNotification.id)
            .then();
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const updated = payload.new as any;
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === updated.id
                ? { ...n, is_read: updated.is_read, read_at: updated.read_at }
                : n
            )
          );
          if (updated.is_read) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, getAllowedTypes]);

  const playNotificationSound = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRkAHIveli4FAABwl9X/iEQAAF2IuP//YAAARH6y//9vAAA7ea7//4EAADRzq///kwAALG6o//+kAAAmaab//7QAAB1jov//wgAAF12f///PAAAQWJ3//9sAAAhRmP//5QAAAAhOl///8QAAAEVM');
      }
      audioRef.current.play().catch(() => {});
    } catch {
      // Ignore audio errors
    }
  };

  const clearNewNotificationFlag = useCallback(() => {
    setHasNewNotification(false);
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString(),
          delivery_status: 'read'
        })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId
            ? { ...n, is_read: true, read_at: new Date().toISOString(), delivery_status: 'read' }
            : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString(),
          delivery_status: 'read'
        })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => ({ 
          ...n, 
          is_read: true, 
          read_at: new Date().toISOString(),
          delivery_status: 'read'
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationsByType = (type: string) => {
    return notifications.filter((n) => n.type === type);
  };

  const getUnreadNotifications = () => {
    return notifications.filter((n) => !n.is_read);
  };

  const getHighPriorityUnread = () => {
    return notifications.filter((n) => !n.is_read && n.priority === 'high');
  };

  return {
    notifications,
    loading,
    unreadCount,
    hasNewNotification,
    clearNewNotificationFlag,
    markAsRead,
    markAllAsRead,
    getNotificationsByType,
    getUnreadNotifications,
    getHighPriorityUnread,
    refetch: fetchNotifications,
  };
}
