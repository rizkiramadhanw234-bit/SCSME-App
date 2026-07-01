"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/useAuth";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout();
  };

  const menuNav = [
    { label: "Home", href: "/home" },
    { label: "About Us", href: "/aboutUs" },
    { label: "Membership Services", href: "/membership-services" },
    { label: "Membership Packages", href: "/membership-packages" },
    { label: "Events & Training", href: "/events-training" },
    { label: "Resource Centre", href: "/resource-centre" },
    { label: "Sponsorship Exposure", href: "/sponsorship-exposure" },
  ];

  return (
    <>
      <nav className="fixed w-full px-6 md:px-20 py-6 bg-white border-b shadow-xs z-50">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="font-semibold text-3xl text-blue-950">
              SCSME
            </Link>
            <p className="text-xs">
              Selangor Chamber of <br />
              Small and Medium Entrepreneurs
            </p>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {menuNav.map((nav) => (
              <Link
                key={nav.href}
                href={nav.href}
                className={`text-sm ${
                  pathname === nav.href
                    ? "text-blue-800 font-medium underline underline-offset-4"
                    : "text-black hover:text-blue-800"
                }`}
              >
                {nav.label}
              </Link>
            ))}
            <div className="hidden lg:flex items-center gap-2">
              {loading ? (
                <p>...</p>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="outline">
                        {user.name.charAt(0).toLocaleUpperCase()}
                      </Button>
                    }
                  />
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <UserIcon />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/companies")}>
                      <CreditCardIcon />
                      Company
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                      <SettingsIcon />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleLogout}
                    >
                      <LogOutIcon />
                      {isPending ? "Logging out..." : "Logout"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  className="w-17 bg-blue-900 hover:bg-blue-950 cursor-pointer"
                  onClick={() => router.push("/auth/login")}
                >
                  Login
                </Button>
              )}
            </div>
          </div>

          {/* Hamburger Button (Mobile) */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu open */}
        <div
          className={`md:hidden w-full bg-transparent flex flex-col transform transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 max-h-screen translate-y-0"
              : "opacity-0 max-h-0 -translate-y-5 pointer-events-none overflow-hidden"
          }`}
        >
          {menuNav.map((nav) => (
            <Link
              key={nav.href}
              href={nav.href}
              className={`block px-3 py-2.5 rounded-md text-sm ${
                pathname === nav.href
                  ? "bg-blue-50 text-blue-800 font-medium"
                  : "text-black hover:bg-gray-50 hover:text-blue-800"
              } transition duration-200`}
              onClick={() => setIsOpen(false)}
            >
              {nav.label}
            </Link>
          ))}
          <div className="mt-2 px-3">
            <Button
              className="w-full"
              onClick={() => {
                router.push("/auth/register");
                setIsOpen(false);
              }}
            >
              Login
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}
