import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import * as fs from "fs";
import { MPUType } from "./types";

async function upload(config: MPUType) {
  // Initialize S3Client
  const s3Client = new S3Client({ region: "us-east-1" });

  // Define the parameters for the upload
  const bucketName = "bronifty-sst";
  const keyName = "Archive.zip";
  const fileBody = fs.createReadStream("/Users/bro/Downloads/Archive01.zip"); // Node.js file stream

  try {
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: keyName,
        Body: fileBody,
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
