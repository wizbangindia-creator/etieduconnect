import { Link } from "react-router-dom";
import { Clock, GraduationCap, Bookmark, BookmarkCheck, ArrowRight, Layers } from "lucide-react";
import { useShortlist } from "@/context/ShortlistContext";
import { useLead } from "@/context/LeadContext";
import { inr } from "@/lib/api";

export function CourseCard({ c, compareMode, checked, onCheck }) {
  const { isSaved, toggle } = useShortlist();
  const { openLead } = useLead();
  const saved = isSaved("courses", c.slug);
  const mini = { slug: c.slug, name: c.name };

  return (
    <div data-testid={`course-card-${c.slug}`} className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-navy to-navy-light text-white flex items-center justify-center font-head font-bold">{c.category}</div>
        <button onClick={() => toggle("courses", mini)} data-testid={`course-save-${c.slug}`} aria-label="Save">
          {saved ? <BookmarkCheck className="h-5 w-5 text-navy" /> : <Bookmark className="h-5 w-5 text-slate-300 hover:text-navy" />}
        </button>
      </div>
      <Link to={`/courses/${c.slug}`} className="font-head font-semibold text-slate-900 text-lg mt-3 hover:text-navy">{c.name}</Link>
      <div className="flex flex-wrap gap-1.5 mt-2">
        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-navy">{c.level}</span>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">{c.degree_type}</span>
        {c.modes?.map((m) => <span key={m} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700">{m}</span>)}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
        <div className="flex items-center gap-1.5 text-slate-600"><Clock className="h-4 w-4 text-slate-400" />{c.duration}</div>
        <div className="flex items-center gap-1.5 text-slate-600"><Layers className="h-4 w-4 text-slate-400" />{c.specializations?.length || 0} specialisations</div>
        <div className="flex items-center gap-1.5 text-slate-600 col-span-2"><GraduationCap className="h-4 w-4 text-slate-400" />{c.universities?.length || 0} universities offer this</div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-[11px] text-slate-400">Indicative Fees</p>
        <p className="font-head font-bold text-navy">{inr(c.fee_min)} <span className="text-slate-400 font-normal text-xs">– {inr(c.fee_max)}</span></p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {compareMode ? (
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer flex-1 justify-center border border-navy/20 rounded-xl py-2.5 bg-blue-50/50">
            <input type="checkbox" checked={checked} onChange={onCheck} data-testid={`course-compare-checkbox-${c.slug}`} className="h-4 w-4 rounded text-navy" />
            {checked ? "Added" : "Add to compare"}
          </label>
        ) : (
          <>
            <Link to={`/courses/${c.slug}`} className="flex-1 text-center text-sm font-semibold text-navy border border-navy/20 rounded-xl py-2.5 hover:bg-blue-50">View</Link>
            <button onClick={() => openLead({ context_type: "course", context_slug: c.slug, program: c.category, cta_label: `Course - ${c.name}`, title: `Get options for ${c.name}` })}
              className="flex-1 text-center text-sm font-semibold text-white bg-navy rounded-xl py-2.5 hover:bg-navy-dark inline-flex items-center justify-center gap-1">Get Options <ArrowRight className="h-3.5 w-3.5" /></button>
          </>
        )}
      </div>
    </div>
  );
}
