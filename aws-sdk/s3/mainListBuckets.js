import { listBuckets } from ".";
async function mainListBuckets(profile = "default") {
    const buckets = await listBuckets(profile);
    if (!buckets)
        return;
    console.log(buckets);
    // console.log(`Buckets: ${buckets.map((bucket) => bucket.Name).join(", ")}`);
}
// Usage example
mainListBuckets("sst").catch(console.error);
