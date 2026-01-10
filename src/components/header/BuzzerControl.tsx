import { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type RoleType = 'franchise' | 'reseller' | 'developer' | 'influencer' | 'support';

interface BuzzerControlProps {
  role: RoleType;
}

interface BuzzerEvent {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  priority: 'normal' | 'high' | 'critical';
}

const roleAlertTypes: Record<RoleType, string[]> = {
  developer: ['Critical Task', 'Build Failed', 'Code Review', 'Deployment'],
  reseller: ['New Lead', 'Follow-up Due', 'SLA Breach', 'Deal Closing'],
  franchise: ['New Application', 'Compliance Alert', 'Territory Issue', 'Revenue Alert'],
  influencer: ['New Campaign', 'Content Due', 'Bonus Unlocked', 'Payment Ready'],
  support: ['New Ticket', 'Escalation', 'SLA Breach', 'VIP Customer'],
};

export function BuzzerControl({ role }: BuzzerControlProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [visualEnabled, setVisualEnabled] = useState(true);
  const [recentEvents, setRecentEvents] = useState<BuzzerEvent[]>([]);
  const [isFlashing, setIsFlashing] = useState(false);
  const { toast } = useToast();

  // Play sound effect
  const playBuzzerSound = useCallback(() => {
    if (!soundEnabled) return;
    
    try {
      // Create a simple beep using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
      
      // Second beep
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 1000;
        osc2.type = 'sine';
        gain2.gain.value = 0.3;
        osc2.start();
        osc2.stop(audioContext.currentTime + 0.15);
      }, 250);
    } catch (e) {
      console.log('Audio not available');
    }
  }, [soundEnabled]);

  // Trigger visual flash
  const triggerFlash = useCallback(() => {
    if (!visualEnabled) return;
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 1000);
  }, [visualEnabled]);

  // Simulate incoming alert (in production, this would be from realtime subscription)
  const triggerBuzzer = useCallback((event: Omit<BuzzerEvent, 'id' | 'timestamp'>) => {
    const newEvent: BuzzerEvent = {
      ...event,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setRecentEvents(prev => [newEvent, ...prev.slice(0, 4)]);
    
    if (soundEnabled) playBuzzerSound();
    if (visualEnabled) triggerFlash();
    
    toast({
      title: `🔔 ${event.type}`,
      description: event.message,
      variant: event.priority === 'critical' ? 'destructive' : 'default',
    });
  }, [soundEnabled, visualEnabled, playBuzzerSound, triggerFlash, toast]);

  // Demo: simulate random alerts (remove in production)
  useEffect(() => {
    const alertTypes = roleAlertTypes[role];
    const interval = setInterval(() => {
      // 5% chance of alert every 30 seconds (for demo)
      if (Math.random() < 0.05) {
        const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        triggerBuzzer({
          type,
          message: `New ${type.toLowerCase()} requires your attention`,
          priority: Math.random() < 0.2 ? 'critical' : Math.random() < 0.5 ? 'high' : 'normal',
        });
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [role, triggerBuzzer]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    toast({
      title: soundEnabled ? '🔕 Sound Muted' : '🔊 Sound Enabled',
      description: soundEnabled ? 'You won\'t hear alert sounds' : 'Alert sounds are now active',
    });
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`relative gap-2 transition-all ${
                isFlashing ? 'animate-pulse bg-warning/20 ring-2 ring-warning' : ''
              }`}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-success" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="hidden lg:inline text-sm">Buzzer</span>
              {recentEvents.length > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[10px] p-0"
                >
                  {recentEvents.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          Alert Buzzer ({soundEnabled ? 'Active' : 'Silent'})
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Alert Buzzer Controls
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Sound Toggle */}
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              {soundEnabled ? <Volume2 className="h-4 w-4 text-success" /> : <VolumeX className="h-4 w-4" />}
              Sound Alerts
            </span>
            <Switch
              checked={soundEnabled}
              onCheckedChange={toggleSound}
              className="scale-75"
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {soundEnabled ? 'Beep on important events' : 'Silent mode active'}
          </p>
        </div>

        {/* Visual Toggle */}
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              <Bell className="h-4 w-4" />
              Visual Flash
            </span>
            <Switch
              checked={visualEnabled}
              onCheckedChange={setVisualEnabled}
              className="scale-75"
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Screen highlight on alerts
          </p>
        </div>

        <DropdownMenuSeparator />

        {/* Alert Types for this role */}
        <div className="px-2 py-2">
          <p className="text-xs font-medium mb-2">Active Alert Types</p>
          <div className="flex flex-wrap gap-1">
            {roleAlertTypes[role].map((type) => (
              <Badge key={type} variant="outline" className="text-[10px]">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        {recentEvents.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-2">
              <p className="text-xs font-medium mb-2">Recent Alerts</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {recentEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className={`text-[10px] p-1.5 rounded ${
                      event.priority === 'critical' 
                        ? 'bg-destructive/10 text-destructive' 
                        : 'bg-muted'
                    }`}
                  >
                    <span className="font-medium">{event.type}:</span> {event.message}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <DropdownMenuSeparator />
        
        {/* Test Button */}
        <DropdownMenuItem 
          onClick={() => triggerBuzzer({ 
            type: 'Test Alert', 
            message: 'This is a test buzzer alert', 
            priority: 'normal' 
          })}
        >
          <Bell className="mr-2 h-4 w-4" />
          Test Buzzer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
