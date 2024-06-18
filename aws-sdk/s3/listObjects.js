import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { createS3Client } from ".";
async function listObjects(profile, bucketName) {
    const s3Client = createS3Client(profile);
    const { Contents } = await s3Client.send(new ListObjectsV2Command({ Bucket: bucketName }));
    return (Contents?.filter((file) => file.Key !== undefined).map((file) => ({
        Key: file.Key, // Type assertion here
    })) ?? []);
}
export { listObjects };
