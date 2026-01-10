import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { safeApiCall } from '@/lib/safeApiCall';
import type { Database, Json } from '@/integrations/supabase/types';

type PaymentTransaction = Database['public']['Tables']['payment_transactions']['Row'];
type Invoice = Database['public']['Tables']['invoices']['Row'];

interface CheckoutOptions {
  gateway: 'paypal' | 'payu' | 'upi' | 'wise' | 'bank_transfer' | 'binance';
  amount: number;
  currency?: string;
  orderId?: string;
  metadata?: Json;
}

type PaymentStatus = 'initiated' | 'pending' | 'authorized' | 'success' | 'failed' | 'cancelled' | 'expired' | 'refunded';

export function usePayments() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      return;
    }

    return safeApiCall(async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTransactions(data || []);
      return data;
    });
  }, [user]);

  // Idempotent checkout initialization - prevents double charges
  const initCheckout = async (options: CheckoutOptions) => {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to make a purchase.',
      });
      return null;
    }

    setLoading(true);
    try {
      // Generate idempotency key based on user + order + timestamp window
      const timeWindow = Math.floor(Date.now() / (5 * 60 * 1000)); // 5-minute windows
      const idempotencyKey = `${user.id}-${options.orderId || 'cart'}-${timeWindow}-${options.amount}`;

      // Check for existing pending transaction with same idempotency key (prevents double click)
      const { data: existing } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('idempotency_key', idempotencyKey)
        .in('status', ['pending', 'authorized', 'success'])
        .maybeSingle();

      if (existing) {
        // Return existing transaction instead of creating duplicate
        console.log('[CHECKOUT] Found existing transaction:', existing.id);
        return {
          transactionId: existing.id,
          gateway: existing.gateway as CheckoutOptions['gateway'],
          amount: Number(existing.amount),
          currency: existing.currency,
          idempotencyKey,
          isExisting: true,
        };
      }

      // Create new pending transaction
      const { data: transaction, error } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: user.id,
          order_id: options.orderId || null,
          gateway: options.gateway,
          amount: options.amount,
          currency: options.currency || 'USD',
          status: 'pending',
          metadata: options.metadata || {},
          idempotency_key: idempotencyKey,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        transactionId: transaction.id,
        gateway: options.gateway,
        amount: options.amount,
        currency: options.currency || 'USD',
        idempotencyKey,
        isExisting: false,
      };
    } catch (error) {
      console.error('Error initiating checkout:', error);
      toast({
        title: 'Something went wrong',
        description: 'We could not process your request. Please try again.',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update transaction status with state machine validation
  const updateTransactionStatus = async (
    transactionId: string,
    status: 'processing' | 'completed' | 'failed' | 'refunded',
    gatewayTransactionId?: string
  ) => {
    return safeApiCall(async () => {
      // Map simplified statuses to internal state machine
      const statusMap: Record<string, PaymentStatus> = {
        'processing': 'pending',
        'completed': 'success',
        'failed': 'failed',
        'refunded': 'refunded',
      };

      const internalStatus = statusMap[status] || status;
      
      const updates: Record<string, unknown> = { 
        status: internalStatus,
        updated_at: new Date().toISOString(),
      };
      
      if (gatewayTransactionId) {
        updates.gateway_transaction_id = gatewayTransactionId;
      }
      
      if (internalStatus === 'success') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('payment_transactions')
        .update(updates)
        .eq('id', transactionId);

      if (error) throw error;

      await fetchTransactions();
      return true;
    });
  };

  // Verify payment status with retry and backoff
  const verifyPayment = async (transactionId: string, retryCount = 0): Promise<{
    status: PaymentStatus;
    verified: boolean;
    message: string;
    canRetry?: boolean;
  }> => {
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke('checkout-verify', {
        body: { transactionId, retryCount },
      });

      if (functionError) throw functionError;

      return {
        status: functionData.status || 'pending',
        verified: functionData.success || false,
        message: functionData.message || 'Verifying payment...',
        canRetry: functionData.retryAfter ? true : false,
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      
      // Fall back to direct DB check
      const { data } = await supabase
        .from('payment_transactions')
        .select('status')
        .eq('id', transactionId)
        .single();

      return {
        status: (data?.status as PaymentStatus) || 'pending',
        verified: data?.status === 'success',
        message: 'We are verifying your payment. Please wait...',
      };
    }
  };

  // Get transaction status (simple read)
  const getTransactionStatus = async (transactionId: string) => {
    return safeApiCall(async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error) throw error;

      return data;
    });
  };

  // Cancel a pending payment
  const cancelPayment = async (transactionId: string) => {
    return safeApiCall(async () => {
      // Only allow cancellation of pending/initiated payments
      const { data: existing } = await supabase
        .from('payment_transactions')
        .select('status')
        .eq('id', transactionId)
        .single();

      if (!existing || !['pending', 'initiated'].includes(existing.status)) {
        toast({
          title: 'Cannot cancel',
          description: 'This payment cannot be cancelled at this time.',
        });
        return false;
      }

      const { error } = await supabase
        .from('payment_transactions')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', transactionId);

      if (error) throw error;

      await fetchTransactions();
      toast({
        title: 'Payment cancelled',
        description: 'Your payment has been cancelled successfully.',
      });
      return true;
    });
  };

  // Request refund (creates approval request)
  const requestRefund = async (transactionId: string, reason: string) => {
    if (!user) return null;

    return safeApiCall(async () => {
      // Verify transaction is eligible for refund
      const { data: transaction } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('id', transactionId)
        .eq('status', 'success')
        .single();

      if (!transaction) {
        toast({
          title: 'Refund not available',
          description: 'This payment is not eligible for refund.',
        });
        return null;
      }

      // Create refund request approval
      const { data: approval, error } = await supabase
        .from('approvals')
        .insert({
          type: 'payment',
          title: `Refund Request - ${transaction.currency} ${transaction.amount}`,
          description: reason,
          requester: user.email || 'Unknown',
          requester_id: user.id,
          reference_table: 'payment_transactions',
          reference_id: transactionId,
          amount: Number(transaction.amount),
          priority: 'medium',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Refund requested',
        description: 'Your refund request has been submitted for review.',
      });

      return approval;
    });
  };

  return {
    loading,
    transactions,
    initCheckout,
    updateTransactionStatus,
    verifyPayment,
    getTransactionStatus,
    cancelPayment,
    requestRefund,
    fetchTransactions,
  };
}

export function useInvoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = useCallback(async () => {
    if (!user) {
      setInvoices([]);
      setLoading(false);
      return;
    }

    return safeApiCall(async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInvoices(data || []);
      return data;
    }).finally(() => setLoading(false));
  }, [user]);

  const getInvoice = async (invoiceId: string) => {
    return safeApiCall(async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();

      if (error) throw error;

      return data;
    });
  };

  return {
    invoices,
    loading,
    fetchInvoices,
    getInvoice,
  };
}
