import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { track } from "@/lib/analytics";

const ShortlistContext = createContext(null);
const KEY = "eti_shortlist";

export function ShortlistProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem(KEY) || '{"universities":[],"courses":[]}'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const isSaved = (type, slug) => items[type]?.some((i) => i.slug === slug);

  const toggle = (type, obj) => {
    setItems((prev) => {
      const exists = prev[type].some((i) => i.slug === obj.slug);
      if (exists) {
        toast(`Removed from shortlist`);
        return { ...prev, [type]: prev[type].filter((i) => i.slug !== obj.slug) };
      }
      track("shortlist", { type, slug: obj.slug });
      toast.success(`Saved to shortlist`);
      return { ...prev, [type]: [...prev[type], obj] };
    });
  };

  const remove = (type, slug) => setItems((prev) => ({ ...prev, [type]: prev[type].filter((i) => i.slug !== slug) }));
  const count = (items.universities?.length || 0) + (items.courses?.length || 0);

  return (
    <ShortlistContext.Provider value={{ items, isSaved, toggle, remove, count, drawerOpen, setDrawerOpen }}>
      {children}
    </ShortlistContext.Provider>
  );
}

export const useShortlist = () => useContext(ShortlistContext);
