import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { track } from "@/lib/analytics";
import { CourseCard } from "@/components/site/CourseCard";
import { Spinner } from "@/components/site/ui";

export default function Courses() {
  const [params, setParams] = useSearchParams();
  const [meta, setMeta] = useState({ category_codes: [], modes: [], levels: [] });
  const [courses, setCourses] = useState(null);

  const f = { search: params.get("search") || "", level: params.get("level") || "", mode: params.get("mode") || "", category: params.get("category") || "" };

  useEffect(() => { api.get("/meta").then((r) => setMeta(r.data)); }, []);
  useEffect(() => {
    setCourses(null);
    const qs = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => v && qs.set(k, v));
    api.get(`/courses?${qs.toString()}`).then((r) => setCourses(r.data));
    track("view_course_list", { ...f });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const setF = (k, v) => { const n = new URLSearchParams(params); v ? n.set(k, v) : n.delete(k); setParams(n); };
  const chip = (k, v, label) => (
    <button key={label} data-testid={`course-filter-${k}-${v || "all"}`} onClick={() => setF(k, v)}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${f[k] === v ? "bg-navy text-white border-navy" : "bg-white text-slate-600 border-slate-200 hover:border-navy"}`}>{label}</button>
  );

  return (
    <div className="bg-white">
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-brand">Explore</p>
          <h1 className="font-head text-3xl md:text-5xl font-bold mt-2">Courses & Programs</h1>
          <p className="text-blue-100 mt-3 max-w-2xl">From MBA to BCA — understand eligibility, duration, fees and who each program suits.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {chip("level", "", "All Levels")}
          {(meta.levels || []).map((l) => chip("level", l, l))}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {chip("mode", "", "All Modes")}
          {(meta.modes || []).filter((m) => m !== "Regular").map((m) => chip("mode", m, m))}
        </div>
        {!courses ? <Spinner /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{courses.map((c) => <CourseCard key={c.slug} c={c} />)}</div>
        )}
      </div>
    </div>
  );
}
