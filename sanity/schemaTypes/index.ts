import { type SchemaTypeDefinition } from "sanity";
import globalSettings from "@/sanity/schema/globalSettings";
import loginPage from "@/sanity/schema/pages/login";
import dashboardPage from "../schema/pages/dashboard";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [globalSettings, loginPage, dashboardPage],
};
