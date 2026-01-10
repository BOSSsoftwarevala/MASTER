import { useState, useEffect } from 'react';
import { UltraLuxuryLayout } from '@/components/layout/UltraLuxuryLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserRoles } from '@/hooks/useUserRoles';
import {
  Globe,
  Search,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Languages,
  Target,
  Brain,
  Sparkles,
  RefreshCw,
  FileText,
  BarChart3,
  Play,
  Eye,
  Navigation,
  Trophy,
  Crosshair,
  Clock,
  DollarSign,
  Users,
  ChevronRight,
  Flame,
  Rocket,
  Star,
  MessageCircle,
  Lock,
} from 'lucide-react';

// AI-VERIFIED MARKET DATA (LOCKED)
interface MarketData {
  code: string;
  name: string;
  flag: string;
  budget: number;
  costPerLead: { min: number; max: number };
  competition: 'LOW' | 'MEDIUM' | 'HIGH';
  bestCities: string[];
  languages: string[];
  verdict: 'BEST' | 'GOOD' | 'HIGH VALUE' | 'TEST';
  platforms: string[];
}

const AI_VERIFIED_MARKETS: Record<string, MarketData[]> = {
  africa: [
    { code: 'ng', name: 'Nigeria', flag: '🇳🇬', budget: 120, costPerLead: { min: 0.8, max: 1.5 }, competition: 'MEDIUM', bestCities: ['Lagos', 'Abuja', 'Port Harcourt'], languages: ['English'], verdict: 'BEST', platforms: ['SEO', 'WhatsApp', 'Google'] },
    { code: 'ke', name: 'Kenya', flag: '🇰🇪', budget: 90, costPerLead: { min: 0.6, max: 1.2 }, competition: 'LOW', bestCities: ['Nairobi', 'Mombasa'], languages: ['English', 'Swahili'], verdict: 'BEST', platforms: ['SEO', 'Facebook'] },
    { code: 'gh', name: 'Ghana', flag: '🇬🇭', budget: 80, costPerLead: { min: 0.5, max: 1.0 }, competition: 'LOW', bestCities: ['Accra', 'Kumasi'], languages: ['English'], verdict: 'BEST', platforms: ['SEO', 'WhatsApp'] },
    { code: 'za', name: 'South Africa', flag: '🇿🇦', budget: 250, costPerLead: { min: 2.5, max: 4.0 }, competition: 'HIGH', bestCities: ['Johannesburg', 'Cape Town'], languages: ['English'], verdict: 'TEST', platforms: ['Google', 'SEO'] },
  ],
  asia: [
    { code: 'in', name: 'India', flag: '🇮🇳', budget: 150, costPerLead: { min: 1.0, max: 2.0 }, competition: 'HIGH', bestCities: ['Delhi', 'Mumbai', 'Ahmedabad'], languages: ['English', 'Hindi'], verdict: 'BEST', platforms: ['SEO', 'WhatsApp', 'Google'] },
    { code: 'bd', name: 'Bangladesh', flag: '🇧🇩', budget: 70, costPerLead: { min: 0.4, max: 0.9 }, competition: 'LOW', bestCities: ['Dhaka', 'Chittagong'], languages: ['Bengali', 'English'], verdict: 'BEST', platforms: ['SEO', 'Facebook'] },
    { code: 'ph', name: 'Philippines', flag: '🇵🇭', budget: 120, costPerLead: { min: 1.2, max: 2.0 }, competition: 'MEDIUM', bestCities: ['Manila', 'Cebu'], languages: ['English'], verdict: 'GOOD', platforms: ['SEO', 'Google'] },
    { code: 'vn', name: 'Vietnam', flag: '🇻🇳', budget: 100, costPerLead: { min: 0.9, max: 1.6 }, competition: 'MEDIUM', bestCities: ['Hanoi', 'Ho Chi Minh'], languages: ['Vietnamese'], verdict: 'GOOD', platforms: ['SEO'] },
  ],
  middle_east: [
    { code: 'ae', name: 'UAE', flag: '🇦🇪', budget: 300, costPerLead: { min: 3.0, max: 6.0 }, competition: 'HIGH', bestCities: ['Dubai', 'Sharjah'], languages: ['English', 'Arabic'], verdict: 'HIGH VALUE', platforms: ['Google', 'SEO'] },
    { code: 'sa', name: 'Saudi Arabia', flag: '🇸🇦', budget: 280, costPerLead: { min: 2.8, max: 5.0 }, competition: 'HIGH', bestCities: ['Riyadh', 'Jeddah'], languages: ['Arabic', 'English'], verdict: 'HIGH VALUE', platforms: ['Google'] },
    { code: 'om', name: 'Oman', flag: '🇴🇲', budget: 160, costPerLead: { min: 1.5, max: 2.5 }, competition: 'LOW', bestCities: ['Muscat'], languages: ['Arabic', 'English'], verdict: 'BEST', platforms: ['SEO', 'WhatsApp'] },
  ],
};

