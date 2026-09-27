import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminApi, formatApiErrorDetail } from "@/lib/api";
import { Spinner } from "@/components/site/ui";

// Field schema per entity: scalar fields shown as inputs; array/object fields as JSON textareas.
const SCHEMA = {
  universities: {
    text: ["name", "short_name", "slug", "type", "city", "state", "naac_grade", "logo_text", "logo_color", "cover_url", "source_url", "last_verified", "status"],
    number: ["established_year", "nirf_rank", "rating", "fee_min", "fee_max"],
    bool: ["ugc_deb_approved", "aicte_approved", "wes_recognized", "featured", "sponsored"],
    longtext: ["description", "overview", "learning_info", "exam_info", "academic_process"],
    json: ["modes", "program_categories", "categories", "recognition", "programs", "faqs"],
  },
  courses: {
    text: ["name", "slug", "category", "degree_type", "level", "duration", "source_url", "last_verified", "status"],
    number: ["fee_min", "fee_max"],
    bool: [],
    longtext: ["eligibility", "what_it_is", "who_suits", "online_vs_distance"],
    json: ["modes", "specializations", "careers", "curriculum", "universities", "faqs"],
  },
  guides: {
    text: ["title", "slug", "category", "author", "cover_url", "last_verified", "status"],
    number: [],
    bool: [],
    longtext: ["excerpt", "direct_answer", "body", "who_suits", "caveats"],
    json: ["key_facts", "faqs"],
  },
  landing: {
    text: ["title", "slug", "headline", "subheadline", "cta_text", "category", "status"],
    number: [],
    bool: [],
    longtext: ["intro"],
    json: ["faqs"],
  },
};

const EMPTY = {
  universities: { status: "published", modes: ["Online"], categories: [], program_categories: [], recognition: [], programs: [], faqs: [] },
  courses: { status: "published", modes: ["Online"], specializations: [], careers: [], curriculum: [], universities: [], faqs: [] },
  guides: { status: "published", key_facts: [], faqs: [] },
  landing: { status: "published", faqs: [] },
};

export default function AdminEntityEdit({ entity }) {
  const { slug } = useParams();
  const isNew = slug === "new";
  const nav = useNavigate();
  const schema = SCHEMA[entity];
  const [data, setData] = useState(null);
  const [jsonErr, setJsonErr] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) setData({ ...EMPTY[entity] });
    else adminApi.get(`/admin/${entity}/${slug}`).then((r) => setData(r.data)).catch(() => { toast.error("Not found"); nav(`/admin/${entity}`); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, entity]);

  if (!data) return <Spinner />;

  const upd = (k, v) => setData((p) => ({ ...p, [k]: v }));
  const updJson = (k, str) => {
    setData((p) => ({ ...p, [`__raw_${k}`]: str }));
    try { const parsed = JSON.parse(str); setData((p) => ({ ...p, [k]: parsed })); setJsonErr((e) => ({ ...e, [k]: null })); }
    catch (e) { setJsonErr((er) => ({ ...er, [k]: "Invalid JSON" })); }
  };

  const save = async () => {
    if (Object.values(jsonErr).some(Boolean)) return toast.error("Fix invalid JSON fields first");
    setSaving(true);
    const payload = { ...data };
    Object.keys(payload).forEach((k) => k.startsWith("__raw_") && delete payload[k]);
    try {
      if (isNew) await adminApi.post(`/admin/${entity}`, payload);
      else await adminApi.put(`/admin/${entity}/${slug}`, payload);
      toast.success("Saved");
      nav(`/admin/${entity}`);
    } catch (e) { toast.error(formatApiErrorDetail(e.response?.data?.detail)); } finally { setSaving(false); }
  };

  const lbl = (f) => f.replace(/_/g, " ");
  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-navy outline-none text-sm";

  return (
    <div className="p-5 md:p-8 max-w-4xl">
      <button onClick={() => nav(`/admin/${entity}`)} className="inline-flex items-center gap-2 text-slate-500 text-sm mb-4 hover:text-navy"><ArrowLeft className="h-4 w-4" /> Back</button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-head text-2xl font-bold text-slate-900">{isNew ? "Create" : "Edit"} {entity}</h1>
        <button onClick={save} disabled={saving} data-testid="admin-save-entity" className="inline-flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          {schema.text.map((f) => (
            <div key={f}><label className="text-sm font-medium text-slate-700 capitalize">{lbl(f)}{f === "slug" && !isNew && " (locked)"}</label>
              <input data-testid={`field-${f}`} disabled={f === "slug" && !isNew} value={data[f] ?? ""} onChange={(e) => upd(f, e.target.value)} className={inputCls + " mt-1 disabled:bg-slate-50 disabled:text-slate-400"} /></div>
          ))}
          {schema.number.map((f) => (
            <div key={f}><label className="text-sm font-medium text-slate-700 capitalize">{lbl(f)}</label>
              <input data-testid={`field-${f}`} type="number" step="any" value={data[f] ?? ""} onChange={(e) => upd(f, e.target.value === "" ? null : Number(e.target.value))} className={inputCls + " mt-1"} /></div>
          ))}
        </div>

        {schema.bool.length > 0 && (
          <div className="flex flex-wrap gap-4 pt-2">
            {schema.bool.map((f) => (
              <label key={f} className="flex items-center gap-2 text-sm text-slate-700 capitalize"><input type="checkbox" data-testid={`field-${f}`} checked={!!data[f]} onChange={(e) => upd(f, e.target.checked)} className="h-4 w-4 rounded text-navy" />{lbl(f)}</label>
            ))}
          </div>
        )}

        {schema.longtext.map((f) => (
          <div key={f}><label className="text-sm font-medium text-slate-700 capitalize">{lbl(f)}</label>
            <textarea data-testid={`field-${f}`} value={data[f] ?? ""} onChange={(e) => upd(f, e.target.value)} rows={f === "body" ? 8 : 3} className={inputCls + " mt-1"} /></div>
        ))}

        {schema.json.map((f) => (
          <div key={f}>
            <label className="text-sm font-medium text-slate-700 capitalize flex items-center gap-2">{lbl(f)} <span className="text-[11px] text-slate-400">(JSON)</span>{jsonErr[f] && <span className="text-red-500 text-xs">{jsonErr[f]}</span>}</label>
            <textarea data-testid={`field-${f}`} value={data[`__raw_${f}`] ?? JSON.stringify(data[f] ?? [], null, 2)} onChange={(e) => updJson(f, e.target.value)} rows={5} className={`${inputCls} mt-1 font-mono text-xs ${jsonErr[f] ? "border-red-300" : ""}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
