import { client } from "../sanity/client";
import LoginForm from "@/components/login/loigin-component";
import { loginPageQuery, LoginPageQueryResult } from "@/sanity/queries";
import { createClient } from "@/supabase/supabase-server";
import Image from "next/image";
import ThemeSwitch from "@/components/global/theme-switcher";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = await client.fetch<LoginPageQueryResult>(loginPageQuery);

  return (
    <div className="w-full bg-background relative">
      <div className="absolute left-0 top-0 w-full flex items-center justify-between px-10 py-5">
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
        <div>
          <ThemeSwitch />
        </div>
      </div>
      <div className="w-full px-10 min-h-screen flex items-center justify-center">
        <div className="max-w-xl">
          <div className="">
            <h1 className="text-foreground text-7xl font-black">
              {data.heading}
            </h1>
            <p className="text-lg text-foreground/50 mt-5">{data.subheading}</p>
            <div className="py-10">
              <LoginForm data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
