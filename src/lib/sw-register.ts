export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  const isDev = !import.meta.env.PROD;
  const isIframe = window.self !== window.top;
  const hostname = location.hostname;
  const isPreview =
    hostname.startsWith("id-preview--") || hostname.startsWith("preview--");
  const isLovableProject =
    hostname === "lovableproject.com" ||
    hostname.endsWith(".lovableproject.com");
  const isLovableDev =
    hostname === "lovableproject-dev.com" ||
    hostname.endsWith(".lovableproject-dev.com");
  const isBetaLovable =
    hostname === "beta.lovable.dev" ||
    hostname.endsWith(".beta.lovable.dev");
  const isKillSwitch = location.search.includes("sw=off");

  const shouldSkip =
    isDev ||
    isIframe ||
    isPreview ||
    isLovableProject ||
    isLovableDev ||
    isBetaLovable ||
    isKillSwitch;

  const registrations = await navigator.serviceWorker.getRegistrations();

  const isAppSw = (reg: ServiceWorkerRegistration) => {
    const urls = [
      reg.active?.scriptURL,
      reg.installing?.scriptURL,
      reg.waiting?.scriptURL,
    ].filter(Boolean) as string[];
    const swUrl = new URL("/sw.js", location.href).href;
    return urls.some((url) => url === swUrl);
  };

  if (shouldSkip) {
    await Promise.all(
      registrations.filter(isAppSw).map((reg) => reg.unregister())
    );
    return;
  }

  try {
    const { Workbox } = await import("workbox-window");
    const wb = new Workbox("/sw.js");
    wb.register();
  } catch (err) {
    console.error("Service worker registration failed:", err);
  }
}
