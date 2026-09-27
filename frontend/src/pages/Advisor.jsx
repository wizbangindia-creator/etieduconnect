import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ArrowLeft, Loader2, GraduationCap, Bookmark, BookmarkCheck, RotateCcw, Trophy } from "lucide-react";
import { api, inr } from "@/lib/api";
import { track } from "@/lib/analytics";
import { useLead } from "@/context/LeadContext";
import { useShortlist } from "@/context/ShortlistContext";
import { UniLogo } from "@/components/site/Logo";

const STEPS = [
  { key: "qualification", q: "What's your highest qualification?", opts: ["10+2 / 12th Pass", "Diploma", "Graduate", "Post Graduate"] },
  { key: "program_interest", q: "Which program are you interested in?", opts: ["MBA", "MCA", "BCA", "BBA", "B.Com", "M.Com", "BA", "MA", "M.Sc", "Not sure yet"] },
  { key: "preferred_mode", q: "How would you like to study?", opts: ["Online", "Distance", "No preference"] },
  { key: "budget", q: "What's your total budget?", opts: [["Under ₹1,00,000", 100000], ["₹1,00,000 – ₹2,00,000", 200000], ["₹2,00,000 – ₹3,00,000", 300000], ["Flexible / No limit", 9999999]] },
  { key: "priority", q: "What matters most to you?", opts: [["Lowest cost", "cost"], ["Quality & ranking", "quality"], ["Recognition & approvals", "recognition"], ["Flexibility", "flexibility"]] },
];

export default function Advisor() {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { openLead } = useLead();
  const { isSaved, toggle } = useShortlist();

  const choose = (key, val) => {
    const next = { ...ans, [key]: val };
    setAns(next);
    if (step < STEPS.length - 1) setStep(step + 1);
    else submit(next);
  };

  const submit = async (payload) => {
    setLoading(true);
    track("advisor_complete", { program: payload.program_interest });
    try {
      const body = { ...payload };
      if (body.preferred_mode === "No preference") body.preferred_mode = null;
      if (body.program_interest === "Not sure yet") body.program_interest = null;
      const { data } = await api.post("/advisor/recommend", body);
      setResult(data);
    } catch (e) { /* noop */ } finally { setLoading(false); }
  };

  const restart = () => { setStep(0); setAns({}); setResult(null); };
  const progress = ((step + (result ? 1 : 0)) / STEPS.length) * 100;

  return (
    <div className="min-h-[80vh] bg-navy eti-grid-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-white">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-xs font-medium text-cyan-brand"><Sparkles className="h-3.5 w-3.5" /> EduConnect AI Advisor</span>
          <h1 className="font-head text-3xl md:text-4xl font-bold mt-4">Find your best-fit university in 60 seconds</h1>
          <p className="text-blue-100 mt-2">Answer a few quick questions and get personalized, unbiased matches.</p>
        </div>

        {loading ? (
          <div className="mt-12 flex flex-col items-center text-white"><Loader2 className="h-10 w-10 animate-spin text-cyan-brand" /><p className="mt-4 text-blue-100">Analysing your preferences…</p></div>
        ) : result ? (
          <Results result={result} restart={restart} openLead={openLead} isSaved={isSaved} toggle={toggle} ans={ans} />
        ) : (
          <div className="mt-8 bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-1 text-xs text-slate-400"><span>Step {step + 1} of {STEPS.length}</span><span>{Math.round(progress)}%</span></div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6"><div className="h-full bg-navy rounded-full transition-all duration-300" style={{ width: `${progress}%` }} /></div>
            <h2 className="font-head text-xl font-bold text-slate-900 mb-5" data-testid="advisor-question">{STEPS[step].q}</h2>
            <div className="grid gap-3">
              {STEPS[step].opts.map((o) => {
                const [label, val] = Array.isArray(o) ? o : [o, o];
                const active = ans[STEPS[step].key] === val;
                return (
                  <button key={label} data-testid={`advisor-option-${String(val).slice(0,10)}`} onClick={() => choose(STEPS[step].key, val)}
                    className={`flex items-center justify-between text-left px-5 py-4 rounded-2xl border-2 transition-all ${active ? "border-navy bg-blue-50" : "border-slate-200 hover:border-navy hover:bg-slate-50"}`}>
                    <span className="font-medium text-slate-800">{label}</span>
                    <ArrowRight className="h-4 w-4 text-navy" />
                  </button>
                );
              })}
            </div>
            {step > 0 && <button onClick={() => setStep(step - 1)} data-testid="advisor-back" className="mt-5 inline-flex items-center gap-1 text-slate-500 text-sm"><ArrowLeft className="h-4 w-4" /> Back</button>}
          </div>
        )}
      </div>
    </div>
  );
}

