import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Leaf, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import farmArt from "@/assets/login-farm.jpg";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";
  const t = (en: string, bn: string) => (lang === "bn" ? bn : en);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(from, { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate(from, { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, from]);

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

  const handleForgot = async () => {
    if (!email) {
      toast.error(t("Enter your email above first.", "প্রথমে উপরে আপনার ইমেল দিন।"));
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) toast.error(error.message);
    else toast.success(t("Password reset email sent.", "পাসওয়ার্ড রিসেট ইমেল পাঠানো হয়েছে।"));
  };

  return (
    <div className="min-h-screen bg-gradient-earth flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left: brand + illustration */}
        <div className="hidden md:flex flex-col gap-8">
          <Link to="/" className="flex items-center gap-3 text-primary">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Leaf className="w-8 h-8" />
            </div>
            <div>
              <div className="font-display font-bold text-4xl leading-none">AgroAI</div>
              <div className="text-sm text-muted-foreground mt-1">
                {t("Smart Farming Assistant", "স্মার্ট কৃষি সহকারী")}
              </div>
            </div>
          </Link>

          <div>
            <h1 className="font-display font-bold text-4xl lg:text-5xl text-primary leading-tight">
              {t("Empowering Farmers", "কৃষকদের ক্ষমতায়ন")}
              <br />
              {t("with AI & IoT", "এআই ও আইওটি দিয়ে")}
            </h1>
            <p className="mt-4 text-muted-foreground text-base max-w-md leading-relaxed">
              {t(
                "Make smarter farming decisions with real-time monitoring, AI insights, and data-driven recommendations.",
                "রিয়েল-টাইম মনিটরিং, এআই ইনসাইট এবং ডেটা-চালিত পরামর্শের মাধ্যমে আরও স্মার্ট কৃষি সিদ্ধান্ত নিন।",
              )}
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-elegant border border-border/50">
            <img
              src={farmArt}
              alt={t("Farmer using AgroAI on a tablet", "কৃষক ট্যাবলেটে অ্যাগ্রোএআই ব্যবহার করছেন")}
              width={1024}
              height={1280}
              loading="lazy"
              className="w-full h-72 lg:h-80 object-cover"
            />
          </div>
        </div>

        {/* Right: auth card */}
        <div className="bg-card rounded-3xl shadow-elegant border border-border/60 p-8 md:p-10">
          {/* Mobile brand */}
          <Link to="/" className="md:hidden flex items-center gap-2 mb-6 text-primary justify-center">
            <Leaf className="w-6 h-6" />
            <span className="font-display font-bold text-2xl">AgroAI</span>
          </Link>

          <div className="text-center">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-primary">
              {mode === "signin" ? t("Welcome Back!", "আবার স্বাগতম!") : t("Create Account", "অ্যাকাউন্ট তৈরি করুন")}
            </h2>
            <p className="text-muted-foreground mt-2">
              {mode === "signin"
                ? t("Sign in to continue to your account", "আপনার অ্যাকাউন্টে চালিয়ে যেতে সাইন ইন করুন")
                : t("Get started with smart precision farming", "স্মার্ট প্রিসিশন কৃষি দিয়ে শুরু করুন")}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                {t("Email Address", "ইমেল ঠিকানা")}
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("Enter your email", "আপনার ইমেল লিখুন")}
                  className="pl-12 h-13 py-3 text-base rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                {t("Password", "পাসওয়ার্ড")}
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("Enter your password", "আপনার পাসওয়ার্ড লিখুন")}
                  className="pl-12 pr-12 h-13 py-3 text-base rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? t("Hide password", "পাসওয়ার্ড লুকান") : t("Show password", "পাসওয়ার্ড দেখান")}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(v) => setRemember(!!v)}
                  className="border-primary data-[state=checked]:bg-primary"
                />
                <span className="text-sm text-foreground">{t("Remember me", "মনে রাখুন")}</span>
              </label>
              <button
                type="button"
                onClick={handleForgot}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {t("Forgot password?", "পাসওয়ার্ড ভুলে গেছেন?")}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-13 py-3 text-base font-semibold rounded-xl"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "signin" ? t("Sign In", "সাইন ইন") : t("Sign Up", "সাইন আপ")}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {mode === "signin"
                ? t("Don't have an account?", "অ্যাকাউন্ট নেই?")
                : t("Already have an account?", "ইতিমধ্যে অ্যাকাউন্ট আছে?")}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-primary font-semibold hover:underline"
              >
                {mode === "signin" ? t("Sign up", "সাইন আপ") : t("Sign in", "সাইন ইন")}
              </button>
            </p>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">
                  {t("or", "অথবা")}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full h-13 py-3 rounded-xl text-base font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.5-1.7 4.4-5.5 4.4-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.5 14.7 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12S6.8 21.5 12 21.5c6.9 0 9.4-4.8 9.4-7.3 0-.5-.1-.9-.1-1.3H12z" />
              </svg>
              {t("Continue with Google", "গুগল দিয়ে চালিয়ে যান")}
            </Button>

            <div className="flex items-center justify-center gap-2 pt-3 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>{t("Secure login protected by AgroAI", "অ্যাগ্রোএআই দ্বারা সুরক্ষিত নিরাপদ লগইন")}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}