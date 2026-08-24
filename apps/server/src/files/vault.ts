import { getVaultsClients } from "../config/clients-vault";

const { privateVault, ephemeralVault } = getVaultsClients();

const getLinkFile = async (args: { Path: string; Name: string }) => {
  const link = privateVault.presign(args.Path, {
    expiresIn: 3500,
    contentDisposition: `attachment; filename="${args.Name}"`,
  });
  return link;
};

const writeFile = async (args: { Path: string; Blob: Blob | ArrayBuffer }) => {
  return await privateVault.write(
    args.Path,
    args.Blob instanceof Blob ? await args.Blob.arrayBuffer() : args.Blob,
  );
};

const updateFile = async (args: {
  NewPath: string;
  OldPath: string;
  Blob: Blob | ArrayBuffer;
}) => {
  const isDifferentPath = args.OldPath !== args.NewPath;
  const buffer =
    args.Blob instanceof Blob ? await args.Blob.arrayBuffer() : args.Blob;
  const promiseWrite = privateVault.write(args.NewPath, buffer);

  if (isDifferentPath) {
    const OldFile = privateVault.file(args.OldPath);
    const [_, result] = await Promise.all([
      ephemeralVault.write(args.OldPath, OldFile),
      promiseWrite,
    ]);
    // Cannot be inside of Promise.all, must be awaited separately
    await OldFile.delete();

    return result;
  } else {
    return await promiseWrite;
  }
};

const deleteFile = async (args: { Path: string }) => {
  const file = privateVault.file(args.Path);
  // Cannot use Promise.all here, must be awaited separately for allow
  // write the file in the ephemeral bucket
  await ephemeralVault.write(args.Path, file);
  return await file.delete();
};

export { getLinkFile, writeFile, updateFile, deleteFile };
