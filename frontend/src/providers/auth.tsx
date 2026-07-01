"use client";

import { axiosApi } from "@/services/axios";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";
import type { AuthResponse } from "@/types";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser } = useAuthStore();

  useEffect(() => {
    try {
      axiosApi
        .post("/user/refresh-token")
        .then((res) => {
          const data = res.data as AuthResponse;
          setUser(data);
        })
        .catch(() => setUser(null));
    } catch (error) {
      console.error(error);
    }
  }, [setUser]);

  return <>{children}</>;
}
