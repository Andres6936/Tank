import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("layout/index.tsx", [
    index("routes/home.tsx"),
    route("documents", "routes/documents.tsx", []),
  ]),
] satisfies RouteConfig;
