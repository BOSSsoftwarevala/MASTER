import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CreditCard, Smartphone, Globe, Wallet, Bitcoin, Shield, Check, X, Loader2, PlayCircle } from 'lucide-react';

interface PaymentOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const paymentOptions: PaymentOption[] = [
  { id: 'card', label: 'Card', icon: <CreditCard className="w-6 h-6" /> },
  { id: 'upi', label: 'UPI', icon: <Smartphone className="w-6 h-6" /> },
  { id: 'paypal', label: 'PayPal', icon: <Wallet className="w-6 h-6" /> },
  { id: 'wise', label: 'Wise', icon: <Globe className="w-6 h-6" /> },
  { id: 'crypto', label: 'Crypto', icon: <Bitcoin className="w-6 h-6" /> },
];

interface SimplePaymentFlowProps {
  amount: number;
  currency?: string;
  onSuccess?: () => void;
  onClose?: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isDemo?: boolean;
}

type PaymentState = 'select' | 'processing' | 'success' | 'failed' | 'demo-success';

export function SimplePaymentFlow({
  amount,
  currency = '₹',
  onSuccess,
  onClose,
  isOpen,
  onOpenChange,
  isDemo = false,
}: SimplePaymentFlowProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [paymentState, setPaymentState] = useState<PaymentState>('select');

  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    setPaymentState('processing');
    
    // Simulate gateway processing
    await new Promise(resolve => setTimeout(resolve, isDemo ? 1500 : 2000));
    
    if (isDemo) {
      // Demo mode always succeeds
      setPaymentState('demo-success');
    } else {
      // 90% success rate simulation for real payments
      const success = Math.random() > 0.1;
      setPaymentState(success ? 'success' : 'failed');
      
      if (success && onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    }
  };

  const handleRetry = () => {
    setPaymentState('select');
    setSelectedMethod(null);
  };

  const handleClose = () => {
    setPaymentState('select');
    setSelectedMethod(null);
    onOpenChange(false);
    if (onClose) onClose();
  };

  const handleGoToDashboard = () => {
    handleClose();
    if (onSuccess) onSuccess();
  };

  const handleProceedToRealPayment = () => {
    setPaymentState('select');
    setSelectedMethod(null);
    onOpenChange(false);
    // The parent will handle opening real payment
    if (onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background border-border">
        {/* Demo Mode Banner */}
        {isDemo && paymentState !== 'demo-success' && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center">
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
              Demo Mode — No real payment will be charged.
            </p>
          </div>
        )}

        {/* Processing State */}
        {paymentState === 'processing' && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {isDemo ? 'Simulating Payment' : 'Processing Payment'}
            </h2>
            <p className="text-muted-foreground">Please wait...</p>
          </div>
        )}

        {/* Real Payment Success State */}
        {paymentState === 'success' && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Check className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful</h2>
            <p className="text-muted-foreground mb-8">Your order is confirmed.</p>
            <Button 
              onClick={handleGoToDashboard}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              size="lg"
            >
              Go to Dashboard
            </Button>
          </div>
        )}

        {/* Demo Success State */}
        {paymentState === 'demo-success' && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Check className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Demo Payment Successful</h2>
            <p className="text-muted-foreground mb-2">This was only a demo.</p>
            <p className="text-sm text-muted-foreground mb-8">No money was charged.</p>
            <div className="space-y-3">
              <Button 
                onClick={handleProceedToRealPayment}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                Proceed to Real Payment
              </Button>
              <Button 
                onClick={handleClose}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}

        {/* Failed State */}
        {paymentState === 'failed' && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <X className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Payment Failed</h2>
            <p className="text-muted-foreground mb-8">Something went wrong. Please try again.</p>
            <Button 
              onClick={handleRetry}
              className="w-full"
              size="lg"
            >
              Retry Payment
            </Button>
          </div>
        )}

        {/* Select Payment Method State */}
        {paymentState === 'select' && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-border text-center">
              <h2 className="text-xl font-semibold text-foreground">
                {isDemo ? 'Try Demo Payment' : 'Complete Your Payment'}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Secure payment by Software Vala</span>
              </div>
            </div>

            {/* Amount Display */}
            <div className="px-6 pt-6 pb-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">
                {isDemo ? 'Demo amount' : 'Amount to pay'}
              </p>
              <p className="text-3xl font-bold text-foreground">{currency}{amount.toLocaleString()}</p>
            </div>

            {/* Payment Options */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-5 gap-3">
                {paymentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedMethod(option.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                      selectedMethod === option.id
                        ? isDemo 
                          ? 'bg-amber-500 text-white ring-2 ring-amber-500 ring-offset-2 ring-offset-background'
                          : 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {option.icon}
                    <span className="text-xs mt-2 font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pay Button */}
            <div className="p-6 pt-2">
              <Button
                onClick={handlePayment}
                disabled={!selectedMethod}
                className={`w-full ${isDemo ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
                size="lg"
              >
                {isDemo ? 'Try Demo Payment' : 'Pay Now'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Combined Pay Now + Demo Button Component
interface PaymentButtonsProps {
  amount: number;
  currency?: string;
  onSuccess?: () => void;
  showDemoButton?: boolean;
  className?: string;
}

export function PaymentButtons({ 
  amount, 
  currency = '₹', 
  onSuccess,
  showDemoButton = true,
  className = '',
}: PaymentButtonsProps) {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleDemoClose = () => {
    setIsDemoOpen(false);
    // After demo, open real payment
    setTimeout(() => setIsPaymentOpen(true), 300);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Button
        onClick={() => setIsPaymentOpen(true)}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        Pay Now
      </Button>
      
      {showDemoButton && (
        <Button
          onClick={() => setIsDemoOpen(true)}
          variant="outline"
          className="w-full text-muted-foreground hover:text-foreground"
          size="sm"
        >
          <PlayCircle className="w-4 h-4 mr-2" />
          Try Demo Payment
        </Button>
      )}

      {/* Real Payment Flow */}
      <SimplePaymentFlow
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        isOpen={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        isDemo={false}
      />

      {/* Demo Payment Flow */}
      <SimplePaymentFlow
        amount={amount}
        currency={currency}
        onClose={handleDemoClose}
        isOpen={isDemoOpen}
        onOpenChange={setIsDemoOpen}
        isDemo={true}
      />
    </div>
  );
}

// Simple Pay Now Button (backward compatible)
interface PayNowButtonProps {
  amount: number;
  currency?: string;
  onSuccess?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function PayNowButton({ 
  amount, 
  currency = '₹', 
  onSuccess,
  className = '',
  children = 'Pay Now'
}: PayNowButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={`bg-primary hover:bg-primary/90 text-primary-foreground ${className}`}
        size="lg"
      >
        {children}
      </Button>
      <SimplePaymentFlow
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
