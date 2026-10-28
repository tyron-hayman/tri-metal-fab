import { clientsPageQuery, ClientsPageQueryResult } from "@/sanity/queries";
import Heading from "@/components/global/header";
import { DataTable } from "@/components/global/tables/SortableTable";
import { createClient } from "@/supabase/supabase-server";
import ClientTableNav from "@/components/clients/table-nav";
import { clientColumns } from "@/components/clients/client-columns";
import MaintenanceMode from "@/components/global/MaintenanceMode";
import ClientList from "@/components/clients/client-list";

export default async function Page() {
  const supabase = await createClient();

  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("first_name");

  const subHeadStyle = "text-foreground/50 text-sm mb-2 font-black";
  const subText = "text-sm mb-2";

  return (
    <div className="w-full min-h-screen">
      <Heading heading={"Clients"} subheading={""} />
      <div className="p-10">
        <ClientTableNav />
        {clients && clients.length > 0 && <ClientList clients={clients} />}
      </div>
    </div>
  );
}
