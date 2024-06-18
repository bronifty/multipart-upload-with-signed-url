import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { createS3Client } from ".";

// Function to delete a bucket
async function listBuckets(profile: string): Promise<{ Name: string }[]> {
  const s3Client = createS3Client(profile);
  const { Buckets } = await s3Client.send(new ListBucketsCommand());
  return (
    Buckets?.filter((bucket) => bucket.Name !== undefined).map((bucket) => ({
      Name: bucket.Name as string, // Type assertion here
    })) ?? []
  );
}

export { listBuckets };
