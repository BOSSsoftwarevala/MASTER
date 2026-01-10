import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { HeroSection } from '@/components/marketplace/HeroSection';
import { CategoryStrip } from '@/components/marketplace/CategoryStrip';
import { FeaturedSoftware } from '@/components/marketplace/FeaturedSoftware';
import { TrustSection } from '@/components/marketplace/TrustSection';
import { CareerSection } from '@/components/marketplace/CareerSection';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { GoogleSearchPreview } from '@/components/marketplace/GoogleSearchPreview';
import { GoogleAdBanner } from '@/components/marketplace/GoogleAdBanner';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen marketplace-bg dark">
      <MarketplaceHeader />
      <main>
        <HeroSection />
        <CategoryStrip />
        <FeaturedSoftware />
        <TrustSection />
        <GoogleSearchPreview />
        {/* Google Ad Banner - Replace placeholder with AdSense code in production */}
        <div className="container mx-auto px-6 pb-12">
          <GoogleAdBanner position="bottom" />
        </div>
        <CareerSection />
      </main>
      <MarketplaceFooter />
    </div>
  );
}
