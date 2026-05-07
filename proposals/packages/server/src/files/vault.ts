import { getVaultsClients } from "../config/clients";

const { privateVault, ephemeralVault } = getVaultsClients();

const writeFile = async (args: { Path: string; Blob: Blob }) => {
  return await privateVault.write(args.Path, await args.Blob.arrayBuffer());
};

const updateFile = async (args: {
  NewPath: string;
  OldPath: string;
  Blob: Blob;
}) => {
  const isDifferentPath = args.OldPath !== args.NewPath;
  const buffer = await args.Blob.arrayBuffer();
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

export { writeFile, updateFile, deleteFile };
