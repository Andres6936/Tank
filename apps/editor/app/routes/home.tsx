import type { Route } from "./+types/home";
import Page from "~/modules/login/pages";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Escriba Sign In" },
    { name: "description", content: "Sign in to Escriba" },
  ];
}

export default function Documents() {
  return <Page />;
}
