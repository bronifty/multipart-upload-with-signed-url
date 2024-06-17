import { createS3Client, deleteBucket } from ".";

async function mainDeleteBucket(
  profile: string = "default",
  bucketName: string
): Promise<void> {
  await deleteBucket(profile, bucketName);
}

// Usage example
mainDeleteBucket("sst", "bronifty-sst").catch(console.error);
