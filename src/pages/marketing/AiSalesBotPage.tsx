import { useState } from 'react';
import { UltraLuxuryLayout } from '@/components/layout/UltraLuxuryLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Globe, 
  MessageSquare, 
  Shield, 
  Lock, 
  Zap, 
  Users, 
  DollarSign,
  BarChart3,
  Phone,
  Video,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Activity,
  TrendingUp,
  MapPin,
  Languages,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { ValaFooter } from '@/components/vala/ValaFooter';

// Bot Identity System
interface BotIdentity {
  code: string;
  country: string;
  countryCode: string;
  flag: string;
  status: 'active' | 'idle' | 'busy';
  chatsToday: number;
  closedDeals: number;
  revenue: number;
}

// Country Personality Engine
interface CountryPersonality {
  code: string;
  name: string;
  flag: string;
  languages: string[];
  tone: string;
  formality: 'formal' | 'semi-formal' | 'friendly';
  style: string;
  greetingExample: string;
  keyTraits: string[];
}

const COUNTRY_PERSONALITIES: CountryPersonality[] = [
  {
    code: 'in',
    name: 'India',
    flag: '🇮🇳',
    languages: ['English', 'Hindi'],
    tone: 'Polite & Solution-Focused',
    formality: 'semi-formal',
    style: 'Price-aware, value-driven',
    greetingExample: 'Namaste! Welcome to SoftwareVala. How can I help you find the perfect solution today?',
    keyTraits: ['Price-conscious', 'Detail-oriented', 'Relationship-building']
  },
  {
    code: 'ae',
    name: 'UAE',
    flag: '🇦🇪',
    languages: ['English', 'Arabic'],
    tone: 'Professional & Premium',
    formality: 'formal',
    style: 'Fast, efficient, premium tone',
    greetingExample: 'Welcome to SoftwareVala. I\'m here to provide you with the best enterprise solutions for your business.',
    keyTraits: ['Premium-focused', 'Time-efficient', 'Quality-driven']
  },
  {
    code: 'ng',
    name: 'Nigeria',
    flag: '🇳🇬',
    languages: ['English'],
    tone: 'Friendly & Opportunity-Focused',
    formality: 'friendly',
    style: 'Warm, opportunity-driven',
    greetingExample: 'Hello! Great to connect with you. I\'m excited to show you how we can grow your business together!',
    keyTraits: ['Opportunity-seeker', 'Growth-minded', 'Trust-building']
  },
  {
    code: 'ke',
    name: 'Kenya',
    flag: '🇰🇪',
    languages: ['English', 'Swahili'],
    tone: 'Trust-Building & Educational',
    formality: 'semi-formal',
    style: 'Educational, trust-focused',
    greetingExample: 'Karibu! Welcome to SoftwareVala. Let me show you how our solutions can transform your operations.',
    keyTraits: ['Education-focused', 'Trust-priority', 'Long-term thinking']
  },
  {
    code: 'sa',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    languages: ['Arabic', 'English'],
    tone: 'Formal & Respect-Based',
    formality: 'formal',
    style: 'Respectful, premium service',
    greetingExample: 'السلام عليكم - Welcome to SoftwareVala. It is my honor to assist you with your business needs.',
    keyTraits: ['Respect-first', 'Quality-focused', 'Relationship-building']
  },
  {
    code: 'om',
    name: 'Oman',
    flag: '🇴🇲',
    languages: ['Arabic', 'English'],
    tone: 'Warm & Professional',
    formality: 'semi-formal',
    style: 'Balanced, trust-focused',
    greetingExample: 'Marhaba! Welcome to SoftwareVala. I\'m here to help you find the perfect solution for your business.',
    keyTraits: ['Trust-building', 'Quality-aware', 'Relationship-focused']
  }
];

