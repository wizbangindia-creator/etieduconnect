import { Link } from "react-router-dom";
import { X, Bookmark, GitCompare, ArrowRight } from "lucide-react";
import { useShortlist } from "@/context/ShortlistContext";
import { UniLogo } from "./Logo";

export function ShortlistDrawer() {
  const { items, drawerOpen, setDrawerOpen, remove } = useShortlist();
  if (!drawerOpen) return null;
  const uSlugs = items.universities.map((i) => i.slug).join(",");
  const cSlugs = items.courses.map((i) => i.slug).join(",");

  return (
    <div className="fixed inset-0 z-[60] bg-black/40" onClick={() => setDrawerOpen(false)}>
      <div data-testid="shortlist-drawer" className="absolute right-0 top-0 h-full w-96 max-w-[90%] bg-white shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-head font-bold text-lg text-slate-900 flex items-center gap-2"><Bookmark className="h-5 w-5 text-navy" /> Your Shortlist</h3>
          <button onClick={() => setDrawerOpen(false)} data-testid="shortlist-close"><X className="h-5 w-5 text-slate-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {items.universities.length === 0 && items.courses.length === 0 && (
            <div className="text-center text-slate-400 py-16">
              <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Nothing saved yet. Tap the bookmark on any university or course to save it here.</p>
            </div>
          )}
          {items.universities.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Universities ({items.universities.length})</p>
              <div className="space-y-2">
                {items.universities.map((u) => (
                  <div key={u.slug} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100">
                    <UniLogo text={u.logo_text} color={u.logo_color} size={36} />
                    <Link to={`/universities/${u.slug}`} onClick={() => setDrawerOpen(false)} className="text-sm font-medium text-slate-700 flex-1 line-clamp-1 hover:text-navy">{u.name}</Link>
                    <button onClick={() => remove("universities", u.slug)} className="text-slate-300 hover:text-red-500"><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {items.courses.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Courses ({items.courses.length})</p>
              <div className="space-y-2">
                {items.courses.map((c) => (
                  <div key={c.slug} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 text-navy flex items-center justify-center font-head font-bold text-xs">{c.name?.slice(0,2)}</div>
                    <Link to={`/courses/${c.slug}`} onClick={() => setDrawerOpen(false)} className="text-sm font-medium text-slate-700 flex-1 line-clamp-1 hover:text-navy">{c.name}</Link>
                    <button onClick={() => remove("courses", c.slug)} className="text-slate-300 hover:text-red-500"><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {(items.universities.length > 0 || items.courses.length > 0) && (
          <div className="p-5 border-t border-slate-100 space-y-2">
            {items.universities.length >= 2 && (
              <Link to={`/compare/universities?slugs=${uSlugs}`} onClick={() => setDrawerOpen(false)} data-testid="shortlist-compare-universities"
                className="flex items-center justify-center gap-2 bg-navy text-white py-3 rounded-xl font-semibold text-sm"><GitCompare className="h-4 w-4" /> Compare Universities</Link>
            )}
            {items.courses.length >= 2 && (
              <Link to={`/compare/courses?slugs=${cSlugs}`} onClick={() => setDrawerOpen(false)} data-testid="shortlist-compare-courses"
                className="flex items-center justify-center gap-2 bg-slate-100 text-navy py-3 rounded-xl font-semibold text-sm"><GitCompare className="h-4 w-4" /> Compare Courses</Link>
            )}
            <Link to="/get-guidance" onClick={() => setDrawerOpen(false)} className="flex items-center justify-center gap-1 text-navy text-sm font-medium py-1">Get guidance on these <ArrowRight className="h-4 w-4" /></Link>
          </div>
        )}
      </div>
    </div>
  );
}
