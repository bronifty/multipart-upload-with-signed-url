import { listBuckets } from ".";

async function mainListBuckets(profile: string = "default"): Promise<void> {
  await listBuckets(profile);
}

// Usage example
mainListBuckets("sst").catch(console.error);
