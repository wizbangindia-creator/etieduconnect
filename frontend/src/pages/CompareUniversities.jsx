import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Plus, X, GitCompare, Search } from "lucide-react";
import { api, inr } from "@/lib/api";
import { track } from "@/lib/analytics";
import { useLead } from "@/context/LeadContext";
import { UniLogo } from "@/components/site/Logo";
import { Spinner, SectionHead } from "@/components/site/ui";

const ROWS = [
  ["Location", (u) => `${u.city}, ${u.state}`],
  ["Type", (u) => u.type],
  ["Established", (u) => u.established_year],
  ["Study Modes", (u) => u.modes?.join(", ")],
  ["NAAC Grade", (u) => u.naac_grade || "—"],
  ["UGC-DEB", (u) => (u.ugc_deb_approved ? "✓ Approved" : "—")],
  ["AICTE", (u) => (u.aicte_approved ? "✓ Approved" : "—")],
  ["WES (Global)", (u) => (u.wes_recognized ? "✓ Recognized" : "—")],
  ["NIRF Rank", (u) => (u.nirf_rank ? `#${u.nirf_rank}` : "Not ranked")],
  ["Rating", (u) => (u.rating ? `★ ${u.rating}` : "—")],
  ["Fee Range", (u) => `${inr(u.fee_min)} – ${inr(u.fee_max)}`],
  ["Programs", (u) => `${u.program_categories?.length}+ categories`],
  ["Specialisations", (u) => `${u.programs?.reduce((a, p) => a + (p.specializations?.length || 0), 0)}+`],
];

