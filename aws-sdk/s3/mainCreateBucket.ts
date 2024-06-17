import { createS3Client, createBucket } from ".";

async function mainCreateBucket(
  profile: string = "default",
  bucketName: string
): Promise<void> {
  await createBucket(profile, bucketName);
}

// Usage example
mainCreateBucket("sst", "bronifty-sst").catch(console.error);
