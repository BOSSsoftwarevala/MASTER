import { Play, ShoppingCart, Ticket, Plus, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  url: string;
  forEmployees: boolean;
}

const userActions: QuickAction[] = [
  { id: 'demos', label: 'My Demos', icon: Play, url: '/dashboard/boss/productdemo/active', forEmployees: false },
  { id: 'buy', label: 'Buy Now', icon: ShoppingCart, url: '/marketplace', forEmployees: false },
  { id: 'ticket', label: 'Raise Ticket', icon: Ticket, url: '/dashboard/boss/support/tickets/create', forEmployees: false },
];

const employeeActions: QuickAction[] = [
  { id: 'task', label: 'New Task', icon: Plus, url: '/dashboard/boss/devmanager/tasks/create', forEmployees: true },
  { id: 'lead', label: 'New Lead', icon: Users, url: '/dashboard/boss/leads', forEmployees: true },
  { id: 'issue', label: 'Report Issue', icon: AlertCircle, url: '/dashboard/boss/devmanager/bugs/report', forEmployees: true },
];

export function QuickActions() {
  const { isAdmin, isManager, roles } = useUserRoles();
  const navigate = useNavigate();

  const isEmployee = isAdmin() || isManager() || roles.length > 0;
  const actions = isEmployee ? employeeActions : userActions;

  return (
    <div className="hidden md:flex items-center gap-1">
      {actions.slice(0, 3).map((action) => (
        <Tooltip key={action.id}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(action.url)}
            >
              <action.icon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{action.label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
