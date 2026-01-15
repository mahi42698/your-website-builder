import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Droplets, 
  Thermometer, 
  Sun, 
  Camera, 
  Wifi, 
  WifiOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Leaf
} from "lucide-react";
import { useState, useEffect } from "react";

// Mock sensor data - in real implementation, this would come from ESP32
const generateMockSensorData = () => ({
  soilMoisture: Math.floor(Math.random() * 40) + 30, // 30-70%
  temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
  humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
  lightIntensity: Math.floor(Math.random() * 500) + 300, // 300-800 lux
  lastUpdated: new Date().toLocaleTimeString(),
});

const IoTDashboard = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [sensorData, setSensorData] = useState(generateMockSensorData());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        setSensorData(generateMockSensorData());
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isConnected]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSensorData(generateMockSensorData());
      setIsRefreshing(false);
    }, 1000);
  };

  const getMoistureStatus = (value: number) => {
    if (value < 30) return { status: "Low", color: "text-red-500", bg: "bg-red-500" };
    if (value > 70) return { status: "High", color: "text-blue-500", bg: "bg-blue-500" };
    return { status: "Optimal", color: "text-green-500", bg: "bg-green-500" };
  };

  const moistureStatus = getMoistureStatus(sensorData.soilMoisture);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              <Wifi className="w-3 h-3 mr-1" />
              IoT Monitoring
            </Badge>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Smart Farm Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Real-time monitoring of your farm using ESP32 camera and soil moisture sensors
            </p>
          </div>
        </div>
      </section>

      {/* Connection Status & Controls */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <Wifi className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-500">ESP32 Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-red-500">Disconnected</span>
                  </>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                Last updated: {sensorData.lastUpdated}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsConnected(!isConnected)}
              >
                {isConnected ? "Disconnect" : "Connect"}
              </Button>
              <Button 
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing || !isConnected}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sensor Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Soil Moisture Card */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Soil Moisture
                  </CardTitle>
                  <Droplets className="w-5 h-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{sensorData.soilMoisture}%</div>
                <Progress value={sensorData.soilMoisture} className="h-2 mb-2" />
                <Badge variant="secondary" className={moistureStatus.color}>
                  {moistureStatus.status}
                </Badge>
              </CardContent>
            </Card>

            {/* Temperature Card */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Temperature
                  </CardTitle>
                  <Thermometer className="w-5 h-5 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{sensorData.temperature}°C</div>
                <Progress value={(sensorData.temperature / 50) * 100} className="h-2 mb-2" />
                <Badge variant="secondary" className="text-green-500">
                  Normal
                </Badge>
              </CardContent>
            </Card>

            {/* Humidity Card */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Air Humidity
                  </CardTitle>
                  <Droplets className="w-5 h-5 text-cyan-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{sensorData.humidity}%</div>
                <Progress value={sensorData.humidity} className="h-2 mb-2" />
                <Badge variant="secondary" className="text-green-500">
                  Optimal
                </Badge>
              </CardContent>
            </Card>

            {/* Light Intensity Card */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Light Intensity
                  </CardTitle>
                  <Sun className="w-5 h-5 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{sensorData.lightIntensity} lux</div>
                <Progress value={(sensorData.lightIntensity / 1000) * 100} className="h-2 mb-2" />
                <Badge variant="secondary" className="text-green-500">
                  Good
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Camera Feed & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Camera Feed */}
            <Card className="lg:col-span-2 border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      ESP32 Camera Feed
                    </CardTitle>
                    <CardDescription>Live view from your field camera</CardDescription>
                  </div>
                  <Badge variant={isConnected ? "default" : "destructive"}>
                    {isConnected ? "LIVE" : "OFFLINE"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  {isConnected ? (
                    <div className="text-center">
                      <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Camera feed will appear here when ESP32 is connected
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Configure your ESP32 to stream to this dashboard
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <WifiOff className="w-16 h-16 mx-auto text-red-500 mb-4" />
                      <p className="text-red-500 font-medium">Device Disconnected</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Alerts & Recommendations */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  Smart Alerts
                </CardTitle>
                <CardDescription>AI-powered recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sensorData.soilMoisture < 40 ? (
                  <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-700 dark:text-yellow-400">Low Moisture Alert</p>
                      <p className="text-sm text-muted-foreground">Consider irrigation in the next 2-3 hours</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-400">Moisture Level OK</p>
                      <p className="text-sm text-muted-foreground">No irrigation needed currently</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Thermometer className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-700 dark:text-blue-400">Temperature Normal</p>
                    <p className="text-sm text-muted-foreground">Ideal for most crops</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <Sun className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-primary">Light Conditions</p>
                    <p className="text-sm text-muted-foreground">Good sunlight for photosynthesis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ESP32 Setup Guide */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>ESP32 Setup Guide</CardTitle>
              <CardDescription>Connect your hardware to this dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Flash ESP32</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload the AgroAI firmware to your ESP32 microcontroller
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Connect Sensors</h3>
                  <p className="text-sm text-muted-foreground">
                    Wire your soil moisture sensor and camera module
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Configure WiFi</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect ESP32 to your network and point to this dashboard
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default IoTDashboard;
