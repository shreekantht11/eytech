import { Zap, Lock, Clock, TrendingUp, CreditCard, HeadphonesIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Instant Approvals",
    description: "Get pre-approved in seconds with our AI-powered underwriting system",
  },
  {
    icon: Lock,
    title: "Bank-Grade Security",
    description: "Your data is encrypted and protected with industry-leading security standards",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Apply anytime, anywhere. Our AI assistant never sleeps",
  },
  {
    icon: TrendingUp,
    title: "Competitive Rates",
    description: "Get the best interest rates based on your credit profile",
  },
  {
    icon: CreditCard,
    title: "Flexible Tenures",
    description: "Choose repayment plans from 6 to 60 months that suit your needs",
  },
  {
    icon: HeadphonesIcon,
    title: "Smart Support",
    description: "AI-guided assistance throughout your loan journey",
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose Tata Capital AI
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of lending with our cutting-edge AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:border-accent/50 transition-smooth animate-fade-in shadow-lg hover:shadow-glow group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
