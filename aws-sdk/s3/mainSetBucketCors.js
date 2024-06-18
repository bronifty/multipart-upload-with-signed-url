import { setBucketCors } from ".";
async function mainSetBucketCors(profile = "default", bucketName) {
    await setBucketCors(profile, bucketName);
}
// Usage example
mainSetBucketCors("sst", "bronifty-sst").catch(console.error);
