import { setBucketCors } from ".";

async function mainSetBucketCors(
  profile: string = "default",
  bucketName: string
): Promise<void> {
  await setBucketCors(profile, bucketName);
}

// Usage example
mainSetBucketCors("sst", "bronifty-sst").catch(console.error);
