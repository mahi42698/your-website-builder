import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HardwareSection } from "@/components/HardwareSection";
import { TechnologySection } from "@/components/TechnologySection";
import { TeamSection } from "@/components/TeamSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HardwareSection />
      <ProblemSection />
      <TechnologySection />
      <TeamSection />
      <Footer />
    </main>
  );
};

export default Index;
