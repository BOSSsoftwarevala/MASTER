import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Provider configurations
type AIProvider = 'lovable' | 'openai';

const OPENAI_MODELS = {
  "google/gemini-2.5-pro": "gpt-4o",
  "google/gemini-2.5-flash": "gpt-4o-mini",
  "google/gemini-2.5-flash-lite": "gpt-4o-mini",
};

// AI Agent configurations with specialized system prompts
const AI_AGENTS = {
  auto_development: {
    model: "google/gemini-2.5-pro",
    systemPrompt: `You are the Auto Development AI assistant. Your role is to:
- Convert client requirements into structured development tasks
- Prepare code logic drafts and suggestions (never final code)
- Assist developers with bug explanations and refactor hints
- Generate API logic suggestions and schema proposals

RULES:
- You CANNOT push code or deploy anything
- All suggestions require human approval
- Provide structured, actionable task breakdowns
- Be deterministic and precise, avoid creative interpretations`,
  },
  
  seo_ai: {
    model: "google/gemini-2.5-flash",
    systemPrompt: `You are the SEO & Content AI assistant. Your role is to:
- Generate SEO-optimized keywords and meta tags
- Draft blog posts, product descriptions, and landing page text
- Ensure content follows country-based compliance

RULES:
- No black-hat SEO techniques
- No fake traffic suggestions
- Follow regional content guidelines
- Keep content professional and brand-safe`,
  },
  
  lead_ai: {
    model: "google/gemini-2.5-flash",
    systemPrompt: `You are the Lead & Sales AI assistant. Your role is to:
- Score and qualify leads (Hot/Warm/Cold)
- Suggest sales follow-up actions
- Provide pricing suggestions (never final)
- Route leads to appropriate teams

RULES:
- You CANNOT contact leads directly
- You CANNOT promise or finalize pricing
- All actions require sales team approval
- Analyze behavior patterns objectively`,
  },
  
  support_ai: {
    model: "google/gemini-2.5-flash",
    systemPrompt: `You are the Support & Assist AI (User-Facing). Your role is to:
- Answer FAQs and explain features
- Provide demo help and status updates
- Adapt tone based on user's country/language
- Be friendly, professional, and helpful

RULES:
- NEVER reveal technical secrets or internal data
- Escalate complex issues to human support
- Auto-detect language and respond accordingly
- Maintain brand voice at all times`,
  },
  
  internal_ai: {
    model: "google/gemini-2.5-flash",
    systemPrompt: `You are the Internal Assist AI (Employees Only). Your role is to:
- Help staff with internal queries
- Explain SOPs and company policies
- Provide internal tool guidance

RULES:
- All conversations are logged and audited
- No sensitive data should leave this system
- Be direct and informative
- Follow company communication guidelines`,
  },
  
  incident_ai: {
    model: "google/gemini-2.5-flash-lite",
    systemPrompt: `You are the Incident Prediction AI. Your role is to:
- Analyze server metrics and error trends
- Identify potential failure patterns
- Generate preventive suggestions

RULES:
- You CANNOT take any action, only alert and suggest
- Provide risk levels (Low/Medium/High/Critical)
- Focus on actionable prevention steps
- Log all predictions for review`,
  },
  
  recovery_ai: {
    model: "google/gemini-2.5-flash-lite",
    systemPrompt: `You are the Auto Recovery AI. Your role is to:
- Suggest retry logic for failed operations
- Recommend failover strategies
- Guide graceful degradation

RULES:
- No destructive actions allowed
- Rollback suggestions require approval
- Prioritize system stability
- Document all recovery attempts`,
  },
  
  cost_ai: {
    model: "google/gemini-2.5-flash-lite",
    systemPrompt: `You are the Cost Optimizer AI. Your role is to:
- Analyze API and infrastructure usage
- Detect idle resources
- Suggest subscription optimizations
- Generate cost reports

RULES:
- Focus on waste reduction
- Provide ROI estimates for suggestions
- No automatic changes, only recommendations
- Track savings over time`,
  },
  
  hr_ai: {
    model: "google/gemini-2.5-flash",
    systemPrompt: `You are the HR & Hiring AI. Your role is to:
- Screen resumes and highlight relevant experience
- Generate interview questions
- Verify influencer authenticity
- Detect fake traffic patterns

RULES:
- No final hiring decisions
- All recommendations require HR approval
- Be objective and bias-free
- Follow employment law guidelines`,
  },
};

