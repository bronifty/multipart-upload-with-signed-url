import express from "express";
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const app = express();
const port = 3000;

// AWS S3 client configuration
const s3Client = new S3Client({ region: "us-east-1" });

app.use(express.json());

// Endpoint to initiate multipart upload and get presigned URLs for each part
app.post("/get-presigned-urls", async (req, res) => {
  const { bucket, key, partCount } = req.body;

  try {
    // Start the multipart upload to get the upload ID
    const createMultipartUploadCommand = new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
    });
    const createMultipartUploadOutput = await s3Client.send(
      createMultipartUploadCommand
    );
    const uploadId = createMultipartUploadOutput.UploadId;

    // Generate presigned URLs for each part
    const urls = [];
    for (let partNumber = 1; partNumber <= partCount; partNumber++) {
      const uploadPartCommand = new UploadPartCommand({
        Bucket: bucket,
        Key: key,
        PartNumber: partNumber,
        UploadId: uploadId,
      });

      const url = await getSignedUrl(s3Client, uploadPartCommand, {
        expiresIn: 3600, // URL expiration time in seconds
      });
      urls.push({ partNumber, url });
    }

    res.json({ uploadId, urls });
  } catch (error) {
    console.error("Error generating presigned URLs:", error);
    res.status(500).send("Failed to generate presigned URLs");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
