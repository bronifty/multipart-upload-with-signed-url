import fs from "node:fs/promises";
import { Transform } from "node:stream";
import express from "express";
import s3Package from "@aws-sdk/client-s3";
const {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  CompletedPart,
  ListBucketsCommand,
  ListObjectsCommand,
  GetObjectCommand,
} = s3Package;
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;
const base = process.env.BASE || "/";
const ABORT_DELAY = 10000;

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";
const ssrManifest = isProduction
  ? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
  : undefined;

// Create http server
const app = express();

app.get("/listBuckets", async (req, res) => {
  try {
    const command = new ListBucketsCommand({});
    const data = await s3Client.send(command);
    res.json(data.Buckets);
  } catch (error) {
    console.error("Error listing buckets:", error);
    res.status(500).send("Failed to list buckets");
  }
});

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

app.get("/downloadObject", async (req, res) => {
  const { bucket, key } = req.query;

  try {
    const getObjectParams = {
      Bucket: bucket,
      Key: key,
    };
    const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));
    res.attachment(key); // Sets the header to prompt downloads with the original file name.
    Body.pipe(res); // Streams the S3 object directly to the client.
  } catch (error) {
    console.error("Error downloading object:", error);
    res.status(500).send("Failed to download object");
  }
});

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

// Serve HTML
app.use("*", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
    } else {
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
    }

    let didError = false;

    const { pipe, abort } = render(url, ssrManifest, {
      onShellError() {
        res.status(500);
        res.set({ "Content-Type": "text/html" });
        res.send("<h1>Something went wrong</h1>");
      },
      onShellReady() {
        res.status(didError ? 500 : 200);
        res.set({ "Content-Type": "text/html" });

        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            res.write(chunk, encoding);
            callback();
          },
        });

        const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`);

        res.write(htmlStart);

        transformStream.on("finish", () => {
          res.end(htmlEnd);
        });

        pipe(transformStream);
      },
      onError(error) {
        didError = true;
        console.error(error);
      },
    });

    setTimeout(() => {
      abort();
    }, ABORT_DELAY);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