function Results({ result, restart, openLead, isSaved, toggle, ans }) {
  const recs = result.recommendations || [];
  return (
    <div className="mt-8">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1"><Trophy className="h-5 w-5 text-amber-500" /><h2 className="font-head text-xl font-bold text-slate-900" data-testid="advisor-results">Your best-fit matches</h2></div>
        <p className="text-sm text-slate-500 mb-6">Based on your goal ({ans.program_interest || "any program"}), mode and priorities. These are suggestions to explore — not rankings.</p>

        <div className="space-y-4">
          {recs.map((u, i) => {
            const saved = isSaved("universities", u.slug);
            return (
              <div key={u.slug} data-testid={`advisor-rec-${u.slug}`} className="border border-slate-200 rounded-2xl p-4 sm:p-5 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  {i === 0 && <span className="absolute -mt-7 ml-1 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">TOP MATCH</span>}
                  <UniLogo text={u.logo_text} color={u.logo_color} size={48} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Link to={`/universities/${u.slug}`} className="font-head font-semibold text-slate-900 hover:text-navy line-clamp-1">{u.name}</Link>
                      <span className="shrink-0 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">{u.match_percent}% match</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{u.city}, {u.state} · NAAC {u.naac_grade} · {u.modes.join(", ")}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {u.match_reasons.map((r) => <span key={r} className="text-[11px] bg-blue-50 text-navy px-2 py-0.5 rounded-full">{r}</span>)}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm font-head font-bold text-navy">{inr(u.fee_min)} <span className="text-slate-400 font-normal text-xs">onwards</span></p>
                      <div className="flex gap-2">
                        <button onClick={() => toggle("universities", { slug: u.slug, name: u.name, logo_text: u.logo_text, logo_color: u.logo_color })} className="p-2 border border-slate-200 rounded-lg text-navy" aria-label="Save">{saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}</button>
                        <button onClick={() => openLead({ context_type: "university", context_slug: u.slug, cta_label: "Advisor result", title: `Get options for ${u.short_name}` })} className="bg-navy text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-navy-dark">Get Options</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {result.recommended_program && (
          <div className="mt-6 bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
            <GraduationCap className="h-8 w-8 text-navy shrink-0" />
            <div className="flex-1"><p className="text-xs text-slate-400 font-semibold uppercase">Recommended program</p><Link to={`/courses/${result.recommended_program.slug}`} className="font-head font-semibold text-slate-900 hover:text-navy">{result.recommended_program.name}</Link><p className="text-xs text-slate-500">{result.recommended_program.duration} · {result.recommended_program.level}</p></div>
            <Link to={`/courses/${result.recommended_program.slug}`} className="text-navy"><ArrowRight className="h-5 w-5" /></Link>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button onClick={() => openLead({ cta_label: "Advisor - Guidance", title: "Get Personalized Guidance" })} data-testid="advisor-guidance-cta" className="flex-1 bg-navy text-white py-3 rounded-xl font-semibold">Talk to an Advisor</button>
          {recs.length >= 2 && <Link to={`/compare/universities?slugs=${recs.slice(0,3).map((r)=>r.slug).join(",")}`} className="flex-1 text-center border border-navy/20 text-navy py-3 rounded-xl font-semibold">Compare These</Link>}
          <button onClick={restart} data-testid="advisor-restart" className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-600 py-3 px-5 rounded-xl font-semibold"><RotateCcw className="h-4 w-4" /> Retake</button>
        </div>
        <p className="text-[11px] text-slate-400 mt-4 text-center">Suggestions are generated from your inputs and verified university data. We don't promise admission or outcomes.</p>
      </div>
    </div>
  );
}
