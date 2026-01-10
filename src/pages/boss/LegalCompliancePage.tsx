import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Scale,
  FileSearch,
  Gavel,
  Search
} from 'lucide-react';

const LegalCompliancePage = () => {
  const complianceItems = [
    { title: 'Privacy Policy', status: 'compliant', lastUpdated: '2024-01-15', icon: Shield },
    { title: 'Terms of Service', status: 'compliant', lastUpdated: '2024-01-10', icon: FileText },
    { title: 'GDPR Compliance', status: 'review', lastUpdated: '2024-02-01', icon: Scale },
    { title: 'Data Processing Agreement', status: 'compliant', lastUpdated: '2024-01-20', icon: FileSearch },
    { title: 'Cookie Policy', status: 'compliant', lastUpdated: '2024-01-12', icon: FileText },
    { title: 'Acceptable Use Policy', status: 'pending', lastUpdated: '2024-02-10', icon: Gavel },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30">Compliant</Badge>;
      case 'review':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30">Under Review</Badge>;
      case 'pending':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">Action Required</Badge>;
      default:
        return <Badge variant="outline" className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))]">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[hsl(var(--boss-canvas))] p-6 space-y-6">
        {/* Header with Search */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--boss-text))]">Legal & Compliance</h1>
            <p className="text-[hsl(var(--boss-text-muted))] mt-1">Manage legal documents and compliance status</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--boss-text-muted))]" />
              <Input 
                placeholder="Search documents..." 
                className="pl-10 w-64 bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))] placeholder:text-[hsl(var(--boss-text-muted))] focus:border-[hsl(var(--boss-accent))] focus:ring-[hsl(var(--boss-accent))]/20"
              />
            </div>
            <Button variant="outline" className="gap-2 border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text))] hover:bg-[hsl(var(--boss-card-elevated))] hover:border-[hsl(var(--boss-accent))]/50">
              <FileText className="h-4 w-4" />
              Add Document
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[hsl(var(--boss-text))]">4</p>
                  <p className="text-sm text-[hsl(var(--boss-text-muted))]">Compliant</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[hsl(var(--boss-text))]">1</p>
                  <p className="text-sm text-[hsl(var(--boss-text-muted))]">Under Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[hsl(var(--boss-text))]">1</p>
                  <p className="text-sm text-[hsl(var(--boss-text-muted))]">Action Required</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[hsl(var(--boss-accent))]/20">
                  <FileText className="h-5 w-5 text-[hsl(var(--boss-accent))]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[hsl(var(--boss-text))]">6</p>
                  <p className="text-sm text-[hsl(var(--boss-text-muted))]">Total Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <Card className="bg-[hsl(var(--boss-card))] border-[hsl(var(--boss-border))] shadow-lg shadow-black/20">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--boss-text))]">Compliance Documents</CardTitle>
            <CardDescription className="text-[hsl(var(--boss-text-muted))]">All legal and compliance documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 rounded-xl border border-[hsl(var(--boss-border))] bg-[hsl(var(--boss-card-elevated))] hover:border-[hsl(var(--boss-accent))]/30 hover:shadow-lg hover:shadow-[hsl(var(--boss-accent))]/5 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-lg bg-[hsl(var(--boss-card))] border border-[hsl(var(--boss-border))]">
                        <Icon className="h-5 w-5 text-[hsl(var(--boss-text-muted))]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[hsl(var(--boss-text))]">{item.title}</h3>
                        <p className="text-sm text-[hsl(var(--boss-text-muted))]">
                          Last updated: {item.lastUpdated}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(item.status)}
                      <Button variant="outline" size="sm" className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))] hover:text-[hsl(var(--boss-text))] hover:bg-[hsl(var(--boss-card))] hover:border-[hsl(var(--boss-accent))]/50">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="border-[hsl(var(--boss-border))] text-[hsl(var(--boss-text-muted))] hover:text-[hsl(var(--boss-text))] hover:bg-[hsl(var(--boss-card))] hover:border-[hsl(var(--boss-accent))]/50">
                        Edit
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LegalCompliancePage;
