"use client";
import TanstackProvider from "@/providers/tanstack";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { accessToken, isHydrated, user } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;
    if (!accessToken || !user) {
      router.push("/auth/login");
    }
  }, [accessToken, isHydrated, router, user]);

  if (!isHydrated) return null;
  if (!accessToken || !user) return null;
  return (
    <>
      <TanstackProvider>{children}</TanstackProvider>
    </>
  );
}
