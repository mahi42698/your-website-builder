import { GraduationCap, User, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const TeamSection = () => {
  const { t } = useLanguage();
  return (
    <section id="team" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            {t("team.kicker")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t("team.title")}
          </h2>
          <p className="text-lg text-muted-foreground">{t("team.desc")}</p>
        </div>

        {/* Team Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Lead Researcher Card */}
          <div className="bg-gradient-card rounded-3xl p-6 border border-border hover:shadow-medium transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">
                MD. Mahiur Rahman
              </h3>
              <p className="text-primary font-medium text-sm mb-3">{t("team.lead")}</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 justify-center">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{t("team.degree")}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{t("team.uni")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Member 1 */}
          <div className="bg-gradient-card rounded-3xl p-6 border border-border hover:shadow-medium transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-leaf/10 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-leaf" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">
                MST. Asifa Ashrafi
              </h3>
              <p className="text-leaf font-medium text-sm mb-3">{t("team.member")}</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 justify-center">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{t("team.degree")}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{t("team.uni")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="bg-gradient-card rounded-3xl p-6 border border-border hover:shadow-medium transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-harvest/10 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-harvest" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">
                Sadman Israk Rahim
              </h3>
              <p className="text-harvest font-medium text-sm mb-3">{t("team.member")}</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 justify-center">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{t("team.degree")}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{t("team.uni")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Supervisor Card */}
          <div className="bg-gradient-card rounded-3xl p-6 border border-border hover:shadow-medium transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">
                Akib Ikbal
              </h3>
              <p className="text-accent font-medium text-sm mb-3">{t("team.supervisor")}</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 justify-center">
                  <User className="w-3.5 h-3.5" />
                  <span>{t("team.lecturer")}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{t("team.uni")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-muted rounded-xl px-6 py-4">
            <p className="text-muted-foreground">{t("team.course")}</p>
            <p className="text-sm text-muted-foreground mt-1">{t("team.submission")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
