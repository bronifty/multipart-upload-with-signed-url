const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
// AWS.config.update({
//   accessKeyId: "YOUR_ACCESS_KEY_ID",
//   secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
//   region: "us-east-1",
// });

const s3 = new AWS.S3();

function startMultipartUpload(bucket: string, key: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    s3.createMultipartUpload(params, (err: any, data: any) => {
      if (err) reject(err);
      else resolve(data.UploadId);
    });
  });
}

type PartUploadResponse = {
  ETag: string;
  PartNumber: number;
};

function uploadPart(
  bucket: string,
  key: string,
  partBuffer: Buffer,
  partNumber: number,
  uploadId: string
): Promise<PartUploadResponse> {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: key,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: partBuffer,
    };
    s3.uploadPart(params, (err: any, data: any) => {
      if (err) reject(err);
      else
        resolve({
          ETag: data.ETag,
          PartNumber: partNumber,
        });
    });
  });
}

function completeMultipartUpload(
  bucket: string,
  key: string,
  parts: any,
  uploadId: string
) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: key,
      MultipartUpload: {
        Parts: parts,
      },
      UploadId: uploadId,
    };
    s3.completeMultipartUpload(params, (err: any, data: any) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

async function uploadFile(filePath: string, bucket: string, key: string) {
  const fileSize = fs.statSync(filePath).size;
  const partSize = 5 * 1024 * 1024; // 5MB
  const numParts = Math.ceil(fileSize / partSize);

  const uploadId = await startMultipartUpload(bucket, key);
  const parts = [];

  for (let i = 0; i < numParts; i++) {
    const start = i * partSize;
    const end = Math.min(start + partSize, fileSize);
    const partBuffer = fs.readFileSync(filePath, {
      start: start,
      end: end - 1,
    });

    const partData = await uploadPart(bucket, key, partBuffer, i + 1, uploadId);
    parts.push(partData);
  }

  const result = await completeMultipartUpload(bucket, key, parts, uploadId);
  console.log("Upload complete:", result);
}

// Usage
uploadFile(
  "/Users/bro/Downloads/Archive.zip",
  "bronifty-sst",
  "/Users/bro/Downloads/Archive.zip"
);
