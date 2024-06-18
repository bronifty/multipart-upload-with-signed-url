import { CreateBucketCommand } from "@aws-sdk/client-s3";
import { createS3Client } from ".";
// Function to delete a bucket
async function createBucket(profile, bucketName) {
    const s3Client = createS3Client(profile);
    await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket ${bucketName} created successfully.`);
}
export { createBucket };
