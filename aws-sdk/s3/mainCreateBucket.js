import { createBucket } from ".";
async function mainCreateBucket(profile = "default", bucketName) {
    await createBucket(profile, bucketName);
}
// Usage example
mainCreateBucket("sst", "bronifty-sst").catch(console.error);
