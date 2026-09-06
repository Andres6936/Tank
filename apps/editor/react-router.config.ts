import type { Config } from "@react-router/dev/config";

export default {
  basename: process.env.GITHUB_ACTIONS
    ? `/${process.env.GITHUB_REPOSITORY_NAME}/`
    : "/",
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
} satisfies Config;
