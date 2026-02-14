"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/app/actions/auth";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  team: string | null;
  avatar: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUserId } = useStore();
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setUserId(currentUser.id);
        } else {
             // If no user, we might want to ensure store knows?
             setUserId(""); // Or null, but store expects string mostly
        }
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [setUserId]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
