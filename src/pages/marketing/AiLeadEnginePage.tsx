import { useState, useEffect } from 'react';
import { UltraLuxuryLayout } from '@/components/layout/UltraLuxuryLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserRoles } from '@/hooks/useUserRoles';
import {
  Users,
  MessageSquare,
  Mail,
  Phone,
  Send,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Globe,
  Brain,
  Sparkles,
  RefreshCw,
  ThermometerSun,
  Flame,
  Snowflake,
  MessageCircle,
  AtSign,
  Building,
  Clock,
  Target,
  Bot,
  Play,
  Lock,
  MapPin,
  Route,
  ArrowRight,
  Shield,
  Activity,
  BarChart3,
  DollarSign,
  Percent,
  GitBranch,
} from 'lucide-react';

interface DashboardStats {
  total_leads: number;
  hot_leads: number;
  warm_leads: number;
  new_leads: number;
  channel_breakdown: Record<string, number>;
  region_breakdown: Record<string, number>;
  recent_leads: any[];
  insights: any[];
}

const CHANNELS = [
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'text-green-400' },
  { id: 'telegram', name: 'Telegram', icon: Send, color: 'text-blue-400' },
  { id: 'email', name: 'Email', icon: Mail, color: 'text-purple-400' },
  { id: 'web', name: 'Web Form', icon: Globe, color: 'text-amber-400' },
];

const COUNTRIES = [
  { code: 'in', name: 'India', region: 'asia' },
  { code: 'ae', name: 'UAE', region: 'middle_east' },
  { code: 'ng', name: 'Nigeria', region: 'africa' },
  { code: 'ke', name: 'Kenya', region: 'africa' },
  { code: 'sa', name: 'Saudi Arabia', region: 'middle_east' },
  { code: 'pk', name: 'Pakistan', region: 'asia' },
  { code: 'eg', name: 'Egypt', region: 'africa' },
  { code: 'za', name: 'South Africa', region: 'africa' },
];

// AI Auto-Routing Logic (LOCKED)
interface RoutingRule {
  temperature: 'hot' | 'warm' | 'cold';
  assignment: string;
  actions: string[];
  followUp: string;
}

const AI_ROUTING_LOGIC: RoutingRule[] = [
  {
    temperature: 'hot',
    assignment: 'Country Franchise',
    actions: ['WhatsApp auto-intro sent', 'Call reminder created', 'Priority flag set'],
    followUp: 'Immediate (< 5 min)',
  },
  {
    temperature: 'warm',
    assignment: 'AI Sales Bot',
    actions: ['Demo link auto-sent', 'Follow-up scheduled', 'Nurture sequence started'],
    followUp: '24 hours',
  },
  {
    temperature: 'cold',
    assignment: 'AI Nurture Flow',
    actions: ['Email drip started', 'WhatsApp drip enabled', 'Retargeting enabled'],
    followUp: '7-day cycle',
  },
];

// Mock franchise data for demo
const FRANCHISE_DATA = [
  { id: 'f1', country: 'Nigeria', code: 'ng', leads: 45, converted: 12, rate: 27, revenue: 8500, capacity: 85 },
  { id: 'f2', country: 'Kenya', code: 'ke', leads: 32, converted: 9, rate: 28, revenue: 6200, capacity: 70 },
  { id: 'f3', country: 'India', code: 'in', leads: 78, converted: 18, rate: 23, revenue: 15400, capacity: 90 },
  { id: 'f4', country: 'UAE', code: 'ae', leads: 25, converted: 8, rate: 32, revenue: 22000, capacity: 60 },
  { id: 'f5', country: 'Saudi Arabia', code: 'sa', leads: 18, converted: 5, rate: 28, revenue: 14500, capacity: 45 },
  { id: 'f6', country: 'Ghana', code: 'gh', leads: 22, converted: 6, rate: 27, revenue: 4200, capacity: 55 },
];

