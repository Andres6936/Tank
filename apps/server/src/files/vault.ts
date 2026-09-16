import { TypeBucketKeys, type TypeBucketKeysType } from "~/db/enums";
import { getVault } from "~/config/clients-vault";

const writeFile = async (args: {
  Path: string;
  Blob: Blob | ArrayBuffer;
  TypeBucket: TypeBucketKeysType;
}) => {
  const buffer =
    args.Blob instanceof Blob ? await args.Blob.arrayBuffer() : args.Blob;
  const sha256 = Bun.SHA256.hash(buffer, "hex");
  const vault = getVault(args.TypeBucket);
  const bytesWritten = await vault.write(args.Path, buffer);
  return { bytesWritten, sha256 };
};

const privateBucketFn = {
  getLinkFile: async (args: {
    Path: string;
    Name: string;
    Download: boolean;
  }) => {
    const link = getVault(TypeBucketKeys.Private).presign(args.Path, {
      expiresIn: 3500,
      contentDisposition: args.Download
        ? `attachment; filename="${args.Name}"`
        : "inline",
    });
    return link;
  },
  updateFile: async (args: {
    NewPath: string;
    OldPath: string;
    Blob: Blob | ArrayBuffer;
  }) => {
    const privateVault = getVault(TypeBucketKeys.Private);
    const ephemeralVault = getVault(TypeBucketKeys.Ephemeral);

    const isDifferentPath = args.OldPath !== args.NewPath;
    const buffer =
      args.Blob instanceof Blob ? await args.Blob.arrayBuffer() : args.Blob;
    const sha256 = Bun.SHA256.hash(buffer, "hex");
    const promiseWrite = privateVault.write(args.NewPath, buffer);

    if (isDifferentPath) {
      const OldFile = privateVault.file(args.OldPath);
      const [_, result] = await Promise.all([
        ephemeralVault.write(args.OldPath, OldFile),
        promiseWrite,
      ]);
      // Cannot be inside of Promise.all, must be awaited separately
      await OldFile.delete();

      return { sha256, bytesWritten: result };
    } else {
      const bytesWritten = await promiseWrite;
      return { sha256, bytesWritten };
    }
  },

  deleteFile: async (args: { Path: string }) => {
    const privateVault = getVault(TypeBucketKeys.Private);
    const ephemeralVault = getVault(TypeBucketKeys.Ephemeral);

    const file = privateVault.file(args.Path);
    // Cannot use Promise.all here, must be awaited separately for allow
    // write the file in the ephemeral bucket
    await ephemeralVault.write(args.Path, file);
    return await file.delete();
  },
};

export { writeFile, privateBucketFn };
