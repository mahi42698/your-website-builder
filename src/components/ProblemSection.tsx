import { AlertTriangle, CloudOff, Bug, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: CloudOff,
    title: "Unpredictable Weather",
    description: "Climate change makes traditional farming knowledge unreliable, leading to crop failures and financial losses.",
  },
  {
    icon: AlertTriangle,
    title: "Improper Irrigation",
    description: "Without real-time soil monitoring, farmers often over or under-water crops, wasting resources and reducing yields.",
  },
  {
    icon: Bug,
    title: "Crop Diseases",
    description: "Late detection of plant diseases spreads infections rapidly, devastating entire harvests before treatment.",
  },
  {
    icon: TrendingDown,
    title: "Unfair Market Prices",
    description: "Lack of market information leaves farmers vulnerable to middlemen, receiving below-fair prices for produce.",
  },
];

export const ProblemSection = () => {
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
            The Challenge
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What Bangladeshi Farmers Face Every Day
          </h2>
          <p className="text-lg text-muted-foreground">
            Small-scale farmers struggle with outdated practices and limited access to technology, 
            creating a gap that AgroAI aims to bridge.
          </p>
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
              "Current systems are either{" "}
              <span className="text-destructive font-semibold">too expensive</span> or{" "}
              <span className="text-destructive font-semibold">not designed</span> for the needs of small-scale farmers."
            </p>
            <p className="text-muted-foreground mt-4">
              — Problem Statement, AgroAI Research
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
