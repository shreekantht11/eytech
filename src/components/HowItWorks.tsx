import { MessageSquare, Shield, FileCheck, Download } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Start Conversation",
    description: "Chat with Tara, our AI assistant, about your loan requirements",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Shield,
    title: "Quick Verification",
    description: "We verify your details securely using our automated KYC system",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: FileCheck,
    title: "Smart Underwriting",
    description: "AI analyzes your eligibility and processes approval instantly",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Download,
    title: "Get Sanction Letter",
    description: "Download your personalized sanction letter immediately",
    color: "from-accent to-yellow-500",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get your loan approved in 4 simple steps. Our AI makes it fast and effortless.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-card rounded-2xl p-8 shadow-elegant hover:shadow-glow transition-smooth border border-border h-full">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                  {index + 1}
                </div>

                {/* Icon with gradient background */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-card-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
