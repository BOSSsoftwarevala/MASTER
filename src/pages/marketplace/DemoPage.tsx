import { useParams, Link } from 'react-router-dom';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, ShoppingCart, AlertTriangle, Play, Shield, Zap, Loader2, ExternalLink } from 'lucide-react';
import { useDemo } from '@/hooks/useDemo';
import { useCart } from '@/hooks/useCart';
import { useState, useEffect } from 'react';

export default function DemoPage() {
  const { softwareId } = useParams<{ softwareId: string }>();
  const { startDemo, currentDemo, loading, getActiveDemo, extendDemo } = useDemo();
  const { addToCart, updating: cartUpdating } = useCart();
  const [demoActive, setDemoActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [existingDemo, setExistingDemo] = useState<any>(null);

  useEffect(() => {
    if (softwareId) {
      getActiveDemo(softwareId).then(demo => {
        if (demo) {
          setExistingDemo(demo);
          setDemoActive(true);
        }
      });
    }
  }, [softwareId, getActiveDemo]);

  useEffect(() => {
    const demo = existingDemo || currentDemo;
    if (!demo?.expires_at) return;

    const updateTime = () => {
      const now = new Date();
      const expiry = new Date(demo.expires_at);
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Expired');
        setDemoActive(false);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`${hours}h ${minutes}m remaining`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [existingDemo, currentDemo]);

  const handleStartDemo = async () => {
    if (!softwareId) return;
    const demo = await startDemo(softwareId);
    if (demo) {
      setDemoActive(true);
      setExistingDemo(demo);
    }
  };

  const handleExtendDemo = async () => {
    const demo = existingDemo || currentDemo;
    if (demo?.id) {
      await extendDemo(demo.id);
      // Refresh demo
      if (softwareId) {
        const updated = await getActiveDemo(softwareId);
        setExistingDemo(updated);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!softwareId) return;
    await addToCart(softwareId);
  };

  const productName = softwareId 
    ? softwareId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') 
    : 'Live Demo';

  const activeDemo = existingDemo || currentDemo;

  return (
    <div className="min-h-screen marketplace-bg dark">
      <MarketplaceHeader />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <Link to={softwareId ? `/marketplace/software/${softwareId}` : '/marketplace'} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* Demo Header Card */}
            <div className="glass-card rounded-2xl p-8 mb-6 border-primary/30">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Badge className={`border-none mb-3 ${demoActive ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
                    {demoActive ? 'DEMO ACTIVE' : 'DEMO MODE'}
                  </Badge>
                  <h1 className="text-2xl font-bold text-foreground">
                    {productName}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {demoActive && timeRemaining ? timeRemaining : 'Start demo to begin'}
                  </span>
                </div>
              </div>

              {/* Demo Restrictions Notice */}
              <div className="bg-warning/10 rounded-xl p-4 mb-6 border border-warning/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning mb-1">Demo Limitations</p>
                    <ul className="text-xs text-warning/80 space-y-1">
                      <li>• Limited access to features</li>
                      <li>• Data will be reset after session</li>
                      <li>• No copy or export functionality</li>
                      <li>• Auto-expires after 24 hours</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Demo Frame */}
              <div className="glass-icon rounded-xl aspect-video flex items-center justify-center mb-6 relative overflow-hidden">
                {demoActive && activeDemo ? (
                  <div className="text-center relative z-10">
                    <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-success" />
                    </div>
                    <p className="text-lg font-medium text-foreground mb-2">Demo is Active</p>
                    <p className="text-sm text-muted-foreground mb-2">Access Code: {activeDemo.access_code}</p>
                    <p className="text-sm text-muted-foreground mb-6">{timeRemaining}</p>
                    <div className="flex gap-3 justify-center">
                      <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Demo
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleExtendDemo}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Extend +24h
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center relative z-10">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-lg font-medium text-foreground mb-2">Demo Environment Ready</p>
                    <p className="text-sm text-muted-foreground mb-6">Experience the full software in a sandbox environment</p>
                    <Button 
                      onClick={handleStartDemo}
                      disabled={loading}
                      className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Launch Demo
                    </Button>
                  </div>
                )}
              </div>

              {/* Upgrade CTA */}
              <div className="text-center bg-primary/10 rounded-xl p-6 border border-primary/20">
                <p className="text-foreground/80 mb-4">Want the full version with all features?</p>
                <Button 
                  size="lg" 
                  onClick={handleAddToCart}
                  disabled={cartUpdating}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                >
                  {cartUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Demo Access Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="glass-card rounded-xl p-6 text-center hover:border-primary/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-1">One-Click Access</h3>
                <p className="text-sm text-muted-foreground">Instant demo, no signup required</p>
              </div>
              <div className="glass-card rounded-xl p-6 text-center hover:border-primary/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-1">Secure Sandbox</h3>
                <p className="text-sm text-muted-foreground">Isolated environment, no data leak</p>
              </div>
              <div className="glass-card rounded-xl p-6 text-center hover:border-primary/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-medium text-foreground mb-1">Easy Upgrade</h3>
                <p className="text-sm text-muted-foreground">Buy anytime to deploy live</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MarketplaceFooter />
    </div>
  );
}
