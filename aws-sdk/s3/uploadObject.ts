import { Upload } from "@aws-sdk/lib-storage";
import { MPUType } from "./types";
import { createS3Client } from ".";

async function uploadObject(config: MPUType) {
  // Initialize S3Client
  const s3Client = createS3Client(config.profile);
  const { bucket, key, readable } = config;

  try {
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: readable,
      },
      queueSize: 4, // Adjust based on your concurrency needs
      partSize: 1024 * 1024 * 5, // 5 MB
      leavePartsOnError: false, // Set to true if you want to manually handle failed parts
    });

    parallelUploads3.on("httpUploadProgress", (progress) => {
      console.log(`Uploaded ${progress.loaded} out of ${progress.total} bytes`);
    });

    await parallelUploads3.done();
    console.log("Upload completed successfully");
  } catch (e) {
    console.error("Upload failed:", e);
  }
}

export { uploadObject };
