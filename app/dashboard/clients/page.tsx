import { client } from "@/sanity/client";
import { clientsPageQuery, ClientsPageQueryResult } from "@/sanity/queries";
import Heading from "@/components/global/header";
import { DataTable } from "@/components/global/tables/SortableTable";
import { createClient } from "@/supabase/supabase-server";
import ClientTableNav from "@/components/clients/table-nav";
import { clientColumns } from "@/components/clients/client-columns";

export default async function Page() {
  const data = await client.fetch<ClientsPageQueryResult>(clientsPageQuery);
  const supabase = await createClient();

  const { data: clientList, error } = await supabase
    .from("tmfClients")
    .select("*");

  return (
    <div className="w-full min-h-screen">
      <Heading
        heading={data.heading ? data.heading : ""}
        subheading={data.description ? data.description : ""}
      />
      <div className="p-10">
        <ClientTableNav />
        <DataTable columns={clientColumns} data={clientList as any} />
      </div>
    </div>
  );
}
