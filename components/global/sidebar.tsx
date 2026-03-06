import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";

export function GlobalSidebar() {
  const date = new Date();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-5 flex items-center gap-3">
          <div className="bg-black w-[45px] p-2 relative rounded-[5px]">
            <Image
              src={`/images/logo_small.png`}
              width={24}
              height={24}
              className="w-full h-auto"
              alt="Tri-Metal Fabricators Logo"
            />
          </div>
          <div>
            <h1 className="text-base leading-tight font-black">
              Tri-Metal Fabricators
            </h1>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-5">
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
