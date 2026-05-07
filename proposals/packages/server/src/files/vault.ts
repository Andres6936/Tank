import { getVaultsClients } from "../config/clients";

const { privateVault, ephemeralVault } = getVaultsClients();

const writeFile = async (args: { Path: string; Blob: Blob }) => {
  privateVault.write(args.Path, await args.Blob.arrayBuffer());
};

export { writeFile };
