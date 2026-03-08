import { client } from "@/sanity/client";
import { profilePageQuery, ProfilePageQueryResult } from "@/sanity/queries";
import Heading from "@/components/global/header";
import UserAccountForm from "@/components/account/account-form";

export default async function Page() {
  const data = await client.fetch<ProfilePageQueryResult>(profilePageQuery);

  return (
    <div className="w-full min-h-screen">
      <Heading
        heading={data.heading ? data.heading : ""}
        subheading={data.description ? data.description : ""}
      />
      <UserAccountForm />
    </div>
  );
}
