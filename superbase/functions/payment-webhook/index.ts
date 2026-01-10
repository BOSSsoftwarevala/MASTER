import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
};

// Payment states matching the state machine
type PaymentState = 'initiated' | 'pending' | 'authorized' | 'success' | 'failed' | 'cancelled' | 'expired' | 'refunded';

interface WebhookPayload {
  provider: string;
  event: string;
  transactionId: string;
  gatewayTransactionId?: string;
  amount?: number;
  status?: string;
  signature?: string;
  metadata?: Record<string, unknown>;
}

// Map provider status to internal state
function mapProviderStatus(provider: string, providerStatus: string): PaymentState {
  const statusMap: Record<string, Record<string, PaymentState>> = {
    paypal: {
      'COMPLETED': 'success',
      'APPROVED': 'authorized',
      'PENDING': 'pending',
      'VOIDED': 'cancelled',
      'FAILED': 'failed',
      'REFUNDED': 'refunded',
    },
    payu: {
      'success': 'success',
      'captured': 'success',
      'pending': 'pending',
      'in_progress': 'pending',
      'failed': 'failed',
      'failure': 'failed',
      'cancelled': 'cancelled',
      'user_cancelled': 'cancelled',
      'refunded': 'refunded',
    },
    upi: {
      'SUCCESS': 'success',
      'PENDING': 'pending',
      'FAILED': 'failed',
      'CANCELLED': 'cancelled',
    },
    wise: {
      'outgoing_payment_sent': 'success',
      'processing': 'pending',
      'funds_converted': 'authorized',
      'cancelled': 'cancelled',
      'refunded': 'refunded',
    },
    bank_transfer: {
      'confirmed': 'success',
      'pending': 'pending',
      'failed': 'failed',
      'expired': 'expired',
    },
    binance: {
      'PAID': 'success',
      'PENDING': 'pending',
      'EXPIRED': 'expired',
      'CANCELED': 'cancelled',
      'REFUNDED': 'refunded',
    },
  };

  return statusMap[provider]?.[providerStatus] || 'pending';
}

// Verify webhook signature based on provider
function verifyWebhookSignature(provider: string, _payload: string, signature: string | null): boolean {
  if (!signature) {
    console.log(`[WEBHOOK] No signature provided for ${provider} - allowing for development`);
    return true;
  }
  // TODO: Implement provider-specific signature verification
  return true;
}

// Handle successful payment
// deno-lint-ignore no-explicit-any
async function handlePaymentSuccess(
  supabase: any,
  transaction: Record<string, unknown>,
  payload: WebhookPayload
) {
  try {
    console.log(`[PAYMENT SUCCESS] Processing post-payment for ${transaction.id}`);

    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Generate invoice
    const invoiceData = {
      invoice_number: invoiceNumber,
      customer_id: transaction.user_id as string,
      amount: transaction.amount as number,
      currency: (transaction.currency as string) || 'USD',
      status: 'paid',
      paid_at: new Date().toISOString(),
      metadata: {
        gateway: transaction.gateway,
        gatewayTransactionId: payload.gatewayTransactionId,
        paymentTransactionId: transaction.id,
      },
    };

    const { error: invoiceError } = await supabase
      .from('invoices')
      .insert(invoiceData);

    if (invoiceError) {
      console.error('[PAYMENT SUCCESS] Error creating invoice:', invoiceError);
    } else {
      console.log(`[PAYMENT SUCCESS] Invoice ${invoiceNumber} created`);
    }

    // Create notification
    const notifData = {
      user_id: transaction.user_id as string,
      type: 'payment',
      title: 'Payment Successful',
      message: `Your payment of ${transaction.currency || 'USD'} ${transaction.amount} has been confirmed.`,
      metadata: {
        transactionId: transaction.id,
        invoiceNumber,
      },
    };

    const { error: notifError } = await supabase
      .from('notifications')
      .insert(notifData);

    if (notifError) {
      console.error('[PAYMENT SUCCESS] Error creating notification:', notifError);
    } else {
      console.log(`[PAYMENT SUCCESS] Notification sent for ${transaction.id}`);
    }

  } catch (error) {
    console.error('[PAYMENT SUCCESS] Error in post-payment processing:', error);
  }
}