const AI_GLOBAL_SUMMARY = {
  cheapestLeads: ['Kenya', 'Ghana', 'Bangladesh'],
  fastConversion: ['Nigeria', 'India', 'UAE'],
  bestFranchise: ['Nigeria', 'Kenya', 'Oman'],
  bestDemoVolume: ['India', 'Nigeria'],
  bestPremium: ['UAE', 'Saudi Arabia'],
};

interface DashboardStats {
  country_pages: number;
  keywords: number;
  tasks_completed: number;
  pending_alerts: number;
  alerts: Array<{
    id: string;
    alert_type: string;
    title: string;
    description: string;
    country_code: string;
    priority: string;
    created_at: string;
  }>;
}

interface CountryPage {
  id: string;
  country_code: string;
  country_name: string;
  language_code: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  keywords: string[];
  is_active: boolean;
  low_bandwidth_mode: boolean;
}

interface LocationSuggestion {
  country_code: string;
  country_name: string;
  city: string;
  best_time_local?: string;
  reason: string;
  search_volume: string;
  competition: string;
  cpc: string;
  buyer_intent: number;
  estimated_leads_month: number;
}

interface KeywordSuggestion {
  keyword: string;
  category: string;
  intent_score: number;
  competition: string;
  estimated_leads_month: number;
  conversion_probability: string;
}

const PRIORITY_COUNTRIES = [
  { code: 'in', name: 'India', region: 'Asia' },
  { code: 'ae', name: 'UAE', region: 'Middle East' },
  { code: 'ng', name: 'Nigeria', region: 'Africa' },
  { code: 'ke', name: 'Kenya', region: 'Africa' },
  { code: 'sa', name: 'Saudi Arabia', region: 'Middle East' },
  { code: 'pk', name: 'Pakistan', region: 'Asia' },
  { code: 'eg', name: 'Egypt', region: 'Africa' },
  { code: 'za', name: 'South Africa', region: 'Africa' },
  { code: 'gh', name: 'Ghana', region: 'Africa' },
  { code: 'bd', name: 'Bangladesh', region: 'Asia' },
];

