import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserRoles } from '@/hooks/useUserRoles';
import { 
  Lock, 
  Shield, 
  AlertTriangle, 
  Key,
  Eye,
  FileText,
  Clock,
  ShieldAlert
} from 'lucide-react';

const BlackBoxVaultPage = () => {
  const { isSuperAdmin } = useUserRoles();

  if (!isSuperAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md bg-card border-destructive/50">
            <CardContent className="p-8 text-center">
              <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
              <p className="text-muted-foreground">
                The Black Box Vault is restricted to Super Admins only.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const vaultItems = [
    { 
      title: 'System Master Keys', 
      type: 'Encryption', 
      lastAccessed: 'Never', 
      status: 'locked',
      icon: Key 
    },
    { 
      title: 'Disaster Recovery Codes', 
      type: 'Recovery', 
      lastAccessed: '2024-01-05', 
      status: 'locked',
      icon: Shield 
    },
    { 
      title: 'Root Access Credentials', 
      type: 'Authentication', 
      lastAccessed: '2024-02-01', 
      status: 'locked',
      icon: Lock 
    },
    { 
      title: 'Compliance Audit Archive', 
      type: 'Documentation', 
      lastAccessed: '2024-01-20', 
      status: 'accessible',
      icon: FileText 
    },
    { 
      title: 'Security Incident Archive', 
      type: 'Logs', 
      lastAccessed: '2024-02-10', 
      status: 'accessible',
      icon: AlertTriangle 
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
              <Lock className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Black Box Vault</h1>
              <p className="text-muted-foreground mt-1">
                Ultra-secure system vault • Super Admin Only
              </p>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-500">High Security Zone</h3>
                <p className="text-sm text-amber-500/80">
                  All access to this vault is logged and monitored. Unauthorized access attempts 
                  will trigger security alerts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-200">3</p>
                  <p className="text-sm text-slate-500">Locked Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800">
                  <Eye className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-200">2</p>
                  <p className="text-sm text-slate-500">Accessible</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800">
                  <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-200">0</p>
                  <p className="text-sm text-slate-500">Pending Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800">
                  <Shield className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-500">Secure</p>
                  <p className="text-sm text-slate-500">Vault Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vault Items */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200">Vault Contents</CardTitle>
            <CardDescription className="text-slate-500">
              Critical system assets and recovery materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vaultItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-slate-700">
                        <Icon className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-200">{item.title}</h3>
                        <p className="text-sm text-slate-500">
                          {item.type} • Last accessed: {item.lastAccessed}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.status === 'locked' ? (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          <Lock className="h-3 w-3 mr-1" />
                          Locked
                        </Badge>
                      ) : (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Eye className="h-3 w-3 mr-1" />
                          Accessible
                        </Badge>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        disabled={item.status === 'locked'}
                      >
                        {item.status === 'locked' ? 'Request Access' : 'View'}
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

export default BlackBoxVaultPage;
