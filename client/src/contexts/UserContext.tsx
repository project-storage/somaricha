import { createContext, useState, ReactNode } from "react";

type UserContextType = {
  isLoggedIn: boolean;
  role: "user" | "admin" | null;
  username: string | null;
  login: (username: string, role: "user" | "admin") => void;
  logout: () => void;
};

export const UserContext = createContext<UserContextType>({
  isLoggedIn: false,
  role: null,
  username: null,
  login: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<"user" | "admin" | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const login = (username: string, role: "user" | "admin") => {
    setIsLoggedIn(true);
    setRole(role);
    setUsername(username);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setUsername(null);
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, role, username, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
