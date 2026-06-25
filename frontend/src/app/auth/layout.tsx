"use client";
import TanstackProvider from "@/providers/tanstack";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TanstackProvider>{children}</TanstackProvider>
    </>
  );
}
