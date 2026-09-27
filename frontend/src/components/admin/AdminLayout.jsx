import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";
import { LayoutDashboard, Users2, GraduationCap, BookOpen, FileText, Layout, Settings, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/site/Logo";
import { Spinner } from "@/components/site/ui";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/leads", label: "Leads", icon: Users2 },
  { to: "/admin/universities", label: "Universities", icon: GraduationCap },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/guides", label: "Guides", icon: FileText },
  { to: "/admin/landing", label: "Landing Pages", icon: Layout },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  if (user === null) return <div className="min-h-screen"><Spinner label="Checking session…" /></div>;
  if (user === false) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-16 md:w-64 bg-navy-dark text-slate-300 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-4 md:p-6 border-b border-white/10 hidden md:block"><Logo variant="light" /></div>
        <div className="p-4 md:hidden flex justify-center border-b border-white/10"><span className="h-9 w-9 rounded-xl bg-white text-navy font-head font-extrabold text-sm flex items-center justify-center">ETI</span></div>
        <nav className="flex-1 p-2 md:p-4 space-y-1">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} data-testid={`admin-nav-${l.label.toLowerCase().replace(/ /g, "-")}`}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
              <l.icon className="h-5 w-5 shrink-0" /><span className="hidden md:inline">{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-2 md:p-4 border-t border-white/10 space-y-1">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white"><ExternalLink className="h-5 w-5 shrink-0" /><span className="hidden md:inline">View site</span></a>
          <button onClick={() => { logout(); nav("/admin/login"); }} data-testid="admin-logout" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white"><LogOut className="h-5 w-5 shrink-0" /><span className="hidden md:inline">Logout</span></button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-x-hidden"><Outlet /></main>
    </div>
  );
}
