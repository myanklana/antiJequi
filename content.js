// Content script: ocultação cosmética via CSS.

const COSMETIC_SELECTORS = [
  "ins.adsbygoogle",
  "[id^='google_ads']",
  "[id^='div-gpt-ad']",
  "iframe[src*='doubleclick.net']",
  ".ad-banner",
  ".advertisement",
  "[data-ad]",
  "[data-ad-slot]",
];

chrome.storage.local.get("enabled").then(({ enabled = true }) => {
  if (!enabled) return;

  const style = document.createElement("style");
  style.id = "antijequi-cosmetic";
  style.textContent = `${COSMETIC_SELECTORS.join(",\n")} { display: none !important; }`;

  // Em document_start o <head> pode ainda não existir.
  (document.head || document.documentElement).appendChild(style);
});
