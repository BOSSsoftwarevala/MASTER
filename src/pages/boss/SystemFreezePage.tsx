import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useSystemFreezeStatus, useFreezeHistory, useCreateSystemFreeze, useResumeSystemFreeze } from '@/hooks/useBossData';
import { useAuth } from '@/hooks/useAuth';
import { 
  Snowflake, 
  AlertTriangle, 
  Shield,
  Server,
  CreditCard,
  Users,
  Code2,
  Play,
  History
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface FreezeModule {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

const freezeModules: FreezeModule[] = [
  { id: 'auth', name: 'Authentication', icon: Users, description: 'User login and registration' },
  { id: 'payments', name: 'Payments', icon: CreditCard, description: 'All payment processing' },
  { id: 'servers', name: 'Servers', icon: Server, description: 'Server management and scaling' },
  { id: 'deployments', name: 'Deployments', icon: Code2, description: 'Code deployment pipeline' },
];

export default function SystemFreezePage() {
  const { user } = useAuth();
  const [freezeReason, setFreezeReason] = useState('');
  
  const { data: activeFreezes = [], isLoading: freezeLoading } = useSystemFreezeStatus();
  const { data: freezeHistory = [], isLoading: historyLoading } = useFreezeHistory();
  const createFreeze = useCreateSystemFreeze();
  const resumeFreeze = useResumeSystemFreeze();

  const fullSystemFrozen = activeFreezes.some(f => f.freeze_type === 'full_system');
  const frozenModuleIds = activeFreezes.filter(f => f.freeze_type === 'partial').map(f => f.module_id);

  const handleModuleFreeze = (moduleId: string, freeze: boolean) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    if (freeze) {
      createFreeze.mutate({
        freeze_type: 'partial',
        module_id: moduleId,
        reason: `Partial freeze for ${moduleId} module`,
        frozen_by: user.id,
      });
    } else {
      const activeFreeze = activeFreezes.find(f => f.module_id === moduleId && f.is_active);
      if (activeFreeze) {
        resumeFreeze.mutate({ id: activeFreeze.id, resumed_by: user.id });
      }
    }
  };

  const handleFullSystemFreeze = () => {
    if (!freezeReason.trim()) {
      toast.error('Freeze reason is required');
      return;
    }
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    createFreeze.mutate({
      freeze_type: 'full_system',
      reason: freezeReason,
      frozen_by: user.id,
    });
    setFreezeReason('');
  };

  const handleFullSystemResume = () => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    const fullFreeze = activeFreezes.find(f => f.freeze_type === 'full_system');
    if (fullFreeze) {
      resumeFreeze.mutate({ id: fullFreeze.id, resumed_by: user.id });
    }
  };

  const isLoading = freezeLoading || historyLoading;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[hsl(var(--boss-panel-bg))] p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">System Freeze Control</h1>
          <p className="text-gray-400 mt-1">Full or partial system freeze with reversible actions</p>
        </div>

        {/* Full System Freeze Alert */}
        {fullSystemFrozen && (
          <Card className="bg-red-900/30 border-red-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-red-900/50 flex items-center justify-center">
                    <Snowflake className="h-6 w-6 text-red-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-300">FULL SYSTEM FREEZE ACTIVE</h3>
                    <p className="text-sm text-red-400">All modules are currently frozen</p>
                  </div>
                </div>
                <Button 
                  onClick={handleFullSystemResume}
                  disabled={resumeFreeze.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume System
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Full System Freeze Control */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Snowflake className="h-5 w-5 text-blue-400" />
              Full System Freeze
            </CardTitle>
            <CardDescription className="text-gray-400">
              Freeze the entire system. This will halt all operations immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-amber-900/30 border border-amber-700/50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-300">Warning</p>
                  <p className="text-sm text-amber-400">
                    Full system freeze will immediately stop all user activities, payments, and operations.
                    This action is logged and reversible.
                  </p>
                </div>
              </div>
            </div>

            {!fullSystemFrozen && (
              <>
                <div>
                  <Label htmlFor="reason" className="text-gray-300">Freeze Reason (Required)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Enter the reason for system freeze..."
                    value={freezeReason}
                    onChange={(e) => setFreezeReason(e.target.value)}
                    className="mt-2 bg-[hsl(var(--boss-panel-bg))] border-[hsl(var(--boss-card-border))] text-white"
                  />
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="lg" className="w-full bg-red-600/80 hover:bg-red-600 text-white">
                      <Snowflake className="h-5 w-5 mr-2" />
                      Activate Full System Freeze
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Confirm Full System Freeze</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        This will immediately freeze all system operations. Are you sure you want to proceed?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-800">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleFullSystemFreeze} 
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={createFreeze.isPending}
                      >
                        Confirm Freeze
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </CardContent>
        </Card>

        {/* Partial Module Freeze */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-purple-400" />
              Partial Module Freeze
            </CardTitle>
            <CardDescription className="text-gray-400">
              Freeze individual modules while keeping others operational
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-[hsl(var(--boss-card-border))]">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg bg-gray-700" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-gray-700" />
                        <Skeleton className="h-3 w-48 bg-gray-700" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-10 bg-gray-700" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {freezeModules.map((module) => {
                  const isFrozen = fullSystemFrozen || frozenModuleIds.includes(module.id);
                  return (
                    <div 
                      key={module.id} 
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        isFrozen 
                          ? 'border-blue-600/50 bg-blue-950/30' 
                          : 'border-[hsl(var(--boss-card-border))] bg-[hsl(var(--boss-panel-bg))]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          isFrozen ? 'bg-blue-900/50' : 'bg-gray-800'
                        }`}>
                          <module.icon className={`h-5 w-5 ${isFrozen ? 'text-blue-400' : 'text-gray-500'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{module.name}</span>
                            {isFrozen && (
                              <Badge variant="outline" className="border-blue-500/50 bg-blue-900/30 text-blue-300">
                                <Snowflake className="h-3 w-3 mr-1" />
                                Frozen
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{module.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={isFrozen}
                        onCheckedChange={(checked) => handleModuleFreeze(module.id, checked)}
                        disabled={fullSystemFrozen || createFreeze.isPending || resumeFreeze.isPending}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Freeze History */}
        <Card className="bg-[hsl(var(--boss-card-bg))] border-[hsl(var(--boss-card-border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <History className="h-5 w-5 text-gray-400" />
              Freeze History
            </CardTitle>
            <CardDescription className="text-gray-400">All freeze actions are logged and immutable</CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start justify-between p-3 rounded-lg border border-[hsl(var(--boss-card-border))]">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40 bg-gray-700" />
                      <Skeleton className="h-3 w-64 bg-gray-700" />
                    </div>
                  </div>
                ))}
              </div>
            ) : freezeHistory.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">No freeze history available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {freezeHistory.map((entry) => (
                  <div key={entry.id} className="flex items-start justify-between p-3 rounded-lg border border-[hsl(var(--boss-card-border))] bg-[hsl(var(--boss-panel-bg))]">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className={entry.is_active 
                            ? 'border-red-500/50 bg-red-900/30 text-red-300' 
                            : 'border-gray-600 text-gray-400'
                          }
                        >
                          {entry.freeze_type === 'full_system' ? 'Full System' : entry.module_id}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={entry.is_active 
                            ? 'border-amber-500/50 bg-amber-900/30 text-amber-300' 
                            : 'border-emerald-500/50 bg-emerald-900/30 text-emerald-300'
                          }
                        >
                          {entry.is_active ? 'Active' : 'Resumed'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(entry.frozen_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm mt-1 text-gray-300">{entry.reason}</p>
                      {entry.resumed_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          Duration: {Math.round((new Date(entry.resumed_at).getTime() - new Date(entry.frozen_at).getTime()) / 60000)} minutes
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}