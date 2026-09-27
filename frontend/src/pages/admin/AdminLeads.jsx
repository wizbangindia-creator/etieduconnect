import { useEffect, useState } from "react";
import { Download, X, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { adminApi, API, getToken } from "@/lib/api";
import { Spinner } from "@/components/site/ui";

const STATUSES = ["new", "qualified", "routed", "closed"];
const HANDOFF = ["pending", "success", "failed"];

export default function AdminLeads() {
  const [leads, setLeads] = useState(null);
  const [filter, setFilter] = useState("");
  const [sel, setSel] = useState(null);

  const load = () => {
    setLeads(null);
    adminApi.get(`/admin/leads${filter ? `?status=${filter}` : ""}`).then((r) => setLeads(r.data));
  };
  useEffect(load, [filter]);

  const save = async (lead) => {
    try {
      const { data } = await adminApi.put(`/admin/leads/${lead.lead_id}`, {
        lead_status: lead.lead_status, partner_handoff_status: lead.partner_handoff_status, outcome: lead.outcome, notes: lead.notes });
      toast.success("Lead updated");
      setSel(data);
      load();
    } catch (e) { toast.error("Update failed"); }
  };

  const exportCsv = async () => {
    const res = await fetch(`${API}/admin/leads/export`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "eti-leads.csv"; a.click();
    toast.success("CSV downloaded");
  };

  return (
    <div className="p-5 md:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div><h1 className="font-head text-2xl font-bold text-slate-900">Leads</h1><p className="text-slate-500 text-sm">Manage and route enquiries to your partner.</p></div>
        <button onClick={exportCsv} data-testid="admin-export-csv" className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl text-sm font-semibold"><Download className="h-4 w-4" /> Export CSV</button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilter("")} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${!filter ? "bg-navy text-white border-navy" : "bg-white text-slate-600 border-slate-200"}`}>All</button>
        {STATUSES.map((s) => <button key={s} onClick={() => setFilter(s)} data-testid={`lead-filter-${s}`} className={`px-3 py-1.5 rounded-full text-sm font-medium border capitalize ${filter === s ? "bg-navy text-white border-navy" : "bg-white text-slate-600 border-slate-200"}`}>{s}</button>)}
      </div>

      {!leads ? <Spinner /> : leads.length === 0 ? <p className="text-slate-400 py-16 text-center">No leads found.</p> : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead><tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100"><th className="p-4">Lead ID</th><th>Name</th><th>Contact</th><th>Program</th><th>Source</th><th>Status</th><th>Handoff</th></tr></thead>
            <tbody>{leads.map((l) => (
              <tr key={l.lead_id} onClick={() => setSel(l)} data-testid={`lead-row-${l.lead_id}`} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                <td className="p-4 font-mono text-xs text-slate-500">{l.lead_id}{l.duplicate && <span className="ml-1 text-amber-600">•dup</span>}</td>
                <td className="font-medium text-slate-800">{l.name}</td>
                <td className="text-slate-600">{l.phone}</td>
                <td className="text-slate-600">{l.program_interest}</td>
                <td className="text-slate-500 text-xs">{l.utm_source || l.source || "direct"}</td>
                <td><span className="text-xs bg-blue-50 text-navy px-2 py-0.5 rounded-full capitalize">{l.lead_status}</span></td>
                <td><span className={`text-xs px-2 py-0.5 rounded-full capitalize ${l.partner_handoff_status === "success" ? "bg-emerald-50 text-emerald-700" : l.partner_handoff_status === "failed" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"}`}>{l.partner_handoff_status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {sel && <LeadDrawer lead={sel} onClose={() => setSel(null)} onChange={setSel} onSave={save} />}
    </div>
  );
}

function LeadDrawer({ lead, onClose, onChange, onSave }) {
  const upd = (k, v) => onChange({ ...lead, [k]: v });
  const Row = ({ label, value }) => value ? <div className="flex justify-between text-sm py-1.5 border-b border-slate-50"><span className="text-slate-500">{label}</span><span className="text-slate-800 font-medium text-right">{value}</span></div> : null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/40" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-[420px] max-w-[92%] bg-white shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div><h3 className="font-head font-bold text-slate-900">{lead.name}</h3><p className="text-xs font-mono text-slate-400">{lead.lead_id}</p></div>
          <button onClick={onClose}><X className="h-5 w-5 text-slate-400" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex gap-2">
            <a href={`tel:${lead.phone}`} className="flex-1 inline-flex items-center justify-center gap-2 bg-navy text-white py-2.5 rounded-xl text-sm font-semibold"><Phone className="h-4 w-4" /> Call</a>
            {lead.email && <a href={`mailto:${lead.email}`} className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-200 py-2.5 rounded-xl text-sm font-semibold text-slate-700"><Mail className="h-4 w-4" /> Email</a>}
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <Row label="Phone" value={lead.phone} />
            <Row label="Email" value={lead.email} />
            <Row label="Qualification" value={lead.qualification} />
            <Row label="Program" value={lead.program_interest} />
            <Row label="Preferred Mode" value={lead.preferred_mode} />
            <Row label="Current Status" value={lead.current_status} />
            <Row label="Location" value={lead.preferred_location} />
            <Row label="Consent" value={lead.consent ? "Given" : "No"} />
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase text-slate-400 mb-2">Attribution</p>
            <Row label="Source" value={lead.utm_source || lead.source} />
            <Row label="Medium" value={lead.utm_medium} />
            <Row label="Campaign" value={lead.utm_campaign || lead.campaign} />
            <Row label="Landing Page" value={lead.landing_page} />
            <Row label="CTA" value={lead.cta_label} />
            <Row label="Context" value={lead.context_type && `${lead.context_type}: ${lead.context_slug || ""}`} />
            <Row label="Submitted" value={new Date(lead.created_at).toLocaleString()} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Lead Status</label>
            <select data-testid="lead-status-update" value={lead.lead_status} onChange={(e) => upd("lead_status", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm capitalize">{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Partner Handoff</label>
            <select data-testid="lead-handoff-update" value={lead.partner_handoff_status} onChange={(e) => upd("partner_handoff_status", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm capitalize">{HANDOFF.map((s) => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div><label className="text-sm font-medium text-slate-700">Outcome / Notes</label><textarea value={lead.notes || ""} onChange={(e) => upd("notes", e.target.value)} rows={3} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm" placeholder="Add notes…" /></div>
        </div>
        <div className="p-5 border-t border-slate-100"><button onClick={() => onSave(lead)} data-testid="lead-save-button" className="w-full bg-navy text-white py-3 rounded-xl font-semibold">Save Changes</button></div>
      </div>
    </div>
  );
}
