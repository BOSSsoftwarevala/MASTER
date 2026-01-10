import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Package, 
  Globe, 
  Upload, 
  CheckCircle,
  Shield,
  Clock
} from 'lucide-react';
import { SimplePaymentFlow } from '@/components/payment/SimplePaymentFlow';

const plans = [
  { id: 'monthly', name: 'Monthly', price: 2999, discount: 0 },
  { id: 'yearly', name: 'Yearly', price: 29990, discount: 17 },
  { id: 'lifetime', name: 'Lifetime', price: 99990, discount: 44 },
];

export default function PlaceOrderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productName = searchParams.get('product') || 'School Management Pro';
  
  const [formData, setFormData] = useState({
    domain: '',
    logo: null as File | null,
    plan: 'monthly',
  });
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const selectedPlan = plans.find(p => p.id === formData.plan);

  const generateOrderId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${year}-${random}`;
  };

  const generateProjectId = () => {
    const random = Math.floor(10000 + Math.random() * 90000);
    return `PRJ-${random}`;
  };

  const handlePayNow = () => {
    if (!formData.domain) {
      toast.error('Please enter your domain name');
      return;
    }
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    const orderId = generateOrderId();
    const projectId = generateProjectId();
    
    toast.success('Order confirmed! Redirecting...');
    
    setTimeout(() => {
      navigate(`/portal/franchise/order-status?orderId=${orderId}&projectId=${projectId}&product=${encodeURIComponent(productName)}&plan=${formData.plan}&amount=${selectedPlan?.price}`);
    }, 1000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      toast.success(`Logo uploaded: ${file.name}`);
    }
  };

  return (
    <RoleLayout role="franchise">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Place Order
          </h1>
          <p className="text-muted-foreground mt-2">Complete your order in 3 simple steps</p>
        </div>

        {/* Product Info */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{productName}</h3>
                <p className="text-sm text-muted-foreground">Enterprise Edition • Full License</p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                <Clock className="h-3 w-3 mr-1" />
                2-Hour Delivery
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Step 1: Domain */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">1</div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    Enter Domain Name
                  </CardTitle>
                  <CardDescription>Your software will be deployed here</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Domain Name</Label>
                <Input
                  placeholder="e.g., yourschool.softwarevala.com"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  You can use your own domain or get a free subdomain
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Logo & Plan */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">2</div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-500" />
                    Upload Logo & Select Plan
                  </CardTitle>
                  <CardDescription>Customize your software</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    {formData.logo ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-500">
                        <CheckCircle className="h-5 w-5" />
                        <span>{formData.logo.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload your logo</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Plan Selection */}
              <div className="space-y-2">
                <Label>Select Plan</Label>
                <div className="grid grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setFormData({ ...formData, plan: plan.id })}
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.plan === plan.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-muted hover:border-blue-500/50'
                      }`}
                    >
                      {plan.discount > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-emerald-500">
                          Save {plan.discount}%
                        </Badge>
                      )}
                      <p className="font-semibold">{plan.name}</p>
                      <p className="text-2xl font-bold text-blue-500">₹{plan.price.toLocaleString()}</p>
                      {formData.plan === plan.id && (
                        <CheckCircle className="absolute top-2 left-2 h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Pay Now */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-3xl font-bold text-emerald-500">
                    ₹{selectedPlan?.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>Secure payment by Software Vala</span>
                  </div>
                </div>
                <Button 
                  onClick={handlePayNow}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Simple Payment Flow Modal */}
      <SimplePaymentFlow
        amount={selectedPlan?.price || 0}
        currency="₹"
        onSuccess={handlePaymentSuccess}
        isOpen={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
      />
    </RoleLayout>
  );
}
