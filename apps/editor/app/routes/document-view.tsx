import type { Route } from "./+types/document-view";
import Page from "~/modules/documents/pages/view";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Documents" }, { name: "description", content: "Welcome!" }];
}

export default function Documents({ params }: Route.ComponentProps) {
  return <Page Id={params.id} />;
}
