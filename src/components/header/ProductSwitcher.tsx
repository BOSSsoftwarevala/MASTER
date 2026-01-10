import { useState } from 'react';
import { LayoutGrid, Monitor, Package, Smartphone, Globe, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  icon: React.ElementType;
  status: 'active' | 'demo' | 'inactive';
}

const products: Product[] = [
  { id: 'erp', name: 'ERP Suite', icon: Monitor, status: 'active' },
  { id: 'crm', name: 'CRM Pro', icon: Package, status: 'active' },
  { id: 'mobile', name: 'Mobile App', icon: Smartphone, status: 'demo' },
  { id: 'website', name: 'Website Builder', icon: Globe, status: 'inactive' },
  { id: 'hosting', name: 'Cloud Hosting', icon: Server, status: 'active' },
];

export function ProductSwitcher() {
  const [activeProduct, setActiveProduct] = useState<Product>(products[0]);

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/20">Active</Badge>;
      case 'demo':
        return <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/20">Demo</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground">Inactive</Badge>;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Switch Product
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {products.map((product) => (
          <DropdownMenuItem
            key={product.id}
            onClick={() => setActiveProduct(product)}
            className={`flex items-center justify-between ${activeProduct.id === product.id ? 'bg-accent' : ''}`}
          >
            <span className="flex items-center gap-2">
              <product.icon className="h-4 w-4" />
              <span>{product.name}</span>
            </span>
            {getStatusBadge(product.status)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs text-muted-foreground">
          Current: {activeProduct.name}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
