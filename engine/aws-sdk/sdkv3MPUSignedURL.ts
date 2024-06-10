import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as fs from "fs";
import axios from "axios";
import { MPUType } from "./types";

//test

async function mpuWithSignedUrlsAndHttp(config: MPUType) {
  const s3Client = new S3Client({
    region: "us-east-1",
  });
  const { bucket, key, filepath } = config;
  const fileSize = fs.statSync(filepath).size;
  const partSize = 1024 * 1024 * 5; // 5 MB; adjust as needed

  try {
    // Initiate multipart upload and get upload ID
    const createMultipartUploadCommand = new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
    });
    const createUploadUrl = await getSignedUrl(
      s3Client,
      createMultipartUploadCommand
    );
    const createResponse = await axios.post(createUploadUrl);
    const uploadId = createResponse.data.UploadId;

    // Prepare to upload parts
    const parts = [];
    for (let start = 0; start < fileSize; start += partSize) {
      const end = Math.min(start + partSize, fileSize);
      const partBuffer = fs.readFileSync(filepath, { start, end });
      parts.push(partBuffer);
    }

    const uploadedParts = [];

    for (let i = 0; i < parts.length; i++) {
      const uploadPartCommand = new UploadPartCommand({
        Bucket: bucket,
        Key: key,
        PartNumber: i + 1,
        UploadId: uploadId,
        Body: parts[i],
      });
      const uploadPartUrl = await getSignedUrl(s3Client, uploadPartCommand);
      const partResponse = await axios.put(uploadPartUrl, parts[i], {
        headers: {
          "Content-Length": parts[i].length,
        },
      });
      uploadedParts.push({
        PartNumber: i + 1,
        ETag: partResponse.headers.etag,
      });
    }

    // Complete multipart upload
    const completeMultipartUploadCommand = new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: uploadedParts,
      },
    });
    const completeUploadUrl = await getSignedUrl(
      s3Client,
      completeMultipartUploadCommand
    );
    await axios.post(completeUploadUrl, {
      MultipartUpload: { Parts: uploadedParts },
    });

    console.log("Upload completed successfully");
  } catch (e) {
    console.error("Upload failed:", e);
  }
}

const config = {
  bucket: "your-bucket-name",
  key: "your-object-key",
  file: fs.createReadStream("/path/to/your/file"),
};
mpuWithSignedUrlsAndHttp(config);

// import {
//   S3Client,
//   CreateMultipartUploadCommand,
//   UploadPartCommand,
//   CompleteMultipartUploadCommand,
// } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import * as fs from "fs";
// import { MPUType } from "./types";

// async function signedMPU(config: MPUType) {
//   const s3Client = new S3Client({ region: "us-east-1" });
//   const { bucket, key, file } = config;

//   try {
//     // Initiate multipart upload and get upload ID
//     const createMultipartUploadCommand = new CreateMultipartUploadCommand({
//       Bucket: bucket,
//       Key: key,
//     });
//     const createUploadUrl = await getSignedUrl(
//       s3Client,
//       createMultipartUploadCommand
//     );
//     // Use createUploadUrl to initiate the upload

//     // Assume parts are prepared and ready to upload
//     const parts = []; // This should be populated with actual parts of the file
//     const uploadedParts = [];

//     for (let i = 0; i < parts.length; i++) {
//       const uploadPartCommand = new UploadPartCommand({
//         Bucket: bucket,
//         Key: key,
//         PartNumber: i + 1,
//         UploadId: uploadId, // Retrieved from the initiation response
//         Body: parts[i],
//       });
//       const uploadPartUrl = await getSignedUrl(s3Client, uploadPartCommand);
//       // Use uploadPartUrl to upload the part
//       uploadedParts.push({
//         PartNumber: i + 1,
//         ETag: "etag", // This should be the ETag from the response
//       });
//     }

//     // Complete multipart upload
//     const completeMultipartUploadCommand = new CompleteMultipartUploadCommand({
//       Bucket: bucket,
//       Key: key,
//       UploadId: uploadId,
//       MultipartUpload: {
//         Parts: uploadedParts,
//       },
//     });
//     const completeUploadUrl = await getSignedUrl(
//       s3Client,
//       completeMultipartUploadCommand
//     );
//     // Use completeUploadUrl to complete the upload

//     console.log("Upload completed successfully");
//   } catch (e) {
//     console.error("Upload failed:", e);
//   }
// }

// const config = {
//   bucket: "your-bucket-name",
//   key: "your-object-key",
//   file: fs.createReadStream("/path/to/your/file"),
// };
// mpuWithSignedUrls(config);
