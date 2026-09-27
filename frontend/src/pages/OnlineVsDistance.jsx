import { Link } from "react-router-dom";
import { Laptop, Radio, Check, ArrowRight, Wifi, MapPin, Clock, FileCheck, Users } from "lucide-react";
import { useLead } from "@/context/LeadContext";
import { SectionHead, Disclosure } from "@/components/site/ui";
import { useSiteConfig } from "@/context/ConfigContext";

const IMG = "https://images.unsplash.com/photo-1601097874965-f940d4f012b5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHw0fHxvbmxpbmUlMjBzdHVkZW50JTIwbGFwdG9wJTIwZWR1Y2F0aW9uJTIwbGVhcm5pbmd8ZW58MHx8fHwxNzkwNDk0MzI5fDA&ixlib=rb-4.1.0&q=85";

const FACTORS = [
  { icon: Wifi, label: "Delivery", online: "Live + recorded classes via LMS", distance: "Printed / PDF self-learning material" },
  { icon: Users, label: "Interaction", online: "High — faculty & peer engagement", distance: "Low — largely independent study" },
  { icon: Clock, label: "Flexibility", online: "Very high — revisit content anytime", distance: "High — fully self-paced" },
  { icon: FileCheck, label: "Assessment", online: "Remote proctored online exams", distance: "Designated exam centres" },
  { icon: MapPin, label: "Attendance", online: "No physical presence needed", distance: "Occasional centre visits possible" },
];

export default function OnlineVsDistance() {
  const { openLead } = useLead();
  const config = useSiteConfig();
  return (
    <div>
      <section className="relative bg-navy text-white overflow-hidden">
        <img src={IMG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-brand">Compare</p>
          <h1 className="font-head text-3xl md:text-5xl font-bold mt-2 max-w-2xl">Online vs Distance Education</h1>
          <p className="text-blue-100 mt-4 max-w-2xl text-lg">Both can be UGC-DEB approved and equally valid. The right choice depends on how you learn best and the support you need.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/40 p-7">
            <div className="h-12 w-12 rounded-xl bg-navy text-white flex items-center justify-center mb-3"><Laptop className="h-6 w-6" /></div>
            <h2 className="font-head text-2xl font-bold text-slate-900">Online Education</h2>
            <p className="text-slate-600 mt-2">Fully internet-based with structured live and recorded classes, digital assessments and strong support.</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">{["Best for working professionals", "Maximum interaction & mentorship", "Digital, remote-proctored exams", "Higher engagement, slightly higher fees"].map((t) => <li key={t} className="flex gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />{t}</li>)}</ul>
            <Link to="/universities?mode=Online" className="mt-5 inline-flex items-center gap-1 text-navy font-semibold text-sm">See online universities <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 p-7">
            <div className="h-12 w-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-3"><Radio className="h-6 w-6" /></div>
            <h2 className="font-head text-2xl font-bold text-slate-900">Distance Education</h2>
            <p className="text-slate-600 mt-2">Traditional self-study route with printed/PDF material and centre-based examinations — the most affordable pathway.</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">{["Best for highly self-driven learners", "Lowest-cost recognised option", "Centre-based examinations", "Great alongside CA/CS/CMA prep"].map((t) => <li key={t} className="flex gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />{t}</li>)}</ul>
            <Link to="/universities?mode=Distance" className="mt-5 inline-flex items-center gap-1 text-emerald-700 font-semibold text-sm">See distance universities <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>

        <div className="mt-12">
          <SectionHead title="Side-by-side comparison" center />
          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
            <table className="w-full border-collapse min-w-[560px]">
              <thead><tr className="bg-slate-900 text-white">
                <th className="p-4 text-left text-sm font-semibold">Factor</th>
                <th className="p-4 text-center text-sm font-semibold">Online</th>
                <th className="p-4 text-center text-sm font-semibold">Distance</th>
              </tr></thead>
              <tbody>
                {FACTORS.map((f, i) => (
                  <tr key={f.label} className={i % 2 ? "bg-slate-50/60" : ""}>
                    <td className="p-4 text-sm font-medium text-slate-700 flex items-center gap-2"><f.icon className="h-4 w-4 text-navy" />{f.label}</td>
                    <td className="p-4 text-center text-sm text-slate-700 border-l border-slate-100">{f.online}</td>
                    <td className="p-4 text-center text-sm text-slate-700 border-l border-slate-100">{f.distance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">Delivery and exam modes vary by university and program. Always verify current UGC-DEB status and format before enrolling.</p>
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-to-br from-navy to-navy-light text-white p-8 md:p-12 text-center">
          <h2 className="font-head text-2xl md:text-3xl font-bold">Still unsure which mode suits you?</h2>
          <p className="text-blue-100 mt-2 max-w-xl mx-auto">Tell us your situation and we'll recommend the right mode and universities — free.</p>
          <button onClick={() => openLead({ cta_label: "OnlineVsDistance - Guidance", title: "Compare Your Options" })} data-testid="ovd-guidance-cta" className="mt-6 bg-cyan-brand text-navy px-8 py-3.5 rounded-xl font-semibold hover:bg-white transition-colors">Get Personalized Guidance</button>
        </div>
        <div className="mt-8"><Disclosure text={config.disclosure_text} /></div>
      </div>
    </div>
  );
}
