import { createContext, useContext, useEffect, useState } from "react";
import { adminApi, setToken, clearToken, getToken, formatApiErrorDetail } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null=checking, false=guest, object=logged in

  useEffect(() => {
    if (!getToken()) { setUser(false); return; }
    adminApi.get("/auth/me").then((r) => setUser(r.data)).catch(() => { clearToken(); setUser(false); });
  }, []);

  const login = async (email, password) => {
    const { data } = await adminApi.post("/auth/login", { email, password });
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try { await adminApi.post("/auth/logout"); } catch (e) { /* noop */ }
    clearToken();
    setUser(false);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
export { formatApiErrorDetail };
