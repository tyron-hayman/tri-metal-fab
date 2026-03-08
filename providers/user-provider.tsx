"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

interface UserContextValue {
  user: User | null;
  profile: UserProfile | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
}

interface UserProviderProps {
  user: User | null;
  profile: UserProfile | null;
  children: ReactNode;
}

// --- Context ---
const UserContext = createContext<UserContextValue | undefined>(undefined);

// --- Provider ---
export function UserProvider({
  user: initialUser,
  profile: initialProfile,
  children,
}: UserProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);

  // Sync state if the parent-provided user changes
  useEffect(() => {
    setUser(initialUser);
    setProfile(initialProfile);
  }, [initialUser]);

  return (
    <UserContext.Provider value={{ user, profile, setUser, setProfile }}>
      {children}
    </UserContext.Provider>
  );
}

// --- Hook ---
export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
