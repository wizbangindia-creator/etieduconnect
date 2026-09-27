import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { track } from "@/lib/analytics";
import { useLead } from "@/context/LeadContext";
import { useSiteConfig } from "@/context/ConfigContext";
import { UniversityCard } from "@/components/site/UniversityCard";
import { Spinner } from "@/components/site/ui";
import { FaqAccordion } from "@/components/site/FaqAccordion";

export default function Landing() {
  const { slug } = useParams();
  const [lp, setLp] = useState(null);
  const { openLead } = useLead();
  const config = useSiteConfig();

  useEffect(() => {
    setLp(null);
    api.get(`/landing/${slug}`).then((r) => { setLp(r.data); track("view_landing", { slug }); }).catch(() => setLp(false));
  }, [slug]);

  if (lp === null) return <Spinner />;
  if (lp === false) return <div className="text-center py-24 text-slate-500">Page not found. <Link to="/" className="text-navy font-medium">Go home</Link></div>;

  const cta = () => openLead({ cta_label: `Landing - ${lp.slug}`, title: lp.cta_text, program: lp.category || "" });
  const wa = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(config.whatsapp_message || "Hi")}`;

  return (
    <div>
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0 eti-grid-bg opacity-40" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-xs font-medium text-cyan-brand">Know What's Next</span>
          <h1 className="font-head text-3xl md:text-5xl font-extrabold mt-5 leading-tight">{lp.headline}</h1>
          <p className="text-blue-100 mt-4 text-lg max-w-2xl mx-auto">{lp.subheadline}</p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <button onClick={cta} data-testid="landing-hero-cta" className="bg-cyan-brand text-navy px-7 py-3.5 rounded-xl font-semibold hover:bg-white transition-colors">{lp.cta_text}</button>
            <a href={wa} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: "landing" })} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-6 py-3.5 rounded-xl font-semibold"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <p className="text-lg text-slate-700 leading-relaxed max-w-3xl">{lp.intro}</p>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          {["Verified, UGC-DEB aware information", "Compare 2-4 options side by side", "Free, unbiased guidance"].map((t) => (
            <div key={t} className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl p-4 text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />{t}</div>
          ))}
        </div>

        {lp.universities?.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-head text-2xl font-bold text-slate-900">Relevant universities</h2>
              <Link to="/universities" className="text-navy font-semibold text-sm inline-flex items-center gap-1">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{lp.universities.slice(0, 6).map((u, i) => <UniversityCard key={u.slug} u={u} index={i} />)}</div>
          </section>
        )}

        <section className="mt-12 rounded-3xl bg-gradient-to-br from-navy to-navy-light text-white p-8 md:p-12 text-center">
          <h2 className="font-head text-2xl md:text-3xl font-bold">{lp.cta_text}</h2>
          <p className="text-blue-100 mt-2 max-w-xl mx-auto">Tell us your goal — we'll help you shortlist the right options, free.</p>
          <button onClick={cta} data-testid="landing-bottom-cta" className="mt-6 bg-cyan-brand text-navy px-8 py-3.5 rounded-xl font-semibold hover:bg-white transition-colors">{lp.cta_text}</button>
        </section>

        {lp.faqs?.length > 0 && <section className="mt-12 max-w-3xl"><h2 className="font-head text-xl font-bold text-slate-900 mb-4">FAQs</h2><FaqAccordion faqs={lp.faqs} /></section>}

        <p className="mt-10 flex items-start gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-xl p-4"><ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />{config.disclosure_text}</p>
      </div>
    </div>
  );
}
