import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users2, GraduationCap, BookOpen, FileText, TrendingUp, Search, Eye, GitCompare, Send } from "lucide-react";
import { adminApi } from "@/lib/api";
import { Spinner } from "@/components/site/ui";

const EVENT_LABELS = { search: ["Searches", Search], view_university: ["University Views", Eye], view_course: ["Course Views", Eye], comparison_start: ["Comparisons Started", GitCompare], comparison_complete: ["Comparisons Completed", GitCompare], lead_submit: ["Leads Submitted", Send], shortlist: ["Shortlists", FileText], whatsapp_click: ["WhatsApp Clicks", Send], partner_handoff: ["Partner Handoffs", Send] };

export default function AdminDashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { adminApi.get("/admin/stats").then((r) => setS(r.data)); }, []);
  if (!s) return <Spinner />;

  const cards = [
    { label: "Total Leads", value: s.total_leads, icon: Users2, color: "bg-navy" },
    { label: "New Leads", value: s.new_leads, icon: TrendingUp, color: "bg-emerald-600" },
    { label: "Universities", value: s.universities, icon: GraduationCap, color: "bg-blue-600" },
    { label: "Courses", value: s.courses, icon: BookOpen, color: "bg-violet-600" },
  ];

  return (
    <div className="p-5 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-head text-2xl font-bold text-slate-900">Dashboard</h1><p className="text-slate-500 text-sm">Overview of leads, content and engagement.</p></div>
        <Link to="/admin/leads" className="bg-navy text-white px-4 py-2.5 rounded-xl text-sm font-semibold">View Leads</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} data-testid={`stat-${c.label.toLowerCase().replace(/ /g, "-")}`} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className={`h-10 w-10 rounded-xl ${c.color} text-white flex items-center justify-center mb-3`}><c.icon className="h-5 w-5" /></div>
            <p className="font-head text-3xl font-bold text-slate-900">{c.value}</p>
            <p className="text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h2 className="font-head font-semibold text-slate-900 mb-4">Engagement Events</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(EVENT_LABELS).map(([key, [label, Icon]]) => (
              <div key={key} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                <Icon className="h-4 w-4 text-navy" />
                <div><p className="font-head font-bold text-lg text-slate-900">{s.events[key] || 0}</p><p className="text-[11px] text-slate-500">{label}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h2 className="font-head font-semibold text-slate-900 mb-4">Leads by Program</h2>
          {s.leads_by_program.length === 0 ? <p className="text-sm text-slate-400">No leads yet.</p> : (
            <div className="space-y-2">
              {s.leads_by_program.map((p) => {
                const max = Math.max(...s.leads_by_program.map((x) => x.count));
                return (
                  <div key={p.program}>
                    <div className="flex justify-between text-sm mb-1"><span className="text-slate-600">{p.program || "Unspecified"}</span><span className="font-semibold text-slate-900">{p.count}</span></div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-navy rounded-full" style={{ width: `${(p.count / max) * 100}%` }} /></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mt-6">
        <div className="flex items-center justify-between mb-4"><h2 className="font-head font-semibold text-slate-900">Recent Leads</h2><Link to="/admin/leads" className="text-navy text-sm font-medium">See all</Link></div>
        {s.recent_leads.length === 0 ? <p className="text-sm text-slate-400">No leads yet.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead><tr className="text-left text-slate-400 text-xs uppercase"><th className="py-2">Name</th><th>Program</th><th>Mode</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>{s.recent_leads.map((l) => (
                <tr key={l.lead_id} className="border-t border-slate-100"><td className="py-2.5 font-medium text-slate-800">{l.name}</td><td className="text-slate-600">{l.program_interest}</td><td className="text-slate-600">{l.preferred_mode || "—"}</td><td><span className="text-xs bg-blue-50 text-navy px-2 py-0.5 rounded-full">{l.lead_status}</span></td><td className="text-slate-500 text-xs">{new Date(l.created_at).toLocaleDateString()}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
