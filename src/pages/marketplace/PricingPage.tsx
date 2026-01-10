import { Link } from 'react-router-dom';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ShoppingCart, Shield, Clock, HeadphonesIcon, Star, Lock, Award } from 'lucide-react';

const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small businesses getting started',
    price: 19999,
    popular: false,
    features: [
      'Single user license',
      'Core modules included',
      '6 months support',
      'Email assistance',
      'Basic documentation',
      'Community access',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Best for growing businesses and teams',
    price: 49999,
    popular: true,
    features: [
      'Up to 5 user licenses',
      'All modules included',
      '1 year priority support',
      'Phone & email support',
      'Video tutorials',
      'API access',
      'Custom branding',
      'Data backup included',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    price: 99999,
    popular: false,
    features: [
      'Unlimited user licenses',
      'All modules + custom',
      'Lifetime support',
      'Dedicated account manager',
      'On-site training',
      'Full API access',
      'White-label option',
      'SLA guarantee',
      'Priority bug fixes',
      'Custom integrations',
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MarketplaceHeader />
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section 
          className="py-16 bg-white border-b border-gray-100"
          style={{ animation: 'pricing-hero-enter 300ms ease-out forwards' }}
        >
          <div className="container mx-auto px-6 text-center">
            <Badge 
              className="mb-4 bg-primary/10 text-primary border-primary/20 animate-fade-in"
            >
              Simple Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Transparent, Fixed Pricing
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
              One-time payment, lifetime license. No hidden fees, no subscriptions, no surprises.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Genuine License</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <HeadphonesIcon className="w-5 h-5 text-primary" />
                <span>Expert Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`
                    relative bg-white rounded-[18px] p-8 
                    shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)]
                    transition-all duration-200 ease-out
                    hover:-translate-y-1 hover:shadow-[0_8px_32px_-8px_rgba(59,130,246,0.15)]
                    ${plan.popular ? 'border-2 border-primary ring-4 ring-primary/10' : 'border border-gray-100'}
                  `}
                  style={{ 
                    animationDelay: `${index * 60}ms`,
                    animation: 'pricing-card-enter 220ms ease-out forwards',
                    opacity: 0,
                  }}
                >
                  {plan.popular && (
                    <div 
                      className="absolute -top-4 left-1/2 -translate-x-1/2"
                      style={{ animation: 'popular-badge-glow 600ms ease-out forwards' }}
                    >
                      <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white border-none px-4 py-1.5 shadow-lg">
                        <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>

                  <div className="text-center mb-6 group">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-gray-900 transition-colors duration-150 group-hover:text-primary">
                        ₹{plan.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">One-time payment • Lifetime license</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li 
                        key={i} 
                        className="flex items-center gap-3 group/item py-1.5 px-2 -mx-2 rounded-lg transition-colors duration-150 hover:bg-gray-50"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 transition-colors duration-150 group-hover/item:bg-emerald-100">
                          <Check className="w-3 h-3 text-emerald-500" />
                        </div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`
                      w-full transition-all duration-150
                      hover:-translate-y-0.5 hover:shadow-[0_4px_16px_-4px_rgba(59,130,246,0.5)]
                      active:scale-[0.96] active:translate-y-0
                      ${plan.popular
                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white'
                        : 'bg-primary text-white hover:bg-primary/90'
                      }
                    `}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy {plan.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Banner */}
        <section 
          className="py-12 bg-white border-t border-b border-gray-100"
          style={{ animation: 'trust-strip-enter 400ms ease-out 400ms forwards', opacity: 0 }}
        >
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                100% Genuine Software • No Copy • No Crack
              </h2>
              <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
                Every license is verified and comes with full documentation, source code access, and dedicated support.
                Your investment is protected with our trust-first policy.
              </p>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Award className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium">Genuine License</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <HeadphonesIcon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Support Included</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section 
          className="py-16 bg-gray-50"
          style={{ animation: 'faq-enter 300ms ease-out 500ms forwards', opacity: 0 }}
        >
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Have Questions?</h2>
            <p className="text-gray-500 mb-6">
              Check our FAQ or contact our sales team for personalized assistance.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/marketplace">
                <Button 
                  variant="outline" 
                  className="
                    border-primary/30 text-primary bg-transparent
                    hover:bg-primary hover:text-white hover:border-primary
                    active:scale-[0.97]
                    transition-all duration-150
                  "
                >
                  Browse Software
                </Button>
              </Link>
              <Button 
                className="
                  bg-gradient-to-r from-primary to-blue-600 text-white
                  hover:-translate-y-0.5 hover:shadow-[0_4px_16px_-4px_rgba(59,130,246,0.5)]
                  active:scale-[0.96]
                  transition-all duration-150
                "
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>
      <MarketplaceFooter />
    </div>
  );
}
