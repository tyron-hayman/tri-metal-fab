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
import { useUser } from "@/providers/user-provider";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const supabase = createClient();
  const router = useRouter();
  const { placeHolderAvatar } = useUser();

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
              className="data-[state=open]:bg-white data-[state=open]:text-background border-[var(--sidebar-border)] border-1 p-5"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                {user?.user_metadata.display_name ? (
                  <div className="flex items-center gap-2">
                    <div className="w-[25px] h-[25px] bg-black relative rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0 !bg-cover"
                        style={{
                          background: `url("https://api.dicebear.com/10.x/disco/svg?backgroundColor=&patternProbability=100&shapeVariant=circle&shapeColor=ffffff&seed=${user.email}") center center no-repeat`,
                        }}
                      ></div>
                    </div>
                    <span className="truncate font-medium">
                      {user?.user_metadata.display_name}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-[25px] h-[25px] bg-black relative rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0 !bg-cover"
                        style={{
                          background: `url("https://api.dicebear.com/10.x/disco/svg?backgroundColor=&patternProbability=100&shapeVariant=circle&shapeColor=ffffff&seed=${user.email}") center center no-repeat`,
                        }}
                      ></div>
                    </div>
                    <span className="truncate font-medium">{user?.email}</span>
                  </div>
                )}
              </div>
              <MoreVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
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
