import { emptyBucket, deleteBucket } from ".";

// Composite function to delete all objects and then the bucket
async function mainEmptyAndDeleteBucket(
  profile: string = "default",
  bucketName: string
): Promise<void> {
  await emptyBucket(profile, bucketName);
  await deleteBucket(profile, bucketName);
}

// Usage example
mainEmptyAndDeleteBucket("default", "medium-s3-cloudfront-0e8100e00c51").catch(
  console.error
);
