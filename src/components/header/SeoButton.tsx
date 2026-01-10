import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Upload, 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Target,
  Wand2,
  Globe,
  Hash,
  ImagePlus,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useUserRoles } from '@/hooks/useUserRoles';

interface SeoSuggestion {
  caption: string;
  hashtags: string[];
  keywords: string[];
}

export function SeoButton() {
  const { roles } = useUserRoles();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'upload' | 'language' | 'suggestions' | 'budget' | 'confirm'>('upload');
  const [imageSource, setImageSource] = useState<'upload' | 'ai' | null>(null);
  const [language, setLanguage] = useState<string>('auto');
  const [budget, setBudget] = useState<number>(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<SeoSuggestion | null>(null);

  // Only show for Franchise and Reseller roles
  const isFranchiseOrReseller = roles.some(r => 
    r.includes('franchise') || r.includes('reseller')
  );

  if (!isFranchiseOrReseller) return null;

  const handleImageSelect = (source: 'upload' | 'ai') => {
    setImageSource(source);
    setStep('language');
  };

  const handleLanguageSelect = async () => {
    setStep('suggestions');
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSuggestions({
      caption: "Unlock the power of automation with Software Vala's cutting-edge solutions. Transform your business today! 🚀",
      hashtags: ['#SoftwareVala', '#BusinessAutomation', '#DigitalTransformation', '#TechSolutions', '#EnterpriseSoftware'],
      keywords: ['Business Software', 'ERP Solutions', 'CRM Software', 'Automation Tools', 'Digital Solutions'],
    });
    setIsGenerating(false);
  };

  const handleConfirmBudget = () => {
    setStep('confirm');
  };

  const handleSubmit = () => {
    // In real implementation, this would submit to backend
    setOpen(false);
    resetFlow();
  };

  const resetFlow = () => {
    setStep('upload');
    setImageSource(null);
    setLanguage('auto');
    setBudget(50);
    setSuggestions(null);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetFlow(); }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Search className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-pulse" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>SEO Campaign (Pay-Per-Use)</TooltipContent>
      </Tooltip>

      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            SEO Campaign Builder
          </SheetTitle>
          <SheetDescription>
            Create AI-powered SEO ads for your territory
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            {['upload', 'language', 'suggestions', 'budget', 'confirm'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  step === s ? 'bg-primary text-primary-foreground' :
                  ['upload', 'language', 'suggestions', 'budget', 'confirm'].indexOf(step) > i 
                    ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {i + 1}
                </div>
                {i < 4 && <div className={`w-8 h-0.5 ${
                  ['upload', 'language', 'suggestions', 'budget', 'confirm'].indexOf(step) > i 
                    ? 'bg-primary/50' : 'bg-muted'
                }`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Upload or AI Generate */}
          {step === 'upload' && (
            <div className="space-y-4">
              <h3 className="font-semibold">Choose Image Source</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
                  onClick={() => handleImageSelect('upload')}
                >
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">Upload Photo</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
                  onClick={() => handleImageSelect('ai')}
                >
                  <Sparkles className="h-6 w-6" />
                  <span className="text-sm">Generate with AI</span>
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Language Selection */}
          {step === 'language' && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Choose Language
              </h3>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Auto-detect (Local)
                    </div>
                  </SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full" onClick={handleLanguageSelect}>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate AI Suggestions
              </Button>
            </div>
          )}

          {/* Step 3: AI Suggestions */}
          {step === 'suggestions' && (
            <div className="space-y-4">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground mt-2">AI is generating suggestions...</p>
                </div>
              ) : suggestions && (
                <>
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <ImagePlus className="h-4 w-4" />
                      Caption
                    </Label>
                    <Textarea 
                      value={suggestions.caption}
                      onChange={(e) => setSuggestions({ ...suggestions, caption: e.target.value })}
                      className="min-h-20"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Hashtags
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.hashtags.map((tag, i) => (
                        <Badge key={i} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Keywords
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.keywords.map((kw, i) => (
                        <Badge key={i} variant="outline">{kw}</Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => setStep('budget')}>
                    Continue to Budget
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Step 4: Budget */}
          {step === 'budget' && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Set Campaign Budget
              </h3>
              
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Daily Budget</span>
                  <span className="font-semibold">${budget}</span>
                </div>
                <Input
                  type="range"
                  min={10}
                  max={500}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$10</span>
                  <span>$500</span>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">Territory Targeting</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ads will run exclusively in your assigned territory. 
                  AI auto-selects optimal time slots and areas.
                </p>
              </div>

              <Button className="w-full" onClick={handleConfirmBudget}>
                Confirm & Pay
              </Button>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 'confirm' && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-lg">Ready to Launch!</h3>
              <p className="text-sm text-muted-foreground">
                Your SEO campaign will be activated immediately. 
                Leads will be auto-assigned to your dashboard.
              </p>
              
              <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span>Daily Budget:</span>
                  <span className="font-semibold">${budget}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Language:</span>
                  <span className="font-semibold">{language === 'auto' ? 'Auto (Local)' : language.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Territory:</span>
                  <span className="font-semibold">Your Assigned Area</span>
                </div>
              </div>

              <Button className="w-full" onClick={handleSubmit}>
                Launch Campaign
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
