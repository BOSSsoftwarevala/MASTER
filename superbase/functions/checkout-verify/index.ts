import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyRequest {
  transactionId: string;
  retryCount?: number;
}

// Verify payment status with gateway (mock implementation)
async function verifyWithGateway(gateway: string, gatewayTransactionId: string | null): Promise<{
  verified: boolean;
  status: string;
  gatewayData?: Record<string, unknown>;
}> {
  // In production, implement actual gateway verification
  // For now, return pending to allow retry
  console.log(`[VERIFY] Checking ${gateway} for transaction ${gatewayTransactionId}`);
  
  // Mock verification - in production, call actual gateway APIs
  // PayPal: GET /v2/checkout/orders/{id}
  // UPI/PayU: POST /merchant/postservice with verify command
  // Wise: GET /v1/transfers/{id}
  // Binance: GET /binancepay/openapi/v2/order/query
  
  return {
    verified: false,
    status: 'pending',
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const { transactionId, retryCount = 0 }: VerifyRequest = await req.json();

    if (!transactionId) {
      return new Response(JSON.stringify({ error: 'Transaction ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch transaction
    const { data: transaction, error: txError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (txError || !transaction) {
      return new Response(JSON.stringify({ 
        error: 'Transaction not found',
        userMessage: 'We could not find your payment. Please contact support.',
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If already completed, return success
    if (transaction.status === 'success') {
      return new Response(JSON.stringify({
        success: true,
        status: 'success',
        message: 'Payment confirmed',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If failed/cancelled/expired, return final state
    if (['failed', 'cancelled', 'expired'].includes(transaction.status)) {
      return new Response(JSON.stringify({
        success: false,
        status: transaction.status,
        message: 'Payment was not completed. Please try again.',
        canRetry: true,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For pending/authorized, verify with gateway
    const verification = await verifyWithGateway(
      transaction.gateway,
      transaction.gateway_transaction_id
    );

    if (verification.verified && verification.status === 'success') {
      // Update transaction
      await supabase
        .from('payment_transactions')
        .update({
          status: 'success',
          completed_at: new Date().toISOString(),
          metadata: {
            ...transaction.metadata as Record<string, unknown>,
            verifiedAt: new Date().toISOString(),
            verificationData: verification.gatewayData,
          },
        })
        .eq('id', transactionId);

      return new Response(JSON.stringify({
        success: true,
        status: 'success',
        message: 'Payment confirmed',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Still pending - advise retry with backoff
    const maxRetries = 3;
    if (retryCount < maxRetries) {
      const backoffMs = Math.min(1000 * Math.pow(2, retryCount), 10000);
      
      return new Response(JSON.stringify({
        success: false,
        status: 'pending',
        message: 'Payment is being processed. Please wait...',
        retryAfter: backoffMs,
        retryCount: retryCount + 1,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Max retries reached - mark as hold for manual review
    await supabase
      .from('payment_transactions')
      .update({
        metadata: {
          ...transaction.metadata as Record<string, unknown>,
          requiresManualReview: true,
          reviewReason: 'Max verification retries exceeded',
        },
      })
      .eq('id', transactionId);

    return new Response(JSON.stringify({
      success: false,
      status: 'pending',
      message: 'Payment verification in progress. You will receive a notification once confirmed.',
      requiresReview: true,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[VERIFY] Error:', error);
    return new Response(JSON.stringify({
      error: 'Verification error',
      userMessage: 'We are verifying your payment. Please check back shortly.',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
