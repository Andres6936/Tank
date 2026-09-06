#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if pm2 describe Escriba >/dev/null 2>&1; then
  echo "pm2: reloading app Escriba"
  pm2 reload Escriba --update-env
else
  echo "pm2: app not found, starting it for the first time"
  pm2 start /home/ubuntu/Escriba/execme.sh \
    --name Escriba \
    --interpreter bash \
    --restart-delay 3000 \
    --kill-timeout 10000 \
    --time
fi
pm2 save
