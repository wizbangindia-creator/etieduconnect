import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <Compass className="h-16 w-16 text-navy" />
      <h1 className="font-head text-4xl font-bold text-slate-900 mt-4">Page not found</h1>
      <p className="text-slate-500 mt-2">The page you're looking for doesn't exist. Let's get you back on track.</p>
      <div className="flex gap-3 mt-6">
        <Link to="/" className="bg-navy text-white px-6 py-3 rounded-xl font-semibold">Go Home</Link>
        <Link to="/universities" className="border border-navy/20 text-navy px-6 py-3 rounded-xl font-semibold">Browse Universities</Link>
      </div>
    </div>
  );
}
