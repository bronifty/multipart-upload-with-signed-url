import { createBucket, setBucketCors } from ".";
async function mainCreateAndSetBucketCors(profile = "default", bucketName) {
    await createBucket(profile, bucketName);
    await setBucketCors(profile, bucketName);
}
// Usage example
mainCreateAndSetBucketCors("sst", "bronifty-sst").catch(console.error);
