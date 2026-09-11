// Bun deploy script, executed on the VPS by the CI after the repository has
// been synced to the target commit (see .github/workflows/deploy-vps.yml).
// It must be run from the repository root with Bun.
//
// Optional env vars:
//   SERVER_ENV_B64     base64 content of apps/server/.env
//   DOCUMENTS_ENV_B64  base64 content of apps/documents/.env
//   PM2_APP            pm2 app name (default: "Escriba")

import { $ } from "bun";
import { Buffer } from "node:buffer";
import { chmod, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = process.cwd();
const PM2_APP = process.env.PM2_APP ?? "Escriba";

const log = (message: string) => console.log(`[deploy] ${message}`);

async function writeEnvFile(b64: string | undefined, relPath: string) {
  const dest = resolve(ROOT, relPath);
  if (!b64) {
    log(`no secret set; keeping existing ${relPath}`);
    return;
  }
  await writeFile(dest, Buffer.from(b64, "base64"));
  await chmod(dest, 0o600);
  log(`updated ${relPath}`);
}

// 1. Install production dependencies --------------------------------
log("running: bun install --production --frozen-lockfile");
await $`bun install --production --frozen-lockfile`;
await $`bun dedupe`;

// 2. Inject .env files (paths follow each service cwd) --------------
await writeEnvFile(process.env.SERVER_ENV_B64, "apps/server/.env");
await writeEnvFile(process.env.DOCUMENTS_ENV_B64, "apps/documents/.env");

// 3. Refresh pm2 -----------------------------------------------------
const describe = await $`pm2 describe ${PM2_APP}`.quiet().nothrow();
if (describe.exitCode === 0) {
  log(`reloading pm2 app ${PM2_APP}`);
  await $`pm2 reload ${PM2_APP} --update-env`;
} else {
  log(`pm2 app ${PM2_APP} not found, starting it for the first time`);
  await $`pm2 start ${resolve(ROOT, "execme.sh")} --name ${PM2_APP} --interpreter bash --restart-delay 3000 --kill-timeout 10000 --time`;
}
await $`pm2 save`;
await $`sudo bun run trusted.ts`;

log("Deployment completed");
