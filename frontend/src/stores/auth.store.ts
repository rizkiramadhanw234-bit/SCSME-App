import { create } from "zustand";
import type { User, AuthResponse } from "@/types";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isHydrated: boolean;
  loading: boolean;
  setUser: (data: AuthResponse | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isHydrated: false,
  loading: true,
  setUser: (user: AuthResponse | null) =>
    set({
      user: user?.data,
      accessToken: user?.accessToken,
      isHydrated: true,
      loading: false,
    }),

  clearAuth() {
    set({ accessToken: null, user: null, isHydrated: false });
  },
}));
