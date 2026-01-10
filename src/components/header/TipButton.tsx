import { useState } from 'react';
import { Heart, DollarSign, Gift, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const tipAmounts = [50, 100, 200, 500];

interface TipButtonProps {
  recipientName?: string;
  recipientRole?: string;
}

export function TipButton({ recipientName = 'Team Member', recipientRole = 'Support' }: TipButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const getFinalAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseInt(customAmount);
    return 0;
  };

  const handleSubmit = async () => {
    const amount = getFinalAmount();
    if (amount < 10) {
      toast({
        title: 'Minimum tip amount',
        description: 'Tips must be at least ₹10',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSuccess(true);
    
    toast({
      title: '💝 Tip Sent Successfully!',
      description: `₹${amount} has been sent to ${recipientName}. Thank you for your appreciation!`,
    });

    // Reset after showing success
    setTimeout(() => {
      setOpen(false);
      setSuccess(false);
      setSelectedAmount(null);
      setCustomAmount('');
      setMessage('');
    }, 2000);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setOpen(false);
      setSelectedAmount(null);
      setCustomAmount('');
      setMessage('');
      setSuccess(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 group">
              <Heart className="h-4 w-4 text-pink-500 group-hover:fill-pink-500 transition-all" />
              <span className="hidden lg:inline text-sm">Tip</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          Send a tip to show appreciation (Optional)
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="py-12 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold">Thank You!</h3>
            <p className="text-muted-foreground">Your tip has been sent successfully</p>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-warning" />
              <span className="text-sm">Spreading positivity!</span>
              <Sparkles className="h-4 w-4 text-warning" />
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-pink-500" />
                Send a Tip
              </DialogTitle>
              <DialogDescription>
                Show your appreciation with a voluntary tip. 100% goes to {recipientName}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Recipient Info */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-medium">
                  {recipientName[0]}
                </div>
                <div>
                  <p className="font-medium">{recipientName}</p>
                  <Badge variant="secondary" className="text-[10px]">{recipientRole}</Badge>
                </div>
              </div>

              {/* Quick Amount Selection */}
              <div className="space-y-2">
                <Label>Select Amount</Label>
                <div className="grid grid-cols-4 gap-2">
                  {tipAmounts.map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant={selectedAmount === amount ? 'default' : 'outline'}
                      className="h-12"
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <Label htmlFor="custom-amount">Or enter custom amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    className="pl-9"
                    min="10"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">Minimum: ₹10</p>
              </div>

              {/* Optional Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Add a message (optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Thank you for your great service..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[80px] resize-none"
                  maxLength={200}
                />
                <p className="text-[10px] text-muted-foreground text-right">{message.length}/200</p>
              </div>

              {/* Disclaimer */}
              <div className="p-3 rounded-lg bg-info/10 border border-info/30">
                <p className="text-xs text-info">
                  <strong>Note:</strong> Tips are voluntary and 100% optional. They are logged in your wallet for transparency.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={getFinalAmount() < 10 || isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4" />
                    Send ₹{getFinalAmount() || 0}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
