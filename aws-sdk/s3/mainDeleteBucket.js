import { deleteBucket } from ".";
async function mainDeleteBucket(profile = "default", bucketName) {
    await deleteBucket(profile, bucketName);
}
// Usage example
mainDeleteBucket("sst", "bronifty-sst").catch(console.error);
