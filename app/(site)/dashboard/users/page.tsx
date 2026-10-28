import { clientsPageQuery, ClientsPageQueryResult } from "@/sanity/queries";
import Heading from "@/components/global/header";
import { DataTable } from "@/components/global/tables/SortableTable";
import { createClient } from "@/supabase/supabase-server";
import ClientTableNav from "@/components/clients/table-nav";
import { clientColumns } from "@/components/clients/client-columns";
import MaintenanceMode from "@/components/global/MaintenanceMode";
import ClientList from "@/components/clients/client-list";

export default async function Page() {
  return (
    <div className="w-full min-h-screen">
      <Heading heading={"Users"} subheading={""} />
    </div>
  );
}
