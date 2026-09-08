# Escriba

Monorepo for the Escriba platform, managed with [Bun](https://bun.sh) workspaces.

## Repository layout

```
apps/
  documents/   @escriba/documents – document/PDF rendering service (Bun.serve)
  editor/      editor – React Router web app (deployed to GitHub Pages)
  server/      @escriba/server – main API + background worker (Bun.serve + openworkflow)
scripts/       standalone internal tooling (NOT a workspace; has its own bun.lock)
deploy.ts      remote deploy steps executed on the VPS by the CI
execme.sh      pm2 entry point used on the VPS (runs `bun run start`)
```

## Local development

Bun is the only runtime. Use the version pinned in `packageManager` (`bun@1.4.0`).

```bash
bun install            # from the repo root only
bun run dev            # runs `dev` in every workspace in parallel
```

> **Single lockfile rule:** this is a monorepo, so there is exactly **one** `bun.lock`,
> at the root. Never run `bun install` inside `apps/*` — it would create a nested
> `bun.lock` + `node_modules` that shadows the root install and causes version drift
> between local development and the CI (this happened with `@xmldom/xmldom`).
> `scripts/` is the exception: it is not a workspace and keeps its own lockfile.

The root `start` script runs both services in parallel (used by the VPS):

```bash
bun run --parallel --filter @escriba/server --filter @escriba/documents start
```

## Production architecture

```mermaid
flowchart LR
    GH[GitHub Actions<br/>deploy-vps.yml] -->|SSH| VPS
    subgraph VPS
        BASH[bash: git fetch + reset<br/>to the pushed commit] --> DEPLOY[bun deploy.ts]
        DEPLOY --> INSTALL[bun install --production]
        DEPLOY --> ENV[write .env files<br/>from GitHub Secrets]
        DEPLOY --> PM2[pm2 reload Escriba]
        PM2 --> SERVER[@escriba/server :3000]
        PM2 --> DOCS[@escriba/documents]
    end
    CADDY[Caddy] --> SERVER
    CADDY --> DOCS
    EDITOR[GitHub Pages<br/>editor] -.-> CADDY
```

- **Host:** Oracle Cloud VPS. The repo is cloned at a fixed
  path (`APP_DIR`, default `$HOME/Escriba`).
- **Process manager:** pm2 with a single app named `Escriba`, which runs
  `execme.sh` → `bun run start`. That starts `@escriba/server` (API + worker) and
  `@escriba/documents` in parallel.
- **Reverse proxy:** Caddy fronts the services:
  - `escriba.andres6936.dev` → `@escriba/server` (port from `SERVER_PORT`)
  - `preview.andres6936.dev` → `@escriba/documents` (port from `SERVER_PORT`)
  - the `editor` is published to GitHub Pages by `main.yml` (not part of this deploy).
- **Env files:** Bun auto-loads `.env` from the **working directory of each service**
  (`apps/server/.env` and `apps/documents/.env`). The CI writes those files from
  GitHub Secrets on every deploy. They are gitignored and never committed.

### Why the CI is split between bash and Bun

The remote script in `.github/workflows/deploy-vps.yml` intentionally keeps a **minimal
bash bootstrap** (`cd` + `git fetch` + `git reset --hard` + `exec bun run deploy.ts`)
and moves every other step to **`deploy.ts`**:

- `deploy.ts` lives **inside the repo**, so the repo must first be synced to the exact
  commit being deployed before its own code is executed (the same reason GitHub runs
  the workflow YAML from the pushed ref).
- Bash ends up ~10 lines; the quoting-prone logic (install, `.env` injection, pm2
  refresh) is plain Bun code using `Bun.$` safe argv.

`deploy.ts` performs, in order:

1. `bun install --production --frozen-lockfile`
2. Decode `SERVER_ENV_B64` / `DOCUMENTS_ENV_B64` and write `apps/server/.env` and
   `apps/documents/.env` (mode `600`). Missing secrets leave existing files untouched.
3. `pm2 reload Escriba --update-env` if the app exists, otherwise
   `pm2 start ./execme.sh --name Escriba` and `pm2 save`.

## GitHub configuration

The workflow reads two kinds of settings. Connection data that is not sensitive can be
**variables**; anything that must stay private must be a **secret**.

### Secrets (Settings → Secrets and variables → Actions)

| Secret          | Description                                             | Notes                                                                                                                |
| --------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `VPS_SSH_KEY`   | Private SSH key used by the runner to reach the VPS     | Full file contents (`BEGIN`…`END`), **LF** line endings, no passphrase                                               |
| `SERVER_ENV`    | Full contents of `apps/server/.env`                     | Raw, **multiline**, NOT base64                                                                                       |
| `DOCUMENTS_ENV` | Full contents of `apps/documents/.env`                  | Raw, multiline, NOT base64                                                                                           |
| `EDITOR_ENV`    | Full contents of `apps/editor/.env` for the Pages build | Raw, multiline; written by `main.yml` to `apps/editor/.env` before the build. Use the **public** URLs, not localhost |
| `VPS_HOST_KEY`  | (optional) VPS host key for `known_hosts`               | Output of `ssh-keyscan -t rsa,ed25519 <host>`                                                                        |

### Variables

| Variable   | Default           | Description                 |
| ---------- | ----------------- | --------------------------- |
| `VPS_HOST` | —                 | VPS IP or hostname          |
| `VPS_USER` | —                 | SSH user (e.g. `ubuntu`)    |
| `VPS_PORT` | `22`              | SSH port                    |
| `APP_DIR`  | `$HOME/Escriba`   | Fixed clone path on the VPS |
| `BRANCH`   | triggering branch | Git ref synced on the VPS   |
| `PM2_APP`  | `Escriba`         | pm2 app name                |

Example setup with the GitHub CLI:

```bash
# Secrets
gh secret set VPS_SSH_KEY < ~/.ssh/OracleVPS.key
gh secret set SERVER_ENV    --body "$(cat apps/server/.env)"
gh secret set DOCUMENTS_ENV --body "$(cat apps/documents/.env)"
gh secret set EDITOR_ENV --body "$(cat apps/editor/.env)"
gh secret set VPS_HOST_KEY  --body "$(ssh-keyscan -t rsa,ed25519 143.47.125.244 2>$null)"

# Variables
gh variable set VPS_HOST --body "127.0.0.1"
gh variable set VPS_USER --body "ubuntu"
gh variable set VPS_PORT --body "22"
gh variable set APP_DIR  --body "/home/ubuntu/Escriba"
```

### Recommendations

- **Store `.env` contents raw.** The workflow base64-encodes them at runtime only to
  transport them safely over SSH. Storing base64 would make editing/rotating painful and
  would not be masked in logs if ever printed.
- **Do not include quotes or trailing whitespace** when pasting secrets/variables; the
  workflow trims whitespace/quotes defensively, but clean values are easier to debug.
- **Never `echo` a secret or its base64** in a workflow step — GitHub only masks the
  exact raw value, not derived forms.
- GitHub Secrets are limited to **48 KB per value / 100 per repo or environment**.
  Scope `SERVER_ENV`/`DOCUMENTS_ENV` to an **Environment** if you later add staging.
- Secrets only exist in the runner at runtime: this repo is **public**, so never commit
  `.env`, keys, or derived values anywhere.

## Workflow triggers

`.github/workflows/deploy-vps.yml` runs on:

- pushes to `master` (production), path-filtered to the services,
  lockfiles, `deploy.ts` or the workflow itself;
- manual runs via _Actions → Deploy services to VPS → Run workflow_ (pick any branch).

A `concurrency` group guarantees only one deploy runs at a time.

## One-time VPS setup

```bash
# 1. Clone the repo at the fixed path
git clone git@github.com:Andres6936/Tank.git ~/Escriba

# 2. Make Bun and pm2 available to login AND non-interactive shells.
#    Add to ~/.profile (not only ~/.bashrc, which non-interactive shells skip):
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.profile
#    If pm2 lives under another Node install (nvm), add that bin dir too.

# 3. Native deps used by @escriba/documents (canvas needs fontconfig + fonts)
sudo apt-get update
sudo apt-get install -y fontconfig

# 4. Install pm2 and persist it
npm install -g pm2            # or: bun add -g pm2
pm2 start ~/Escriba/execme.sh --name Escriba --interpreter bash --restart-delay 3000 --kill-timeout 10000 --time
pm2 save
pm2 startup                   # enable boot persistence

# 5. Caddy reverse proxy (example; adapt ports to your .env)
#    sudo nano /etc/caddy/Caddyfile
```

```caddy
escriba.andres6936.dev {
    reverse_proxy 127.0.0.1:3000 # the documents SERVER_PORT from its .env
}

preview.andres6936.dev {
    reverse_proxy 127.0.0.1:3001   # the documents SERVER_PORT from its .env
}
```

See `Commands.md` for the Oracle VPS firewall (iptables) notes and other services.
