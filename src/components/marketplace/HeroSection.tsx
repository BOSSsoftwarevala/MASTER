import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, ShoppingBag, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-icon mb-8">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-foreground">4000+ Premium Software Products</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Premium Software
            <span className="block text-gradient">Marketplace</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Discover, demo, and deploy enterprise-grade software solutions. 
            Fixed pricing, genuine licenses, and AI-powered customization.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/marketplace/categories">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 px-8 glow-primary">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Browse Software
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/marketplace/demo">
              <Button size="lg" variant="outline" className="border-foreground/20 hover:border-primary/50 hover:bg-primary/5 px-8">
                <Play className="w-5 h-5 mr-2" />
                Try Live Demo
              </Button>
            </Link>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['No Crack Software', 'Fixed Pricing', 'AI Customization', 'Global Support'].map((feature) => (
              <span key={feature} className="px-4 py-2 rounded-full glass-icon text-sm font-medium text-foreground/70">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
