import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { api, inr } from "@/lib/api";
import { track } from "@/lib/analytics";
import { UniLogo } from "@/components/site/Logo";
import { Spinner } from "@/components/site/ui";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [input, setInput] = useState(q);
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (!q) { setRes({ universities: [], courses: [], guides: [] }); return; }
    setRes(null);
    api.get(`/search?q=${encodeURIComponent(q)}`).then((r) => setRes(r.data));
    track("search", { q });
  }, [q]);

  const submit = (e) => { e.preventDefault(); setParams(input.trim() ? { q: input.trim() } : {}); };
  const total = res ? res.universities.length + res.courses.length + res.guides.length : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center px-4 py-1">
        <SearchIcon className="h-5 w-5 text-slate-400" />
        <input data-testid="search-page-input" value={input} onChange={(e) => setInput(e.target.value)} autoFocus placeholder="Search universities, courses, guides…" className="flex-1 outline-none px-3 py-3.5 text-slate-800" />
        <button className="bg-navy text-white px-5 py-2.5 rounded-xl font-semibold text-sm">Search</button>
      </form>

      {q && <p className="text-sm text-slate-500 mt-6">{res ? `${total} results for "${q}"` : "Searching…"}</p>}
      {!res ? (q ? <Spinner /> : null) : (
        <div className="mt-6 space-y-10">
          {total === 0 && q && <p className="text-center text-slate-400 py-16">No results. Try a different keyword like "MBA", "online", or a university name.</p>}
          {res.universities.length > 0 && (
            <section>
              <h2 className="font-head text-lg font-bold text-slate-900 mb-3">Universities</h2>
              <div className="grid sm:grid-cols-2 gap-3">{res.universities.map((u) => (
                <Link key={u.slug} to={`/universities/${u.slug}`} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 hover:border-navy">
                  <UniLogo text={u.logo_text} color={u.logo_color} size={40} />
                  <div className="min-w-0"><p className="font-medium text-slate-800 text-sm line-clamp-1">{u.name}</p><p className="text-xs text-slate-500">{u.city} · NAAC {u.naac_grade} · {inr(u.fee_min)}+</p></div>
                </Link>))}</div>
            </section>
          )}
          {res.courses.length > 0 && (
            <section>
              <h2 className="font-head text-lg font-bold text-slate-900 mb-3">Courses</h2>
              <div className="grid sm:grid-cols-2 gap-3">{res.courses.map((c) => (
                <Link key={c.slug} to={`/courses/${c.slug}`} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 hover:border-navy">
                  <span className="h-10 w-10 rounded-lg bg-navy text-white flex items-center justify-center font-head font-bold text-xs">{c.category}</span>
                  <div className="min-w-0"><p className="font-medium text-slate-800 text-sm line-clamp-1">{c.name}</p><p className="text-xs text-slate-500">{c.level} · {c.duration}</p></div>
                </Link>))}</div>
            </section>
          )}
          {res.guides.length > 0 && (
            <section>
              <h2 className="font-head text-lg font-bold text-slate-900 mb-3">Guides</h2>
              <div className="space-y-2">{res.guides.map((g) => (
                <Link key={g.slug} to={`/guides/${g.slug}`} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 hover:border-navy">
                  <img src={g.cover_url} alt="" className="h-11 w-16 object-cover rounded-lg" />
                  <div className="min-w-0"><p className="font-medium text-slate-800 text-sm line-clamp-1">{g.title}</p><p className="text-xs text-slate-500">{g.category}</p></div>
                </Link>))}</div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
