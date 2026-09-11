const OUTPUT_FILE = "/etc/caddy/TrustedCloudflare";

try {
  const [resV4, resV6] = await Promise.all([
    fetch("https://www.cloudflare.com/ips-v4"),
    fetch("https://www.cloudflare.com/ips-v6"),
  ]);

  if (!resV4.ok || !resV6.ok)
    throw new Error("Error al descargar las IPs de Cloudflare");

  const ipv4 = await resV4.text();
  const ipv6 = await resV6.text();

  const allIps = `${ipv4}\n${ipv6}`
    .split("\n")
    .map((ip) => ip.trim())
    .filter((ip) => ip.length > 0)
    .join(" ");

  const caddyConfig = `trusted_proxies static ${allIps}\n`;

  await Bun.write(OUTPUT_FILE, caddyConfig);
  console.log(
    `[${new Date().toISOString()}] IPs de Cloudflare guardadas correctamente.`,
  );

  const process = Bun.spawn([
    "caddy",
    "reload",
    "--config",
    "/etc/caddy/Caddyfile",
  ]);
  await process.exited;

  if (process.exitCode === 0) {
    console.log("Caddy se ha recargado con éxito.");
  } else {
    console.error("Error al recargar Caddy. Revisa la sintaxis del Caddyfile.");
  }
} catch (error) {
  console.error("Ocurrió un error durante la ejecución:", error);
  process.exit(1);
}