// Handle failed payment
// deno-lint-ignore no-explicit-any
async function handlePaymentFailure(
  supabase: any,
  transaction: Record<string, unknown>,
  payload: WebhookPayload
) {
  try {
    console.log(`[PAYMENT FAILURE] Logging failure for ${transaction.id}`);

    // Create notification with retry option
    const notifData = {
      user_id: transaction.user_id as string,
      type: 'payment',
      title: 'Payment Update',
      message: 'We could not complete your payment. Please try again or use a different payment method.',
      metadata: {
        transactionId: transaction.id,
        canRetry: true,
      },
    };

    const { error: notifError } = await supabase
      .from('notifications')
      .insert(notifData);

    if (notifError) {
      console.error('[PAYMENT FAILURE] Error creating notification:', notifError);
    }

    // Log for recovery analysis
    const logData = {
      trigger_type: 'payment_failure',
      trigger_source: transaction.gateway as string,
      recovery_action: 'notify_user',
      recovery_status: 'completed',
      original_error: payload.status || 'unknown',
      user_impacted: true,
      silent_recovery: false,
      metadata: {
        transactionId: transaction.id,
        amount: transaction.amount,
      },
    };

    const { error: logError } = await supabase
      .from('auto_recovery_logs')
      .insert(logData);

    if (logError) {
      console.error('[PAYMENT FAILURE] Error logging recovery:', logError);
    }

  } catch (error) {
    console.error('[PAYMENT FAILURE] Error handling failure:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const provider = pathParts[pathParts.length - 1] || 'unknown';
    
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature') || 
                      req.headers.get('paypal-transmission-sig') ||
                      req.headers.get('x-razorpay-signature');

    // Verify signature
    if (!verifyWebhookSignature(provider, rawBody, signature)) {
      console.error(`[WEBHOOK] Invalid signature for ${provider}`);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let payload: WebhookPayload;
    try {
      payload = JSON.parse(rawBody);
      payload.provider = provider;
    } catch {
      console.error('[WEBHOOK] Invalid JSON payload');
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[WEBHOOK] Received ${provider} webhook:`, {
      event: payload.event,
      transactionId: payload.transactionId,
      status: payload.status,
    });

    // Find the transaction
    const { data: transaction, error: txError } = await supabase
      .from('payment_transactions')
      .select('*')
      .or(`id.eq.${payload.transactionId},gateway_transaction_id.eq.${payload.gatewayTransactionId || 'null'}`)
      .maybeSingle();

    if (txError) {
      console.error('[WEBHOOK] Error fetching transaction:', txError);
      throw txError;
    }

    if (!transaction) {
      console.log('[WEBHOOK] Transaction not found - returning success for retry');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Transaction not found, webhook acknowledged' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determine new status
    const newStatus = mapProviderStatus(provider, payload.status || '');
    
    // Only update if state transition is valid
    const validTransitions: Record<PaymentState, PaymentState[]> = {
      'initiated': ['pending', 'authorized', 'failed', 'cancelled'],
      'pending': ['authorized', 'success', 'failed', 'cancelled', 'expired'],
      'authorized': ['success', 'failed', 'cancelled'],
      'success': ['refunded'],
      'failed': [],
      'cancelled': [],
      'expired': [],
      'refunded': [],
    };

    const currentStatus = transaction.status as PaymentState;
    if (!validTransitions[currentStatus]?.includes(newStatus) && currentStatus !== newStatus) {
      console.log(`[WEBHOOK] Invalid state transition: ${currentStatus} -> ${newStatus}`);
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No state change required' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update transaction
    const existingMetadata = (transaction.metadata as Record<string, unknown>) || {};
    const updates: Record<string, unknown> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
      gateway_transaction_id: payload.gatewayTransactionId || transaction.gateway_transaction_id,
      metadata: {
        ...existingMetadata,
        webhookHistory: [
          ...((existingMetadata.webhookHistory as unknown[]) || []),
          {
            timestamp: new Date().toISOString(),
            event: payload.event,
            provider,
            previousStatus: currentStatus,
            newStatus,
          },
        ],
      },
    };

    if (newStatus === 'success') {
      updates.completed_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update(updates)
      .eq('id', transaction.id);

    if (updateError) {
      console.error('[WEBHOOK] Error updating transaction:', updateError);
      throw updateError;
    }

    console.log(`[WEBHOOK] Transaction ${transaction.id} updated: ${currentStatus} -> ${newStatus}`);

    // Handle post-payment actions
    if (newStatus === 'success') {
      await handlePaymentSuccess(supabase, transaction as Record<string, unknown>, payload);
    }

    if (newStatus === 'failed') {
      await handlePaymentFailure(supabase, transaction as Record<string, unknown>, payload);
    }

    return new Response(JSON.stringify({ 
      success: true,
      transactionId: transaction.id,
      status: newStatus,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[WEBHOOK] Error processing webhook:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'We are processing your request. Please check back shortly.',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
