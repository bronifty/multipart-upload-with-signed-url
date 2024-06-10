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

// Upload completed successfully: {
//   '$metadata': {
//     httpStatusCode: 200,
//     requestId: 'HMEH4A2FBY0JXAJ5',
//     extendedRequestId: 'q6MOsvxog4s+F1Cf+jckf7JbEFmFwHXbxfWDhXFLuS69BJZd1Je/BgRbAXE+G/RS1Rmq2/H1dZE=',
//     cfId: undefined,
//     attempts: 1,
//     totalRetryDelay: 0
//   },
//   ServerSideEncryption: 'AES256',
//   Bucket: 'bronifty-sst',
//   ETag: '"116c1995614bb64368067a945244cdf8-3"',
//   Key: 'Archive.zip',
//   Location: 'https://bronifty-sst.s3.us-east-1.amazonaws.com/Archive.zip'
// }
// Signed URLs for each part: [
//   'https://bronifty-sst.s3.us-east-1.amazonaws.com/Archive.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAXYKJQSSIAZBDVGWR%2F20240610%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240610T030752Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMiJIMEYCIQC8xckpD3s%2FG0GzM55x9eP60WKX5ebnNnM2jbzSlnvjcwIhAPxpAzK7Vqg%2FRB%2BleHu6cfGJf%2FugDi4w0dJEFtRqA%2BLJKuQCCDoQABoMNTMzMjY2OTk0MzIwIgwvKKUIack4Maw2aioqwQIKpRcEM3iSdcilK3OVgpMwANcWzRTxFRzHMHaBL5RMmKSFS19zg4AwYAX%2BMhgUfTHmt4aM%2BBZoEITO7eOqiwgVvA%2BpgUTwJ3mZ47CDNpuhFVBPmVdQfsIPspj4LCetckBJCDCTaKaGO1dT7u%2F1QgXBvRxb8TNAIlD%2Fnq7oEf8OQturR4Q%2FaPF%2ByFGnzjhUSKxRHqxxbC21ok15weodqyWiQY2JJK3vfXeu%2BwrWcYXRz8%2BvABZ0ABTLw2sHRaZnBuUP8yh3NrzgsrzTUN8XGUNxK7fj6g%2F2gYW%2B0onBWJCFJ7mu7cBSKK4Ylsg6kRR6oKeQGNYVq74%2F2LPbChKy8eZ1TgSwcgjiTVdoDpmj4v3ak5vcV4vq3fRLoeD1HEGIFfHiVqQym7bLUjTIiJ4Xqs3NKt27KnUSN2v4gnytUrQLq%2B4wpZGZswY6pgEfxym06RdfYs3IPMuBrFhEMizmeqsuywSySPJUdMOABs8gNdkszu%2FBq4Mr5xCJm9pKonQKeAb9WoaUhHWR5MPFRY9WRUdbZuqStNdMWBv6hnKmeaNIXmbu6bZ6BThntDNkhSaPnhZT7VuwMWo0UJ52Sf2MCfcPkpFjE2VXcr3cTiBX4BgCAhj0XKkn6p3VgUr78OHRg894CABw20BcTo%2BjRNDByrMI&X-Amz-Signature=f99f4059fc4ee7acb4a637de76f97e665ea03321f4a94b7bd8406104b042e217&X-Amz-SignedHeaders=content-length%3Bhost&partNumber=1&uploadId=VD1RQ2b_awg7YPmhgfEArHspo1ErhRxGjsJ2Iy2eghtOfmf_ZOGVYUrSZzm1UKrhP9RLDqTFE5YpO0kh82lJnE5Wbtqae8uJgVJWMXfJY8REVW..gUwRIqLX6ZaK77xD&x-id=UploadPart',
//   'https://bronifty-sst.s3.us-east-1.amazonaws.com/Archive.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAXYKJQSSIAZBDVGWR%2F20240610%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240610T030755Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMiJIMEYCIQC8xckpD3s%2FG0GzM55x9eP60WKX5ebnNnM2jbzSlnvjcwIhAPxpAzK7Vqg%2FRB%2BleHu6cfGJf%2FugDi4w0dJEFtRqA%2BLJKuQCCDoQABoMNTMzMjY2OTk0MzIwIgwvKKUIack4Maw2aioqwQIKpRcEM3iSdcilK3OVgpMwANcWzRTxFRzHMHaBL5RMmKSFS19zg4AwYAX%2BMhgUfTHmt4aM%2BBZoEITO7eOqiwgVvA%2BpgUTwJ3mZ47CDNpuhFVBPmVdQfsIPspj4LCetckBJCDCTaKaGO1dT7u%2F1QgXBvRxb8TNAIlD%2Fnq7oEf8OQturR4Q%2FaPF%2ByFGnzjhUSKxRHqxxbC21ok15weodqyWiQY2JJK3vfXeu%2BwrWcYXRz8%2BvABZ0ABTLw2sHRaZnBuUP8yh3NrzgsrzTUN8XGUNxK7fj6g%2F2gYW%2B0onBWJCFJ7mu7cBSKK4Ylsg6kRR6oKeQGNYVq74%2F2LPbChKy8eZ1TgSwcgjiTVdoDpmj4v3ak5vcV4vq3fRLoeD1HEGIFfHiVqQym7bLUjTIiJ4Xqs3NKt27KnUSN2v4gnytUrQLq%2B4wpZGZswY6pgEfxym06RdfYs3IPMuBrFhEMizmeqsuywSySPJUdMOABs8gNdkszu%2FBq4Mr5xCJm9pKonQKeAb9WoaUhHWR5MPFRY9WRUdbZuqStNdMWBv6hnKmeaNIXmbu6bZ6BThntDNkhSaPnhZT7VuwMWo0UJ52Sf2MCfcPkpFjE2VXcr3cTiBX4BgCAhj0XKkn6p3VgUr78OHRg894CABw20BcTo%2BjRNDByrMI&X-Amz-Signature=8820a3ec04f3b57622768aa2cbb653c70bc5fa00536a894d114fb23d0d1d1577&X-Amz-SignedHeaders=content-length%3Bhost&partNumber=2&uploadId=VD1RQ2b_awg7YPmhgfEArHspo1ErhRxGjsJ2Iy2eghtOfmf_ZOGVYUrSZzm1UKrhP9RLDqTFE5YpO0kh82lJnE5Wbtqae8uJgVJWMXfJY8REVW..gUwRIqLX6ZaK77xD&x-id=UploadPart',
//   'https://bronifty-sst.s3.us-east-1.amazonaws.com/Archive.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAXYKJQSSIAZBDVGWR%2F20240610%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240610T030756Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMiJIMEYCIQC8xckpD3s%2FG0GzM55x9eP60WKX5ebnNnM2jbzSlnvjcwIhAPxpAzK7Vqg%2FRB%2BleHu6cfGJf%2FugDi4w0dJEFtRqA%2BLJKuQCCDoQABoMNTMzMjY2OTk0MzIwIgwvKKUIack4Maw2aioqwQIKpRcEM3iSdcilK3OVgpMwANcWzRTxFRzHMHaBL5RMmKSFS19zg4AwYAX%2BMhgUfTHmt4aM%2BBZoEITO7eOqiwgVvA%2BpgUTwJ3mZ47CDNpuhFVBPmVdQfsIPspj4LCetckBJCDCTaKaGO1dT7u%2F1QgXBvRxb8TNAIlD%2Fnq7oEf8OQturR4Q%2FaPF%2ByFGnzjhUSKxRHqxxbC21ok15weodqyWiQY2JJK3vfXeu%2BwrWcYXRz8%2BvABZ0ABTLw2sHRaZnBuUP8yh3NrzgsrzTUN8XGUNxK7fj6g%2F2gYW%2B0onBWJCFJ7mu7cBSKK4Ylsg6kRR6oKeQGNYVq74%2F2LPbChKy8eZ1TgSwcgjiTVdoDpmj4v3ak5vcV4vq3fRLoeD1HEGIFfHiVqQym7bLUjTIiJ4Xqs3NKt27KnUSN2v4gnytUrQLq%2B4wpZGZswY6pgEfxym06RdfYs3IPMuBrFhEMizmeqsuywSySPJUdMOABs8gNdkszu%2FBq4Mr5xCJm9pKonQKeAb9WoaUhHWR5MPFRY9WRUdbZuqStNdMWBv6hnKmeaNIXmbu6bZ6BThntDNkhSaPnhZT7VuwMWo0UJ52Sf2MCfcPkpFjE2VXcr3cTiBX4BgCAhj0XKkn6p3VgUr78OHRg894CABw20BcTo%2BjRNDByrMI&X-Amz-Signature=721cee79c215901b6a26ab07795c937aa611eae6b903181b1c35bb61567370a7&X-Amz-SignedHeaders=content-length%3Bhost&partNumber=3&uploadId=VD1RQ2b_awg7YPmhgfEArHspo1ErhRxGjsJ2Iy2eghtOfmf_ZOGVYUrSZzm1UKrhP9RLDqTFE5YpO0kh82lJnE5Wbtqae8uJgVJWMXfJY8REVW..gUwRIqLX6ZaK77xD&x-id=UploadPart'
// ]
