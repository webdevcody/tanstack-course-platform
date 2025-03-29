import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs/promises";

export async function saveFile(key: string, file: Buffer | File) {
  const uploadDir = process.env.UPLOAD_DIR;

  if (!uploadDir) {
    throw new Error("UPLOAD_DIR environment variable is not set");
  }

  // Convert the input to a Buffer if it's a File
  const fileBuffer =
    file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;

  // Create the file path
  const filePath = path.join(uploadDir, key);

  try {
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Write the file
    await writeFile(filePath, fileBuffer);

    return key;
  } catch (error) {
    console.error(`Error saving file ${key}:`, error);
    throw new Error(
      `Failed to save file: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function getFile(key: string) {
  const uploadDir = process.env.UPLOAD_DIR;

  if (!uploadDir) {
    throw new Error("UPLOAD_DIR environment variable is not set");
  }

  const filePath = path.join(uploadDir, key);

  try {
    const fileContent = await fs.readFile(filePath);
    return fileContent;
  } catch (error) {
    console.error(`Error reading file ${key}:`, error);
    throw new Error(
      `Failed to read file: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function deleteFile(key: string) {
  const uploadDir = process.env.UPLOAD_DIR;

  if (!uploadDir) {
    throw new Error("UPLOAD_DIR environment variable is not set");
  }

  const filePath = path.join(uploadDir, key);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting file ${key}:`, error);
  }
}
