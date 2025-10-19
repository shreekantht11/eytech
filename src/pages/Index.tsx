import { useState } from "react";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Offers } from "@/components/Offers";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { EligibilityChecker } from "@/components/EligibilityChecker";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Hero 
        onStartChat={() => setIsChatOpen(true)}
        onCheckEligibility={() => setIsEligibilityOpen(true)}
      />
      <HowItWorks />
      <Features />
      <Offers onApply={() => setIsChatOpen(true)} />
      <Testimonials />
      <Footer />

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <Button
          size="lg"
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-glow bg-accent hover:bg-accent/90 text-accent-foreground animate-pulse-glow z-40"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <EligibilityChecker 
        isOpen={isEligibilityOpen} 
        onClose={() => {
          setIsEligibilityOpen(false);
          setIsChatOpen(true);
        }} 
      />
    </div>
  );
};

export default Index;
