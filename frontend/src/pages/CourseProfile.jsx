import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Clock, GraduationCap, Bookmark, BookmarkCheck, GitCompare, CheckCircle2, Briefcase, Layers, Users, ArrowRight } from "lucide-react";
import { api, inr } from "@/lib/api";
import { track } from "@/lib/analytics";
import { useShortlist } from "@/context/ShortlistContext";
import { useLead } from "@/context/LeadContext";
import { UniLogo } from "@/components/site/Logo";
import { Spinner, Breadcrumb } from "@/components/site/ui";
import { FaqAccordion } from "@/components/site/FaqAccordion";

export default function CourseProfile() {
  const { slug } = useParams();
  const [c, setC] = useState(null);
  const { isSaved, toggle } = useShortlist();
  const { openLead } = useLead();

  useEffect(() => {
    setC(null);
    api.get(`/courses/${slug}`).then((r) => { setC(r.data); track("view_course", { slug }); }).catch(() => setC(false));
  }, [slug]);

  if (c === null) return <Spinner />;
  if (c === false) return <div className="text-center py-24 text-slate-500">Course not found. <Link to="/courses" className="text-navy font-medium">Browse all</Link></div>;

  const saved = isSaved("courses", c.slug);
  const guidance = () => openLead({ context_type: "course", context_slug: c.slug, program: c.category, cta_label: `Course - ${c.name}`, title: `Get options for ${c.name}` });

  const Block = ({ icon: Icon, title, children }) => (
    <section><h2 className="font-head text-xl font-bold text-slate-900 flex items-center gap-2"><Icon className="h-5 w-5 text-navy" /> {title}</h2><div className="mt-3">{children}</div></section>
  );

  return (
    <div>
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-blue-200"><Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Courses", to: "/courses" }, { label: c.name }]} /></div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-5">
            <div className="h-16 w-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-head font-bold text-xl">{c.category}</div>
            <div className="flex-1">
              <h1 className="font-head text-2xl md:text-4xl font-bold">{c.name}</h1>
              <div className="flex flex-wrap gap-2 mt-3 text-sm">
                <span className="bg-white/15 px-3 py-1 rounded-full">{c.level}</span>
                <span className="bg-white/15 px-3 py-1 rounded-full">{c.degree_type}</span>
                <span className="bg-white/15 px-3 py-1 rounded-full flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{c.duration}</span>
                {c.modes?.map((m) => <span key={m} className="bg-cyan-brand/20 text-cyan-brand px-3 py-1 rounded-full">{m}</span>)}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggle("courses", { slug: c.slug, name: c.name })} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20">{saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}{saved ? "Saved" : "Save"}</button>
              <Link to={`/compare/courses?slugs=${c.slug}`} className="inline-flex items-center gap-2 bg-cyan-brand text-navy px-4 py-2.5 rounded-xl text-sm font-semibold"><GitCompare className="h-4 w-4" /> Compare</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-10">
          <Block icon={GraduationCap} title="What it is"><p className="text-slate-600 leading-relaxed">{c.what_it_is}</p></Block>
          <Block icon={Users} title="Who it may suit"><p className="text-slate-600 leading-relaxed">{c.who_suits}</p></Block>
          <Block icon={CheckCircle2} title="Eligibility"><p className="text-slate-600 leading-relaxed bg-white border border-slate-200 rounded-xl p-4">{c.eligibility}</p></Block>
          <Block icon={Layers} title="Specializations">
            <div className="flex flex-wrap gap-2">{c.specializations?.map((s) => <span key={s} className="bg-blue-50 text-navy text-sm font-medium px-3 py-1.5 rounded-lg">{s}</span>)}</div>
          </Block>
          <Block icon={Briefcase} title="Curriculum highlights">
            <div className="grid sm:grid-cols-2 gap-2">{c.curriculum?.map((s) => <div key={s} className="flex items-center gap-2 bg-white border border-slate-100 rounded-lg p-3 text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />{s}</div>)}</div>
          </Block>
          <Block icon={Briefcase} title="Career possibilities">
            <div className="flex flex-wrap gap-2">{c.careers?.map((s) => <span key={s} className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-lg">{s}</span>)}</div>
            <p className="text-xs text-slate-400 mt-2">Career outcomes depend on individual effort and market conditions. We do not guarantee placement or salary.</p>
          </Block>
          <Block icon={GitCompare} title="Online vs Distance for this program"><p className="text-slate-600 leading-relaxed bg-amber-50 border border-amber-100 rounded-xl p-4">{c.online_vs_distance}</p></Block>

          <Block icon={GraduationCap} title={`Universities offering ${c.name}`}>
            <div className="grid sm:grid-cols-2 gap-3">
              {c.universities?.map((u) => (
                <Link key={u.slug} to={`/universities/${u.slug}`} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 hover:border-navy transition-colors">
                  <UniLogo text={u.logo_text} color={u.logo_color} size={40} />
                  <div className="min-w-0 flex-1"><p className="font-medium text-slate-800 text-sm line-clamp-1">{u.name}</p><p className="text-xs text-slate-500">NAAC {u.naac_grade} · {inr(u.fee_min)}+</p></div>
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                </Link>
              ))}
            </div>
          </Block>

          <section><h2 className="font-head text-xl font-bold text-slate-900 mb-4">FAQs</h2><FaqAccordion faqs={c.faqs} /></section>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Indicative Fees</p>
            <p className="font-head font-bold text-2xl text-navy mt-1">{inr(c.fee_min)} – {inr(c.fee_max)}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between"><span>Duration</span><span className="font-medium text-slate-800">{c.duration}</span></div>
              <div className="flex justify-between"><span>Level</span><span className="font-medium text-slate-800">{c.level}</span></div>
              <div className="flex justify-between"><span>Universities</span><span className="font-medium text-slate-800">{c.universities?.length}</span></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-navy to-navy-light text-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-head font-bold text-lg">Find your best-fit {c.category}</h3>
            <p className="text-blue-100 text-sm mt-1">We'll match you to the right universities based on your goals.</p>
            <button onClick={guidance} data-testid="course-guidance-cta" className="mt-4 w-full bg-cyan-brand text-navy py-3 rounded-xl font-semibold hover:bg-white transition-colors">Find Suitable Programs</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
