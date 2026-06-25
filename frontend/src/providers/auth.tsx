"use client";

import { axiosApi } from "@/services/axios";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";

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
          setUser(res.data);
        })
        .catch(() => setUser(null));
    } catch (error) {
      console.error(error);
    }
  }, [setUser]);

  return <>{children}</>;
}
