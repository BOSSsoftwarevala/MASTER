import { useState, useEffect } from 'react';
import { Gift, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Offer {
  id: string;
  title: string;
  description: string;
  region: string;
  expiresAt: Date;
  type: 'discount' | 'seasonal' | 'festival' | 'promo';
}

const mockOffers: Offer[] = [
  {
    id: '1',
    title: '🎉 New Year Special',
    description: 'Get 25% off on all annual plans',
    region: 'global',
    expiresAt: new Date('2026-01-15'),
    type: 'seasonal',
  },
  {
    id: '2',
    title: '🚀 Launch Offer',
    description: 'First 100 users get premium features free',
    region: 'global',
    expiresAt: new Date('2026-02-01'),
    type: 'promo',
  },
  {
    id: '3',
    title: '💼 Enterprise Deal',
    description: 'Custom pricing for teams of 50+',
    region: 'global',
    expiresAt: new Date('2026-03-31'),
    type: 'discount',
  },
];

export function OfferSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || mockOffers.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockOffers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  if (!isVisible || mockOffers.length === 0) return null;

  const currentOffer = mockOffers[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + mockOffers.length) % mockOffers.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mockOffers.length);
  };

  return (
    <div
      className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Gift className="h-4 w-4 text-primary shrink-0" />
      
      <div className="flex items-center gap-2 min-w-0 max-w-xs">
        <span className="text-xs font-medium truncate">
          {currentOffer.title}
        </span>
        <span className="text-xs text-muted-foreground truncate hidden xl:inline">
          — {currentOffer.description}
        </span>
      </div>

      {mockOffers.length > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <span className="text-[10px] text-muted-foreground">
            {currentIndex + 1}/{mockOffers.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={handleNext}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
