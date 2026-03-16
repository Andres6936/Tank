import { S3Client } from "bun";

const client = new S3Client({
  endpoint: "https://s3sea.andres6936.dev/",
  accessKeyId: process.env.SEAWEEDFS_ACCESS_KEY_ID,
  secretAccessKey: process.env.SEAWEEDFS_ACCESS_SECRET_KEY,
  bucket: "private",
  // sessionToken: "..."
  // acl: "public-read",
});

const file = client.file("Hello-2.txt");
await file.write("Hello, World!");

const download = client.presign("Hello-2.txt", {
  expiresIn: 3500,
  contentDisposition: 'attachment; filename="hello-2.txt"',
});

console.log(download);
