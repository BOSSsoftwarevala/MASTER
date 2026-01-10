import { useLocation } from 'react-router-dom';
import { UltraLuxuryLayout } from '@/components/layout/UltraLuxuryLayout';
import { SmartFallback } from '@/components/ui/SmartFallback';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  ListTodo, 
  Target, 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  Hammer,
  RotateCcw,
  Bug,
  Play,
  Star,
  Server,
  Shield,
  Ticket,
  CheckCircle,
  FileText,
  Lock,
  BarChart3,
  Key,
  Clock,
  Zap
} from 'lucide-react';

// Page configuration mapping
const pageConfig: Record<string, { title: string; description: string; icon: typeof Activity; status: 'active' | 'monitoring' | 'locked' }> = {
  '/dashboard/boss/vala/decisions': {
    title: 'Live Decisions',
    description: 'Real-time AI decision stream and approval queue',
    icon: Activity,
    status: 'active',
  },
  '/dashboard/boss/vala/tasks': {
    title: 'Active Tasks',
    description: 'VALA AI managed task queue and execution status',
    icon: ListTodo,
    status: 'active',
  },
  '/dashboard/boss/vala/priority': {
    title: 'Priority Queue',
    description: 'High-priority items requiring immediate attention',
    icon: Target,
    status: 'monitoring',
  },
  '/dashboard/boss/vala/ceo': {
    title: 'AI CEO Insights',
    description: 'Strategic business intelligence and recommendations',
    icon: Brain,
    status: 'active',
  },
  '/dashboard/boss/vala/growth': {
    title: 'Growth Recommendations',
    description: 'AI-driven growth opportunities and optimization suggestions',
    icon: TrendingUp,
    status: 'active',
  },
  '/dashboard/boss/vala/risks': {
    title: 'Risk Flags',
    description: 'Detected risks and mitigation strategies',
    icon: AlertTriangle,
    status: 'monitoring',
  },
  '/dashboard/boss/vala/builds': {
    title: 'Build Monitor',
    description: 'Development pipeline and build status tracking',
    icon: Hammer,
    status: 'active',
  },
  '/dashboard/boss/vala/autofix': {
    title: 'Auto Fix Engine',
    description: 'Automated issue resolution and self-healing systems',
    icon: RotateCcw,
    status: 'active',
  },
  '/dashboard/boss/vala/bugs': {
    title: 'Bug Kill Switch',
    description: 'Critical bug detection and emergency controls',
    icon: Bug,
    status: 'monitoring',
  },
  '/dashboard/boss/vala/demo': {
    title: 'Demo Health',
    description: 'Demo environment status and performance metrics',
    icon: Play,
    status: 'active',
  },
  '/dashboard/boss/vala/features': {
    title: 'Feature Suggestions',
    description: 'AI-generated feature recommendations based on usage patterns',
    icon: Star,
    status: 'active',
  },
  '/dashboard/boss/vala/servers': {
    title: 'Server Health',
    description: 'Infrastructure monitoring and health indicators',
    icon: Server,
    status: 'active',
  },
  '/dashboard/boss/vala/backups': {
    title: 'Backup Status',
    description: 'Backup integrity and recovery point status',
    icon: Shield,
    status: 'active',
  },
  '/dashboard/boss/vala/issues': {
    title: 'Issue Intake',
    description: 'Support ticket ingestion and AI triage',
    icon: Ticket,
    status: 'active',
  },
  '/dashboard/boss/vala/resolution': {
    title: 'Auto Resolution',
    description: 'Automated issue resolution and escalation logic',
    icon: CheckCircle,
    status: 'active',
  },
  '/dashboard/boss/vala/silent-fixes': {
    title: 'Silent Fix Log',
    description: 'Background fixes applied without user disruption',
    icon: FileText,
    status: 'active',
  },
  '/dashboard/boss/vala/threats': {
    title: 'Threat Monitor',
    description: 'Real-time security threat detection and response',
    icon: Shield,
    status: 'monitoring',
  },
  '/dashboard/boss/vala/violations': {
    title: 'Access Violations',
    description: 'Unauthorized access attempts and policy violations',
    icon: Lock,
    status: 'monitoring',
  },
  '/dashboard/boss/vala/audit': {
    title: 'Audit Logs',
    description: 'Immutable action logs and compliance records',
    icon: FileText,
    status: 'locked',
  },
  '/dashboard/boss/vala/models': {
    title: 'AI Models',
    description: 'Active AI model registry and performance metrics',
    icon: Brain,
    status: 'active',
  },
  '/dashboard/boss/vala/api-usage': {
    title: 'API Usage',
    description: 'API consumption metrics and rate limiting status',
    icon: BarChart3,
    status: 'active',
  },
  '/dashboard/boss/vala/keys': {
    title: 'Key Health',
    description: 'API key status, rotation, and security checks',
    icon: Key,
    status: 'active',
  },
  '/dashboard/boss/vala/emergency': {
    title: 'Emergency Lock',
    description: 'System-wide emergency controls and kill switches',
    icon: Lock,
    status: 'locked',
  },
  '/dashboard/boss/vala/rollback': {
    title: 'Rollback Authority',
    description: 'Version rollback controls and recovery points',
    icon: RotateCcw,
    status: 'locked',
  },
  '/dashboard/boss/vala/hard-stop': {
    title: 'Hard Stop Rules',
    description: 'Critical operation boundaries and safety limits',
    icon: Shield,
    status: 'locked',
  },
  '/dashboard/boss/vala/logs': {
    title: 'System Logs',
    description: 'Comprehensive system activity and event logs',
    icon: FileText,
    status: 'active',
  },
  '/dashboard/boss/vala/timeline': {
    title: 'Activity Timeline',
    description: 'Chronological view of all VALA AI operations',
    icon: Clock,
    status: 'active',
  },
};

