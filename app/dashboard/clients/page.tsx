import { client } from "@/sanity/client";
import { clientsPageQuery, ClientsPageQueryResult } from "@/sanity/queries";
import Heading from "@/components/global/header";

export default async function Page() {
  const data = await client.fetch<ClientsPageQueryResult>(clientsPageQuery);

  return (
    <div className="w-full min-h-screen flex items-start justify-start">
      <Heading
        heading={data.heading ? data.heading : ""}
        subheading={data.description ? data.description : ""}
      />
    </div>
  );
}
