import { motion } from "framer-motion";
import { Camera, CameraOff, Loader2, Maximize2, RefreshCw, ScanLine, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export type CameraState = "connected" | "connecting" | "offline";

type Props = {
  state: CameraState;
  imageUrl: string | null;
  capturedAt: string | null;
  analyzing?: boolean;
  onRetry: () => void;
  onCapture?: () => void;
  onAnalyze?: () => void;
  compact?: boolean;
};

export function FarmCamera({
  state,
  imageUrl,
  capturedAt,
  analyzing,
  onRetry,
  onCapture,
  onAnalyze,
  compact,
}: Props) {
  const { lang } = useLanguage();
  const bn = lang === "bn";

  const statusText =
    state === "connected"
      ? bn ? "ক্যামেরা যুক্ত আছে" : "Camera Connected"
      : state === "connecting"
        ? bn ? "ক্যামেরার সাথে যুক্ত হচ্ছে..." : "Connecting to Camera..."
        : bn ? "ক্যামেরা বন্ধ" : "Camera Offline";

  const statusCls =
    state === "connected"
      ? "bg-primary/10 text-primary border-primary/30"
      : state === "connecting"
        ? "bg-harvest/15 text-harvest border-harvest/40"
        : "bg-destructive/10 text-destructive border-destructive/30";

  const openFull = () => imageUrl && window.open(imageUrl, "_blank", "noopener");

  return (
    <Card className="rounded-2xl overflow-hidden shadow-soft">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-display">
              <Camera className="w-5 h-5 text-primary" />
              {bn ? "ফার্ম ক্যামেরা" : "Farm Camera"}
            </CardTitle>
            <CardDescription>
              {bn ? "আপনার খামারের সর্বশেষ ছবি — কোনো সেটআপ লাগে না।" : "The latest photo from your field — no setup needed."}
            </CardDescription>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${statusCls}`}>
            <span className={`w-2 h-2 rounded-full bg-current ${state !== "offline" ? "animate-pulse" : ""}`} />
            {statusText}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`relative rounded-xl border bg-muted/30 overflow-hidden ${compact ? "aspect-[4/3]" : "aspect-video"} flex items-center justify-center`}>
          {imageUrl ? (
            <motion.img
              key={imageUrl}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={imageUrl}
              alt={bn ? "খামারের সর্বশেষ ছবি" : "Latest farm camera photo"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center px-6 py-10 max-w-sm">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-muted flex items-center justify-center">
                <CameraOff className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">
                {bn ? "আমরা আপনার ফার্ম ক্যামেরা খুঁজে পাচ্ছি না।" : "We cannot find your farm camera."}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {bn
                  ? "অনুগ্রহ করে বিদ্যুৎ সংযোগ ও ওয়াইফাই পরীক্ষা করুন। AgroAI নিজে থেকেই আবার যুক্ত হবে।"
                  : "Please check the power supply and WiFi connection. AgroAI will reconnect automatically."}
              </p>
            </div>
          )}
          {analyzing && (
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium">{bn ? "পাতা পরীক্ষা করা হচ্ছে..." : "Checking your leaf..."}</p>
            </div>
          )}
        </div>

        {capturedAt && (
          <p className="text-xs text-muted-foreground">
            {bn ? "ছবি তোলা হয়েছে" : "Photo taken"} {new Date(capturedAt).toLocaleString()}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={openFull} disabled={!imageUrl}>
            <Maximize2 className="w-4 h-4" /> {bn ? "বড় করে দেখুন" : "Full Screen"}
          </Button>
          {onCapture && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onCapture}>
              <Camera className="w-4 h-4" /> {bn ? "ছবি তুলুন" : "Capture Image"}
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-1.5" onClick={onRetry}>
            <RefreshCw className="w-4 h-4" /> {bn ? "আবার চেষ্টা করুন" : "Refresh Camera"}
          </Button>
          {onAnalyze && (
            <Button size="sm" className="gap-1.5" onClick={onAnalyze} disabled={!imageUrl || analyzing}>
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
              {bn ? "পাতা পরীক্ষা করুন" : "Analyze Leaf"}
            </Button>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-primary" />
          {bn
            ? "ক্যামেরা চালু হলে AgroAI নিজে থেকেই খুঁজে নেয় — কোনো ঠিকানা লিখতে হয় না।"
            : "AgroAI finds your camera automatically when it powers on — no address to type in."}
        </p>
      </CardContent>
    </Card>
  );
}
