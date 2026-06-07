import { Leaf, Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type Lang = "en" | "bn";

const navLabels = {
  en: {
    home: "Home",
    cropAdvisor: "Crop Advisor",
    smartMonitoring: "Smart Monitoring",
    farmingBlog: "Farming Blog",
    knowledgeBase: "Knowledge Base",
    aboutUs: "About Us",
    contactUs: "Contact Us",
  },
  bn: {
    home: "হোম",
    cropAdvisor: "ফসল পরামর্শ",
    smartMonitoring: "স্মার্ট মনিটরিং",
    farmingBlog: "কৃষি ব্লগ",
    knowledgeBase: "জ্ঞানভান্ডার",
    aboutUs: "আমাদের সম্পর্কে",
    contactUs: "যোগাযোগ",
  },
} as const;

type NavKey = keyof typeof navLabels.en;

const navItems: { key: NavKey; path: string }[] = [
  { key: "home", path: "/" },
  { key: "cropAdvisor", path: "/crop-advisor" },
  { key: "smartMonitoring", path: "/iot-dashboard" },
  { key: "farmingBlog", path: "/farming-blog" },
  { key: "knowledgeBase", path: "/knowledge-base" },
  { key: "aboutUs", path: "/about-us" },
  { key: "contactUs", path: "/contact-us" },
];

const metaLabels = {
  en: {
    tagline: "Smart Farming Assistant",
    cta: "Get Started",
    switchLang: "বাংলা",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchTo: "Switch to Bangla",
  },
  bn: {
    tagline: "স্মার্ট কৃষি সহকারী",
    cta: "শুরু করুন",
    switchLang: "English",
    openMenu: "মেনু খুলুন",
    closeMenu: "মেনু বন্ধ করুন",
    switchTo: "Switch to English",
  },
} as const;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const { pathname } = useLocation();

  const labels = navLabels[lang];
  const meta = metaLabels[lang];
  const isActive = (path: string) => pathname === path;

  const toggleLang = () => setLang((prev) => (prev === "en" ? "bn" : "en"));
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-primary/10 shadow-soft">
      <div className="container mx-auto px-4">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-bold text-foreground leading-tight">
                Agro<span className="text-primary">AI</span>
              </span>
              <span className="text-[11px] font-medium text-muted-foreground leading-tight hidden sm:block">
                {meta.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 group",
                    "hover:text-primary hover:bg-primary/5",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {labels[item.key]}
                  <span
                    className={cn(
                      "absolute bottom-0.5 left-1/2 h-0.5 rounded-full bg-primary transition-all duration-300 -translate-x-1/2",
                      active ? "w-4" : "w-0 group-hover:w-4"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200"
              aria-label={meta.switchTo}
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              {meta.switchLang}
            </button>
            <Link
              to="/crop-advisor"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl text-primary-foreground bg-gradient-accent shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {meta.cta}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg text-foreground hover:bg-primary/5 transition-colors"
            aria-label={isOpen ? meta.closeMenu : meta.openMenu}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-primary/10 animate-fade-up">
            <nav className="flex flex-col gap-1 pt-2" aria-label="Mobile navigation">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={closeMenu}
                    className={cn(
                      "px-3 py-3 text-base font-medium rounded-lg transition-colors",
                      active
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {labels[item.key]}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 pt-3 border-t border-primary/10 flex flex-col gap-3">
              <button
                onClick={toggleLang}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-primary/10 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200"
                aria-label={meta.switchTo}
              >
                <Globe className="w-4 h-4" aria-hidden="true" />
                {meta.switchLang}
              </button>
              <Link
                to="/crop-advisor"
                onClick={closeMenu}
                className="inline-flex items-center justify-center px-5 py-3 text-base font-semibold rounded-xl text-primary-foreground bg-gradient-accent shadow-soft hover:shadow-medium transition-all duration-300"
              >
                {meta.cta}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
