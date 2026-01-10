import { ReactNode } from 'react';
import { UltraLuxuryLayout } from '@/components/layout/UltraLuxuryLayout';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Zap, Activity, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { VALA_AI_IDENTITY } from '@/hooks/useValaAI';

interface ValaScreenLayoutProps {
  /** Page title displayed in the header */
  title: string;
  /** Page icon displayed next to title */
  icon?: LucideIcon;
  /** Current AI state indicator */
  aiState?: 'active' | 'monitoring' | 'locked';
  /** Children for the main content area */
  children: ReactNode;
  /** Optional footer content */
  footer?: ReactNode;
  /** Optional side panel content */
  sidePanel?: ReactNode;
  /** Side panel width class */
  sidePanelWidth?: string;
}

const getStateConfig = (state: 'active' | 'monitoring' | 'locked') => {
  switch (state) {
    case 'active':
      return { label: 'AI ACTIVE', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    case 'monitoring':
      return { label: 'MONITORING', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    case 'locked':
      return { label: 'LOCKED', className: 'bg-red-500/20 text-red-400 border-red-500/30' };
  }
};

export function ValaScreenLayout({
  title,
  icon: Icon = Zap,
  aiState = 'active',
  children,
  footer,
  sidePanel,
  sidePanelWidth = 'w-80'
}: ValaScreenLayoutProps) {
  const stateConfig = getStateConfig(aiState);

  return (
    <UltraLuxuryLayout role="boss" variant="boss">
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* ===== HEADER SECTION ===== */}
        <header className="flex-shrink-0 pb-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Role Badge + Title */}
            <div className="flex items-center gap-4">
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg">
                <Icon className="h-6 w-6 text-white" />
                <div className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-emerald-400 rounded-full border-2 border-background animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                    {VALA_AI_IDENTITY.BADGE} VALA AI
                  </Badge>
                  <h1 className="text-xl font-bold text-foreground">{title}</h1>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {VALA_AI_IDENTITY.ROLE_CODE} • System Brain
                </p>
              </div>
            </div>

            {/* Right: Status Indicator + Alerts */}
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={stateConfig.className}>
                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                {stateConfig.label}
              </Badge>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Last sync: Just now</span>
              </div>
            </div>
          </div>
        </header>

        {/* ===== MAIN CONTENT AREA ===== */}
        <div className="flex-1 flex gap-4 pt-4 overflow-hidden">
          {/* Main Content */}
          <div className={`flex-1 flex flex-col overflow-hidden ${sidePanel ? '' : 'w-full'}`}>
            <ScrollArea className="flex-1">
              <div className="space-y-4 pr-2">
                {children}
              </div>
            </ScrollArea>
          </div>

          {/* Side Panel (optional) */}
          {sidePanel && (
            <aside className={`${sidePanelWidth} flex-shrink-0 overflow-hidden`}>
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {sidePanel}
                </div>
              </ScrollArea>
            </aside>
          )}
        </div>

        {/* ===== FOOTER SECTION ===== */}
        {footer && (
          <footer className="flex-shrink-0 pt-4 border-t border-border/30 mt-4">
            {footer}
          </footer>
        )}
      </div>
    </UltraLuxuryLayout>
  );
}
