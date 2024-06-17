// import {
//   S3Client,
//   ListObjectsV2Command,
//   DeleteObjectsCommand,
//   ListObjectVersionsCommand,
//   DeleteBucketCommand,
// } from "@aws-sdk/client-s3";
// import { fromIni } from "@aws-sdk/credential-provider-ini";

import { deleteBucket } from ".";
import { emptyBucket } from "./emptyBucket";

// Function to initialize S3 client with a specific profile
// function createS3Client(profile: string): S3Client {
//   return new S3Client({
//     credentials: fromIni({ profile }),
//   });
// }

// Function to delete all objects and versions in a bucket
// async function deleteAllObjectsInBucket(
//   profile: string,
//   bucketName: string
// ): Promise<void> {
//   const s3Client = createS3Client(profile);

//   async function deleteAll(items, isVersioned = false) {
//     const deleteParams = {
//       Bucket: bucketName,
//       Delete: {
//         Objects: items.map((item) => ({
//           Key: item.Key,
//           ...(isVersioned && { VersionId: item.VersionId }),
//         })),
//       },
//     };
//     await s3Client.send(new DeleteObjectsCommand(deleteParams));
//   }

//   let objects = await s3Client.send(
//     new ListObjectsV2Command({ Bucket: bucketName })
//   );
//   if (objects.Contents && objects.Contents.length > 0) {
//     await deleteAll(objects.Contents);
//   }

//   let versions = await s3Client.send(
//     new ListObjectVersionsCommand({ Bucket: bucketName })
//   );
//   if (versions.Versions && versions.Versions.length > 0) {
//     await deleteAll(versions.Versions, true);
//   }
//   if (versions.DeleteMarkers && versions.DeleteMarkers.length > 0) {
//     await deleteAll(versions.DeleteMarkers, true);
//   }
// }

// Function to delete a bucket
// async function deleteBucket(
//   profile: string,
//   bucketName: string
// ): Promise<void> {
//   const s3Client = createS3Client(profile);
//   await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }));
//   console.log(`Bucket ${bucketName} deleted successfully.`);
// }

// Composite function to delete all objects and then the bucket
async function mainEmptyAndDeleteBucket(
  profile: string = "default",
  bucketName: string
): Promise<void> {
  await emptyBucket(profile, bucketName);
  await deleteBucket(profile, bucketName);
}

// Usage example
mainEmptyAndDeleteBucket("sst", "bronifty-sst").catch(console.error);
