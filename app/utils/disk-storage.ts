import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs/promises";
import { createReadStream } from "fs";
import { Readable } from "stream";

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

export async function getFile(key: string): Promise<Readable> {
  const uploadDir = process.env.UPLOAD_DIR;

  if (!uploadDir) {
    throw new Error("UPLOAD_DIR environment variable is not set");
  }

  const filePath = path.join(uploadDir, key);

  try {
    // Check if file exists first
    await fs.access(filePath);

    // Create a readable stream with options
    const fileStream = createReadStream(filePath, {
      // Add a reasonable high water mark (buffer size)
      highWaterMark: 1024 * 1024, // 1MB
    });

    // Handle stream errors
    fileStream.on("error", (error) => {
      console.error(`Stream error for file ${key}:`, error);
      fileStream.destroy();
    });

    return fileStream;
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
    // Check if file exists first
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting file ${key}:`, error);
    // Re-throw the error to let the caller handle it
    throw new Error(
      `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
