import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { useSiteConfig } from "@/context/ConfigContext";
import { ShieldCheck, Mail, Phone } from "lucide-react";

export function Footer() {
  const config = useSiteConfig();
  const year = new Date().getFullYear();
  const cols = [
    { title: "Explore", links: [["Universities", "/universities"], ["Courses", "/courses"], ["Online Education", "/online-vs-distance"], ["Search", "/search"]] },
    { title: "Compare", links: [["Compare Universities", "/compare/universities"], ["Compare Courses", "/compare/courses"], ["Online vs Distance", "/online-vs-distance"]] },
    { title: "Resources", links: [["Knowledge Hub", "/guides"], ["Get Guidance", "/get-guidance"], ["Online MBA", "/lp/online-mba-comparison"], ["Online Universities", "/lp/online-universities"]] },
  ];
  return (
    <footer className="bg-navy-dark text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Logo variant="light" />
            <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-xs">
              Know What's Next. Explore education options, compare universities and understand your choices before you decide.
            </p>
            <div className="mt-4 space-y-1.5 text-sm">
              <a href={`mailto:${config.contact_email || ""}`} className="flex items-center gap-2 hover:text-white"><Mail className="h-4 w-4" />{config.contact_email}</a>
              <a href={`tel:${config.contact_phone || ""}`} className="flex items-center gap-2 hover:text-white"><Phone className="h-4 w-4" />{config.contact_phone}</a>
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-white font-head font-semibold text-sm mb-4">{c.title}</h4>
              <ul className="space-y-2.5 text-sm">
                {c.links.map(([l, to]) => <li key={to}><Link to={to} className="text-slate-400 hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
          <ShieldCheck className="h-5 w-5 text-cyan-brand shrink-0 mt-0.5" />
          <p>{config.disclosure_text}</p>
        </div>
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {year} {config.company_name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/guides" className="hover:text-white">Privacy Policy</Link>
            <Link to="/guides" className="hover:text-white">Terms</Link>
            <Link to="/get-guidance" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
