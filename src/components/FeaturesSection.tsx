import { Wheat, Droplet, Scan, Bell, WifiOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const colorClasses = {
  primary: {
    bg: "bg-primary/10 group-hover:bg-primary/20",
    icon: "text-primary",
    border: "border-primary/20",
  },
  sky: {
    bg: "bg-sky/10 group-hover:bg-sky/20",
    icon: "text-sky",
    border: "border-sky/20",
  },
  accent: {
    bg: "bg-accent/10 group-hover:bg-accent/20",
    icon: "text-accent",
    border: "border-accent/20",
  },
  secondary: {
    bg: "bg-secondary/50 group-hover:bg-secondary/70",
    icon: "text-secondary-foreground",
    border: "border-secondary/30",
  },
  earth: {
    bg: "bg-earth/10 group-hover:bg-earth/20",
    icon: "text-earth",
    border: "border-earth/20",
  },
};

export const FeaturesSection = () => {
  const { t } = useLanguage();
  const features = [
    { icon: Wheat, title: t("features.f1.t"), description: t("features.f1.d"), color: "primary" as const },
    { icon: Droplet, title: t("features.f2.t"), description: t("features.f2.d"), color: "sky" as const },
    { icon: Scan, title: t("features.f3.t"), description: t("features.f3.d"), color: "accent" as const },
    { icon: Bell, title: t("features.f4.t"), description: t("features.f4.d"), color: "secondary" as const },
    { icon: WifiOff, title: t("features.f5.t"), description: t("features.f5.d"), color: "earth" as const },
  ];
  const objectives = [t("features.obj1"), t("features.obj2"), t("features.obj3"), t("features.obj4"), t("features.obj5")];
  return (
    <section id="features" className="py-20 md:py-32 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            {t("features.kicker")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t("features.title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("features.desc")}</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color];
            return (
              <div
                key={feature.title}
                className={`group bg-card rounded-2xl p-8 border ${colors.border} hover:shadow-medium transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mb-6 transition-colors duration-300`}>
                  <feature.icon className={`w-8 h-8 ${colors.icon}`} />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Objectives Summary */}
        <div className="mt-20 bg-gradient-card rounded-3xl p-8 md:p-12 border border-border">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            {t("features.objectives")}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((objective, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary-foreground">{idx + 1}</span>
                </div>
                <p className="text-foreground">{objective}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
