import { Button } from "@/components/ui/button";
import { ArrowRight, Sprout, Droplets, Cloud } from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Smart precision farming in Bangladesh" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-1/4 animate-float hidden lg:block">
        <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
          <Sprout className="w-8 h-8 text-primary" />
        </div>
      </div>
      <div className="absolute bottom-1/3 right-1/3 animate-float-delayed hidden lg:block">
        <div className="w-12 h-12 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center">
          <Droplets className="w-6 h-6 text-accent" />
        </div>
      </div>
      <div className="absolute top-1/3 right-1/6 animate-float hidden lg:block" style={{ animationDelay: '1s' }}>
        <div className="w-14 h-14 rounded-full bg-sky/20 backdrop-blur-sm flex items-center justify-center">
          <Cloud className="w-7 h-7 text-sky" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sprout className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Empowering Bangladesh's Farmers</span>
          </div>

          {/* Title */}
          <h1 className="animate-fade-up font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6">
            Smart Precision Farming with{" "}
            <span className="text-gradient">AgroAI</span>
          </h1>

          {/* Description */}
          <p className="animate-fade-up-delayed text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Revolutionizing agriculture for small-scale farmers in Bangladesh through AI-powered crop recommendations, 
            IoT-based irrigation monitoring, and real-time disease detection — all in Bangla.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-delayed flex flex-col sm:flex-row gap-4" style={{ animationDelay: '0.4s' }}>
            <Button variant="hero" size="xl">
              Explore Features
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl">
              View Research
            </Button>
          </div>

          {/* Stats */}
          <div className="animate-fade-up-delayed mt-12 grid grid-cols-3 gap-8 max-w-lg" style={{ animationDelay: '0.6s' }}>
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold text-primary">70%</div>
              <div className="text-sm text-muted-foreground mt-1">Population in Agriculture</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold text-accent">AI+IoT</div>
              <div className="text-sm text-muted-foreground mt-1">Integrated Solution</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold text-secondary">বাংলা</div>
              <div className="text-sm text-muted-foreground mt-1">Native Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
