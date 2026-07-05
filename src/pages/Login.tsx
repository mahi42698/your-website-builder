import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Leaf, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(from, { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate(from, { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, from]);

  const t = (en: string, bn: string) => (lang === "bn" ? bn : en);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        toast.success(t("Check your email to confirm your account.", "আপনার অ্যাকাউন্ট নিশ্চিত করতে ইমেল দেখুন।"));
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(t("Welcome back!", "ফিরে আসার জন্য স্বাগতম!"));
      }
    } catch (err: any) {
      toast.error(err.message ?? t("Authentication failed", "প্রমাণীকরণ ব্যর্থ"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Google sign-in failed");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message ?? "Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6 text-primary">
          <Leaf className="w-6 h-6" />
          <span className="font-display font-semibold text-2xl">AgroAI</span>
        </Link>

        <Card className="shadow-elegant border-border/60">
          <CardHeader className="text-center">
            <CardTitle className="font-display">
              {mode === "signin"
                ? t("Welcome back", "আবার স্বাগতম")
                : t("Create your account", "আপনার অ্যাকাউন্ট তৈরি করুন")}
            </CardTitle>
            <CardDescription>
              {mode === "signin"
                ? t("Sign in to access your AgroAI dashboard.", "আপনার অ্যাগ্রোএআই ড্যাশবোর্ড অ্যাক্সেস করতে সাইন ইন করুন।")
                : t("Get started with smart precision farming.", "স্মার্ট প্রিসিশন কৃষি দিয়ে শুরু করুন।")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogle}
              disabled={loading}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden>
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.5-1.7 4.4-5.5 4.4-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.5 14.7 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12S6.8 21.5 12 21.5c6.9 0 9.4-4.8 9.4-7.3 0-.5-.1-.9-.1-1.3H12z"/>
              </svg>
              {t("Continue with Google", "গুগল দিয়ে চালিয়ে যান")}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">{t("or", "অথবা")}</span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">{t("Email", "ইমেল")}</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@farm.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("Password", "পাসওয়ার্ড")}</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "signin" ? t("Sign in", "সাইন ইন") : t("Sign up", "সাইন আপ")}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {mode === "signin"
                ? t("Don't have an account?", "অ্যাকাউন্ট নেই?")
                : t("Already have an account?", "ইতিমধ্যে অ্যাকাউন্ট আছে?")}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-primary font-medium hover:underline"
              >
                {mode === "signin" ? t("Sign up", "সাইন আপ") : t("Sign in", "সাইন ইন")}
              </button>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-primary">
            ← {t("Back to home", "হোমে ফিরে যান")}
          </Link>
        </p>
      </div>
    </div>
  );
}