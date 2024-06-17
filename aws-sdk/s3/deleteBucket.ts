import { DeleteBucketCommand } from "@aws-sdk/client-s3";
import { createS3Client } from ".";

// Function to delete a bucket
async function deleteBucket(
  profile: string,
  bucketName: string
): Promise<void> {
  const s3Client = createS3Client(profile);
  await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }));
  console.log(`Bucket ${bucketName} deleted successfully.`);
}

export { deleteBucket };
