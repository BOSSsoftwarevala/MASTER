import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Priority countries for SEO focus
const PRIORITY_REGIONS = {
  africa: ['ng', 'ke', 'za', 'gh', 'eg', 'tz', 'ug', 'et'],
  asia: ['in', 'pk', 'bd', 'id', 'ph', 'vn', 'th', 'my'],
  middle_east: ['ae', 'sa', 'qa', 'kw', 'bh', 'om', 'jo', 'lb'],
  europe: ['gb', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'se'],
  americas: ['us', 'ca', 'mx', 'br', 'ar', 'co', 'cl', 'pe'],
};

const COUNTRY_CONFIG: Record<string, { name: string; language: string; currency: string; lowBandwidth: boolean }> = {
  'in': { name: 'India', language: 'en', currency: 'INR', lowBandwidth: false },
  'ae': { name: 'United Arab Emirates', language: 'en', currency: 'AED', lowBandwidth: false },
  'ng': { name: 'Nigeria', language: 'en', currency: 'NGN', lowBandwidth: true },
  'ke': { name: 'Kenya', language: 'en', currency: 'KES', lowBandwidth: true },
  'sa': { name: 'Saudi Arabia', language: 'ar', currency: 'SAR', lowBandwidth: false },
  'pk': { name: 'Pakistan', language: 'en', currency: 'PKR', lowBandwidth: false },
  'bd': { name: 'Bangladesh', language: 'en', currency: 'BDT', lowBandwidth: true },
  'eg': { name: 'Egypt', language: 'ar', currency: 'EGP', lowBandwidth: false },
  'za': { name: 'South Africa', language: 'en', currency: 'ZAR', lowBandwidth: false },
  'gh': { name: 'Ghana', language: 'en', currency: 'GHS', lowBandwidth: true },
  'us': { name: 'United States', language: 'en', currency: 'USD', lowBandwidth: false },
  'gb': { name: 'United Kingdom', language: 'en', currency: 'GBP', lowBandwidth: false },
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

    // Route to appropriate handler
    switch (action) {
      case 'generate_keywords':
        return await generateKeywords(supabase, LOVABLE_API_KEY, data);
      case 'generate_meta':
        return await generateMeta(supabase, LOVABLE_API_KEY, data);
      case 'create_country_page':
        return await createCountryPage(supabase, LOVABLE_API_KEY, data);
      case 'analyze_opportunities':
        return await analyzeOpportunities(supabase, LOVABLE_API_KEY, data);
      case 'get_dashboard_stats':
        return await getDashboardStats(supabase);
      case 'auto_suggest_location':
        return await autoSuggestLocation(supabase, LOVABLE_API_KEY, data);
      case 'auto_suggest_keywords':
        return await autoSuggestKeywords(supabase, LOVABLE_API_KEY, data);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('AI SEO Engine error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Generate keywords for a specific country/niche
async function generateKeywords(
  supabase: any, 
  apiKey: string, 
  data: { country_code: string; niche: string; count?: number }
) {
  const countryConfig = COUNTRY_CONFIG[data.country_code] || { name: data.country_code, language: 'en' };
  
  const prompt = `Generate ${data.count || 10} high-value SEO keywords for the software/SaaS niche "${data.niche}" targeting ${countryConfig.name}. 
Focus on:
- Local search intent
- Business software needs
- Local language terms if applicable (${countryConfig.language})
- Low competition, high intent keywords

Return as JSON array with: keyword, estimated_volume (low/medium/high), difficulty (1-100), intent (informational/transactional/navigational)`;

  const response = await callLovableAI(apiKey, prompt);
  
  // Parse and store keywords
  try {
    const keywords = JSON.parse(extractJSON(response));
    
    for (const kw of keywords) {
      await supabase.from('seo_keywords').insert({
        keyword: kw.keyword,
        country_code: data.country_code,
        language_code: countryConfig.language,
        search_volume: kw.estimated_volume === 'high' ? 5000 : kw.estimated_volume === 'medium' ? 1000 : 100,
        difficulty_score: kw.difficulty,
        status: 'discovered',
        ai_suggested: true,
      });
    }

    // Log the task
    await supabase.from('seo_ai_tasks').insert({
      task_type: 'generate_keywords',
      target_country: data.country_code,
      status: 'completed',
      ai_input: data,
      ai_output: { keywords },
      executed_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, keywords }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Failed to parse keywords:', e);
    return new Response(JSON.stringify({ success: false, raw: response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Generate meta title and description
async function generateMeta(
  supabase: any, 
  apiKey: string, 
  data: { country_code: string; page_type: string; keywords: string[] }
) {
  const countryConfig = COUNTRY_CONFIG[data.country_code] || { name: data.country_code, language: 'en', currency: 'USD' };
  
  const prompt = `Generate SEO-optimized meta title and description for a software marketplace page targeting ${countryConfig.name}.

Page type: ${data.page_type}
Target keywords: ${data.keywords.join(', ')}
Currency: ${countryConfig.currency}

Requirements:
- Meta title: Max 60 characters, include primary keyword
- Meta description: Max 160 characters, include CTA with local currency
- Include FAQ schema with 3-5 questions

Return as JSON: { meta_title, meta_description, faq_schema: [{ question, answer }] }`;

  const response = await callLovableAI(apiKey, prompt);
  
  try {
    const meta = JSON.parse(extractJSON(response));
    
    return new Response(JSON.stringify({ success: true, meta }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Failed to parse meta:', e);
    return new Response(JSON.stringify({ success: false, raw: response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Create a country-specific landing page
async function createCountryPage(
  supabase: any, 
  apiKey: string, 
  data: { country_code: string }
) {
  const countryConfig = COUNTRY_CONFIG[data.country_code];
  
  if (!countryConfig) {
    throw new Error(`Unknown country code: ${data.country_code}`);
  }

  // Generate meta and keywords
  const prompt = `Create a complete SEO-optimized country page for Software Vala targeting ${countryConfig.name}.

Generate:
1. Meta title (max 60 chars) including "Software Vala" and country
2. Meta description (max 160 chars) with local appeal
3. 5-10 target keywords
4. FAQ schema with 5 common questions about software solutions in ${countryConfig.name}

Currency: ${countryConfig.currency}
Language: ${countryConfig.language}

Return as JSON: { meta_title, meta_description, keywords: [], faq_schema: [{ question, answer }] }`;

  const response = await callLovableAI(apiKey, prompt);
  
  try {
    const pageData = JSON.parse(extractJSON(response));
    
    // Insert country page
    const { data: page, error } = await supabase.from('seo_country_pages').upsert({
      country_code: data.country_code,
      country_name: countryConfig.name,
      language_code: countryConfig.language,
      slug: `/${data.country_code}`,
      meta_title: pageData.meta_title,
      meta_description: pageData.meta_description,
      keywords: pageData.keywords,
      faq_schema: pageData.faq_schema,
      currency_code: countryConfig.currency,
      is_active: true,
      low_bandwidth_mode: countryConfig.lowBandwidth,
    }, { onConflict: 'country_code,language_code' });

    if (error) throw error;

    // Create alert
    await supabase.from('seo_alerts').insert({
      alert_type: 'country_page_created',
      title: `New country page created: ${countryConfig.name}`,
      description: `Auto-generated SEO-optimized landing page for ${countryConfig.name} market`,
      country_code: data.country_code,
      priority: 'low',
      metadata: pageData,
    });

    return new Response(JSON.stringify({ success: true, page: pageData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Failed to create country page:', e);
    return new Response(JSON.stringify({ success: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Analyze SEO opportunities
async function analyzeOpportunities(
  supabase: any, 
  apiKey: string, 
  data: { focus_regions?: string[] }
) {
  const regionsToAnalyze = data.focus_regions || ['africa', 'asia', 'middle_east'];
  const countryCodes = regionsToAnalyze.flatMap(r => PRIORITY_REGIONS[r as keyof typeof PRIORITY_REGIONS] || []);

  const prompt = `Analyze SEO opportunities for a B2B software marketplace expanding into these priority markets: ${countryCodes.join(', ')}.

For each country, identify:
1. Top 3 keyword opportunities
2. Content gaps
3. Local competition level (low/medium/high)
4. Recommended actions

Focus on emerging markets with high growth potential.

Return as JSON array: [{ country_code, opportunities: [{ type, description, priority, action }] }]`;

  const response = await callLovableAI(apiKey, prompt);
  
  try {
    const opportunities = JSON.parse(extractJSON(response));
    
    // Create alerts for high-priority opportunities
    for (const country of opportunities) {
      for (const opp of country.opportunities) {
        if (opp.priority === 'high') {
          await supabase.from('seo_alerts').insert({
            alert_type: 'opportunity_detected',
            title: `${opp.type} opportunity in ${country.country_code.toUpperCase()}`,
            description: opp.description,
            country_code: country.country_code,
            priority: 'high',
            metadata: opp,
          });
        }
      }
    }

    return new Response(JSON.stringify({ success: true, opportunities }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Failed to analyze opportunities:', e);
    return new Response(JSON.stringify({ success: false, raw: response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Get dashboard statistics
async function getDashboardStats(supabase: any) {
  const [
    { count: countryPages },
    { count: keywords },
    { count: tasks },
    { data: alerts },
  ] = await Promise.all([
    supabase.from('seo_country_pages').select('*', { count: 'exact', head: true }),
    supabase.from('seo_keywords').select('*', { count: 'exact', head: true }),
    supabase.from('seo_ai_tasks').select('*', { count: 'exact', head: true }),
    supabase.from('seo_alerts').select('*').eq('is_read', false).limit(10),
  ]);

  return new Response(JSON.stringify({
    success: true,
    stats: {
      country_pages: countryPages || 0,
      keywords: keywords || 0,
      tasks_completed: tasks || 0,
      pending_alerts: alerts?.length || 0,
      alerts: alerts || [],
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// REGION PRESETS for keyword generation
const REGION_KEYWORD_PRESETS: Record<string, { keywords: string[]; tone: string; focus: string[] }> = {
  africa: {
    keywords: ['low cost', 'offline', 'demo', 'whatsapp', 'mobile', 'simple'],
    tone: 'Friendly, WhatsApp-first, emphasize affordability',
    focus: ['offline capability', 'low bandwidth', 'mobile-first', 'WhatsApp integration'],
  },
  middle_east: {
    keywords: ['enterprise', 'solution', 'company', 'trusted', 'arabic'],
    tone: 'Formal, trust-focused, company profile emphasis',
    focus: ['enterprise grade', 'Arabic support', 'regional compliance', 'established brand'],
  },
  asia: {
    keywords: ['trial', 'demo', 'easy', 'price', 'fast', 'comparison'],
    tone: 'Price and speed focused, feature comparison',
    focus: ['competitive pricing', 'quick setup', 'feature comparison', 'demo availability'],
  },
};

// Auto-suggest best location for targeting
async function autoSuggestLocation(
  supabase: any,
  apiKey: string,
  data: { niche?: string }
) {
  const allCountries = Object.entries(COUNTRY_CONFIG).map(([code, info]) => ({
    code,
    ...info,
    region: Object.entries(PRIORITY_REGIONS).find(([_, codes]) => codes.includes(code))?.[0] || 'other',
  }));

  const prompt = `You are an expert SEO and market analyst. Analyze the best locations to target for a B2B software company${data.niche ? ` in the ${data.niche} niche` : ''}.

Available markets: ${JSON.stringify(allCountries)}

Evaluate each location based on:
1. Search volume potential (estimated)
2. Competition level (low/medium/high)
3. Cost per click estimate (low/medium/high)
4. Buyer intent strength (1-100)
5. Local purchasing power
6. Market growth potential

Return JSON with:
{
  "tier1": { "country_code": "xx", "country_name": "Name", "city": "Best City", "best_time_local": "9am-12pm", "reason": "Why this is best", "search_volume": "high", "competition": "low", "cpc": "low", "buyer_intent": 85, "estimated_leads_month": 150 },
  "tier2": { "country_code": "xx", "country_name": "Name", "city": "Best City", "reason": "Backup choice reason", "search_volume": "medium", "competition": "low", "cpc": "low", "buyer_intent": 75, "estimated_leads_month": 80 },
  "tier3": { "country_code": "xx", "country_name": "Name", "city": "Best City", "reason": "Test market reason", "search_volume": "medium", "competition": "medium", "cpc": "medium", "buyer_intent": 60, "estimated_leads_month": 40 },
  "analysis_summary": "Brief explanation of the analysis methodology"
}

Focus on emerging markets with high growth potential and low competition. Prioritize Africa, Asia, and Middle East.`;

  const response = await callLovableAI(apiKey, prompt);

  try {
    const result = JSON.parse(extractJSON(response));

    // Log the task
    await supabase.from('seo_ai_tasks').insert({
      task_type: 'auto_suggest_location',
      status: 'completed',
      ai_input: data,
      ai_output: result,
      executed_at: new Date().toISOString(),
    });

    // Create insight alert for tier1
    await supabase.from('ai_daily_insights').insert({
      insight_type: 'location_suggestion',
      title: `Best Location: ${result.tier1?.country_name || 'Unknown'}`,
      description: result.tier1?.reason || 'AI-suggested optimal location for targeting',
      country_code: result.tier1?.country_code,
      region: Object.entries(PRIORITY_REGIONS).find(([_, codes]) => codes.includes(result.tier1?.country_code))?.[0],
      priority: 'high',
      metadata: result,
    });

    return new Response(JSON.stringify({ success: true, ...result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Failed to parse location suggestions:', e);
    return new Response(JSON.stringify({ success: false, raw: response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Auto-suggest best keywords with scoring
async function autoSuggestKeywords(
  supabase: any,
  apiKey: string,
  data: { country_code?: string; niche?: string }
) {
  const countryCode = data.country_code || 'global';
  const countryConfig = COUNTRY_CONFIG[countryCode];
  const region = Object.entries(PRIORITY_REGIONS).find(([_, codes]) => codes.includes(countryCode))?.[0] || 'global';
  const regionPreset = REGION_KEYWORD_PRESETS[region] || REGION_KEYWORD_PRESETS.asia;

  const prompt = `You are an expert SEO keyword strategist. Generate the TOP 10 best keywords for a B2B software marketplace${data.niche ? ` in the ${data.niche} niche` : ''} targeting ${countryConfig?.name || 'global markets'}.

Region: ${region}
Region focus: ${regionPreset.focus.join(', ')}
Tone preference: ${regionPreset.tone}
Suggested terms to include: ${regionPreset.keywords.join(', ')}

Generate keywords in 4 categories:
1. PRIMARY (High intent, ready to buy)
2. LOCALIZED (Country/region specific)
3. LOW_COMPETITION (Golden opportunities)
4. LONG_TAIL (Auto-close potential)

For each keyword, provide:
- keyword: the search term
- category: PRIMARY/LOCALIZED/LOW_COMPETITION/LONG_TAIL
- intent_score: 0-100 (buyer intent)
- competition: low/medium/high
- estimated_leads_month: number
- conversion_probability: percentage string like "15%"

Return JSON:
{
  "keywords": [
    { "keyword": "example", "category": "PRIMARY", "intent_score": 85, "competition": "low", "estimated_leads_month": 50, "conversion_probability": "12%" }
  ],
  "top_10_selected": ["keyword1", "keyword2", ...],
  "region_strategy": "Brief strategy explanation for this region",
  "expected_total_leads": number
}

Only return the TOP 10 best keywords based on intent + low competition + conversion potential.`;

  const response = await callLovableAI(apiKey, prompt);

  try {
    const result = JSON.parse(extractJSON(response));

    // Store top keywords in database
    for (const kw of result.keywords || []) {
      await supabase.from('seo_keywords').insert({
        keyword: kw.keyword,
        country_code: countryCode,
        language_code: countryConfig?.language || 'en',
        search_volume: kw.estimated_leads_month * 100, // rough estimate
        difficulty_score: kw.competition === 'low' ? 20 : kw.competition === 'medium' ? 50 : 80,
        status: 'ai_suggested',
        ai_suggested: true,
      }).select().maybeSingle(); // ignore duplicates
    }

    // Log the task
    await supabase.from('seo_ai_tasks').insert({
      task_type: 'auto_suggest_keywords',
      target_country: countryCode,
      status: 'completed',
      ai_input: data,
      ai_output: result,
      executed_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, ...result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Failed to parse keyword suggestions:', e);
    return new Response(JSON.stringify({ success: false, raw: response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
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
          content: "You are an expert SEO strategist specializing in global B2B software markets. Always respond with valid JSON when asked." 
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
  // Try to find JSON in the response
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  return text;
}
