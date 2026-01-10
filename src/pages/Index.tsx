import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ShoppingBag, LayoutDashboard, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen marketplace-bg dark flex items-center justify-center p-6">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
            <Sparkles className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-foreground">Software Vala</h1>
            <p className="text-sm text-muted-foreground">The Name of Trust</p>
          </div>
        </div>

        {/* Main Content */}
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          Premium Software
          <span className="block text-gradient">Marketplace & Platform</span>
        </h2>

        <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
          Discover 4000+ enterprise-grade software solutions. Demo, buy, and deploy with AI-powered customization.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/marketplace">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 px-8 h-12">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Browse Marketplace
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline" className="border-foreground/20 hover:border-primary/50 hover:bg-primary/5 px-8 h-12">
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Admin Dashboard
            </Button>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {['4000+ Products', '10+ Countries', '52+ Franchises', 'AI Customization'].map((badge) => (
            <span key={badge} className="px-4 py-2 rounded-full glass-icon text-sm font-medium text-foreground/70">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
