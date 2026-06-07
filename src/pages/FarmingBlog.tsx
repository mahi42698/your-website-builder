import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Newspaper } from "lucide-react";

const FarmingBlog = () => (
  <main className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center mx-auto mb-6 shadow-soft">
          <Newspaper className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
          Farming Blog
        </h1>
        <p className="text-lg text-muted-foreground">
          Expert agricultural insights, seasonal tips, and success stories from farmers around the world — coming soon.
        </p>
      </div>
    </section>
    <Footer />
  </main>
);

export default FarmingBlog;
