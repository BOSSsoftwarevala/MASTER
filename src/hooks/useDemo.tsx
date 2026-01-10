import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { safeApiCall } from '@/lib/safeApiCall';
import type { Database } from '@/integrations/supabase/types';

type Demo = Database['public']['Tables']['demos']['Row'];

export function useDemo() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentDemo, setCurrentDemo] = useState<Demo | null>(null);

  const startDemo = async (productId: string) => {
    setLoading(true);
    try {
      // Check for abuse
      const { data: abuseCheck } = await supabase
        .from('demo_abuse_logs')
        .select('*')
        .eq('product_id', productId)
        .gte('blocked_until', new Date().toISOString())
        .maybeSingle();

      if (abuseCheck) {
        toast({
          title: 'Demo temporarily unavailable',
          description: 'Please try again later or contact support.',
        });
        return null;
      }

      // Check existing demo
      let query = supabase
        .from('demos')
        .select('*')
        .eq('product_id', productId)
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString());

      if (user) {
        query = query.eq('user_id', user.id);
      }

      const { data: existingDemo } = await query.maybeSingle();

      if (existingDemo) {
        setCurrentDemo(existingDemo);
        return existingDemo;
      }

      // Get product demo URL
      const { data: product } = await supabase
        .from('products')
        .select('demo_url')
        .eq('id', productId)
        .single();

      // Create new demo
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour demo

      const accessCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const { data: newDemo, error: createError } = await supabase
        .from('demos')
        .insert({
          product_id: productId,
          user_id: user?.id || null,
          access_code: accessCode,
          status: 'active',
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (createError) throw createError;

      setCurrentDemo(newDemo);
      
      toast({
        title: 'Demo started',
        description: 'Your demo session is now active. Enjoy exploring!',
      });

      return newDemo;
    } catch (error) {
      console.error('Error starting demo:', error);
      toast({
        title: 'Something went wrong',
        description: 'We could not start your demo. Please try again.',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const extendDemo = async (demoId: string) => {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to extend your demo.',
      });
      return false;
    }

    setLoading(true);
    try {
      const { data: demo, error: demoError } = await supabase
        .from('demos')
        .select('*')
        .eq('id', demoId)
        .single();

      if (demoError || !demo) throw new Error('Demo not found');

      // Extend by 24 hours
      const newExpiry = new Date(demo.expires_at);
      newExpiry.setHours(newExpiry.getHours() + 24);

      const { error: updateError } = await supabase
        .from('demos')
        .update({ 
          expires_at: newExpiry.toISOString(),
          extended_count: (demo.extended_count || 0) + 1
        })
        .eq('id', demoId);

      if (updateError) throw updateError;

      toast({
        title: 'Demo extended',
        description: 'Your demo has been extended by 24 hours.',
      });

      return true;
    } catch (error) {
      console.error('Error extending demo:', error);
      toast({
        title: 'Something went wrong',
        description: 'We could not extend your demo. Please try again.',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getDemoUrl = (demo: Demo, product?: { demo_url: string | null }) => {
    // Return view-only URL for demos
    return product?.demo_url || '';
  };

  const logDemoUsage = async (demoId: string, usage: { page_views?: number; api_calls?: number; session_count?: number }) => {
    try {
      await supabase.from('demo_usage').upsert({
        demo_id: demoId,
        session_date: new Date().toISOString().split('T')[0],
        ...usage,
      });
    } catch (error) {
      console.error('Error logging demo usage:', error);
    }
  };

  const getActiveDemo = useCallback(async (productId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('demos')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error getting active demo:', error);
      return null;
    }
  }, [user]);

  return {
    loading,
    currentDemo,
    startDemo,
    extendDemo,
    getDemoUrl,
    logDemoUsage,
    getActiveDemo,
  };
}
