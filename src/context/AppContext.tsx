import React, { createContext, useContext, useState, useCallback } from "react";
import { sponsors } from "@/data/mockData";

type UserRole = "admin" | "sponsor" | null;

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  lastQuery: string;
  setLastQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [lastQuery, setLastQuery] = useState("No query executed yet.");

  const login = useCallback((email: string, _password: string, role: UserRole): boolean => {
    if (role === "admin") {
      if (email === "admin@kindredpath.org") {
        setUser({ id: 0, name: "Admin", email, role: "admin" });
        setLastQuery(`SELECT * FROM Admin WHERE Email = '${email}';`);
        return true;
      }
      return false;
    }
    const sponsor = sponsors.find((s) => s.Email === email);
    if (sponsor) {
      setUser({ id: sponsor.Sponsor_ID, name: sponsor.Name, email: sponsor.Email, role: "sponsor" });
      setLastQuery(`SELECT * FROM Sponsors WHERE Email = '${email}';`);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setLastQuery("No query executed yet.");
  }, []);

  return (
    <AppContext.Provider value={{ user, login, logout, lastQuery, setLastQuery }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
