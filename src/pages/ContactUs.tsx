import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs = () => (
  <main className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
          Contact <span className="text-primary">Us</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Have questions? The AgroAI team is here to help.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-medium transition-shadow duration-300">
            <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground">Email</h3>
            <p className="text-muted-foreground text-sm mt-1">hello@agroai.farm</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-medium transition-shadow duration-300">
            <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground">Phone</h3>
            <p className="text-muted-foreground text-sm mt-1">+880 1XXX-XXXXXX</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-medium transition-shadow duration-300">
            <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground">Address</h3>
            <p className="text-muted-foreground text-sm mt-1">Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </main>
);

export default ContactUs;
