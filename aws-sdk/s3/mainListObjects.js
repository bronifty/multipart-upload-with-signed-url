import { listObjects } from ".";
async function mainListObjects(profile, bucketName) {
    const objects = await listObjects(profile, bucketName);
    console.log(objects);
}
mainListObjects("sst", "bronifty-sst").catch(console.error);
