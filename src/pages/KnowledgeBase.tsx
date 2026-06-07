import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookOpen } from "lucide-react";

const KnowledgeBase = () => (
  <main className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center mx-auto mb-6 shadow-soft">
          <BookOpen className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
          Knowledge Base
        </h1>
        <p className="text-lg text-muted-foreground">
          A comprehensive library of farming guides, crop calendars, pest control manuals, and best practices — coming soon.
        </p>
      </div>
    </section>
    <Footer />
  </main>
);

export default KnowledgeBase;
