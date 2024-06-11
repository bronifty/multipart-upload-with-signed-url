import express from "express";
import s3Package from "@aws-sdk/client-s3";
const {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  CompletedPart,
  ListObjectsCommand,
} = s3Package;
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const app = express();
const port = 3000;

// AWS S3 client configuration
const s3Client = new S3Client({ region: "us-east-1" });

// Serve static files from the 'public' directory
app.use(express.static("public"));

app.use(express.json());

// Endpoint to initiate multipart upload and get presigned URLs for each part
app.post("/getPresignedUrl", async (req, res) => {
  const { bucket, key, partCount } = req.body;

  try {
    const createMultipartUploadCommand = new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
    });
    const createMultipartUploadOutput = await s3Client.send(
      createMultipartUploadCommand
    );
    const uploadId = createMultipartUploadOutput.UploadId;

    const urls = [];
    for (let partNumber = 1; partNumber <= partCount; partNumber++) {
      const uploadPartCommand = new UploadPartCommand({
        Bucket: bucket,
        Key: key,
        PartNumber: partNumber,
        UploadId: uploadId,
      });

      const url = await getSignedUrl(s3Client, uploadPartCommand, {
        expiresIn: 3600,
      });
      urls.push({ partNumber, url });
    }

    res.json({ uploadId, urls });
  } catch (error) {
    console.error("Error generating presigned URLs:", error);
    res.status(500).send("Failed to generate presigned URLs");
  }
});

// Endpoint to complete multipart upload
app.post("/completeUpload", async (req, res) => {
  const { bucket, key, uploadId, parts } = req.body;

  try {
    const completedParts = parts.map((part) => ({
      ETag: part.ETag,
      PartNumber: part.PartNumber,
    }));

    const completeMultipartUploadCommand = new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: completedParts },
    });

    const completeMultipartUploadOutput = await s3Client.send(
      completeMultipartUploadCommand
    );
    res.json({
      message: "Upload completed successfully",
      data: completeMultipartUploadOutput,
    });
  } catch (error) {
    console.error("Error completing multipart upload:", error);
    res.status(500).send("Failed to complete multipart upload");
  }
});

app.get("/listObjects", async (req, res) => {
  const { bucket } = req.query;
  console.log("bucket", bucket);

  try {
    const data = await s3Client.send(
      new ListObjectsCommand({ Bucket: bucket })
    );
    res.json(data.Contents);
  } catch (error) {
    console.error("Error listing objects:", error);
    res.status(500).send("Failed to list objects");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
