import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Building2, 
  Heart, 
  ShoppingCart, 
  Landmark, 
  Truck, 
  Factory, 
  Wrench, 
  Hotel, 
  Building, 
  Users, 
  MoreHorizontal 
} from 'lucide-react';

const categories = [
  { id: 'education', name: 'Education', icon: GraduationCap, count: 24 },
  { id: 'real-estate', name: 'Real Estate', icon: Building2, count: 18 },
  { id: 'healthcare', name: 'Healthcare', icon: Heart, count: 32 },
  { id: 'ecommerce', name: 'E-Commerce', icon: ShoppingCart, count: 45, popular: true },
  { id: 'finance', name: 'Finance', icon: Landmark, count: 28 },
  { id: 'logistics', name: 'Logistics', icon: Truck, count: 15 },
  { id: 'manufacturing', name: 'Manufacturing', icon: Factory, count: 22 },
  { id: 'service', name: 'Service', icon: Wrench, count: 38 },
  { id: 'hospitality', name: 'Hospitality', icon: Hotel, count: 19 },
  { id: 'government', name: 'Government', icon: Building, count: 12 },
  { id: 'ngo', name: 'NGO', icon: Users, count: 8 },
  { id: 'more', name: 'More...', icon: MoreHorizontal },
];

export function CategoryStrip() {
  return (
    <section className="py-8 border-b border-border/30 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-stretch gap-3 overflow-x-auto pb-3 marketplace-scrollbar">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={`/marketplace/category/${category.id}`}
                className="category-card group"
                style={{ 
                  animationDelay: `${index * 40}ms`,
                }}
              >
                {/* Card Container */}
                <div className="relative flex flex-col items-center gap-2.5 min-w-[90px] p-4 rounded-2xl bg-card border border-border/50 shadow-sm transition-all duration-150 ease-out group-hover:border-primary/60 group-hover:shadow-md group-hover:-translate-y-[3px] group-focus-visible:border-primary group-focus-visible:ring-2 group-focus-visible:ring-primary/30 group-active:scale-[0.97]">
                  
                  {/* Icon Container */}
                  <div className="relative w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-150 group-hover:bg-primary/15">
                    <Icon className="w-5 h-5 text-primary transition-all duration-150 group-hover:text-primary group-hover:drop-shadow-[0_0_6px_hsl(var(--primary)/0.5)]" />
                    
                    {/* Glow Ring on Hover */}
                    <div className="absolute inset-0 rounded-xl border-2 border-primary/0 transition-all duration-150 group-hover:border-primary/30" />
                  </div>
                  
                  {/* Category Name */}
                  <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-150 text-center whitespace-nowrap">
                    {category.name}
                  </span>
                  
                  {/* Software Count Badge */}
                  {category.count && (
                    <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-muted text-muted-foreground rounded-full animate-fade-in">
                      {category.count}
                    </span>
                  )}
                  
                  {/* Popular Badge */}
                  {category.popular && (
                    <span className="absolute -top-1.5 -left-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full animate-fade-in">
                      Hot
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}