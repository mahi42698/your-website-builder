import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Cpu, 
  Camera, 
  Droplets, 
  Wifi, 
  ArrowRight,
  Zap,
  Shield,
  BarChart3
} from "lucide-react";

const hardwareFeatures = [
  {
    icon: Cpu,
    title: "ESP32 Microcontroller",
    description: "Dual-core processor with built-in WiFi and Bluetooth for seamless connectivity",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: Camera,
    title: "HD Camera Module",
    description: "High-resolution camera for crop monitoring and disease detection",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    icon: Droplets,
    title: "Soil Moisture Sensor",
    description: "Accurate real-time soil moisture measurement for optimal irrigation",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10"
  },
  {
    icon: Wifi,
    title: "Wireless Connectivity",
    description: "WiFi-enabled data transmission to cloud dashboard from anywhere",
    color: "text-green-500",
    bg: "bg-green-500/10"
  }
];

const capabilities = [
  { icon: Zap, text: "Real-time monitoring" },
  { icon: Shield, text: "Secure data transmission" },
  { icon: BarChart3, text: "Historical analytics" }
];

export const HardwareSection = () => {
  return (
    <section id="hardware" className="py-20 bg-gradient-to-br from-muted/50 via-background to-primary/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            <Cpu className="w-3 h-3 mr-1" />
            IoT Hardware
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Smart Hardware Integration
          </h2>
          <p className="text-lg text-muted-foreground">
            Our IoT solution combines ESP32 microcontroller with advanced sensors 
            for comprehensive farm monitoring and intelligent recommendations
          </p>
        </div>

        {/* Hardware Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {hardwareFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <CardContent className="pt-6">
                <div className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Overview */}
        <Card className="border-2 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Complete IoT Ecosystem</h3>
                <p className="text-muted-foreground mb-6">
                  Our hardware solution provides end-to-end monitoring capabilities, 
                  from soil conditions to visual crop analysis. All data is transmitted 
                  securely to our cloud platform for AI-powered insights.
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  {capabilities.map((cap, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <cap.icon className="w-4 h-4 text-primary" />
                      <span>{cap.text}</span>
                    </div>
                  ))}
                </div>
                <Link to="/iot-dashboard">
                  <Button className="group">
                    View Live Dashboard
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/30">
                  <div className="text-center p-8">
                    <div className="flex justify-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-background rounded-xl shadow-lg flex items-center justify-center">
                        <Cpu className="w-8 h-8 text-primary" />
                      </div>
                      <div className="w-16 h-16 bg-background rounded-xl shadow-lg flex items-center justify-center">
                        <Camera className="w-8 h-8 text-purple-500" />
                      </div>
                      <div className="w-16 h-16 bg-background rounded-xl shadow-lg flex items-center justify-center">
                        <Droplets className="w-8 h-8 text-cyan-500" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ESP32 + Camera + Soil Sensor
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Hardware diagram placeholder
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
