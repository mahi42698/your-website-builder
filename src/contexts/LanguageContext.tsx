import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "bn";

type Dict = Record<string, { en: string; bn: string }>;

// Central translation dictionary for the whole site.
export const translations: Dict = {
  // Header / meta
  "meta.tagline": { en: "Smart Farming Assistant", bn: "স্মার্ট কৃষি সহকারী" },
  "meta.cta": { en: "Get Started", bn: "শুরু করুন" },
  "meta.switchLang": { en: "বাংলা", bn: "English" },
  "meta.switchTo": { en: "Switch to Bangla", bn: "Switch to English" },
  "meta.openMenu": { en: "Open menu", bn: "মেনু খুলুন" },
  "meta.closeMenu": { en: "Close menu", bn: "মেনু বন্ধ করুন" },

  // Nav
  "nav.home": { en: "Home", bn: "হোম" },
  "nav.cropAdvisor": { en: "Crop Advisor", bn: "ফসল পরামর্শ" },
  "nav.smartMonitoring": { en: "Smart Monitoring", bn: "স্মার্ট মনিটরিং" },
  "nav.farmingBlog": { en: "Farming Blog", bn: "কৃষি ব্লগ" },
  "nav.knowledgeBase": { en: "Knowledge Base", bn: "জ্ঞানভান্ডার" },
  "nav.aboutUs": { en: "About Us", bn: "আমাদের সম্পর্কে" },
  "nav.contactUs": { en: "Contact Us", bn: "যোগাযোগ" },

  // Hero
  "hero.badge": { en: "Empowering Bangladesh's Farmers", bn: "বাংলাদেশের কৃষকদের ক্ষমতায়ন" },
  "hero.title1": { en: "Smart Precision Farming with", bn: "স্মার্ট প্রিসিশন কৃষি" },
  "hero.desc": {
    en: "Revolutionizing agriculture for small-scale farmers in Bangladesh through AI-powered crop recommendations, IoT-based irrigation monitoring, and real-time disease detection — all in Bangla.",
    bn: "এআই-চালিত ফসল পরামর্শ, আইওটি-ভিত্তিক সেচ পর্যবেক্ষণ এবং রিয়েল-টাইম রোগ শনাক্তকরণের মাধ্যমে বাংলাদেশের ছোট কৃষকদের কৃষিতে বিপ্লব — সবকিছু বাংলায়।",
  },
  "hero.ctaAdvisor": { en: "Try AI Crop Advisor", bn: "এআই ফসল পরামর্শ দেখুন" },
  "hero.ctaDashboard": { en: "Open Live IoT Dashboard", bn: "লাইভ আইওটি ড্যাশবোর্ড খুলুন" },
  "hero.stat1": { en: "Population in Agriculture", bn: "জনসংখ্যা কৃষিতে" },
  "hero.stat2": { en: "Integrated Solution", bn: "সমন্বিত সমাধান" },
  "hero.stat3": { en: "Native Support", bn: "নেটিভ সাপোর্ট" },

  // Problem
  "problem.kicker": { en: "The Challenge", bn: "চ্যালেঞ্জ" },
  "problem.title": { en: "What Bangladeshi Farmers Face Every Day", bn: "বাংলাদেশের কৃষকরা প্রতিদিন যা মোকাবেলা করেন" },
  "problem.desc": {
    en: "Small-scale farmers struggle with outdated practices and limited access to technology, creating a gap that AgroAI aims to bridge.",
    bn: "ছোট কৃষকরা পুরোনো পদ্ধতি ও সীমিত প্রযুক্তির কারণে সমস্যায় পড়েন — যে ব্যবধান AgroAI পূরণ করতে চায়।",
  },
  "problem.p1.t": { en: "Unpredictable Weather", bn: "অনিশ্চিত আবহাওয়া" },
  "problem.p1.d": {
    en: "Climate change makes traditional farming knowledge unreliable, leading to crop failures and financial losses.",
    bn: "জলবায়ু পরিবর্তন ঐতিহ্যবাহী কৃষি জ্ঞানকে অনির্ভরযোগ্য করে তুলছে, যার ফলে ফসল ক্ষতি ও আর্থিক ক্ষতি হয়।",
  },
  "problem.p2.t": { en: "Improper Irrigation", bn: "ভুল সেচ ব্যবস্থা" },
  "problem.p2.d": {
    en: "Without real-time soil monitoring, farmers often over or under-water crops, wasting resources and reducing yields.",
    bn: "রিয়েল-টাইম মাটি পর্যবেক্ষণ ছাড়া কৃষকরা প্রায়ই অতিরিক্ত বা কম পানি দেন, যা সম্পদ অপচয় ও ফলন কমায়।",
  },
  "problem.p3.t": { en: "Crop Diseases", bn: "ফসলের রোগ" },
  "problem.p3.d": {
    en: "Late detection of plant diseases spreads infections rapidly, devastating entire harvests before treatment.",
    bn: "দেরিতে রোগ শনাক্ত হলে সংক্রমণ দ্রুত ছড়িয়ে পড়ে এবং চিকিৎসার আগেই পুরো ফসল ধ্বংস হয়।",
  },
  "problem.p4.t": { en: "Unfair Market Prices", bn: "অন্যায্য বাজারমূল্য" },
  "problem.p4.d": {
    en: "Lack of market information leaves farmers vulnerable to middlemen, receiving below-fair prices for produce.",
    bn: "বাজার তথ্যের অভাবে কৃষকরা মধ্যস্বত্বভোগীদের কাছে কম দামে পণ্য বিক্রি করতে বাধ্য হন।",
  },
  "problem.quote": {
    en: "Current systems are either too expensive or not designed for the needs of small-scale farmers.",
    bn: "বর্তমান সিস্টেমগুলো হয় খুব ব্যয়বহুল, না হয় ছোট কৃষকদের প্রয়োজনের জন্য ডিজাইন করা নয়।",
  },
  "problem.quoteSrc": { en: "— Problem Statement, AgroAI Research", bn: "— সমস্যা বিবৃতি, AgroAI গবেষণা" },

  // Features
  "features.kicker": { en: "Our Solution", bn: "আমাদের সমাধান" },
  "features.title": { en: "Intelligent Features for Smart Farming", bn: "স্মার্ট কৃষির জন্য বুদ্ধিমান ফিচার" },
  "features.desc": {
    en: "AgroAI combines cutting-edge AI, IoT, and Computer Vision to deliver a comprehensive farming assistant right in your pocket.",
    bn: "AgroAI আধুনিক এআই, আইওটি এবং কম্পিউটার ভিশনকে একত্রিত করে আপনার পকেটে একটি পূর্ণাঙ্গ কৃষি সহকারী এনে দেয়।",
  },
  "features.f1.t": { en: "AI Crop Recommendation", bn: "এআই ফসল পরামর্শ" },
  "features.f1.d": {
    en: "Get personalized crop suggestions based on soil quality, season, and regional data using Decision Trees and Random Forest algorithms.",
    bn: "মাটি, ঋতু ও এলাকার ভিত্তিতে ডিসিশন ট্রি ও র‍্যান্ডম ফরেস্ট অ্যালগরিদম দিয়ে ব্যক্তিগতকৃত ফসল পরামর্শ পান।",
  },
  "features.f2.t": { en: "Smart Irrigation Monitoring", bn: "স্মার্ট সেচ পর্যবেক্ষণ" },
  "features.f2.d": {
    en: "ESP32-powered IoT sensors track real-time soil moisture and temperature, alerting you when crops need water.",
    bn: "ESP32 চালিত আইওটি সেন্সর রিয়েল-টাইমে মাটির আর্দ্রতা ও তাপমাত্রা ট্র্যাক করে এবং পানির প্রয়োজন হলে জানায়।",
  },
  "features.f3.t": { en: "Plant Disease Detection", bn: "গাছের রোগ শনাক্তকরণ" },
  "features.f3.d": {
    en: "Computer Vision models using CNN technology identify diseases early from plant photos, enabling quick treatment.",
    bn: "CNN প্রযুক্তির কম্পিউটার ভিশন মডেল গাছের ছবি থেকে দ্রুত রোগ শনাক্ত করে চিকিৎসার সুযোগ দেয়।",
  },
  "features.f4.t": { en: "Real-Time Alerts in Bangla", bn: "বাংলায় রিয়েল-টাইম অ্যালার্ট" },
  "features.f4.d": {
    en: "Receive weather forecasts and market price updates directly in Bangla, helping you make informed decisions.",
    bn: "আবহাওয়ার পূর্বাভাস ও বাজারমূল্যের আপডেট সরাসরি বাংলায় পান এবং সঠিক সিদ্ধান্ত নিন।",
  },
  "features.f5.t": { en: "Offline Support", bn: "অফলাইন সাপোর্ট" },
  "features.f5.d": {
    en: "Essential features work without internet connectivity, ensuring rural farmers always have access to critical tools.",
    bn: "জরুরি ফিচারগুলো ইন্টারনেট ছাড়াই কাজ করে, যেন গ্রামের কৃষকরা সবসময় ব্যবহার করতে পারেন।",
  },
  "features.objectives": { en: "Project Objectives", bn: "প্রকল্পের উদ্দেশ্য" },
  "features.obj1": { en: "Develop AI model for crop recommendation", bn: "ফসল পরামর্শের জন্য এআই মডেল তৈরি" },
  "features.obj2": { en: "Implement IoT-based irrigation monitoring", bn: "আইওটি-ভিত্তিক সেচ পর্যবেক্ষণ বাস্তবায়ন" },
  "features.obj3": { en: "Build computer vision disease detection", bn: "কম্পিউটার ভিশনে রোগ শনাক্তকরণ" },
  "features.obj4": { en: "Provide real-time Bangla alerts", bn: "রিয়েল-টাইম বাংলা অ্যালার্ট প্রদান" },
  "features.obj5": { en: "Ensure offline usability for rural areas", bn: "গ্রামাঞ্চলে অফলাইন ব্যবহারের নিশ্চয়তা" },

  // Hardware
  "hw.badge": { en: "IoT Hardware", bn: "আইওটি হার্ডওয়্যার" },
  "hw.title": { en: "Smart Hardware Integration", bn: "স্মার্ট হার্ডওয়্যার সমন্বয়" },
  "hw.desc": {
    en: "Our IoT solution combines ESP32 microcontroller with advanced sensors for comprehensive farm monitoring and intelligent recommendations",
    bn: "আমাদের আইওটি সমাধান ESP32 মাইক্রোকন্ট্রোলার ও উন্নত সেন্সর একত্রিত করে পূর্ণাঙ্গ কৃষি পর্যবেক্ষণ ও বুদ্ধিমান পরামর্শ প্রদান করে।",
  },
  "hw.h1.t": { en: "ESP32 Microcontroller", bn: "ESP32 মাইক্রোকন্ট্রোলার" },
  "hw.h1.d": { en: "Dual-core processor with built-in WiFi and Bluetooth for seamless connectivity", bn: "ডুয়াল-কোর প্রসেসর, বিল্ট-ইন ওয়াইফাই ও ব্লুটুথ সহ মসৃণ সংযোগ।" },
  "hw.h2.t": { en: "HD Camera Module", bn: "এইচডি ক্যামেরা মডিউল" },
  "hw.h2.d": { en: "High-resolution camera for crop monitoring and disease detection", bn: "ফসল পর্যবেক্ষণ ও রোগ শনাক্তকরণের জন্য উচ্চ রেজোলিউশন ক্যামেরা।" },
  "hw.h3.t": { en: "Soil Moisture Sensor", bn: "মাটির আর্দ্রতা সেন্সর" },
  "hw.h3.d": { en: "Accurate real-time soil moisture measurement for optimal irrigation", bn: "সঠিক সেচের জন্য রিয়েল-টাইম মাটির আর্দ্রতা মাপ।" },
  "hw.h4.t": { en: "Wireless Connectivity", bn: "তারবিহীন সংযোগ" },
  "hw.h4.d": { en: "WiFi-enabled data transmission to cloud dashboard from anywhere", bn: "যেকোনো জায়গা থেকে ওয়াইফাইয়ের মাধ্যমে ক্লাউড ড্যাশবোর্ডে ডেটা পাঠানো।" },
  "hw.cap1": { en: "Real-time monitoring", bn: "রিয়েল-টাইম পর্যবেক্ষণ" },
  "hw.cap2": { en: "Secure data transmission", bn: "নিরাপদ ডেটা পরিবহন" },
  "hw.cap3": { en: "Historical analytics", bn: "ঐতিহাসিক বিশ্লেষণ" },
  "hw.ecoTitle": { en: "Complete IoT Ecosystem", bn: "পূর্ণাঙ্গ আইওটি ইকোসিস্টেম" },
  "hw.ecoDesc": {
    en: "Our hardware solution provides end-to-end monitoring capabilities, from soil conditions to visual crop analysis. All data is transmitted securely to our cloud platform for AI-powered insights.",
    bn: "আমাদের হার্ডওয়্যার সমাধান মাটির অবস্থা থেকে ভিজ্যুয়াল ফসল বিশ্লেষণ পর্যন্ত পূর্ণ পর্যবেক্ষণ দেয়। সব ডেটা নিরাপদে ক্লাউডে পাঠানো হয়।",
  },
  "hw.cta": { en: "View Live Dashboard", bn: "লাইভ ড্যাশবোর্ড দেখুন" },
  "hw.diagram": { en: "ESP32 + Camera + Soil Sensor", bn: "ESP32 + ক্যামেরা + মাটি সেন্সর" },
  "hw.diagramSub": { en: "Hardware diagram placeholder", bn: "হার্ডওয়্যার ডায়াগ্রাম প্লেসহোল্ডার" },

  // Technology
  "tech.kicker": { en: "Technology Stack", bn: "প্রযুক্তি স্ট্যাক" },
  "tech.title": { en: "Built with Modern Technologies", bn: "আধুনিক প্রযুক্তিতে নির্মিত" },
  "tech.desc": {
    en: "A robust technology stack ensuring scalability, reliability, and optimal performance for farmers across Bangladesh.",
    bn: "একটি শক্তিশালী প্রযুক্তি স্ট্যাক যা বাংলাদেশের কৃষকদের জন্য স্কেলেবিলিটি, নির্ভরযোগ্যতা ও পারফরম্যান্স নিশ্চিত করে।",
  },
  "tech.arch": { en: "System Architecture", bn: "সিস্টেম আর্কিটেকচার" },
  "tech.layer1": { en: "User Interface", bn: "ইউজার ইন্টারফেস" },
  "tech.layer1d": { en: "Mobile & Web Applications", bn: "মোবাইল ও ওয়েব অ্যাপ্লিকেশন" },
  "tech.layer2": { en: "AI Processing", bn: "এআই প্রসেসিং" },
  "tech.layer2d": { en: "ML Models & Predictions", bn: "এমএল মডেল ও প্রেডিকশন" },
  "tech.layer3": { en: "IoT Data Layer", bn: "আইওটি ডেটা স্তর" },
  "tech.layer3d": { en: "Sensor Data Collection", bn: "সেন্সর ডেটা সংগ্রহ" },
  "tech.layer4": { en: "Cloud Services", bn: "ক্লাউড সেবা" },
  "tech.layer4d": { en: "Backend & Storage", bn: "ব্যাকএন্ড ও স্টোরেজ" },

  // Team
  "team.kicker": { en: "Project Team", bn: "প্রকল্প দল" },
  "team.title": { en: "Meet the Team Behind AgroAI", bn: "AgroAI দলের সদস্যদের সাথে পরিচিত হন" },
  "team.desc": { en: "A dedicated team from Varendra University working to transform agriculture for Bangladesh's farmers.", bn: "বরেন্দ্র বিশ্ববিদ্যালয়ের একটি নিবেদিত দল বাংলাদেশের কৃষিকে রূপান্তরিত করতে কাজ করছে।" },
  "team.lead": { en: "Lead Researcher", bn: "প্রধান গবেষক" },
  "team.member": { en: "Team Member", bn: "দলের সদস্য" },
  "team.supervisor": { en: "Project Supervisor", bn: "প্রকল্প তত্ত্বাবধায়ক" },
  "team.degree": { en: "B.Sc. in CSE", bn: "বি.এসসি. সিএসই" },
  "team.uni": { en: "Varendra University", bn: "বরেন্দ্র বিশ্ববিদ্যালয়" },
  "team.lecturer": { en: "Lecturer, Dept. of CSE", bn: "প্রভাষক, সিএসই বিভাগ" },
  "team.course": { en: "CSE 418: Project or Thesis with Seminar Part 1", bn: "সিএসই ৪১৮: প্রকল্প বা থিসিস উইথ সেমিনার পর্ব ১" },
  "team.submission": { en: "Submission Date: August 23, 2025", bn: "জমা দেওয়ার তারিখ: ২৩ আগস্ট, ২০২৫" },

  // Footer
  "footer.ctaTitle": { en: "Ready to Transform Farming?", bn: "কৃষিকে রূপান্তর করতে প্রস্তুত?" },
  "footer.ctaDesc": { en: "Join us in empowering Bangladesh's farmers with AI-driven precision agriculture.", bn: "এআই-চালিত প্রিসিশন কৃষির মাধ্যমে বাংলাদেশের কৃষকদের ক্ষমতায়নে আমাদের সাথে যোগ দিন।" },
  "footer.ctaBtn": { en: "Get In Touch", bn: "যোগাযোগ করুন" },
  "footer.brandDesc": { en: "Smart Precision Farming System for Small Farmers in Bangladesh. Integrating AI, IoT, and Computer Vision for agricultural transformation.", bn: "বাংলাদেশের ছোট কৃষকদের জন্য স্মার্ট প্রিসিশন কৃষি সিস্টেম। এআই, আইওটি ও কম্পিউটার ভিশনের সমন্বয়।" },
  "footer.quick": { en: "Quick Links", bn: "দ্রুত লিংক" },
  "footer.features": { en: "Features", bn: "ফিচার" },
  "footer.challenge": { en: "Challenge", bn: "চ্যালেঞ্জ" },
  "footer.technology": { en: "Technology", bn: "প্রযুক্তি" },
  "footer.team": { en: "Team", bn: "দল" },
  "footer.contact": { en: "Contact", bn: "যোগাযোগ" },
  "footer.copyright": { en: "© 2025 AgroAI - Undergraduate Thesis Project. Department of Computer Science & Engineering, Varendra University.", bn: "© ২০২৫ AgroAI — স্নাতক থিসিস প্রকল্প। কম্পিউটার বিজ্ঞান ও প্রকৌশল বিভাগ, বরেন্দ্র বিশ্ববিদ্যালয়।" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; toggleLang: () => void; t: (key: string) => string };

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("agroai_lang") as Lang) || "en";
  });

  useEffect(() => {
    localStorage.setItem("agroai_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggleLang = () => setLangState((p) => (p === "en" ? "bn" : "en"));
  const t = (key: string) => translations[key]?.[lang] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}