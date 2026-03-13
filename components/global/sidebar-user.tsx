"use client";
import { MoreVertical, LogOut, Bell, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/supabase/supabase-client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const supabase = createClient();
  const router = useRouter();

  const signOut = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message, {
          duration: 5000,
        });
        return;
      }
      router.push("/");
    } catch (error) {
      toast.error(error as string, {
        duration: 5000,
      });
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="bg-primary data-[state=open]:bg-accent data-[state=open]:text-sidebar-accent-foreground border-[var(--sidebar-border)] border-1"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                {user?.user_metadata.display_name ? (
                  <span className="truncate font-medium">
                    {user?.user_metadata.display_name}
                  </span>
                ) : (
                  <span className="truncate font-medium">{user.email}</span>
                )}
              </div>
              <MoreVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 p-2 text-left text-sm">
                <div className="grid flex-1 text-left text-xs leading-tight">
                  {user?.user_metadata.display_name && (
                    <span className="truncate font-black">
                      {user?.user_metadata.display_name}
                    </span>
                  )}
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircle />
                <Link className="w-full" href="/dashboard/account">
                  Account
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              <Link href="#" className="w-full" onClick={(e) => signOut(e)}>
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
