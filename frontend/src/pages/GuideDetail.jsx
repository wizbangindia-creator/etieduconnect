import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, AlertTriangle, ArrowRight, GitCompare } from "lucide-react";
import { api } from "@/lib/api";
import { track } from "@/lib/analytics";
import { useLead } from "@/context/LeadContext";
import { Spinner, Breadcrumb } from "@/components/site/ui";
import { FaqAccordion } from "@/components/site/FaqAccordion";

export default function GuideDetail() {
  const { slug } = useParams();
  const [g, setG] = useState(null);
  const { openLead } = useLead();

  useEffect(() => {
    setG(null);
    api.get(`/guides/${slug}`).then((r) => { setG(r.data); track("guide_engagement", { slug }); }).catch(() => setG(false));
  }, [slug]);

  if (g === null) return <Spinner />;
  if (g === false) return <div className="text-center py-24 text-slate-500">Guide not found. <Link to="/guides" className="text-navy font-medium">Browse guides</Link></div>;

  return (
    <article>
      <div className="relative bg-navy text-white">
        <img src={g.cover_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy to-navy/60" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-blue-200"><Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Guides", to: "/guides" }, { label: g.category }]} /></div>
          <span className="inline-block mt-5 text-[11px] font-semibold uppercase tracking-wider text-cyan-brand">{g.category}</span>
          <h1 className="font-head text-3xl md:text-4xl font-bold mt-2 leading-tight">{g.title}</h1>
          <p className="text-blue-100 text-sm mt-3">By {g.author} · Last verified {g.last_verified}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-blue-50 border-l-4 border-navy rounded-r-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-navy mb-1">Direct Answer</p>
          <p className="text-slate-800 leading-relaxed">{g.direct_answer}</p>
        </div>

        {g.key_facts?.length > 0 && (
          <div className="mt-6 grid sm:grid-cols-2 gap-2">
            {g.key_facts.map((k) => <div key={k} className="flex items-start gap-2 bg-white border border-slate-100 rounded-lg p-3 text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />{k}</div>)}
          </div>
        )}

        <div className="prose prose-slate max-w-none mt-8 text-slate-700 leading-relaxed space-y-4">
          {g.body?.split("\n\n").map((para, i) => {
            const html = para.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>');
            return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
          })}
        </div>

        {g.who_suits && <div className="mt-6 bg-white border border-slate-200 rounded-xl p-5"><h3 className="font-head font-semibold text-slate-900">Who it may suit</h3><p className="text-slate-600 text-sm mt-2">{g.who_suits}</p></div>}
        {g.caveats && <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-5 flex gap-3"><AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" /><div><h3 className="font-head font-semibold text-amber-900 text-sm">Important caveats</h3><p className="text-amber-800 text-sm mt-1">{g.caveats}</p></div></div>}

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-navy to-navy-light text-white p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div><h3 className="font-head font-bold text-lg">Ready to compare your options?</h3><p className="text-blue-100 text-sm">Get free, unbiased guidance.</p></div>
          <div className="flex gap-2 shrink-0">
            <Link to="/compare/universities" className="inline-flex items-center gap-1 bg-white/10 border border-white/20 px-4 py-2.5 rounded-xl text-sm font-semibold"><GitCompare className="h-4 w-4" /> Compare</Link>
            <button onClick={() => openLead({ cta_label: `Guide - ${g.slug}`, title: "Get Free Guidance" })} data-testid="guide-guidance-cta" className="bg-cyan-brand text-navy px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white">Get Guidance</button>
          </div>
        </div>

        {g.faqs?.length > 0 && <div className="mt-10"><h2 className="font-head text-xl font-bold text-slate-900 mb-4">FAQs</h2><FaqAccordion faqs={g.faqs} /></div>}

        {g.related?.length > 0 && (
          <div className="mt-10">
            <h2 className="font-head text-xl font-bold text-slate-900 mb-4">Related guides</h2>
            <div className="space-y-2">{g.related.map((r) => (
              <Link key={r.slug} to={`/guides/${r.slug}`} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-navy transition-colors">
                <img src={r.cover_url} alt="" className="h-12 w-16 object-cover rounded-lg" />
                <span className="text-sm font-medium text-slate-800 flex-1 line-clamp-1">{r.title}</span>
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </Link>))}</div>
          </div>
        )}
      </div>
    </article>
  );
}
