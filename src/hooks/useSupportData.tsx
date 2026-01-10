import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Ticket = Database['public']['Tables']['tickets']['Row'];
type TicketInsert = Database['public']['Tables']['tickets']['Insert'];
type TicketUpdate = Database['public']['Tables']['tickets']['Update'];

type AssistSession = Database['public']['Tables']['assist_sessions']['Row'];
type AssistSessionInsert = Database['public']['Tables']['assist_sessions']['Insert'];
type AssistSessionUpdate = Database['public']['Tables']['assist_sessions']['Update'];

type SlaRule = Database['public']['Tables']['sla_rules']['Row'];
type SlaRuleInsert = Database['public']['Tables']['sla_rules']['Insert'];
type SlaRuleUpdate = Database['public']['Tables']['sla_rules']['Update'];

type PromiseTracker = Database['public']['Tables']['promise_tracker']['Row'];
type PromiseTrackerInsert = Database['public']['Tables']['promise_tracker']['Insert'];
type PromiseTrackerUpdate = Database['public']['Tables']['promise_tracker']['Update'];

type SupportFeedback = Database['public']['Tables']['support_feedback']['Row'];

export function useSupportData() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [assistSessions, setAssistSessions] = useState<AssistSession[]>([]);
  const [slaRules, setSlaRules] = useState<SlaRule[]>([]);
  const [promises, setPromises] = useState<PromiseTracker[]>([]);
  const [feedback, setFeedback] = useState<SupportFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all support data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [ticketsRes, sessionsRes, slaRes, promisesRes, feedbackRes] = await Promise.all([
        supabase.from('tickets').select('*').eq('is_deleted', false).order('created_at', { ascending: false }),
        supabase.from('assist_sessions').select('*').eq('is_deleted', false).order('created_at', { ascending: false }),
        supabase.from('sla_rules').select('*').eq('is_deleted', false).order('priority', { ascending: true }),
        supabase.from('promise_tracker').select('*').eq('is_deleted', false).order('due_date', { ascending: true }),
        supabase.from('support_feedback').select('*').eq('is_deleted', false).order('created_at', { ascending: false }),
      ]);

      if (ticketsRes.data) setTickets(ticketsRes.data);
      if (sessionsRes.data) setAssistSessions(sessionsRes.data);
      if (slaRes.data) setSlaRules(slaRes.data);
      if (promisesRes.data) setPromises(promisesRes.data);
      if (feedbackRes.data) setFeedback(feedbackRes.data);
    } catch (error) {
      console.error('Error fetching support data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Ticket Operations
  const createTicket = async (data: TicketInsert) => {
    const { data: ticket, error } = await supabase.from('tickets').insert(data).select().single();
    if (error) {
      toast({ title: 'Error', description: 'Failed to create ticket', variant: 'destructive' });
      return null;
    }
    toast({ title: 'Success', description: 'Ticket created successfully' });
    await fetchAllData();
    return ticket;
  };

  const updateTicket = async (id: string, data: TicketUpdate) => {
    const { error } = await supabase.from('tickets').update(data).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update ticket', variant: 'destructive' });
      return false;
    }
    toast({ title: 'Success', description: 'Ticket updated successfully' });
    await fetchAllData();
    return true;
  };

  const deleteTicket = async (id: string) => {
    const { error } = await supabase.from('tickets').update({ is_deleted: true }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete ticket', variant: 'destructive' });
      return false;
    }
    toast({ title: 'Success', description: 'Ticket deleted successfully' });
    await fetchAllData();
    return true;
  };

  // Assist Session Operations
  const createAssistSession = async (data: AssistSessionInsert) => {
    const { data: session, error } = await supabase.from('assist_sessions').insert(data).select().single();
    if (error) {
      toast({ title: 'Error', description: 'Failed to create assist session', variant: 'destructive' });
      return null;
    }
    toast({ title: 'Success', description: 'Assist session created successfully' });
    await fetchAllData();
    return session;
  };

  const updateAssistSession = async (id: string, data: AssistSessionUpdate) => {
    const { error } = await supabase.from('assist_sessions').update(data).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update assist session', variant: 'destructive' });
      return false;
    }
    toast({ title: 'Success', description: 'Assist session updated successfully' });
    await fetchAllData();
    return true;
  };

  const endAssistSession = async (id: string, endReason: string) => {
    const { error } = await supabase.from('assist_sessions').update({
      status: 'ended' as const,
      ended_at: new Date().toISOString(),
      end_reason: endReason,
    }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to end assist session', variant: 'destructive' });
      return false;
    }
    toast({ title: 'Success', description: 'Assist session ended' });
    await fetchAllData();
    return true;
  };

  // SLA Rule Operations
  const createSlaRule = async (data: SlaRuleInsert) => {
    const { data: rule, error } = await supabase.from('sla_rules').insert(data).select().single();
    if (error) {
      toast({ title: 'Error', description: 'Failed to create SLA rule', variant: 'destructive' });
      return null;
    }
    toast({ title: 'Success', description: 'SLA rule created successfully' });
    await fetchAllData();
    return rule;
  };

  const updateSlaRule = async (id: string, data: SlaRuleUpdate) => {
    const { error } = await supabase.from('sla_rules').update(data).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update SLA rule', variant: 'destructive' });
      return false;
    }
    toast({ title: 'Success', description: 'SLA rule updated successfully' });
    await fetchAllData();
    return true;
  };

  const deleteSlaRule = async (id: string) => {
    const { error } = await supabase.from('sla_rules').update({ is_deleted: true }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete SLA rule', variant: 'destructive' });
      return false;
    }
    toast({ title: 'Success', description: 'SLA rule deleted successfully' });
    await fetchAllData();
    return true;
  };

  // Promise Tracker Operations
  const createPromise = async (data: PromiseTrackerInsert) => {
    const { data: promise, error } = await supabase.from('promise_tracker').insert(data).select().single();
    if (error) {
      toast({ title: 'Error', description: 'Failed to create promise', variant: 'destructive' });
      return null;
    }
    toast({ title: 'Success', description: 'Promise created successfully' });
    await fetchAllData();
    return promise;
  };

  const updatePromise = async (id: string, data: PromiseTrackerUpdate) => {
    const { error } = await supabase.from('promise_tracker').update(data).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update promise', variant: 'destructive' });
      return false;
    }
    toast({ title: 'Success', description: 'Promise updated successfully' });
    await fetchAllData();
    return true;
  };

  const completePromise = async (id: string) => {
    const { error } = await supabase.from('promise_tracker').update({
      status: 'completed' as const,
      completed_at: new Date().toISOString(),
    }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to complete promise', variant: 'destructive' });
      return false;
    }
    toast({ title: 'Success', description: 'Promise marked as complete' });
    await fetchAllData();
    return true;
  };

  const deletePromise = async (id: string) => {
    const { error } = await supabase.from('promise_tracker').update({ is_deleted: true }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete promise', variant: 'destructive' });
      return false;
    }
    toast({ title: 'Success', description: 'Promise deleted successfully' });
    await fetchAllData();
    return true;
  };

  // Stats
  const getStats = () => {
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
    const activeSessions = assistSessions.filter(s => s.status === 'active').length;
    const pendingPromises = promises.filter(p => p.status === 'pending').length;
    const overduePromises = promises.filter(p => 
      p.status === 'pending' && new Date(p.due_date) < new Date()
    ).length;
    const avgRating = feedback.length > 0 
      ? feedback.reduce((sum, f) => sum + Number(f.rating || 0), 0) / feedback.length 
      : 0;

    return {
      openTickets,
      inProgressTickets,
      activeSessions,
      pendingPromises,
      overduePromises,
      avgRating,
      totalTickets: tickets.length,
      totalFeedback: feedback.length,
    };
  };

  return {
    // Data
    tickets,
    assistSessions,
    slaRules,
    promises,
    feedback,
    loading,
    
    // Ticket operations
    createTicket,
    updateTicket,
    deleteTicket,
    
    // Assist session operations
    createAssistSession,
    updateAssistSession,
    endAssistSession,
    
    // SLA operations
    createSlaRule,
    updateSlaRule,
    deleteSlaRule,
    
    // Promise operations
    createPromise,
    updatePromise,
    completePromise,
    deletePromise,
    
    // Utils
    getStats,
    refetch: fetchAllData,
  };
}
