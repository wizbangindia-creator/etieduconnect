import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqAccordion({ faqs }) {
  const [open, setOpen] = useState(0);
  if (!faqs?.length) return null;
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <button data-testid={`faq-${i}`} onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-3 p-4 text-left">
            <span className="font-medium text-slate-800 text-sm">{f.q}</span>
            <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}
