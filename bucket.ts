import { S3Client } from "bun";

const client = new S3Client({
  endpoint: "https://vault.andres6936.dev/",
  accessKeyId: "vaults3-admin",
  secretAccessKey: "vaults3-secret-change-me",
  bucket: "private",
  // sessionToken: "..."
  // acl: "public-read",
  // endpoint: "https://<account-id>.r2.cloudflarestorage.com", // Cloudflare R2
  // endpoint: "https://<region>.digitaloceanspaces.com", // DigitalOcean Spaces
  // endpoint: "http://localhost:9000", // MinIO
});

const file = client.file("Hello-2.txt");
await file.write("Hello, World!");

const download = client.presign("Hello-2.txt", {
  expiresIn: 3500,
  contentDisposition: 'attachment; filename="hello-2.txt"',
});

console.log(download);
