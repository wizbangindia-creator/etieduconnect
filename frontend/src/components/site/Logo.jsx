import { Link } from "react-router-dom";

export function Logo({ variant = "dark", className = "" }) {
  const light = variant === "light";
  return (
    <Link to="/" data-testid="nav-logo-link" className={`inline-flex items-center gap-1.5 group ${className}`}>
      <span className={`font-head font-extrabold text-lg tracking-tight ${light ? "text-white" : "text-navy"}`}>
        ETI <span className={light ? "text-white" : "text-navy-light"}>EduConnect</span><sup className="text-[9px] font-semibold ml-0.5">™</sup>
      </span>
    </Link>
  );
}

export function UniLogo({ text, color, size = 48 }) {
  return (
    <span className="inline-flex items-center justify-center rounded-xl font-head font-bold text-white shrink-0 shadow-sm"
      style={{ background: color, width: size, height: size, fontSize: size * 0.34 }}>
      {text}
    </span>
  );
}
