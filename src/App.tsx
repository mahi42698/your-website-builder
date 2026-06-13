import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CropAdvisor from "./pages/CropAdvisor";
import IoTDashboard from "./pages/IoTDashboard";
import FarmingBlog from "./pages/FarmingBlog";
import KnowledgeBase from "./pages/KnowledgeBase";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import DiseaseDetection from "./pages/dashboard/DiseaseDetection";
import Sensors from "./pages/dashboard/Sensors";
import Devices from "./pages/dashboard/Devices";
import History from "./pages/dashboard/History";
import ESP32Setup from "./pages/dashboard/ESP32Setup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/crop-advisor" element={<CropAdvisor />} />
          <Route path="/iot-dashboard" element={<IoTDashboard />} />
          <Route path="/farming-blog" element={<FarmingBlog />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="disease" element={<DiseaseDetection />} />
            <Route path="sensors" element={<Sensors />} />
            <Route path="devices" element={<Devices />} />
            <Route path="esp32-setup" element={<ESP32Setup />} />
            <Route path="history" element={<History />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
