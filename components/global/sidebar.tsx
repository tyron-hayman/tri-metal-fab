"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import {
  LucideIcon,
  LayoutDashboard,
  Contact,
  ShoppingBag,
  UserRoundCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";

interface MenuItem {
  title: string;
  link: string;
  icon: LucideIcon;
}

export function GlobalSidebar({ userdata }: { userdata: User }) {
  const date = new Date();
  const pathname = usePathname();
  const lastDate = new Date(userdata.last_sign_in_at as string);

  const pageLinks: MenuItem[] = [
    { title: "Dashboard", link: "/dashboard", icon: LayoutDashboard },
    { title: "Clients", link: "/dashboard/clients", icon: Contact },
    {
      title: "Purchase Orders",
      link: "/purchase_orders",
      icon: ShoppingBag,
    },
    {
      title: "Profile / Account",
      link: "/dashboard/account",
      icon: UserRoundCog,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <div className="bg-black w-[30px] p-1 relative rounded-[5px]">
            <Image
              src={`/images/logo_small.png`}
              width={24}
              height={24}
              className="w-full h-auto"
              alt="Tri-Metal Fabricators Logo"
            />
          </div>
          <div>
            <h1 className="text-xs leading-tight font-black">
              Tri-Metal Fabricators
            </h1>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <ul className="w-full p-2">
          {pageLinks.map((menuItem: MenuItem, index: number) => {
            return (
              <li key={`menuItem${index}`}>
                <Link
                  href={menuItem.link}
                  className={`w-full text-sm flex gap-3 items-center px-3 py-2 ${pathname === menuItem.link ? "bg-amber-500 text-black rounded-[8px]" : ""}`}
                >
                  <menuItem.icon size={16} />
                  <span>{menuItem.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 flex flex-col gap-1">
          {lastDate && (
            <p className="text-xs text-gray-600">
              {" "}
              Last Signed In:{" "}
              {lastDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
          <p className="text-xs text-gray-600">
            &copy; {date.getFullYear()} Tri-Metal Fabricators
          </p>
          <p className="text-xs text-gray-600">
            Built by{" "}
            <a href="https://tyronhayman.me" target="_blank">
              Tyron Hayman
            </a>
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