export default function CompareUniversities() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState(null);
  const [picker, setPicker] = useState(false);
  const [all, setAll] = useState([]);
  const [q, setQ] = useState("");
  const { openLead } = useLead();

  const slugs = (params.get("slugs") || "").split(",").filter(Boolean);

  useEffect(() => { api.get("/universities?limit=100").then((r) => setAll(r.data)); }, []);
  useEffect(() => {
    if (slugs.length === 0) { setItems([]); return; }
    api.get(`/compare/universities?slugs=${slugs.join(",")}`).then((r) => {
      setItems(r.data);
      if (r.data.length >= 2) track("comparison_complete", { count: r.data.length, type: "university" });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const setSlugs = (arr) => setParams(arr.length ? { slugs: arr.join(",") } : {});
  const add = (slug) => { if (!slugs.includes(slug) && slugs.length < 4) { setSlugs([...slugs, slug]); setPicker(false); setQ(""); } };
  const remove = (slug) => setSlugs(slugs.filter((s) => s !== slug));

  const filtered = all.filter((u) => !slugs.includes(u.slug) && u.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
      <SectionHead eyebrow="Comparison Engine" title="Compare Universities" sub="Add 2 to 4 universities and compare standardized fields side by side." />

      {items === null ? <Spinner /> : items.length === 0 ? (
        <EmptyPicker all={all} onAdd={add} />
      ) : (
        <>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
            <table className="w-full border-collapse min-w-[640px]">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-navy text-white z-20 p-4 text-left text-sm font-semibold min-w-[140px]">University</th>
                  {items.map((u) => (
                    <th key={u.slug} className="p-4 border-l border-slate-100 min-w-[200px] align-top">
                      <div className="flex flex-col items-center gap-2 relative">
                        <button onClick={() => remove(u.slug)} data-testid={`compare-remove-${u.slug}`} className="absolute -top-1 -right-1 text-slate-300 hover:text-red-500"><X className="h-4 w-4" /></button>
                        <UniLogo text={u.logo_text} color={u.logo_color} size={44} />
                        <Link to={`/universities/${u.slug}`} className="font-head font-semibold text-sm text-slate-900 text-center hover:text-navy line-clamp-2">{u.name}</Link>
                      </div>
                    </th>
                  ))}
                  {items.length < 4 && (
                    <th className="p-4 border-l border-slate-100 min-w-[160px]">
                      <button onClick={() => setPicker(true)} data-testid="compare-add-university" className="flex flex-col items-center gap-2 text-navy w-full">
                        <span className="h-11 w-11 rounded-full border-2 border-dashed border-navy/40 flex items-center justify-center"><Plus className="h-5 w-5" /></span>
                        <span className="text-sm font-medium">Add university</span>
                      </button>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, fn], ri) => (
                  <tr key={label} className={ri % 2 ? "bg-slate-50/60" : ""}>
                    <td className="sticky left-0 bg-white z-10 p-4 text-sm font-medium text-slate-500 border-t border-slate-100">{label}</td>
                    {items.map((u) => <td key={u.slug} className="p-4 text-center text-sm text-slate-800 border-l border-t border-slate-100">{fn(u)}</td>)}
                    {items.length < 4 && <td className="border-l border-t border-slate-100" />}
                  </tr>
                ))}
                <tr>
                  <td className="sticky left-0 bg-white z-10 p-4 border-t border-slate-100" />
                  {items.map((u) => (
                    <td key={u.slug} className="p-4 border-l border-t border-slate-100 text-center">
                      <button onClick={() => openLead({ context_type: "university", context_slug: u.slug, cta_label: `Compare - ${u.short_name}`, title: `Get options for ${u.short_name}` })} className="bg-navy text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-navy-dark">Get Options</button>
                    </td>
                  ))}
                  {items.length < 4 && <td className="border-l border-t border-slate-100" />}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-2xl bg-gradient-to-br from-navy to-navy-light text-white p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div><h3 className="font-head font-bold text-xl">Still deciding between these?</h3><p className="text-blue-100 text-sm mt-1">Get free, unbiased guidance tailored to your goals.</p></div>
            <button onClick={() => openLead({ cta_label: "Compare - Guidance", title: "Compare Your Options" })} data-testid="compare-guidance-cta" className="bg-cyan-brand text-navy px-6 py-3 rounded-xl font-semibold hover:bg-white transition-colors shrink-0">Get Free Guidance</button>
          </div>
        </>
      )}

      {picker && <PickerModal filtered={filtered} q={q} setQ={setQ} onAdd={add} onClose={() => setPicker(false)} />}
    </div>
  );
}

function EmptyPicker({ all, onAdd }) {
  return (
    <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8 text-center">
      <GitCompare className="h-12 w-12 text-navy mx-auto" />
      <h3 className="font-head font-bold text-lg text-slate-900 mt-3">Pick universities to compare</h3>
      <p className="text-slate-500 text-sm mt-1">Select at least 2 to see a side-by-side breakdown.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6 text-left">
        {all.slice(0, 9).map((u) => (
          <button key={u.slug} onClick={() => onAdd(u.slug)} data-testid={`compare-pick-${u.slug}`} className="flex items-center gap-3 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-xl p-3 transition-colors">
            <UniLogo text={u.logo_text} color={u.logo_color} size={38} />
            <span className="text-sm font-medium text-slate-700 line-clamp-1">{u.name}</span>
            <Plus className="h-4 w-4 text-navy ml-auto" />
          </button>
        ))}
      </div>
    </div>
  );
}

function PickerModal({ filtered, q, setQ, onAdd, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search universities…" className="flex-1 outline-none text-sm" data-testid="compare-picker-search" />
          <button onClick={onClose}><X className="h-5 w-5 text-slate-400" /></button>
        </div>
        <div className="overflow-y-auto p-2">
          {filtered.map((u) => (
            <button key={u.slug} onClick={() => onAdd(u.slug)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-left">
              <UniLogo text={u.logo_text} color={u.logo_color} size={38} />
              <div className="min-w-0"><p className="text-sm font-medium text-slate-800 line-clamp-1">{u.name}</p><p className="text-xs text-slate-500">{u.city} · NAAC {u.naac_grade}</p></div>
              <Plus className="h-4 w-4 text-navy ml-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
