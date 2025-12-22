import { Smartphone, Server, Database, Brain, Cpu, Cloud, Globe } from "lucide-react";

const technologies = [
  { category: "Frontend", items: ["React Native (Mobile)", "React.js (Web)"], icon: Smartphone },
  { category: "Backend", items: ["Node.js", "Express", "Firebase"], icon: Server },
  { category: "Database", items: ["Firebase Firestore", "PostgreSQL"], icon: Database },
  { category: "AI/ML", items: ["TensorFlow", "Keras", "Scikit-learn"], icon: Brain },
  { category: "IoT", items: ["ESP32", "Soil Moisture Sensor", "DHT11"], icon: Cpu },
  { category: "APIs", items: ["OpenWeather", "Govt. Market API"], icon: Cloud },
];

const architectureLayers = [
  { name: "User Interface", description: "Mobile & Web Applications", color: "bg-primary" },
  { name: "AI Processing", description: "ML Models & Predictions", color: "bg-accent" },
  { name: "IoT Data Layer", description: "Sensor Data Collection", color: "bg-sky" },
  { name: "Cloud Services", description: "Backend & Storage", color: "bg-secondary" },
];

export const TechnologySection = () => {
  return (
    <section id="technology" className="py-20 md:py-32 bg-gradient-earth relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Technology Stack
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Built with Modern Technologies
          </h2>
          <p className="text-lg text-muted-foreground">
            A robust technology stack ensuring scalability, reliability, and optimal performance 
            for farmers across Bangladesh.
          </p>
        </div>

        {/* Technology Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {technologies.map((tech) => (
            <div
              key={tech.category}
              className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-medium"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <tech.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {tech.category}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {tech.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 bg-muted text-muted-foreground text-sm rounded-lg"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture Diagram */}
        <div className="bg-card rounded-3xl p-8 md:p-12 border border-border shadow-soft">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            System Architecture
          </h3>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col gap-4">
              {architectureLayers.map((layer, index) => (
                <div
                  key={layer.name}
                  className="relative"
                >
                  <div className={`${layer.color} rounded-xl p-6 text-center`}>
                    <h4 className="font-display text-lg font-semibold text-primary-foreground mb-1">
                      {layer.name}
                    </h4>
                    <p className="text-primary-foreground/80 text-sm">
                      {layer.description}
                    </p>
                  </div>
                  {index < architectureLayers.length - 1 && (
                    <div className="flex justify-center py-2">
                      <div className="w-0.5 h-6 bg-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
