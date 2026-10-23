import { client } from "@/sanity/client";
import { dashboardPageQuery, DashboardPageQueryResult } from "@/sanity/queries";
import Heading from "@/components/global/header";
import MaintenanceMode from "@/components/global/MaintenanceMode";
import SupabaseStats from "@/components/supabase-stats";
import PlanUsage from "@/components/plan-usage";

export default async function Page() {
  const data = await client.fetch<DashboardPageQueryResult>(dashboardPageQuery);
  return (
    <div className="w-full min-h-screen">
      <Heading
        heading={data.heading ? data.heading : ""}
        subheading={data.welcomeMessage ? data.welcomeMessage : ""}
      />
      <SupabaseStats hours={24} />
      <PlanUsage />
    </div>
  );
}
