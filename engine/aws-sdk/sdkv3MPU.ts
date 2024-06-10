import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import * as fs from "fs";
import { MPUType } from "./types";

async function mpu(config: MPUType) {
  // Initialize S3Client
  const s3Client = new S3Client({ region: "us-east-1" });
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

const config = {
  profile: "sst",
  bucket: "bronifty-sst",
  key: "Archive.zip",
  filepath: "/Users/bro/Downloads/Archive01.zip",
  readable: fs.createReadStream("/Users/bro/Downloads/Archive01.zip"),
};
mpu(config);
