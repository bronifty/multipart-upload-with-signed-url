import { PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { createS3Client } from ".";
// Set the CORS configuration
const corsConfig = {
    CORSRules: [
        {
            AllowedHeaders: ["*"],
            AllowedMethods: ["GET", "PUT", "POST", "DELETE"],
            AllowedOrigins: ["*"],
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 3000,
        },
    ],
};
async function setBucketCors(profile, bucketName) {
    const s3 = createS3Client(profile);
    const putBucketCorsCommand = new PutBucketCorsCommand({
        Bucket: bucketName,
        CORSConfiguration: corsConfig,
    });
    try {
        const data = await s3.send(putBucketCorsCommand);
        console.log("Success", data);
    }
    catch (err) {
        console.error("Error", err);
    }
}
export { setBucketCors };
