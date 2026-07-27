// Farmer-friendly interpretation layer: turns raw sensor numbers into plain
// language that a small-scale farmer can act on, in English or Bangla.
export type Lang = "en" | "bn";
export type Tone = "good" | "warn" | "bad" | "unknown";

export type Insight = {
  tone: Tone;
  status: string;
  message: string;
};

export const toneBadge: Record<Tone, string> = {
  good: "bg-primary/10 text-primary border-primary/30",
  warn: "bg-harvest/15 text-harvest border-harvest/40",
  bad: "bg-destructive/10 text-destructive border-destructive/30",
  unknown: "bg-muted text-muted-foreground border-border",
};

export const toneBar: Record<Tone, string> = {
  good: "bg-primary",
  warn: "bg-harvest",
  bad: "bg-destructive",
  unknown: "bg-muted-foreground/40",
};

const pick = (lang: Lang, en: string, bn: string) => (lang === "bn" ? bn : en);

const noData = (lang: Lang): Insight => ({
  tone: "unknown",
  status: pick(lang, "No reading", "তথ্য নেই"),
  message: pick(lang, "Waiting for your farm device to send data.", "আপনার ফার্ম ডিভাইস থেকে তথ্যের অপেক্ষা করা হচ্ছে।"),
});

export function soilInsight(v: number | null, lang: Lang = "en"): Insight {
  if (v === null) return noData(lang);
  if (v >= 40)
    return {
      tone: "good",
      status: pick(lang, "Enough water", "পর্যাপ্ত পানি"),
      message: pick(lang, "Your soil has enough water. No watering needed today.", "আপনার মাটিতে পর্যাপ্ত পানি আছে। আজ সেচ দেওয়ার দরকার নেই।"),
    };
  if (v >= 20)
    return {
      tone: "warn",
      status: pick(lang, "Getting dry", "শুকিয়ে আসছে"),
      message: pick(lang, "Water your crops soon — the soil is drying out.", "শীঘ্রই ফসলে পানি দিন — মাটি শুকিয়ে যাচ্ছে।"),
    };
  return {
    tone: "bad",
    status: pick(lang, "Very dry", "অতি শুষ্ক"),
    message: pick(lang, "Immediate irrigation required to protect your crops.", "ফসল রক্ষায় এখনই সেচ দিন।"),
  };
}

export function tempInsight(v: number | null, lang: Lang = "en"): Insight {
  if (v === null) return noData(lang);
  if (v < 15)
    return {
      tone: "warn",
      status: pick(lang, "Too cool", "বেশি ঠান্ডা"),
      message: pick(lang, "It is cooler than most crops like. Growth may slow down.", "অধিকাংশ ফসলের জন্য আবহাওয়া ঠান্ডা। বৃদ্ধি ধীর হতে পারে।"),
    };
  if (v > 34)
    return {
      tone: "bad",
      status: pick(lang, "Too hot", "অতিরিক্ত গরম"),
      message: pick(lang, "Heat stress is likely. Give shade or water in the evening.", "গরমে ফসল ক্ষতিগ্রস্ত হতে পারে। ছায়া দিন বা সন্ধ্যায় পানি দিন।"),
    };
  return {
    tone: "good",
    status: pick(lang, "Good weather", "ভালো আবহাওয়া"),
    message: pick(lang, "The weather is comfortable for your crops right now.", "এই মুহূর্তে আবহাওয়া আপনার ফসলের জন্য উপযুক্ত।"),
  };
}

export function humidityInsight(v: number | null, lang: Lang = "en"): Insight {
  if (v === null) return noData(lang);
  if (v < 40)
    return {
      tone: "warn",
      status: pick(lang, "Dry air", "শুষ্ক বাতাস"),
      message: pick(lang, "The air is dry, so plants lose water faster.", "বাতাস শুষ্ক, গাছ দ্রুত পানি হারাবে।"),
    };
  if (v > 85)
    return {
      tone: "bad",
      status: pick(lang, "Very humid", "অতি আর্দ্র"),
      message: pick(lang, "Very humid air raises the risk of leaf disease. Watch your leaves.", "অতিরিক্ত আর্দ্রতায় পাতার রোগের ঝুঁকি বাড়ে। পাতার দিকে নজর রাখুন।"),
    };
  return {
    tone: "good",
    status: pick(lang, "Comfortable", "স্বাভাবিক"),
    message: pick(lang, "Air moisture is comfortable for healthy plant growth.", "গাছের সুস্থ বৃদ্ধির জন্য বাতাসের আর্দ্রতা ঠিক আছে।"),
  };
}

export function lightInsight(v: number | null, lang: Lang = "en"): Insight {
  if (v === null) return noData(lang);
  if (v < 200)
    return {
      tone: "warn",
      status: pick(lang, "Low sunlight", "কম আলো"),
      message: pick(lang, "Sunlight is low right now — normal at night or on cloudy days.", "এখন আলো কম — রাতে বা মেঘলা দিনে এটি স্বাভাবিক।"),
    };
  if (v > 1000)
    return {
      tone: "warn",
      status: pick(lang, "Very bright", "খুব উজ্জ্বল"),
      message: pick(lang, "Strong sun today. Keep the soil moist to avoid stress.", "আজ রোদ প্রখর। মাটি আর্দ্র রাখুন।"),
    };
  return {
    tone: "good",
    status: pick(lang, "Good sunlight", "পর্যাপ্ত আলো"),
    message: pick(lang, "Sunlight is sufficient for healthy growth.", "সুস্থ বৃদ্ধির জন্য আলো যথেষ্ট।"),
  };
}

