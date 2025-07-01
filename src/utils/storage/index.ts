import type { IStorage } from "./storage.interface";
import { R2Storage } from "./r2";
import { DiskStorage } from "./disk";

let storage: IStorage | null = null;

// Storage provider factory/singleton
export function getStorage(): { storage: IStorage; type: "r2" | "disk" } {
  const type = process.env.STORAGE_TYPE as "r2" | "disk";
  if (!type) {
    throw new Error("STORAGE_TYPE environment variable is not set");
  }

  if (!storage) {
    if (type === "r2") {
      storage = new R2Storage();
    } else if (type === "disk") {
      storage = new DiskStorage();
    } else {
      throw new Error(
        `Invalid storage type: ${type}. Set STORAGE_TYPE environment variable to "r2" or "disk"`
      );
    }
  }

  return { storage, type };
}
