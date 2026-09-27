import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
      <Loader2 className="h-8 w-8 animate-spin text-navy" />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  );
}

export function Breadcrumb({ items }) {
  return (
    <nav className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {it.to ? <Link to={it.to} className="hover:text-navy">{it.label}</Link> : <span className="text-slate-700 font-medium">{it.label}</span>}
          {i < items.length - 1 && <span className="text-slate-300">/</span>}
        </span>
      ))}
    </nav>
  );
}

export function SectionHead({ eyebrow, title, sub, center }) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-wider text-navy-light mb-2">{eyebrow}</p>}
      <h2 className="font-head text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">{title}</h2>
      {sub && <p className="mt-3 text-slate-600 leading-relaxed">{sub}</p>}
    </div>
  );
}

export function Disclosure({ text }) {
  return <p className="text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-xl p-4 leading-relaxed">{text}</p>;
}
