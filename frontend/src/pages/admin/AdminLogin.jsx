import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatApiErrorDetail } from "@/lib/api";
import { Logo } from "@/components/site/Logo";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("connect@etieduconnect.com");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try { await login(email, password); nav("/admin"); }
    catch (e2) { setErr(formatApiErrorDetail(e2.response?.data?.detail) || "Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 eti-grid-bg">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex justify-center mb-6"><Logo /></div>
        <div className="text-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-navy text-white flex items-center justify-center mx-auto mb-3"><Lock className="h-6 w-6" /></div>
          <h1 className="font-head text-2xl font-bold text-slate-900">Admin CMS</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to manage the platform</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {err && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-xl" data-testid="admin-login-error">{err}</p>}
          <div><label className="text-sm font-medium text-slate-700">Email</label>
            <input data-testid="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-navy outline-none text-sm" /></div>
          <div><label className="text-sm font-medium text-slate-700">Password</label>
            <input data-testid="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-navy outline-none text-sm" placeholder="••••••••" /></div>
          <button disabled={loading} data-testid="admin-login-button" className="w-full bg-navy hover:bg-navy-dark text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">{loading && <Loader2 className="h-4 w-4 animate-spin" />}Sign In</button>
        </form>
      </div>
    </div>
  );
}
