import type { Route } from "./+types/home";
import Page from "~/modules/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Home" }, { name: "description", content: "Welcome!" }];
}

export default function Home() {
  return <Page />;
}
