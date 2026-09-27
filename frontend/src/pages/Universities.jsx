import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { api } from "@/lib/api";
import { track } from "@/lib/analytics";
import { UniversityCard } from "@/components/site/UniversityCard";
import { Spinner, SectionHead, Disclosure } from "@/components/site/ui";
import { useSiteConfig } from "@/context/ConfigContext";

export default function Universities() {
  const [params, setParams] = useSearchParams();
  const [meta, setMeta] = useState({ categories: [], locations: [], modes: [], types: [] });
  const [unis, setUnis] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const config = useSiteConfig();

  const f = {
    search: params.get("search") || "",
    mode: params.get("mode") || "",
    category: params.get("category") || "",
    location: params.get("location") || "",
    type: params.get("type") || "",
    sort: params.get("sort") || "featured",
  };

  useEffect(() => { api.get("/meta").then((r) => setMeta(r.data)); }, []);
  useEffect(() => {
    setUnis(null);
    const qs = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => v && qs.set(k, v));
    api.get(`/universities?${qs.toString()}`).then((r) => setUnis(r.data));
    track("view_university_list", { ...f });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const setF = (k, v) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next);
  };
  const clearAll = () => setParams(new URLSearchParams());
  const activeCount = Object.entries(f).filter(([k, v]) => v && k !== "sort").length;

  const Select = ({ k, label, opts }) => (
    <div>
      <label className="text-xs font-semibold text-slate-500 mb-1 block">{label}</label>
      <select data-testid={`filter-${k}`} value={f[k]} onChange={(e) => setF(k, e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-navy outline-none">
        <option value="">All</option>
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="bg-white">
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-brand">Explore</p>
          <h1 className="font-head text-3xl md:text-5xl font-bold mt-2">University Directory</h1>
          <p className="text-blue-100 mt-3 max-w-2xl">Discover UGC-entitled online & distance universities. Filter, compare and shortlist the ones that fit your goals.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Filters */}
        <aside className={`${showFilters ? "fixed inset-0 z-50 bg-black/40 lg:relative lg:bg-transparent lg:z-auto" : "hidden"} lg:block`} onClick={() => setShowFilters(false)}>
          <div className="bg-white lg:bg-transparent h-full w-80 max-w-[85%] lg:w-auto p-5 lg:p-0 overflow-y-auto ml-auto lg:ml-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-head font-semibold text-slate-900 flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && <span className="text-xs bg-navy text-white px-2 py-0.5 rounded-full">{activeCount}</span>}</h3>
              <div className="flex items-center gap-3">
                {activeCount > 0 && <button onClick={clearAll} className="text-xs text-navy font-medium">Clear</button>}
                <button className="lg:hidden" onClick={() => setShowFilters(false)}><X className="h-5 w-5 text-slate-400" /></button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Search</label>
                <input data-testid="filter-search" value={f.search} onChange={(e) => setF("search", e.target.value)} placeholder="University or city…" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-navy outline-none" />
              </div>
              <Select k="mode" label="Study Mode" opts={meta.modes} />
              <Select k="category" label="Program" opts={meta.categories} />
              <Select k="location" label="Location (State)" opts={meta.locations} />
              <Select k="type" label="University Type" opts={meta.types} />
              <Select k="sort" label="Sort By" opts={["featured", "rating", "fee_low", "name"]} />
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-slate-500">{unis ? `${unis.length} universities found` : "Searching…"}</p>
            <button onClick={() => setShowFilters(true)} data-testid="mobile-filter-toggle" className="lg:hidden inline-flex items-center gap-2 text-sm font-medium text-navy border border-navy/20 rounded-xl px-4 py-2"><SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && `(${activeCount})`}</button>
          </div>
          {!unis ? <Spinner /> : unis.length === 0 ? (
            <div className="text-center py-20 text-slate-400"><p>No universities match your filters.</p><button onClick={clearAll} className="mt-3 text-navy font-medium">Clear filters</button></div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">{unis.map((u, i) => <UniversityCard key={u.slug} u={u} index={i} />)}</div>
          )}
          <div className="mt-10"><Disclosure text={config.disclosure_text} /></div>
        </div>
      </div>
    </div>
  );
}
