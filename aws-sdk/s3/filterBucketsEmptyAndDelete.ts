import { listBuckets, emptyBucket, deleteBucket } from ".";

async function filterBucketsEmptyAndDelete(
  profile: string = "default"
): Promise<void> {
  const buckets = await listBuckets(profile);
  if (!buckets) return;

  const excludedNames = [
    "winglang.bronifty.xyz",
    "cdk-hnb659fds-assets-851725517932-us-east-1",
    "aws-sam-cli-managed-default-samclisourcebucket-cn52sgxeu5ot",
  ];
  for (const bucket of buckets) {
    if (!excludedNames.some((name) => bucket.Name.includes(name))) {
      console.log(bucket.Name);
      await emptyBucket(profile, bucket.Name);
      await deleteBucket(profile, bucket.Name);
    }
  }
}

filterBucketsEmptyAndDelete("default").catch(console.error);
