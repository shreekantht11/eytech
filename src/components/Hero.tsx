import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle, Sparkles } from "lucide-react";

interface HeroProps {
  onStartChat: () => void;
  onCheckEligibility: () => void;
}

export const Hero = ({ onStartChat, onCheckEligibility }: HeroProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-accent/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-accent/20">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground">AI-Powered Lending Assistant</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Get Your Loan Approved
            <span className="block text-accent mt-2">In Minutes, Not Days</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Meet Tara, your AI lending assistant. Get instant pre-approvals, 
            upload documents seamlessly, and receive your sanction letter—all through a simple conversation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={onStartChat}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg shadow-glow transition-smooth group"
            >
              <MessageCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Start Chat with Tara
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={onCheckEligibility}
              className="border-2 border-primary-foreground/20 bg-primary-foreground/5 hover:bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm px-8 py-6 text-lg transition-smooth"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Check Eligibility
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Instant Approvals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>100% Digital Process</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Secure & Confidential</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
