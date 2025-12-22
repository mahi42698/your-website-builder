import { GraduationCap, User, Building2, Calendar } from "lucide-react";

export const TeamSection = () => {
  return (
    <section id="team" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Research Team
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Meet the Team Behind AgroAI
          </h2>
          <p className="text-lg text-muted-foreground">
            A dedicated team from Varendra University working to transform agriculture 
            for Bangladesh's farmers.
          </p>
        </div>

        {/* Team Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Card */}
          <div className="bg-gradient-card rounded-3xl p-8 border border-border hover:shadow-medium transition-all duration-300">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-foreground mb-1">
                  MD. Mahiur Rahman
                </h3>
                <p className="text-primary font-medium mb-4">Researcher & Developer</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>B.Sc. in Computer Science & Engineering</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Varendra University, Rajshahi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>7th Semester, Section D</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supervisor Card */}
          <div className="bg-gradient-card rounded-3xl p-8 border border-border hover:shadow-medium transition-all duration-300">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-10 h-10 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-foreground mb-1">
                  A.S.M. Delwar Hossain
                </h3>
                <p className="text-accent font-medium mb-4">Project Supervisor</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Lecturer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Department of CSE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Varendra University, Rajshahi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-muted rounded-xl px-6 py-4">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">CSE 418:</span> Project or Thesis with Seminar Part 1
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Submission Date: August 23, 2025
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
