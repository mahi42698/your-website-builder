import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TeamSection } from "@/components/TeamSection";
import { Sprout, Target, Shield } from "lucide-react";

const values = [
  {
    icon: Sprout,
    title: "Sustainable Growth",
    description:
      "We believe in farming practices that nurture the soil and protect ecosystems for future generations.",
  },
  {
    icon: Target,
    title: "Precision Agriculture",
    description:
      "Leveraging AI and IoT to give farmers real-time insights that reduce waste and maximize yield.",
  },
  {
    icon: Shield,
    title: "Farmer First",
    description:
      "Every feature we build starts with understanding the real challenges farmers face every day.",
  },
];

const AboutUs = () => (
  <main className="min-h-screen bg-background">
    <Navbar />
    {/* Hero */}
    <section className="pt-32 pb-12 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
          About <span className="text-primary">AgroAI</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Empowering farmers with cutting-edge AI technology for smarter, more sustainable agriculture.
        </p>
      </div>
    </section>

    {/* Values */}
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="p-6 rounded-2xl bg-card border border-border text-center hover:shadow-medium transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center mx-auto mb-4 shadow-soft">
                <v.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-muted-foreground">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <TeamSection />
    <Footer />
  </main>
);

export default AboutUs;
