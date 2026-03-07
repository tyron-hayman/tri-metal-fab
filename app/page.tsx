import { client } from "../sanity/client";
import LoginForm from "@/components/login/loigin-component";
import { loginPageQuery, LoginPageQueryResult } from "@/sanity/queries";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/supabase-server";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const data = await client.fetch<LoginPageQueryResult>(loginPageQuery);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <LoginForm data={data} />
    </div>
  );
}
