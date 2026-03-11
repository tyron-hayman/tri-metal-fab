import Heading from "@/components/global/header";
import { createClient } from "@/supabase/supabase-server";
import ClientAccountForm from "@/components/clients/client-update-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client, error } = await supabase
    .from("tmfClients")
    .select("*")
    .eq("id", id)
    .single();

  console.log(client);

  return (
    <div className="w-full min-h-screen">
      <Heading
        heading={`${client.firstname} ${client.lastname}`}
        subheading={"Manage Client"}
      />
      <ClientAccountForm data={client} />
    </div>
  );
}