function ValaSubPage() {
  const location = useLocation();
  const config = pageConfig[location.pathname];

  if (!config) {
    return (
      <UltraLuxuryLayout role="boss" variant="boss">
        <SmartFallback 
          type="not-found" 
          dashboardPath="/dashboard/boss/vala"
        />
      </UltraLuxuryLayout>
    );
  }

  const IconComponent = config.icon;

  const getStatusBadge = (status: 'active' | 'monitoring' | 'locked') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">● Active</Badge>;
      case 'monitoring':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">◐ Monitoring</Badge>;
      case 'locked':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">🔒 Locked</Badge>;
    }
  };

  return (
    <UltraLuxuryLayout role="boss" variant="boss">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(var(--luxury-active-bg))] to-[hsl(var(--luxury-card-bg))] border border-[hsl(var(--luxury-border))] flex items-center justify-center">
              <IconComponent className="w-7 h-7 text-[hsl(var(--luxury-icon-active))]" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{config.title}</h1>
                {getStatusBadge(config.status)}
              </div>
              <p className="text-[hsl(var(--luxury-muted-text))] text-sm mt-1">{config.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[hsl(var(--luxury-active-bg))] text-[hsl(var(--luxury-icon-active))] border-[hsl(var(--luxury-border))]">
              <Zap className="w-3 h-3 mr-1" />
              VALA AI
            </Badge>
          </div>
        </div>

        {/* Content Placeholder */}
        <Card className="bg-[hsl(var(--luxury-card-bg))] border-[hsl(var(--luxury-border))]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-[hsl(var(--luxury-icon-active))]" />
              {config.title} Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Card */}
              <div className="p-4 rounded-lg bg-[hsl(var(--luxury-canvas-bg))] border border-[hsl(var(--luxury-border))]">
                <div className="text-[hsl(var(--luxury-muted-text))] text-xs uppercase tracking-wider mb-1">Status</div>
                <div className="text-xl font-bold text-foreground capitalize">{config.status}</div>
              </div>
              
              {/* AI Engine */}
              <div className="p-4 rounded-lg bg-[hsl(var(--luxury-canvas-bg))] border border-[hsl(var(--luxury-border))]">
                <div className="text-[hsl(var(--luxury-muted-text))] text-xs uppercase tracking-wider mb-1">AI Engine</div>
                <div className="text-xl font-bold text-[hsl(var(--luxury-icon-active))]">VALA</div>
              </div>
              
              {/* Last Update */}
              <div className="p-4 rounded-lg bg-[hsl(var(--luxury-canvas-bg))] border border-[hsl(var(--luxury-border))]">
                <div className="text-[hsl(var(--luxury-muted-text))] text-xs uppercase tracking-wider mb-1">Last Update</div>
                <div className="text-xl font-bold text-foreground">Just now</div>
              </div>
            </div>

            {/* Placeholder Message */}
            <div className="mt-6 p-6 rounded-lg border border-dashed border-[hsl(var(--luxury-border))] text-center">
              <IconComponent className="w-12 h-12 mx-auto text-[hsl(var(--luxury-muted-text))] mb-3" />
              <p className="text-[hsl(var(--luxury-muted-text))]">
                {config.title} module is initializing. VALA AI is preparing real-time data streams.
              </p>
              <p className="text-xs text-[hsl(var(--luxury-muted-text))]/60 mt-2">
                This view will populate with live data once the system is fully connected.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Activity Indicator */}
        <div className="flex items-center justify-center gap-2 text-[hsl(var(--luxury-muted-text))] text-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          VALA AI is monitoring this module
        </div>
      </div>
    </UltraLuxuryLayout>
  );
}

export default ValaSubPage;