export type FarmVitals = {
  soil: number | null;
  temp: number | null;
  humidity: number | null;
  light: number | null;
  online: boolean;
  diseaseDetected: boolean;
};

function scoreFor(insight: Insight): number | null {
  if (insight.tone === "unknown") return null;
  if (insight.tone === "good") return 100;
  if (insight.tone === "warn") return 60;
  return 25;
}

export function farmHealthScore(v: FarmVitals): number {
  const parts = [
    scoreFor(soilInsight(v.soil)),
    scoreFor(tempInsight(v.temp)),
    scoreFor(humidityInsight(v.humidity)),
    scoreFor(lightInsight(v.light)),
    v.online ? 100 : 30,
    v.diseaseDetected ? 30 : 100,
  ].filter((n): n is number => n !== null);
  if (parts.length === 0) return 0;
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}

export function healthTone(score: number): Tone {
  if (score >= 75) return "good";
  if (score >= 50) return "warn";
  return "bad";
}

export function healthSummary(score: number, lang: Lang = "en"): string {
  if (score >= 75) return pick(lang, "Your farm is healthy today.", "আজ আপনার খামার সুস্থ আছে।");
  if (score >= 50) return pick(lang, "Your farm needs a little attention today.", "আজ আপনার খামারের কিছুটা যত্ন প্রয়োজন।");
  return pick(lang, "Your farm needs action today.", "আজ আপনার খামারে দ্রুত পদক্ষেপ প্রয়োজন।");
}

export type Recommendation = {
  id: string;
  tone: Tone;
  title: string;
  detail: string;
};

export function buildRecommendations(v: FarmVitals, lang: Lang = "en"): Recommendation[] {
  const out: Recommendation[] = [];
  const soil = soilInsight(v.soil, lang);
  const temp = tempInsight(v.temp, lang);
  const hum = humidityInsight(v.humidity, lang);
  const light = lightInsight(v.light, lang);

  if (v.soil !== null) {
    out.push({
      id: "water",
      tone: soil.tone,
      title:
        soil.tone === "good"
          ? pick(lang, "No watering needed today", "আজ সেচের প্রয়োজন নেই")
          : soil.tone === "warn"
            ? pick(lang, "Water your crops tomorrow morning", "আগামীকাল সকালে ফসলে পানি দিন")
            : pick(lang, "Water your crops now", "এখনই ফসলে পানি দিন"),
      detail: soil.message,
    });
  }
  if (v.humidity !== null && v.humidity > 85) {
    out.push({
      id: "humidity",
      tone: "warn",
      title: pick(lang, "High humidity may increase disease risk", "উচ্চ আর্দ্রতায় রোগের ঝুঁকি বাড়তে পারে"),
      detail: pick(lang, "Check your leaves with the camera and keep plants well spaced for airflow.", "ক্যামেরা দিয়ে পাতা পরীক্ষা করুন এবং বাতাস চলাচলের জন্য গাছের মাঝে ফাঁকা রাখুন।"),
    });
  }
  if (v.temp !== null) {
    out.push({ id: "temp", tone: temp.tone, title: temp.status, detail: temp.message });
  }
  if (v.light !== null) {
    out.push({ id: "light", tone: light.tone, title: light.status, detail: light.message });
  }
  if (v.diseaseDetected) {
    out.push({
      id: "disease",
      tone: "bad",
      title: pick(lang, "Disease found in a recent leaf photo", "সাম্প্রতিক পাতার ছবিতে রোগ পাওয়া গেছে"),
      detail: pick(lang, "Open Disease Detection to see the treatment steps for your crop.", "চিকিৎসার ধাপ দেখতে রোগ শনাক্তকরণ পাতা খুলুন।"),
    });
  }
  if (!v.online) {
    out.push({
      id: "offline",
      tone: "warn",
      title: pick(lang, "Your farm device is not sending data", "আপনার ফার্ম ডিভাইস তথ্য পাঠাচ্ছে না"),
      detail: pick(lang, "Check the power supply and WiFi. AgroAI will reconnect automatically.", "বিদ্যুৎ ও ওয়াইফাই পরীক্ষা করুন। AgroAI নিজে থেকেই আবার যুক্ত হবে।"),
    });
  }
  if (!out.length) {
    out.push({
      id: "idle",
      tone: "unknown",
      title: pick(lang, "No recommendations yet", "এখনো কোনো পরামর্শ নেই"),
      detail: pick(lang, "Turn on your farm device to start receiving daily advice.", "দৈনিক পরামর্শ পেতে আপনার ফার্ম ডিভাইস চালু করুন।"),
    });
  }
  return out;
}
