import { client } from "@/sanity/client";
import LoginForm from "@/components/login/loigin-component";
import { loginPageQuery, LoginPageQueryResult } from "@/sanity/queries";
import { createClient } from "@/supabase/supabase-server";
import Image from "next/image";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = await client.fetch<LoginPageQueryResult>(loginPageQuery);

  return (
    <div className="w-full h-[100dvh] bg-background relative flex gap-0">
      <div className="w-1/2 h-[100dvh] relative"></div>
      <div className="absolute z-[1] inset-0 bg-black/30 grayscale"></div>
      <video
        className="absolute inset-0 h-full w-full object-cover z-[0] grayscale"
        autoPlay={true}
        muted
        loop
        playsInline
        preload="auto"
      >
        <source
          src="https://meyjgdixuoudmpfqcdrh.supabase.co/storage/v1/object/public/Image%20Assets/bgvideo.mp4"
          type="video/mp4"
        />
      </video>
      <div className="w-1/2 h-[100dvh] flex items-center justify-center relative z-[2] bg-black/90 backdrop-blur-lg">
        <div className="w-full px-32">
          <h1 className="text-[4rem] mb-2">{data.heading ?? ""}</h1>
          <p className="text-lg leading-snug mb-10">{data.content ?? ""}</p>
          <LoginForm data={data} />
          <p className="text-xs absolute left-32 bottom-5 z-[1] text-foreground/50">
            {data.disclaimer ?? ""}
          </p>
        </div>
      </div>
    </div>
  );
}
