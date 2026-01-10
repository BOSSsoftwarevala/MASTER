import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Region configuration
const REGION_CONFIG: Record<string, { 
  name: string; 
  tone: string; 
  primaryChannel: string;
  languages: string[];
  botPrefix: string;
}> = {
  africa: {
    name: 'Africa',
    tone: 'friendly, warm, fast reply',
    primaryChannel: 'whatsapp',
    languages: ['en', 'fr', 'sw'],
    botPrefix: 'SV-AI-AFR',
  },
  asia: {
    name: 'Asia',
    tone: 'feature-focused, price comparison, detailed',
    primaryChannel: 'whatsapp',
    languages: ['en', 'hi', 'bn', 'ur'],
    botPrefix: 'SV-AI-ASI',
  },
  middle_east: {
    name: 'Middle East',
    tone: 'formal, trust-building, company profile focus',
    primaryChannel: 'email',
    languages: ['ar', 'en'],
    botPrefix: 'SV-AI-MEA',
  },
  europe: {
    name: 'Europe',
    tone: 'professional, GDPR-conscious, concise',
    primaryChannel: 'email',
    languages: ['en', 'de', 'fr', 'es'],
    botPrefix: 'SV-AI-EUR',
  },
  americas: {
    name: 'Americas',
    tone: 'direct, solution-focused, ROI-oriented',
    primaryChannel: 'email',
    languages: ['en', 'es', 'pt'],
    botPrefix: 'SV-AI-AME',
  },
};

