import { AlertTriangle, CloudOff, Bug, TrendingDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const ProblemSection = () => {
  const { t } = useLanguage();
  const problems = [
    { icon: CloudOff, title: t("problem.p1.t"), description: t("problem.p1.d") },
    { icon: AlertTriangle, title: t("problem.p2.t"), description: t("problem.p2.d") },
    { icon: Bug, title: t("problem.p3.t"), description: t("problem.p3.d") },
    { icon: TrendingDown, title: t("problem.p4.t"), description: t("problem.p4.d") },
  ];
  return (
    <section id="problem" className="py-20 md:py-32 bg-gradient-earth relative overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
            {t("problem.kicker")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t("problem.title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("problem.desc")}</p>
        </div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              className="group bg-gradient-card rounded-2xl p-6 border border-border hover:border-destructive/30 transition-all duration-300 hover:shadow-medium"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-5 group-hover:bg-destructive/20 transition-colors duration-300">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {problem.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Gap Statement */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-card border border-border rounded-2xl p-8 shadow-soft max-w-2xl">
            <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed">
              "{t("problem.quote")}"
            </p>
            <p className="text-muted-foreground mt-4">{t("problem.quoteSrc")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
