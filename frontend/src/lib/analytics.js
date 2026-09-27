import { api } from "@/lib/api";

const UTM_KEY = "eti_utm";
const SID_KEY = "eti_sid";

function sessionId() {
  let s = localStorage.getItem(SID_KEY);
  if (!s) { s = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem(SID_KEY, s); }
  return s;
}

export function captureUtms() {
  const params = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "campaign"];
  const found = {};
  keys.forEach((k) => { if (params.get(k)) found[k] = params.get(k); });
  if (Object.keys(found).length) {
    const existing = JSON.parse(localStorage.getItem(UTM_KEY) || "{}");
    localStorage.setItem(UTM_KEY, JSON.stringify({ ...existing, ...found }));
  }
  if (!localStorage.getItem("eti_referrer") && document.referrer) {
    localStorage.setItem("eti_referrer", document.referrer);
  }
}

export function getLeadContext() {
  const utm = JSON.parse(localStorage.getItem(UTM_KEY) || "{}");
  return {
    utm_source: utm.utm_source || null,
    utm_medium: utm.utm_medium || null,
    utm_campaign: utm.utm_campaign || null,
    utm_term: utm.utm_term || null,
    utm_content: utm.utm_content || null,
    campaign: utm.campaign || utm.utm_campaign || null,
    landing_page: window.location.pathname,
    referrer: localStorage.getItem("eti_referrer") || null,
  };
}

export function track(event, props = {}) {
  try {
    api.post("/events", { event, props, session_id: sessionId(), path: window.location.pathname }).catch(() => {});
  } catch (e) { /* noop */ }
}
