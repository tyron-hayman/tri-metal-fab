// structure.ts
import { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // Settings group
      S.listItem()
        .title("Settings")
        .child(
          S.list()
            .title("Settings")
            .items([
              S.listItem().title("Global").child(
                S.document()
                  .schemaType("globalSettings")
                  .documentId("globalSettings"), // fixed ID = singleton
              ),
            ]),
        ),

      S.divider(),

      // pages group
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem().title("Login").child(
                S.document().schemaType("loginPage").documentId("loginPage"), // fixed ID = singleton
              ),
              S.listItem().title("Dashboard").child(
                S.document()
                  .schemaType("dashboardPage")
                  .documentId("dashboardPage"), // fixed ID = singleton
              ),
            ]),
        ),

      // Everything else, minus the settings type
      ...S.documentTypeListItems().filter(
        (item) =>
          !["globalSettings", "loginPage", "dashboardPage"].includes(
            item.getId() as string,
          ),
      ),
    ]);
