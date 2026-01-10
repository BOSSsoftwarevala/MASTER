import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface ValaMetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  default: 'from-blue-600/20 to-indigo-600/20 border-blue-500/30',
  success: 'from-emerald-600/20 to-green-600/20 border-emerald-500/30',
  warning: 'from-amber-600/20 to-orange-600/20 border-amber-500/30',
  danger: 'from-red-600/20 to-rose-600/20 border-red-500/30'
};

const iconVariantStyles = {
  default: 'text-blue-400',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  danger: 'text-red-400'
};

export function ValaMetricCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  variant = 'default'
}: ValaMetricCardProps) {
  return (
    <Card className={cn(
      'bg-gradient-to-br border',
      variantStyles[variant]
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            'p-2 rounded-lg bg-background/50',
            iconVariantStyles[variant]
          )}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            <span className={cn(
              'text-xs font-medium',
              trend === 'up' && 'text-emerald-400',
              trend === 'down' && 'text-red-400',
              trend === 'neutral' && 'text-muted-foreground'
            )}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trend === 'neutral' && '→'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
