import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, AlertTriangle, Shield, DollarSign } from 'lucide-react';

const CONTRACT_KEY = 'influencer_contract_accepted';

export function InfluencerContractModal() {
  const [open, setOpen] = useState(false);
  const [agreements, setAgreements] = useState({
    influencerTerms: false,
    paymentRules: false,
    fraudPolicy: false,
  });

  useEffect(() => {
    const accepted = localStorage.getItem(CONTRACT_KEY);
    if (!accepted) {
      setOpen(true);
    }
  }, []);

  const allAccepted = Object.values(agreements).every(Boolean);

  const handleAccept = () => {
    localStorage.setItem(CONTRACT_KEY, new Date().toISOString());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}} modal>
      <DialogContent className="max-w-2xl [&>button]:hidden" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Influencer Agreement Required
          </DialogTitle>
          <DialogDescription>
            Please review and accept the following agreements to access your portal
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <p className="text-sm text-amber-400">
              You must accept all agreements to access the Influencer Portal. 
              These agreements are legally binding.
            </p>
          </div>
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {/* Influencer Agreement */}
            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="influencerTerms"
                  checked={agreements.influencerTerms}
                  onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, influencerTerms: checked as boolean }))}
                />
                <div className="flex-1">
                  <label htmlFor="influencerTerms" className="font-medium cursor-pointer flex items-center gap-2">
                    <FileText className="h-4 w-4 text-violet-500" />
                    Influencer Partnership Agreement
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    I agree to represent the brand professionally, create authentic content, 
                    and disclose sponsored partnerships as required by law. I understand that 
                    content must be original and comply with platform guidelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Rules */}
            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="paymentRules"
                  checked={agreements.paymentRules}
                  onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, paymentRules: checked as boolean }))}
                />
                <div className="flex-1">
                  <label htmlFor="paymentRules" className="font-medium cursor-pointer flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    Payment & Penalty Terms
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    I understand that payments are processed weekly with a minimum threshold of $50. 
                    Late content submissions may incur penalties. Bonuses are subject to verification. 
                    Tax deductions will be applied as per applicable laws.
                  </p>
                </div>
              </div>
            </div>

            {/* Fraud Policy */}
            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="fraudPolicy"
                  checked={agreements.fraudPolicy}
                  onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, fraudPolicy: checked as boolean }))}
                />
                <div className="flex-1">
                  <label htmlFor="fraudPolicy" className="font-medium cursor-pointer flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    Anti-Fraud & Traffic Quality Policy
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    I confirm that all my followers and engagement are organic. I will not use bots, 
                    purchased followers, or fake engagement. Fraud detection systems will monitor 
                    my traffic. Violations will result in payout holds, bonus forfeiture, and 
                    possible account suspension.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button 
            onClick={handleAccept} 
            disabled={!allAccepted}
            className="w-full"
          >
            {allAccepted ? 'Accept & Continue' : 'Accept All Agreements to Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
