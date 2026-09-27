import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const ConfigContext = createContext({});

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    api.get("/config").then((r) => setConfig(r.data)).catch(() => setConfig({}));
  }, []);
  return <ConfigContext.Provider value={config || {}}>{children}</ConfigContext.Provider>;
}

export const useSiteConfig = () => useContext(ConfigContext);
