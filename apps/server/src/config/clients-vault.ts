import { TypeBucketKeys, type TypeBucketKeysType } from "~/db/enums";

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

const getVault = (type: TypeBucketKeysType) => {
  const { publicVault, privateVault, ephemeralVault } = getVaultsClients();
  switch (type) {
    case TypeBucketKeys.Private:
      return privateVault;
    case TypeBucketKeys.Ephemeral:
      return ephemeralVault;
    case TypeBucketKeys.Public:
      return publicVault;
  }
};

export { getVault };
