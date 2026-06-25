import Navbar from "@/components/navbar";
import TanstackProvider from "@/providers/tanstack";
import Footer from "@/components/footer";
import AuthProvider from "@/providers/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <TanstackProvider>
          <Navbar />
          {children}
          <Footer />
        </TanstackProvider>
      </AuthProvider>
    </>
  );
}
