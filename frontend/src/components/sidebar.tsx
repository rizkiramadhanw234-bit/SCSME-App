"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import UserProfileMenu from "./userProfileMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarPage() {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Subscriptions",
      href: "/subscriptions",
    },
    {
      title: "Company Profile",
      href: "/company",
    },
    {
      title: "Events Registeration",
      href: "/eventRegistration",
    },
    {
      title: "Resources",
      href: "/resources",
    },
    {
      title: "Paid Uploads",
      href: "/paidUploads",
    },
    {
      title: "Orders",
      href: "/pendingOrders",
    },
    {
      title: "Payments",
      href: "/payments",
    },
  ];
  return (
    <>
      <Sidebar>
        <SidebarHeader className="flex flex-col gap-0 border-b">
          <h1 className="text-2xl font-bold">SCSME</h1>
          <p>Member Portal</p>
        </SidebarHeader>
        <SidebarContent className="pt-2">
          {menuItems.map((item) => (
            <div
              key={item.title}
              className={`${pathname === item.href ? "bg-blue-50 p-2" : "hover:bg-blue-50 p-2"} `}
            >
              <Link href={item.href}>
                <p className="">{item.title}</p>
              </Link>
            </div>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <UserProfileMenu />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
