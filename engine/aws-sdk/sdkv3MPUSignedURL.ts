import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  CompletedPart,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as fs from "fs";
import { MPUType } from "./types";

async function multipartUploadExample(config: MPUType) {
  const s3Client = new S3Client({ region: "us-east-1" });
  const { bucket, key, filepath } = config;
  const partSize = 5 * 1024 * 1024; // 5 MB
  const fileStream = fs.createReadStream(filepath, { highWaterMark: partSize });

  try {
    // Step 1: Start the multipart upload and get the upload ID
    const createMultipartUploadCommand = new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
    });
    const createMultipartUploadOutput = await s3Client.send(
      createMultipartUploadCommand
    );
    const uploadId = createMultipartUploadOutput.UploadId;

    // Step 2: Upload parts and generate signed URLs
    let partNumber = 1;
    const uploadedParts: CompletedPart[] = [];
    const signedUrls: string[] = [];
    for await (const partData of fileStream) {
      const uploadPartCommand = new UploadPartCommand({
        Bucket: bucket,
        Key: key,
        PartNumber: partNumber,
        UploadId: uploadId,
        Body: partData,
      });
      const uploadPartOutput = await s3Client.send(uploadPartCommand);
      uploadedParts.push({
        PartNumber: partNumber,
        ETag: uploadPartOutput.ETag,
      });

      // Generate signed URL for the uploaded part
      const signedUrl = await getSignedUrl(s3Client, uploadPartCommand, {
        expiresIn: 3600,
      });
      signedUrls.push(signedUrl);

      partNumber++;
    }

    // Step 3: Complete the multipart upload
    const completeMultipartUploadCommand = new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: uploadedParts,
      },
    });
    const completeMultipartUploadOutput = await s3Client.send(
      completeMultipartUploadCommand
    );

    console.log(
      "Upload completed successfully:",
      completeMultipartUploadOutput
    );
    console.log("Signed URLs for each part:", signedUrls);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

const config = {
  profile: "sst",
  bucket: "bronifty-sst",
  key: "Archive.zip",
  filepath: "/Users/bro/Downloads/Archive.zip",
  readable: fs.createReadStream("/Users/bro/Downloads/Archive.zip"),
};
multipartUploadExample(config);
