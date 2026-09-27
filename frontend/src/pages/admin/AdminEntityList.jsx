import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ExternalLink, Search } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import { Spinner } from "@/components/site/ui";

const CONFIG = {
  universities: { title: "Universities", label: (d) => d.name, sub: (d) => `${d.city}, ${d.state}`, viewBase: "/universities/" },
  courses: { title: "Courses", label: (d) => d.name, sub: (d) => `${d.level} · ${d.duration}`, viewBase: "/courses/" },
  guides: { title: "Guides", label: (d) => d.title, sub: (d) => d.category, viewBase: "/guides/" },
  landing: { title: "Landing Pages", label: (d) => d.title, sub: (d) => d.headline, viewBase: "/lp/" },
};

export default function AdminEntityList({ entity }) {
  const cfg = CONFIG[entity];
  const [items, setItems] = useState(null);
  const [q, setQ] = useState("");
  const nav = useNavigate();

  const load = () => { setItems(null); adminApi.get(`/admin/${entity}`).then((r) => setItems(r.data)); };
  useEffect(load, [entity]);

  const del = async (slug, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    await adminApi.delete(`/admin/${entity}/${slug}`);
    toast.success("Deleted");
    load();
  };

  const filtered = (items || []).filter((d) => cfg.label(d).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-5 md:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div><h1 className="font-head text-2xl font-bold text-slate-900">{cfg.title}</h1><p className="text-slate-500 text-sm">{items ? `${items.length} items` : "Loading…"}</p></div>
        <button onClick={() => nav(`/admin/${entity}/new`)} data-testid={`admin-add-${entity}`} className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl text-sm font-semibold"><Plus className="h-4 w-4" /> Add New</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 flex items-center px-4 py-2.5 mb-4 max-w-md">
        <Search className="h-4 w-4 text-slate-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="flex-1 outline-none text-sm ml-2" />
      </div>

      {!items ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          {filtered.map((d) => (
            <div key={d.slug} onClick={() => nav(`/admin/${entity}/${d.slug}`)} data-testid={`admin-item-${d.slug}`} className="flex items-center gap-3 p-4 hover:bg-slate-50 cursor-pointer">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-800 truncate">{cfg.label(d)}</p>
                <p className="text-xs text-slate-500 truncate">{cfg.sub(d)} · /{d.slug}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${d.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{d.status || "published"}</span>
              <a href={`${cfg.viewBase}${d.slug}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-2 text-slate-400 hover:text-navy"><ExternalLink className="h-4 w-4" /></a>
              <button onClick={(e) => { e.stopPropagation(); nav(`/admin/${entity}/${d.slug}`); }} className="p-2 text-slate-400 hover:text-navy"><Pencil className="h-4 w-4" /></button>
              <button onClick={(e) => del(d.slug, e)} data-testid={`admin-delete-${d.slug}`} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
