"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCurrentUser } from "@/app/actions/auth";
import { hasSeasonVotes } from "@/app/actions/seasonVote";
import { useStore } from "@/lib/store";

type User = {
  id: string;
  name: string;
  isAdmin: boolean;
  team: string | null;
  avatar: string | null;
  favoriteDriver: string | null;
  favoriteDriverSlug: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  hasSeasonalVote: boolean | null; // null = not checked yet
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  hasSeasonalVote: null,
  refreshUser: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSeasonVote, setHasSeasonVote] = useState<boolean | null>(null);
  const { setUserId } = useStore();

  const loadUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setUserId(currentUser.id);

        // Check seasonal vote status
        const hasSeason = await hasSeasonVotes();
        setHasSeasonVote(hasSeason);
      } else {
        setUser(null);
        setUserId("");
        setHasSeasonVote(null);
      }
    } catch (error) {
      console.error("Failed to load user", error);
    } finally {
      setLoading(false);
    }
  }, [setUserId]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const refreshUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider value={{ user, loading, hasSeasonalVote: hasSeasonVote, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