export default function AiLeadEnginePage() {
  const { isSuperAdmin } = useUserRoles();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);
  
  // Simulator form
  const [simChannel, setSimChannel] = useState('whatsapp');
  const [simCountry, setSimCountry] = useState('in');
  const [simMessage, setSimMessage] = useState('');
  const [simName, setSimName] = useState('');
  const [simEmail, setSimEmail] = useState('');
  const [simResult, setSimResult] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-lead-engine', {
        body: { action: 'get_dashboard_stats' }
      });
      
      if (error) throw error;
      if (data?.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load lead dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateLead = async () => {
    if (!simMessage.trim()) {
      toast({ title: "Error", description: "Please enter a message", variant: "destructive" });
      return;
    }

    setActionLoading('simulate');
    try {
      const { data, error } = await supabase.functions.invoke('ai-lead-engine', {
        body: { 
          action: 'process_lead',
          data: {
            channel: simChannel,
            message: simMessage,
            contact_name: simName || undefined,
            contact_email: simEmail || undefined,
            source_country: simCountry,
          }
        }
      });

      if (error) throw error;
      
      setSimResult(data);
      toast({
        title: "Lead Processed",
        description: `Score: ${data.score} | Temperature: ${data.temperature}`,
      });
      
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to simulate lead:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process lead",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateInsights = async () => {
    setActionLoading('insights');
    try {
      const { data, error } = await supabase.functions.invoke('ai-lead-engine', {
        body: { action: 'get_daily_insights' }
      });

      if (error) throw error;
      
      toast({
        title: "Insights Generated",
        description: `Generated ${data?.insights?.length || 0} new insights`,
      });
      
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to generate insights:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate insights",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getTemperatureIcon = (temp: string) => {
    switch (temp) {
      case 'hot': return <Flame className="w-4 h-4 text-red-400" />;
      case 'warm': return <ThermometerSun className="w-4 h-4 text-amber-400" />;
      default: return <Snowflake className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case 'hot': return 'bg-red-500/20 text-red-400';
      case 'warm': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-blue-500/20 text-blue-400';
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
              <Bot className="w-7 h-7 text-[hsl(var(--luxury-icon-active))]" />
              AI Lead Engine
            </h1>
            <p className="text-[hsl(var(--luxury-icon-inactive))] text-sm mt-1">
              Multi-channel intake • Auto-scoring • Region routing • 99% AI
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleGenerateInsights}
              disabled={actionLoading === 'insights'}
              variant="outline"
              size="sm"
              className="border-[hsl(var(--luxury-active-bg))] text-[hsl(var(--luxury-icon-active))]"
            >
              {actionLoading === 'insights' ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Daily Insights
            </Button>
            <Button
              onClick={fetchDashboardData}
              variant="outline"
              size="sm"
              className="border-[hsl(var(--luxury-active-bg))] text-[hsl(var(--luxury-icon-inactive))]"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
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
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats?.total_leads || 0}</p>
                    <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Total Leads</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-red-500/20">
                    <Flame className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats?.hot_leads || 0}</p>
                    <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Hot Leads</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/20">
                    <ThermometerSun className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats?.warm_leads || 0}</p>
                    <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Warm Leads</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <Zap className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats?.new_leads || 0}</p>
                    <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">New Today</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Simulator */}
          <Card className="lg:col-span-2 bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Play className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
                Lead Intake Simulator
              </CardTitle>
              <CardDescription className="text-[hsl(var(--luxury-icon-inactive))]">
                Test AI lead processing from any channel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Channel</label>
                  <div className="flex gap-2">
                    {CHANNELS.map((ch) => (
                      <Button
                        key={ch.id}
                        size="sm"
                        variant={simChannel === ch.id ? 'default' : 'outline'}
                        onClick={() => setSimChannel(ch.id)}
                        className={simChannel === ch.id ? 'bg-[hsl(var(--luxury-icon-active))] text-black' : 'border-[hsl(var(--luxury-active-bg))]'}
                      >
                        <ch.icon className={`w-4 h-4 mr-1 ${simChannel === ch.id ? '' : ch.color}`} />
                        {ch.name}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Country</label>
                  <select
                    value={simCountry}
                    onChange={(e) => setSimCountry(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[hsl(var(--luxury-active-bg))] text-white border-none text-sm"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  placeholder="Contact name (optional)"
                  className="bg-[hsl(var(--luxury-active-bg))] border-none text-white"
                />
                <Input
                  value={simEmail}
                  onChange={(e) => setSimEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="bg-[hsl(var(--luxury-active-bg))] border-none text-white"
                />
              </div>
              
              <Textarea
                value={simMessage}
                onChange={(e) => setSimMessage(e.target.value)}
                placeholder="Enter lead message... e.g., 'Hi, we are a 50-person company looking for CRM software. Budget around $500/month. Need demo ASAP.'"
                className="bg-[hsl(var(--luxury-active-bg))] border-none text-white min-h-[100px]"
              />
              
              <Button
                onClick={handleSimulateLead}
                disabled={actionLoading === 'simulate'}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {actionLoading === 'simulate' ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4 mr-2" />
                )}
                Process Lead with AI
              </Button>

              {/* Result Display */}
              {simResult && (
                <div className="mt-4 p-4 rounded-lg bg-[hsl(var(--luxury-active-bg))] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white font-medium">AI Analysis Result</span>
                    <Badge className={getTemperatureColor(simResult.temperature)}>
                      {getTemperatureIcon(simResult.temperature)}
                      <span className="ml-1 capitalize">{simResult.temperature}</span>
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-white">{simResult.score}</p>
                      <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Score</p>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-white capitalize">{simResult.analysis?.intent}</p>
                      <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Intent</p>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-white capitalize">{simResult.action}</p>
                      <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Action</p>
                    </div>
                  </div>
                  {simResult.auto_response && (
                    <div className="pt-3 border-t border-[hsl(var(--luxury-icon-inactive))/20]">
                      <p className="text-xs text-[hsl(var(--luxury-icon-inactive))] mb-1">AI Auto-Response:</p>
                      <p className="text-sm text-white italic">"{simResult.auto_response}"</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Channel & Region Stats */}
          <div className="space-y-4">
            <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Channel Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {loading ? (
                  <Skeleton className="h-20 bg-[hsl(var(--luxury-active-bg))]" />
                ) : (
                  CHANNELS.map((ch) => (
                    <div key={ch.id} className="flex items-center justify-between p-2 rounded bg-[hsl(var(--luxury-active-bg))]">
                      <div className="flex items-center gap-2">
                        <ch.icon className={`w-4 h-4 ${ch.color}`} />
                        <span className="text-sm text-white">{ch.name}</span>
                      </div>
                      <Badge variant="outline" className="border-[hsl(var(--luxury-icon-inactive))]">
                        {stats?.channel_breakdown?.[ch.id] || 0}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Region Priority</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {loading ? (
                  <Skeleton className="h-20 bg-[hsl(var(--luxury-active-bg))]" />
                ) : (
                  ['africa', 'asia', 'middle_east'].map((region) => (
                    <div key={region} className="flex items-center justify-between p-2 rounded bg-[hsl(var(--luxury-active-bg))]">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[hsl(var(--luxury-icon-active))]" />
                        <span className="text-sm text-white capitalize">{region.replace('_', ' ')}</span>
                      </div>
                      <Badge className="bg-[hsl(var(--luxury-icon-active))]/20 text-[hsl(var(--luxury-icon-active))]">
                        {stats?.region_breakdown?.[region] || 0}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Leads */}
        <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              {loading ? (
                <div className="space-y-2">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 bg-[hsl(var(--luxury-active-bg))]" />
                  ))}
                </div>
              ) : stats?.recent_leads?.length ? (
                <div className="space-y-2">
                  {stats.recent_leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3 rounded-lg bg-[hsl(var(--luxury-active-bg))] flex items-center gap-4"
                    >
                      <div className={`p-2 rounded-lg ${getTemperatureColor(lead.ai_temperature)}`}>
                        {getTemperatureIcon(lead.ai_temperature)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white truncate">
                            {lead.contact_name || lead.contact_email || 'Unknown'}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {lead.channel}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {lead.source_country?.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-[hsl(var(--luxury-icon-inactive))] truncate mt-1">
                          {lead.ai_summary || lead.raw_message?.substring(0, 60) + '...'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">{lead.ai_score}</p>
                        <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[hsl(var(--luxury-icon-inactive))]">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No leads yet. Use the simulator above to test.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Daily Insights */}
        {stats?.insights && stats.insights.length > 0 && (
          <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                AI Daily Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.insights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg ${
                      insight.priority === 'high' ? 'bg-red-500/10 border border-red-500/30' :
                      insight.priority === 'medium' ? 'bg-amber-500/10 border border-amber-500/30' :
                      'bg-green-500/10 border border-green-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                        insight.priority === 'high' ? 'text-red-400' :
                        insight.priority === 'medium' ? 'text-amber-400' : 'text-green-400'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-white">{insight.title}</p>
                        <p className="text-xs text-[hsl(var(--luxury-icon-inactive))] mt-1">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI AUTO LEAD ROUTING + FRANCHISE ASSIGNMENT SECTION */}
        <Separator className="bg-[hsl(var(--luxury-active-bg))]" />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                <Route className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  AI Auto Lead Routing
                  <Lock className="w-4 h-4 text-amber-400" />
                </h2>
                <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">
                  Zero human intervention • Franchise-safe • Worldwide scalable
                </p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400">FULLY AUTOMATED</Badge>
          </div>

          {/* AI Routing Logic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AI_ROUTING_LOGIC.map((rule) => (
              <Card key={rule.temperature} className={`bg-[hsl(var(--luxury-card-bg))] border-2 ${
                rule.temperature === 'hot' ? 'border-red-500/30' :
                rule.temperature === 'warm' ? 'border-amber-500/30' :
                'border-blue-500/30'
              }`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    {rule.temperature === 'hot' && <Flame className="w-5 h-5 text-red-400" />}
                    {rule.temperature === 'warm' && <Zap className="w-5 h-5 text-amber-400" />}
                    {rule.temperature === 'cold' && <Snowflake className="w-5 h-5 text-blue-400" />}
                    <span className={`text-sm font-semibold ${
                      rule.temperature === 'hot' ? 'text-red-400' :
                      rule.temperature === 'warm' ? 'text-amber-400' :
                      'text-blue-400'
                    }`}>
                      {rule.temperature.toUpperCase()} LEADS
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-2 rounded-lg bg-[hsl(var(--luxury-active-bg))]">
                    <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Assigned To</p>
                    <p className="text-sm text-white font-medium flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" />
                      {rule.assignment}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">Auto Actions</p>
                    {rule.actions.map((action, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-white/80">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        {action}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-[hsl(var(--luxury-active-bg))]">
                    <Clock className="w-3 h-3 text-[hsl(var(--luxury-icon-inactive))]" />
                    <span className="text-xs text-[hsl(var(--luxury-icon-inactive))]">
                      Follow-up: <span className="text-white">{rule.followUp}</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Franchise Performance Dashboard */}
          <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Building className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
                  Franchise Lead Distribution
                </CardTitle>
                <Badge variant="outline" className="text-xs text-amber-400 border-amber-400/30">
                  <Shield className="w-3 h-3 mr-1" />
                  READ-ONLY
                </Badge>
              </div>
              <CardDescription className="text-[hsl(var(--luxury-icon-inactive))]">
                AI-assigned leads per territory • Conversion tracking • Revenue attribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[hsl(var(--luxury-active-bg))]">
                      <th className="text-left p-2 text-[hsl(var(--luxury-icon-inactive))]">Franchise</th>
                      <th className="text-center p-2 text-[hsl(var(--luxury-icon-inactive))]">Leads</th>
                      <th className="text-center p-2 text-[hsl(var(--luxury-icon-inactive))]">Converted</th>
                      <th className="text-center p-2 text-[hsl(var(--luxury-icon-inactive))]">Rate</th>
                      <th className="text-center p-2 text-[hsl(var(--luxury-icon-inactive))]">Revenue</th>
                      <th className="text-center p-2 text-[hsl(var(--luxury-icon-inactive))]">Capacity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FRANCHISE_DATA.map((franchise) => (
                      <tr key={franchise.id} className="border-b border-[hsl(var(--luxury-active-bg))]/50 hover:bg-[hsl(var(--luxury-active-bg))]/30">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {franchise.code === 'ng' && '🇳🇬'}
                              {franchise.code === 'ke' && '🇰🇪'}
                              {franchise.code === 'in' && '🇮🇳'}
                              {franchise.code === 'ae' && '🇦🇪'}
                              {franchise.code === 'sa' && '🇸🇦'}
                              {franchise.code === 'gh' && '🇬🇭'}
                            </span>
                            <span className="text-white font-medium">{franchise.country}</span>
                          </div>
                        </td>
                        <td className="text-center p-2">
                          <Badge className="bg-blue-500/20 text-blue-400">{franchise.leads}</Badge>
                        </td>
                        <td className="text-center p-2">
                          <span className="text-green-400 font-medium">{franchise.converted}</span>
                        </td>
                        <td className="text-center p-2">
                          <Badge className={`${
                            franchise.rate >= 30 ? 'bg-green-500/20 text-green-400' :
                            franchise.rate >= 25 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {franchise.rate}%
                          </Badge>
                        </td>
                        <td className="text-center p-2">
                          <span className="text-[hsl(var(--luxury-icon-active))] font-medium">
                            ${franchise.revenue.toLocaleString()}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 bg-[hsl(var(--luxury-active-bg))] rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  franchise.capacity >= 80 ? 'bg-red-400' :
                                  franchise.capacity >= 60 ? 'bg-amber-400' :
                                  'bg-green-400'
                                }`}
                                style={{ width: `${franchise.capacity}%` }}
                              />
                            </div>
                            <span className="text-xs text-[hsl(var(--luxury-icon-inactive))]">{franchise.capacity}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[hsl(var(--luxury-active-bg))]">
                <div className="p-3 rounded-lg bg-[hsl(var(--luxury-active-bg))]">
                  <div className="flex items-center gap-2 text-[hsl(var(--luxury-icon-inactive))] text-xs">
                    <Users className="w-3 h-3" />
                    Total Leads
                  </div>
                  <p className="text-xl font-bold text-white mt-1">
                    {FRANCHISE_DATA.reduce((sum, f) => sum + f.leads, 0)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[hsl(var(--luxury-active-bg))]">
                  <div className="flex items-center gap-2 text-[hsl(var(--luxury-icon-inactive))] text-xs">
                    <CheckCircle className="w-3 h-3" />
                    Converted
                  </div>
                  <p className="text-xl font-bold text-green-400 mt-1">
                    {FRANCHISE_DATA.reduce((sum, f) => sum + f.converted, 0)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[hsl(var(--luxury-active-bg))]">
                  <div className="flex items-center gap-2 text-[hsl(var(--luxury-icon-inactive))] text-xs">
                    <Percent className="w-3 h-3" />
                    Avg Rate
                  </div>
                  <p className="text-xl font-bold text-amber-400 mt-1">
                    {Math.round(FRANCHISE_DATA.reduce((sum, f) => sum + f.rate, 0) / FRANCHISE_DATA.length)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[hsl(var(--luxury-active-bg))]">
                  <div className="flex items-center gap-2 text-[hsl(var(--luxury-icon-inactive))] text-xs">
                    <DollarSign className="w-3 h-3" />
                    Total Revenue
                  </div>
                  <p className="text-xl font-bold text-[hsl(var(--luxury-icon-active))] mt-1">
                    ${FRANCHISE_DATA.reduce((sum, f) => sum + f.revenue, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Lock Notice */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-amber-400" />
              <div>
                <p className="text-sm text-white font-medium">Module Locked • Zero Human Dependency</p>
                <p className="text-xs text-[hsl(var(--luxury-icon-inactive))]">
                  AI decisions read-only • Logs immutable • Manual override: SUPER BOSS ONLY
                </p>
              </div>
            </div>
            <Badge className="bg-red-500/20 text-red-400">
              <Lock className="w-3 h-3 mr-1" />
              FINAL LOCK
            </Badge>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[hsl(var(--luxury-icon-inactive))] space-y-1">
          <p>AI Lead Engine • Powered by Software Vala AI</p>
          <p>Auto Routing • Franchise Assignment • Zero Human Intervention</p>
          <p className="text-[hsl(var(--luxury-icon-active))]">99% AI • 1% Human • LOCKED</p>
        </div>
      </div>
    </UltraLuxuryLayout>
  );
}
