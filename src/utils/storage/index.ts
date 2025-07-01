import { DiskStorage } from "./disk";
import { IStorageProvider } from "./storage-provider";

let storage: IStorageProvider | null = null;

// Storage provider factory/singleton
export function getStorage(): IStorageProvider {
  if (!storage) {
    const type = process.env.STORAGE_TYPE;

    if (type === "r2") {
      // TODO: Handle R2 storage
      storage = new DiskStorage(process.env.UPLOAD_DIR!);
    } else {
      if (!process.env.UPLOAD_DIR) throw new Error("UPLOAD_DIR is not set");
      storage = new DiskStorage(process.env.UPLOAD_DIR);
    }
  }

  return storage;
}
