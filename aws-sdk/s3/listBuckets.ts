import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  ListObjectVersionsCommand,
  DeleteBucketCommand,
} from "@aws-sdk/client-s3";

import { fromIni } from "@aws-sdk/credential-provider-ini";

const profile = "sst";

// Initialize the S3 client with the specified profile
const s3Client = new S3Client({
  credentials: fromIni({ profile }),
});

async function emptyAndDeleteBucket(bucketName) {
  // Helper function to delete all objects or versions
  async function deleteAll(items, isVersioned = false) {
    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: items.map((item) => ({
          Key: item.Key,
          ...(isVersioned && { VersionId: item.VersionId }),
        })),
      },
    };
    await s3Client.send(new DeleteObjectsCommand(deleteParams));
  }

  // List and delete all objects
  let objects = await s3Client.send(
    new ListObjectsV2Command({ Bucket: bucketName })
  );
  if (objects.Contents.length > 0) {
    await deleteAll(objects.Contents);
  }

  // List and delete all object versions and delete markers
  let versions = await s3Client.send(
    new ListObjectVersionsCommand({ Bucket: bucketName })
  );
  if (versions.Versions.length > 0) {
    await deleteAll(versions.Versions, true);
  }
  if (versions.DeleteMarkers.length > 0) {
    await deleteAll(versions.DeleteMarkers, true);
  }

  // Delete the bucket
  await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }));
  console.log(`Bucket ${bucketName} deleted successfully.`);
}

// Usage
emptyAndDeleteBucket("bronifty-sst").catch(console.error);
