import { client } from "@/sanity/client";
import { BuildsPageQuery, BuildsPageQueryResult } from "@/sanity/queries";
import Heading from "@/components/global/header";
import MaintenanceMode from "@/components/global/MaintenanceMode";

export default async function Page() {
  const data = await client.fetch<BuildsPageQueryResult>(BuildsPageQuery);

  return (
    <div className="w-full min-h-screen relative">
      {data.maintenanceMode ? (
        <MaintenanceMode heading="Page Under Maintenance" />
      ) : (
        <>
          <Heading
            heading={data.heading ? data.heading : ""}
            subheading={data.description ? data.description : ""}
          />
        </>
      )}
    </div>
  );
}
