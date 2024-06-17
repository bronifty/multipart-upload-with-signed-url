import {
  ListObjectsV2Command,
  DeleteObjectsCommand,
  ListObjectVersionsCommand,
} from "@aws-sdk/client-s3";
import { createS3Client } from ".";

// Function to delete all objects and versions in a bucket
async function emptyBucket(profile: string, bucketName: string): Promise<void> {
  const s3Client = createS3Client(profile);

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

  let objects = await s3Client.send(
    new ListObjectsV2Command({ Bucket: bucketName })
  );
  if (objects.Contents && objects.Contents.length > 0) {
    await deleteAll(objects.Contents);
  }

  let versions = await s3Client.send(
    new ListObjectVersionsCommand({ Bucket: bucketName })
  );
  if (versions.Versions && versions.Versions.length > 0) {
    await deleteAll(versions.Versions, true);
  }
  if (versions.DeleteMarkers && versions.DeleteMarkers.length > 0) {
    await deleteAll(versions.DeleteMarkers, true);
  }
}

export { emptyBucket };
