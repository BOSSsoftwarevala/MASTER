import { useState, useEffect, useRef } from 'react';
import { Search, Package, Ticket, Users, FileText, ShoppingCart, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'demo' | 'ticket' | 'order' | 'lead' | 'task';
  url: string;
}

const mockResults: SearchResult[] = [
  { id: '1', title: 'CRM Pro Suite', description: 'Enterprise CRM solution', type: 'product', url: '/marketplace/software/crm-pro' },
  { id: '2', title: 'CRM Demo Request', description: 'Demo scheduled for Jan 10', type: 'demo', url: '/dashboard/boss/productdemo/active' },
  { id: '3', title: 'Ticket #1234', description: 'Payment integration issue', type: 'ticket', url: '/dashboard/boss/support/tickets' },
  { id: '4', title: 'Order #5678', description: 'Pending fulfillment', type: 'order', url: '/dashboard/boss/finance/invoices' },
  { id: '5', title: 'Lead: Tech Corp', description: 'Enterprise prospect', type: 'lead', url: '/dashboard/boss/leads' },
  { id: '6', title: 'Fix API Bug', description: 'High priority task', type: 'task', url: '/dashboard/boss/devmanager/tasks' },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { isAdmin, isManager } = useUserRoles();
  const navigate = useNavigate();

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'product': return <Package className="h-4 w-4" />;
      case 'demo': return <FileText className="h-4 w-4" />;
      case 'ticket': return <Ticket className="h-4 w-4" />;
      case 'order': return <ShoppingCart className="h-4 w-4" />;
      case 'lead': return <Users className="h-4 w-4" />;
      case 'task': return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: SearchResult['type']) => {
    const colors: Record<string, string> = {
      product: 'bg-primary/20 text-primary',
      demo: 'bg-info/20 text-info',
      ticket: 'bg-warning/20 text-warning',
      order: 'bg-success/20 text-success',
      lead: 'bg-accent/20 text-accent-foreground',
      task: 'bg-muted text-muted-foreground',
    };
    return <Badge className={`${colors[type]} border-transparent text-[10px]`}>{type}</Badge>;
  };

  const filteredResults = mockResults.filter((result) => {
    // Filter by query
    if (query && !result.title.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    // Filter by role (leads/tasks only for managers/admins)
    if ((result.type === 'lead' || result.type === 'task') && !isManager() && !isAdmin()) {
      return false;
    }
    return true;
  });

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    navigate(result.url);
  };

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-40 lg:w-64 justify-start text-muted-foreground font-normal h-9"
        >
          <Search className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="ml-auto pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 lg:w-96 p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search products, tickets, orders..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Results">
              {filteredResults.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result)}
                  className="flex items-center gap-3 p-2 cursor-pointer"
                >
                  <div className="flex-shrink-0 text-muted-foreground">
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{result.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                  </div>
                  {getTypeBadge(result.type)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
