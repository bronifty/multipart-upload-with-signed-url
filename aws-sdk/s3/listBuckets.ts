import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { createS3Client } from ".";

// Function to delete a bucket
async function listBuckets(profile: string): Promise<ListBucketsCommandOutput> {
  const s3Client = createS3Client(profile);
  const buckets = await s3Client.send(new ListBucketsCommand());
  return buckets;
}

export { listBuckets };
