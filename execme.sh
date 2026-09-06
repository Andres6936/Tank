#!/bin/bash

# Define the absolute path to the directory where the Escriba proyect is located.
# Replace this with the actual path on your Oracle VPS.
ESCRIBA_DIR="/home/ubuntu/Escriba"

# Navigate to the directory or exit immediately if the directory does not exist.
cd "$ESCRIBA_DIR" || { echo "Directory not found"; exit 1; }

export NODE_ENV=production

# Execute the Escriba server.
# The 'exec' command ensures the Escriba process replaces the current Bash shell,
# making it easier for process managers to handle it cleanly.
exec bun run start
