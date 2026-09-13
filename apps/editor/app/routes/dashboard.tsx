import type { Route } from "./+types/dashboard";
import Page from "~/modules/documents/pages";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard" }, { name: "description", content: "Welcome!" }];
}

export default function Dashboard() {
  return <Page />;
}
