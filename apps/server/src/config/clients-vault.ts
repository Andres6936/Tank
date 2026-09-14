const BucketsAvailable = {
  Private: "private",
  Ephemeral: "ephemeral",
} as const;

const getVaultsClients = () => {
  const publicVault = new Bun.S3Client({
    endpoint: process.env.R2_PUBLIC_ENDPOINT,
    accessKeyId: process.env.R2_PUBLIC_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_PUBLIC_ACCESS_SECRET_KEY,
    bucket: "public",
  });

  const privateVault = new Bun.S3Client({
    endpoint: "https://s3sea.andres6936.dev/",
    accessKeyId: process.env.SEAWEEDFS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SEAWEEDFS_ACCESS_SECRET_KEY,
    bucket: "private",
  });

  const ephemeralVault = new Bun.S3Client({
    endpoint: "https://s3sea.andres6936.dev/",
    accessKeyId: process.env.SEAWEEDFS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SEAWEEDFS_ACCESS_SECRET_KEY,
    bucket: "ephemeral",
  });

  return {
    publicVault,
    privateVault,
    ephemeralVault,
  };
};

export { BucketsAvailable, getVaultsClients };
