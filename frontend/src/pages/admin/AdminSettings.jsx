import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import { Spinner } from "@/components/site/ui";

const FIELDS = [
  ["whatsapp_number", "WhatsApp Number (with country code, no +)", "text"],
  ["whatsapp_message", "WhatsApp Prefilled Message", "text"],
  ["contact_email", "Contact Email", "text"],
  ["contact_phone", "Contact Phone", "text"],
  ["company_name", "Company Name", "text"],
  ["partner_name", "Counselling Partner Name", "text"],
  ["disclosure_text", "Disclosure / Trust Statement", "textarea"],
];

export default function AdminSettings() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { adminApi.get("/admin/config/settings").then((r) => setData(r.data)); }, []);
  if (!data) return <Spinner />;

  const upd = (k, v) => setData((p) => ({ ...p, [k]: v }));
  const save = async () => {
    setSaving(true);
    try { await adminApi.put("/admin/config/settings", data); toast.success("Settings saved"); }
    catch (e) { toast.error("Save failed"); } finally { setSaving(false); }
  };

  return (
    <div className="p-5 md:p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-head text-2xl font-bold text-slate-900">Settings</h1><p className="text-slate-500 text-sm">Contact info, WhatsApp CTA and trust disclosure.</p></div>
        <button onClick={save} disabled={saving} data-testid="settings-save" className="inline-flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save</button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        {FIELDS.map(([k, label, type]) => (
          <div key={k}><label className="text-sm font-medium text-slate-700">{label}</label>
            {type === "textarea"
              ? <textarea data-testid={`settings-${k}`} value={data[k] ?? ""} onChange={(e) => upd(k, e.target.value)} rows={4} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-navy outline-none text-sm" />
              : <input data-testid={`settings-${k}`} value={data[k] ?? ""} onChange={(e) => upd(k, e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-navy outline-none text-sm" />}
          </div>
        ))}
      </div>
    </div>
  );
}
