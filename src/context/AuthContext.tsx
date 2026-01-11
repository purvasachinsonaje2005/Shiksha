import { Faculty, HOD, Student } from "@/types/User";
import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  user: Student | HOD | Faculty | null;
  setUser: (user: Student | HOD | Faculty | null) => void;
}

const AuthContext = createContext<UserContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Student | HOD | Faculty | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
