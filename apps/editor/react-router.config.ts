import type { Config } from "@react-router/dev/config";

export default {
  // Disabled basename logic because the CNAME is already set to `editor.andres6936.dev`
  // basename: process.env.GITHUB_ACTIONS
  //   ? `/${process.env.GITHUB_REPOSITORY_NAME}/`
  //   : "/",
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
} satisfies Config;
