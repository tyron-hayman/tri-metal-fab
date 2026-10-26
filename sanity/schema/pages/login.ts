import { defineField, defineType } from "sanity";

export default defineType({
  name: "loginPage",
  title: "Login Page",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      title: "Content",
      name: "content",
      type: "text",
    }),
    defineField({
      title: "Disclaimer",
      name: "disclaimer",
      type: "string",
    }),
  ],
});
