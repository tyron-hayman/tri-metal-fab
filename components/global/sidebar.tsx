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
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/providers/user-provider";
import { NavUser } from "./sidebar-user";
import type { User } from "@supabase/supabase-js";

interface MenuItem {
  title: string;
  link: string;
  icon: LucideIcon;
}

export function GlobalSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const date = new Date();

  const pageLinks: MenuItem[] = [
    { title: "Dashboard", link: "/dashboard", icon: LayoutDashboard },
    { title: "Clients", link: "/dashboard/clients", icon: Contact },
    {
      title: "Purchase Orders",
      link: "/purchase_orders",
      icon: ShoppingBag,
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
        <ul className="w-full px-2 flex flex-col gap-4">
          {pageLinks.map((menuItem: MenuItem, index: number) => {
            const isActive =
              menuItem.link === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(menuItem.link);

            return (
              <li key={`menuItem${index}`}>
                <Link
                  href={menuItem.link}
                  className={`w-full text-sm flex gap-3 items-center px-3 py-2 ${isActive ? "bg-[var(--accent)] text-white rounded-4xl" : ""}`}
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
        <SidebarGroup>
          <NavUser user={user as User} />
        </SidebarGroup>
        <SidebarGroup>
          <div className="w-full flex flex-col">
            <p className="text-[0.7rem] text-gray-600">
              &copy; {date.getFullYear()} Tri-Metal Fabricators
            </p>
            <p className="text-[0.7rem] text-gray-600">
              Built by{" "}
              <a href="https://tyronhayman.me" target="_blank">
                Tyron Hayman
              </a>
            </p>
          </div>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