const COUNTRY_TO_REGION: Record<string, string> = {
  'ng': 'africa', 'ke': 'africa', 'za': 'africa', 'gh': 'africa', 'eg': 'africa',
  'tz': 'africa', 'ug': 'africa', 'et': 'africa',
  'in': 'asia', 'pk': 'asia', 'bd': 'asia', 'id': 'asia', 'ph': 'asia',
  'vn': 'asia', 'th': 'asia', 'my': 'asia',
  'ae': 'middle_east', 'sa': 'middle_east', 'qa': 'middle_east', 'kw': 'middle_east',
  'bh': 'middle_east', 'om': 'middle_east', 'jo': 'middle_east', 'lb': 'middle_east',
  'gb': 'europe', 'de': 'europe', 'fr': 'europe', 'es': 'europe', 'it': 'europe',
  'us': 'americas', 'ca': 'americas', 'mx': 'americas', 'br': 'americas',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    switch (action) {
      case 'process_lead':
        return await processLead(supabase, LOVABLE_API_KEY, data);
      case 'score_lead':
        return await scoreLead(supabase, LOVABLE_API_KEY, data);
      case 'generate_response':
        return await generateResponse(supabase, LOVABLE_API_KEY, data);
      case 'get_dashboard_stats':
        return await getDashboardStats(supabase);
      case 'get_daily_insights':
        return await getDailyInsights(supabase, LOVABLE_API_KEY);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('AI Lead Engine error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Process incoming lead from any channel
async function processLead(
  supabase: any, 
  apiKey: string, 
  data: {
    channel: string;
    message: string;
    contact_name?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_company?: string;
    source_country?: string;
  }
) {
  const region = data.source_country ? COUNTRY_TO_REGION[data.source_country] || 'asia' : 'asia';
  const regionConfig = REGION_CONFIG[region];

  // AI analysis prompt
  const prompt = `Analyze this incoming lead message and extract key information.

Message: "${data.message}"
Channel: ${data.channel}
Region: ${regionConfig.name}

Extract and return as JSON:
{
  "intent": "purchase|demo|pricing|support|general",
  "urgency": "high|medium|low",
  "budget_hints": "detected budget keywords or null",
  "company_size_hint": "enterprise|mid|small|unknown",
  "language": "detected language code",
  "summary": "1-2 sentence summary",
  "next_step": "recommended action",
  "key_interests": ["list of product interests"]
}`;

  const aiResponse = await callLovableAI(apiKey, prompt);
  
  try {
    const analysis = JSON.parse(extractJSON(aiResponse));
    
    // Calculate score
    const score = calculateLeadScore(analysis, data.channel, region);
    const temperature = score >= 70 ? 'hot' : score >= 40 ? 'warm' : 'cold';
    const aiAction = determineAction(score, analysis.intent);

    // Insert lead
    const { data: lead, error } = await supabase.from('ai_leads').insert({
      channel: data.channel,
      source_country: data.source_country,
      source_region: region,
      language_detected: analysis.language || 'en',
      contact_name: data.contact_name,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      contact_company: data.contact_company,
      raw_message: data.message,
      ai_intent: analysis.intent,
      ai_score: score,
      ai_temperature: temperature,
      ai_action: aiAction,
      ai_summary: analysis.summary,
      ai_next_step: analysis.next_step,
      territory_code: data.source_country,
      status: 'new',
    }).select().single();

    if (error) throw error;

    // Store the inbound message
    await supabase.from('ai_lead_messages').insert({
      lead_id: lead.id,
      direction: 'inbound',
      channel: data.channel,
      message_content: data.message,
      ai_generated: false,
    });

    // Generate auto-response if hot/warm lead
    let autoResponse = null;
    if (temperature !== 'cold') {
      autoResponse = await generateAutoResponse(apiKey, lead, regionConfig);
      
      // Store the outbound message
      await supabase.from('ai_lead_messages').insert({
        lead_id: lead.id,
        direction: 'outbound',
        channel: data.channel,
        message_content: autoResponse,
        ai_generated: true,
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      lead,
      analysis,
      score,
      temperature,
      action: aiAction,
      auto_response: autoResponse,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Failed to process lead:', e);
    return new Response(JSON.stringify({ success: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Score a lead
async function scoreLead(
  supabase: any, 
  apiKey: string, 
  data: { lead_id: string }
) {
  const { data: lead, error } = await supabase
    .from('ai_leads')
    .select('*')
    .eq('id', data.lead_id)
    .single();

  if (error || !lead) {
    throw new Error('Lead not found');
  }

  const prompt = `Re-evaluate this lead and provide updated scoring.

Lead info:
- Message: ${lead.raw_message}
- Channel: ${lead.channel}
- Region: ${lead.source_region}
- Current score: ${lead.ai_score}
- Status: ${lead.status}

Provide updated JSON:
{
  "score": 0-100,
  "temperature": "hot|warm|cold",
  "action": "demo|call|nurture|ignore",
  "reason": "explanation"
}`;

  const aiResponse = await callLovableAI(apiKey, prompt);
  
  try {
    const result = JSON.parse(extractJSON(aiResponse));
    
    await supabase.from('ai_leads').update({
      ai_score: result.score,
      ai_temperature: result.temperature,
      ai_action: result.action,
    }).eq('id', data.lead_id);

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Failed to score lead:', e);
    return new Response(JSON.stringify({ success: false, raw: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Generate AI response for a lead
async function generateResponse(
  supabase: any, 
  apiKey: string, 
  data: { lead_id: string; context?: string }
) {
  const { data: lead, error } = await supabase
    .from('ai_leads')
    .select('*')
    .eq('id', data.lead_id)
    .single();

  if (error || !lead) {
    throw new Error('Lead not found');
  }

  const regionConfig = REGION_CONFIG[lead.source_region] || REGION_CONFIG.asia;
  const response = await generateAutoResponse(apiKey, lead, regionConfig, data.context);

  // Store the response
  await supabase.from('ai_lead_messages').insert({
    lead_id: lead.id,
    direction: 'outbound',
    channel: lead.channel,
    message_content: response,
    ai_generated: true,
  });

  return new Response(JSON.stringify({ success: true, response }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Get dashboard statistics
async function getDashboardStats(supabase: any) {
  const [
    { count: totalLeads },
    { count: hotLeads },
    { count: warmLeads },
    { count: newLeads },
    { data: recentLeads },
    { data: insights },
  ] = await Promise.all([
    supabase.from('ai_leads').select('*', { count: 'exact', head: true }).eq('is_deleted', false),
    supabase.from('ai_leads').select('*', { count: 'exact', head: true }).eq('ai_temperature', 'hot').eq('is_deleted', false),
    supabase.from('ai_leads').select('*', { count: 'exact', head: true }).eq('ai_temperature', 'warm').eq('is_deleted', false),
    supabase.from('ai_leads').select('*', { count: 'exact', head: true }).eq('status', 'new').eq('is_deleted', false),
    supabase.from('ai_leads').select('*').eq('is_deleted', false).order('created_at', { ascending: false }).limit(10),
    supabase.from('ai_daily_insights').select('*').eq('is_dismissed', false).order('created_at', { ascending: false }).limit(5),
  ]);

  // Channel breakdown
  const { data: channelStats } = await supabase
    .from('ai_leads')
    .select('channel')
    .eq('is_deleted', false);
  
  const channelBreakdown: Record<string, number> = {};
  channelStats?.forEach((l: any) => {
    channelBreakdown[l.channel] = (channelBreakdown[l.channel] || 0) + 1;
  });

  // Region breakdown
  const { data: regionStats } = await supabase
    .from('ai_leads')
    .select('source_region')
    .eq('is_deleted', false);
  
  const regionBreakdown: Record<string, number> = {};
  regionStats?.forEach((l: any) => {
    if (l.source_region) {
      regionBreakdown[l.source_region] = (regionBreakdown[l.source_region] || 0) + 1;
    }
  });

  return new Response(JSON.stringify({
    success: true,
    stats: {
      total_leads: totalLeads || 0,
      hot_leads: hotLeads || 0,
      warm_leads: warmLeads || 0,
      new_leads: newLeads || 0,
      channel_breakdown: channelBreakdown,
      region_breakdown: regionBreakdown,
      recent_leads: recentLeads || [],
      insights: insights || [],
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Generate daily insights
async function getDailyInsights(supabase: any, apiKey: string) {
  // Get lead stats for analysis
  const { data: leads } = await supabase
    .from('ai_leads')
    .select('source_country, source_region, ai_temperature, created_at, is_responded')
    .eq('is_deleted', false)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  const prompt = `Analyze these lead statistics and generate 3-5 actionable AI insights for a B2B software company.

Lead data (last 7 days):
${JSON.stringify(leads?.slice(0, 50))}

Generate insights like:
- "High demand detected in {country}"
- "Franchise response slow – reroute?"
- "New opportunity in {region}"

Return as JSON array:
[{ "type": "high_demand|slow_response|opportunity|competitor_gap", "title": "...", "description": "...", "country_code": "xx", "region": "...", "priority": "high|medium|low" }]`;

  const aiResponse = await callLovableAI(apiKey, prompt);
  
  try {
    const insights = JSON.parse(extractJSON(aiResponse));
    
    // Store insights
    for (const insight of insights) {
      await supabase.from('ai_daily_insights').insert({
        insight_type: insight.type,
        title: insight.title,
        description: insight.description,
        country_code: insight.country_code,
        region: insight.region,
        priority: insight.priority,
        metadata: insight,
      });
    }

    return new Response(JSON.stringify({ success: true, insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Failed to generate insights:', e);
    return new Response(JSON.stringify({ success: false, raw: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Helper: Calculate lead score
function calculateLeadScore(
  analysis: any, 
  channel: string, 
  region: string
): number {
  let score = 30; // Base score

  // Intent scoring
  if (analysis.intent === 'purchase') score += 30;
  else if (analysis.intent === 'demo') score += 25;
  else if (analysis.intent === 'pricing') score += 20;
  else if (analysis.intent === 'support') score += 5;

  // Urgency
  if (analysis.urgency === 'high') score += 20;
  else if (analysis.urgency === 'medium') score += 10;

  // Budget hints
  if (analysis.budget_hints) score += 10;

  // Company size
  if (analysis.company_size_hint === 'enterprise') score += 15;
  else if (analysis.company_size_hint === 'mid') score += 10;
  else if (analysis.company_size_hint === 'small') score += 5;

  // Channel bonus (priority regions prefer certain channels)
  const regionConfig = REGION_CONFIG[region];
  if (regionConfig && channel === regionConfig.primaryChannel) {
    score += 5;
  }

  return Math.min(100, Math.max(0, score));
}

// Helper: Determine action based on score
function determineAction(score: number, intent: string): string {
  if (score >= 70) return 'demo';
  if (score >= 50) return 'call';
  if (score >= 30) return 'nurture';
  return 'ignore';
}

// Helper: Generate auto-response
async function generateAutoResponse(
  apiKey: string, 
  lead: any, 
  regionConfig: any,
  additionalContext?: string
): Promise<string> {
  const prompt = `Generate a professional response for this lead.

Lead message: "${lead.raw_message}"
Region: ${regionConfig.name}
Tone: ${regionConfig.tone}
Temperature: ${lead.ai_temperature}
Intent: ${lead.ai_intent}
Bot identity: ${regionConfig.botPrefix}-${Math.random().toString(36).substring(7).toUpperCase()}

${additionalContext ? `Additional context: ${additionalContext}` : ''}

Requirements:
- Use the specified tone for this region
- Keep it concise (2-3 sentences max)
- Include a clear next step
- Do NOT use human names, use bot identity format
- Be helpful and professional

Generate ONLY the response text, no JSON.`;

  const response = await callLovableAI(apiKey, prompt);
  return response.trim();
}

// Helper: Call Lovable AI
async function callLovableAI(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { 
          role: "system", 
          content: "You are an expert lead qualification and sales AI for a B2B software company. Always be helpful, professional, and concise." 
        },
        { role: "user", content: prompt }
      ],
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    if (response.status === 402) {
      throw new Error("Payment required. Please add credits to your workspace.");
    }
    throw new Error(`AI gateway error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// Helper: Extract JSON from AI response
function extractJSON(text: string): string {
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  return text;
}
