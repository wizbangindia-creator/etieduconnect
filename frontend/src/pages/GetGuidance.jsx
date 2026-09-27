import { useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck, MessageCircle, Phone, Compass } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiErrorDetail } from "@/lib/api";
import { getLeadContext, track } from "@/lib/analytics";
import { useSiteConfig } from "@/context/ConfigContext";

const QUALS = ["10+2 / 12th Pass", "Diploma", "Graduate", "Post Graduate"];
const PROGRAMS = ["MBA", "MCA", "BCA", "BBA", "B.Com", "M.Com", "BA", "MA", "M.Sc", "Not sure yet"];
const MODES = ["Online", "Distance", "Regular", "No preference"];
const STATUS = ["Student", "Working Professional", "Fresher / Job Seeker", "Parent"];

export default function GetGuidance() {
  const config = useSiteConfig();
  const [f, setF] = useState({ name: "", phone: "", email: "", qualification: "", program_interest: "", preferred_mode: "", current_status: "", preferred_location: "", consent: true });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);
  const upd = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-navy focus:ring-2 focus:ring-blue-100 outline-none text-sm";
  const wa = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(config.whatsapp_message || "Hi")}`;

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim() || !/^[0-9]{10,13}$/.test(f.phone.replace(/\D/g, ""))) return toast.error("Enter your name and a valid mobile number");
    if (!f.qualification || !f.program_interest) return toast.error("Choose qualification and program interest");
    if (!f.consent) return toast.error("Please provide consent");
    setLoading(true);
    try {
      const { data } = await api.post("/leads", { ...f, phone: f.phone.replace(/\D/g, ""), ...getLeadContext(), context_type: "general", cta_label: "Get Guidance Page", source: "website" });
      track("lead_submit", { program: f.program_interest, from: "guidance_page" });
      setDone(data.lead_id);
      window.scrollTo(0, 0);
    } catch (err) { toast.error(formatApiErrorDetail(err.response?.data?.detail)); } finally { setLoading(false); }
  };

  return (
    <div className="bg-navy">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-2 gap-10 items-start">
        <div className="text-white lg:sticky lg:top-24">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-xs font-medium text-cyan-brand"><Compass className="h-3.5 w-3.5" /> Free & No Obligation</span>
          <h1 className="font-head text-3xl md:text-5xl font-bold mt-5 leading-tight">Talk to an Education Advisor</h1>
          <p className="text-blue-100 mt-4 text-lg leading-relaxed">Share your goal and background. We'll help you shortlist the right programs and universities — unbiased, and handed to our trusted counselling partner only with your consent.</p>
          <ul className="mt-6 space-y-3">
            {["Personalized program & university options", "Clarity on eligibility, fees and study mode", "Compare shortlisted options with an expert", "No spam. No pressure. No outcome promises."].map((t) => (
              <li key={t} className="flex items-center gap-3 text-blue-50"><CheckCircle2 className="h-5 w-5 text-cyan-brand shrink-0" />{t}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: "guidance" })} className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-xl font-semibold text-sm"><MessageCircle className="h-4 w-4" /> WhatsApp us</a>
            <a href={`tel:${config.contact_phone}`} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-3 rounded-xl font-semibold text-sm"><Phone className="h-4 w-4" /> {config.contact_phone}</a>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
          {done ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="font-head text-2xl font-bold text-slate-900">Thank you!</h3>
              <p className="text-slate-600 mt-2">An advisor will reach out shortly. Your reference ID:</p>
              <p className="mt-3 inline-block bg-slate-100 px-4 py-2 rounded-lg font-mono text-navy font-semibold" data-testid="guidance-success-id">{done}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4" data-testid="guidance-form">
              <h2 className="font-head text-xl font-bold text-slate-900">Get your personalized options</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-slate-700">Full Name*</label><input data-testid="guidance-name" className={inputCls + " mt-1"} value={f.name} onChange={(e) => upd("name", e.target.value)} placeholder="Your name" /></div>
                <div><label className="text-sm font-medium text-slate-700">Mobile*</label><input data-testid="guidance-phone" className={inputCls + " mt-1"} value={f.phone} onChange={(e) => upd("phone", e.target.value)} placeholder="10-digit mobile" inputMode="numeric" /></div>
              </div>
              <div><label className="text-sm font-medium text-slate-700">Email (optional)</label><input data-testid="guidance-email" className={inputCls + " mt-1"} value={f.email} onChange={(e) => upd("email", e.target.value)} placeholder="you@example.com" /></div>
              <div><label className="text-sm font-medium text-slate-700">Highest Qualification*</label>
                <select data-testid="guidance-qual" className={inputCls + " mt-1"} value={f.qualification} onChange={(e) => upd("qualification", e.target.value)}><option value="">Select</option>{QUALS.map((o) => <option key={o}>{o}</option>)}</select></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-slate-700">Program Interest*</label><select data-testid="guidance-program" className={inputCls + " mt-1"} value={f.program_interest} onChange={(e) => upd("program_interest", e.target.value)}><option value="">Select</option>{PROGRAMS.map((o) => <option key={o}>{o}</option>)}</select></div>
                <div><label className="text-sm font-medium text-slate-700">Preferred Mode</label><select className={inputCls + " mt-1"} value={f.preferred_mode} onChange={(e) => upd("preferred_mode", e.target.value)}><option value="">Any</option>{MODES.map((o) => <option key={o}>{o}</option>)}</select></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-slate-700">Current Status</label><select className={inputCls + " mt-1"} value={f.current_status} onChange={(e) => upd("current_status", e.target.value)}><option value="">Select</option>{STATUS.map((o) => <option key={o}>{o}</option>)}</select></div>
                <div><label className="text-sm font-medium text-slate-700">Preferred Location</label><input className={inputCls + " mt-1"} value={f.preferred_location} onChange={(e) => upd("preferred_location", e.target.value)} placeholder="City / State (optional)" /></div>
              </div>
              <label className="flex items-start gap-2 text-xs text-slate-500"><input type="checkbox" checked={f.consent} onChange={(e) => upd("consent", e.target.checked)} className="mt-0.5 h-4 w-4 rounded text-navy" data-testid="guidance-consent" />I agree to be contacted by ETI EduConnect and its counselling partner.</label>
              <button disabled={loading} data-testid="guidance-submit" className="w-full bg-navy hover:bg-navy-dark text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">{loading && <Loader2 className="h-4 w-4 animate-spin" />}Get My Options</button>
              <p className="flex items-center gap-1.5 text-[11px] text-slate-400 justify-center"><ShieldCheck className="h-3.5 w-3.5" /> We don't promise admission, placement or salary outcomes.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
