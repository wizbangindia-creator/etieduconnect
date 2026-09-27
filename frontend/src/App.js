import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { captureUtms } from "@/lib/analytics";
import { ConfigProvider } from "@/context/ConfigContext";
import { ShortlistProvider } from "@/context/ShortlistContext";
import { LeadProvider } from "@/context/LeadContext";
import { AuthProvider } from "@/context/AuthContext";

import { SiteLayout } from "@/components/site/SiteLayout";
import Home from "@/pages/Home";
import Universities from "@/pages/Universities";
import UniversityProfile from "@/pages/UniversityProfile";
import Courses from "@/pages/Courses";
import CourseProfile from "@/pages/CourseProfile";
import CompareUniversities from "@/pages/CompareUniversities";
import CompareCourses from "@/pages/CompareCourses";
import OnlineVsDistance from "@/pages/OnlineVsDistance";
import Guides from "@/pages/Guides";
import GuideDetail from "@/pages/GuideDetail";
import GetGuidance from "@/pages/GetGuidance";
import SearchPage from "@/pages/SearchPage";
import Advisor from "@/pages/Advisor";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminLeads from "@/pages/admin/AdminLeads";
import AdminEntityList from "@/pages/admin/AdminEntityList";
import AdminEntityEdit from "@/pages/admin/AdminEntityEdit";
import AdminSettings from "@/pages/admin/AdminSettings";

const ENTITIES = ["universities", "courses", "guides", "landing"];

function App() {
  useEffect(() => { captureUtms(); }, []);
  return (
    <ConfigProvider>
      <AuthProvider>
        <ShortlistProvider>
          <LeadProvider>
            <BrowserRouter>
              <Toaster position="top-center" richColors />
              <Routes>
                <Route element={<SiteLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/universities" element={<Universities />} />
                  <Route path="/universities/:slug" element={<UniversityProfile />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:slug" element={<CourseProfile />} />
                  <Route path="/compare/universities" element={<CompareUniversities />} />
                  <Route path="/compare/courses" element={<CompareCourses />} />
                  <Route path="/online-vs-distance" element={<OnlineVsDistance />} />
                  <Route path="/online-education" element={<OnlineVsDistance />} />
                  <Route path="/distance-education" element={<OnlineVsDistance />} />
                  <Route path="/guides" element={<Guides />} />
                  <Route path="/guides/:slug" element={<GuideDetail />} />
                  <Route path="/get-guidance" element={<GetGuidance />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/advisor" element={<Advisor />} />
                  <Route path="/lp/:slug" element={<Landing />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="leads" element={<AdminLeads />} />
                  <Route path="settings" element={<AdminSettings />} />
                  {ENTITIES.map((e) => [
                    <Route key={`${e}-list`} path={e} element={<AdminEntityList entity={e} />} />,
                    <Route key={`${e}-edit`} path={`${e}/:slug`} element={<AdminEntityEdit entity={e} />} />,
                  ])}
                </Route>
              </Routes>
            </BrowserRouter>
          </LeadProvider>
        </ShortlistProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
