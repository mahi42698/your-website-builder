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
  lastUpdated: new Date().toLocaleTimeString('bn-BD'),
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
    if (value < 30) return { status: "কম", color: "text-red-500", bg: "bg-red-500" };
    if (value > 70) return { status: "বেশি", color: "text-blue-500", bg: "bg-blue-500" };
    return { status: "সঠিক", color: "text-green-500", bg: "bg-green-500" };
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
              আইওটি মনিটরিং
            </Badge>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              স্মার্ট ফার্ম ড্যাশবোর্ড
            </h1>
            <p className="text-lg text-muted-foreground">
              ESP32 ক্যামেরা এবং মাটির আর্দ্রতা সেন্সর ব্যবহার করে আপনার খামারের রিয়েল-টাইম পর্যবেক্ষণ
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
                    <span className="text-sm font-medium text-green-500">ESP32 সংযুক্ত</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-red-500">সংযোগ বিচ্ছিন্ন</span>
                  </>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                সর্বশেষ আপডেট: {sensorData.lastUpdated}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsConnected(!isConnected)}
              >
                {isConnected ? "সংযোগ বিচ্ছিন্ন করুন" : "সংযোগ করুন"}
              </Button>
              <Button 
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing || !isConnected}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                রিফ্রেশ
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
                    মাটির আর্দ্রতা
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
                    তাপমাত্রা
                  </CardTitle>
                  <Thermometer className="w-5 h-5 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{sensorData.temperature}°সে</div>
                <Progress value={(sensorData.temperature / 50) * 100} className="h-2 mb-2" />
                <Badge variant="secondary" className="text-green-500">
                  স্বাভাবিক
                </Badge>
              </CardContent>
            </Card>

            {/* Humidity Card */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    বাতাসের আর্দ্রতা
                  </CardTitle>
                  <Droplets className="w-5 h-5 text-cyan-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{sensorData.humidity}%</div>
                <Progress value={sensorData.humidity} className="h-2 mb-2" />
                <Badge variant="secondary" className="text-green-500">
                  সঠিক
                </Badge>
              </CardContent>
            </Card>

            {/* Light Intensity Card */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    আলোর তীব্রতা
                  </CardTitle>
                  <Sun className="w-5 h-5 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{sensorData.lightIntensity} লাক্স</div>
                <Progress value={(sensorData.lightIntensity / 1000) * 100} className="h-2 mb-2" />
                <Badge variant="secondary" className="text-green-500">
                  ভালো
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
                      ESP32 ক্যামেরা ফিড
                    </CardTitle>
                    <CardDescription>আপনার মাঠের ক্যামেরা থেকে সরাসরি দৃশ্য</CardDescription>
                  </div>
                  <Badge variant={isConnected ? "default" : "destructive"}>
                    {isConnected ? "সরাসরি" : "অফলাইন"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  {isConnected ? (
                    <div className="text-center">
                      <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        ESP32 সংযুক্ত হলে ক্যামেরা ফিড এখানে দেখা যাবে
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        এই ড্যাশবোর্ডে স্ট্রিম করতে আপনার ESP32 কনফিগার করুন
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <WifiOff className="w-16 h-16 mx-auto text-red-500 mb-4" />
                      <p className="text-red-500 font-medium">ডিভাইস সংযোগ বিচ্ছিন্ন</p>
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
                  স্মার্ট সতর্কতা
                </CardTitle>
                <CardDescription>AI-চালিত সুপারিশ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sensorData.soilMoisture < 40 ? (
                  <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-700 dark:text-yellow-400">কম আর্দ্রতা সতর্কতা</p>
                      <p className="text-sm text-muted-foreground">পরবর্তী ২-৩ ঘন্টার মধ্যে সেচ দেওয়ার কথা বিবেচনা করুন</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-400">আর্দ্রতার মাত্রা ঠিক আছে</p>
                      <p className="text-sm text-muted-foreground">বর্তমানে সেচের প্রয়োজন নেই</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Thermometer className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-700 dark:text-blue-400">তাপমাত্রা স্বাভাবিক</p>
                    <p className="text-sm text-muted-foreground">বেশিরভাগ ফসলের জন্য আদর্শ</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <Sun className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-primary">আলোর অবস্থা</p>
                    <p className="text-sm text-muted-foreground">সালোকসংশ্লেষণের জন্য ভালো সূর্যালোক</p>
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
              <CardTitle>ESP32 সেটআপ গাইড</CardTitle>
              <CardDescription>এই ড্যাশবোর্ডে আপনার হার্ডওয়্যার সংযুক্ত করুন</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">১</span>
                  </div>
                  <h3 className="font-semibold mb-2">ESP32 ফ্ল্যাশ করুন</h3>
                  <p className="text-sm text-muted-foreground">
                    আপনার ESP32 মাইক্রোকন্ট্রোলারে AgroAI ফার্মওয়্যার আপলোড করুন
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">২</span>
                  </div>
                  <h3 className="font-semibold mb-2">সেন্সর সংযুক্ত করুন</h3>
                  <p className="text-sm text-muted-foreground">
                    আপনার মাটির আর্দ্রতা সেন্সর এবং ক্যামেরা মডিউল সংযুক্ত করুন
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">৩</span>
                  </div>
                  <h3 className="font-semibold mb-2">WiFi কনফিগার করুন</h3>
                  <p className="text-sm text-muted-foreground">
                    ESP32 কে আপনার নেটওয়ার্কে সংযুক্ত করুন এবং এই ড্যাশবোর্ডে পয়েন্ট করুন
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
