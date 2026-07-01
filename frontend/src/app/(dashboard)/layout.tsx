"use client";

import TanstackProvider from "@/providers/tanstack";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { axiosApi } from "@/services/axios";
import type { AuthResponse } from "@/types";
import Sidebar from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SpinnerCustom } from "@/components/ui/spinner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setUser, accessToken, isHydrated } = useAuthStore();

  useEffect(() => {
    axiosApi
      .post("/user/refresh-token")
      .then((res) => {
        const data = res.data as AuthResponse;
        if (data?.data?.role === "guest") {
          router.replace("/auth/login");
          return;
        }
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        router.replace("/auth/login");
      });
  }, [setUser, router]);

  if (!isHydrated || loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerCustom />
      </div>
    );
  if (!accessToken) return null;

  return (
    <div>
      <SidebarProvider>
        <Sidebar />
        <div className="bg-gray-50">
          <SidebarTrigger />
        </div>
        <TanstackProvider>
          <div className="w-full md:pr-6 bg-gray-50">{children}</div>
        </TanstackProvider>
      </SidebarProvider>
    </div>
  );
}
