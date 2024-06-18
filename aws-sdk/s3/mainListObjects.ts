import { listObjects } from ".";

async function mainListObjects(profile: string, bucketName: string) {
  const objects = await listObjects(profile, bucketName);
  console.log(objects);
}

mainListObjects("sst", "bronifty-sst").catch(console.error);
