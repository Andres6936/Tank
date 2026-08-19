import type { Route } from "./+types/home";
import Page from "~/modules/documents/pages";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Documents" }, { name: "description", content: "Welcome!" }];
}

export default function Documents() {
  return <Page />;
}
