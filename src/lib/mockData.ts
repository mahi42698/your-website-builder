// Mock time-series sensor data for charts when no real data exists yet
export function generateMockSeries(hours = 24) {
  const now = Date.now();
  return Array.from({ length: hours }, (_, i) => {
    const t = new Date(now - (hours - 1 - i) * 3600 * 1000);
    return {
      time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      soil_moisture: Math.round(40 + Math.sin(i / 3) * 12 + Math.random() * 6),
      temperature: Math.round(24 + Math.sin(i / 4) * 5 + Math.random() * 2),
      humidity: Math.round(60 + Math.cos(i / 3) * 10 + Math.random() * 4),
      light_intensity: Math.max(0, Math.round(500 + Math.sin((i - 6) / 4) * 400 + Math.random() * 50)),
    };
  });
}