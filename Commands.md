### Commands

```bash
ssh ubuntu@143.47.125.244 -i C:\Users\Saturno\.ssh\OracleVPS.key
```

### 1. Configure Swap Memory

By default, OCI Ubuntu images do not include Swap space. Run the following
commands to create a **2 GB** swap file, providing a crucial safety
net for the physical RAM:

```bash
# Create a 2GB file for virtual memory
sudo fallocate -l 2G /swapfile

# Set secure system permissions
sudo chmod 600 /swapfile

# Format the file into swap space
sudo mkswap /swapfile

# Activate the swap file immediately
sudo swapon /swapfile

# Make the change permanent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 2. Disable Tracking and Telemetry Services

The Oracle monitoring agent and the Snap daemon consume between 200 MB and 300 MB
of background RAM. Stop and disable these services to reclaim critical memory
for the web application:

```bash
# Stop and disable Oracle Cloud telemetry agents (Snap)
sudo systemctl stop snap.oracle-cloud-agent.oracle-cloud-agent.service
sudo systemctl disable snap.oracle-cloud-agent.oracle-cloud-agent.service

sudo systemctl stop snap.oracle-cloud-agent.oracle-cloud-agent-updater.service
sudo systemctl disable snap.oracle-cloud-agent.oracle-cloud-agent-updater.service

# Disable the Snap daemon to prevent background resource spikes
sudo systemctl stop snapd.service snapd.socket
sudo systemctl disable snapd.service snapd.socket
```

_Note: Disabling these services stops performance metrics from displaying in the
OCI web console dashboard, but it drastically improves VPS stability._

### Install Node

## Install Fontconfig

```bash
sudo apt-get update
sudo apt-get install -y fontconfig
```

### Install Caddy

Please follow the instructions below: [See](https://caddyserver.com/docs/install#debian-ubuntu-raspbian)

Create new Ingress Rules in VPC Oracle:

- Source CIDR: 0.0.0.0/0
- IP Protocol: TCP
- Destination Port Range: 80

- Source CIDR: 0.0.0.0/0
- IP Protocol: TCP
- Destination Port Range: 443

```bash
# Open port 80 (HTTP) for incoming traffic
sudo iptables -I INPUT 5 -m state --state NEW -p tcp --dport 80 -j ACCEPT

# Open port 443 (HTTPS) for incoming traffic
sudo iptables -I INPUT 5 -m state --state NEW -p tcp --dport 443 -j ACCEPT

# Save the iptables rules so they persist after a server reboot
sudo netfilter-persistent save
```

# Verify the service is active and running without errors

```bash
sudo systemctl status caddy
```

# Restart the service (useful after modifying the Caddyfile manually)

```bash
sudo systemctl restart caddy
sudo systemctl reload caddy
```

### Problems Connecting to Caddy, See

#### Oracle Cloud Ubuntu: iptables REJECT Rule Blocking Web Traffic

##### The Problem

Oracle Cloud's default Ubuntu images include a strict `iptables` firewall configuration.
By default, there is a `REJECT` rule (typically around line 5) that drops all
incoming traffic that has not been explicitly allowed.

Because `iptables` processes rules from top to bottom, if you append new `ACCEPT` rules
for ports 80 (HTTP) and 443 (HTTPS) below this `REJECT` rule, the server will drop the web
traffic before ever reading your allow rules. This results in a "Connection Timeout" error
on the client side, even if the Oracle Cloud VCN (Virtual Cloud Network) Security Lists
are correctly configured.

##### How to Detect It

To verify if your rules are in the wrong order, list the current `INPUT` chain rules with
their corresponding line numbers:

```bash
sudo iptables -L INPUT -n --line-numbers
```

Look at the output. If the rule targeting REJECT with the description reject-with
icmp-host-prohibited has a lower line number (e.g., 5) than your ACCEPT rules for dpt:80 a
nd dpt:443 (e.g., 6 and 7), the firewall is blocking the traffic.

##### The Solution

To fix this permanently and avoid hardcoding line numbers that might change across different
server instances, use a dynamic script. This script searches for the exact line number of the
REJECT rule and inserts the web traffic ACCEPT rules exactly at that position, pushing the REJECT rule down.

```bash
# 1. Dynamically find the exact line number of the REJECT rule
REJECT_LINE=$(sudo iptables -L INPUT -n --line-numbers | awk '/reject-with icmp-host-prohibited/ {print $1}' | head -n 1)

# 2. If the REJECT rule exists, use its line number. Otherwise, default to 1 (top of the chain).
POSITION=${REJECT_LINE:-1}

# 3. Insert the HTTP (80) rule at the found position
sudo iptables -I INPUT $POSITION -m state --state NEW -p tcp --dport 80 -j ACCEPT

# 4. Insert the HTTPS (443) rule at the same position
# (This pushes the HTTP rule and the REJECT rule further down)
sudo iptables -I INPUT $POSITION -m state --state NEW -p tcp --dport 443 -j ACCEPT

