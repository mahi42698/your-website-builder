import { Leaf, Mail, MapPin, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  const quick = [
    { label: t("footer.features"), href: "#features" },
    { label: t("footer.challenge"), href: "#problem" },
    { label: t("footer.technology"), href: "#technology" },
    { label: t("footer.team"), href: "#team" },
  ];
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
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{t("footer.ctaTitle")}</h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">{t("footer.ctaDesc")}</p>
          <Button variant="harvest" size="xl">{t("footer.ctaBtn")}</Button>
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
            <p className="text-primary-foreground/60 leading-relaxed">{t("footer.brandDesc")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t("footer.quick")}</h4>
            <div className="space-y-3">
              {quick.map((link) => (
                <a key={link.href} href={link.href} className="block text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t("footer.contact")}</h4>
            <div className="space-y-3 text-primary-foreground/60">
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4" />
                <span>{t("team.uni")}</span>
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
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};
