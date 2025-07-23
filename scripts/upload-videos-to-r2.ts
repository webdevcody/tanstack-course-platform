#!/usr/bin/env tsx

import "dotenv/config";
import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";
import { R2Storage } from "../src/utils/storage/r2.js";

const BACKUPS_DIR = "./backups/videos";
const BUCKET_NAME = "beginner-react-challenges";

function formatFileSize(bytes: number): string {
  const sizes = ["B", "KB", "MB", "GB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
}

function createProgressBar(
  current: number,
  total: number,
  width: number = 30
): string {
  const percentage = Math.round((current / total) * 100);
  const filled = Math.round((width * current) / total);
  const empty = width - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);
  return `[${bar}] ${percentage}%`;
}

async function uploadVideosToR2() {
  try {
    console.log("🚀 Starting video upload to R2...");

    // Initialize R2 storage
    const r2Storage = new R2Storage();

    // Read all files in the backups/videos directory
    const files = await readdir(BACKUPS_DIR);
    const videoFiles = files.filter((file) => file.endsWith(".mp4"));

    console.log(`📁 Found ${videoFiles.length} video files to process`);

    let uploadedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    let totalSize = 0;
    let uploadedSize = 0;

    // Calculate total size first
    for (const file of videoFiles) {
      const filePath = join(BACKUPS_DIR, file);
      const stats = await stat(filePath);
      totalSize += stats.size;
    }

    console.log(`📊 Total size to upload: ${formatFileSize(totalSize)}`);

    for (let i = 0; i < videoFiles.length; i++) {
      const file = videoFiles[i];
      try {
        // Extract the key (filename without .mp4 extension)
        const key = file.replace(".mp4", "");
        const filePath = join(BACKUPS_DIR, file);

        // Get file size for progress
        const stats = await stat(filePath);
        const fileSize = stats.size;

        // Check if file already exists in R2
        const exists = await r2Storage.exists(key);

        if (exists) {
          console.log(
            `⏭️  Skipping ${file} (${formatFileSize(fileSize)}) - already exists in R2 as ${key}`
          );
          skippedCount++;
          continue;
        }

        // Show progress bar for overall progress
        const progressBar = createProgressBar(i + 1, videoFiles.length);
        console.log(`\n📤 [${i + 1}/${videoFiles.length}] ${progressBar}`);
        console.log(`📁 File: ${file} (${formatFileSize(fileSize)})`);
        console.log(`🔑 Key: ${key}`);
        console.log(`⏳ Starting upload...`);
        console.log(); // Add empty line for progress display

        // Read the file
        const fileBuffer = await readFile(filePath);

        // Upload to R2 with progress tracking
        let lastProgressPercentage = 0;
        await r2Storage.uploadWithProgress(key, fileBuffer, (progress) => {
          // Only update if progress has changed significantly
          if (progress.percentage > lastProgressPercentage) {
            process.stdout.write("\r");
            const fileProgressBar = createProgressBar(
              progress.percentage,
              100,
              25
            );
            const loadedMB = (progress.loaded / 1024 / 1024).toFixed(1);
            const totalMB = (progress.total / 1024 / 1024).toFixed(1);
            const progressText = `📁 File Progress: ${fileProgressBar} ${progress.percentage}% (${loadedMB}/${totalMB} MB)`;
            process.stdout.write(progressText);
            lastProgressPercentage = progress.percentage;
          }
        });

        // Clear the progress line and move to next line
        process.stdout.write("\n");

        uploadedSize += fileSize;
        const sizeProgress = formatFileSize(uploadedSize);
        const sizeTotal = formatFileSize(totalSize);

        console.log(`\n✅ Successfully uploaded ${file} as ${key}`);
        console.log(`📊 Overall Progress: ${sizeProgress} / ${sizeTotal}`);
        uploadedCount++;
      } catch (error) {
        console.error(`❌ Failed to upload ${file}:`, error);
        failedCount++;
      }
    }

    console.log("\n📊 Upload Summary:");
    console.log(
      `✅ Successfully uploaded: ${uploadedCount} files (${formatFileSize(uploadedSize)})`
    );
    console.log(`⏭️  Skipped (already exists): ${skippedCount} files`);
    console.log(`❌ Failed uploads: ${failedCount} files`);
    console.log(`📁 Total files processed: ${videoFiles.length}`);
    console.log(`📊 Total size processed: ${formatFileSize(totalSize)}`);
  } catch (error) {
    console.error("💥 Error during upload process:", error);
    process.exit(1);
  }
}

// Run the upload function
uploadVideosToR2();
