import { Settings, Moon, Sun, Bell, BellOff, Monitor, Clock } from 'lucide-react';
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
import { useState } from 'react';

export function QuickSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const sessionStart = new Date();
  sessionStart.setHours(sessionStart.getHours() - 2);
  const sessionDuration = '2h 15m';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Quick Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Theme - Read Only */}
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              <Monitor className="h-4 w-4" />
              Theme
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Sun className="h-3 w-3" />
              System
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Theme follows system preference
          </p>
        </div>

        <DropdownMenuSeparator />

        {/* Notifications Toggle */}
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              Notifications
            </span>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
              className="scale-75"
            />
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              <Bell className="h-4 w-4" />
              Sound Alerts
            </span>
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
              className="scale-75"
            />
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Session Info */}
        <div className="px-2 py-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Session Info</span>
          </div>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <p>Duration: {sessionDuration}</p>
            <p>Started: {sessionStart.toLocaleTimeString()}</p>
            <p>Device: Desktop • Chrome</p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
