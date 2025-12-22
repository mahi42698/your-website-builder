import { Leaf, Mail, MapPin, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-16 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* CTA Section */}
        <div className="text-center mb-16 pb-16 border-b border-primary-foreground/10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Farming?
          </h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
            Join us in empowering Bangladesh's farmers with AI-driven precision agriculture.
          </p>
          <Button variant="harvest" size="xl">
            Get In Touch
          </Button>
        </div>

        {/* Footer Content */}
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold">
                AgroAI
              </span>
            </a>
            <p className="text-primary-foreground/60 leading-relaxed">
              Smart Precision Farming System for Small Farmers in Bangladesh. 
              Integrating AI, IoT, and Computer Vision for agricultural transformation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <div className="space-y-3">
              {["Features", "Challenge", "Technology", "Team"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="block text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-3 text-primary-foreground/60">
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4" />
                <span>Varendra University</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>Rajshahi, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>cse@vu.edu.bd</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          <p>
            © 2025 AgroAI - Undergraduate Thesis Project. Department of Computer Science & Engineering, Varendra University.
          </p>
        </div>
      </div>
    </footer>
  );
};
