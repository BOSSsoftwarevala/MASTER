import { ExternalLink, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface GoogleAdBannerProps {
  position?: 'top' | 'bottom' | 'sidebar';
}

export function GoogleAdBanner({ position = 'bottom' }: GoogleAdBannerProps) {
  // This is a placeholder for Google AdSense integration
  // In production, replace with actual AdSense code:
  // <ins className="adsbygoogle" data-ad-client="ca-pub-XXXXX" data-ad-slot="XXXXX" />
  
  const isHorizontal = position === 'top' || position === 'bottom';
  
  return (
    <div className={`relative ${isHorizontal ? 'w-full' : 'w-full md:w-80'}`}>
      {/* Ad Container */}
      <div 
        className={`
          glass-card rounded-xl overflow-hidden
          ${isHorizontal ? 'h-24 md:h-28' : 'h-64 md:h-80'}
        `}
      >
        {/* Ad Label */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium px-2 py-0.5 rounded bg-background/50">
            Ad
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3 h-3 text-muted-foreground/40 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">This space is reserved for Google Ads</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Placeholder Content */}
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-muted/5 to-muted/10">
          <div className="text-center">
            {/* Placeholder Icon Grid */}
            <div className={`grid ${isHorizontal ? 'grid-cols-4 gap-3' : 'grid-cols-2 gap-4'} mb-3`}>
              {[
                { bg: 'bg-blue-500/20', text: 'text-blue-400' },
                { bg: 'bg-red-500/20', text: 'text-red-400' },
                { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
                { bg: 'bg-green-500/20', text: 'text-green-400' },
              ].map((color, i) => (
                <div 
                  key={i} 
                  className={`${isHorizontal ? 'w-10 h-10' : 'w-12 h-12'} rounded-lg ${color.bg} flex items-center justify-center`}
                >
                  <ExternalLink className={`${isHorizontal ? 'w-4 h-4' : 'w-5 h-5'} ${color.text}`} />
                </div>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground/50 max-w-[200px]">
              Ad space available
            </p>
          </div>
        </div>
      </div>

      {/* Google AdSense Script Placeholder Comment */}
      {/* 
        To enable Google Ads:
        1. Sign up for Google AdSense
        2. Add your AdSense script to index.html
        3. Replace this placeholder with:
        <ins 
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
          data-ad-slot="YOUR_AD_SLOT"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      */}
    </div>
  );
}