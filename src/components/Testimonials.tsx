import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Business Owner",
    content: "Got my business loan approved in just 15 minutes! The AI chatbot made the entire process incredibly smooth and hassle-free.",
    rating: 5,
    initials: "RK",
  },
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    content: "I was skeptical at first, but Tara understood my requirements perfectly. Received my sanction letter the same day!",
    rating: 5,
    initials: "PS",
  },
  {
    name: "Amit Patel",
    role: "Entrepreneur",
    content: "The document upload process was seamless. No unnecessary paperwork or visits to the branch. Highly recommend!",
    rating: 5,
    initials: "AP",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who've experienced the future of lending
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-2 hover:border-accent/50 transition-smooth animate-fade-in shadow-lg hover:shadow-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-gradient-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
