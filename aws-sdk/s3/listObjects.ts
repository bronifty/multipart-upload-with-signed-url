import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { createS3Client } from ".";

async function listObjects(
  profile: string,
  bucketName: string
): Promise<ListObjectsV2CommandOutput> {
  const s3Client = createS3Client(profile);
  let objects = await s3Client.send(
    new ListObjectsV2Command({ Bucket: bucketName })
  );
  return objects;
}

export { listObjects };
