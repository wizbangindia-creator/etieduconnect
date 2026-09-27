import { createContext, useContext, useState } from "react";

const LeadContext = createContext(null);

export function LeadProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState({});

  const openLead = (cfg = {}) => { setConfig(cfg); setOpen(true); };

  return (
    <LeadContext.Provider value={{ open, setOpen, config, openLead }}>
      {children}
    </LeadContext.Provider>
  );
}

export const useLead = () => useContext(LeadContext);