// Bot Behavior Flow
const BOT_BEHAVIOR_FLOW = [
  { step: 1, action: 'Greet in local style', icon: MessageSquare, color: 'text-blue-400' },
  { step: 2, action: 'Identify need (Demo / Price / Support)', icon: Users, color: 'text-green-400' },
  { step: 3, action: 'Ask MAX 2 questions only', icon: Zap, color: 'text-yellow-400' },
  { step: 4, action: 'Show best product/demo', icon: Video, color: 'text-purple-400' },
  { step: 5, action: 'Push action (Demo / Call / Pay)', icon: ArrowRight, color: 'text-emerald-400' }
];

// Smart Sales Actions
const SMART_SALES_ACTIONS = [
  { action: 'Auto send demo link', icon: Video, status: 'active' },
  { action: 'Auto send pricing (country-wise)', icon: DollarSign, status: 'active' },
  { action: 'Auto schedule call', icon: Phone, status: 'active' },
  { action: 'Auto escalate to franchise', icon: Users, status: 'active' },
  { action: 'Auto close small deals', icon: CreditCard, status: 'active' }
];

// Anti-Spam & Safety Features
const SAFETY_FEATURES = [
  { feature: 'Rate limit chats', status: 'enabled', icon: Activity },
  { feature: 'Detect fake leads', status: 'enabled', icon: AlertTriangle },
  { feature: 'Block abusive users', status: 'enabled', icon: Shield },
  { feature: 'Mask internal logic', status: 'enabled', icon: EyeOff },
  { feature: 'No prompt leakage', status: 'locked', icon: Lock }
];

// Mock Active Bots
const ACTIVE_BOTS: BotIdentity[] = [
  { code: 'SALES-AI-IN-492', country: 'India', countryCode: 'in', flag: '🇮🇳', status: 'active', chatsToday: 47, closedDeals: 12, revenue: 4800 },
  { code: 'SALES-AI-AE-771', country: 'UAE', countryCode: 'ae', flag: '🇦🇪', status: 'busy', chatsToday: 28, closedDeals: 8, revenue: 12500 },
  { code: 'SALES-AI-NG-338', country: 'Nigeria', countryCode: 'ng', flag: '🇳🇬', status: 'active', chatsToday: 35, closedDeals: 9, revenue: 2100 },
  { code: 'SALES-AI-KE-156', country: 'Kenya', countryCode: 'ke', flag: '🇰🇪', status: 'idle', chatsToday: 22, closedDeals: 5, revenue: 980 },
  { code: 'SALES-AI-SA-889', country: 'Saudi Arabia', countryCode: 'sa', flag: '🇸🇦', status: 'active', chatsToday: 19, closedDeals: 6, revenue: 9200 },
  { code: 'SALES-AI-OM-412', country: 'Oman', countryCode: 'om', flag: '🇴🇲', status: 'active', chatsToday: 14, closedDeals: 4, revenue: 3400 }
];

// Mock Live Chats
const LIVE_CHATS = [
  { id: 1, botCode: 'SALES-AI-IN-492', leadName: 'Rajesh K.', country: '🇮🇳', stage: 'Demo Sent', time: '2 min ago' },
  { id: 2, botCode: 'SALES-AI-AE-771', leadName: 'Ahmed M.', country: '🇦🇪', stage: 'Pricing Shared', time: '5 min ago' },
  { id: 3, botCode: 'SALES-AI-NG-338', leadName: 'Chukwu O.', country: '🇳🇬', stage: 'Call Scheduled', time: '8 min ago' },
  { id: 4, botCode: 'SALES-AI-IN-492', leadName: 'Priya S.', country: '🇮🇳', stage: 'Greeting', time: '1 min ago' },
  { id: 5, botCode: 'SALES-AI-SA-889', leadName: 'Fahad A.', country: '🇸🇦', stage: 'Need Analysis', time: '3 min ago' }
];

