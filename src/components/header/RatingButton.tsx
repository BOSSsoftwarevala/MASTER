import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Star, 
  Package, 
  Headphones, 
  Truck,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { cn } from '@/lib/utils';

interface RatingCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  rating: number;
}

export function RatingButton() {
  const { isAdmin, isManager } = useUserRoles();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<RatingCategory[]>([
    { id: 'software', label: 'Software Quality', icon: <Package className="h-5 w-5" />, rating: 0 },
    { id: 'support', label: 'Support Experience', icon: <Headphones className="h-5 w-5" />, rating: 0 },
    { id: 'delivery', label: 'Delivery Speed', icon: <Truck className="h-5 w-5" />, rating: 0 },
  ]);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Employees can see ratings but not submit
  const isEmployee = isAdmin() || isManager();

  const handleRating = (categoryId: string, rating: number) => {
    setCategories(cats => 
      cats.map(cat => cat.id === categoryId ? { ...cat, rating } : cat)
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setCategories(cats => cats.map(cat => ({ ...cat, rating: 0 })));
    setFeedback('');
    setIsSubmitted(false);
  };

  const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !isEmployee && onChange(star)}
          disabled={isEmployee}
          className={cn(
            "transition-colors",
            isEmployee && "cursor-not-allowed opacity-70"
          )}
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              star <= value 
                ? "fill-amber-400 text-amber-400" 
                : "text-muted-foreground hover:text-amber-400/50"
            )}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Star className="h-4 w-4" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>Rate Your Experience</TooltipContent>
      </Tooltip>

      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400" />
            Rate Your Experience
          </SheetTitle>
          <SheetDescription>
            {isEmployee 
              ? 'View customer ratings (Read-only for employees)'
              : 'Your feedback helps us improve our service'
            }
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-lg">Thank You!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your rating has been submitted. We appreciate your feedback!
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => { setOpen(false); resetForm(); }}
              >
                Close
              </Button>
            </div>
          ) : (
            <>
              {/* Rating Categories */}
              <div className="space-y-4">
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {category.icon}
                      </div>
                      <span className="font-medium">{category.label}</span>
                    </div>
                    <StarRating 
                      value={category.rating} 
                      onChange={(v) => handleRating(category.id, v)}
                    />
                  </div>
                ))}
              </div>

              {/* Feedback */}
              {!isEmployee && (
                <div className="space-y-2">
                  <Label>Additional Feedback (Optional)</Label>
                  <Textarea
                    placeholder="Tell us more about your experience..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-24"
                  />
                </div>
              )}

              {/* Info for employees */}
              {isEmployee && (
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> As an employee, you can view ratings but cannot submit them. 
                    Customer ratings impact Franchise/Reseller performance scores.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              {!isEmployee && (
                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={categories.every(c => c.rating === 0) || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Rating'
                  )}
                </Button>
              )}

              {/* Cannot edit notice */}
              <p className="text-xs text-center text-muted-foreground">
                Ratings cannot be edited or deleted after submission
              </p>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
