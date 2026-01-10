import { Link, useNavigate } from 'react-router-dom';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Trash2, Loader2, Shield } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import { PaymentButtons } from '@/components/payment/SimplePaymentFlow';
import { toast } from 'sonner';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, loading, removeFromCart, total, updating } = useCart();

  const gstAmount = Math.round(total * 0.18);
  const grandTotal = total + gstAmount;

  const handlePaymentSuccess = () => {
    toast.success('Order confirmed! Redirecting to dashboard...');
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen marketplace-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen marketplace-bg">
      <MarketplaceHeader />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <Link to="/marketplace" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-8">Your Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-foreground mb-2">Your cart is empty</p>
                  <p className="text-muted-foreground mb-6">Browse our marketplace to find software</p>
                  <Link to="/marketplace">
                    <Button>Browse Marketplace</Button>
                  </Link>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="glass-card rounded-xl p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.product?.name || 'Product'}</h3>
                      <p className="text-sm text-muted-foreground">Perpetual License • 1 Year Support</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xl font-bold text-gradient">₹{(item.product?.price || 0).toLocaleString()}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFromCart(item.id)} 
                        disabled={updating}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="glass-card rounded-2xl p-6 h-fit">
                <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="text-foreground">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="text-foreground">₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-foreground/10 pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-gradient">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Buttons with Demo Option */}
                <PaymentButtons
                  amount={grandTotal}
                  currency="₹"
                  onSuccess={handlePaymentSuccess}
                  showDemoButton={true}
                />

                <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-2">
                  <Shield className="w-3 h-3" />
                  Secure payment by Software Vala
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <MarketplaceFooter />
    </div>
  );
}
