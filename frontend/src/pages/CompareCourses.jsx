import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Plus, X, GitCompare, Search } from "lucide-react";
import { api, inr } from "@/lib/api";
import { track } from "@/lib/analytics";
import { useLead } from "@/context/LeadContext";
import { Spinner, SectionHead } from "@/components/site/ui";

const ROWS = [
  ["Level", (c) => c.level],
  ["Type", (c) => c.degree_type],
  ["Duration", (c) => c.duration],
  ["Study Modes", (c) => c.modes?.join(", ")],
  ["Eligibility", (c) => c.eligibility],
  ["Fee Range", (c) => `${inr(c.fee_min)} – ${inr(c.fee_max)}`],
  ["Specialisations", (c) => c.specializations?.join(", ")],
  ["Career Options", (c) => c.careers?.join(", ")],
  ["Universities", (c) => `${c.universities?.length} offering`],
];

export default function CompareCourses() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState(null);
  const [all, setAll] = useState([]);
  const [picker, setPicker] = useState(false);
  const [q, setQ] = useState("");
  const { openLead } = useLead();
  const slugs = (params.get("slugs") || "").split(",").filter(Boolean);

  useEffect(() => { api.get("/courses?limit=100").then((r) => setAll(r.data)); }, []);
  useEffect(() => {
    if (slugs.length === 0) { setItems([]); return; }
    api.get(`/compare/courses?slugs=${slugs.join(",")}`).then((r) => {
      setItems(r.data);
      if (r.data.length >= 2) track("comparison_complete", { count: r.data.length, type: "course" });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const setSlugs = (arr) => setParams(arr.length ? { slugs: arr.join(",") } : {});
  const add = (slug) => { if (!slugs.includes(slug) && slugs.length < 4) { setSlugs([...slugs, slug]); setPicker(false); setQ(""); } };
  const remove = (slug) => setSlugs(slugs.filter((s) => s !== slug));
  const filtered = all.filter((c) => !slugs.includes(c.slug) && c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
      <div className="flex items-center gap-2 mb-4 text-sm">
        <Link to="/compare/universities" className="text-slate-500 hover:text-navy">Universities</Link>
        <span className="text-slate-300">·</span>
        <span className="text-navy font-semibold">Courses</span>
      </div>
      <SectionHead eyebrow="Comparison Engine" title="Compare Courses" sub="Compare eligibility, duration, fees, specialisations and career relevance across programs." />

      {items === null ? <Spinner /> : items.length === 0 ? (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {all.map((c) => (
            <button key={c.slug} onClick={() => add(c.slug)} data-testid={`compare-course-pick-${c.slug}`} className="flex items-center gap-3 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl p-4 text-left transition-colors">
              <span className="h-10 w-10 rounded-lg bg-navy text-white flex items-center justify-center font-head font-bold text-xs">{c.category}</span>
              <span className="text-sm font-medium text-slate-700 flex-1">{c.name}</span>
              <Plus className="h-4 w-4 text-navy" />
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
            <table className="w-full border-collapse min-w-[640px]">
              <thead><tr>
                <th className="sticky left-0 bg-navy text-white z-20 p-4 text-left text-sm font-semibold min-w-[130px]">Attribute</th>
                {items.map((c) => (
                  <th key={c.slug} className="p-4 border-l border-slate-100 min-w-[210px]">
                    <div className="relative flex flex-col items-center gap-2">
                      <button onClick={() => remove(c.slug)} className="absolute -top-1 -right-1 text-slate-300 hover:text-red-500"><X className="h-4 w-4" /></button>
                      <span className="h-10 w-10 rounded-lg bg-navy text-white flex items-center justify-center font-head font-bold text-xs">{c.category}</span>
                      <Link to={`/courses/${c.slug}`} className="font-head font-semibold text-sm text-slate-900 text-center hover:text-navy">{c.name}</Link>
                    </div>
                  </th>
                ))}
                {items.length < 4 && <th className="p-4 border-l border-slate-100 min-w-[150px]"><button onClick={() => setPicker(true)} data-testid="compare-add-course" className="flex flex-col items-center gap-2 text-navy w-full"><span className="h-10 w-10 rounded-full border-2 border-dashed border-navy/40 flex items-center justify-center"><Plus className="h-5 w-5" /></span><span className="text-sm font-medium">Add course</span></button></th>}
              </tr></thead>
              <tbody>
                {ROWS.map(([label, fn], ri) => (
                  <tr key={label} className={ri % 2 ? "bg-slate-50/60" : ""}>
                    <td className="sticky left-0 bg-white z-10 p-4 text-sm font-medium text-slate-500 border-t border-slate-100">{label}</td>
                    {items.map((c) => <td key={c.slug} className="p-4 text-center text-xs text-slate-700 border-l border-t border-slate-100 align-top">{fn(c)}</td>)}
                    {items.length < 4 && <td className="border-l border-t border-slate-100" />}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-navy to-navy-light text-white p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div><h3 className="font-head font-bold text-xl">Which course fits your goals?</h3><p className="text-blue-100 text-sm mt-1">Talk to an advisor for a personalised recommendation.</p></div>
            <button onClick={() => openLead({ cta_label: "Compare Courses - Guidance", title: "Find Suitable Programs" })} className="bg-cyan-brand text-navy px-6 py-3 rounded-xl font-semibold hover:bg-white transition-colors shrink-0">Get Free Guidance</button>
          </div>
        </>
      )}

      {picker && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={() => setPicker(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex items-center gap-2"><Search className="h-4 w-4 text-slate-400" /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses…" className="flex-1 outline-none text-sm" /><button onClick={() => setPicker(false)}><X className="h-5 w-5 text-slate-400" /></button></div>
            <div className="overflow-y-auto p-2">{filtered.map((c) => (
              <button key={c.slug} onClick={() => add(c.slug)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-left">
                <span className="h-9 w-9 rounded-lg bg-navy text-white flex items-center justify-center font-head font-bold text-xs">{c.category}</span>
                <span className="text-sm font-medium text-slate-800 flex-1">{c.name}</span><Plus className="h-4 w-4 text-navy" />
              </button>))}</div>
          </div>
        </div>
      )}
    </div>
  );
}
