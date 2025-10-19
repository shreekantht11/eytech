import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Percent, Calendar, IndianRupee } from "lucide-react";

const offers = [
  {
    title: "Quick Personal Loan",
    rate: "10.99%",
    amount: "₹50,000 - ₹10 Lakhs",
    tenure: "6-60 months",
    features: ["No collateral", "Quick approval", "Flexible EMI"],
    popular: true,
  },
  {
    title: "Business Loan",
    rate: "12.99%",
    amount: "₹1 Lakh - ₹50 Lakhs",
    tenure: "12-84 months",
    features: ["Working capital", "Expansion funding", "GST based approval"],
    popular: false,
  },
  {
    title: "Home Renovation",
    rate: "9.99%",
    amount: "₹2 Lakhs - ₹25 Lakhs",
    tenure: "12-60 months",
    features: ["Low interest", "No prepayment charges", "Quick disbursal"],
    popular: false,
  },
];

interface OffersProps {
  onApply: () => void;
}

export const Offers = ({ onApply }: OffersProps) => {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Loan Offerings
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of personalized loan products designed for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {offers.map((offer, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden border-2 transition-smooth animate-fade-in hover:shadow-glow ${
                offer.popular ? 'border-accent shadow-elegant' : 'border-border'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {offer.popular && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-accent text-accent-foreground font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">{offer.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      <Percent className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interest Rate</p>
                      <p className="text-lg font-semibold text-foreground">Starting from {offer.rate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      <IndianRupee className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Amount</p>
                      <p className="text-lg font-semibold text-foreground">{offer.amount}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tenure</p>
                      <p className="text-lg font-semibold text-foreground">{offer.tenure}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-foreground mb-3">Key Features:</p>
                  <ul className="space-y-2">
                    {offer.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={onApply}
                  className={`w-full transition-smooth ${
                    offer.popular 
                      ? 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow' 
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
