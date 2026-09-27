import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, Award, Calendar, GitCompare, Bookmark, BookmarkCheck, ArrowRight, CheckCircle2, ShieldCheck, BookOpen, FileText, GraduationCap } from "lucide-react";
import { api, inr } from "@/lib/api";
import { track } from "@/lib/analytics";
import { useShortlist } from "@/context/ShortlistContext";
import { useLead } from "@/context/LeadContext";
import { UniLogo } from "@/components/site/Logo";
import { Spinner, Breadcrumb } from "@/components/site/ui";
import { FaqAccordion } from "@/components/site/FaqAccordion";

export default function UniversityProfile() {
  const { slug } = useParams();
  const [u, setU] = useState(null);
  const { isSaved, toggle } = useShortlist();
  const { openLead } = useLead();

  useEffect(() => {
    setU(null);
    api.get(`/universities/${slug}`).then((r) => { setU(r.data); track("view_university", { slug }); }).catch(() => setU(false));
  }, [slug]);

  if (u === null) return <Spinner />;
  if (u === false) return <div className="text-center py-24 text-slate-500">University not found. <Link to="/universities" className="text-navy font-medium">Browse all</Link></div>;

  const saved = isSaved("universities", u.slug);
  const mini = { slug: u.slug, name: u.name, logo_text: u.logo_text, logo_color: u.logo_color };
  const guidance = () => openLead({ context_type: "university", context_slug: u.slug, cta_label: `Profile - ${u.short_name}`, title: `Get options for ${u.short_name}` });

  const Fact = ({ label, value }) => (
    <div className="bg-white rounded-xl border border-slate-100 p-4">
      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{label}</p>
      <p className="text-slate-800 font-semibold mt-1">{value}</p>
    </div>
  );

  return (
    <div>
      {/* Cover */}
      <div className="relative bg-navy">
        <img src={u.cover_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          <div className="text-blue-200"><Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Universities", to: "/universities" }, { label: u.short_name }]} /></div>
          <div className="flex flex-col md:flex-row md:items-end gap-5 mt-6 text-white">
            <div className="bg-white p-2 rounded-2xl shadow-lg"><UniLogo text={u.logo_text} color={u.logo_color} size={72} /></div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                {u.sponsored && <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">SPONSORED</span>}
                <span className="bg-white/15 text-[11px] font-medium px-2 py-0.5 rounded">{u.type}</span>
              </div>
              <h1 className="font-head text-2xl md:text-4xl font-bold">{u.name}</h1>
              <p className="flex items-center gap-3 text-blue-100 text-sm mt-2 flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{u.city}, {u.state}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Est. {u.established_year}</span>
                {u.rating && <span className="bg-white text-navy px-2 py-0.5 rounded font-semibold">★ {u.rating}</span>}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggle("universities", mini)} data-testid="profile-save-button" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20">
                {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}{saved ? "Saved" : "Shortlist"}
              </button>
              <Link to={`/compare/universities?slugs=${u.slug}`} data-testid="profile-compare-button" className="inline-flex items-center gap-2 bg-cyan-brand text-navy px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white"><GitCompare className="h-4 w-4" /> Compare</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-10">
          {/* Recognition */}
          <section>
            <h2 className="font-head text-xl font-bold text-slate-900 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Recognition & Accreditation</h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {u.recognition?.map((r) => <span key={r} className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1.5 rounded-lg"><CheckCircle2 className="h-4 w-4" />{r}</span>)}
            </div>
            <p className="text-xs text-slate-400 mt-3">Source: <a href={u.source_url} target="_blank" rel="noopener noreferrer" className="text-navy underline">official reference</a> · Last verified {u.last_verified}</p>
          </section>

          {/* Overview */}
          <section>
            <h2 className="font-head text-xl font-bold text-slate-900">Overview</h2>
            <p className="text-slate-600 mt-3 leading-relaxed">{u.overview}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              <Fact label="Study Modes" value={u.modes?.join(", ")} />
              <Fact label="Programs" value={`${u.program_categories?.length}+ categories`} />
              <Fact label="NAAC Grade" value={u.naac_grade || "—"} />
              <Fact label="Fee Range" value={`${inr(u.fee_min)}+`} />
            </div>
          </section>

          {/* Programs */}
          <section>
            <h2 className="font-head text-xl font-bold text-slate-900 flex items-center gap-2"><GraduationCap className="h-5 w-5 text-navy" /> Programs Offered</h2>
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              {u.programs?.map((p) => (
                <div key={p.category} className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-head font-semibold text-slate-800">{p.name}</p>
                    <span className="text-xs bg-blue-50 text-navy px-2 py-0.5 rounded">{p.duration}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Fees: {inr(p.fee_min)} – {inr(p.fee_max)}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">Specialisations: {p.specializations?.join(", ")}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Learning & Exam */}
          <section className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="font-head font-semibold text-slate-900 flex items-center gap-2"><BookOpen className="h-4 w-4 text-navy" /> Learning Format</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{u.learning_info}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="font-head font-semibold text-slate-900 flex items-center gap-2"><FileText className="h-4 w-4 text-navy" /> Examination</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{u.exam_info}</p>
            </div>
          </section>

          <section>
            <h3 className="font-head font-semibold text-slate-900">Academic Process</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed bg-white border border-slate-200 rounded-xl p-5">{u.academic_process}</p>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="font-head text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <FaqAccordion faqs={u.faqs} />
          </section>

          {/* Similar */}
          {u.similar?.length > 0 && (
            <section>
              <h2 className="font-head text-xl font-bold text-slate-900 mb-4">Similar Universities</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {u.similar.map((s) => (
                  <Link key={s.slug} to={`/universities/${s.slug}`} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 hover:border-navy transition-colors">
                    <UniLogo text={s.logo_text} color={s.logo_color} size={40} />
                    <div className="min-w-0"><p className="font-medium text-slate-800 text-sm line-clamp-1">{s.name}</p><p className="text-xs text-slate-500">{s.city} · NAAC {s.naac_grade}</p></div>
                    <ArrowRight className="h-4 w-4 text-slate-300 ml-auto" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky CTA */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          <div className="bg-gradient-to-br from-navy to-navy-light text-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-head font-bold text-lg">Interested in {u.short_name}?</h3>
            <p className="text-blue-100 text-sm mt-1">Get personalized program options, fees and eligibility guidance — free.</p>
            <button onClick={guidance} data-testid="profile-guidance-cta" className="mt-4 w-full bg-cyan-brand text-navy py-3 rounded-xl font-semibold hover:bg-white transition-colors">Get Personalized Options</button>
            <Link to={`/compare/universities?slugs=${u.slug}`} className="mt-2 w-full inline-flex items-center justify-center gap-2 border border-white/20 py-3 rounded-xl font-semibold text-sm hover:bg-white/10"><GitCompare className="h-4 w-4" /> Compare with others</Link>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-sm text-slate-500">
            <p className="font-semibold text-slate-700 mb-1">Verified information</p>
            <p>All factual fields carry an internal source and a last-verified date ({u.last_verified}). ETI EduConnect is not the admitting university.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