export default function AiSeoEnginePage() {
  const { isSuperAdmin } = useUserRoles();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [countryPages, setCountryPages] = useState<CountryPage[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('in');
  
  // Auto-suggest states
  const [locationSuggestion, setLocationSuggestion] = useState<{
    tier1: LocationSuggestion | null;
    tier2: LocationSuggestion | null;
    tier3: LocationSuggestion | null;
    analysis_summary: string;
  } | null>(null);
  const [keywordSuggestions, setKeywordSuggestions] = useState<{
    keywords: KeywordSuggestion[];
    top_10_selected: string[];
    region_strategy: string;
    expected_total_leads: number;
  } | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<'africa' | 'asia' | 'middle_east'>('africa');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats from edge function
      const { data: statsData, error: statsError } = await supabase.functions.invoke('ai-seo-engine', {
        body: { action: 'get_dashboard_stats' }
      });
      
      if (statsError) throw statsError;
      if (statsData?.stats) {
        setStats(statsData.stats);
      }

      // Fetch country pages
      const { data: pages, error: pagesError } = await supabase
        .from('seo_country_pages')
        .select('*')
        .order('country_name');
      
      if (!pagesError && pages) {
        setCountryPages(pages as CountryPage[]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load SEO dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKeywords = async () => {
    if (!keywordInput.trim()) {
      toast({ title: "Error", description: "Please enter a niche/keyword topic", variant: "destructive" });
      return;
    }

    setActionLoading('keywords');
    try {
      const { data, error } = await supabase.functions.invoke('ai-seo-engine', {
        body: { 
          action: 'generate_keywords',
          data: {
            country_code: selectedCountry,
            niche: keywordInput,
            count: 10
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Keywords Generated",
        description: `Generated ${data?.keywords?.length || 0} keywords for ${selectedCountry.toUpperCase()}`,
      });
      
      setKeywordInput('');
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to generate keywords:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate keywords",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateCountryPage = async (countryCode: string) => {
    setActionLoading(`page-${countryCode}`);
    try {
      const { data, error } = await supabase.functions.invoke('ai-seo-engine', {
        body: { 
          action: 'create_country_page',
          data: { country_code: countryCode }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Country Page Created",
        description: `SEO-optimized page generated for ${countryCode.toUpperCase()}`,
      });
      
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to create country page:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create country page",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleAnalyzeOpportunities = async () => {
    setActionLoading('analyze');
    try {
      const { data, error } = await supabase.functions.invoke('ai-seo-engine', {
        body: { 
          action: 'analyze_opportunities',
          data: { focus_regions: ['africa', 'asia', 'middle_east'] }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Analysis Complete",
        description: `Found opportunities in ${data?.opportunities?.length || 0} countries`,
      });
      
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to analyze opportunities:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze opportunities",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Auto-suggest best location
  const handleAutoSuggestLocation = async () => {
    setActionLoading('location');
    try {
      const { data, error } = await supabase.functions.invoke('ai-seo-engine', {
        body: { 
          action: 'auto_suggest_location',
          data: { niche: keywordInput || 'business software' }
        }
      });

      if (error) throw error;
      
      setLocationSuggestion({
        tier1: data.tier1,
        tier2: data.tier2,
        tier3: data.tier3,
        analysis_summary: data.analysis_summary,
      });
      
      toast({
        title: "Location Analysis Complete",
        description: `Best location: ${data.tier1?.country_name || 'Unknown'}`,
      });
    } catch (error) {
      console.error('Failed to suggest location:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze locations",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Auto-suggest best keywords
  const handleAutoSuggestKeywords = async () => {
    setActionLoading('keywords-auto');
    try {
      const { data, error } = await supabase.functions.invoke('ai-seo-engine', {
        body: { 
          action: 'auto_suggest_keywords',
          data: { 
            country_code: selectedCountry,
            niche: keywordInput || 'business software'
          }
        }
      });

      if (error) throw error;
      
      setKeywordSuggestions({
        keywords: data.keywords || [],
        top_10_selected: data.top_10_selected || [],
        region_strategy: data.region_strategy || '',
        expected_total_leads: data.expected_total_leads || 0,
      });
      
      toast({
        title: "Keywords Generated",
        description: `Found ${data.keywords?.length || 0} golden keywords`,
      });
      
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to suggest keywords:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate keywords",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (!isSuperAdmin) {
    return (
      <UltraLuxuryLayout role="boss" variant="boss">
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Access Restricted</h2>
              <p className="text-[hsl(var(--luxury-icon-inactive))]">Super Admin access required</p>
            </CardContent>
          </Card>
        </div>
      </UltraLuxuryLayout>
    );
  }

  return (
    <UltraLuxuryLayout role="boss" variant="boss">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Brain className="w-7 h-7 text-[hsl(var(--luxury-icon-active))]" />
              AI SEO Engine
            </h1>
            <p className="text-[hsl(var(--luxury-icon-inactive))] text-sm mt-1">
              Global SEO automation • Africa • Asia • Middle East priority
            </p>
          </div>
          <Button
            onClick={fetchDashboardData}
            variant="outline"
            size="sm"
            className="border-[hsl(var(--luxury-active-bg))] text-[hsl(var(--luxury-icon-active))]"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 bg-[hsl(var(--luxury-active-bg))]" />
            ))
          ) : (
            <>
              <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <Globe className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats?.country_pages || 0}</p>
                    <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Country Pages</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <Target className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats?.keywords || 0}</p>
                    <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Keywords Tracked</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats?.tasks_completed || 0}</p>
                    <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">AI Tasks Run</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/20">
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats?.pending_alerts || 0}</p>
                    <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Pending Alerts</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Keyword Generator */}
          <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
                AI Keyword Generator
              </CardTitle>
              <CardDescription className="text-[hsl(var(--luxury-icon-inactive))]">
                Generate localized keywords by country
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Target Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[hsl(var(--luxury-active-bg))] text-white border-none text-sm"
                >
                  {PRIORITY_COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.region})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Niche / Topic</label>
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="e.g., CRM software, inventory management"
                  className="bg-[hsl(var(--luxury-active-bg))] border-none text-white"
                />
              </div>
              <Button
                onClick={handleGenerateKeywords}
                disabled={actionLoading === 'keywords'}
                className="w-full bg-[hsl(var(--luxury-icon-active))] hover:bg-[hsl(var(--luxury-icon-active))]/90 text-black"
              >
                {actionLoading === 'keywords' ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Generate Keywords
              </Button>
            </CardContent>
          </Card>

          {/* Country Page Generator */}
          <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
                Auto Country Pages
              </CardTitle>
              <CardDescription className="text-[hsl(var(--luxury-icon-inactive))]">
                One-click SEO-optimized landing pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {PRIORITY_COUNTRIES.map((country) => {
                    const exists = countryPages.some(p => p.country_code === country.code);
                    return (
                      <div
                        key={country.code}
                        className="flex items-center justify-between p-2 rounded-lg bg-[hsl(var(--luxury-active-bg))]"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[hsl(var(--luxury-icon-inactive))]" />
                          <span className="text-sm text-white">{country.name}</span>
                          <Badge variant="outline" className="text-xs border-[hsl(var(--luxury-icon-inactive))] text-[hsl(var(--luxury-icon-inactive))]">
                            {country.region}
                          </Badge>
                        </div>
                        {exists ? (
                          <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Live
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCreateCountryPage(country.code)}
                            disabled={actionLoading === `page-${country.code}`}
                            className="h-7 text-xs text-[hsl(var(--luxury-icon-active))]"
                          >
                            {actionLoading === `page-${country.code}` ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Play className="w-3 h-3 mr-1" />
                                Create
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
                AI Opportunity Scanner
              </CardTitle>
              <CardDescription className="text-[hsl(var(--luxury-icon-inactive))]">
                Detect keyword gaps & growth opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-[hsl(var(--luxury-active-bg))] space-y-2">
                <div className="flex items-center gap-2 text-sm text-white">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Priority Regions
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge className="bg-amber-500/20 text-amber-400">Africa</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400">Asia</Badge>
                  <Badge className="bg-purple-500/20 text-purple-400">Middle East</Badge>
                </div>
              </div>
              <Button
                onClick={handleAnalyzeOpportunities}
                disabled={actionLoading === 'analyze'}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {actionLoading === 'analyze' ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4 mr-2" />
                )}
                Run AI Analysis
              </Button>
              <p className="text-xs text-center text-[hsl(var(--luxury-icon-inactive))]">
                Scans 20+ priority markets • Detects gaps • Creates alerts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Auto-Suggest Engine Section */}
        <Separator className="bg-[hsl(var(--luxury-active-bg))]" />
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20">
              <Navigation className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">AI Location & Keyword Auto-Suggest</h2>
              <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">
                AI analyzes markets for MAX leads • LOW cost • HIGH conversion
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Auto Location Suggest Card */}
            <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  Auto Location Suggest
                </CardTitle>
                <CardDescription className="text-[hsl(var(--luxury-icon-inactive))]">
                  AI finds best country, city & timing for targeting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleAutoSuggestLocation}
                  disabled={actionLoading === 'location'}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                >
                  {actionLoading === 'location' ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Crosshair className="w-4 h-4 mr-2" />
                  )}
                  Find Best Location
                </Button>

                {locationSuggestion && locationSuggestion.tier1 && (
                  <div className="space-y-3">
                    {/* Tier 1 - Best */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-amber-400" />
                          <span className="text-sm font-semibold text-amber-400">TIER 1 - BEST</span>
                        </div>
                        <Badge className="bg-amber-500/20 text-amber-400">
                          {locationSuggestion.tier1.buyer_intent}% Intent
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-white font-semibold text-lg">
                          {locationSuggestion.tier1.country_name}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline" className="text-[hsl(var(--luxury-icon-inactive))]">
                            <MapPin className="w-3 h-3 mr-1" />
                            {locationSuggestion.tier1.city}
                          </Badge>
                          {locationSuggestion.tier1.best_time_local && (
                            <Badge variant="outline" className="text-[hsl(var(--luxury-icon-inactive))]">
                              <Clock className="w-3 h-3 mr-1" />
                              {locationSuggestion.tier1.best_time_local}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-green-400 border-green-400/30">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {locationSuggestion.tier1.cpc} CPC
                          </Badge>
                          <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                            <Users className="w-3 h-3 mr-1" />
                            ~{locationSuggestion.tier1.estimated_leads_month}/mo
                          </Badge>
                        </div>
                        <p className="text-xs text-[hsl(var(--luxury-icon-inactive))] mt-2">
                          {locationSuggestion.tier1.reason}
                        </p>
                      </div>
                    </div>

                    {/* Tier 2 & 3 */}
                    <div className="grid grid-cols-2 gap-2">
                      {locationSuggestion.tier2 && (
                        <div className="p-3 rounded-lg bg-[hsl(var(--luxury-active-bg))]">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Tier 2</span>
                          </div>
                          <p className="text-sm text-white font-medium">{locationSuggestion.tier2.country_name}</p>
                          <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">{locationSuggestion.tier2.city}</p>
                        </div>
                      )}
                      {locationSuggestion.tier3 && (
                        <div className="p-3 rounded-lg bg-[hsl(var(--luxury-active-bg))]">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Tier 3</span>
                          </div>
                          <p className="text-sm text-white font-medium">{locationSuggestion.tier3.country_name}</p>
                          <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">{locationSuggestion.tier3.city}</p>
                        </div>
                      )}
                    </div>

                    {locationSuggestion.analysis_summary && (
                      <p className="text-xs text-[hsl(var(--luxury-icon-inactive))] italic">
                        {locationSuggestion.analysis_summary}
                      </p>
                    )}

                    <Button
                      size="sm"
                      className="w-full bg-[hsl(var(--luxury-icon-active))] hover:bg-[hsl(var(--luxury-icon-active))]/90 text-black"
                    >
                      <ChevronRight className="w-4 h-4 mr-2" />
                      Apply to SEO & Ads
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Auto Keyword Suggest Card */}
            <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Auto Keyword Suggest
                </CardTitle>
                <CardDescription className="text-[hsl(var(--luxury-icon-inactive))]">
                  AI picks TOP 10 golden keywords with scoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleAutoSuggestKeywords}
                  disabled={actionLoading === 'keywords-auto'}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {actionLoading === 'keywords-auto' ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Find Golden Keywords
                </Button>

                {keywordSuggestions && keywordSuggestions.keywords.length > 0 && (
                  <div className="space-y-3">
                    {/* Expected Leads Summary */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Expected Total Leads</p>
                        <p className="text-xl font-bold text-green-400">{keywordSuggestions.expected_total_leads}/mo</p>
                      </div>
                      <div className="p-2 rounded-full bg-green-500/20">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                    </div>

                    {/* Keyword List */}
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {keywordSuggestions.keywords.map((kw, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-[hsl(var(--luxury-active-bg))] flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-white">{kw.keyword}</span>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    kw.category === 'PRIMARY' ? 'text-amber-400 border-amber-400/30' :
                                    kw.category === 'LOCALIZED' ? 'text-blue-400 border-blue-400/30' :
                                    kw.category === 'LOW_COMPETITION' ? 'text-green-400 border-green-400/30' :
                                    'text-purple-400 border-purple-400/30'
                                  }`}
                                >
                                  {kw.category}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-xs text-[hsl(var(--luxury-icon-inactive))]">
                                <span className="flex items-center gap-1">
                                  <Flame className="w-3 h-3" />
                                  {kw.intent_score}% intent
                                </span>
                                <span>~{kw.estimated_leads_month}/mo</span>
                                <span className="text-green-400">{kw.conversion_probability}</span>
                              </div>
                            </div>
                            <Badge 
                              className={`text-xs ${
                                kw.competition === 'low' ? 'bg-green-500/20 text-green-400' :
                                kw.competition === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {kw.competition}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {keywordSuggestions.region_strategy && (
                      <p className="text-xs text-[hsl(var(--luxury-icon-inactive))] italic">
                        Strategy: {keywordSuggestions.region_strategy}
                      </p>
                    )}

                    <Button
                      size="sm"
                      className="w-full bg-[hsl(var(--luxury-icon-active))] hover:bg-[hsl(var(--luxury-icon-active))]/90 text-black"
                    >
                      <ChevronRight className="w-4 h-4 mr-2" />
                      Push to SEO Module
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI-VERIFIED GLOBAL MARKETS SECTION */}
        <Separator className="bg-[hsl(var(--luxury-active-bg))]" />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                <Globe className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  AI-Verified Global Markets
                  <Lock className="w-4 h-4 text-amber-400" />
                </h2>
                <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">
                  Real budget & lead cost data • Weekly AI recalculation • Boss override only
                </p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400">LIVE READY</Badge>
          </div>

          {/* Region Tabs */}
          <div className="flex gap-2">
            {(['africa', 'asia', 'middle_east'] as const).map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegion(region)}
                className={selectedRegion === region 
                  ? 'bg-[hsl(var(--luxury-icon-active))] text-black' 
                  : 'border-[hsl(var(--luxury-active-bg))] text-[hsl(var(--luxury-icon-inactive))]'
                }
              >
                {region === 'africa' && '🌍 Africa'}
                {region === 'asia' && '🌏 Asia'}
                {region === 'middle_east' && '🌍 Middle East'}
              </Button>
            ))}
          </div>

          {/* Market Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AI_VERIFIED_MARKETS[selectedRegion].map((market) => (
              <Card key={market.code} className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
                <CardContent className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{market.flag}</span>
                      <div>
                        <p className="text-white font-semibold">{market.name}</p>
                        <div className="flex items-center gap-1">
                          <Badge 
                            className={`text-xs ${
                              market.verdict === 'BEST' ? 'bg-green-500/20 text-green-400' :
                              market.verdict === 'GOOD' ? 'bg-blue-500/20 text-blue-400' :
                              market.verdict === 'HIGH VALUE' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            {market.verdict === 'BEST' && <Star className="w-3 h-3 mr-1" />}
                            {market.verdict}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              market.competition === 'LOW' ? 'text-green-400 border-green-400/30' :
                              market.competition === 'MEDIUM' ? 'text-amber-400 border-amber-400/30' :
                              'text-red-400 border-red-400/30'
                            }`}
                          >
                            {market.competition} COMP
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Budget/mo</p>
                      <p className="text-lg font-bold text-[hsl(var(--luxury-icon-active))]">${market.budget}</p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-[hsl(var(--luxury-active-bg))]">
                      <p className="text-[hsl(var(--luxury-icon-inactive))]">Cost per Lead</p>
                      <p className="text-white font-medium">${market.costPerLead.min} – ${market.costPerLead.max}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[hsl(var(--luxury-active-bg))]">
                      <p className="text-[hsl(var(--luxury-icon-inactive))]">Languages</p>
                      <p className="text-white font-medium truncate">{market.languages.join(', ')}</p>
                    </div>
                  </div>

                  {/* Cities & Platforms */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 flex-wrap">
                      <MapPin className="w-3 h-3 text-[hsl(var(--luxury-icon-inactive))]" />
                      {market.bestCities.map((city) => (
                        <Badge key={city} variant="outline" className="text-xs text-white/70">{city}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      <Rocket className="w-3 h-3 text-[hsl(var(--luxury-icon-inactive))]" />
                      {market.platforms.map((platform) => (
                        <Badge 
                          key={platform} 
                          className={`text-xs ${
                            platform === 'WhatsApp' ? 'bg-green-500/20 text-green-400' :
                            platform === 'SEO' ? 'bg-blue-500/20 text-blue-400' :
                            platform === 'Google' ? 'bg-red-500/20 text-red-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}
                        >
                          {platform === 'WhatsApp' && <MessageCircle className="w-3 h-3 mr-1" />}
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleCreateCountryPage(market.code)}
                      disabled={actionLoading === `page-${market.code}` || countryPages.some(p => p.country_code === market.code)}
                      className="flex-1 bg-[hsl(var(--luxury-icon-active))] hover:bg-[hsl(var(--luxury-icon-active))]/90 text-black text-xs"
                    >
                      {countryPages.some(p => p.country_code === market.code) ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          SEO Live
                        </>
                      ) : actionLoading === `page-${market.code}` ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-1" />
                          Create SEO Page
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[hsl(var(--luxury-active-bg))] text-[hsl(var(--luxury-icon-inactive))] text-xs"
                    >
                      Start Leads
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Global Summary */}
          <Card className="bg-gradient-to-r from-[hsl(var(--luxury-card-bg))] to-[hsl(var(--luxury-active-bg))] border-[hsl(var(--luxury-active-bg))]">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-[hsl(var(--luxury-icon-active))]" />
                AI Global Summary
                <Badge variant="outline" className="text-xs text-amber-400 border-amber-400/30">
                  <Lock className="w-3 h-3 mr-1" />
                  LOCKED
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                <div className="p-2 rounded-lg bg-black/20">
                  <p className="text-[hsl(var(--luxury-icon-inactive))] mb-1">Cheapest Leads</p>
                  <p className="text-green-400 font-medium">{AI_GLOBAL_SUMMARY.cheapestLeads.join(', ')}</p>
                </div>
                <div className="p-2 rounded-lg bg-black/20">
                  <p className="text-[hsl(var(--luxury-icon-inactive))] mb-1">Fast Conversion</p>
                  <p className="text-blue-400 font-medium">{AI_GLOBAL_SUMMARY.fastConversion.join(', ')}</p>
                </div>
                <div className="p-2 rounded-lg bg-black/20">
                  <p className="text-[hsl(var(--luxury-icon-inactive))] mb-1">Best Franchise</p>
                  <p className="text-amber-400 font-medium">{AI_GLOBAL_SUMMARY.bestFranchise.join(', ')}</p>
                </div>
                <div className="p-2 rounded-lg bg-black/20">
                  <p className="text-[hsl(var(--luxury-icon-inactive))] mb-1">Demo Volume</p>
                  <p className="text-purple-400 font-medium">{AI_GLOBAL_SUMMARY.bestDemoVolume.join(', ')}</p>
                </div>
                <div className="p-2 rounded-lg bg-black/20">
                  <p className="text-[hsl(var(--luxury-icon-inactive))] mb-1">Premium Clients</p>
                  <p className="text-[hsl(var(--luxury-icon-active))] font-medium">{AI_GLOBAL_SUMMARY.bestPremium.join(', ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        {stats?.alerts && stats.alerts.length > 0 && (
          <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                AI Alerts & Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {stats.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-lg bg-[hsl(var(--luxury-active-bg))] flex items-start gap-3"
                    >
                      <div className={`p-2 rounded-lg ${
                        alert.priority === 'high' ? 'bg-red-500/20' :
                        alert.priority === 'medium' ? 'bg-amber-500/20' : 'bg-green-500/20'
                      }`}>
                        <AlertTriangle className={`w-4 h-4 ${
                          alert.priority === 'high' ? 'text-red-400' :
                          alert.priority === 'medium' ? 'text-amber-400' : 'text-green-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{alert.title}</span>
                          {alert.country_code && (
                            <Badge variant="outline" className="text-xs">
                              {alert.country_code.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-[hsl(var(--luxury-icon-inactive))] mt-1">
                          {alert.description}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" className="text-[hsl(var(--luxury-icon-active))]">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Footer Info */}
        <div className="text-center text-xs text-[hsl(var(--luxury-icon-inactive))] space-y-1">
          <p>AI SEO Engine • Powered by Software Vala AI</p>
          <p>AI-Verified Markets • Budgets • Lead Costs • Weekly Recalculation</p>
          <p className="text-[hsl(var(--luxury-icon-active))]">99% AI • 1% Human • LOCKED</p>
        </div>
      </div>
    </UltraLuxuryLayout>
  );
}
