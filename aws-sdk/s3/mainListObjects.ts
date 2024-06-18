import { listObjects } from ".";

async function mainListObjects(profile: string, bucketName: string) {
  const objects = await listObjects(profile, bucketName);
  console.log(objects);
}

mainListObjects("sst", "bronifty-sst").catch(console.error);

// Contents: [
//     {
//       Key: 'Archive.zip',
//       LastModified: 2024-06-18T00:50:34.000Z,
//       ETag: '"116c1995614bb64368067a945244cdf8-3"',
//       Size: 11551578,
//       StorageClass: 'STANDARD'
//     }
//   ]
