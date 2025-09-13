import { createContext, ReactNode, useState } from "react";

type UserRole = "customer" | "admin" | null;

interface UserContextType {
  isLoggedIn: boolean;
  role: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  isLoggedIn: false,
  role: null,
  login: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);

  const login = (role: UserRole) => {
    setIsLoggedIn(true);
    setRole(role);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", role || "");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("role");
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
