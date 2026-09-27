import { Link } from "react-router-dom";
import { MapPin, Award, GitCompare, Bookmark, BookmarkCheck, ArrowRight } from "lucide-react";
import { UniLogo } from "./Logo";
import { useShortlist } from "@/context/ShortlistContext";
import { useLead } from "@/context/LeadContext";
import { inr } from "@/lib/api";

export function UniversityCard({ u, compareMode, checked, onCheck, index }) {
  const { isSaved, toggle } = useShortlist();
  const { openLead } = useLead();
  const saved = isSaved("universities", u.slug);
  const mini = { slug: u.slug, name: u.name, logo_text: u.logo_text, logo_color: u.logo_color };

  return (
    <div data-testid={`university-card-${index ?? u.slug}`} className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden">
      {u.sponsored && <span className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-bl-lg">SPONSORED</span>}
      <div className="flex items-start gap-3">
        <UniLogo text={u.logo_text} color={u.logo_color} />
        <div className="min-w-0 flex-1">
          <Link to={`/universities/${u.slug}`} className="font-head font-semibold text-slate-900 leading-snug hover:text-navy line-clamp-2">{u.name}</Link>
          <p className="flex items-center gap-1 text-xs text-slate-500 mt-1"><MapPin className="h-3 w-3" /> {u.city}, {u.state} · Est. {u.established_year}</p>
        </div>
        <button onClick={() => toggle("universities", mini)} data-testid={`university-save-${u.slug}`} className="text-navy shrink-0" aria-label="Save">
          {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5 text-slate-300 hover:text-navy" />}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {u.naac_grade && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700"><Award className="h-3 w-3" />NAAC {u.naac_grade}</span>}
        {u.ugc_deb_approved && <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-navy">UGC-DEB</span>}
        {u.modes?.map((m) => <span key={m} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">{m}</span>)}
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        {u.program_categories?.slice(0, 5).map((c) => <span key={c} className="text-[11px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">{c}</span>)}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-end justify-between">
        <div>
          <p className="text-[11px] text-slate-400">Indicative Fees</p>
          <p className="font-head font-bold text-navy">{inr(u.fee_min)} <span className="text-slate-400 font-normal text-xs">– {inr(u.fee_max)}</span></p>
        </div>
        {u.rating && <span className="text-xs font-semibold bg-navy text-white px-2 py-1 rounded-lg">★ {u.rating}</span>}
      </div>

      <div className="mt-4 flex items-center gap-2">
        {compareMode ? (
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer flex-1 justify-center border border-navy/20 rounded-xl py-2.5 bg-blue-50/50">
            <input type="checkbox" checked={checked} onChange={onCheck} data-testid={`university-compare-checkbox-${u.slug}`} className="h-4 w-4 rounded text-navy" />
            {checked ? "Added to compare" : "Add to compare"}
          </label>
        ) : (
          <>
            <Link to={`/universities/${u.slug}`} data-testid={`university-view-${u.slug}`} className="flex-1 text-center text-sm font-semibold text-navy border border-navy/20 rounded-xl py-2.5 hover:bg-blue-50 transition-colors">View Details</Link>
            <button onClick={() => openLead({ context_type: "university", context_slug: u.slug, cta_label: `Card - ${u.short_name}`, title: `Get options for ${u.short_name}` })}
              data-testid={`university-guidance-${u.slug}`} className="flex-1 text-center text-sm font-semibold text-white bg-navy rounded-xl py-2.5 hover:bg-navy-dark transition-colors inline-flex items-center justify-center gap-1">Get Options <ArrowRight className="h-3.5 w-3.5" /></button>
          </>
        )}
      </div>
    </div>
  );
}