# 5. Persist the updated firewall rules to survive reboots
sudo netfilter-persistent save
```

##### Example Correct Output

```bash
sudo iptables -L INPUT -n --line-numbers
```

```
Chain INPUT (policy ACCEPT)
num target prot opt source destination
1 ACCEPT 0 -- 0.0.0.0/0 0.0.0.0/0 state RELATED,ESTABLISHED
2 ACCEPT 1 -- 0.0.0.0/0 0.0.0.0/0
3 ACCEPT 0 -- 0.0.0.0/0 0.0.0.0/0
4 ACCEPT 6 -- 0.0.0.0/0 0.0.0.0/0 state NEW tcp dpt:22
5 ACCEPT 6 -- 0.0.0.0/0 0.0.0.0/0 state NEW tcp dpt:443
6 ACCEPT 6 -- 0.0.0.0/0 0.0.0.0/0 state NEW tcp dpt:80
7 REJECT 0 -- 0.0.0.0/0 0.0.0.0/0 reject-with icmp-host-prohibited
```

#### Modify the Caddy File

Command: `sudo nano /etc/caddy/Caddyfile`

```caddy
vault.andres6936.dev {
    # Assuming your S3 service runs on port 9000
    reverse_proxy localhost:9000
}

turso.andres6936.dev {
    # Routing traffic to your Turso sqld fork running on port 8080
    reverse_proxy localhost:8080
}
```

#### OpenTelemetry Tracing with PostHog (Caddy)

This project uses Caddy's native OpenTelemetry integration to export distributed traces directly to **PostHog** using OTLP over HTTP.

##### 1. Environment Variables Configuration (Systemd)

Since Caddy runs as an isolated systemd service, the OpenTelemetry variables must be injected using a systemd override drop-in file instead of global profile files.

To view or edit these variables on the VPS, run:

```bash
sudo systemctl edit caddy
```

Ensure the configuration block looks exactly like this (replace `YOUR_POSTHOG_PROJECT_TOKEN` with your actual token):

```ini
[Service]
Environment="OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=https://us.i.posthog.com/i/v1/traces"
Environment="OTEL_EXPORTER_OTLP_TRACES_PROTOCOL=http/protobuf"
Environment="OTEL_EXPORTER_OTLP_TRACES_HEADERS=Authorization=Bearer YOUR_POSTHOG_PROJECT_TOKEN"
Environment="OTEL_SERVICE_NAME=Caddy-Server"
```

After updating variables, reload systemd and restart the web server:

```bash
sudo systemctl daemon-reload
sudo systemctl restart caddy
```

##### 2. Caddyfile Integration

To enable tracing for specific sites or API gateways, add the `tracing` directive inside your site block in `/etc/caddy/Caddyfile`:

```text
yourdomain.com {
    # Enable OpenTelemetry request tracing
    tracing {
        span "caddy-http-request"
    }

    # Your standard site configuration (e.g., reverse proxy)
    reverse_proxy localhost:3000
}
```

Validate and safely reload Caddy without downtime:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

#### Modify the Register DNS from Cloudflare (Squaredomain had Cloudflare Nameservers)

### Install Fork SQLite (Turso)

Generate a private key and public key pair for JWT authentication:

```typescript
import { generateKeyPairSync } from "crypto";
const { publicKey, privateKey } = generateKeyPairSync("ed25519");

// Export private key in PKCS#8 PEM format
const privPem = privateKey.export({ format: "pem", type: "pkcs8" });
await Bun.write("private.pem", privPem);

// Export public key in SPKI PEM format
const pubPem = publicKey.export({ format: "pem", type: "spki" });
await Bun.write("public.pem", pubPem);
```

#### Download Extensions

```bash
curl -OL https://github.com/nalgeon/sqlean/releases/download/0.28.1/sqlean-linux-x64.zip
```

Create a trusted extensions list file (`trusted.lst`) and add the extensions you
want to trust, the file should be containing the sha256 and name of each extension,
one per line.

```
02de1662cfeb91ba89e9b75158c085650f819f546508044d6d8f98456c8328bf  uuid.so
```

Script used for execute the binary:

```bash
#!/bin/bash

# Define the absolute path to the directory where the Turso binary is located.
# Replace this with the actual path on your Oracle VPS.
TURSO_DIR="/home/ubuntu/Turso"

# Navigate to the directory or exit immediately if the directory does not exist.
cd "$TURSO_DIR" || { echo "Directory not found"; exit 1; }

# Execute the Turso server.
# The 'exec' command ensures the Vault process replaces the current Bash shell,
# making it easier for process managers to handle it cleanly.
exec ./sqld --auth-jwt-key-file public.pem --extensions-path ./extensions
```

Apply the permissions to make the script executable:

```bash
chmod +x execme.sh
```

### Install S3 Lightweight (Vault)

Script used for execute the binary:

```bash
#!/bin/bash

# Define the absolute path to the directory where the Vault binary is located.
# Replace this with the actual path on your Oracle VPS.
VAULT_DIR="/home/ubuntu/Vault"

# Navigate to the directory or exit immediately if the directory does not exist.
cd "$VAULT_DIR" || { echo "Directory not found"; exit 1; }

# Execute the Vault server.
# The 'exec' command ensures the Vault process replaces the current Bash shell,
# making it easier for process managers to handle it cleanly.
exec ./vault -config config.yml
```

Apply the permissions to make the script executable:

```bash
chmod +x execme.sh
```
