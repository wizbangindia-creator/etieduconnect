import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LeadModal } from "./LeadModal";
import { ShortlistDrawer } from "./ShortlistDrawer";
import { WhatsAppButton } from "./WhatsAppButton";

export function SiteLayout() {
  const loc = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <main className="flex-1 pt-16 md:pt-20"><Outlet /></main>
      <Footer />
      <LeadModal />
      <ShortlistDrawer />
      <WhatsAppButton />
    </div>
  );
}