export default function AiSalesBotPage() {
  const [selectedPersonality, setSelectedPersonality] = useState<string>('in');

  const selectedCountry = COUNTRY_PERSONALITIES.find(c => c.code === selectedPersonality) || COUNTRY_PERSONALITIES[0];

  const totalChats = ACTIVE_BOTS.reduce((sum, bot) => sum + bot.chatsToday, 0);
  const totalDeals = ACTIVE_BOTS.reduce((sum, bot) => sum + bot.closedDeals, 0);
  const totalRevenue = ACTIVE_BOTS.reduce((sum, bot) => sum + bot.revenue, 0);

  return (
    <UltraLuxuryLayout role="boss" variant="boss">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Bot className="w-7 h-7 text-[hsl(var(--luxury-icon-active))]" />
              AI Sales Bot + Country Personality Engine
            </h1>
            <p className="text-[hsl(var(--luxury-icon-inactive))] text-sm mt-1">
              Human-like • Country-smart • Sales-optimized • Fully autonomous
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-600/20 text-green-400 border-green-600/50">
              <Activity className="w-3 h-3 mr-1" />
              {ACTIVE_BOTS.filter(b => b.status === 'active').length} BOTS ACTIVE
            </Badge>
            <Badge className="bg-red-600/20 text-red-400 border-red-600/50">
              <Lock className="w-3 h-3 mr-1" />
              MODULE LOCKED
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs">Today's Chats</p>
                  <p className="text-2xl font-bold text-white">{totalChats}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs">Closed Deals</p>
                  <p className="text-2xl font-bold text-white">{totalDeals}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs">Revenue</p>
                  <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs">Close Rate</p>
                  <p className="text-2xl font-bold text-white">{((totalDeals / totalChats) * 100).toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bots" className="space-y-4">
          <TabsList className="bg-[hsl(var(--luxury-card-bg))] border border-[hsl(var(--luxury-active-bg))]">
            <TabsTrigger value="bots">Active Bots</TabsTrigger>
            <TabsTrigger value="personality">Personality Engine</TabsTrigger>
            <TabsTrigger value="flow">Behavior Flow</TabsTrigger>
            <TabsTrigger value="safety">Safety & Locks</TabsTrigger>
            <TabsTrigger value="live">Live Chats</TabsTrigger>
          </TabsList>

          {/* Active Bots Tab */}
          <TabsContent value="bots" className="space-y-4">
            <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
                  Bot Identity System
                </CardTitle>
                <CardDescription className="text-[hsl(var(--luxury-icon-inactive))]">
                  BOT CODE FORMAT: SALES-AI-[COUNTRY-CODE]-[AUTO-ID] • No human name • No real ID
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {ACTIVE_BOTS.map((bot) => (
                    <Card key={bot.code} className="bg-[hsl(var(--luxury-active-bg))] border-[hsl(var(--luxury-active-bg))]">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{bot.flag}</span>
                            <div>
                              <p className="text-white font-mono text-sm">{bot.code}</p>
                              <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs">{bot.country}</p>
                            </div>
                          </div>
                          <Badge className={
                            bot.status === 'active' ? 'bg-green-600/20 text-green-400' :
                            bot.status === 'busy' ? 'bg-yellow-600/20 text-yellow-400' :
                            'bg-gray-600/20 text-gray-400'
                          }>
                            {bot.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-[hsl(var(--luxury-card-bg))] p-2 rounded">
                            <p className="text-white font-bold">{bot.chatsToday}</p>
                            <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs">Chats</p>
                          </div>
                          <div className="bg-[hsl(var(--luxury-card-bg))] p-2 rounded">
                            <p className="text-white font-bold">{bot.closedDeals}</p>
                            <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs">Deals</p>
                          </div>
                          <div className="bg-[hsl(var(--luxury-card-bg))] p-2 rounded">
                            <p className="text-white font-bold">${bot.revenue}</p>
                            <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs">Revenue</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personality Engine Tab */}
          <TabsContent value="personality" className="space-y-4">
            <div className="grid lg:grid-cols-3 gap-4">
              <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
                    Country Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {COUNTRY_PERSONALITIES.map((country) => (
                        <Button
                          key={country.code}
                          variant="ghost"
                          className={`w-full justify-start ${selectedPersonality === country.code ? 'bg-[hsl(var(--luxury-icon-active))]/20 text-[hsl(var(--luxury-icon-active))]' : 'text-white'}`}
                          onClick={() => setSelectedPersonality(country.code)}
                        >
                          <span className="text-xl mr-3">{country.flag}</span>
                          <span>{country.name}</span>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
                    {selectedCountry.flag} {selectedCountry.name} Personality
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[hsl(var(--luxury-active-bg))] p-4 rounded-lg">
                      <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs mb-1">Tone</p>
                      <p className="text-white font-medium">{selectedCountry.tone}</p>
                    </div>
                    <div className="bg-[hsl(var(--luxury-active-bg))] p-4 rounded-lg">
                      <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs mb-1">Formality</p>
                      <Badge className={
                        selectedCountry.formality === 'formal' ? 'bg-purple-600/20 text-purple-400' :
                        selectedCountry.formality === 'semi-formal' ? 'bg-blue-600/20 text-blue-400' :
                        'bg-green-600/20 text-green-400'
                      }>
                        {selectedCountry.formality.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-[hsl(var(--luxury-active-bg))] p-4 rounded-lg">
                    <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs mb-1 flex items-center gap-1">
                      <Languages className="w-3 h-3" /> Languages
                    </p>
                    <div className="flex gap-2 mt-2">
                      {selectedCountry.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-white border-[hsl(var(--luxury-icon-active))]">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[hsl(var(--luxury-active-bg))] p-4 rounded-lg">
                    <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs mb-1">Style</p>
                    <p className="text-white">{selectedCountry.style}</p>
                  </div>

                  <div className="bg-[hsl(var(--luxury-active-bg))] p-4 rounded-lg">
                    <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Greeting Example
                    </p>
                    <p className="text-white italic">"{selectedCountry.greetingExample}"</p>
                  </div>

                  <div className="bg-[hsl(var(--luxury-active-bg))] p-4 rounded-lg">
                    <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs mb-2">Key Traits</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCountry.keyTraits.map((trait) => (
                        <Badge key={trait} className="bg-[hsl(var(--luxury-icon-active))]/20 text-[hsl(var(--luxury-icon-active))]">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Behavior Flow Tab */}
          <TabsContent value="flow" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
                    Bot Behavior Flow
                  </CardTitle>
                  <CardDescription className="text-[hsl(var(--luxury-icon-inactive))]">
                    NO LONG CHAT • NO CONFUSION • 5 STEPS ONLY
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {BOT_BEHAVIOR_FLOW.map((step, index) => (
                      <div key={step.step} className="flex items-center gap-4 bg-[hsl(var(--luxury-active-bg))] p-4 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-[hsl(var(--luxury-card-bg))] flex items-center justify-center">
                          <span className="text-white font-bold">{step.step}</span>
                        </div>
                        <step.icon className={`w-5 h-5 ${step.color}`} />
                        <span className="text-white flex-1">{step.action}</span>
                        {index < BOT_BEHAVIOR_FLOW.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-[hsl(var(--luxury-icon-inactive))]" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
                    Smart Sales Actions
                  </CardTitle>
                  <CardDescription className="text-[hsl(var(--luxury-icon-inactive))]">
                    Fully automated sales actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {SMART_SALES_ACTIONS.map((action) => (
                      <div key={action.action} className="flex items-center gap-4 bg-[hsl(var(--luxury-active-bg))] p-4 rounded-lg">
                        <action.icon className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
                        <span className="text-white flex-1">{action.action}</span>
                        <Badge className="bg-green-600/20 text-green-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          ACTIVE
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Safety & Locks Tab */}
          <TabsContent value="safety" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
                    Anti-Spam & Safety
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {SAFETY_FEATURES.map((feature) => (
                      <div key={feature.feature} className="flex items-center gap-4 bg-[hsl(var(--luxury-active-bg))] p-4 rounded-lg">
                        <feature.icon className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
                        <span className="text-white flex-1">{feature.feature}</span>
                        <Badge className={feature.status === 'locked' ? 'bg-red-600/20 text-red-400' : 'bg-green-600/20 text-green-400'}>
                          {feature.status === 'locked' ? <Lock className="w-3 h-3 mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {feature.status.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-400" />
                    Hard Locks
                  </CardTitle>
                  <CardDescription className="text-[hsl(var(--luxury-icon-inactive))]">
                    Boss override only
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      'Bot logic non-editable',
                      'No inspect data',
                      'No copy prompt',
                      'No manual rewrite',
                      'Boss override only'
                    ].map((lock) => (
                      <div key={lock} className="flex items-center gap-4 bg-red-900/20 border border-red-600/30 p-4 rounded-lg">
                        <Lock className="w-5 h-5 text-red-400" />
                        <span className="text-white flex-1">{lock}</span>
                        <Badge className="bg-red-600/20 text-red-400">
                          LOCKED
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Live Chats Tab */}
          <TabsContent value="live" className="space-y-4">
            <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
                  Live Chats (Read-Only)
                </CardTitle>
                <CardDescription className="text-[hsl(var(--luxury-icon-inactive))]">
                  Real-time view of ongoing conversations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {LIVE_CHATS.map((chat) => (
                    <div key={chat.id} className="flex items-center gap-4 bg-[hsl(var(--luxury-active-bg))] p-4 rounded-lg">
                      <span className="text-xl">{chat.country}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{chat.leadName}</p>
                        <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs font-mono">{chat.botCode}</p>
                      </div>
                      <Badge className={
                        chat.stage === 'Greeting' ? 'bg-blue-600/20 text-blue-400' :
                        chat.stage === 'Need Analysis' ? 'bg-yellow-600/20 text-yellow-400' :
                        chat.stage === 'Demo Sent' ? 'bg-purple-600/20 text-purple-400' :
                        chat.stage === 'Pricing Shared' ? 'bg-green-600/20 text-green-400' :
                        'bg-emerald-600/20 text-emerald-400'
                      }>
                        {chat.stage}
                      </Badge>
                      <span className="text-[hsl(var(--luxury-icon-inactive))] text-xs">{chat.time}</span>
                      <Eye className="w-4 h-4 text-[hsl(var(--luxury-icon-inactive))]" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conversion Heatmap */}
            <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-active-bg))]">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
                  Country Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {ACTIVE_BOTS.map((bot) => {
                    const closeRate = ((bot.closedDeals / bot.chatsToday) * 100).toFixed(1);
                    return (
                      <div key={bot.code} className="bg-[hsl(var(--luxury-active-bg))] p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">{bot.flag}</span>
                          <span className="text-white font-medium">{bot.country}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs">Close Rate</p>
                            <p className="text-white font-bold">{closeRate}%</p>
                          </div>
                          <div>
                            <p className="text-[hsl(var(--luxury-icon-inactive))] text-xs">Revenue</p>
                            <p className="text-emerald-400 font-bold">${bot.revenue}</p>
                          </div>
                        </div>
                        <div className="mt-2 h-2 bg-[hsl(var(--luxury-card-bg))] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[hsl(var(--luxury-icon-active))] to-emerald-500"
                            style={{ width: `${closeRate}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Notice */}
        <Card className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-600/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Lock className="w-8 h-8 text-red-400" />
              <div className="flex-1">
                <p className="text-white font-bold">MODULE LOCKED — FINAL</p>
                <p className="text-[hsl(var(--luxury-icon-inactive))] text-sm">
                  Human-like • Country-smart • Sales-optimized • Fully autonomous • Zero human dependency
                </p>
              </div>
              <Badge className="bg-red-600/20 text-red-400 border-red-600/50">
                BOSS OVERRIDE ONLY
              </Badge>
            </div>
          </CardContent>
        </Card>

        <ValaFooter />
      </div>
    </UltraLuxuryLayout>
  );
}
