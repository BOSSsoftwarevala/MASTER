import { useParams, Link, useNavigate } from 'react-router-dom';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, ShoppingCart, Check, Monitor, Globe, Shield, HeadphonesIcon, Heart, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';
import { toast } from 'sonner';
// Sample software details
const softwareDetails: Record<string, {
  name: string;
  description: string;
  longDescription: string;
  features: string[];
  modules: string[];
  techStack: string[];
  countries: string[];
  licenseType: string;
  price: number;
  status: 'live' | 'hot' | 'upcoming';
  screenshots: string[];
}> = {
  'school-erp-pro': {
    name: 'School ERP Pro',
    description: 'Complete school management with fees, exams, transport, and parent portal.',
    longDescription: 'School ERP Pro is a comprehensive school management system designed to streamline all administrative and academic operations. From admissions to alumni management, this solution covers the entire student lifecycle with powerful automation and analytics.',
    features: ['Fee Management', 'Exam Management', 'Transport Tracking', 'Parent Portal', 'Staff HR', 'Library', 'Inventory', 'Reports'],
    modules: ['Admissions', 'Student Management', 'Fee Collection', 'Exam & Grades', 'Attendance', 'Transport', 'Library', 'HR & Payroll', 'Reports & Analytics', 'Parent App', 'Staff App'],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
    countries: ['India', 'UAE', 'Singapore', 'UK', 'USA'],
    licenseType: 'Perpetual with 1 Year Support',
    price: 49999,
    status: 'hot',
    screenshots: [],
  },
};

const defaultSoftware = {
  name: 'Software Product',
  description: 'Premium software solution for your business.',
  longDescription: 'This is a premium software solution designed to streamline your business operations.',
  features: ['Feature 1', 'Feature 2', 'Feature 3'],
  modules: ['Module 1', 'Module 2', 'Module 3'],
  techStack: ['React', 'Node.js', 'PostgreSQL'],
  countries: ['Global'],
  licenseType: 'Perpetual License',
  price: 29999,
  status: 'live' as const,
  screenshots: [],
};

export default function SoftwareDetailPage() {
  const { softwareId } = useParams<{ softwareId: string }>();
  const navigate = useNavigate();
  const { addToCart, updating: cartUpdating } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [addingToCart, setAddingToCart] = useState(false);
  
  const software = softwareId ? softwareDetails[softwareId] || defaultSoftware : defaultSoftware;
  const favorited = softwareId ? isFavorite(softwareId) : false;

  const handleBuyNow = async () => {
    if (!softwareId) return;
    setAddingToCart(true);
    await addToCart(softwareId);
    setAddingToCart(false);
    toast.success('Added to cart!');
    navigate('/marketplace/cart');
  };

  const handleFavorite = async () => {
    if (!softwareId) return;
    await toggleFavorite(softwareId);
  };

  const statusStyles = {
    live: 'bg-green-100 text-green-700 border-green-200',
    hot: 'bg-orange-100 text-orange-700 border-orange-200',
    upcoming: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <div className="min-h-screen bg-white">
      <MarketplaceHeader />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <Link to="/marketplace" className="inline-flex items-center gap-2 text-[#64748B] hover:text-[#0B5ED7] mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left: Screenshots & Demo */}
            <div>
              <div className="bg-[#EAF2FF] rounded-2xl aspect-video flex items-center justify-center mb-4 border border-[#0B5ED7]/20">
                <div className="text-center">
                  <Monitor className="w-16 h-16 text-[#0B5ED7] mb-4 mx-auto" />
                  <p className="text-[#334155] mb-4">Product Screenshots</p>
                  <Link to={`/marketplace/demo/${softwareId}`}>
                    <Button className="bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white hover:opacity-90">
                      <Play className="w-4 h-4 mr-2" />
                      Try Live Demo
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-[0_6px_18px_rgba(15,23,42,0.08)] hover:border-[#0B5ED7] transition-colors">
                  <Globe className="w-5 h-5 text-[#0B5ED7] mb-2" />
                  <p className="text-xs text-[#64748B] mb-1">Supported Countries</p>
                  <p className="text-sm font-medium text-[#0F172A]">{software.countries.length} Countries</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-[0_6px_18px_rgba(15,23,42,0.08)] hover:border-[#0B5ED7] transition-colors">
                  <Shield className="w-5 h-5 text-green-600 mb-2" />
                  <p className="text-xs text-[#64748B] mb-1">License Type</p>
                  <p className="text-sm font-medium text-[#0F172A]">Perpetual</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-[0_6px_18px_rgba(15,23,42,0.08)] hover:border-[#0B5ED7] transition-colors">
                  <HeadphonesIcon className="w-5 h-5 text-[#0B5ED7] mb-2" />
                  <p className="text-xs text-[#64748B] mb-1">Support</p>
                  <p className="text-sm font-medium text-[#0F172A]">1 Year Included</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-[0_6px_18px_rgba(15,23,42,0.08)] hover:border-[#0B5ED7] transition-colors">
                  <Monitor className="w-5 h-5 text-[#0B5ED7] mb-2" />
                  <p className="text-xs text-[#64748B] mb-1">Deployment</p>
                  <p className="text-sm font-medium text-[#0F172A]">Cloud Ready</p>
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className={`uppercase text-xs font-semibold ${statusStyles[software.status]}`}>
                  {software.status}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold text-[#0F172A] mb-4">{software.name}</h1>
              <p className="text-lg text-[#64748B] mb-6">{software.longDescription}</p>

              {/* Price & CTA */}
              <div className="bg-white rounded-2xl p-6 mb-8 border-2 border-[#0B5ED7] shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Fixed Price</p>
                    <p className="text-4xl font-bold text-[#0B5ED7]">₹{software.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#64748B] mb-1">One-time payment</p>
                    <p className="text-sm text-green-600 font-medium">Includes 1 Year Support</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white hover:opacity-90"
                    onClick={handleBuyNow}
                    disabled={addingToCart || cartUpdating}
                  >
                    {addingToCart ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ShoppingCart className="w-4 h-4 mr-2" />
                    )}
                    Buy Now
                  </Button>
                  <Button
                    variant="outline"
                    className={`border-[#0B5ED7] hover:bg-[#0B5ED7]/5 ${favorited ? 'text-red-500 border-red-300' : 'text-[#0B5ED7]'}`}
                    onClick={handleFavorite}
                  >
                    <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                  </Button>
                  <Link to={`/marketplace/demo/${softwareId}`}>
                    <Button variant="outline" className="border-[#0B5ED7] text-[#0B5ED7] hover:bg-[#0B5ED7]/5">
                      <Play className="w-4 h-4 mr-2" />
                      Demo
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#0F172A] mb-4">Key Features</h2>
                <div className="grid grid-cols-2 gap-3">
                  {software.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-[#334155]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modules */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#0F172A] mb-4">Included Modules</h2>
                <div className="flex flex-wrap gap-2">
                  {software.modules.map((module, i) => (
                    <Badge key={i} className="bg-[#0B5ED7]/10 text-[#0B5ED7] border-none hover:bg-[#0B5ED7]/20">
                      {module}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h2 className="text-xl font-semibold text-[#0F172A] mb-4">Technology Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {software.techStack.map((tech, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-[#F7F9FC] text-sm text-[#334155] border border-[#E2E8F0]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MarketplaceFooter />
    </div>
  );
}
