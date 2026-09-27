import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Search, Bookmark, ChevronRight } from "lucide-react";
import { Logo } from "./Logo";
import { useShortlist } from "@/context/ShortlistContext";
import { useLead } from "@/context/LeadContext";

const NAV = [
  { label: "Universities", to: "/universities" },
  { label: "Courses", to: "/courses" },
  { label: "Compare", to: "/compare/universities" },
  { label: "AI Advisor", to: "/advisor" },
  { label: "Online vs Distance", to: "/online-vs-distance" },
  { label: "Guides", to: "/guides" },
];

export function Header() {
  const [mobile, setMobile] = useState(false);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const loc = useLocation();
  const { count, setDrawerOpen } = useShortlist();
  const { openLead } = useLead();

  const submitSearch = (e) => {
    e.preventDefault();
    if (q.trim()) { nav(`/search?q=${encodeURIComponent(q.trim())}`); setMobile(false); }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center gap-4">
        <Logo />
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {NAV.map((n) => {
            const active = loc.pathname.startsWith(n.to) && n.to !== "/";
            return (
              <Link key={n.to} to={n.to} data-testid={`nav-${n.label.toLowerCase().replace(/[^a-z]/g, "-")}`}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "text-navy bg-blue-50" : "text-slate-600 hover:text-navy hover:bg-slate-50"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={submitSearch} className="hidden md:flex items-center bg-slate-100 rounded-xl px-3 py-2 w-52 focus-within:ring-2 focus-within:ring-blue-200">
            <Search className="h-4 w-4 text-slate-400" />
            <input data-testid="header-search-input" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search…" className="bg-transparent outline-none text-sm ml-2 w-full" />
          </form>
          <button data-testid="header-shortlist-button" onClick={() => setDrawerOpen(true)}
            className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors" aria-label="Shortlist">
            <Bookmark className="h-5 w-5 text-navy" />
            {count > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-cyan-brand text-navy text-[11px] font-bold flex items-center justify-center">{count}</span>}
          </button>
          <button data-testid="header-guidance-button" onClick={() => openLead({ cta_label: "Header - Get Guidance", context_type: "general" })}
            className="hidden sm:inline-flex bg-navy hover:bg-navy-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5">
            Get Guidance
          </button>
          <button className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100" onClick={() => setMobile(true)} data-testid="mobile-menu-button" aria-label="Menu">
            <Menu className="h-6 w-6 text-navy" />
          </button>
        </div>
      </div>

      {mobile && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setMobile(false)}>
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-white p-6 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <Logo />
              <button onClick={() => setMobile(false)} data-testid="mobile-menu-close" aria-label="Close"><X className="h-6 w-6 text-slate-500" /></button>
            </div>
            <form onSubmit={submitSearch} className="flex items-center bg-slate-100 rounded-xl px-3 py-2.5 mb-4">
              <Search className="h-4 w-4 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search universities, courses…" className="bg-transparent outline-none text-sm ml-2 w-full" />
            </form>
            <nav className="flex flex-col">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setMobile(false)}
                  className="flex items-center justify-between py-3 border-b border-slate-100 text-slate-700 font-medium">
                  {n.label} <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
              <Link to="/get-guidance" onClick={() => setMobile(false)} className="flex items-center justify-between py-3 border-b border-slate-100 text-slate-700 font-medium">
                Get Guidance <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </nav>
            <button onClick={() => { setMobile(false); openLead({ cta_label: "Mobile - Get Guidance" }); }}
              className="mt-6 bg-navy text-white py-3 rounded-xl font-semibold">Talk to an Advisor</button>
          </div>
        </div>
      )}
    </header>
  );
}
