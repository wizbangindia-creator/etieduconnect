import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, GitCompare, ArrowRight, Laptop, Radio, BookOpen, ShieldCheck, TrendingUp, Users, GraduationCap, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { track } from "@/lib/analytics";
import { useLead } from "@/context/LeadContext";
import { UniversityCard } from "@/components/site/UniversityCard";
import { CourseCard } from "@/components/site/CourseCard";
import { SectionHead } from "@/components/site/ui";
import { useSiteConfig } from "@/context/ConfigContext";

const HERO_IMG = "https://images.unsplash.com/photo-1762512346988-045f4d5ad2b3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwzfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwc3R1ZGVudHMlMjBzdHVkeSUyMGxpYnJhcnl8ZW58MHx8fHwxNzkwNDk0MzIzfDA&ixlib=rb-4.1.0&q=85";
const POPULAR = [["MBA", "online-mba"], ["MCA", "online-mca"], ["BCA", "online-bca"], ["BBA", "online-bba"], ["B.Com", "online-bcom"], ["MA", "online-ma"]];

export default function Home() {
  const [unis, setUnis] = useState([]);
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const { openLead } = useLead();
  const config = useSiteConfig();

  useEffect(() => {
    api.get("/universities?featured=true&limit=6").then((r) => setUnis(r.data)).catch(() => {});
    api.get("/courses?limit=6").then((r) => setCourses(r.data)).catch(() => {});
  }, []);

  const search = (e) => { e.preventDefault(); nav(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/universities"); };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 eti-grid-bg opacity-40" />
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.14]" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-navy-light/40 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-3xl eti-fade-up">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-xs font-medium text-cyan-brand">
              <Sparkles className="h-3.5 w-3.5" /> Your Education & Career Platform
            </span>
            <h1 className="font-head text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-5 leading-[1.05]">
              Know What's <span className="text-cyan-brand">Next.</span>
            </h1>
            <p className="mt-5 text-lg text-blue-100 max-w-xl leading-relaxed">
              Explore education options, compare universities and understand your choices — before you decide. Trusted, unbiased and built for clarity.
            </p>

            <form onSubmit={search} className="mt-8 bg-white p-2.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 max-w-2xl">
              <div className="flex items-center flex-1 px-3">
                <Search className="h-5 w-5 text-slate-400" />
                <input data-testid="hero-search-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search universities, courses, MBA, MCA…" className="w-full outline-none text-slate-800 px-3 py-3 text-sm" />
              </div>
              <button data-testid="hero-search-button" className="bg-navy hover:bg-navy-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">Search</button>
            </form>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/compare/universities" data-testid="hero-compare-cta" onClick={() => track("comparison_start", { from: "hero" })} className="inline-flex items-center gap-2 bg-cyan-brand text-navy px-5 py-3 rounded-xl font-semibold text-sm hover:bg-white transition-colors"><GitCompare className="h-4 w-4" /> Compare Universities</Link>
              <Link to="/courses" data-testid="hero-explore-cta" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors">Explore Courses <ArrowRight className="h-4 w-4" /></Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-200">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-cyan-brand" /> UGC-DEB verified info</span>
              <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-cyan-brand" /> 20+ universities</span>
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-cyan-brand" /> Free guidance</span>
            </div>
          </div>
        </div>
      </section>

      {/* STUDY MODE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <SectionHead eyebrow="Explore by study mode" title="How would you like to study?" sub="Understand the difference before you commit. Both online and distance can be equally valid when UGC-DEB approved." />
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {[
            { icon: Laptop, t: "Online Education", d: "Live + recorded classes, digital exams and maximum flexibility.", to: "/universities?mode=Online", color: "from-blue-500 to-navy" },
            { icon: Radio, t: "Distance Education", d: "Affordable, self-paced study with centre-based examinations.", to: "/universities?mode=Distance", color: "from-emerald-500 to-teal-700" },
            { icon: GitCompare, t: "Online vs Distance", d: "A clear side-by-side breakdown to help you choose confidently.", to: "/online-vs-distance", color: "from-navy-light to-navy" },
          ].map((c) => (
            <Link key={c.t} to={c.to} data-testid={`studymode-${c.t.split(" ")[0].toLowerCase()}`} className="group relative bg-white rounded-2xl border border-slate-200/80 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white mb-4`}><c.icon className="h-6 w-6" /></div>
              <h3 className="font-head font-semibold text-lg text-slate-900">{c.t}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{c.d}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-navy font-semibold text-sm">Explore <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR PROGRAMS */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <SectionHead eyebrow="Popular programs" title="Programs students explore most" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-10">
            {POPULAR.map(([label, slug]) => (
              <Link key={slug} to={`/courses/${slug}`} data-testid={`popular-${slug}`} className="group bg-slate-50 hover:bg-navy rounded-xl p-5 text-center transition-colors border border-slate-100">
                <span className="font-head font-bold text-xl text-navy group-hover:text-white">{label}</span>
                <p className="text-[11px] text-slate-500 group-hover:text-blue-200 mt-1">Explore →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED UNIVERSITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <SectionHead eyebrow="Featured universities" title="Top online & distance universities" />
          <Link to="/universities" className="text-navy font-semibold text-sm inline-flex items-center gap-1 shrink-0">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {unis.map((u, i) => <UniversityCard key={u.slug} u={u} index={i} />)}
        </div>
      </section>

      {/* COMPARISON FEATURE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="relative rounded-3xl bg-navy text-white p-8 md:p-14 overflow-hidden">
          <div className="absolute inset-0 eti-grid-bg opacity-40" />
          <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-cyan-brand/20 blur-3xl" />
          <div className="relative max-w-xl">
            <TrendingUp className="h-10 w-10 text-cyan-brand" />
            <h2 className="font-head text-2xl md:text-4xl font-bold mt-4">Compare up to 4 universities, side by side.</h2>
            <p className="text-blue-100 mt-3 leading-relaxed">Fees, accreditations, specialisations, exam mode and delivery — standardized so you can make a genuinely informed decision.</p>
            <Link to="/compare/universities" onClick={() => track("comparison_start", { from: "banner" })} className="mt-6 inline-flex items-center gap-2 bg-cyan-brand text-navy px-6 py-3 rounded-xl font-semibold hover:bg-white transition-colors">Start Comparing <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* POPULAR COURSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <SectionHead eyebrow="Programs" title="Explore courses & programs" />
          <Link to="/courses" className="text-navy font-semibold text-sm inline-flex items-center gap-1 shrink-0">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {courses.slice(0, 6).map((c) => <CourseCard key={c.slug} c={c} />)}
        </div>
      </section>

      {/* GUIDANCE CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 p-8 md:p-14 text-center">
          <BookOpen className="h-10 w-10 text-navy mx-auto" />
          <h2 className="font-head text-2xl md:text-3xl font-bold text-slate-900 mt-4">Not sure where to start?</h2>
          <p className="text-slate-600 mt-3 max-w-xl mx-auto">Tell us your goal and background. We'll help you shortlist the right programs — free, unbiased and no obligation.</p>
          <button onClick={() => openLead({ cta_label: "Home - Guidance CTA", title: "Get Free Guidance" })} data-testid="home-guidance-cta" className="mt-6 bg-navy hover:bg-navy-dark text-white px-8 py-3.5 rounded-xl font-semibold transition-colors">Talk to an Education Advisor</button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <p className="text-xs text-slate-400 bg-white border border-slate-100 rounded-xl p-4 leading-relaxed text-center">{config.disclosure_text}</p>
      </section>
    </div>
  );
}