// Route request to appropriate AI agent based on type
function getAgentConfig(agentType: string) {
  return AI_AGENTS[agentType as keyof typeof AI_AGENTS] || AI_AGENTS.support_ai;
}

// Get the appropriate model for the provider
function getModelForProvider(lovableModel: string, provider: AIProvider): string {
  if (provider === 'openai') {
    return OPENAI_MODELS[lovableModel as keyof typeof OPENAI_MODELS] || 'gpt-4o-mini';
  }
  return lovableModel;
}

// Make API call to Lovable AI Gateway
async function callLovableAI(messages: any[], model: string, stream: boolean, apiKey: string) {
  return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, stream }),
  });
}

// Make API call to OpenAI directly
async function callOpenAI(messages: any[], model: string, stream: boolean, apiKey: string) {
  return await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, stream }),
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentType, messages, context, userId, stream = false, provider = 'auto' } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    // Determine which provider to use
    let activeProvider: AIProvider = 'lovable';
    let apiKey = LOVABLE_API_KEY;
    
    if (provider === 'openai' && OPENAI_API_KEY) {
      activeProvider = 'openai';
      apiKey = OPENAI_API_KEY;
    } else if (provider === 'auto') {
      // Auto mode: prefer Lovable, fallback to OpenAI if Lovable not available
      if (LOVABLE_API_KEY) {
        activeProvider = 'lovable';
        apiKey = LOVABLE_API_KEY;
      } else if (OPENAI_API_KEY) {
        activeProvider = 'openai';
        apiKey = OPENAI_API_KEY;
      }
    }
    
    if (!apiKey) {
      throw new Error("AI service not configured - no API keys available");
    }

    // Create Supabase client for logging
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Get agent configuration
    const agentConfig = getAgentConfig(agentType);
    const model = getModelForProvider(agentConfig.model, activeProvider);
    
    // Check if AI service is enabled
    const { data: serviceData } = await supabase
      .from('ai_services')
      .select('is_enabled, requires_approval')
      .eq('service_key', agentType)
      .single();
    
    if (serviceData && !serviceData.is_enabled) {
      return new Response(
        JSON.stringify({ 
          error: "This AI service is currently disabled",
          fallback: true,
          message: "Our AI assistant is taking a short break. Please try again later or contact support."
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare messages with system prompt
    const fullMessages = [
      { role: "system", content: agentConfig.systemPrompt + (context ? `\n\nContext: ${context}` : '') },
      ...messages,
    ];

    // Log AI execution start
    const startTime = Date.now();
    
    console.log(`Using AI Provider: ${activeProvider}, Model: ${model}`);
    
    // Call the appropriate AI provider
    let response: Response;
    try {
      if (activeProvider === 'openai') {
        response = await callOpenAI(fullMessages, model, stream, apiKey);
      } else {
        response = await callLovableAI(fullMessages, model, stream, apiKey);
      }
    } catch (primaryError) {
      // Automatic fallback: if primary provider fails, try the other
      console.log(`Primary provider (${activeProvider}) failed, attempting fallback...`);
      
      const fallbackProvider: AIProvider = activeProvider === 'lovable' ? 'openai' : 'lovable';
      const fallbackKey = fallbackProvider === 'openai' ? OPENAI_API_KEY : LOVABLE_API_KEY;
      
      if (fallbackKey) {
        const fallbackModel = getModelForProvider(agentConfig.model, fallbackProvider);
        console.log(`Falling back to: ${fallbackProvider}, Model: ${fallbackModel}`);
        
        if (fallbackProvider === 'openai') {
          response = await callOpenAI(fullMessages, fallbackModel, stream, fallbackKey);
        } else {
          response = await callLovableAI(fullMessages, fallbackModel, stream, fallbackKey);
        }
      } else {
        throw primaryError;
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Provider Error:", response.status, errorText);
      
      // Try fallback on error response
      const fallbackProvider: AIProvider = activeProvider === 'lovable' ? 'openai' : 'lovable';
      const fallbackKey = fallbackProvider === 'openai' ? OPENAI_API_KEY : LOVABLE_API_KEY;
      
      if (fallbackKey && (response.status >= 500 || response.status === 429)) {
        console.log(`Provider returned ${response.status}, attempting fallback to ${fallbackProvider}...`);
        const fallbackModel = getModelForProvider(agentConfig.model, fallbackProvider);
        
        let fallbackResponse: Response;
        if (fallbackProvider === 'openai') {
          fallbackResponse = await callOpenAI(fullMessages, fallbackModel, stream, fallbackKey);
        } else {
          fallbackResponse = await callLovableAI(fullMessages, fallbackModel, stream, fallbackKey);
        }
        
        if (fallbackResponse.ok) {
          console.log(`Fallback to ${fallbackProvider} successful`);
          response = fallbackResponse;
        }
      }
      
      if (!response.ok) {
        // Log failure
        await supabase.from('ai_execution_logs').insert({
          execution_type: agentType,
          status: 'failed',
          error_message: `HTTP ${response.status}: ${errorText}`,
          duration_ms: Date.now() - startTime,
          metadata: { provider: activeProvider, model },
        });

        // Handle rate limits
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "AI is processing many requests. Please wait a moment and try again." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "AI service quota reached. Please contact your administrator." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Trigger failsafe
        await supabase.from('ai_failsafe_events').insert({
          trigger_type: 'api_error',
          error_details: errorText,
          action_taken: 'returned_fallback',
          user_friendly_message: 'Our AI is optimizing. Please try again shortly.',
          ai_disabled: false,
        });

        return new Response(
          JSON.stringify({ 
            error: "Our AI is optimizing. Please try again shortly.",
            fallback: true 
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // For streaming responses
    if (stream) {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // Non-streaming response
    const data = await response.json();
    const duration = Date.now() - startTime;
    
    // Log successful execution
    await supabase.from('ai_execution_logs').insert({
      execution_type: agentType,
      status: 'completed',
      duration_ms: duration,
      tokens_input: data.usage?.prompt_tokens,
      tokens_output: data.usage?.completion_tokens,
      cost: ((data.usage?.prompt_tokens || 0) * 0.00001) + ((data.usage?.completion_tokens || 0) * 0.00003),
      input_summary: messages[messages.length - 1]?.content?.substring(0, 100),
      output_summary: data.choices?.[0]?.message?.content?.substring(0, 100),
      metadata: { provider: activeProvider, model },
    });

    return new Response(JSON.stringify({ ...data, provider: activeProvider, model }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI Router Error:", error);
    
    // STATIC FALLBACK MODE - When ALL AI providers fail
    // Return pre-defined helpful responses so system never breaks
    const staticFallbacks: Record<string, string> = {
      support_ai: "I'm currently in maintenance mode. For immediate help, please contact our support team or check our FAQ section.",
      lead_ai: "Lead analysis is temporarily paused. Your lead has been saved and will be processed shortly.",
      seo_ai: "SEO suggestions are being optimized. Your content has been queued for analysis.",
      auto_development: "Development AI is updating. Please describe your requirements and a team member will assist you.",
      incident_ai: "System monitoring is active. All metrics are being logged for review.",
      recovery_ai: "Auto-recovery is standing by. Manual intervention may be required.",
      cost_ai: "Cost analysis will resume shortly. Current usage is being tracked.",
      hr_ai: "HR assistant is updating. Your query has been logged for review.",
      internal_ai: "Internal assistant is in maintenance. Please contact your manager for urgent queries.",
    };
    
    const agentType = (await req.json().catch(() => ({}))).agentType || 'support_ai';
    const fallbackMessage = staticFallbacks[agentType] || staticFallbacks.support_ai;
    
    // Log failsafe activation
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        await supabase.from('ai_failsafe_events').insert({
          trigger_type: 'total_failure',
          error_details: error instanceof Error ? error.message : 'Unknown error',
          action_taken: 'static_fallback_activated',
          user_friendly_message: fallbackMessage,
          fallback_mode: 'static',
          ai_disabled: false,
          user_impacted: false,
        });
      } catch (_logError) {
        // Silent fail for logging
      }
    }
    
    return new Response(
      JSON.stringify({ 
        error: false,
        fallback: true,
        static_mode: true,
        message: fallbackMessage,
        choices: [{
          message: {
            role: "assistant",
            content: fallbackMessage
          }
        }]
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
