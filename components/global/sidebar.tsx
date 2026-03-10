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
import { Badge } from "@/components/ui/badge";
import { formatedate } from "@/utils/tools";

interface MenuItem {
  title: string;
  link: string;
  icon: LucideIcon;
}

export function GlobalSidebar() {
  const date = new Date();
  const pathname = usePathname();
  const { user } = useUser();

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
        <ul className="w-full px-2 flex flex-col gap-4">
          {pageLinks.map((menuItem: MenuItem, index: number) => {
            return (
              <li key={`menuItem${index}`}>
                <Link
                  href={menuItem.link}
                  className={`w-full text-sm flex gap-3 items-center px-3 py-2 ${pathname === menuItem.link ? "bg-[var(--accent)] text-white rounded-4xl" : ""}`}
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
          <div className="flex items-center gap-3 bg-[var(--sidebar-accent)] p-3 rounded-[8px]">
            <div className="rounded-full w-[40px] shrink-0 aspect-square overflow-hidden relative">
              <Image
                src={`https://ui-avatars.com/api/?name=${user?.user_metadata.display_name.replace(" ", "-")}&size=256`}
                fill
                alt={`gradiant avatar for user`}
              />
            </div>
            <div>
              {user?.user_metadata?.display_name ? (
                <p className="text-xs text-foreground mb-1">
                  {user?.user_metadata?.display_name}
                </p>
              ) : (
                <p className="text-xs text-foreground mb-1">{user?.email}</p>
              )}
              {user?.user_metadata.email_verified && (
                <Badge variant="default">
                  <BadgeCheck data-icon="inline-start" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </SidebarGroup>
        <SidebarGroup>
          <div className="p-2 flex flex-col gap-1">
            {user && user.last_sign_in_at && (
              <p className="text-xs text-gray-600">
                {" "}
                Last Signed In: {formatedate(user.last_sign_in_at)}
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
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
