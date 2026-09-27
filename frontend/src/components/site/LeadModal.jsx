import { useState } from "react";
import { X, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiErrorDetail } from "@/lib/api";
import { getLeadContext, track } from "@/lib/analytics";
import { useLead } from "@/context/LeadContext";

const QUALS = ["10+2 / 12th Pass", "Diploma", "Graduate", "Post Graduate"];
const PROGRAMS = ["MBA", "MCA", "BCA", "BBA", "B.Com", "M.Com", "BA", "MA", "M.Sc", "Not sure yet"];
const MODES = ["Online", "Distance", "Regular", "No preference"];
const STATUS = ["Student", "Working Professional", "Fresher / Job Seeker", "Parent"];

export function LeadModal() {
  const { open, setOpen, config } = useLead();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", email: "", qualification: "", program_interest: config.program || "", preferred_mode: "", current_status: "", preferred_location: "", consent: true });

  if (!open) return null;

  const upd = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const close = () => { setOpen(false); setTimeout(() => { setStep(1); setDone(null); }, 200); };

  const next = () => {
    if (!f.name.trim() || !/^[0-9]{10,13}$/.test(f.phone.replace(/\D/g, ""))) {
      toast.error("Please enter your name and a valid mobile number");
      return;
    }
    setStep(2);
  };

  const submit = async () => {
    if (!f.qualification || !f.program_interest) { toast.error("Please choose your qualification and program interest"); return; }
    if (!f.consent) { toast.error("Please provide consent to be contacted"); return; }
    setLoading(true);
    try {
      const payload = { ...f, phone: f.phone.replace(/\D/g, ""), ...getLeadContext(),
        context_type: config.context_type || "general", context_slug: config.context_slug || null,
        cta_label: config.cta_label || "Lead Form", source: "website" };
      const { data } = await api.post("/leads", payload);
      track("lead_submit", { program: f.program_interest, context: config.context_type });
      setDone(data.lead_id);
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Could not submit. Try again.");
    } finally { setLoading(false); }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-navy focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all";

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-navy-dark/60 backdrop-blur-sm" onClick={close}>
      <div data-testid="lead-modal" className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl relative max-h-[92vh] overflow-y-auto eti-fade-up" onClick={(e) => e.stopPropagation()}>
        <button onClick={close} data-testid="lead-modal-close" className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white"><X className="h-5 w-5" /></button>

        {done ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="font-head text-2xl font-bold text-slate-900">You're all set!</h3>
            <p className="text-slate-600 mt-2 text-sm">An education advisor will reach out shortly. Your reference ID:</p>
            <p className="mt-3 inline-block bg-slate-100 px-4 py-2 rounded-lg font-mono text-navy font-semibold" data-testid="lead-success-id">{done}</p>
            <button onClick={close} data-testid="lead-modal-done" className="mt-6 w-full bg-navy text-white py-3 rounded-xl font-semibold">Done</button>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-navy to-navy-light text-white p-6 rounded-t-3xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-brand">Free & No Obligation</p>
              <h3 className="font-head text-xl sm:text-2xl font-bold mt-1">{config.title || "Get Personalized Options"}</h3>
              <p className="text-blue-100 text-sm mt-1">{config.subtitle || "Tell us a little about you and we'll help you compare the right programs."}</p>
              <div className="flex gap-1.5 mt-4">
                <span className={`h-1.5 rounded-full flex-1 ${step >= 1 ? "bg-cyan-brand" : "bg-white/30"}`} />
                <span className={`h-1.5 rounded-full flex-1 ${step >= 2 ? "bg-cyan-brand" : "bg-white/30"}`} />
              </div>
            </div>

            <div className="p-6 space-y-4">
              {step === 1 ? (
                <>
                  <div><label className="text-sm font-medium text-slate-700">Full Name*</label>
                    <input data-testid="lead-name-input" className={inputCls + " mt-1"} value={f.name} onChange={(e) => upd("name", e.target.value)} placeholder="e.g. Priya Sharma" /></div>
                  <div><label className="text-sm font-medium text-slate-700">Mobile Number*</label>
                    <input data-testid="lead-phone-input" className={inputCls + " mt-1"} value={f.phone} onChange={(e) => upd("phone", e.target.value)} placeholder="10-digit mobile" inputMode="numeric" /></div>
                  <div><label className="text-sm font-medium text-slate-700">Email (optional)</label>
                    <input data-testid="lead-email-input" className={inputCls + " mt-1"} value={f.email} onChange={(e) => upd("email", e.target.value)} placeholder="you@example.com" /></div>
                  <button onClick={next} data-testid="lead-next-button" className="w-full bg-navy hover:bg-navy-dark text-white py-3 rounded-xl font-semibold transition-colors">Continue</button>
                </>
              ) : (
                <>
                  <div><label className="text-sm font-medium text-slate-700">Highest Qualification*</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {QUALS.map((o) => <button key={o} data-testid={`lead-qual-${o.slice(0,4)}`} onClick={() => upd("qualification", o)} className={`text-xs py-2.5 px-2 rounded-lg border transition-all ${f.qualification === o ? "border-navy bg-blue-50 text-navy font-semibold" : "border-slate-200 text-slate-600"}`}>{o}</button>)}
                    </div></div>
                  <div><label className="text-sm font-medium text-slate-700">Program Interest*</label>
                    <select data-testid="lead-program-select" className={inputCls + " mt-1"} value={f.program_interest} onChange={(e) => upd("program_interest", e.target.value)}>
                      <option value="">Select a program</option>{PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-sm font-medium text-slate-700">Preferred Mode</label>
                      <select data-testid="lead-mode-select" className={inputCls + " mt-1"} value={f.preferred_mode} onChange={(e) => upd("preferred_mode", e.target.value)}>
                        <option value="">Any</option>{MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select></div>
                    <div><label className="text-sm font-medium text-slate-700">Current Status</label>
                      <select data-testid="lead-status-select" className={inputCls + " mt-1"} value={f.current_status} onChange={(e) => upd("current_status", e.target.value)}>
                        <option value="">Select</option>{STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select></div>
                  </div>
                  <label className="flex items-start gap-2 text-xs text-slate-500">
                    <input type="checkbox" data-testid="lead-consent-checkbox" checked={f.consent} onChange={(e) => upd("consent", e.target.checked)} className="mt-0.5 h-4 w-4 rounded text-navy" />
                    I agree to be contacted by ETI EduConnect and its counselling partner regarding education options.
                  </label>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium">Back</button>
                    <button onClick={submit} disabled={loading} data-testid="lead-submit-button" className="flex-1 bg-navy hover:bg-navy-dark text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Get My Options
                    </button>
                  </div>
                </>
              )}
              <p className="flex items-center gap-1.5 text-[11px] text-slate-400 justify-center"><ShieldCheck className="h-3.5 w-3.5" /> Your data is secure. We don't promise admission or outcomes.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
