import { S3Client } from "bun";

const BucketsAvailable = {
  Private: "private",
  Ephemeral: "ephemeral",
} as const;

const getVaultsClients = () => {
  const privateVault = new S3Client({
    endpoint: "https://s3sea.andres6936.dev/",
    accessKeyId: process.env.SEAWEEDFS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SEAWEEDFS_ACCESS_SECRET_KEY,
    bucket: "private",
  });

  const ephemeralVault = new S3Client({
    endpoint: "https://s3sea.andres6936.dev/",
    accessKeyId: process.env.SEAWEEDFS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SEAWEEDFS_ACCESS_SECRET_KEY,
    bucket: "ephemeral",
  });

  return {
    privateVault,
    ephemeralVault,
  };
};

export { BucketsAvailable, getVaultsClients };
