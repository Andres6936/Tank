import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("layout/index.tsx", [
    route("dashboard", "routes/dashboard.tsx", [
      route("documents", "routes/document-home.tsx"),
      route("documents/view/:id", "routes/document-view.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
