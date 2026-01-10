import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ShoppingCart, Heart, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';

interface SoftwareCardProps {
  id: string;
  name: string;
  description: string;
  features: string[];
  techStack: string[];
  price: number;
  status: 'live' | 'hot' | 'upcoming';
  category: string;
  index?: number;
}

export function SoftwareCard({
  id,
  name,
  description,
  features,
  techStack,
  price,
  status,
  index = 0,
}: SoftwareCardProps) {
  const { addToCart, updating: cartUpdating } = useCart();
  const { toggleFavorite, isFavorite, updating: favUpdating } = useFavorites();
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const statusConfig = {
    live: { label: 'Live', className: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    hot: { label: 'Top Selling', className: 'bg-amber-50 text-amber-600 border-amber-200' },
    upcoming: { label: 'Upcoming', className: 'bg-blue-50 text-blue-600 border-blue-200' },
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartAnimating(true);
    await toggleFavorite(id);
    setTimeout(() => setHeartAnimating(false), 300);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(id);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const favorited = isFavorite(id);

  return (
    <div 
      className="
        bg-white rounded-2xl p-6 border border-gray-100
        shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]
        transition-all duration-200 ease-out
        hover:border-primary hover:shadow-[0_8px_30px_-8px_rgba(59,130,246,0.2)]
        hover:-translate-y-1
        active:scale-[0.97] active:transition-transform active:duration-100
        group cursor-pointer
      "
      style={{ 
        animationDelay: `${index * 50}ms`,
        animation: 'product-card-enter 200ms ease-out forwards',
        opacity: 0,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <Badge 
          variant="outline" 
          className={`text-xs font-medium px-2.5 py-0.5 ${statusConfig[status].className} animate-fade-in`}
        >
          {statusConfig[status].label}
        </Badge>
        <span className="text-xs text-gray-400">Lifetime License</span>
      </div>

      <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary to-blue-600 text-white text-sm font-bold mb-4 group-hover:shadow-[0_0_20px_-4px_rgba(59,130,246,0.5)] transition-shadow duration-200">
        ₹{price.toLocaleString()}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-150">
        {name}
      </h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-1">{description}</p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {techStack.slice(0, 4).map((tech, i) => (
          <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
            {tech}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <Link to={`/marketplace/demo/${id}`} className="flex-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-primary/30 text-primary bg-transparent hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_0_16px_-4px_rgba(59,130,246,0.6)] active:scale-[0.97] transition-all duration-150"
          >
            <Play className="w-4 h-4 mr-1.5 fill-current" />
            Live Demo
          </Button>
        </Link>

        <Button 
          variant="outline" 
          size="sm"
          onClick={handleFavorite}
          disabled={favUpdating}
          className={`px-3 border-gray-200 ${favorited ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:border-red-200'} active:scale-[0.97] transition-all duration-150`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''} ${heartAnimating ? 'animate-[heart-pop_300ms_ease-out]' : ''}`} />
        </Button>

        <Button 
          size="sm"
          onClick={handleAddToCart}
          disabled={cartUpdating || addedToCart}
          className="px-3 bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-[0_4px_16px_-4px_rgba(59,130,246,0.5)] active:scale-[0.96] transition-all duration-150 disabled:opacity-100"
        >
          {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
