import { useEffect, useState } from "react";
import { X, Loader2, CheckCircle2, ShieldCheck, BadgeCheck, RefreshCcw, Lock, LifeBuoy } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiErrorDetail } from "@/lib/api";
import { getLeadContext, track } from "@/lib/analytics";

const COURSES = ["Online MBA", "Online Executive MBA", "Online Dual MBA", "Online MCA", "Online MCom", "Online MA", "Online BBA", "Online BCom", "Online BA", "Online BCA"];
const STATES = ["Uttar Pradesh", "Maharashtra", "Delhi", "Bihar", "Karnataka", "Haryana", "Rajasthan", "Gujarat", "West Bengal", "Telangana", "Jharkhand", "Madhya Pradesh", "Kerala", "Odisha", "Tamil Nadu", "Andhra Pradesh", "Punjab", "Uttarakhand", "Assam", "Chandigarh", "Sikkim", "Chhattisgarh", "Goa", "Tripura", "Arunachal Pradesh", "Himachal Pradesh", "Jammu and Kashmir", "Lakshadweep", "Meghalaya", "Manipur", "Nagaland", "Puducherry", "Mizoram", "Andaman and Nicobar Island", "Dadra and Nagar Haveli", "Daman and Diu", "Ladakh", "Other"];
const TRUST = [
  { icon: BadgeCheck, t: "EduConnect Assured" },
  { icon: RefreshCcw, t: "100% Refund Support" },
  { icon: Lock, t: "5 Days Fees Increase Lock" },
  { icon: LifeBuoy, t: "Post Admission Support" },
];
const SEEN_KEY = "eti_welcome_seen";

export function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", course: "", state: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    const t = setTimeout(() => { setOpen(true); track("welcome_popup_view"); }, 1400);
    return () => clearTimeout(t);
  }, []);

  const close = () => { sessionStorage.setItem(SEEN_KEY, "1"); setOpen(false); };
  const upd = (k, v) => setF((p) => ({ ...p, [k]: v }));
  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim() || !/^[0-9]{10,13}$/.test(f.phone.replace(/\D/g, ""))) return toast.error("Please enter your name and a valid mobile number");
    if (!f.course || !f.state) return toast.error("Please select your course and state");
    setLoading(true);
    try {
      const { data } = await api.post("/leads", {
        name: f.name, phone: f.phone.replace(/\D/g, ""), qualification: "Not specified",
        program_interest: f.course, preferred_location: f.state, consent: true,
        ...getLeadContext(), source: "welcome_popup", cta_label: "Welcome Popup", context_type: "general",
      });
      track("lead_submit", { from: "welcome_popup", course: f.course });
      sessionStorage.setItem(SEEN_KEY, "1");
      setDone(data.lead_id);
    } catch (err) { toast.error(formatApiErrorDetail(err.response?.data?.detail)); } finally { setLoading(false); }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-navy focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-navy-dark/70 backdrop-blur-sm" onClick={close}>
      <div data-testid="welcome-modal" className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl relative overflow-hidden max-h-[94vh] overflow-y-auto grid md:grid-cols-2 eti-fade-up" onClick={(e) => e.stopPropagation()}>
        <button onClick={close} data-testid="welcome-modal-close" className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white md:text-white"><X className="h-5 w-5" /></button>

        {/* Left — brand panel */}
        <div className="relative bg-navy text-white p-7 eti-grid-bg hidden md:flex flex-col">
          <div className="absolute -bottom-16 -right-10 h-56 w-56 rounded-full bg-sun/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-head text-2xl font-extrabold leading-tight">Compare & Select from <span className="text-sun">100+</span> Best Universities for your Top Online Course</h2>
            <div className="mt-5 space-y-2">
              <p className="inline-flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 text-sm font-semibold"><span className="text-sun">No-Cost EMI</span> from ₹4,999/-</p>
              <p className="inline-flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 text-sm font-semibold ml-0">✅ 100% Placement Assistance</p>
            </div>
            <div className="mt-6 pt-5 border-t border-white/15">
              <p className="text-xs font-semibold uppercase tracking-wider text-sun mb-3">EduConnect Assured</p>
              <ul className="space-y-2.5">
                {TRUST.map((it) => (
                  <li key={it.t} className="flex items-center gap-2.5 text-sm text-blue-50"><it.icon className="h-4 w-4 text-sun shrink-0" />{it.t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="p-6 sm:p-7">
          {done ? (
            <div className="text-center py-10">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="font-head text-2xl font-bold text-slate-900">You're all set!</h3>
              <p className="text-slate-600 mt-2 text-sm">An advisor will reach out shortly. Reference ID:</p>
              <p className="mt-3 inline-block bg-slate-100 px-4 py-2 rounded-lg font-mono text-navy font-semibold" data-testid="welcome-success-id">{done}</p>
              <button onClick={close} className="mt-6 w-full bg-navy text-white py-3 rounded-xl font-semibold">Explore the site</button>
            </div>
          ) : (
            <>
              <div className="md:hidden mb-4">
                <h2 className="font-head text-xl font-extrabold text-slate-900 leading-tight">Compare & Select from <span className="text-navy">100+</span> Best Universities for your Online Course</h2>
                <p className="text-sm text-slate-500 mt-1"><span className="font-semibold text-navy">No-Cost EMI</span> from ₹4,999/- · 100% Placement Assistance</p>
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-head text-lg font-bold text-slate-900">Get your free comparison</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"><ShieldCheck className="h-3.5 w-3.5" /> We don't spam</span>
              </div>
              <form onSubmit={submit} className="space-y-3.5">
                <div><label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input data-testid="welcome-name" className={inputCls + " mt-1"} value={f.name} onChange={(e) => upd("name", e.target.value)} placeholder="Your name" /></div>
                <div><label className="text-sm font-medium text-slate-700">Mobile Number</label>
                  <input data-testid="welcome-phone" className={inputCls + " mt-1"} value={f.phone} onChange={(e) => upd("phone", e.target.value)} placeholder="10-digit mobile" inputMode="numeric" /></div>
                <div><label className="text-sm font-medium text-slate-700">Select Course</label>
                  <select data-testid="welcome-course" className={inputCls + " mt-1"} value={f.course} onChange={(e) => upd("course", e.target.value)}>
                    <option value="">Choose a course</option>{COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select></div>
                <div><label className="text-sm font-medium text-slate-700">Select State</label>
                  <select data-testid="welcome-state" className={inputCls + " mt-1"} value={f.state} onChange={(e) => upd("state", e.target.value)}>
                    <option value="">Choose your state</option>{STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select></div>
                <button disabled={loading} data-testid="welcome-submit" className="w-full bg-sun hover:bg-sun-dark text-navy py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-colors disabled:opacity-60">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}Compare Now
                </button>
                <p className="flex items-center gap-1.5 text-[11px] text-slate-400 justify-center"><Lock className="h-3.5 w-3.5" /> Your personal information is secure with us.</p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
