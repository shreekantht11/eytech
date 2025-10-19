import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface EligibilityCheckerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EligibilityChecker = ({ isOpen, onClose }: EligibilityCheckerProps) => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ approved: boolean; limit?: string } | null>(null);

  const checkEligibility = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);

    try {
      // Call backend API
      const sessionId = `check_${Date.now()}`;
      const response = await fetch('http://localhost:8000/api/verify-kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          phone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to check eligibility');
      }

      const data = await response.json();

      if (data.success && data.customer) {
        setResult({
          approved: true,
          limit: `₹${data.customer.preApprovedLimit.toLocaleString('en-IN')}`,
        });
        toast.success("Eligibility check completed!");
      } else {
        toast.error("Customer not found. Please register first.");
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Eligibility check error:', error);
      toast.error("Failed to check eligibility. Please make sure the backend is running.");
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setPhone("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Check Your Eligibility</DialogTitle>
          <DialogDescription>
            Enter your phone number to check your pre-approved loan limit
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <form onSubmit={checkEligibility} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "Check Eligibility"
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Congratulations!
              </h3>
              <p className="text-muted-foreground mb-4">
                You are pre-approved for up to
              </p>
              <p className="text-4xl font-bold text-primary mb-6">
                {result.limit}
              </p>
              <p className="text-sm text-muted-foreground">
                Start a chat with Tara to complete your application and get instant approval!
              </p>
            </div>

            <Button onClick={handleClose} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Start Chat Now
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
