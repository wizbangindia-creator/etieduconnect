import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Search } from "lucide-react";
import { api } from "@/lib/api";
import { Spinner, SectionHead } from "@/components/site/ui";

export default function Guides() {
  const [guides, setGuides] = useState(null);
  const [cat, setCat] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    setGuides(null);
    const qs = new URLSearchParams();
    if (cat) qs.set("category", cat);
    if (q) qs.set("search", q);
    const t = setTimeout(() => api.get(`/guides?${qs.toString()}`).then((r) => setGuides(r.data)), q ? 250 : 0);
    return () => clearTimeout(t);
  }, [cat, q]);

  const cats = ["Online vs Distance", "Program Explainers", "Eligibility", "Distance Education", "Career/Education Decisions"];

  return (
    <div>
      <section className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-brand">Knowledge Hub</p>
          <h1 className="font-head text-3xl md:text-5xl font-bold mt-2">Guides & Insights</h1>
          <p className="text-blue-100 mt-3 max-w-2xl">Clear, unbiased education and career guides to help you decide with confidence.</p>
          <div className="mt-6 bg-white rounded-2xl flex items-center px-4 py-1 max-w-xl shadow-lg">
            <Search className="h-5 w-5 text-slate-400" />
            <input data-testid="guides-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides…" className="flex-1 outline-none text-slate-800 px-3 py-3 text-sm" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setCat("")} className={`px-4 py-2 rounded-full text-sm font-medium border ${!cat ? "bg-navy text-white border-navy" : "bg-white text-slate-600 border-slate-200"}`}>All</button>
          {cats.map((c) => <button key={c} onClick={() => setCat(c)} data-testid={`guide-cat-${c.slice(0,6)}`} className={`px-4 py-2 rounded-full text-sm font-medium border ${cat === c ? "bg-navy text-white border-navy" : "bg-white text-slate-600 border-slate-200 hover:border-navy"}`}>{c}</button>)}
        </div>

        {!guides ? <Spinner /> : guides.length === 0 ? <p className="text-center text-slate-400 py-16">No guides found.</p> : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((g) => (
              <Link key={g.slug} to={`/guides/${g.slug}`} data-testid={`guide-card-${g.slug}`} className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="h-40 overflow-hidden"><img src={g.cover_url} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                <div className="p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-light">{g.category}</span>
                  <h3 className="font-head font-semibold text-slate-900 mt-2 leading-snug group-hover:text-navy line-clamp-2">{g.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{g.excerpt}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-navy font-semibold text-sm">Read guide <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
