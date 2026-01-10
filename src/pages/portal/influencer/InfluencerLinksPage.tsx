import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Link as LinkIcon, 
  Copy,
  Eye,
  Target,
  TrendingUp,
  Plus,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { toast } from 'sonner';

const links = [
  { 
    id: 1,
    code: 'SUMMER2026',
    campaign: 'Summer Product Launch',
    url: 'https://app.example.com/r/SUMMER2026',
    clicks: 4520,
    conversions: 128,
    conversionRate: 2.83,
    isActive: true,
    expiresAt: 'Jan 31, 2026'
  },
  { 
    id: 2,
    code: 'TECH101',
    campaign: 'Tech Tutorial Series',
    url: 'https://app.example.com/r/TECH101',
    clicks: 8900,
    conversions: 312,
    conversionRate: 3.51,
    isActive: true,
    expiresAt: 'Feb 28, 2026'
  },
  { 
    id: 3,
    code: 'NEWYEAR',
    campaign: 'New Year Promo',
    url: 'https://app.example.com/r/NEWYEAR',
    clicks: 2100,
    conversions: 45,
    conversionRate: 2.14,
    isActive: true,
    expiresAt: 'Jan 15, 2026'
  },
  { 
    id: 4,
    code: 'HOLIDAY23',
    campaign: 'Holiday Campaign 2023',
    url: 'https://app.example.com/r/HOLIDAY23',
    clicks: 15000,
    conversions: 520,
    conversionRate: 3.47,
    isActive: false,
    expiresAt: 'Expired'
  },
];

export default function InfluencerLinksPage() {
  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  return (
    <RoleLayout role="influencer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Link Generator</h1>
            <p className="text-muted-foreground">Create and manage your referral links</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate New Link
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <LinkIcon className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Links</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="text-2xl font-bold">30.5K</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversions</p>
                  <p className="text-2xl font-bold">1,005</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Rate</p>
                  <p className="text-2xl font-bold">3.29%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Links List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {links.map((link) => (
                <div key={link.id} className={`p-4 rounded-lg border ${
                  !link.isActive ? 'bg-muted/30 opacity-60' : 'bg-muted/50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        link.isActive ? 'bg-violet-500/20' : 'bg-slate-500/20'
                      }`}>
                        <LinkIcon className={`h-6 w-6 ${link.isActive ? 'text-violet-500' : 'text-slate-500'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-lg font-bold font-mono">{link.code}</code>
                          <Badge variant="outline" className={
                            link.isActive 
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                          }>
                            {link.isActive ? 'Active' : 'Expired'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{link.campaign}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Input 
                            value={link.url} 
                            readOnly 
                            className="w-80 text-xs font-mono"
                          />
                          <Button size="icon" variant="outline" onClick={() => copyLink(link.url)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline">
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold">{link.clicks.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Clicks</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{link.conversions}</p>
                          <p className="text-xs text-muted-foreground">Conversions</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-emerald-500">{link.conversionRate}%</p>
                          <p className="text-xs text-muted-foreground">Rate</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{link.expiresAt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
          <p className="text-sm text-violet-400">
            <strong>Tip:</strong> Links with custom codes (like SUMMER2026) perform 35% better than random codes. 
            Make them memorable and relevant to your content!
          </p>
        </div>
      </div>
    </RoleLayout>
  );
}
